import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  Clock,
  DollarSign,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Gavel,
  ArrowLeft,
  ShieldAlert,
  History,
  Info,
  Calendar,
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-detail * { box-sizing: border-box; }

  .bc-detail {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 36px 24px 72px;
  }
  .bc-detail-inner { max-width: 1200px; margin: 0 auto; }

  /* ── Loading ── */
  .bc-detail-loading {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-detail-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-det-spin 0.8s linear infinite;
  }
  @keyframes bc-det-spin { to { transform: rotate(360deg); } }

  /* Not found */
  .bc-detail-notfound {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .bc-detail-notfound-card {
    background: #0d0c14;
    border: 1px solid rgba(200,169,110,0.15);
    border-radius: 20px;
    padding: 52px 44px;
    text-align: center;
    max-width: 400px;
  }
  .bc-detail-notfound-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #f87171; margin: 0 auto 20px;
  }
  .bc-detail-notfound h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: #f5f0e8; margin-bottom: 8px;
  }
  .bc-detail-notfound p {
    font-size: 13px; color: rgba(200,195,185,0.45); line-height: 1.65; margin-bottom: 28px;
  }

  /* ── Back button ── */
  .bc-detail-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(200,195,185,0.4);
    background: none; border: none; cursor: pointer; padding: 0;
    margin-bottom: 32px;
    transition: color 0.2s, gap 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .bc-detail-back:hover { color: #c8a96e; gap: 10px; }
  .bc-detail-back svg { transition: transform 0.25s; }
  .bc-detail-back:hover svg { transform: translateX(-3px); }

  /* ── Result alerts ── */
  .bc-detail-alert {
    border-radius: 16px;
    padding: 20px 24px;
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 32px;
    border: 1px solid;
  }
  .bc-detail-alert--win {
    background: rgba(16,185,129,0.08);
    border-color: rgba(16,185,129,0.22);
  }
  .bc-detail-alert--lose {
    background: rgba(107,114,128,0.08);
    border-color: rgba(107,114,128,0.18);
  }
  .bc-detail-alert-icon {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-detail-alert-icon--win { background: rgba(16,185,129,0.12); color: #6ee7b7; }
  .bc-detail-alert-icon--lose { background: rgba(107,114,128,0.1); color: #9ca3af; }
  .bc-detail-alert-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; margin-bottom: 4px;
  }
  .bc-detail-alert-title--win { color: #6ee7b7; }
  .bc-detail-alert-title--lose { color: #9ca3af; }
  .bc-detail-alert-sub { font-size: 13px; color: rgba(200,195,185,0.55); }
  .bc-detail-alert-sub span { color: #c8a96e; }

  /* ── Main grid ── */
  .bc-detail-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
  }
  @media (min-width: 1024px) { .bc-detail-grid { grid-template-columns: 1fr 1fr; gap: 36px; } }

  /* ── Image panel ── */
  .bc-detail-img-main {
    position: relative;
    aspect-ratio: 1;
    border-radius: 18px;
    overflow: hidden;
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .bc-detail-img-main img {
    width: 100%; height: 100%;
    object-fit: contain;
    padding: 20px;
    transition: transform 0.5s ease;
  }
  .bc-detail-img-main:hover img { transform: scale(1.04); }
  .bc-detail-img-no {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.2); gap: 10px;
    font-size: 13px; color: rgba(200,195,185,0.25); letter-spacing: 0.08em;
  }

  /* Status badge on image */
  .bc-detail-img-badge {
    position: absolute; top: 16px; right: 16px;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 999px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
    backdrop-filter: blur(10px);
  }
  .bc-detail-img-badge--upcoming {
    background: rgba(59,130,246,0.18); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd;
  }
  .bc-detail-img-badge--ended {
    background: rgba(107,114,128,0.2); border: 1px solid rgba(107,114,128,0.3); color: #9ca3af;
  }
  .bc-detail-img-badge--live {
    background: rgba(16,185,129,0.18); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7;
    animation: bc-det-pulse 2s ease-in-out infinite;
  }
  @keyframes bc-det-pulse { 0%,100%{opacity:1} 50%{opacity:0.65} }

  /* Thumbnails */
  .bc-detail-thumbs {
    display: flex; gap: 10px;
    overflow-x: auto; padding-bottom: 4px;
    scrollbar-width: none;
  }
  .bc-detail-thumbs::-webkit-scrollbar { display: none; }
  .bc-detail-thumb {
    width: 72px; height: 72px; flex-shrink: 0;
    border-radius: 10px; overflow: hidden;
    border: 1.5px solid transparent;
    background: #0d0c14;
    cursor: pointer;
    transition: border-color 0.2s, opacity 0.2s, transform 0.2s;
    opacity: 0.5;
  }
  .bc-detail-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .bc-detail-thumb--active { border-color: #c8a96e; opacity: 1; transform: scale(1.05); }
  .bc-detail-thumb:not(.bc-detail-thumb--active):hover { opacity: 0.8; }

  /* ── Panel (reusable box) ── */
  .bc-detail-panel {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
  }
  .bc-detail-panel-body { padding: 24px; }
  .bc-detail-panel-head {
    padding: 18px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 400; color: #f5f0e8;
  }
  .bc-detail-panel-head svg { color: #c8a96e; }

  /* ── Item header info ── */
  .bc-detail-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .bc-detail-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 999px;
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    border: 1px solid rgba(200,169,110,0.25);
    background: rgba(200,169,110,0.07);
    color: rgba(220,215,205,0.65);
  }
  .bc-detail-chip svg { color: rgba(200,169,110,0.6); }

  .bc-detail-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 300; line-height: 1.1;
    color: #f5f0e8; margin-bottom: 24px;
  }

  /* Price / timer / bids row */
  .bc-detail-meta-row {
    display: flex; flex-wrap: wrap; gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .bc-detail-meta-item { display: flex; flex-direction: column; gap: 5px; }
  .bc-detail-meta-label {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.33);
  }
  .bc-detail-meta-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; line-height: 1;
    color: #c8a96e; display: flex; align-items: center; gap: 2px;
  }
  .bc-detail-meta-price-base {
    font-size: 12px; color: rgba(200,195,185,0.3);
    text-decoration: line-through; margin-top: 4px;
  }
  .bc-detail-meta-timer {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300;
  }
  .bc-detail-meta-timer--upcoming { color: #93c5fd; }
  .bc-detail-meta-timer--ended   { color: rgba(200,195,185,0.3); }
  .bc-detail-meta-timer--active  { color: #f5f0e8; }
  .bc-detail-meta-bids {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300; color: #f5f0e8;
  }

  /* Divider */
  .bc-detail-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 24px 0; }

  /* ── Bid form area ── */
  .bc-detail-upcoming-box {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 12px; padding: 24px;
    text-align: center;
  }
  .bc-detail-upcoming-box svg { color: #93c5fd; margin: 0 auto 12px; display: block; }
  .bc-detail-upcoming-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; color: #93c5fd; margin-bottom: 6px;
  }
  .bc-detail-upcoming-sub {
    font-size: 13px; color: rgba(147,197,253,0.65); line-height: 1.6;
  }
  .bc-detail-upcoming-sub strong { color: #93c5fd; }

  /* Info / banned notices */
  .bc-detail-notice {
    border-radius: 12px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    font-size: 13px;
  }
  .bc-detail-notice--danger {
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5;
  }
  .bc-detail-notice--info {
    background: rgba(200,169,110,0.07); border: 1px solid rgba(200,169,110,0.15); color: rgba(220,215,205,0.6);
  }
  .bc-detail-notice--login {
    background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1);
    color: rgba(220,215,205,0.5); flex-direction: column; gap: 12px;
    text-align: center; padding: 24px;
  }

  /* Inline alerts (error/success) */
  .bc-detail-inline-alert {
    border-radius: 10px; padding: 11px 14px;
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; margin-bottom: 14px;
  }
  .bc-detail-inline-alert--err {
    background: rgba(239,68,68,0.09); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5;
  }
  .bc-detail-inline-alert--ok {
    background: rgba(16,185,129,0.09); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7;
  }

  /* Bid input row */
  .bc-detail-bid-row {
    display: flex; flex-direction: column; gap: 10px;
  }
  @media (min-width: 480px) { .bc-detail-bid-row { flex-direction: row; } }

  .bc-detail-bid-wrap { position: relative; flex: 1; }
  .bc-detail-bid-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.45); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-detail-bid-wrap:focus-within .bc-detail-bid-icon { color: #c8a96e; }
  .bc-detail-bid-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-detail-bid-input::placeholder { color: rgba(200,195,185,0.2); }
  .bc-detail-bid-input:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }
  .bc-detail-bid-input:disabled { opacity: 0.45; cursor: not-allowed; }

  .bc-detail-bid-btn {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #0a0a0f;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    border: none; border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    white-space: nowrap;
  }
  .bc-detail-bid-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-detail-bid-btn:hover:not(:disabled) {
    transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,0.35);
  }
  .bc-detail-bid-btn:hover:not(:disabled)::before { opacity: 1; }
  .bc-detail-bid-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .bc-detail-bid-btn-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(10,10,15,0.25); border-top-color: #0a0a0f;
    animation: bc-det-spin 0.8s linear infinite;
  }

  .bc-detail-bid-terms {
    font-size: 11px; color: rgba(200,195,185,0.25);
    margin-top: 8px; letter-spacing: 0.04em;
  }

  /* Login-to-bid button */
  .bc-detail-login-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #0a0a0f;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    border: none; border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(200,169,110,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .bc-detail-login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,169,110,0.35); }

  /* Auction-ended result */
  .bc-detail-ended-box {
    text-align: center; padding-top: 4px;
  }
  .bc-detail-ended-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: rgba(200,195,185,0.5);
    margin-bottom: 12px;
  }
  .bc-detail-winner-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 999px;
    background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.22);
    color: #6ee7b7; font-size: 13px;
  }
  .bc-detail-no-winner { font-size: 13px; color: rgba(200,195,185,0.35); }

  /* Description text */
  .bc-detail-desc {
    font-size: 13px; font-weight: 300;
    color: rgba(220,215,205,0.5);
    line-height: 1.8; white-space: pre-line;
  }

  /* Bid history */
  .bc-detail-hist-scroll {
    max-height: 280px; overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(200,169,110,0.2) transparent;
  }
  .bc-detail-hist-scroll::-webkit-scrollbar { width: 4px; }
  .bc-detail-hist-scroll::-webkit-scrollbar-thumb {
    background: rgba(200,169,110,0.2); border-radius: 999px;
  }
  .bc-detail-hist-table { width: 100%; border-collapse: collapse; }
  .bc-detail-hist-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
  .bc-detail-hist-table th {
    padding: 10px 20px;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(200,195,185,0.25); font-weight: 400; text-align: left;
  }
  .bc-detail-hist-table th:last-child { text-align: right; }
  .bc-detail-hist-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.035);
    transition: background 0.15s;
  }
  .bc-detail-hist-table tbody tr:last-child { border-bottom: none; }
  .bc-detail-hist-table tbody tr:first-child { background: rgba(200,169,110,0.04); }
  .bc-detail-hist-table tbody tr:hover { background: rgba(200,169,110,0.03); }
  .bc-detail-hist-table td {
    padding: 12px 20px;
    font-size: 13px; vertical-align: middle;
  }
  .bc-detail-hist-bidder { color: #e8d5a3; }
  .bc-detail-hist-highest {
    margin-left: 8px;
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 999px;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(200,169,110,0.12); border: 1px solid rgba(200,169,110,0.22);
    color: #c8a96e;
  }
  .bc-detail-hist-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 400; color: #c8a96e;
  }
  .bc-detail-hist-time { font-size: 12px; color: rgba(200,195,185,0.3); text-align: right; }

  .bc-detail-hist-empty {
    padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .bc-detail-hist-empty-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(200,169,110,0.05); border: 1px solid rgba(200,169,110,0.1);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.25); margin-bottom: 12px;
  }
  .bc-detail-hist-empty p { font-size: 13px; color: rgba(200,195,185,0.3); }

  .bc-detail-go-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #0a0a0f; text-decoration: none;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    border: none; border-radius: 10px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(200,169,110,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .bc-detail-go-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,169,110,0.35); }
`;

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    fetchItemDetails();
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      if (!item) setLoading(true);
      const [itemRes, bidsRes] = await Promise.all([
        api.get(`/items/${id}`),
        api.get(`/items/${id}/bids`),
      ]);
      setItem(itemRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      console.error("Error fetching item details:", err);
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!user) { navigate("/login"); return; }
    if (item.status === "upcoming") { setError("Auction has not started yet."); return; }
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) { setError("Please enter a valid bid amount"); return; }
    const currentPrice = item.currentBid || item.basePrice;
    if (amount <= currentPrice) { setError(`Bid must be higher than ₹${currentPrice}`); return; }
    try {
      setSubmitting(true);
      const response = await api.post(`/bids/${id}`, { amount });
      setSuccess(response.data.message || "Bid placed successfully!");
      setBidAmount("");
      fetchItemDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  const isUpcoming      = item && item.status === "upcoming";
  const isAuctionEnded  = item && (new Date(item.endTime) < new Date() || item.status === "sold" || item.status === "expired" || item.status === "closed");
  const isAuctionActive = item && item.status === "active" && !isAuctionEnded && !isUpcoming;

  const didUserBid = user && bids.some(bid => bid.bidder._id === user._id || bid.bidder === user._id);
  const isWinner   = user && item?.winner && (item.winner._id === user._id || item.winner === user._id);
  const isLoser    = isAuctionEnded && didUserBid && !isWinner;

  const formatTimer = () => {
    if (!item) return "";
    const now = new Date();
    const target = isUpcoming ? new Date(item.startTime) : new Date(item.endTime);
    const diff = target - now;
    if (diff <= 0) return isUpcoming ? "Starting…" : "Auction ended";
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    return d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
  };

  if (loading) return (
    <div className="bc-detail-loading"><div className="bc-detail-spinner" /></div>
  );

  if (!item) return (
    <div className="bc-detail-notfound">
      <div className="bc-detail-notfound-card">
        <div className="bc-detail-notfound-icon"><AlertCircle size={26} /></div>
        <h2>Item Not Found</h2>
        <p>The auction you're looking for doesn't exist or has been removed.</p>
        <button className="bc-detail-go-btn" onClick={() => navigate("/")}>Go Home</button>
      </div>
    </div>
  );

  const timerClass = isUpcoming ? "bc-detail-meta-timer bc-detail-meta-timer--upcoming"
    : isAuctionEnded ? "bc-detail-meta-timer bc-detail-meta-timer--ended"
    : "bc-detail-meta-timer bc-detail-meta-timer--active";

  return (
    <>
      <style>{styles}</style>
      <div className="bc-detail">
        <div className="bc-detail-inner">

          {/* Back */}
          <button className="bc-detail-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back to Listings
          </button>

          {/* Result alerts */}
          {isWinner && (
            <div className="bc-detail-alert bc-detail-alert--win">
              <div className="bc-detail-alert-icon bc-detail-alert-icon--win"><Trophy size={22} /></div>
              <div>
                <div className="bc-detail-alert-title bc-detail-alert-title--win">Congratulations!</div>
                <div className="bc-detail-alert-sub">
                  You've won this auction with a bid of <span>${item.currentBid}</span>.
                </div>
              </div>
            </div>
          )}

          {isLoser && (
            <div className="bc-detail-alert bc-detail-alert--lose">
              <div className="bc-detail-alert-icon bc-detail-alert-icon--lose"><Gavel size={22} /></div>
              <div>
                <div className="bc-detail-alert-title bc-detail-alert-title--lose">Auction Ended</div>
                <div className="bc-detail-alert-sub">Unfortunately you didn't win this item. Better luck next time!</div>
              </div>
            </div>
          )}

          <div className="bc-detail-grid">

            {/* ── LEFT: Images ── */}
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div className="bc-detail-img-main">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[currentImageIndex]} alt={item.title} />
                ) : (
                  <div className="bc-detail-img-no">
                    <Tag size={36} style={{color:'rgba(200,169,110,0.15)'}} />
                    No Image Available
                  </div>
                )}
                {/* Status badge */}
                {isUpcoming ? (
                  <div className="bc-detail-img-badge bc-detail-img-badge--upcoming">
                    <Calendar size={11} /> Upcoming
                  </div>
                ) : isAuctionEnded ? (
                  <div className="bc-detail-img-badge bc-detail-img-badge--ended">
                    Auction Ended
                  </div>
                ) : (
                  <div className="bc-detail-img-badge bc-detail-img-badge--live">
                    <Clock size={11} /> Live Auction
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {item.images && item.images.length > 1 && (
                <div className="bc-detail-thumbs">
                  {item.images.map((img, i) => (
                    <button
                      key={i}
                      className={`bc-detail-thumb${i === currentImageIndex ? " bc-detail-thumb--active" : ""}`}
                      onClick={() => setCurrentImageIndex(i)}
                    >
                      <img src={img} alt={`Thumb ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Description – mobile */}
              <div className="bc-detail-panel lg:hidden" style={{display:'block'}}>
                <div className="bc-detail-panel-head"><Info size={16} /> Description</div>
                <div className="bc-detail-panel-body">
                  <p className="bc-detail-desc">{item.description}</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Info & actions ── */}
            <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

              {/* Title / chips */}
              <div>
                <div className="bc-detail-chips">
                  <span className="bc-detail-chip"><Tag size={10} />{item.category}</span>
                  <span className="bc-detail-chip"><User size={10} />{item.seller?.name || "Unknown Seller"}</span>
                </div>
                <h1 className="bc-detail-title">{item.title}</h1>
              </div>

              {/* Status card */}
              <div className="bc-detail-panel">
                <div className="bc-detail-panel-body">

                  {/* Meta row */}
                  <div className="bc-detail-meta-row">
                    <div className="bc-detail-meta-item">
                      <div className="bc-detail-meta-label">
                        {isUpcoming ? "Starting Bid" : "Current Price"}
                      </div>
                      <div className="bc-detail-meta-price">
                        <DollarSign size={22} strokeWidth={2} />
                        {item.currentBid || item.basePrice}
                      </div>
                      {item.currentBid > item.basePrice && (
                        <div className="bc-detail-meta-price-base">Base: ${item.basePrice}</div>
                      )}
                    </div>

                    <div className="bc-detail-meta-item">
                      <div className="bc-detail-meta-label">
                        {isUpcoming ? "Starts In" : isAuctionEnded ? "Status" : "Ends In"}
                      </div>
                      <div className={timerClass}>
                        <Clock size={16} strokeWidth={1.5} /> {formatTimer()}
                      </div>
                    </div>

                    <div className="bc-detail-meta-item">
                      <div className="bc-detail-meta-label">Total Bids</div>
                      <div className="bc-detail-meta-bids">{bids.length}</div>
                    </div>
                  </div>

                  {/* Bid area */}
                  {isUpcoming && (
                    <div className="bc-detail-upcoming-box">
                      <Calendar size={28} />
                      <div className="bc-detail-upcoming-title">Coming Soon</div>
                      <p className="bc-detail-upcoming-sub">
                        Scheduled to start on<br />
                        <strong>{new Date(item.startTime).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</strong>
                      </p>
                    </div>
                  )}

                  {isAuctionActive && (
                    <div>
                      {!user ? (
                        <div className="bc-detail-notice bc-detail-notice--login">
                          <p>Sign in to participate in this auction</p>
                          <button className="bc-detail-login-btn" onClick={() => navigate("/login")}>
                            Login to Bid
                          </button>
                        </div>
                      ) : user.isBanned ? (
                        <div className="bc-detail-notice bc-detail-notice--danger">
                          <ShieldAlert size={16} style={{flexShrink:0}} />
                          Your account is suspended. You cannot place bids.
                        </div>
                      ) : user.role !== "Buyer" ? (
                        <div className="bc-detail-notice bc-detail-notice--info">
                          <User size={15} style={{flexShrink:0}} />
                          Registered as {user.role}. Only Buyer accounts can bid.
                        </div>
                      ) : (
                        <div>
                          {error && (
                            <div className="bc-detail-inline-alert bc-detail-inline-alert--err">
                              <AlertCircle size={13} /> {error}
                            </div>
                          )}
                          {success && (
                            <div className="bc-detail-inline-alert bc-detail-inline-alert--ok">
                              <CheckCircle2 size={13} /> {success}
                            </div>
                          )}
                          <form onSubmit={handleBid}>
                            <div className="bc-detail-bid-row">
                              <div className="bc-detail-bid-wrap">
                                <div className="bc-detail-bid-icon"><DollarSign size={15} /></div>
                                <input
                                  type="number"
                                  value={bidAmount}
                                  onChange={e => setBidAmount(e.target.value)}
                                  min={item.currentBid ? item.currentBid + 1 : item.basePrice + 1}
                                  step="0.01"
                                  required
                                  disabled={submitting}
                                  placeholder={`₹${item.currentBid ? item.currentBid + 1 : item.basePrice + 1} or more`}
                                  className="bc-detail-bid-input"
                                />
                              </div>
                              <button type="submit" disabled={submitting} className="bc-detail-bid-btn">
                                {submitting
                                  ? <div className="bc-detail-bid-btn-spin" />
                                  : <><Gavel size={14} /> Place Bid</>
                                }
                              </button>
                            </div>
                            <p className="bc-detail-bid-terms">
                              By placing a bid, you agree to the auction terms and conditions.
                            </p>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {isAuctionEnded && (
                    <div className="bc-detail-ended-box">
                      <div className="bc-detail-ended-title">Auction Closed</div>
                      {item.winner ? (
                        <div className="bc-detail-winner-pill">
                          <Trophy size={13} /> Winner: {item.winner.name || item.winner}
                        </div>
                      ) : (
                        <p className="bc-detail-no-winner">No bids were placed or reserve not met.</p>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Description – desktop */}
              <div className="bc-detail-panel" style={{display: 'none'}} id="bc-desc-desktop">
                <div className="bc-detail-panel-head"><Info size={16} /> Description</div>
                <div className="bc-detail-panel-body">
                  <p className="bc-detail-desc">{item.description}</p>
                </div>
              </div>
              <div className="bc-detail-panel" style={{}}>
                <div className="bc-detail-panel-head"><Info size={16} /> Description</div>
                <div className="bc-detail-panel-body">
                  <p className="bc-detail-desc">{item.description}</p>
                </div>
              </div>

              {/* Bid History */}
              <div className="bc-detail-panel">
                <div className="bc-detail-panel-head"><History size={16} /> Bid History</div>
                {bids.length === 0 ? (
                  <div className="bc-detail-hist-empty">
                    <div className="bc-detail-hist-empty-icon"><Gavel size={20} /></div>
                    <p>No bids yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="bc-detail-hist-scroll">
                    <table className="bc-detail-hist-table">
                      <thead>
                        <tr>
                          <th>Bidder</th>
                          <th>Amount</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bids.map((bid, i) => (
                          <tr key={bid._id}>
                            <td>
                              <span className="bc-detail-hist-bidder">
                                {bid.bidder.name === user?.name ? "You" : bid.bidder.name}
                              </span>
                              {i === 0 && <span className="bc-detail-hist-highest">Highest</span>}
                            </td>
                            <td><span className="bc-detail-hist-amount">${bid.amount}</span></td>
                            <td><div className="bc-detail-hist-time">{new Date(bid.createdAt).toLocaleString()}</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default ItemDetail;