const amqp = require('amqplib');

(async () => {
    const queue = 'tasks';
    const exchange = 'task_exchange';
    const connection = await amqp.connect('amqp://localhost');
    const send_channel = await connection.createChannel();
    await send_channel.assertQueue(queue);
    await send_channel.assertExchange(exchange, 'direct', {
	durable: false
    });

    setInterval(() => {
	send_channel.publish(exchange, 'i18n', Buffer.from('from MAVS'));
	console.log('sent');
	/*
	send_channel.sendToQueue(
	    queue,
	    Buffer.from('translate me')
	);
	*/
    }, 1000);
})();
