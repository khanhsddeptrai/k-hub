import { mongo } from 'mongoose';

export interface PayloadType {
    id: string;
    email: string;
    roles?: mongo.ObjectId[];
}