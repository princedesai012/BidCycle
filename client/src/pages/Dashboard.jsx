import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  Package,
  ShoppingBag,
  Gavel,
  Trophy,
  CreditCard,
  Plus,
  List,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-dash * { box-sizing: border-box; }

  .bc-dash {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }

  .bc-dash-inner { max-width: 1100px; margin: 0 auto; }

  /* ── Page header ── */
  .bc-dash-header {
    margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-dash-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-dash-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-dash-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 300; line-height: 1.1;
    color: #f5f0e8;
  }
  .bc-dash-title em { font-style: italic; color: #c8a96e; }
  .bc-dash-welcome {
    font-size: 13px; color: rgba(200,195,185,0.4);
    margin-top: 8px; letter-spacing: 0.02em;
  }
  .bc-dash-welcome span { color: #c8a96e; }

  /* ── Loading ── */
  .bc-dash-loading {
    display: flex; align-items: center; justify-content: center;
    height: 240px;
  }
  .bc-dash-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-dash-spin 0.8s linear infinite;
  }
  @keyframes bc-dash-spin { to { transform: rotate(360deg); } }

  /* ── Stat cards ── */
  .bc-dash-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  @media (min-width: 640px) { .bc-dash-stats { grid-template-columns: repeat(3, 1fr); } }

  .bc-dash-stat {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px;
    display: flex; align-items: center; gap: 18px;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bc-dash-stat:hover {
    border-color: rgba(200,169,110,0.2);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  }
  .bc-dash-stat-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(200,169,110,0.2);
    background: rgba(200,169,110,0.07);
    color: #c8a96e;
    transition: background 0.25s, box-shadow 0.25s;
  }
  .bc-dash-stat:hover .bc-dash-stat-icon {
    background: rgba(200,169,110,0.13);
    box-shadow: 0 0 18px rgba(200,169,110,0.12);
  }
  .bc-dash-stat-label {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(200,195,185,0.35); margin-bottom: 6px;
  }
  .bc-dash-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 300; line-height: 1;
    color: #f5f0e8;
  }

  /* ── Action buttons ── */
  .bc-dash-actions {
    display: flex; flex-wrap: wrap; gap: 12px;
    margin-bottom: 32px;
  }
  .bc-dash-btn-primary {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; min-width: 180px;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #0a0a0f; text-decoration: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
    border: none; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .bc-dash-btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-dash-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,0.35); }
  .bc-dash-btn-primary:hover::before { opacity: 1; }

  .bc-dash-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    flex: 1; min-width: 180px;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(220,215,205,0.58); text-decoration: none;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.09);
    background: transparent;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-dash-btn-ghost:hover {
    color: #e8d5a3;
    border-color: rgba(200,169,110,0.35);
    background: rgba(200,169,110,0.06);
  }

  /* ── Panel ── */
  .bc-dash-panel {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .bc-dash-panel-head {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: space-between;
  }
  .bc-dash-panel-title {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f5f0e8;
  }
  .bc-dash-panel-title svg { color: #c8a96e; }
  .bc-dash-panel-link {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(200,169,110,0.6); text-decoration: none;
    transition: color 0.2s, gap 0.2s;
  }
  .bc-dash-panel-link:hover { color: #c8a96e; gap: 8px; }

  /* Table */
  .bc-dash-table-wrap { overflow-x: auto; }
  .bc-dash-table { width: 100%; border-collapse: collapse; }
  .bc-dash-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
  .bc-dash-table th {
    padding: 12px 20px;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(200,195,185,0.25); font-weight: 400; text-align: left;
  }
  .bc-dash-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.035);
    transition: background 0.15s;
  }
  .bc-dash-table tbody tr:last-child { border-bottom: none; }
  .bc-dash-table tbody tr:hover { background: rgba(200,169,110,0.03); }
  .bc-dash-table td {
    padding: 14px 20px;
    font-size: 13px; color: rgba(220,215,205,0.6);
    vertical-align: middle;
  }

  .bc-dash-item-cell { display: flex; align-items: center; gap: 12px; }
  .bc-dash-item-thumb {
    width: 34px; height: 34px; border-radius: 8px;
    background: #13121a;
    border: 1px solid rgba(255,255,255,0.05);
    overflow: hidden; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.28);
  }
  .bc-dash-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .bc-dash-item-name {
    font-size: 13px; color: #e8d5a3;
    max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Badges */
  .bc-dash-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 999px;
    font-size: 10px; letter-spacing: 0.06em;
  }
  .bc-dash-badge--active  { background: rgba(16,185,129,0.11);  border: 1px solid rgba(16,185,129,0.22);  color: #6ee7b7; }
  .bc-dash-badge--ended   { background: rgba(107,114,128,0.11); border: 1px solid rgba(107,114,128,0.2);  color: #9ca3af; }
  .bc-dash-badge--winning { background: rgba(200,169,110,0.11); border: 1px solid rgba(200,169,110,0.22); color: #c8a96e; }
  .bc-dash-badge--won     { background: rgba(16,185,129,0.11);  border: 1px solid rgba(16,185,129,0.22);  color: #6ee7b7; }
  .bc-dash-badge--outbid  { background: rgba(245,158,11,0.1);   border: 1px solid rgba(245,158,11,0.2);   color: #fbbf24; }

  .bc-dash-bid-amt {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: #c8a96e;
  }
  .bc-dash-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: #f5f0e8;
  }
  .bc-dash-date { font-size: 12px; color: rgba(200,195,185,0.3); }

  /* Empty */
  .bc-dash-empty {
    padding: 56px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-dash-empty-icon {
    width: 50px; height: 50px; border-radius: 14px;
    background: rgba(200,169,110,0.06); border: 1px solid rgba(200,169,110,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.32); margin-bottom: 14px;
  }
  .bc-dash-empty p { font-size: 13px; color: rgba(200,195,185,0.3); letter-spacing: 0.04em; }
`;

/* ══════════════════════════════════════════════════
   SELLER DASHBOARD
══════════════════════════════════════════════════ */
const SellerDashboard = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/seller/items");
        setItems(data);
      } catch (e) {
        console.error("Fetch items error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedItems  = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const activeItems  = items.filter(i => new Date(i.endTime) > new Date()).length;
  const soldItems    = items.filter(i => new Date(i.endTime) <= new Date()).length;
  const totalRevenue = items
    .filter(i => new Date(i.endTime) <= new Date())
    .reduce((acc, cur) => acc + (cur.currentBid || cur.basePrice || 0), 0);
  const recentInventory = sortedItems.slice(0, 5);

  if (loading) return <div className="bc-dash-loading"><div className="bc-dash-spinner" /></div>;

  return (
    <div>
      <div className="bc-dash-stats">
        {[
          { icon: <Package size={20} />, label: "Active Listings",     val: activeItems },
          { icon: <Trophy size={20} />,  label: "Completed Auctions",  val: soldItems },
          { icon: <IndianRupee size={20} />, label: "Potential Revenue", val: `₹${totalRevenue.toLocaleString()}` },
        ].map((s, i) => (
          <div className="bc-dash-stat" key={i}>
            <div className="bc-dash-stat-icon">{s.icon}</div>
            <div>
              <div className="bc-dash-stat-label">{s.label}</div>
              <div className="bc-dash-stat-val">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bc-dash-actions">
        <Link to="/create-item" className="bc-dash-btn-primary"><Plus size={14} /> Create New Auction</Link>
        <Link to="/my-items"    className="bc-dash-btn-ghost"><List size={14} /> Manage Inventory</Link>
      </div>

      <div className="bc-dash-panel">
        <div className="bc-dash-panel-head">
          <div className="bc-dash-panel-title"><TrendingUp size={16} /> Recent Inventory</div>
          <Link to="/my-items" className="bc-dash-panel-link">View All <ArrowRight size={13} /></Link>
        </div>
        <div className="bc-dash-table-wrap">
          {recentInventory.length > 0 ? (
            <table className="bc-dash-table">
              <thead><tr><th>Item</th><th>Status</th><th>Price</th><th>Date Added</th></tr></thead>
              <tbody>
                {recentInventory.map(item => {
                  const ended = new Date(item.endTime) < new Date();
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="bc-dash-item-cell">
                          <div className="bc-dash-item-thumb">
                            {item.images?.[0] ? <img src={item.images[0] || "https://placehold.co/100x100/13121a/c8a96e?text=No+Image"} alt="" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/13121a/c8a96e?text=No+Image"; }} /> : <Package size={13} />}
                          </div>
                          <span className="bc-dash-item-name">{item.title}</span>
                        </div>
                      </td>
                      <td><span className={ended ? "bc-dash-badge bc-dash-badge--ended" : "bc-dash-badge bc-dash-badge--active"}>{ended ? "Ended" : "Active"}</span></td>
                      <td><span className="bc-dash-price">${item.currentBid || item.basePrice}</span></td>
                      <td><span className="bc-dash-date">{new Date(item.createdAt).toLocaleDateString()}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="bc-dash-empty">
              <div className="bc-dash-empty-icon"><Package size={20} /></div>
              <p>No items listed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   BUYER DASHBOARD
══════════════════════════════════════════════════ */
const BuyerDashboard = ({ user }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/bids/my-bids");
        setBids(data);
      } catch (e) {
        console.error("Fetch bids error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeBids  = bids.filter(b => b.item && new Date(b.item.endTime) > new Date());
  const wonAuctions = bids.filter(b => b.item && new Date(b.item.endTime) <= new Date() && b.item.currentBid === b.amount);

  const uniqueWonMap = new Map();
  wonAuctions.forEach(bid => {
    const ex = uniqueWonMap.get(bid.item._id);
    if (!ex || bid.amount > ex.amount) uniqueWonMap.set(bid.item._id, bid);
  });
  const uniqueWonItems = Array.from(uniqueWonMap.values());
  const totalSpent = uniqueWonItems.reduce((acc, cur) => acc + cur.amount, 0);

  if (loading) return <div className="bc-dash-loading"><div className="bc-dash-spinner" /></div>;

  return (
    <div>
      <div className="bc-dash-stats">
        {[
          { icon: <Gavel size={20} />,    label: "Active Bids",       val: activeBids.length },
          { icon: <Trophy size={20} />,   label: "Auctions Won",      val: uniqueWonItems.length },
          { icon: <CreditCard size={20} />, label: "Total Committed", val: `₹${totalSpent.toLocaleString()}` },
        ].map((s, i) => (
          <div className="bc-dash-stat" key={i}>
            <div className="bc-dash-stat-icon">{s.icon}</div>
            <div>
              <div className="bc-dash-stat-label">{s.label}</div>
              <div className="bc-dash-stat-val">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bc-dash-actions">
        <Link to="/" className="bc-dash-btn-primary"><ShoppingBag size={14} /> Browse Auctions</Link>
      </div>

      <div className="bc-dash-panel">
        <div className="bc-dash-panel-head">
          <div className="bc-dash-panel-title"><Activity size={16} /> Recent Activity</div>
        </div>
        <div className="bc-dash-table-wrap">
          {bids.length > 0 ? (
            <table className="bc-dash-table">
              <thead><tr><th>Item</th><th>Your Bid</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {bids.slice(0, 5).map(bid => {
                  const isEnded   = bid.item && new Date(bid.item.endTime) < new Date();
                  const isWinning = bid.item && bid.amount === bid.item.currentBid;

                  const badgeCls = !bid.item ? ""
                    : isEnded
                      ? isWinning ? "bc-dash-badge bc-dash-badge--won"     : "bc-dash-badge bc-dash-badge--ended"
                      : isWinning ? "bc-dash-badge bc-dash-badge--winning" : "bc-dash-badge bc-dash-badge--outbid";

                  const badgeLbl = !bid.item ? "Unknown"
                    : isEnded ? (isWinning ? "Won" : "Ended")
                    : (isWinning ? "Winning" : "Outbid");

                  return (
                    <tr key={bid._id}>
                      <td>
                        <div className="bc-dash-item-cell">
                          <div className="bc-dash-item-thumb">
                            {bid.item?.images?.[0] ? <img src={bid.item.images[0] || "https://placehold.co/100x100/13121a/c8a96e?text=No+Image"} alt="" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/13121a/c8a96e?text=No+Image"; }} /> : <Gavel size={12} />}
                          </div>
                          <span className="bc-dash-item-name">
                            {bid.item?.title || <em style={{color:'rgba(200,195,185,0.28)'}}>Item Deleted</em>}
                          </span>
                        </div>
                      </td>
                      <td><span className="bc-dash-bid-amt">₹{bid.amount}</span></td>
                      <td>
                        {bid.item
                          ? <span className={badgeCls}>{isEnded && isWinning && <Trophy size={9} />}{badgeLbl}</span>
                          : <span style={{fontSize:'11px',color:'rgba(200,195,185,0.25)'}}>Unknown</span>}
                      </td>
                      <td><span className="bc-dash-date">{new Date(bid.createdAt).toLocaleDateString()}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="bc-dash-empty">
              <div className="bc-dash-empty-icon"><Gavel size={20} /></div>
              <p>No bids placed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN CONTAINER
══════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <style>{styles}</style>
      <div className="bc-dash">
        <div className="bc-dash-inner">
          <div className="bc-dash-header">
            <div className="bc-dash-eyebrow">
              {user.role === "Seller" ? "Seller Portal" : "Buyer Portal"}
            </div>
            <h1 className="bc-dash-title">
              {user.role === "Seller" ? <>Seller <em>Dashboard</em></> : <>Buyer <em>Dashboard</em></>}
            </h1>
            <p className="bc-dash-welcome">
              Welcome back, <span>{user.name}</span>
            </p>
          </div>
          {user.role === "Seller" ? <SellerDashboard user={user} /> : <BuyerDashboard user={user} />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;