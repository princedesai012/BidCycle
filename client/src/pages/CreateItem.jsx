import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Package, Tag, FileText, DollarSign, Clock, Calendar,
  Upload, X, Image as ImageIcon, ArrowLeft, AlertCircle, CheckCircle2
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-create * { box-sizing: border-box; }

  .bc-create {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-create-inner { max-width: 1040px; margin: 0 auto; }

  /* ── Header ── */
  .bc-create-header {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-create-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-create-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-create-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-create-title em { font-style: italic; color: #c8a96e; }
  .bc-create-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  .bc-create-back {
    display: none;
    align-items: center; gap: 7px;
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(200,195,185,0.38);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, gap 0.2s;
  }
  @media (min-width: 640px) { .bc-create-back { display: flex; } }
  .bc-create-back:hover { color: #c8a96e; gap: 10px; }
  .bc-create-back svg { transition: transform 0.25s; }
  .bc-create-back:hover svg { transform: translateX(-3px); }

  /* ── Error ── */
  .bc-create-error {
    display: flex; align-items: flex-start; gap: 12px;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 24px;
    animation: bc-create-shake 0.35s ease;
  }
  @keyframes bc-create-shake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)}
  }
  .bc-create-error svg { color: #f87171; flex-shrink: 0; margin-top: 1px; }
  .bc-create-error-title { font-size: 12px; font-weight: 500; color: #f87171; margin-bottom: 2px; letter-spacing: 0.04em; }
  .bc-create-error-text  { font-size: 12px; color: rgba(248,113,113,0.7); }

  /* ── Grid ── */
  .bc-create-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 1024px) { .bc-create-grid { grid-template-columns: 7fr 5fr; } }

  /* ── Card (reusable panel) ── */
  .bc-create-card {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 28px;
  }

  .bc-create-card-head {
    display: flex; align-items: center; gap: 12px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 22px;
  }
  .bc-create-card-icon {
    width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.08);
    border: 1px solid rgba(200,169,110,0.18);
    color: #c8a96e;
  }
  .bc-create-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f5f0e8;
  }
  .bc-create-card-sub { font-size: 11px; color: rgba(200,195,185,0.35); margin-top: 2px; }

  /* Fields */
  .bc-create-fields { display: flex; flex-direction: column; gap: 18px; }
  .bc-create-field { display: flex; flex-direction: column; gap: 7px; }
  .bc-create-label {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.38);
  }
  .bc-create-input-wrap { position: relative; }
  .bc-create-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-create-textarea-icon {
    position: absolute; top: 13px; left: 14px;
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-create-input-wrap:focus-within .bc-create-input-icon,
  .bc-create-input-wrap:focus-within .bc-create-textarea-icon { color: #c8a96e; }

  .bc-create-input {
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
  .bc-create-input::placeholder { color: rgba(200,195,185,0.18); }
  .bc-create-input:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }
  .bc-create-input--price {
    padding-left: 28px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300;
  }
  .bc-create-price-symbol {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; color: rgba(200,169,110,0.6); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-create-input-wrap:focus-within .bc-create-price-symbol { color: #c8a96e; }

  .bc-create-select {
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
  .bc-create-select option { background: #13121a; color: #f0ebe0; }
  .bc-create-select:focus {
    border-color: rgba(200,169,110,0.5);
    background-color: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }
  .bc-create-select--no-icon { padding-left: 14px; }

  .bc-create-textarea {
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
  .bc-create-textarea::placeholder { color: rgba(200,195,185,0.18); }
  .bc-create-textarea:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-create-hint { font-size: 11px; color: rgba(200,195,185,0.28); letter-spacing: 0.03em; }

  /* Datetime input */
  .bc-create-datetime {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    color-scheme: dark;
  }
  .bc-create-datetime:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* ── Drag-drop zone ── */
  .bc-create-dropzone {
    border: 1.5px dashed rgba(200,169,110,0.2);
    border-radius: 14px; padding: 36px 24px;
    text-align: center;
    transition: border-color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .bc-create-dropzone--active {
    border-color: rgba(200,169,110,0.55);
    background: rgba(200,169,110,0.04);
  }
  .bc-create-dropzone:not(.bc-create-dropzone--active):hover {
    border-color: rgba(200,169,110,0.35);
    background: rgba(200,169,110,0.02);
  }
  .bc-create-drop-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(200,169,110,0.08); border: 1px solid rgba(200,169,110,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #c8a96e; margin: 0 auto 14px;
  }
  .bc-create-drop-cta {
    font-size: 13px; font-weight: 500; color: #c8a96e;
    cursor: pointer; transition: opacity 0.2s;
  }
  .bc-create-drop-cta:hover { opacity: 0.8; }
  .bc-create-drop-sub { font-size: 12px; color: rgba(200,195,185,0.35); margin-top: 4px; }
  .bc-create-drop-hint { font-size: 11px; color: rgba(200,195,185,0.22); margin-top: 6px; }

  /* Image previews */
  .bc-create-previews {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px; margin-top: 16px;
  }
  .bc-create-preview {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    aspect-ratio: 1;
  }
  .bc-create-preview img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .bc-create-preview:hover img { transform: scale(1.06); }
  .bc-create-preview-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.5);
    opacity: 0; transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-create-preview:hover .bc-create-preview-overlay { opacity: 1; }
  .bc-create-preview-del {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(239,68,68,0.85); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #fff; transition: background 0.2s;
  }
  .bc-create-preview-del:hover { background: #ef4444; }
  .bc-create-preview-main {
    position: absolute; top: 8px; left: 8px;
    padding: 2px 8px; border-radius: 999px;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(200,169,110,0.9); color: #0a0a0f; font-weight: 500;
  }

  /* ── Toggle pills ── */
  .bc-create-toggle {
    display: flex; gap: 6px;
    padding: 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    margin-bottom: 14px;
  }
  .bc-create-toggle-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400; letter-spacing: 0.05em;
    border-radius: 7px; border: none; cursor: pointer;
    background: transparent;
    color: rgba(220,215,205,0.4);
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .bc-create-toggle-btn:hover { color: #e8d5a3; background: rgba(200,169,110,0.05); }
  .bc-create-toggle-btn--active {
    background: rgba(200,169,110,0.12);
    border: 1px solid rgba(200,169,110,0.2);
    color: #c8a96e;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .bc-create-toggle-sub-label {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.3); margin-bottom: 7px;
  }

  .bc-create-timing-divider {
    height: 1px; background: rgba(255,255,255,0.05); margin: 18px 0;
  }

  /* ── Submit buttons ── */
  .bc-create-submit {
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
  .bc-create-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-create-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(200,169,110,0.38); }
  .bc-create-submit:hover:not(:disabled)::before { opacity: 1; }
  .bc-create-submit:disabled { opacity: 0.55; cursor: not-allowed; }
  .bc-create-submit-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(10,10,15,0.25); border-top-color: #0a0a0f;
    animation: bc-create-spin 0.8s linear infinite;
  }
  @keyframes bc-create-spin { to { transform: rotate(360deg); } }

  .bc-create-cancel {
    width: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(220,215,205,0.5); border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-create-cancel:hover {
    color: #e8d5a3; border-color: rgba(200,169,110,0.3); background: rgba(200,169,110,0.05);
  }
`;

const CATEGORIES = [
  "Electronics","Fashion","Home & Garden","Sports","Books",
  "Collectibles","Art","Jewelry","Automotive","Other",
];

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", description: "", category: "", basePrice: "",
    auctionDuration: "24", customEndTime: "", customStartTime: "",
  });
  const [scheduleType, setScheduleType] = useState("immediate");
  const [durationType, setDurationType]   = useState("fixed");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [imageFiles, setImageFiles]       = useState([]);
  const [imagePreview, setImagePreview]   = useState([]);
  const [dragActive, setDragActive]       = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    if (imageFiles.length + fileArray.length > 5) { setError("You can only upload a maximum of 5 images."); return; }
    setImageFiles(prev => [...prev, ...fileArray]);
    setImagePreview(prev => [...prev, ...fileArray.map(f => URL.createObjectURL(f))]);
    setError("");
  };

  const handleImageChange = (e) => { if (e.target.files?.length > 0) processFiles(e.target.files); };
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.length > 0) processFiles(e.dataTransfer.files);
  };
  const removeImage = (i) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
    setImagePreview(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (imageFiles.length === 0) throw new Error("Please upload at least one image.");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("basePrice", formData.basePrice);
      data.append("scheduleType", scheduleType);
      if (scheduleType === "scheduled") {
        if (!formData.customStartTime) throw new Error("Please select a start time.");
        if (new Date(formData.customStartTime).getTime() <= Date.now()) throw new Error("Start time must be in the future.");
        data.append("customStartTime", formData.customStartTime);
      }
      if (durationType === "fixed") {
        data.append("auctionDuration", formData.auctionDuration);
      } else {
        if (!formData.customEndTime) throw new Error("Please select an end time.");
        const endTime   = new Date(formData.customEndTime).getTime();
        const startTime = scheduleType === "scheduled" ? new Date(formData.customStartTime).getTime() : Date.now();
        if (endTime <= startTime) throw new Error("End time must be after the start time.");
        data.append("customEndTime", formData.customEndTime);
      }
      imageFiles.forEach(f => data.append("images", f));
      await api.post("/seller/items", data);
      navigate("/my-items");
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Failed to create item");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-create">
        <div className="bc-create-inner">

          {/* Header */}
          <div className="bc-create-header">
            <div>
              <div className="bc-create-eyebrow">Seller Portal</div>
              <h1 className="bc-create-title">Create <em>Listing</em></h1>
              <p className="bc-create-sub">Fill in the details below to launch a new auction.</p>
            </div>
            <button className="bc-create-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Error */}
            {error && (
              <div className="bc-create-error">
                <AlertCircle size={15} />
                <div>
                  <div className="bc-create-error-title">Error</div>
                  <div className="bc-create-error-text">{error}</div>
                </div>
              </div>
            )}

            <div className="bc-create-grid">

              {/* ── LEFT: Main details ── */}
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

                {/* Item Details */}
                <div className="bc-create-card">
                  <div className="bc-create-card-head">
                    <div className="bc-create-card-icon"><Package size={17} /></div>
                    <div>
                      <div className="bc-create-card-title">Item Details</div>
                    </div>
                  </div>
                  <div className="bc-create-fields">
                    <div className="bc-create-field">
                      <label className="bc-create-label">Item Title</label>
                      <div className="bc-create-input-wrap">
                        <div className="bc-create-input-icon"><Package size={14} /></div>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Vintage 1960s Camera" className="bc-create-input" />
                      </div>
                    </div>
                    <div className="bc-create-field">
                      <label className="bc-create-label">Category</label>
                      <div className="bc-create-input-wrap">
                        <div className="bc-create-input-icon"><Tag size={14} /></div>
                        <select name="category" value={formData.category} onChange={handleChange} required className="bc-create-select">
                          <option value="">Select a category</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="bc-create-field">
                      <label className="bc-create-label">Description</label>
                      <div className="bc-create-input-wrap">
                        <div className="bc-create-textarea-icon"><FileText size={14} /></div>
                        <textarea name="description" rows={5} value={formData.description} onChange={handleChange} required placeholder="Detailed description of the item, condition, provenance, etc." className="bc-create-textarea" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bc-create-card">
                  <div className="bc-create-card-head">
                    <div className="bc-create-card-icon"><ImageIcon size={17} /></div>
                    <div>
                      <div className="bc-create-card-title">Media</div>
                      <div className="bc-create-card-sub">Upload up to 5 photos of your item</div>
                    </div>
                  </div>

                  <div
                    className={`bc-create-dropzone${dragActive ? " bc-create-dropzone--active" : ""}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                    onDragOver={handleDrag} onDrop={handleDrop}
                  >
                    <input id="img-upload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{display:'none'}} />
                    <div className="bc-create-drop-icon"><Upload size={20} /></div>
                    <label htmlFor="img-upload" className="bc-create-drop-cta">Click to upload</label>
                    <p className="bc-create-drop-sub">or drag and drop images here</p>
                    <p className="bc-create-drop-hint">JPG, PNG, WEBP · up to 5MB · max 5 images</p>
                  </div>

                  {imagePreview.length > 0 && (
                    <div className="bc-create-previews">
                      {imagePreview.map((src, i) => (
                        <div key={i} className="bc-create-preview">
                          <img src={src} alt={`Preview ${i + 1}`} />
                          <div className="bc-create-preview-overlay">
                            <button type="button" className="bc-create-preview-del" onClick={() => removeImage(i)}>
                              <X size={13} />
                            </button>
                          </div>
                          {i === 0 && <div className="bc-create-preview-main">Main</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* ── RIGHT: Settings ── */}
              <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

                {/* Pricing */}
                <div className="bc-create-card">
                  <div className="bc-create-card-head">
                    <div className="bc-create-card-icon"><DollarSign size={17} /></div>
                    <div><div className="bc-create-card-title">Pricing</div></div>
                  </div>
                  <div className="bc-create-field">
                    <label className="bc-create-label">Starting Bid</label>
                    <div className="bc-create-input-wrap">
                      <span className="bc-create-price-symbol">$</span>
                      <input
                        type="number" name="basePrice" value={formData.basePrice}
                        onChange={handleChange} required min="0.01" step="0.01"
                        placeholder="0.00"
                        className="bc-create-input bc-create-input--price"
                      />
                    </div>
                    <p className="bc-create-hint">Minimum amount required from the first bidder.</p>
                  </div>
                </div>

                {/* Timing */}
                <div className="bc-create-card">
                  <div className="bc-create-card-head">
                    <div className="bc-create-card-icon"><Clock size={17} /></div>
                    <div><div className="bc-create-card-title">Timing</div></div>
                  </div>

                  <div className="bc-create-fields">
                    {/* Start time */}
                    <div className="bc-create-field">
                      <label className="bc-create-label">When to start?</label>
                      <div className="bc-create-toggle">
                        <button type="button" className={`bc-create-toggle-btn${scheduleType==='immediate'?' bc-create-toggle-btn--active':''}`} onClick={() => setScheduleType('immediate')}>
                          <Clock size={13} /> Immediate
                        </button>
                        <button type="button" className={`bc-create-toggle-btn${scheduleType==='scheduled'?' bc-create-toggle-btn--active':''}`} onClick={() => setScheduleType('scheduled')}>
                          <Calendar size={13} /> Schedule
                        </button>
                      </div>
                      {scheduleType === 'scheduled' && (
                        <div>
                          <div className="bc-create-toggle-sub-label">Start Date &amp; Time</div>
                          <input
                            type="datetime-local" name="customStartTime"
                            value={formData.customStartTime} onChange={handleChange}
                            min={new Date().toISOString().slice(0,16)}
                            className="bc-create-datetime"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bc-create-timing-divider" />

                    {/* Duration */}
                    <div className="bc-create-field">
                      <label className="bc-create-label">Duration</label>
                      <div className="bc-create-toggle">
                        <button type="button" className={`bc-create-toggle-btn${durationType==='fixed'?' bc-create-toggle-btn--active':''}`} onClick={() => setDurationType('fixed')}>
                          <Clock size={13} /> Fixed Time
                        </button>
                        <button type="button" className={`bc-create-toggle-btn${durationType==='custom'?' bc-create-toggle-btn--active':''}`} onClick={() => setDurationType('custom')}>
                          <Calendar size={13} /> Custom End
                        </button>
                      </div>
                      {durationType === 'fixed' ? (
                        <div className="bc-create-input-wrap">
                          <select name="auctionDuration" value={formData.auctionDuration} onChange={handleChange} className="bc-create-select bc-create-select--no-icon">
                            <option value="1">1 Hour</option>
                            <option value="6">6 Hours</option>
                            <option value="12">12 Hours</option>
                            <option value="24">1 Day</option>
                            <option value="48">2 Days</option>
                            <option value="72">3 Days</option>
                            <option value="168">1 Week</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <div className="bc-create-toggle-sub-label">End Date &amp; Time</div>
                          <input
                            type="datetime-local" name="customEndTime"
                            value={formData.customEndTime} onChange={handleChange} required
                            min={formData.customStartTime || new Date().toISOString().slice(0,16)}
                            className="bc-create-datetime"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <button type="submit" disabled={loading} className="bc-create-submit">
                    {loading
                      ? <div className="bc-create-submit-spin" />
                      : <><CheckCircle2 size={15} /> Launch Auction</>
                    }
                  </button>
                  <button type="button" onClick={() => navigate("/my-items")} className="bc-create-cancel">
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

export default CreateItem;