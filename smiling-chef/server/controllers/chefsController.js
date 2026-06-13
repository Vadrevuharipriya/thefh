import Chef from '../models/Chef.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicChefs = async (req, res) => {
  const data = await Chef.find().sort({ name: 1 });
  res.json(data);
};

// ─── ADMIN ───────────────────────────────────────────────────
export const getAdminChefs = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status && status !== '') filter.displayStatus = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }
    const data = await Chef.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch chefs' });
  }
};

export const getChefById = async (req, res) => {
  try {
    const doc = await Chef.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Chef not found' });
    res.json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to fetch chef' });
  }
};

export const updateChef = async (req, res) => {
  try {
    const updated = await Chef.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Chef not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update chef' });
  }
};

export const deleteChef = async (req, res) => {
  try {
    await Chef.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete chef' });
  }
};

export const createChef = async (req, res) => {
  try {
    const created = await Chef.create(req.body);
    res.json(created);
  } catch {
    res.status(500).json({ error: 'Failed to create chef' });
  }
};
