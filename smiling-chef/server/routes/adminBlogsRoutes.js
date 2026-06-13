import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogsController.js';

const router = express.Router();

// ── GET /api/admin/blogs
router.get('/', getAllBlogs);

// ── GET /api/admin/blogs/:id
router.get('/:id', getBlogById);

// ── POST /api/admin/blogs
router.post('/', createBlog);

// ── PUT /api/admin/blogs/:id
router.put('/:id', updateBlog);

// ── DELETE /api/admin/blogs/:id
router.delete('/:id', deleteBlog);

export default router;
