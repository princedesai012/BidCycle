import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Gavel,
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-myitems * { box-sizing: border-box; }

  .bc-myitems {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-myitems-inner { max-width: 1280px; margin: 0 auto; }

  /* ── Loading ── */
  .bc-myitems-loading {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-myitems-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-mi-spin 0.8s linear infinite;
  }
  @keyframes bc-mi-spin { to { transform: rotate(360deg); } }

  /* ── Header ── */
  .bc-myitems-header {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-myitems-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-myitems-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-myitems-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-myitems-title em { font-style: italic; color: #c8a96e; }
  .bc-myitems-sub {
    font-size: 13px; color: rgba(200,195,185,0.38);
    margin-top: 6px; letter-spacing: 0.02em;
  }

  .bc-myitems-create-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #0a0a0f; text-decoration: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .bc-myitems-create-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-myitems-create-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,0.35); }
  .bc-myitems-create-btn:hover::before { opacity: 1; }

  /* ── Stats ── */
  .bc-myitems-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 28px;
  }
  @media (min-width: 640px) { .bc-myitems-stats { grid-template-columns: repeat(3, 1fr); } }

  .bc-myitems-stat {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px 22px;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color 0.25s, transform 0.25s;
  }
  .bc-myitems-stat:hover { border-color: rgba(200,169,110,0.18); transform: translateY(-2px); }
  .bc-myitems-stat-label {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(200,195,185,0.33); margin-bottom: 6px;
  }
  .bc-myitems-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300; color: #f5f0e8; line-height: 1;
  }
  .bc-myitems-stat-val--gold  { color: #c8a96e; }
  .bc-myitems-stat-val--green { color: #6ee7b7; }
  .bc-myitems-stat-val--dim   { color: rgba(200,195,185,0.5); }
  .bc-myitems-stat-icon {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.07);
    border: 1px solid rgba(200,169,110,0.18);
    color: #c8a96e;
    transition: background 0.25s, box-shadow 0.25s;
  }
  .bc-myitems-stat:hover .bc-myitems-stat-icon {
    background: rgba(200,169,110,0.12);
    box-shadow: 0 0 14px rgba(200,169,110,0.1);
  }

  /* ── Filter bar ── */
  .bc-myitems-filterbar {
    background: rgba(13,12,20,0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(200,169,110,0.1);
    border-radius: 14px;
    padding: 14px 18px;
    margin-bottom: 28px;
    display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
    justify-content: space-between;
  }

  /* Tabs */
  .bc-myitems-tabs { display: flex; gap: 6px; }
  .bc-myitems-tab {
    padding: 7px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.06em; text-transform: capitalize;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: rgba(220,215,205,0.45);
    cursor: pointer;
    transition: all 0.2s;
  }
  .bc-myitems-tab:hover { color: #e8d5a3; border-color: rgba(200,169,110,0.28); background: rgba(200,169,110,0.05); }
  .bc-myitems-tab--active {
    background: linear-gradient(135deg, #c8a96e, #a07840);
    border-color: transparent;
    color: #0a0a0f; font-weight: 500;
    box-shadow: 0 4px 14px rgba(200,169,110,0.28);
  }

  /* Search */
  .bc-myitems-search-wrap { position: relative; width: 100%; }
  @media (min-width: 480px) { .bc-myitems-search-wrap { width: 260px; } }
  .bc-myitems-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none;
    transition: color 0.2s;
  }
  .bc-myitems-search-wrap:focus-within .bc-myitems-search-icon { color: #c8a96e; }
  .bc-myitems-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 9px 14px 9px 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-myitems-search::placeholder { color: rgba(200,195,185,0.2); }
  .bc-myitems-search:focus {
    border-color: rgba(200,169,110,0.45);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* ── Error banner ── */
  .bc-myitems-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    padding: 13px 16px;
    margin-bottom: 24px;
    font-size: 13px; color: #fca5a5;
    animation: bc-mi-shake 0.35s ease;
  }
  @keyframes bc-mi-shake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)}
  }

  /* ── Empty state ── */
  .bc-myitems-empty {
    background: #0d0c14;
    border: 1px dashed rgba(200,169,110,0.12);
    border-radius: 18px;
    padding: 72px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-myitems-empty-icon {
    width: 56px; height: 56px; border-radius: 15px;
    background: rgba(200,169,110,0.06);
    border: 1px solid rgba(200,169,110,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.28); margin-bottom: 18px;
  }
  .bc-myitems-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #f5f0e8; margin-bottom: 8px;
  }
  .bc-myitems-empty p { font-size: 13px; color: rgba(200,195,185,0.35); margin-bottom: 24px; }

  /* ── Grid ── */
  .bc-myitems-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 540px) { .bc-myitems-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .bc-myitems-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1200px) { .bc-myitems-grid { grid-template-columns: repeat(4, 1fr); } }

  /* ── Item card ── */
  .bc-mi-card {
    display: flex; flex-direction: column;
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bc-mi-card:hover {
    border-color: rgba(200,169,110,0.22);
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(0,0,0,0.45);
  }

  /* Image */
  .bc-mi-img-wrap {
    position: relative; height: 190px;
    background: #13121a; overflow: hidden;
  }
  .bc-mi-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
  }
  .bc-mi-card:hover .bc-mi-img { transform: scale(1.07); }
  .bc-mi-no-img {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: rgba(200,195,185,0.2); letter-spacing: 0.1em;
  }
  .bc-mi-img-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.3s; pointer-events: none;
  }
  .bc-mi-card:hover .bc-mi-img-overlay { background: rgba(0,0,0,0.12); }

  /* Status badge */
  .bc-mi-badge {
    position: absolute; top: 12px; right: 12px;
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 999px;
    font-size: 10px; font-weight: 500; letter-spacing: 0.07em;
    backdrop-filter: blur(8px);
  }
  .bc-mi-badge--upcoming { background: rgba(59,130,246,0.18); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; }
  .bc-mi-badge--active   { background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; }
  .bc-mi-badge--ended    { background: rgba(107,114,128,0.18); border: 1px solid rgba(107,114,128,0.28); color: #9ca3af; }

  /* Card body */
  .bc-mi-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }

  .bc-mi-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: #f5f0e8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 6px; transition: color 0.2s;
  }
  .bc-mi-card:hover .bc-mi-title { color: #c8a96e; }

  .bc-mi-desc {
    font-size: 12px; font-weight: 300;
    color: rgba(220,215,205,0.38); line-height: 1.65;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; min-height: 36px; margin-bottom: 16px;
  }

  /* Bottom section */
  .bc-mi-bottom {
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 14px;
  }

  /* Upcoming info box */
  .bc-mi-upcoming-box {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.14);
    border-radius: 10px; padding: 12px;
    margin-bottom: 12px;
  }
  .bc-mi-upcoming-label {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(147,197,253,0.6); margin-bottom: 4px;
  }
  .bc-mi-upcoming-date {
    font-size: 12px; font-weight: 400; color: #e8d5a3; margin-bottom: 6px;
  }
  .bc-mi-upcoming-timer {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: #93c5fd;
  }

  /* Bid/timer row */
  .bc-mi-bid-row {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 8px;
  }
  .bc-mi-bid-label {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.3); margin-bottom: 4px;
  }
  .bc-mi-bid-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #c8a96e; line-height: 1;
  }
  .bc-mi-bids-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 300; color: rgba(200,195,185,0.6);
    text-align: right; line-height: 1;
  }
  .bc-mi-ends-row {
    display: flex; align-items: center; justify-content: flex-end; gap: 5px;
    font-size: 11px; color: rgba(245,158,11,0.7); margin-bottom: 12px;
  }

  /* Action buttons */
  .bc-mi-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .bc-mi-action-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase;
    border-radius: 9px; text-decoration: none;
    border: 1px solid; cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    background: none;
  }
  .bc-mi-action-btn--view {
    border-color: rgba(200,169,110,0.2); color: rgba(200,169,110,0.7);
  }
  .bc-mi-action-btn--view:hover { background: rgba(200,169,110,0.08); color: #c8a96e; border-color: rgba(200,169,110,0.4); }
  .bc-mi-action-btn--edit {
    border-color: rgba(251,191,36,0.2); color: rgba(251,191,36,0.6);
  }
  .bc-mi-action-btn--edit:hover { background: rgba(251,191,36,0.07); color: #fbbf24; border-color: rgba(251,191,36,0.35); }
  .bc-mi-action-btn--bids {
    border-color: rgba(16,185,129,0.2); color: rgba(16,185,129,0.6);
  }
  .bc-mi-action-btn--bids:hover { background: rgba(16,185,129,0.07); color: #6ee7b7; border-color: rgba(16,185,129,0.35); }
  .bc-mi-action-btn--delete {
    grid-column: 1 / -1;
    border-color: rgba(239,68,68,0.15); color: rgba(239,68,68,0.55);
  }
  .bc-mi-action-btn--delete:hover { background: rgba(239,68,68,0.07); color: #f87171; border-color: rgba(239,68,68,0.3); }
`;

const MyItems = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setTick]                 = useState(0);

  useEffect(() => {
    fetchMyItems();
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seller/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/seller/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete item');
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatTimer = (item) => {
    const now = new Date(), start = item.startTime ? new Date(item.startTime) : new Date(), end = new Date(item.endTime);
    if (now < start) {
      const diff = start - now;
      const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
            m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      return d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
    }
    const diff = end - now;
    if (diff <= 0) return '00s';
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    return d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
  };

  const filteredItems = items.filter(item => {
    const now = new Date(), start = new Date(item.startTime), end = new Date(item.endTime);
    const isEnded    = ['sold','expired','closed'].includes(item.status) || now >= end;
    const isUpcoming = now < start;
    const isActive   = !isUpcoming && !isEnded;
    let matchesFilter = false;
    if (filter === 'all')    matchesFilter = true;
    else if (filter === 'active') matchesFilter = isActive || isUpcoming;
    else if (filter === 'ended')  matchesFilter = isEnded;
    return matchesFilter && item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalActive = items.filter(i => new Date(i.endTime) > new Date()).length;
  const totalEnded  = items.filter(i => new Date(i.endTime) <= new Date()).length;

  if (loading) return (
    <div className="bc-myitems-loading"><div className="bc-myitems-spinner" /></div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="bc-myitems">
        <div className="bc-myitems-inner">

          {/* ── Header ── */}
          <div className="bc-myitems-header">
            <div>
              <div className="bc-myitems-eyebrow">Seller Portal</div>
              <h1 className="bc-myitems-title">My <em>Listings</em></h1>
              <p className="bc-myitems-sub">Manage and track your auction items</p>
            </div>
            <Link to="/create-item" className="bc-myitems-create-btn">
              <Plus size={14} /> Create New Item
            </Link>
          </div>

          {/* ── Stats ── */}
          <div className="bc-myitems-stats">
            <div className="bc-myitems-stat">
              <div>
                <div className="bc-myitems-stat-label">Total Listed</div>
                <div className={`bc-myitems-stat-val bc-myitems-stat-val--gold`}>{items.length}</div>
              </div>
              <div className="bc-myitems-stat-icon"><Gavel size={18} /></div>
            </div>
            <div className="bc-myitems-stat">
              <div>
                <div className="bc-myitems-stat-label">Active & Upcoming</div>
                <div className={`bc-myitems-stat-val bc-myitems-stat-val--green`}>{totalActive}</div>
              </div>
              <div className="bc-myitems-stat-icon"><Clock size={18} /></div>
            </div>
            <div className="bc-myitems-stat">
              <div>
                <div className="bc-myitems-stat-label">Ended Auctions</div>
                <div className={`bc-myitems-stat-val bc-myitems-stat-val--dim`}>{totalEnded}</div>
              </div>
              <div className="bc-myitems-stat-icon"><CheckCircle2 size={18} /></div>
            </div>
          </div>

          {/* ── Filter bar ── */}
          <div className="bc-myitems-filterbar">
            <div className="bc-myitems-tabs">
              {['all', 'active', 'ended'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`bc-myitems-tab${filter === type ? ' bc-myitems-tab--active' : ''}`}
                >
                  {type === 'active' ? 'Active & Upcoming' : type}
                </button>
              ))}
            </div>
            <div className="bc-myitems-search-wrap">
              <div className="bc-myitems-search-icon"><Search size={14} /></div>
              <input
                type="text"
                placeholder="Search items…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bc-myitems-search"
              />
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="bc-myitems-error">
              <AlertCircle size={15} style={{flexShrink:0}} /> {error}
            </div>
          )}

          {/* ── Content ── */}
          {filteredItems.length === 0 ? (
            <div className="bc-myitems-empty">
              <div className="bc-myitems-empty-icon"><Filter size={22} /></div>
              <h3>No items found</h3>
              <p>Try adjusting your filters or create a new listing.</p>
              {filter === 'all' && searchQuery === '' && (
                <Link to="/create-item" className="bc-myitems-create-btn">
                  <Plus size={13} /> Create Item
                </Link>
              )}
            </div>
          ) : (
            <div className="bc-myitems-grid">
              {filteredItems.map(item => {
                const now   = new Date();
                const start = new Date(item.startTime);
                const end   = new Date(item.endTime);
                const isEnded    = ['sold','expired','closed'].includes(item.status) || now >= end;
                const isUpcoming = now < start;
                const isActive   = !isUpcoming && !isEnded;

                return (
                  <div key={item._id} className="bc-mi-card">
                    {/* Image */}
                    <div className="bc-mi-img-wrap">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0] || "https://placehold.co/600x400/13121a/c8a96e?text=No+Image"} alt={item.title} className="bc-mi-img" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/13121a/c8a96e?text=No+Image"; }} />
                      ) : (
                        <div className="bc-mi-no-img">No Image</div>
                      )}
                      <div className="bc-mi-img-overlay" />
                      {isUpcoming && <div className="bc-mi-badge bc-mi-badge--upcoming"><Calendar size={10} /> Upcoming</div>}
                      {isEnded    && <div className="bc-mi-badge bc-mi-badge--ended"><XCircle size={10} /> Ended</div>}
                      {isActive   && <div className="bc-mi-badge bc-mi-badge--active"><Clock size={10} /> Active</div>}
                    </div>

                    {/* Body */}
                    <div className="bc-mi-body">
                      <div className="bc-mi-title">{item.title}</div>
                      <p className="bc-mi-desc">{item.description}</p>

                      <div className="bc-mi-bottom">
                        {isUpcoming ? (
                          <div className="bc-mi-upcoming-box">
                            <div className="bc-mi-upcoming-label">Starts On</div>
                            <div className="bc-mi-upcoming-date">
                              {start.toLocaleDateString()} at {start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </div>
                            <div className="bc-mi-upcoming-timer">
                              <Clock size={11} /> Starts in {formatTimer(item)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="bc-mi-bid-row">
                              <div>
                                <div className="bc-mi-bid-label">Current Bid</div>
                                <div className="bc-mi-bid-val">₹{item.currentBid || item.basePrice}</div>
                              </div>
                              <div>
                                <div className="bc-mi-bid-label" style={{textAlign:'right'}}>Bids</div>
                                <div className="bc-mi-bids-val">{item.bidCount || 0}</div>
                              </div>
                            </div>
                            {!isEnded && (
                              <div className="bc-mi-ends-row">
                                <Clock size={11} /> Ends in {formatTimer(item)}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="bc-mi-actions">
                          <Link to={`/item/${item._id}`} className="bc-mi-action-btn bc-mi-action-btn--view">
                            <Eye size={12} /> View
                          </Link>
                          {!isEnded ? (
                            <Link to={`/edit-item/${item._id}`} className="bc-mi-action-btn bc-mi-action-btn--edit">
                              <Edit size={12} /> Edit
                            </Link>
                          ) : (
                            <Link to={`/item/${item._id}`} className="bc-mi-action-btn bc-mi-action-btn--bids">
                              <Gavel size={12} /> Bids
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bc-mi-action-btn bc-mi-action-btn--delete"
                          >
                            <Trash2 size={12} /> Delete Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MyItems;