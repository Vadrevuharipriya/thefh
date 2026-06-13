import express from 'express';
import WebsitePage from '../models/WebsitePage.js';
import ServiceCategory from '../models/ServiceCategory.js';

const router = express.Router();

// ── GET /api/website-pages  (public – Approved only)
router.get('/', async (req, res) => {
  try {
    const pages = await WebsitePage.find({ displayStatus: 'Approved' }).sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch website pages' });
  }
});

// ── GET /api/website-pages/:id  (public – Approved only)
router.get('/:id', async (req, res) => {
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
});

// ── GET /api/admin/website-pages  (admin – all)
router.get('/admin', async (req, res) => {
  try {
    const pages = await WebsitePage.find().sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch website pages' });
  }
});

// ── GET /api/admin/website-pages/:id  (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const page = await WebsitePage.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// ── POST /api/admin/website-pages  (admin)
router.post('/admin', async (req, res) => {
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
});

// ── PUT /api/admin/website-pages/:id  (admin)
router.put('/admin/:id', async (req, res) => {
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
});

// ── DELETE /api/admin/website-pages/:id  (admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    await WebsitePage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete website page' });
  }
});

// ── GET /api/service-categories  (public)
router.get('/service-categories', async (req, res) => {
  try {
    const data = await ServiceCategory.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
});

// ── GET /api/service-categories/:id  (public)
router.get('/service-categories/:id', async (req, res) => {
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
});

// ── GET /api/admin/service-categories  (admin)
router.get('/admin/service-categories', async (req, res) => {
  try {
    const data = await ServiceCategory.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
});

// ── GET /api/admin/service-categories/:id  (admin)
router.get('/admin/service-categories/:id', async (req, res) => {
  try {
    const data = await ServiceCategory.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Service category not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service category' });
  }
});

// ── POST /api/admin/service-categories  (admin)
router.post('/admin/service-categories', async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/service-categories - Creating:', req.body);
    const created = await ServiceCategory.create(req.body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/service-categories - Error:', err);
    res.status(500).json({ error: 'Failed to create service category', details: err.message });
  }
});

// ── PUT /api/admin/service-categories/:id  (admin)
router.put('/admin/service-categories/:id', async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/service-categories/:id - Updating:', req.params.id, req.body);
    const updated = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Service category not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update service category', details: err.message });
  }
});

// ── DELETE /api/admin/service-categories/:id  (admin)
router.delete('/admin/service-categories/:id', async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/service-categories/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete service category' });
  }
});

export default router;
