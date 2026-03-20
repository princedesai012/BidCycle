import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import debounce from '../utils/debounce';
import {
  Search, Filter, Trash2, Eye, Clock,
  AlertCircle, Package, ChevronLeft, ChevronRight, User
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-aitems * { box-sizing: border-box; }

  .bc-aitems {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-aitems-inner { max-width: 1280px; margin: 0 auto; }

  /* ── Header ── */
  .bc-aitems-header {
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-aitems-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-aitems-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-aitems-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-aitems-title em { font-style: italic; color: #c8a96e; }
  .bc-aitems-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* ── Error ── */
  .bc-aitems-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 13px 16px; margin-bottom: 24px;
    font-size: 13px; color: #fca5a5;
  }

  /* ── Filter bar ── */
  .bc-aitems-filters {
    background: rgba(13,12,20,0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(200,169,110,0.1);
    border-radius: 14px; padding: 14px 18px;
    margin-bottom: 28px;
    display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
  }

  .bc-aitems-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .bc-aitems-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none;
    transition: color 0.2s;
  }
  .bc-aitems-search-wrap:focus-within .bc-aitems-search-icon { color: #c8a96e; }
  .bc-aitems-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px 14px 10px 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-aitems-search::placeholder { color: rgba(200,195,185,0.2); }
  .bc-aitems-search:focus {
    border-color: rgba(200,169,110,0.45);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-aitems-status-wrap { position: relative; width: 100%; }
  @media (min-width: 480px) { .bc-aitems-status-wrap { width: 180px; } }
  .bc-aitems-status-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none;
  }
  .bc-aitems-status {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px 36px 10px 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none; appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c8a96e'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 14px;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  }
  .bc-aitems-status option { background: #13121a; color: #f0ebe0; }
  .bc-aitems-status:focus {
    border-color: rgba(200,169,110,0.45);
    background-color: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* ── Loading ── */
  .bc-aitems-loading {
    display: flex; align-items: center; justify-content: center;
    height: 240px;
  }
  .bc-aitems-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-aitems-spin 0.8s linear infinite;
  }
  @keyframes bc-aitems-spin { to { transform: rotate(360deg); } }

  /* ── Grid ── */
  .bc-aitems-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }
  @media (min-width: 640px)  { .bc-aitems-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .bc-aitems-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Item card ── */
  .bc-aitems-card {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bc-aitems-card:hover {
    border-color: rgba(200,169,110,0.22);
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(0,0,0,0.45);
  }

  /* Image */
  .bc-aitems-img-wrap {
    position: relative; height: 190px;
    background: #13121a; overflow: hidden;
  }
  .bc-aitems-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.55s ease;
  }
  .bc-aitems-card:hover .bc-aitems-img { transform: scale(1.06); }
  .bc-aitems-no-img {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; font-size: 12px; color: rgba(200,195,185,0.2); letter-spacing: 0.08em;
  }
  .bc-aitems-img-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.3s; pointer-events: none;
  }
  .bc-aitems-card:hover .bc-aitems-img-overlay { background: rgba(0,0,0,0.12); }

  /* Status badge on image */
  .bc-aitems-badge {
    position: absolute; top: 12px; right: 12px;
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 999px;
    font-size: 10px; letter-spacing: 0.06em;
    backdrop-filter: blur(8px);
  }
  .bc-aitems-badge--active  { background:rgba(16,185,129,0.18);  border:1px solid rgba(16,185,129,0.3);  color:#6ee7b7; }
  .bc-aitems-badge--expired { background:rgba(239,68,68,0.14);   border:1px solid rgba(239,68,68,0.25);  color:#fca5a5; }
  .bc-aitems-badge--sold    { background:rgba(59,130,246,0.14);  border:1px solid rgba(59,130,246,0.25); color:#93c5fd; }
  .bc-aitems-badge--closed  { background:rgba(107,114,128,0.14); border:1px solid rgba(107,114,128,0.25);color:#9ca3af; }

  /* Card body */
  .bc-aitems-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
  .bc-aitems-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: #f5f0e8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 7px; transition: color 0.2s;
  }
  .bc-aitems-card:hover .bc-aitems-card-title { color: #c8a96e; }
  .bc-aitems-seller {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: rgba(200,195,185,0.38);
    margin-bottom: 16px;
  }

  /* Bid / timer box */
  .bc-aitems-meta {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px; padding: 12px 14px;
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 14px; margin-top: auto;
  }
  .bc-aitems-meta-label {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.3); margin-bottom: 4px;
  }
  .bc-aitems-meta-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #c8a96e; line-height: 1;
  }
  .bc-aitems-meta-timer {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: rgba(245,158,11,0.7);
    text-align: right;
  }

  /* Action buttons */
  .bc-aitems-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .bc-aitems-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 9px; text-decoration: none;
    border: 1px solid; cursor: pointer; background: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .bc-aitems-btn--view {
    border-color: rgba(200,169,110,0.2); color: rgba(200,169,110,0.65);
  }
  .bc-aitems-btn--view:hover { background: rgba(200,169,110,0.08); color: #c8a96e; border-color: rgba(200,169,110,0.38); }
  .bc-aitems-btn--del {
    border-color: rgba(239,68,68,0.18); color: rgba(248,113,113,0.6);
  }
  .bc-aitems-btn--del:hover:not(:disabled) { background: rgba(239,68,68,0.09); color: #f87171; border-color: rgba(239,68,68,0.32); }
  .bc-aitems-btn--del:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Empty ── */
  .bc-aitems-empty {
    background: #0d0c14;
    border: 1px dashed rgba(200,169,110,0.12);
    border-radius: 18px; padding: 72px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-aitems-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(200,169,110,0.06); border: 1px solid rgba(200,169,110,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.28); margin-bottom: 14px;
  }
  .bc-aitems-empty p { font-size: 13px; color: rgba(200,195,185,0.32); }

  /* ── Pagination ── */
  .bc-aitems-pagination {
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .bc-aitems-page-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 999px;
    color: rgba(220,215,205,0.5);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-aitems-page-btn:hover:not(:disabled) {
    color: #e8d5a3; border-color: rgba(200,169,110,0.35); background: rgba(200,169,110,0.07);
  }
  .bc-aitems-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .bc-aitems-page-info {
    padding: 8px 18px; font-size: 12px; letter-spacing: 0.06em;
    color: rgba(200,195,185,0.38);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
  }
  .bc-aitems-page-info span {
    color: #c8a96e;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400;
  }
`;

const AdminItems = () => {
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [inputValue, setInputValue]   = useState('');
  const [search, setSearch]           = useState('');
  const [status, setStatus]           = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [deleting, setDeleting]       = useState(null);

  const debouncedUpdate = useCallback(
    debounce((value) => { setSearch(value); setCurrentPage(1); }, 500), []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdate(value);
  };

  useEffect(() => { fetchItems(); }, [currentPage, search, status]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/items?page=${currentPage}&search=${search}&status=${status}`);
      setItems(res.data.items);
      setTotalPages(res.data.pagination.total);
    } catch (err) {
      setError('Failed to load items');
      console.error('Fetch items error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;
    try {
      setDeleting(itemId);
      await api.delete(`/admin/items/${itemId}`);
      setItems(items.filter(i => i._id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
      console.error('Delete item error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (item) => {
    const now = new Date(), end = new Date(item.endTime);
    if (item.status === 'sold')   return <div className="bc-aitems-badge bc-aitems-badge--sold">Sold</div>;
    if (item.status === 'closed') return <div className="bc-aitems-badge bc-aitems-badge--closed">Closed</div>;
    if (end <= now)               return <div className="bc-aitems-badge bc-aitems-badge--expired">Expired</div>;
    return <div className="bc-aitems-badge bc-aitems-badge--active">Active</div>;
  };

  const formatTimeRemaining = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    return d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-aitems">
        <div className="bc-aitems-inner">

          {/* Header */}
          <div className="bc-aitems-header">
            <div className="bc-aitems-eyebrow">Admin Panel</div>
            <h1 className="bc-aitems-title">Manage <em>Items</em></h1>
            <p className="bc-aitems-sub">Monitor and moderate auction listings</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bc-aitems-error">
              <AlertCircle size={15} style={{flexShrink:0}} /> {error}
            </div>
          )}

          {/* Filters */}
          <div className="bc-aitems-filters">
            <div className="bc-aitems-search-wrap">
              <div className="bc-aitems-search-icon"><Search size={14} /></div>
              <input
                type="text" placeholder="Search items by title…"
                value={inputValue} onChange={handleInputChange}
                className="bc-aitems-search"
              />
            </div>
            <div className="bc-aitems-status-wrap">
              <div className="bc-aitems-status-icon"><Filter size={13} /></div>
              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}
                className="bc-aitems-status"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="bc-aitems-loading"><div className="bc-aitems-spinner" /></div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="bc-aitems-empty">
                  <div className="bc-aitems-empty-icon"><Package size={22} /></div>
                  <p>No items found matching your criteria.</p>
                </div>
              ) : (
                <div className="bc-aitems-grid">
                  {items.map(item => {
                    const isActive = item.status === 'active' && new Date(item.endTime) > new Date();
                    return (
                      <div key={item._id} className="bc-aitems-card">
                        {/* Image */}
                        <div className="bc-aitems-img-wrap">
                          {item.images?.length > 0 ? (
                            <img src={item.images[0]} alt={item.title} className="bc-aitems-img" />
                          ) : (
                            <div className="bc-aitems-no-img">
                              <Package size={26} style={{color:'rgba(200,169,110,0.15)'}} />
                              No Image
                            </div>
                          )}
                          <div className="bc-aitems-img-overlay" />
                          {getStatusBadge(item)}
                        </div>

                        {/* Body */}
                        <div className="bc-aitems-body">
                          <div className="bc-aitems-card-title">{item.title}</div>
                          <div className="bc-aitems-seller">
                            <User size={12} /> Seller: {item.seller?.name || 'Unknown'}
                          </div>

                          <div className="bc-aitems-meta">
                            <div>
                              <div className="bc-aitems-meta-label">Current Bid</div>
                              <div className="bc-aitems-meta-val">${item.currentBid || item.basePrice}</div>
                            </div>
                            {isActive && (
                              <div style={{textAlign:'right'}}>
                                <div className="bc-aitems-meta-label">Ends In</div>
                                <div className="bc-aitems-meta-timer">
                                  <Clock size={11} /> {formatTimeRemaining(item.endTime)}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="bc-aitems-actions">
                            <Link to={`/item/${item._id}`} className="bc-aitems-btn bc-aitems-btn--view">
                              <Eye size={12} /> View
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id)}
                              disabled={deleting === item._id}
                              className="bc-aitems-btn bc-aitems-btn--del"
                            >
                              {deleting === item._id
                                ? '…'
                                : <><Trash2 size={12} /> Delete</>
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bc-aitems-pagination">
                  <button
                    className="bc-aitems-page-btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="bc-aitems-page-info">
                    Page <span>{currentPage}</span> of {totalPages}
                  </div>
                  <button
                    className="bc-aitems-page-btn"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminItems;