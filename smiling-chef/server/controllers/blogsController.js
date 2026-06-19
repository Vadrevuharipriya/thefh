import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { sendSuccess, sendNotFound, sendServerError, sendValidationError } from '../utils/responseHandler.js';

const DEFAULT_AUTHOR = 'The Famous Halwai Team';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanSlug(value, fallback = 'blog') {
  const slug = (value || fallback).toString().toLowerCase().trim();
  const cleaned = slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

async function getUniqueSlug(slug, currentId = null) {
  const baseSlug = cleanSlug(slug);
  const slugPattern = new RegExp(`^${escapeRegExp(baseSlug)}(-\\d+)?$`, 'i');
  const query = { slug: slugPattern };

  if (currentId && mongoose.Types.ObjectId.isValid(currentId)) {
    query._id = { $ne: currentId };
  }

  const existing = await Blog.find(query).select('slug');
  const usedSlugs = new Set(existing.map((blog) => blog.slug.toLowerCase()));

  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let index = 2;
  while (usedSlugs.has(`${baseSlug}-${index}`)) {
    index += 1;
  }

  return `${baseSlug}-${index}`;
}

async function normalizeBlogPayload(payload, currentId = null) {
  const { slug, ...rest } = payload || {};
  const normalizedSlug = await getUniqueSlug(slug || rest.title, currentId);

  return {
    ...rest,
    title: rest.title?.trim(),
    slug: normalizedSlug,
    excerpt: rest.excerpt?.trim() || '',
    metaTitle: rest.metaTitle?.trim() || '',
    metaKeyword: rest.metaKeyword?.trim() || '',
    metaDescription: rest.metaDescription?.trim() || '',
    content: rest.content?.trim() || '',
    image: rest.image?.trim() || '',
    category: rest.category?.trim() || '',
    author: rest.author?.trim() || DEFAULT_AUTHOR,
    published: rest.published ?? true,
  };
}

export const getPublicBlogs = async (req, res) => {
  try {
    const data = await Blog.find({ published: true }).sort({ date: -1 });
    // Return raw array for public consumption (frontend expects an array)
    return res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/blogs - Error:', err);
    return sendServerError(res, 'Failed to fetch blogs');
  }
};

export const getPublicBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    return res.json(blog);
  } catch (err) {
    console.error('[Backend] GET /api/blogs/:slug - Error:', err);
    return sendServerError(res, 'Failed to fetch blog');
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const data = await Blog.find().sort({ date: -1 });
    return sendSuccess(res, data, 'Blogs retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/admin/blogs - Error:', err);
    return sendServerError(res, 'Failed to fetch blogs');
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return sendNotFound(res, 'Blog not found');
    return sendSuccess(res, blog, 'Blog retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/admin/blogs/:id - Error:', err);
    return sendServerError(res, 'Failed to fetch blog', err.message);
  }
};

export const createBlog = async (req, res) => {
  try {
    const created = await Blog.create(await normalizeBlogPayload(req.body));
    return sendSuccess(res, created, 'Blog created successfully', 201);
  } catch (err) {
    console.error('[Backend] POST /api/admin/blogs - Error:', err);
    return sendServerError(res, 'Failed to create blog', err.message);
  }
};

export const updateBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendValidationError(res, 'Invalid blog ID');
    }

    const update = await normalizeBlogPayload(req.body, req.params.id);
    const updated = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!updated) return sendNotFound(res, 'Blog not found');
    return sendSuccess(res, updated, 'Blog updated successfully');
  } catch (err) {
    console.error('[Backend] PUT /api/admin/blogs/:id - Error:', err);
    return sendServerError(res, 'Failed to update blog', err.message);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return sendNotFound(res, 'Blog not found');
    return sendSuccess(res, null, 'Blog deleted successfully');
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/blogs/:id - Error:', err);
    return sendServerError(res, 'Failed to delete blog', err.message);
  }
};
