const amqp = require('amqplib');

(async () => {
    const exchange = 'libretranslate';
    //const queue = 'libretranslate';
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'direct', {
	autoDelete: true,
	durable: true
    });

    const q = await channel.assertQueue('requests');
    channel.bindQueue(q.queue, exchange, 'request');

    channel.consume(q.queue, (message) => {
	console.log('Received:', message.content.toString());
	channel.ack(message);
	const translation = message.content.toString().toUpperCase();
	const reply_queue = message.properties.replyTo;
	const message_id = message.properties.messageId;
	
	channel.publish(
	    exchange,
	    reply_queue,
	    Buffer.from(translation),
	    {
		messageId: message_id
	    }
	);
	
	/*
	if(message !== null){
	    console.log('Received:', message.content.toString());
	    consume_channel.ack(message);
	}else{
	    console.log('Consumer cancelled by server');
	}
	*/
    });
})();
