import AuthUser from "../models/userModel";
import { comparePassword, hashPassword } from "../utils/password";
import { UserType } from "../controllers/authController";
import { ServiceResponse } from "../types/common";
import { generateToken } from "../utils/jwt";
import { publishUserCreated } from "../messaging/publishUserCreated";
import PermissionModel from "../models/permissionModel";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import RoleModel from "../models/roleModel";
import { PayloadType } from "@k-hub/shared";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    payload: PayloadType
}

export async function register(userData: UserType): Promise<ServiceResponse<UserType>> {
    try {
        const { email, password, confirmPassword } = userData
        const existingUser = await AuthUser.findOne({ email });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const hashedPassword = await hashPassword(password!);

        const user = await AuthUser.create({ email, password: hashedPassword });

        const newUser: UserType = {
            _id: user._id,
            email: user.email,
            // role: user.role,
        }

        // Publish user created event
        await publishUserCreated({
            _id: newUser._id?.toString()!,
            email: newUser.email,
            // role: user.role
        });

        return {
            statusCode: 201,
            message: "User registed successfully!",
            data: newUser
        };
    } catch (error: any) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
}

export async function login(userData: UserType): Promise<ServiceResponse<LoginResponse>> {
    try {
        const { email, password } = userData

        const existingUser = await AuthUser.findOne({ email });
        if (!existingUser) {
            throw new Error('Email or password is incorrect');
        }

        const isMatchPasword = await comparePassword(password!, existingUser.password!);

        if (!isMatchPasword) {
            throw new Error('Email or password is incorrect');
        }

        const payload = {
            id: existingUser.id,
            email: existingUser.email,
            roles: existingUser.roles
        }

        const accessToken = await generateToken(
            payload,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
            "1h"
        )
        const refreshToken = await generateToken(
            payload,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
            "7 days"
        )

        return {
            statusCode: 200,
            message: "Login successfully",
            data: {
                accessToken,
                refreshToken,
                payload
            }
        };
    } catch (error: any) {
        throw new Error(`Failed to login user: ${(error as Error).message}`);
    }
}

export async function AssignPermission(roleId: string, permissionIds: string[]): Promise<ServiceResponse<LoginResponse>> {
    try {
        const existRole = await RoleModel.findById(roleId);
        if (!existRole) {
            throw new Error('Role not found');
        }
        const existPermissions = await PermissionModel.find({ _id: { $in: permissionIds } });

        if (existPermissions.length !== permissionIds.length) {
            throw new Error('Some permissionIds are invalid');
        }

        existRole.permissions = permissionIds.map(id => new mongoose.Types.ObjectId(id));
        await existRole.save();

        return {
            statusCode: 201,
            message: "Permissions assigned successfully"
        };
    } catch (error: any) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
}

export async function AssignRole(userId: string, roleIds: string[]): Promise<ServiceResponse<LoginResponse>> {
    try {
        const existUser = await userModel.findById(userId);
        if (!existUser) {
            throw new Error('User not found');
        }
        const existRoles = await RoleModel.find({ _id: { $in: roleIds } });

        if (existRoles.length !== roleIds.length) {
            throw new Error('Some permissionIds are invalid');
        }

        existUser.roles = roleIds.map(id => new mongoose.Types.ObjectId(id));
        await existUser.save();

        return {
            statusCode: 201,
            message: "Roles assigned successfully"
        };
    } catch (error: any) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
}