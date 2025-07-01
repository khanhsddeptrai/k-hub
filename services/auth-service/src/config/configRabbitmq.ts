import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const conn = await amqp.connect(process.env.MESSAGE_BROKER_URL!)
    channel = await conn.createChannel();
    await channel.assertExchange('user', 'topic', { durable: true });
    return channel;
}

export const getChannel = () => channel;