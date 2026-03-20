import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  Package, Tag, FileText, DollarSign, Upload, X,
  ArrowLeft, AlertCircle, CheckCircle2
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-edit * { box-sizing: border-box; }

  .bc-edit {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-edit-inner { max-width: 1040px; margin: 0 auto; }

  /* ── Loading ── */
  .bc-edit-loading {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 14px;
  }
  .bc-edit-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-edit-spin 0.8s linear infinite;
  }
  .bc-edit-loading-text {
    font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(200,195,185,0.3);
    animation: bc-edit-pulse 1.5s ease-in-out infinite;
  }
  @keyframes bc-edit-spin { to { transform: rotate(360deg); } }
  @keyframes bc-edit-pulse { 0%,100%{opacity:.35} 50%{opacity:.8} }

  /* ── Header ── */
  .bc-edit-header {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-edit-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-edit-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-edit-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-edit-title em { font-style: italic; color: #c8a96e; }
  .bc-edit-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  .bc-edit-back {
    display: flex; align-items: center; gap: 7px;
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(200,195,185,0.38);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, gap 0.2s;
  }
  .bc-edit-back:hover { color: #c8a96e; gap: 10px; }
  .bc-edit-back svg { transition: transform 0.25s; }
  .bc-edit-back:hover svg { transform: translateX(-3px); }

  /* ── Error ── */
  .bc-edit-error {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 24px;
    animation: bc-edit-shake 0.35s ease;
  }
  @keyframes bc-edit-shake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)}
  }
  .bc-edit-error svg { color: #f87171; flex-shrink: 0; margin-top: 1px; }
  .bc-edit-error-text { font-size: 12px; color: rgba(248,113,113,0.75); }

  /* ── Grid ── */
  .bc-edit-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 1024px) { .bc-edit-grid { grid-template-columns: 2fr 1fr; } }

  /* ── Card ── */
  .bc-edit-card {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 28px;
  }
  .bc-edit-card-head {
    display: flex; align-items: center; gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 22px;
  }
  .bc-edit-card-icon {
    width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.08);
    border: 1px solid rgba(200,169,110,0.18);
    color: #c8a96e;
  }
  .bc-edit-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f5f0e8;
  }
  .bc-edit-card-sub { font-size: 11px; color: rgba(200,195,185,0.32); margin-top: 2px; }

  /* ── Fields ── */
  .bc-edit-fields { display: flex; flex-direction: column; gap: 18px; }
  .bc-edit-field { display: flex; flex-direction: column; gap: 7px; }
  .bc-edit-label {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.38);
  }
  .bc-edit-input-wrap { position: relative; }
  .bc-edit-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-edit-textarea-icon {
    position: absolute; top: 13px; left: 14px;
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-edit-input-wrap:focus-within .bc-edit-input-icon,
  .bc-edit-input-wrap:focus-within .bc-edit-textarea-icon { color: #c8a96e; }

  .bc-edit-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-edit-input::placeholder { color: rgba(200,195,185,0.18); }
  .bc-edit-input:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-edit-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 38px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none; appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c8a96e'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 14px;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  }
  .bc-edit-select option { background: #13121a; color: #f0ebe0; }
  .bc-edit-select:focus {
    border-color: rgba(200,169,110,0.5);
    background-color: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-edit-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none; resize: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-edit-textarea::placeholder { color: rgba(200,195,185,0.18); }
  .bc-edit-textarea:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* Price input */
  .bc-edit-price-symbol {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; color: rgba(200,169,110,0.6); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-edit-input-wrap:focus-within .bc-edit-price-symbol { color: #c8a96e; }
  .bc-edit-input--price {
    padding-left: 28px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300;
  }

  /* ── Images section ── */
  .bc-edit-img-grid {
    display: flex; flex-wrap: wrap; gap: 12px;
    margin-bottom: 18px;
  }
  .bc-edit-img-thumb {
    position: relative;
    width: 88px; height: 88px;
    border-radius: 10px; overflow: visible;
    flex-shrink: 0;
  }
  .bc-edit-img-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.07);
    transition: transform 0.3s;
  }
  .bc-edit-img-thumb:hover img { transform: scale(1.03); }

  .bc-edit-img-del {
    position: absolute; top: -7px; right: -7px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(239,68,68,0.9); border: 1.5px solid #0a0a0f;
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    z-index: 5;
  }
  .bc-edit-img-del:hover { background: #ef4444; transform: scale(1.1); }

  .bc-edit-img-new-badge {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(16,185,129,0.88); color: #fff;
    font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
    text-align: center; padding: 2px 0;
    border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;
  }
  .bc-edit-img-main-badge {
    position: absolute; top: 6px; left: 6px;
    padding: 2px 7px; border-radius: 999px;
    font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(200,169,110,0.9); color: #0a0a0f; font-weight: 500;
  }

  /* Upload zone */
  .bc-edit-upload-zone {
    border: 1.5px dashed rgba(200,169,110,0.18);
    border-radius: 12px; padding: 24px;
    text-align: center; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .bc-edit-upload-zone:hover {
    border-color: rgba(200,169,110,0.38);
    background: rgba(200,169,110,0.02);
  }
  .bc-edit-upload-icon {
    width: 40px; height: 40px; border-radius: 11px;
    background: rgba(200,169,110,0.07); border: 1px solid rgba(200,169,110,0.15);
    display: flex; align-items: center; justify-content: center;
    color: #c8a96e; margin: 0 auto 10px;
  }
  .bc-edit-upload-cta {
    font-size: 13px; font-weight: 500; color: #c8a96e;
    display: block; margin-bottom: 3px;
  }
  .bc-edit-upload-sub { font-size: 11px; color: rgba(200,195,185,0.3); }

  /* ── Buttons ── */
  .bc-edit-save-btn {
    position: relative; overflow: hidden;
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    padding: 15px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #0a0a0f; border: none; border-radius: 12px; cursor: pointer;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 8px 24px rgba(200,169,110,0.28);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .bc-edit-save-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-edit-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(200,169,110,0.38); }
  .bc-edit-save-btn:hover:not(:disabled)::before { opacity: 1; }
  .bc-edit-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .bc-edit-save-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(10,10,15,0.25); border-top-color: #0a0a0f;
    animation: bc-edit-spin 0.8s linear infinite;
  }

  .bc-edit-cancel-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(220,215,205,0.5);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-edit-cancel-btn:hover {
    color: #e8d5a3; border-color: rgba(200,169,110,0.3); background: rgba(200,169,110,0.05);
  }
`;

const CATEGORIES = [
  "Electronics","Fashion","Home & Garden","Sports","Books",
  "Collectibles","Art","Jewelry","Automotive","Other",
];

const EditItem = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", basePrice: "", auctionDuration: "24",
  });
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles]   = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => { fetchItemDetails(); }, [id]);

  const fetchItemDetails = async () => {
    try {
      const { data } = await api.get(`/items/${id}`);
      setFormData({
        title: data.title, description: data.description,
        category: data.category, basePrice: data.basePrice,
        auctionDuration: data.auctionDuration || 24,
      });
      setExistingImages(data.images || []);
    } catch {
      setError("Failed to fetch item details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const removeExistingImage = (i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  const handleImageChange = (e) => {
    if (!e.target.files?.length) return;
    const fileArray = Array.from(e.target.files);
    if (existingImages.length + newImageFiles.length + fileArray.length > 5) {
      setError("Total images cannot exceed 5."); return;
    }
    setNewImageFiles(prev => [...prev, ...fileArray]);
    setNewImagePreviews(prev => [...prev, ...fileArray.map(f => URL.createObjectURL(f))]);
    setError("");
  };

  const removeNewImage = (i) => {
    setNewImageFiles(prev => prev.filter((_, idx) => idx !== i));
    setNewImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await api.put(`/seller/items/${id}`, {
        title: formData.title, description: formData.description,
        category: formData.category, basePrice: formData.basePrice,
        auctionDuration: formData.auctionDuration, images: existingImages,
      });
      if (newImageFiles.length > 0) {
        const imgForm = new FormData();
        newImageFiles.forEach(f => imgForm.append("images", f));
        await api.post(`/seller/items/${id}/images`, imgForm);
      }
      navigate("/my-items");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="bc-edit-loading">
      <div className="bc-edit-spinner" />
      <span className="bc-edit-loading-text">Loading item…</span>
    </div>
  );

  const allImagesCount = existingImages.length + newImageFiles.length;

  return (
    <>
      <style>{styles}</style>
      <div className="bc-edit">
        <div className="bc-edit-inner">

          {/* Header */}
          <div className="bc-edit-header">
            <div>
              <div className="bc-edit-eyebrow">Seller Portal</div>
              <h1 className="bc-edit-title">Edit <em>Listing</em></h1>
              <p className="bc-edit-sub">Update your auction item details and images.</p>
            </div>
            <button className="bc-edit-back" onClick={() => navigate("/my-items")}>
              <ArrowLeft size={13} /> Back to Listings
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Error */}
            {error && (
              <div className="bc-edit-error">
                <AlertCircle size={15} />
                <div className="bc-edit-error-text">{error}</div>
              </div>
            )}

            <div className="bc-edit-grid">

              {/* ── LEFT: Details + Images ── */}
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

                {/* Details card */}
                <div className="bc-edit-card">
                  <div className="bc-edit-card-head">
                    <div className="bc-edit-card-icon"><Package size={17} /></div>
                    <div><div className="bc-edit-card-title">Item Details</div></div>
                  </div>
                  <div className="bc-edit-fields">
                    <div className="bc-edit-field">
                      <label className="bc-edit-label">Item Title</label>
                      <div className="bc-edit-input-wrap">
                        <div className="bc-edit-input-icon"><Package size={14} /></div>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="bc-edit-input" placeholder="Item title" />
                      </div>
                    </div>
                    <div className="bc-edit-field">
                      <label className="bc-edit-label">Category</label>
                      <div className="bc-edit-input-wrap">
                        <div className="bc-edit-input-icon"><Tag size={14} /></div>
                        <select name="category" value={formData.category} onChange={handleChange} className="bc-edit-select">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="bc-edit-field">
                      <label className="bc-edit-label">Description</label>
                      <div className="bc-edit-input-wrap">
                        <div className="bc-edit-textarea-icon"><FileText size={14} /></div>
                        <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="bc-edit-textarea" placeholder="Item description…" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images card */}
                <div className="bc-edit-card">
                  <div className="bc-edit-card-head">
                    <div className="bc-edit-card-icon"><Upload size={17} /></div>
                    <div>
                      <div className="bc-edit-card-title">Images</div>
                      <div className="bc-edit-card-sub">Manage listing photos · {allImagesCount}/5 used</div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {allImagesCount > 0 && (
                    <div className="bc-edit-img-grid">
                      {existingImages.map((img, i) => (
                        <div key={`ex-${i}`} className="bc-edit-img-thumb">
                          <img src={img} alt="Existing" />
                          <button type="button" className="bc-edit-img-del" onClick={() => removeExistingImage(i)}>
                            <X size={11} />
                          </button>
                          {i === 0 && existingImages.length > 0 && newImageFiles.length === 0 && (
                            <div className="bc-edit-img-main-badge">Main</div>
                          )}
                        </div>
                      ))}
                      {newImagePreviews.map((img, i) => (
                        <div key={`new-${i}`} className="bc-edit-img-thumb">
                          <img src={img} alt="New" />
                          <button type="button" className="bc-edit-img-del" onClick={() => removeNewImage(i)}>
                            <X size={11} />
                          </button>
                          <div className="bc-edit-img-new-badge">New</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload zone */}
                  {allImagesCount < 5 && (
                    <div className="bc-edit-upload-zone">
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="edit-img-upload" style={{display:'none'}} />
                      <label htmlFor="edit-img-upload" style={{cursor:'pointer'}}>
                        <div className="bc-edit-upload-icon"><Upload size={18} /></div>
                        <span className="bc-edit-upload-cta">Click to Upload More Images</span>
                        <span className="bc-edit-upload-sub">JPG, PNG, WEBP · up to 5MB</span>
                      </label>
                    </div>
                  )}
                </div>

              </div>

              {/* ── RIGHT: Pricing + Actions ── */}
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

                {/* Pricing */}
                <div className="bc-edit-card">
                  <div className="bc-edit-card-head">
                    <div className="bc-edit-card-icon"><DollarSign size={17} /></div>
                    <div><div className="bc-edit-card-title">Pricing</div></div>
                  </div>
                  <div className="bc-edit-field">
                    <label className="bc-edit-label">Starting Price</label>
                    <div className="bc-edit-input-wrap">
                      <span className="bc-edit-price-symbol">$</span>
                      <input
                        type="number" name="basePrice" value={formData.basePrice}
                        onChange={handleChange} min="0" step="0.01"
                        className="bc-edit-input bc-edit-input--price"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <button type="submit" disabled={saving} className="bc-edit-save-btn">
                    {saving
                      ? <div className="bc-edit-save-spin" />
                      : <><CheckCircle2 size={15} /> Save Changes</>
                    }
                  </button>
                  <button type="button" onClick={() => navigate("/my-items")} className="bc-edit-cancel-btn">
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditItem;