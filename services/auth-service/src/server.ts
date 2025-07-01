import express from 'express';
import authRoute from './routes/authRoute'
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB';
import cors from 'cors';
import { connectRabbitMQ } from './config/configRabbitmq';
dotenv.config();
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    })
);

app.use(express.json());
app.use('/api/auth', authRoute);



const port = process.env.PORT || 8081
connectDB()
app.listen(port, () => {
    console.log(`auth-service is running on port ${port}`);
});
// const start = async () => {
//     connectDB()
//     await connectRabbitMQ();
//     app.listen(port, () => {
//         console.log(`auth-service is running on port ${port}`);
//     });
// };
// start();


export default app;