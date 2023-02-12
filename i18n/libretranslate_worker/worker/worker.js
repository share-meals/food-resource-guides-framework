const amqp = require('amqplib');
const Validator = require('jsonschema').Validator;
const schemaValidator = new Validator();
const workerSchema = require('./worker_schema.json');


const fetch_libretranslate = async(args) => {
   
    // const response = await fetch(process.env.LIBRETRANSLATE_ENDPOINT, {
    const response = await fetch('http://localhost:5000/translate', {
        method: "POST",
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    if(data["error"]) throw new Error(data.error);
    
    return data.translatedText;
  
};

(async () => {
    console.log("Running...")
    const exchange = 'libretranslate';
    // const connection = await amqp.connect(process.env.RABBITMQ_ENDPOINT);
    const connection = await amqp.connect('amqp://mq:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'direct', {
		autoDelete: true,
		durable: true
    });

    const q = await channel.assertQueue('requests');
    channel.bindQueue(q.queue, exchange, 'request');

    channel.consume(q.queue, async(message) => {
        console.log(JSON.stringify(message))
		channel.ack(message);

		let translatedMessage, statusCode = 200;

        const args = {
            q: message.content.toString(),
            source: message.properties.headers.source || "en",
            target: message.properties.headers.target,
            format: message.properties.headers.format || "text",
            api_key: message.properties.headers.apiKey,
        };
    

        //json schema validation function code
        const validationResult = schemaValidator.validate(args, workerSchema)

        if(validationResult.errors.length > 0){
            translatedMessage = validationResult.errors.reduce(
                (payload, error) => [...payload, error.stack],
                []
            ).join('\n');
            statusCode = 400;
        }else{
            try{
                translatedMessage = await fetch_libretranslate(args);
            }
            catch(error){
                statusCode = 400;
                translatedMessage = error.message
                console.error(error.message)
            }
        }
		
		const reply_queue = message.properties.replyTo;
		const message_id = message.properties.messageId;
		
		channel.publish(
			exchange,
			reply_queue,
			Buffer.from(translatedMessage),
			{
				messageId: message_id,
				headers:{
					statusCode
				}
			}
		);
	
    });
})();
