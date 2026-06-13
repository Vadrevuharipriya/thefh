import express from 'express';
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogsController.js';

const router = express.Router();

// ── PUBLIC ROUTES ──────────────────────────────────────────
// GET /api/blogs
router.get('/', getPublicBlogs);

// GET /api/blogs/:slug
router.get('/:slug', getPublicBlogBySlug);

export default router;
