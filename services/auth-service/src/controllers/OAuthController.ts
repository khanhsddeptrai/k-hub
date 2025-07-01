import { Request, Response } from "express";
import axios from "axios";
import { generateToken } from "../utils/jwt";
import AuthUser from '../models/userModel';
import roleModel from "../models/roleModel";

export async function getGoogleToken(req: Request, res: Response): Promise<void> {
    try {
        const { code, redirect_uri } = req.body;
        if (!code || !redirect_uri) {
            res.status(400).json({ message: 'Missing code or redirect_uri' });
            return;
        }

        const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri,
            grant_type: 'authorization_code',
        };

        const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        res.json(data);
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function loginWithGoogle(req: Request, res: Response): Promise<void> {
    try {
        const { email, googleId, name, picture } = req.body;

        if (!email || !googleId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const existingUser = await AuthUser.findOne({ email });
        let payload;
        let manual_accesstoken;

        if (existingUser) {
            if (existingUser.provider === 'google') {
                payload = {
                    email: existingUser.email,
                    id: existingUser._id.toString(),
                    roles: existingUser.roles,
                };
                manual_accesstoken = await generateToken(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
                    "1h"
                );
            } else {
                res.status(409).json({ message: 'Email already exists with local login. Please use email/password.' });
                return;
            }
        } else {
            const defaultRole = await roleModel.findOne({ name: 'user' });
            const newUser = await AuthUser.create({
                email,
                provider: "google",
                roles: [defaultRole?._id],
            });

            await axios.post(`http://localhost:8082/api/user/profile/create`, {
                _id: newUser._id,
                name,
                avatar: picture,
            });

            payload = {
                email,
                id: newUser._id.toString(),
                roles: newUser.roles,
            };
            manual_accesstoken = await generateToken(
                payload,
                process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
                "1h"
            );
        }

        res.status(existingUser ? 200 : 201).json({
            message: "Login successful!",
            data: {
                accessToken: manual_accesstoken,
                payload,
            },
        });
    } catch (error) {
        console.error('Error logging in with Google:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function getFacebookToken(req: Request, res: Response): Promise<void> {
    try {
        const { code, redirect_uri } = req.body;
        if (!code || !redirect_uri) {
            res.status(400).json({ message: 'Missing code or redirect_uri' });
            return;
        }

        const { data } = await axios.get(
            'https://graph.facebook.com/v18.0/oauth/access_token',
            {
                params: {
                    client_id: process.env.FACEBOOK_CLIENT_ID,
                    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                    redirect_uri,
                    code,
                },
            }
        );

        res.json(data);
    } catch (error) {
        console.error('Error exchanging Facebook code for token:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function loginWithFacebook(req: Request, res: Response): Promise<void> {
    try {
        const { email, facebookId, name, picture } = req.body;

        if (!email || !facebookId) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const existingUser = await AuthUser.findOne({ email });
        let payload;
        let manual_accesstoken;

        if (existingUser) {
            if (existingUser.provider === 'facebook') {
                payload = {
                    email: existingUser.email,
                    id: existingUser._id.toString(),
                    roles: existingUser.roles,
                };
                manual_accesstoken = await generateToken(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
                    "1h"
                );
            } else {
                res.status(409).json({ message: 'Email already exists with another login method.' });
                return;
            }
        } else {
            const defaultRole = await roleModel.findOne({ name: 'user' });
            const newUser = await AuthUser.create({
                email,
                provider: "facebook",
                roles: [defaultRole?._id],
            });

            await axios.post(`http://localhost:8082/api/user/profile/create`, {
                _id: newUser._id,
                name,
                avatar: picture,
            });

            payload = {
                email,
                id: newUser._id.toString(),
                roles: newUser.roles,
            };
            manual_accesstoken = await generateToken(
                payload,
                process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
                "1h"
            );
        }

        res.status(existingUser ? 200 : 201).json({
            message: "Facebook login successful!",
            data: {
                accessToken: manual_accesstoken,
                payload,
            },
        });
    } catch (error) {
        console.error('Error logging in with Facebook:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}
