import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    brand: '', 
    size: '', 
    mrpCents: '', 
    finalPriceCents: '', 
    sku: '', 
    stock: '', 
    imageUrl: '', 
    description: '', 
    isMaster: true 
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (isEdit) {
      fetch(`/api/products/${id}`)
        .then(r => r.json())
        .then(p => setForm(f => ({ 
          ...f, 
          ...p, 
          mrpCents: p.mrpCents ?? '', 
          finalPriceCents: p.finalPriceCents ?? '' 
        })))
        .catch(err => console.error('Failed to load product:', err));
    }
  }, [id, isEdit]);
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }
  
  async function handleFileUpload(file) {
    if (!file) return;
    
    setUploading(true);
    setUploadError('');
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await res.json();
      setForm(f => ({ ...f, imageUrl: result.url }));
      console.log('Upload successful:', result);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...form,
        mrpCents: form.mrpCents === '' ? null : Number(form.mrpCents),
        finalPriceCents: form.finalPriceCents === '' ? 0 : Number(form.finalPriceCents),
        stock: form.stock === '' ? 0 : Number(form.stock)
      };
      
      const res = await fetch(
        isEdit ? `/api/products/${id}` : '/api/products', 
        { 
          method: isEdit ? 'PUT' : 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        }
      );
      
      if (res.ok) {
        navigate('/');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Save failed');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }
  
  return (
    <div className="container">
      <h2>{isEdit ? 'Edit' : 'Add'} Product</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <input 
            name="name" 
            placeholder="Name" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="brand" 
            placeholder="Brand" 
            value={form.brand} 
            onChange={handleChange} 
          />
          <input 
            name="size" 
            placeholder="Size" 
            value={form.size} 
            onChange={handleChange} 
          />
          <input 
            name="sku" 
            placeholder="SKU" 
            value={form.sku} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="mrpCents" 
            placeholder="MRP (cents)" 
            value={form.mrpCents} 
            onChange={handleChange} 
            type="number"
          />
          <input 
            name="finalPriceCents" 
            placeholder="Final Price (cents)" 
            value={form.finalPriceCents} 
            onChange={handleChange} 
            type="number"
            required
          />
          <input 
            name="stock" 
            placeholder="Stock" 
            value={form.stock} 
            onChange={handleChange} 
            type="number"
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="row" style={{ alignItems: 'flex-start', gap: '8px' }}>
              <input 
                type="checkbox" 
                name="isMaster" 
                checked={form.isMaster} 
                onChange={handleChange} 
              /> 
              Master Product
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Image Upload:</label>
            <div className="row" style={{ marginTop: '8px' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                style={{ flex: 1 }}
              />
              {uploading && <span className="muted">Uploading…</span>}
            </div>
            {uploadError && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{uploadError}</div>}
            {form.imageUrl && (
              <div style={{ marginTop: '8px' }}>
                <img 
                  src={form.imageUrl.startsWith('http') ? form.imageUrl : `http://localhost:5050${form.imageUrl}`} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #ccc' }} 
                />
              </div>
            )}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <textarea 
              name="description" 
              placeholder="Description" 
              value={form.description} 
              onChange={handleChange}
              style={{ width: '100%', minHeight: '80px' }}
            />
          </div>
          <div className="row" style={{ gridColumn: '1 / -1', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
