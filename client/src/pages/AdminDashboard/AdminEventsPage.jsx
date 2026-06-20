import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Plus, Edit2, Trash2, Search, Eye, ImageOff,
  GripVertical, Save, RotateCcw
} from 'lucide-react';
import SortableJS from 'sortablejs';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminEventsPage.scss';

const STATUS_OPTIONS = ['Approved', 'Pending', 'Hold'];

function genSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '', slug: '', image: '', date: '', description: '',
    displayStatus: 'Pending', displayOrder: 0,
  });

  const tableRef  = useRef(null);
  const sortableRef  = useRef(null);
  const dragBuffer   = useRef([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res  = await axios.get('/api/admin/events');
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const initSortable = useCallback(() => {
    if (sortableRef.current) sortableRef.current.destroy();
    const el = tableRef.current;
    if (!el) return;
    const sortable = SortableJS.create(el, {
      animation: 180,
      handle: '.drag-handle',
      ghostClass: 'events-row--dragging',
      onStart: () => { dragBuffer.current = [...events]; },
      onEnd: (evt) => {
        const { oldIndex: from, newIndex: to } = evt;
        if (from === to) return;
        const next = [...events];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setEvents(next);
      },
    });
    sortableRef.current = sortable;
  }, [events]);

  useEffect(() => {
    if (events.length   ) {
      setLoading(false)
      initSortable()
      return () => { sortableRef.current?.destroy(); sortableRef.current = null }
    } else {
      // don't bootstrap Sortable until we have at least one row
    }
  }, [events.length, fetchEvents]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      await axios.put('/api/admin/events/reorder',
        { order: events.map((e, i) => ({ _id: e._id, displayOrder: i })) },
      );
    } catch (err) {
      console.error('Reorder failed:', err);
      fetchEvents(); // reload original order
    } finally {
      setSavingOrder(false);
    }
  };

  const cycleStatus = async (evt) => {
    const cur = evt.displayStatus;
    const idx = STATUS_OPTIONS.indexOf(cur);
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      await axios.put(`/api/admin/events/${evt._id}`, { displayStatus: next });
      setEvents(events.map(e => e._id === evt._id ? { ...e, displayStatus: next } : e));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete event "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleViewImage = (evt) => setPreview(evt);
  const closePreview  = () => setPreview(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Only JPG, JPEG, PNG, WebP files allowed');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await axios.post('/api/admin/upload', uploadData);
      setFormData({ ...formData, image: res.data.url });
      setImagePreview(res.data.url);
    } catch (err) {
      console.error('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };

  const resetForm = () => {
    setFormData({
      name: '', slug: '', image: '', date: '', description: '',
      displayStatus: 'Pending', displayOrder: 0,
    });
    setImagePreview('');
  };

  const openCreate = () => {
    setEditingEvent(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      name: evt.name || '', slug: evt.slug || '',
      image: evt.image || '', date: evt.date || '',
      description: evt.description || '',
      displayStatus: evt.displayStatus || 'Pending',
      displayOrder: evt.displayOrder || 0,
    });
    if (evt.image) setImagePreview(evt.image);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ...body } = formData;
      if (editingEvent) {
        await axios.put(`/api/admin/events/${editingEvent._id}`, body);
      } else {
        await axios.post('/api/admin/events', body);
      }
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filtered = events.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-events-page">
      <AdminSidebar />
      <main className="admin-events-content">
        <div className="page-header">
          <h2>Manage Events</h2>
          <div className="page-header-actions">
            <button className="btn btn-save-order" onClick={saveOrder} disabled={savingOrder}>
              <Save size={15} /> {savingOrder ? 'Saving…' : 'Save Order'}
            </button>
            <button className="btn btn-reset-order" onClick={fetchEvents} title="Reload original order">
              <RotateCcw size={15} />
            </button>
            <button className="btn btn-add" onClick={openCreate}>
              <Plus size={16} /> Add New Events
            </button>
          </div>
        </div>

        <div className="admin-events-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Events List</h3>
            <span className="count-badge">{events.length} events</span>
          </div>

          {loading ? (
            <div className="table-loading"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <p>{search ? 'No matching events found.' : 'No events yet. Click "Add New Events".'}</p>
            </div>
          ) : (
            <div className="events-table-wrapper">
              <table className="events-table">
                <colgroup>
                  <col className="col-drag" />
                  <col className="col-slno" />
                  <col className="col-name" />
                  <col className="col-image" />
                  <col className="col-status" />
                  <col className="col-action" />
                </colgroup>
                <thead>
                  <tr>
                    <th></th>
                    <th>Slno</th>
                    <th>Event Name</th>
                    <th>Event Image</th>
                    <th>Display Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody ref={tableRef} key={events.map(e => e._id).join(',')}>
                  {filtered.map((evt, i) => (
                    <tr key={evt._id} data-id={evt._id}>
                      <td className="drag-col">
                        <span className="drag-handle" title="Drag to reorder">
                          <GripVertical size={16} />
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }} className="slno-cell">{i + 1}</td>
                      <td className="event-name-cell">
                        <span className="event-name">{evt.name}</span>
                        {evt.date && <span className="event-date">{evt.date}</span>}
                      </td>
                      <td>
                        <button
                          className="btn-view-icon"
                          onClick={() => handleViewImage(evt)}
                          title={evt.image ? 'View image' : 'No image'}
                        >
                          {evt.image
                            ? <><Eye size={15} /> <span className="btn-view-text">View</span></>
                            : <><ImageOff size={15} /> <span className="btn-view-text">No img</span></>}
                        </button>
                      </td>
                      <td>
                        <button
                          className={`status-btn status-${evt.displayStatus?.toLowerCase()}`}
                          onClick={() => cycleStatus(evt)}
                          title={`Current: ${evt.displayStatus} — click to change`}
                        >
                          {evt.displayStatus === 'Approved' ? 'Approved'
                            : evt.displayStatus === 'Hold'    ? 'Hold'
                            : 'Non-Approve'}
                        </button>
                      </td>
                      <td className="table-actions">
                        <button className="btn-action btn-edit" title="Edit" onClick={() => openEdit(evt)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn-action btn-delete" title="Delete" onClick={() => handleDelete(evt._id, evt.name)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="drag-hint">
                <GripVertical size={13} /> Select a row and drag to change display order
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ─── Image Preview Modal ─── */}
      {preview && (
        <div className="evt-modal-overlay" onClick={() => setPreview(null)}>
          <div className="evt-modal" onClick={e => e.stopPropagation()}>
            <button className="evt-modal-close" onClick={() => setPreview(null)}>&times;</button>
            <h3>{preview.name}</h3>
            {preview.date && <p className="evt-modal-date">{preview.date}</p>}
            {preview.image ? (
              <img src={preview.image} alt={preview.name} className="evt-modal-img"
                onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="evt-modal-no-img">No image</div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ─── */}
      {showForm && (
        <div className="evt-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="evt-modal evt-form-modal" onClick={e => e.stopPropagation()}>
            <button className="evt-modal-close" onClick={() => setShowForm(false)}>&times;</button>
            <h2>{editingEvent ? `Edit — "${editingEvent.name}"` : 'Add New Events'}</h2>
            <form onSubmit={handleSubmit} className="evt-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={e => setFormData({
                      ...formData, name: e.target.value,
                      slug: editingEvent ? formData.slug : genSlug(e.target.value)
                    })}
                    placeholder="e.g. Holi" />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input type="text" required value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date / Period</label>
                  <input type="text" value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. March" />
                </div>
                <div className="form-group">
                  <label>Display Status *</label>
                  <select value={formData.displayStatus}
                    onChange={e => setFormData({ ...formData, displayStatus: e.target.value })}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group form-group-sm">
                  <label>Display Order</label>
                  <input type="number" value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Event Image</label>
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Event" className="image-preview" />
                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn-view-image"
                        onClick={() => window.open(imagePreview, '_blank')}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn-clear-image"
                        onClick={handleClearImage}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      id="event-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="event-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Short description of the event…" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
