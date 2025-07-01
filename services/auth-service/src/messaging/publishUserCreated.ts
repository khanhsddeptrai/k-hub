import { Types } from "mongoose";
import { getChannel } from "../config/configRabbitmq";

export const publishUserCreated = async (user: { _id: string, email: string }) => {
    const channel = getChannel();
    channel.publish(
        'user',
        'user.created',
        Buffer.from(JSON.stringify({
            id: user._id,
            email: user.email,
            // role: user.role
        }))
    );
};
