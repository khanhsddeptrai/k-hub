import { Request, Response } from 'express';
import { register, login, AssignPermission, AssignRole } from '../services/authService';
import { Types } from 'mongoose';
import AuthUser from '../models/userModel';

export interface UserType {
    _id?: Types.ObjectId;
    email: string;
    password?: string;
    confirmPassword?: string;
    role?: string[];
    accessToken?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const getAuthInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await AuthUser.find().select('email').populate('roles', 'name')
        res.status(200).json({
            message: "get auth info successfully!",
            data: users
        });
    } catch (error: any) {
        throw new Error(`Failed to get auth info: ${(error as Error).message}`);
    }
}

export async function registerUser(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!password || !email || !confirmPassword) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const user = await register(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function loginUser(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const user = await login(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function assignPermissionToRole(req: Request<{ roleId: string }, {}, { permissionIds: string[] }>, res: Response)
    : Promise<void> {
    try {
        const { permissionIds } = req.body;
        const { roleId } = req.params;
        if (!permissionIds || !roleId) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const user = await AssignPermission(roleId, permissionIds);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error assigning permission to role', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function assignRoleToUser(req: Request<{ userId: string }, {}, { roleIds: string[] }>, res: Response)
    : Promise<void> {
    try {
        const { roleIds } = req.body;
        const { userId } = req.params;
        if (!roleIds || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const user = await AssignRole(userId, roleIds);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error assigning role to user', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function authorizeUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId, permissionName } = req.body;

        const user = await AuthUser.findById(userId).populate({
            path: 'roles',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        });

        if (!user) {
            res.status(404).json({ allowed: false, message: 'User not found' });
            return
        }

        const userPermissionIds = user.roles.flatMap((role: any) =>
            role.permissions.map((perm: any) => String(perm.name))
        );

        const allowed = userPermissionIds.includes(permissionName);

        res.status(200).json({ allowed });
        return
    } catch (err) {
        console.error('[authorizeUser]', err);
        res.status(500).json({ allowed: false, message: 'Internal server error' });
        return
    }
}


