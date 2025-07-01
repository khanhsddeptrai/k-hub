import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Kiểm tra MONGO_URI
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.info(`Connecting to database: ${mongoURI.replace(/\/\/.*@/, '//<hidden>@')}`);

        // Kết nối MongoDB
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Thời gian chờ chọn server
            maxPoolSize: 10, // Giới hạn số kết nối
            socketTimeoutMS: 45000, // Thời gian chờ socket
        });

        console.info('MongoDB connected successfully');
    } catch (error: any) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
    }
};