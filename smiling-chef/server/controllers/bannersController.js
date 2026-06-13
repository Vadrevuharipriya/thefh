import Banner from '../models/Banner.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getBanners = async (req, res) => {
  const data = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json(data);
};

// ─── ADMIN ───────────────────────────────────────────────────
export const getAllBanners = async (req, res) => {
  const data = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json(data);
};

export const getBannerById = async (req, res) => {
  try {
    const item = await Banner.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Banner not found' });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
};

export const createBanner = async (req, res) => {
  try {
    const created = await Banner.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create banner' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update banner' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
};
