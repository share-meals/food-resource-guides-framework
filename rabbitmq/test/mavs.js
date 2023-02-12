const amqp = require('amqplib');
const prompt = require('prompt-sync')();

(async () => {

    const reply_queue = 'mavs';
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'libretranslate';
    const severity = 'request';
    const message_id = Math.random().toString();
    console.log(`message id: ${message_id}`);
    
    await channel.assertExchange(exchange, 'direct', {
        autoDelete: true,
        durable: true
    });

    const q = await channel.assertQueue(reply_queue);
    channel.bindQueue(q.queue, exchange, 'mavs');

    channel.consume(q.queue, (message) => {
        channel.ack(message);
        const response_id = message.properties.messageId;
        const status = message.properties.headers.statusCode;
        // console.log("message: ", message.content.toString())
        status == 400 ? console.log(`Error: ${message.content.toString()}`) : 
                 console.log(`for message #${response_id}, translation is ${message.content.toString()}`);
    });
    
    
    const input = prompt('Message to translate: ');
    const source = prompt('Source language of message: ');
    const target = prompt('Language to translate to: ');

    //provide documentation for rabbit mq messaging format
    
    channel.publish(
        exchange,
        severity,
        Buffer.from(input),
        {
            replyTo: reply_queue,
            messageId: message_id,
            headers: {
                source,
                target
            }
        },
    );

})();
