import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const conn = await amqp.connect(process.env.MESSAGE_BROKER_URL!);
    channel = await conn.createChannel();

    // Tạo exchange nếu chưa có
    await channel.assertExchange('user', 'topic', { durable: true });

    return channel;
};

export const getChannel = () => {
    if (!channel) throw new Error('RabbitMQ channel chưa được khởi tạo.');
    return channel;
};
