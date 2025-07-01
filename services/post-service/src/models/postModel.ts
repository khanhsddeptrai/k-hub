import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
    authorId: {
        type: String,
        required: true,
    },
    content: { type: String },
    media: { type: [String] }
}, {
    timestamps: true
})

export default mongoose.model('Post', PostSchema); 