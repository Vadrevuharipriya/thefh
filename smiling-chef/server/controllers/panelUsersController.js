import PanelUser from '../models/PanelUser.js';

// ─── ADMIN ───────────────────────────────────────────────────
export const getAdminPanelUsers = async (req, res) => {
  try {
    console.log('[Backend] GET /api/admin/panel-users - Fetching panel users');
    const data = await PanelUser.find().sort({ createdAt: -1 });
    console.log('[Backend] Found', data.length, 'panel users');
    res.json(data);
  } catch (err) {
    console.error('[Backend] GET /api/admin/panel-users - Error:', err);
    res.status(500).json({ error: 'Failed to fetch panel users' });
  }
};

export const getPanelUserById = async (req, res) => {
  try {
    const user = await PanelUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Panel user not found' });
    res.json(user);
  } catch (err) {
    console.error('[Backend] GET /api/admin/panel-users/:id - Error:', err);
    res.status(500).json({ error: 'Failed to fetch panel user' });
  }
};

export const createPanelUser = async (req, res) => {
  try {
    const { contactName, mobilePhone, emailAddress, username, password, designation, status, role } = req.body;
    console.log('[Backend] POST /api/admin/panel-users - Creating user:', username);
    const created = await PanelUser.create({
      contactName,
      mobilePhone,
      emailAddress,
      username,
      password,
      designation: designation || '',
      status: status || 'Non-Approve',
      role: role || 'Panel User'
    });
    console.log('[Backend] Panel user created:', created._id);
    res.json(created);
  } catch (err) {
    console.error('[Backend] POST /api/admin/panel-users - Error:', err);
    res.status(500).json({ error: 'Failed to create panel user' });
  }
};

export const updatePanelUser = async (req, res) => {
  try {
    console.log('[Backend] PUT /api/admin/panel-users/:id - Update:', req.params.id, req.body);
    const updated = await PanelUser.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Panel user not found' });
    console.log('[Backend] PUT /api/admin/panel-users/:id - Updated:', req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('[Backend] PUT /api/admin/panel-users/:id - Error:', err);
    res.status(500).json({ error: 'Failed to update panel user', details: err.message });
  }
};

export const deletePanelUser = async (req, res) => {
  try {
    await PanelUser.findByIdAndDelete(req.params.id);
    console.log('[Backend] DELETE /api/admin/panel-users/:id - Deleted:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[Backend] DELETE /api/admin/panel-users/:id - Error:', err);
    res.status(500).json({ error: 'Failed to delete panel user' });
  }
};
