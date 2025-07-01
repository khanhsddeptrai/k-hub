import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { createUserProfile, getUserProfileById, updateUserProfile } from '../services/userService';
import userModel from '../models/userModel';

export interface UserType {
    _id?: Types.ObjectId;
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: String | null;
    avatar?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function createUser(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
    try {
        const user = await createUserProfile(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function updateUser(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
    try {
        const user = await updateUserProfile(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId
        const result = await getUserProfileById(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}

export const getAllProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userProfiles = await userModel.find().select('name phone address avatar');
        res.status(200).json({
            data: userProfiles,
            message: "Get all user profiles successfully!"
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}