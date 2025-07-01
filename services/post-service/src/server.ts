import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB';
import postRoute from './routes/postRoute'
import cors from 'cors';
import { connectRabbitMQ } from './config/configRabbitmq';
import { listenUserCreated } from './messaging/subscribeUserCreated';
dotenv.config();
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    })
);

// Fix Cache from disk from ExpressJS
// app.use((req, res, next) => {
//     res.set('Cache-Control', 'no-store')
//     next()
// })
app.use(express.json());
app.use('/api/post', postRoute);

const port = process.env.PORT || 8085
connectDB()
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

// const start = async () => {
//     connectDB()
//     await connectRabbitMQ();
//     await listenUserCreated();

//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`)
//     });
// };

// start();

export default app;