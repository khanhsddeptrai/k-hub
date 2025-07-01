import { Request, Response } from 'express';
import { Types } from 'mongoose';
import postModel from '../models/postModel';

export interface PostType {
    _id?: Types.ObjectId;
    authorId?: string | null;
    conent?: string | null;
    media?: string[] | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function createUser(req: Request<{}, {}, PostType>, res: Response): Promise<void> {
    try {
        const newPost = await postModel.create(req.body);
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}



