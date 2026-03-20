import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import debounce from '../utils/debounce';
import {
  Search, User, Shield, Ban, CheckCircle,
  ChevronLeft, ChevronRight, Mail, Calendar
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-ausers * { box-sizing: border-box; }

  .bc-ausers {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-ausers-inner { max-width: 1280px; margin: 0 auto; }

  /* ── Header ── */
  .bc-ausers-header {
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-ausers-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-ausers-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-ausers-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-ausers-title em { font-style: italic; color: #c8a96e; }
  .bc-ausers-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* ── Error ── */
  .bc-ausers-error {
    display: flex; align-items: center; gap: 10px;
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px; padding: 13px 16px; margin-bottom: 24px;
    font-size: 13px; color: #fca5a5;
  }

  /* ── Search bar ── */
  .bc-ausers-searchbar {
    background: rgba(13,12,20,0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(200,169,110,0.1);
    border-radius: 14px; padding: 14px 18px;
    margin-bottom: 28px;
  }
  .bc-ausers-search-wrap { position: relative; max-width: 400px; }
  .bc-ausers-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none;
    transition: color 0.2s;
  }
  .bc-ausers-search-wrap:focus-within .bc-ausers-search-icon { color: #c8a96e; }
  .bc-ausers-search {
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
  .bc-ausers-search::placeholder { color: rgba(200,195,185,0.2); }
  .bc-ausers-search:focus {
    border-color: rgba(200,169,110,0.45);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* ── Loading ── */
  .bc-ausers-loading {
    display: flex; align-items: center; justify-content: center; height: 240px;
  }
  .bc-ausers-spinner {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-ausers-spin 0.8s linear infinite;
  }
  @keyframes bc-ausers-spin { to { transform: rotate(360deg); } }

  /* ── Table panel ── */
  .bc-ausers-panel {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .bc-ausers-table-wrap { overflow-x: auto; }
  .bc-ausers-table { width: 100%; border-collapse: collapse; }

  .bc-ausers-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
  .bc-ausers-table th {
    padding: 14px 20px;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(200,195,185,0.25); font-weight: 400; text-align: left;
    white-space: nowrap;
  }
  .bc-ausers-table th:last-child { text-align: right; }

  .bc-ausers-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .bc-ausers-table tbody tr:last-child { border-bottom: none; }
  .bc-ausers-table tbody tr:hover { background: rgba(200,169,110,0.03); }

  .bc-ausers-table td {
    padding: 14px 20px;
    font-size: 13px; color: rgba(220,215,205,0.6);
    vertical-align: middle;
  }
  .bc-ausers-table td:last-child { text-align: right; }

  /* User cell */
  .bc-ausers-user-cell { display: flex; align-items: center; gap: 12px; }
  .bc-ausers-avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.22);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400; color: #c8a96e;
  }
  .bc-ausers-name { font-size: 13px; color: #e8d5a3; font-weight: 400; }
  .bc-ausers-email {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: rgba(200,195,185,0.3); margin-top: 2px;
  }

  /* Role */
  .bc-ausers-admin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
    background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.22); color: rgba(196,181,253,0.8);
  }
  .bc-ausers-role-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    padding: 6px 28px 6px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: #f0ebe0;
    outline: none; appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c8a96e'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
    transition: border-color 0.2s, background-color 0.2s;
  }
  .bc-ausers-role-select option { background: #13121a; color: #f0ebe0; }
  .bc-ausers-role-select:focus {
    border-color: rgba(200,169,110,0.45);
    background-color: rgba(200,169,110,0.04);
  }
  .bc-ausers-role-select:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Status badge */
  .bc-ausers-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px;
    font-size: 10px; letter-spacing: 0.06em;
  }
  .bc-ausers-status--active { background:rgba(16,185,129,0.1);  border:1px solid rgba(16,185,129,0.22); color:#6ee7b7; }
  .bc-ausers-status--banned { background:rgba(239,68,68,0.1);   border:1px solid rgba(239,68,68,0.22);  color:#fca5a5; }

  /* Date */
  .bc-ausers-date {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: rgba(200,195,185,0.3);
  }

  /* Ban/unban button */
  .bc-ausers-ban-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 400; letter-spacing: 0.07em; text-transform: uppercase;
    border: 1px solid; cursor: pointer; background: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    white-space: nowrap;
  }
  .bc-ausers-ban-btn--ban {
    border-color: rgba(239,68,68,0.18); color: rgba(248,113,113,0.6);
  }
  .bc-ausers-ban-btn--ban:hover:not(:disabled) {
    background: rgba(239,68,68,0.09); color: #f87171; border-color: rgba(239,68,68,0.32);
  }
  .bc-ausers-ban-btn--unban {
    border-color: rgba(16,185,129,0.18); color: rgba(110,231,183,0.6);
  }
  .bc-ausers-ban-btn--unban:hover:not(:disabled) {
    background: rgba(16,185,129,0.08); color: #6ee7b7; border-color: rgba(16,185,129,0.32);
  }
  .bc-ausers-ban-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Empty */
  .bc-ausers-empty {
    padding: 64px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-ausers-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(200,169,110,0.06); border: 1px solid rgba(200,169,110,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.28); margin-bottom: 14px;
  }
  .bc-ausers-empty p { font-size: 13px; color: rgba(200,195,185,0.3); }

  /* ── Pagination ── */
  .bc-ausers-pagination {
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .bc-ausers-page-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 999px;
    color: rgba(220,215,205,0.5);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-ausers-page-btn:hover:not(:disabled) {
    color: #e8d5a3; border-color: rgba(200,169,110,0.35); background: rgba(200,169,110,0.07);
  }
  .bc-ausers-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .bc-ausers-page-info {
    padding: 8px 18px; font-size: 12px; letter-spacing: 0.06em;
    color: rgba(200,195,185,0.38);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
  }
  .bc-ausers-page-info span {
    color: #c8a96e;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400;
  }
`;

const AdminUsers = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [inputValue, setInputValue]   = useState('');
  const [search, setSearch]           = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [updating, setUpdating]       = useState(null);

  const debouncedUpdate = useCallback(
    debounce((value) => { setSearch(value); setCurrentPage(1); }, 500), []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdate(value);
  };

  useEffect(() => { fetchUsers(); }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?page=${currentPage}&search=${search}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.total);
    } catch (err) {
      setError('Failed to load users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (userId) => {
    try {
      setUpdating(userId);
      await api.put(`/admin/users/${userId}/ban`);
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u));
    } catch (err) {
      alert('Failed to update user status');
      console.error('Ban toggle error:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setUpdating(userId);
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update user role');
      console.error('Role update error:', err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-ausers">
        <div className="bc-ausers-inner">

          {/* Header */}
          <div className="bc-ausers-header">
            <div className="bc-ausers-eyebrow">Admin Panel</div>
            <h1 className="bc-ausers-title">Manage <em>Users</em></h1>
            <p className="bc-ausers-sub">View and manage user accounts, roles, and access</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bc-ausers-error">
              <Ban size={15} style={{flexShrink:0}} /> {error}
            </div>
          )}

          {/* Search */}
          <div className="bc-ausers-searchbar">
            <div className="bc-ausers-search-wrap">
              <div className="bc-ausers-search-icon"><Search size={14} /></div>
              <input
                type="text"
                placeholder="Search by name or email…"
                value={inputValue}
                onChange={handleInputChange}
                className="bc-ausers-search"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="bc-ausers-loading"><div className="bc-ausers-spinner" /></div>
          ) : (
            <>
              <div className="bc-ausers-panel">
                <div className="bc-ausers-table-wrap">
                  <table className="bc-ausers-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id}>

                          {/* User */}
                          <td>
                            <div className="bc-ausers-user-cell">
                              <div className="bc-ausers-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="bc-ausers-name">{user.name}</div>
                                <div className="bc-ausers-email">
                                  <Mail size={10} /> {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td>
                            {user.role === 'Admin' ? (
                              <span className="bc-ausers-admin-badge">
                                <Shield size={10} /> Admin
                              </span>
                            ) : (
                              <select
                                value={user.role}
                                onChange={e => handleRoleUpdate(user._id, e.target.value)}
                                disabled={updating === user._id}
                                className="bc-ausers-role-select"
                              >
                                <option value="Buyer">Buyer</option>
                                <option value="Seller">Seller</option>
                              </select>
                            )}
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`bc-ausers-status bc-ausers-status--${user.isBanned ? 'banned' : 'active'}`}>
                              {user.isBanned
                                ? <><Ban size={10} /> Banned</>
                                : <><CheckCircle size={10} /> Active</>
                              }
                            </span>
                          </td>

                          {/* Joined */}
                          <td>
                            <div className="bc-ausers-date">
                              <Calendar size={12} />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Actions */}
                          <td>
                            <button
                              onClick={() => handleBanToggle(user._id)}
                              disabled={updating === user._id || user.role === 'Admin'}
                              className={`bc-ausers-ban-btn bc-ausers-ban-btn--${user.isBanned ? 'unban' : 'ban'}`}
                            >
                              {updating === user._id
                                ? 'Updating…'
                                : user.isBanned
                                  ? <><CheckCircle size={11} /> Unban User</>
                                  : <><Ban size={11} /> Ban User</>
                              }
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="bc-ausers-empty">
                    <div className="bc-ausers-empty-icon"><User size={22} /></div>
                    <p>No users found matching your criteria.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bc-ausers-pagination">
                  <button
                    className="bc-ausers-page-btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="bc-ausers-page-info">
                    Page <span>{currentPage}</span> of {totalPages}
                  </div>
                  <button
                    className="bc-ausers-page-btn"
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

export default AdminUsers;