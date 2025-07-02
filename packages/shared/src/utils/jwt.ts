import JWT, { Secret } from 'jsonwebtoken';
import { PayloadType } from '../types/jwtType';

export function verifyToken(token: string, secretSignature: Secret) {
    try {
        const decoded = JWT.verify(token, secretSignature) as PayloadType;
        return decoded
    } catch (error) {
        throw error;
    }
}

