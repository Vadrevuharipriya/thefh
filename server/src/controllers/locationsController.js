import Location from '../models/Location.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicLocations = async (req, res) => {
  try {
    const data = await Location.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────
export const getAllLocations = async (req, res) => {
  try {
    const data = await Location.find().sort({ name: 1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, slug, image, displayStatus } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }
    const created = await Location.create({ name, slug, image, displayStatus: displayStatus || 'Approved' });
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create location' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { name, slug, image, displayStatus } = req.body;
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      { name, slug, image, displayStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
