const amqp = require('amqplib');

(async () => {
    const queue = 'tasks';
    const exchange = 'task_exchange';
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    await channel.assertExchange(exchange, 'direct', {
	durable: false
    });
    

    channel.consume(queue, (message) => {
	console.log(message);
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
