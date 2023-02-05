const amqp = require('amqplib');

const fetch_libretranslate = async(raw_args) => {
    const args = {
        ...raw_args,
        ...{
            source_lang: 'en',
            format: 'text'
        }
    };

    //json schema validation function code

    const response = await fetch(process.env.LIBRETRANSLATE_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            q: args.message,
            source: args.source_lang,
            target: args.target_lang,
            format: args.format,
            api_key: args.api_key
        }),
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    if(data["error"]) throw new Error(data.error);
    
    return data["translatedText"];
  
};

(async () => {

    const exchange = 'libretranslate';
    const connection = await amqp.connect(process.env.RABBITMQ_ENDPOINT);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'direct', {
		autoDelete: true,
		durable: true
    });

    const q = await channel.assertQueue('requests');
    channel.bindQueue(q.queue, exchange, 'request');

    channel.consume(q.queue, async(message) => {
		
		channel.ack(message);

		let translatedMessage, statusCode = 200;

		try{
			translatedMessage = await fetch_libretranslate(
				message.content.toString(),
				message.properties.headers.sourceLanguage,
				message.properties.headers.targetLanguage,
			);
		}
		catch(error){
			statusCode = 400;
			translatedMessage = error.message
			console.error(error.message)
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
