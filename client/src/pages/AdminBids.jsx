import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Gavel, Trash2, AlertCircle, ChevronLeft,
  ChevronRight, Package, Calendar
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-abids * { box-sizing: border-box; }

  .bc-abids {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-abids-inner { max-width: 1280px; margin: 0 auto; }

  /* ── Header ── */
  .bc-abids-header {
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-abids-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-abids-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-abids-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-abids-title em { font-style: italic; color: #c8a96e; }
  .bc-abids-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* ── Error ── */
  .bc-abids-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 13px 16px; margin-bottom: 24px;
    font-size: 13px; color: #fca5a5;
  }

  /* ── Loading ── */
  .bc-abids-loading {
    display: flex; align-items: center; justify-content: center;
    height: 240px; flex-direction: column; gap: 14px;
  }
  .bc-abids-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-abids-spin 0.8s linear infinite;
  }
  @keyframes bc-abids-spin { to { transform: rotate(360deg); } }

  /* ── Panel ── */
  .bc-abids-panel {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 28px;
  }

  /* ── Table ── */
  .bc-abids-table-wrap { overflow-x: auto; }
  .bc-abids-table { width: 100%; border-collapse: collapse; }

  .bc-abids-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .bc-abids-table th {
    padding: 14px 20px;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(200,195,185,0.25); font-weight: 400; text-align: left;
    white-space: nowrap;
  }
  .bc-abids-table th:last-child { text-align: right; }

  .bc-abids-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .bc-abids-table tbody tr:last-child { border-bottom: none; }
  .bc-abids-table tbody tr:hover { background: rgba(200,169,110,0.03); }

  .bc-abids-table td {
    padding: 14px 20px;
    font-size: 13px;
    color: rgba(220,215,205,0.6);
    vertical-align: middle;
  }
  .bc-abids-table td:last-child { text-align: right; }

  /* Bidder cell */
  .bc-abids-bidder { display: flex; align-items: center; gap: 10px; }
  .bc-abids-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-weight: 400; color: #c8a96e;
  }
  .bc-abids-bidder-name { font-size: 13px; color: #e8d5a3; font-weight: 400; }
  .bc-abids-bidder-email { font-size: 11px; color: rgba(200,195,185,0.32); margin-top: 1px; }

  /* Item cell */
  .bc-abids-item-cell { display: flex; align-items: center; gap: 8px; }
  .bc-abids-item-link {
    font-size: 13px; color: rgba(220,215,205,0.7); text-decoration: none;
    max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    transition: color 0.2s;
  }
  .bc-abids-item-link:hover { color: #c8a96e; }
  .bc-abids-item-current {
    font-size: 11px; color: rgba(200,195,185,0.3);
    margin-top: 3px; padding-left: 22px;
  }

  /* Amount badge */
  .bc-abids-amount {
    display: inline-flex; align-items: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: #c8a96e;
  }

  /* Date */
  .bc-abids-date {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: rgba(200,195,185,0.32);
  }

  /* Delete button */
  .bc-abids-del-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 400; letter-spacing: 0.06em;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.18);
    color: rgba(248,113,113,0.65);
    cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .bc-abids-del-btn:hover:not(:disabled) {
    background: rgba(239,68,68,0.14);
    border-color: rgba(239,68,68,0.3);
    color: #f87171;
  }
  .bc-abids-del-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Empty state */
  .bc-abids-empty {
    padding: 64px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-abids-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(200,169,110,0.06); border: 1px solid rgba(200,169,110,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.28); margin-bottom: 14px;
  }
  .bc-abids-empty p { font-size: 13px; color: rgba(200,195,185,0.3); letter-spacing: 0.04em; }

  /* ── Pagination ── */
  .bc-abids-pagination {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 8px;
  }
  .bc-abids-page-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 999px;
    font-family: 'DM Sans', sans-serif;
    color: rgba(220,215,205,0.5);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-abids-page-btn:hover:not(:disabled) {
    color: #e8d5a3; border-color: rgba(200,169,110,0.35); background: rgba(200,169,110,0.07);
  }
  .bc-abids-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .bc-abids-page-info {
    padding: 8px 18px;
    font-size: 12px; letter-spacing: 0.06em;
    color: rgba(200,195,185,0.38);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
  }
  .bc-abids-page-info span {
    color: #c8a96e;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400;
  }
`;

const AdminBids = () => {
  const [bids, setBids]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [itemId]                    = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting]     = useState(null);

  useEffect(() => { fetchBids(); }, [currentPage, itemId]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/bids?page=${currentPage}&itemId=${itemId}`);
      setBids(res.data.bids);
      setTotalPages(res.data.pagination.total);
    } catch (err) {
      setError('Failed to load bids');
      console.error('Fetch bids error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm('Are you sure you want to delete this bid? This action cannot be undone.')) return;
    try {
      setDeleting(bidId);
      await api.delete(`/admin/bids/${bidId}`);
      setBids(bids.filter(b => b._id !== bidId));
    } catch (err) {
      alert('Failed to delete bid');
      console.error('Delete bid error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <>
      <style>{styles}</style>
      <div className="bc-abids">
        <div className="bc-abids-inner">

          {/* Header */}
          <div className="bc-abids-header">
            <div className="bc-abids-eyebrow">Admin Panel</div>
            <h1 className="bc-abids-title">Manage <em>Bids</em></h1>
            <p className="bc-abids-sub">Oversee all bidding activity across the platform</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bc-abids-error">
              <AlertCircle size={15} style={{flexShrink:0}} /> {error}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="bc-abids-loading">
              <div className="bc-abids-spinner" />
            </div>
          ) : (
            <>
              <div className="bc-abids-panel">
                <div className="bc-abids-table-wrap">
                  <table className="bc-abids-table">
                    <thead>
                      <tr>
                        <th>Bidder</th>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bids.map(bid => (
                        <tr key={bid._id}>
                          {/* Bidder */}
                          <td>
                            <div className="bc-abids-bidder">
                              <div className="bc-abids-avatar">
                                {bid.bidder?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <div className="bc-abids-bidder-name">{bid.bidder?.name || 'Unknown'}</div>
                                <div className="bc-abids-bidder-email">{bid.bidder?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>

                          {/* Item */}
                          <td>
                            <div className="bc-abids-item-cell">
                              <Package size={13} style={{color:'rgba(200,169,110,0.4)', flexShrink:0}} />
                              <Link to={`/item/${bid.item?._id}`} className="bc-abids-item-link">
                                {bid.item?.title || 'Unknown Item'}
                              </Link>
                            </div>
                            <div className="bc-abids-item-current">
                              Current: {formatAmount(bid.item?.currentBid || 0)}
                            </div>
                          </td>

                          {/* Amount */}
                          <td>
                            <span className="bc-abids-amount">{formatAmount(bid.amount)}</span>
                          </td>

                          {/* Date */}
                          <td>
                            <div className="bc-abids-date">
                              <Calendar size={12} style={{flexShrink:0}} />
                              {formatDate(bid.createdAt)}
                            </div>
                          </td>

                          {/* Delete */}
                          <td>
                            <button
                              onClick={() => handleDelete(bid._id)}
                              disabled={deleting === bid._id}
                              className="bc-abids-del-btn"
                            >
                              {deleting === bid._id
                                ? 'Deleting…'
                                : <><Trash2 size={12} /> Delete</>
                              }
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {bids.length === 0 && (
                  <div className="bc-abids-empty">
                    <div className="bc-abids-empty-icon"><Gavel size={22} /></div>
                    <p>No bids found.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bc-abids-pagination">
                  <button
                    className="bc-abids-page-btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="bc-abids-page-info">
                    Page <span>{currentPage}</span> of {totalPages}
                  </div>
                  <button
                    className="bc-abids-page-btn"
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

export default AdminBids;