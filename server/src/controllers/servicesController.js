import Service from '../models/Service.js';
import { sendSuccess, sendNotFound, sendServerError } from '../utils/responseHandler.js';

// ─── PUBLIC ──────────────────────────────────────────────────
export const getPublicServices = async (req, res) => {
  try {
    const data = await Service.find({ displayStatus: 'Approved' }).sort({ name: 1 });
    return sendSuccess(res, data, 'Services retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/services - Error:', err);
    return sendServerError(res, 'Failed to fetch services');
  }
};

export const getPublicServiceById = async (req, res) => {
  try {
    const data = await Service.findOne({ _id: req.params.id, displayStatus: 'Approved' });
    if (!data) return sendNotFound(res, 'Service not found');
    return sendSuccess(res, data, 'Service retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/services/:id - Error:', err);
    return sendServerError(res, 'Failed to fetch service');
  }
};

// ─── ADMIN ───────────────────────────────────────────────────
export const getAllServices = async (req, res) => {
  try {
    const data = await Service.find().sort({ name: 1 });
    return sendSuccess(res, data, 'Services retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/admin/services - Error:', err);
    return sendServerError(res, 'Failed to fetch services');
  }
};

export const getServiceById = async (req, res) => {
  try {
    const data = await Service.findById(req.params.id);
    if (!data) return sendNotFound(res, 'Service not found');
    return sendSuccess(res, data, 'Service retrieved successfully');
  } catch (err) {
    console.error('[Backend] GET /api/admin/services/:id - Error:', err);
    return sendServerError(res, 'Failed to fetch service', err.message);
  }
};

export const createService = async (req, res) => {
  try {
    console.log('[Backend] POST /api/admin/services - Payload:', req.body);
    const created = await Service.create(req.body);
    return sendSuccess(res, created, 'Service created successfully', 201);
  } catch (err) {
    console.error('[Backend] POST /api/admin/services - Error:', err);
    return sendServerError(res, 'Failed to create service', err.message);
  }
};

export const updateService = async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/services/:id - Update:', req.params.id, req.body);
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return sendNotFound(res, 'Service not found');
    return sendSuccess(res, updated, 'Service updated successfully');
  } catch (err) {
    console.error('[Backend] PUT /api/admin/services/:id - Error:', err);
    return sendServerError(res, 'Failed to update service', err.message);
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    return sendSuccess(res, null, 'Service deleted successfully');
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/services/:id - Error:', err);
    return sendServerError(res, 'Failed to delete service');
  }
};
