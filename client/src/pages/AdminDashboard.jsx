import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Users, Package, Gavel, Timer, Archive,
  Ban, DollarSign, Activity, ArrowRight
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-adash * { box-sizing: border-box; }

  .bc-adash {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-adash-inner { max-width: 1280px; margin: 0 auto; }

  /* ── Full-page states ── */
  .bc-adash-center {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-adash-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-adash-spin 0.8s linear infinite;
  }
  @keyframes bc-adash-spin { to { transform: rotate(360deg); } }
  .bc-adash-err {
    display: flex; align-items: center; gap: 12px;
    background: rgba(239,68,68,0.09); border: 1px solid rgba(239,68,68,0.22);
    border-radius: 14px; padding: 18px 24px;
    font-size: 14px; color: #fca5a5;
  }

  /* ── Header ── */
  .bc-adash-header {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    margin-bottom: 40px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-adash-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-adash-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-adash-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-adash-title em { font-style: italic; color: #c8a96e; }
  .bc-adash-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* Status pill */
  .bc-adash-status {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 999px;
    font-size: 11px; letter-spacing: 0.1em;
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.2);
    color: rgba(110,231,183,0.75);
  }
  .bc-adash-status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6ee7b7;
    animation: bc-adash-pulse 2s ease-in-out infinite;
    box-shadow: 0 0 6px rgba(110,231,183,0.6);
  }
  @keyframes bc-adash-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* ── Stats grid ── */
  .bc-adash-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 36px;
  }
  @media (min-width: 480px) { .bc-adash-stats { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .bc-adash-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1200px) { .bc-adash-stats { grid-template-columns: repeat(4, 1fr); } }

  .bc-adash-stat {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 22px 22px;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bc-adash-stat:hover {
    border-color: rgba(200,169,110,0.2);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.4);
  }
  .bc-adash-stat-label {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(200,195,185,0.33); margin-bottom: 6px;
  }
  .bc-adash-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 300; line-height: 1; color: #f5f0e8;
  }
  .bc-adash-stat-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.07);
    border: 1px solid rgba(200,169,110,0.18);
    color: #c8a96e;
    transition: background 0.25s, box-shadow 0.25s;
  }
  .bc-adash-stat:hover .bc-adash-stat-icon {
    background: rgba(200,169,110,0.13);
    box-shadow: 0 0 16px rgba(200,169,110,0.12);
  }

  /* ── Activity columns ── */
  .bc-adash-activity {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }
  @media (min-width: 900px) { .bc-adash-activity { grid-template-columns: repeat(3, 1fr); } }

  /* Activity panel */
  .bc-adash-col {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
    display: flex; flex-direction: column;
    height: 480px;
  }
  .bc-adash-col-head {
    padding: 18px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .bc-adash-col-title {
    display: flex; align-items: center; gap: 9px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: #f5f0e8;
  }
  .bc-adash-col-title svg { color: #c8a96e; }
  .bc-adash-col-link {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(200,169,110,0.55); text-decoration: none;
    transition: color 0.2s, gap 0.2s;
  }
  .bc-adash-col-link:hover { color: #c8a96e; gap: 7px; }

  /* Scroll area */
  .bc-adash-col-scroll {
    flex: 1; overflow-y: auto;
    padding: 10px;
    scrollbar-width: thin;
    scrollbar-color: rgba(200,169,110,0.18) transparent;
  }
  .bc-adash-col-scroll::-webkit-scrollbar { width: 4px; }
  .bc-adash-col-scroll::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.18); border-radius: 999px; }

  /* Row */
  .bc-adash-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    border-radius: 11px;
    transition: background 0.15s;
    margin-bottom: 2px;
  }
  .bc-adash-row:hover { background: rgba(200,169,110,0.04); }

  /* User avatar */
  .bc-adash-u-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: rgba(200,169,110,0.1); border: 1px solid rgba(200,169,110,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 400; color: #c8a96e;
  }
  .bc-adash-u-name { font-size: 13px; color: #e8d5a3; font-weight: 400; }
  .bc-adash-u-email { font-size: 11px; color: rgba(200,195,185,0.32); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Role badge */
  .bc-adash-role {
    display: inline-flex; padding: 3px 9px; border-radius: 999px; flex-shrink: 0;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .bc-adash-role--seller { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.22); color: rgba(196,181,253,0.8); }
  .bc-adash-role--buyer  { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.2);  color: rgba(110,231,183,0.8); }

  /* Item thumb */
  .bc-adash-i-thumb {
    width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0;
    background: #13121a; border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden; display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.25);
  }
  .bc-adash-i-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .bc-adash-i-title { font-size: 12px; color: #e8d5a3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bc-adash-i-seller { font-size: 11px; color: rgba(200,195,185,0.32); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bc-adash-i-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 300; color: #c8a96e;
    text-align: right; flex-shrink: 0;
  }
  .bc-adash-i-date { font-size: 10px; color: rgba(200,195,185,0.28); text-align: right; }

  /* Bid row */
  .bc-adash-b-icon {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: rgba(200,169,110,0.08); border: 1px solid rgba(200,169,110,0.15);
    display: flex; align-items: center; justify-content: center; color: #c8a96e;
  }
  .bc-adash-b-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 300; color: #c8a96e; line-height: 1;
  }
  .bc-adash-b-meta { font-size: 11px; color: rgba(200,195,185,0.35); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bc-adash-b-meta strong { color: rgba(220,215,205,0.7); font-weight: 400; }
  .bc-adash-b-date {
    flex-shrink: 0; padding: 4px 9px; border-radius: 7px;
    font-size: 10px; color: rgba(200,195,185,0.3);
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
  }

  /* Empty state */
  .bc-adash-empty {
    height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; gap: 10px;
  }
  .bc-adash-empty-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(200,169,110,0.05); border: 1px solid rgba(200,169,110,0.1);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.22);
  }
  .bc-adash-empty p { font-size: 12px; color: rgba(200,195,185,0.28); letter-spacing: 0.04em; }
`;

const STAT_CONFIGS = [
  { key: 'totalUsers',     label: 'Total Users',     icon: Users },
  { key: 'totalItems',     label: 'Total Items',      icon: Package },
  { key: 'totalBids',      label: 'Total Bids',       icon: DollarSign },
  { key: 'activeAuctions', label: 'Active Auctions',  icon: Timer },
  { key: 'endedAuctions',  label: 'Ended Auctions',   icon: Archive },
  { key: 'bannedUsers',    label: 'Banned Users',     icon: Ban },
];

const AdminDashboard = () => {
  const [stats, setStats]               = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
      setRecentActivity(res.data.recentActivity);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="bc-adash-center"><div className="bc-adash-spinner" /></div>
  );

  if (error) return (
    <div className="bc-adash-center">
      <div className="bc-adash-err"><Ban size={18} />{error}</div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="bc-adash">
        <div className="bc-adash-inner">

          {/* Header */}
          <div className="bc-adash-header">
            <div>
              <div className="bc-adash-eyebrow">Admin Panel</div>
              <h1 className="bc-adash-title">Admin <em>Overview</em></h1>
              <p className="bc-adash-sub">Monitor platform performance and key metrics</p>
            </div>
            <div className="bc-adash-status">
              <div className="bc-adash-status-dot" />
              System Operational
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="bc-adash-stats">
              {STAT_CONFIGS.map(({ key, label, icon: Icon }) => (
                <div className="bc-adash-stat" key={key}>
                  <div>
                    <div className="bc-adash-stat-label">{label}</div>
                    <div className="bc-adash-stat-val">
                      {stats[key] !== undefined ? stats[key].toLocaleString() : '—'}
                    </div>
                  </div>
                  <div className="bc-adash-stat-icon"><Icon size={18} /></div>
                </div>
              ))}
            </div>
          )}

          {/* Activity columns */}
          <div className="bc-adash-activity">

            {/* Recent Users */}
            <div className="bc-adash-col">
              <div className="bc-adash-col-head">
                <div className="bc-adash-col-title"><Users size={16} /> New Users</div>
                <Link to="/admin/users" className="bc-adash-col-link">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="bc-adash-col-scroll">
                {recentActivity?.users?.length > 0 ? (
                  recentActivity.users.map(u => (
                    <div key={u._id} className="bc-adash-row">
                      <div className="bc-adash-u-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                      <div style={{flex:1, minWidth:0}}>
                        <div className="bc-adash-u-name">{u.name}</div>
                        <div className="bc-adash-u-email">{u.email}</div>
                      </div>
                      <span className={`bc-adash-role bc-adash-role--${u.role?.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bc-adash-empty">
                    <div className="bc-adash-empty-icon"><Users size={18} /></div>
                    <p>No recent users</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Items */}
            <div className="bc-adash-col">
              <div className="bc-adash-col-head">
                <div className="bc-adash-col-title"><Package size={16} /> New Items</div>
                <Link to="/admin/items" className="bc-adash-col-link">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="bc-adash-col-scroll">
                {recentActivity?.items?.length > 0 ? (
                  recentActivity.items.map(item => (
                    <div key={item._id} className="bc-adash-row">
                      <div className="bc-adash-i-thumb">
                        {item.images?.[0]
                          ? <img src={item.images[0]} alt="" />
                          : <Package size={14} />
                        }
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div className="bc-adash-i-title">{item.title}</div>
                        <div className="bc-adash-i-seller">by {item.seller?.name || 'Unknown'}</div>
                      </div>
                      <div style={{textAlign:'right', flexShrink:0}}>
                        <div className="bc-adash-i-price">${item.currentBid || item.basePrice}</div>
                        <div className="bc-adash-i-date">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bc-adash-empty">
                    <div className="bc-adash-empty-icon"><Package size={18} /></div>
                    <p>No recent items</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Bids */}
            <div className="bc-adash-col">
              <div className="bc-adash-col-head">
                <div className="bc-adash-col-title"><Activity size={16} /> Recent Bids</div>
                <Link to="/admin/bids" className="bc-adash-col-link">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              <div className="bc-adash-col-scroll">
                {recentActivity?.bids?.length > 0 ? (
                  recentActivity.bids.map(bid => (
                    <div key={bid._id} className="bc-adash-row">
                      <div className="bc-adash-b-icon"><Gavel size={14} /></div>
                      <div style={{flex:1, minWidth:0}}>
                        <div className="bc-adash-b-amount">${bid.amount}</div>
                        <div className="bc-adash-b-meta">
                          <strong>{bid.bidder?.name}</strong> on <em>{bid.item?.title}</em>
                        </div>
                      </div>
                      <div className="bc-adash-b-date">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bc-adash-empty">
                    <div className="bc-adash-empty-icon"><Gavel size={18} /></div>
                    <p>No recent bids</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;