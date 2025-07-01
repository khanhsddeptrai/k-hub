import bcrypt from 'bcrypt';

// Hàm hash password
export function hashPassword(password: string) {
    try {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error(`Failed to hash password: ${(error as Error).message}`);
    }
}

// Hàm so sánh password (dùng cho đăng nhập)
export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`Failed to compare password: ${(error as Error).message}`);
    }
}