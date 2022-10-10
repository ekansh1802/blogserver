import mongoose from 'mongoose';

//Structure of each blog
const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    selectedFile: { type: String, required: true },
    category: { type: String, required: false },
    createdAt: { 
        type: Date,
        default: new Date(),
    },
});

const blogMessage = mongoose.model('BLOG MESSAGE MODEL', blogSchema);

export default blogMessage;