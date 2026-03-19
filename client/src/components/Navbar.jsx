import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Gavel,
  ChevronDown,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  PlusCircle,
  List,
} from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-nav * { box-sizing: border-box; }

  .bc-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    background: rgba(10,10,15,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(200,169,110,0.15);
  }

  /* subtle top shimmer line */
  .bc-nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(200,169,110,0.5) 40%, rgba(200,169,110,0.5) 60%, transparent);
  }

  .bc-nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  /* ── Logo ── */
  .bc-nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .bc-nav-logo-icon {
    width: 34px; height: 34px;
    border-radius: 9px;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(200,169,110,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .bc-nav-logo:hover .bc-nav-logo-icon {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(200,169,110,0.4);
  }
  .bc-nav-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #e8d5a3;
  }
  .bc-nav-logo-text span { color: #c8a96e; font-style: italic; }

  /* ── Center nav links ── */
  .bc-nav-links {
    display: none;
    align-items: center;
    gap: 2px;
  }
  @media (min-width: 768px) { .bc-nav-links { display: flex; } }

  .bc-nav-link {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: rgba(220,215,205,0.6);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .bc-nav-link:hover {
    color: #e8d5a3;
    background: rgba(200,169,110,0.08);
  }

  /* Admin dropdown trigger */
  .bc-nav-dropdown { position: relative; }
  .bc-nav-dropdown-btn {
    padding: 6px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: rgba(220,215,205,0.6);
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s, background 0.2s;
  }
  .bc-nav-dropdown-btn:hover,
  .bc-nav-dropdown:hover .bc-nav-dropdown-btn {
    color: #e8d5a3;
    background: rgba(200,169,110,0.08);
  }
  .bc-nav-chevron {
    transition: transform 0.25s;
  }
  .bc-nav-dropdown:hover .bc-nav-chevron { transform: rotate(180deg); }

  /* Dropdown panel */
  .bc-nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%; transform: translateX(-50%) scaleY(0.95);
    transform-origin: top center;
    width: 220px;
    background: #13121a;
    border: 1px solid rgba(200,169,110,0.18);
    border-radius: 14px;
    padding: 6px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
    box-shadow: 0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  }
  .bc-nav-dropdown:hover .bc-nav-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scaleY(1);
  }

  .bc-nav-dropdown-label {
    padding: 8px 12px 6px;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(200,169,110,0.45);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4px;
  }

  .bc-nav-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px;
    font-size: 13px;
    color: rgba(220,215,205,0.65);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
  }
  .bc-nav-dropdown-item:hover {
    color: #e8d5a3;
    background: rgba(200,169,110,0.1);
  }
  .bc-nav-dropdown-item svg { color: rgba(200,169,110,0.6); flex-shrink: 0; }
  .bc-nav-dropdown-item:hover svg { color: #c8a96e; }

  /* ── Right side: avatar + profile dropdown ── */
  .bc-nav-right { display: flex; align-items: center; gap: 12px; }

  .bc-nav-avatar-wrap { position: relative; }
  .bc-nav-avatar-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none; cursor: pointer; padding: 3px;
    border-radius: 999px;
    transition: background 0.2s;
  }
  .bc-nav-avatar-btn:hover { background: rgba(200,169,110,0.08); }

  .bc-nav-avatar-ring {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8a96e, #7c5c2a);
    padding: 1.5px;
    flex-shrink: 0;
  }
  .bc-nav-avatar-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: #1a1625;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .bc-nav-avatar-initial {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-weight: 600;
    color: #c8a96e;
  }
  .bc-nav-avatar-chevron {
    color: rgba(200,195,185,0.4);
    transition: transform 0.25s, color 0.2s;
  }
  .bc-nav-avatar-wrap:hover .bc-nav-avatar-chevron {
    transform: rotate(180deg);
    color: #c8a96e;
  }

  /* Profile dropdown */
  .bc-nav-profile-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 240px;
    background: #13121a;
    border: 1px solid rgba(200,169,110,0.18);
    border-radius: 14px;
    padding: 6px;
    opacity: 0;
    visibility: hidden;
    transform: scaleY(0.95);
    transform-origin: top right;
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
    box-shadow: 0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  }
  .bc-nav-avatar-wrap:hover .bc-nav-profile-menu {
    opacity: 1; visibility: visible;
    transform: scaleY(1);
  }

  .bc-nav-profile-header {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4px;
  }
  .bc-nav-profile-name {
    font-size: 13px; font-weight: 500;
    color: #e8d5a3;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .bc-nav-profile-email {
    font-size: 11px;
    color: rgba(200,195,185,0.4);
    margin-top: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .bc-nav-profile-badge {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 8px;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c8a96e;
    background: rgba(200,169,110,0.12);
    border: 1px solid rgba(200,169,110,0.25);
    border-radius: 999px;
  }

  .bc-nav-profile-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px;
    font-size: 13px;
    color: rgba(220,215,205,0.65);
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    width: 100%;
    background: none; border: none; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .bc-nav-profile-item:hover {
    color: #e8d5a3;
    background: rgba(200,169,110,0.08);
  }
  .bc-nav-profile-item svg { color: rgba(200,169,110,0.55); flex-shrink: 0; }
  .bc-nav-profile-item:hover svg { color: #c8a96e; }

  .bc-nav-profile-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 4px 0;
  }

  .bc-nav-profile-item--danger { color: rgba(248,113,113,0.7); }
  .bc-nav-profile-item--danger svg { color: rgba(248,113,113,0.6); }
  .bc-nav-profile-item--danger:hover {
    color: #f87171;
    background: rgba(220,60,60,0.1);
  }
  .bc-nav-profile-item--danger:hover svg { color: #f87171; }

  /* ── Guest buttons ── */
  .bc-nav-signin {
    font-size: 13px;
    letter-spacing: 0.06em;
    color: rgba(220,215,205,0.55);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: none;
  }
  @media (min-width: 480px) { .bc-nav-signin { display: block; } }
  .bc-nav-signin:hover { color: #e8d5a3; background: rgba(200,169,110,0.08); }

  .bc-nav-cta {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #0a0a0f;
    text-decoration: none;
    padding: 8px 18px;
    border-radius: 999px;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 4px 14px rgba(200,169,110,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .bc-nav-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(200,169,110,0.4);
  }
  .bc-nav-cta:hover::before { opacity: 1; }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="bc-nav">
        <div className="bc-nav-inner">

          {/* ── Logo ── */}
          <Link to={user ? '/market' : '/'} className="bc-nav-logo">
            <div className="bc-nav-logo-icon">
              <Gavel size={16} color="#0a0a0f" strokeWidth={2.5} />
            </div>
            <span className="bc-nav-logo-text">Bid<span>Cycle</span></span>
          </Link>

          {/* ── Nav links (logged in) ── */}
          {user ? (
            <>
              <div className="bc-nav-links">
                <Link to="/market" className="bc-nav-link">Marketplace</Link>

                {user.role === 'Seller' && (
                  <Link to="/create-item" className="bc-nav-link">
                    <PlusCircle size={14} /> Sell Item
                  </Link>
                )}

                {user.role !== 'Admin' && (
                  <Link to="/dashboard" className="bc-nav-link">Dashboard</Link>
                )}

                {user.role === 'Admin' && (
                  <div className="bc-nav-dropdown">
                    <button className="bc-nav-dropdown-btn">
                      Admin Panel
                      <ChevronDown size={14} className="bc-nav-chevron" />
                    </button>
                    <div className="bc-nav-dropdown-menu">
                      <div className="bc-nav-dropdown-label">Administration</div>
                      <Link to="/admin" className="bc-nav-dropdown-item">
                        <LayoutDashboard size={14} /> Dashboard Overview
                      </Link>
                      <Link to="/admin/users" className="bc-nav-dropdown-item">
                        <Users size={14} /> Manage Users
                      </Link>
                      <Link to="/admin/items" className="bc-nav-dropdown-item">
                        <Package size={14} /> Manage Items
                      </Link>
                      <Link to="/admin/bids" className="bc-nav-dropdown-item">
                        <Gavel size={14} /> Manage Bids
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Avatar + Profile dropdown ── */}
              <div className="bc-nav-right">
                <div className="bc-nav-avatar-wrap">
                  <button className="bc-nav-avatar-btn">
                    <div className="bc-nav-avatar-ring">
                      <div className="bc-nav-avatar-inner">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="bc-nav-avatar-initial">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown size={14} className="bc-nav-avatar-chevron" />
                  </button>

                  <div className="bc-nav-profile-menu">
                    <div className="bc-nav-profile-header">
                      <div className="bc-nav-profile-name">{user.name}</div>
                      <div className="bc-nav-profile-email">{user.email}</div>
                      <span className="bc-nav-profile-badge">{user.role} Account</span>
                    </div>

                    <Link
                      to={user.role === 'Admin' ? '/admin-account' : '/account'}
                      className="bc-nav-profile-item"
                    >
                      <UserIcon size={14} /> Profile Settings
                    </Link>

                    {user.role === 'Seller' && (
                      <Link to="/my-items" className="bc-nav-profile-item">
                        <List size={14} /> My Listings
                      </Link>
                    )}

                    {user.role !== 'Admin' && user.role !== 'Seller' && (
                      <Link to="/dashboard" className="bc-nav-profile-item">
                        <ShoppingBag size={14} /> My Bids &amp; Orders
                      </Link>
                    )}

                    <div className="bc-nav-profile-divider" />

                    <button
                      onClick={handleLogout}
                      className="bc-nav-profile-item bc-nav-profile-item--danger"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bc-nav-right">
              <Link to="/login" className="bc-nav-signin">Sign In</Link>
              <Link to="/register" className="bc-nav-cta">Get Started</Link>
            </div>
          )}

        </div>
      </nav>
    </>
  );
};

export default Navbar;