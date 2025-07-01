import mongoose, { Schema, model } from 'mongoose';

const UserProfileSchema = new Schema({
    name: { type: String, },
    phone: { type: String, },
    address: { type: String },
    avatar: { type: String },
    dateOfBirth: { type: String },
}, {
    timestamps: true
})

export default mongoose.model('UserProfile', UserProfileSchema); 