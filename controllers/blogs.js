import mongoose from 'mongoose';
import blogMessage from '../models/blogMessage.js';

export const getBlogs = async (req, res) => {
    try{
        const blogs = await blogMessage.find();
        res.status(200).json(blogs);
    } 
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred '});
    }
}

export const getBlog = async (req, res) => {
    const { id: _id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            res.status(404).json({ message: 'No blog present with this id '});
        }
        const blog = await blogMessage.findById(_id);
        if(blog){
            res.status(200).json(blog);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred '});
    }

}

export const getBlogsByCategory = async (req, res) => {
    const { category } = req.body;
    const trimmedCategory = category.trim();
    console.log(trimmedCategory);
    console.log(category);
    
    try{
        const blogs = await blogMessage.find({ category: trimmedCategory });
        res.status(200).json(blogs);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
    
    
}

export const createBlog = async (req, res) => {

    const blog = req.body;
    const newBlog = new blogMessage(blog);

    try{
        await newBlog.save();
        res.status(200).json(newBlog);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const updateBlog = async (req, res) => {
    const blog = req.body;
    const { id: _id } = req.params;
    console.log(blog.userId);
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            res.status(404).json({ message: 'No blog present with this id '});
        }
        //To ensure that user who created this post can only update this post
        const existingBlog = await blogMessage.findById(_id);
        if(existingBlog.userId === blog.userId){
            const updatedBlog = await blogMessage.findByIdAndUpdate(_id, { ...blog, _id }, { new: true });
            res.status(200).json(updatedBlog); 
        }
        else{
            res.status(404).json({ message: "Cannot update someone else's blog"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const deleteBlog = async (req, res) => {
    const { id: _id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            res.status(404).json({ message: 'No blog present with this id '});
        }
        const existingBlog = await blogMessage.findById(_id);
        
        if(existingBlog.username === req.body.username){
            await blogMessage.findByIdAndRemove(_id);
            res.status(200).json({ message: 'Blog deleted successfully' });
        }
        else{
            res.status(404).json({ message: "Cannot delete someone else's blog"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}