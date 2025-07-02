import JWT, { Secret, SignOptions } from 'jsonwebtoken';
import { PayloadType } from '@k-hub/shared';

export function generateToken(payload: PayloadType, secretSignature: Secret, tokenLife: string)
    : Promise<string> {
    try {
        const token = JWT.sign(payload, secretSignature, {
            algorithm: 'HS256',
            expiresIn: tokenLife
        } as SignOptions)
        return Promise.resolve(token);
    } catch (error) {
        return Promise.reject(error);
    }
}
