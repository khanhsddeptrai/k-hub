import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { verifyToken } from '@k-hub/shared';

export function checkPermission(permissionName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new Error("Missing or invalid Authorization header")
            }

            const token = authHeader.split(" ")[1];

            // ✅ Decode token để lấy userId
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!) as any;
            const userId = decoded.id;
            if (!userId) {
                throw new Error("Invalid token payload")
            }

            // ✅ Gọi auth-service để kiểm tra quyền
            const response = await axios.post('http://localhost:8080/api/auth/authorize', {
                userId,
                permissionName,
            });

            if (!response.data.allowed) {
                throw new Error("Permission denied")
            }

            next();
        } catch (error: any) {
            console.error("Permission check failed:", error.message);
            throw new Error("Error checking permission: " + error.message);
        }
    };
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const accessToken = req.headers.authorization;
    if (!accessToken || !accessToken.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid accessToken" });
        return
    }
    try {
        const token = accessToken.split(" ")[1];
        const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET_SIGNATURE!)
        if (!decoded.id) {
            res.status(401).json({
                message: "Invalid token payload"
            })
            return
        }
        next();
    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(401).json({ error: "Invalid token" });
        return
    }
}
