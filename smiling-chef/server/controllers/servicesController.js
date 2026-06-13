import Service from '../models/Service.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicServices = async (req, res) => {
  try {
    const data = await Service.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/services - Error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getPublicServiceById = async (req, res) => {
  try {
    const data = await Service.findOne({ _id: req.params.id, displayStatus: 'Approved' });
    if (!data) return res.status(404).json({ error: 'Service not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// ─── ADMIN ───────────────────────────────────────────────────
export const getAllServices = async (req, res) => {
  try {
    const data = await Service.find().sort({ name: 1 });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/services - Error:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const data = await Service.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Service not found' });
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch service', details: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/services - Payload:', req.body);
    const created = await Service.create(req.body);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/services - Error:', err);
    res.status(500).json({ error: 'Failed to create service', details: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/services/:id - Update:', req.params.id, req.body);
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update service', details: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/services/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
