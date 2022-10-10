import express from 'express';
import { getBlogs, getBlog, getBlogsByCategory , createBlog, updateBlog, deleteBlog } from '../controllers/blogs.js';

const router = express.Router();

//To get all the blogs
router.get('/', getBlogs);

//Get a single blog by Id
router.get('/:id', getBlog)

//Get all blogs by category
router.post('/category', getBlogsByCategory)

//To create a blog
router.post('/', createBlog);

//To update a blog
router.put('/update/:id', updateBlog);

//To delete a blog
//Post request since we are passing data in req.body
router.post('/delete/:id', deleteBlog);

export default router;