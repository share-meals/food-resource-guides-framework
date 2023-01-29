const amqp = require('amqplib');
const prompt = require('prompt-sync')();

(async () => {
    //const queue = 'libretranslate';
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
	console.log(`for message #${response_id}, translation is ${message.content.toString()}`);
    });
    
    
    const input = prompt('> ');

    channel.publish(
	exchange,
	severity,
	Buffer.from(input)
	,
	{
	    replyTo: reply_queue,
	    messageId: message_id
	}
    );

    /*
    setInterval(() => {
	send_channel.publish(exchange, 'i18n', Buffer.from('from MAVS'));
	console.log('sent');
	send_channel.sendToQueue(
	    queue,
	    Buffer.from('translate me')
	);
    }, 1000);
    */
})();
