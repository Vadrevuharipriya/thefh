import WebsitePage from '../models/WebsitePage.js';
import ServiceCategory from '../models/ServiceCategory.js';
import Product from '../models/Product.js';

// ─── WEBSITE PAGES ───────────────────────────────────────────
export const getPublicWebsitePages = async (req, res) => {
  try {
    const pages = await WebsitePage.find({ displayStatus: 'Approved' }).sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch website pages' });
  }
};

export const getPublicPageById = async (req, res) => {
  try {
    const page = await WebsitePage.findOne({
      _id: req.params.id,
      displayStatus: 'Approved'
    });
    if (!page) return res.status(404).json({ error: 'Page not found or not published' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

export const getAllPages = async (req, res) => {
  try {
    const pages = await WebsitePage.find().sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch website pages' });
  }
};

export const getPageById = async (req, res) => {
  try {
    const page = await WebsitePage.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

export const createPage = async (req, res) => {
  try {
    const { title, slug, url, metaTitle, metaDescription, pageType, displayStatus, content, featuredImage } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }
    const created = await WebsitePage.create({
      title,
      slug,
      url: url || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      pageType: pageType || 'static',
      displayStatus: displayStatus || 'Approved',
      content: content || '',
      featuredImage: featuredImage || ''
    });
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create website page' });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { title, slug, url, metaTitle, metaDescription, pageType, displayStatus, content, featuredImage } = req.body;
    const updated = await WebsitePage.findByIdAndUpdate(
      req.params.id,
      { title, slug, url, metaTitle, metaDescription, pageType, displayStatus, content, featuredImage },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update website page' });
  }
};

export const deletePage = async (req, res) => {
  try {
    await WebsitePage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete website page' });
  }
};

// ─── SERVICE CATEGORIES ──────────────────────────────────────
export const getPublicServiceCategories = async (req, res) => {
  try {
    const data = await ServiceCategory.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
};

export const getPublicServiceCategoryById = async (req, res) => {
  try {
    const data = await ServiceCategory.findOne({
      _id: req.params.id,
      displayStatus: 'Approved'
    });
    if (!data) return res.status(404).json({ error: 'Service category not found or not available' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service category' });
  }
};

export const getAllServiceCategories = async (req, res) => {
  try {
    const data = await ServiceCategory.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
};

export const getServiceCategoryById = async (req, res) => {
  try {
    const data = await ServiceCategory.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Service category not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service category' });
  }
};

export const createServiceCategory = async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/service-categories - Creating:', req.body);
    const created = await ServiceCategory.create(req.body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to create service category', details: err.message });
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/service-categories/:id - Updating:', req.params.id, req.body);
    const updated = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Service category not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update service category', details: err.message });
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete service category' });
  }
};

// ─── PRODUCTS ────────────────────────────────────────────────
export const getProducts = async (req, res) => {
  const data = await Product.find();
  res.json(data);
};
