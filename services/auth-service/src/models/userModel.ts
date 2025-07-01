import mongoose, { Schema } from 'mongoose';
import validator from 'validator'

const AuthUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function (this: any) {
            return this.provider === 'local';
        }
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
}, {
    timestamps: true
})

export default mongoose.model('AuthUser', AuthUserSchema); 