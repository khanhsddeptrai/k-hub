import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
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

interface Author {
    _id: string;
    name: string;
    avatar?: string;
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

export const getUserByIds = async (req: Request<{}, {}, {}, { ids: string }>, res: Response): Promise<void> => {
    try {
        // Lấy userIds từ query params
        const { ids } = req.query;
        if (!ids || typeof ids !== 'string') {
            res.status(400).json({ error: 'Tham số ids là bắt buộc và phải là chuỗi' });
            return;
        }

        // Chuyển chuỗi ids thành mảng
        const userIds = ids.split('-').filter(id => id.trim());
        if (userIds.length === 0) {
            res.status(400).json({ error: 'ids phải là một mảng không rỗng' });
            return;
        }

        // Kiểm tra ID hợp lệ
        const validIds = userIds.filter(id => mongoose.isValidObjectId(id));
        if (validIds.length === 0) {
            res.status(400).json({ error: 'Không có ObjectId hợp lệ nào được cung cấp' });
            return;
        }

        // Giới hạn số lượng ID (ví dụ: tối đa 100)
        const MAX_IDS = 100;
        if (validIds.length > MAX_IDS) {
            res.status(400).json({ error: `ids vượt quá giới hạn tối đa ${MAX_IDS}` });
            return;
        }

        // Lấy người dùng từ MongoDB
        const dbUsers = await userModel
            .find({ _id: { $in: validIds } })
            .select('_id name avatar')
            .lean();

        // Chuyển đổi _id từ ObjectId sang string để khớp với Author
        const usersFromDb: Author[] = dbUsers.map(user => ({
            _id: user._id.toString(),
            name: user.name || '',
            avatar: user.avatar || '',
        }));

        // Tạo map để đảm bảo thứ tự theo validIds
        const userMap = new Map(usersFromDb.map(user => [user._id, user]));
        const result = validIds
            .map(id => userMap.get(id) || null)
            .filter((user): user is Author => user !== null);

        res.status(200).json({
            message: 'Lấy thông tin người dùng thành công',
            data: result,
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ error: (error as Error).message || 'Lỗi server nội bộ' });
    }
};