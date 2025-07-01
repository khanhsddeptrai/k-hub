import { getChannel } from "../config/configRabbitmq";
import UserProfile from "../models/userModel";

export const listenUserCreated = async () => {
    const channel = getChannel();

    const queue = 'user-service-user-created';
    const exchange = 'user';
    const routingKey = 'user.created';

    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString());
            console.log('📥 Nhận user.created:', payload);

            const { id } = payload;
            console.log(`🆔 User ID: ${id}`);

            // Tạo user profile (đơn giản)
            await UserProfile.create({
                _id: id,
                name: '',
                avatar: '',
                phone: '',
                address: '',
                dateOfBirth: null
            });
            channel.ack(msg);
        } catch (error) {
            console.error('❌ Lỗi khi xử lý user.created:', error);
            // Không ack để RabbitMQ giữ lại message
        }
    });

    console.log(`👂 Listening for 'user.created' on queue '${queue}'`);
};
