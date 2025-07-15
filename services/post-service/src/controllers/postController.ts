import { Request, Response } from 'express';
import { Types } from 'mongoose';
import postModel from '../models/postModel';
import cloudinary from '../config/cloudinary';
import axios from 'axios';

export interface PostType {
    _id?: Types.ObjectId;
    authorId?: string | null;
    content?: string | null;
    media?: string[] | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Author {
    _id: string;
    name: string;
    avatar?: string;
}

export async function createPost(req: Request<{}, {}, PostType>, res: Response): Promise<void> {
    try {
        const files = req.files as Express.Multer.File[];
        const uploadedMedia: string[] = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "post"
                })
                uploadedMedia.push(result.secure_url);
            }
        }

        const newPost = await postModel.create({
            authorId: req.body.authorId,
            content: req.body.content,
            media: uploadedMedia
        });

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function getAllPostByUser(req: Request, res: Response): Promise<void> {
    try {
        const posts = await postModel
            .find()
            .sort({ createdAt: -1 });
        const authorIds = [...new Set(posts.map(post => post.authorId))];
        const authorInfo = await axios.get(`http://localhost:8082/api/user/profile-post`, {
            params: {
                ids: authorIds.join('-')
            }
        });
        const users: Author[] = authorInfo.data.data;

        const userMap = new Map(users.map(user => [user._id, user]));

        const feed = posts.map(post => ({
            _id: post._id,
            content: post.content,
            media: post.media,
            createdAt: post.createdAt,
            author: userMap.get(post.authorId.toString()) || null
        }));

        res.status(200).json({
            message: 'Get posts successfully',
            data: feed
        });
    } catch (error) {
        console.error('Error get all post:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}


