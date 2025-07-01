import { UserType } from "../controllers/userController";
import { ServiceResponse } from "../utils/common";
import UserProfile from "../models/userModel";

export async function createUserProfile(userData: UserType): Promise<ServiceResponse<UserType>> {
    try {

        await UserProfile.create(userData);

        return {
            statusCode: 201,
            message: "User created successfully",
        };
    } catch (error: any) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
}

export async function updateUserProfile(userData: UserType): Promise<ServiceResponse<UserType>> {
    try {

        const updateData: UserType = {
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
            dateOfBirth: userData.dateOfBirth,
            avatar: userData.avatar,
        }

        const userId = userData._id;

        await UserProfile.updateOne(
            { _id: userId },
            { $set: updateData },
        );

        return {
            statusCode: 200,
            message: "User updated successfully",
        };
    } catch (error: any) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
}

export async function getUserProfileById(userId: string): Promise<ServiceResponse<any>> {
    try {

        if (!userId) {
            throw new Error("User ID is required");

        }

        const user = await UserProfile.findById(userId)

        return {
            statusCode: 200,
            message: "Get user profile successfully!",
            data: user
        };
    } catch (error: any) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
}