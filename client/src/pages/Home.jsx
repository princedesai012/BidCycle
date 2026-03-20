// This is marketplace home page
import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import debounce from '../utils/debounce';
import {
  Search, Tag, Clock, User,
  ChevronLeft, ChevronRight, Image as ImageIcon,
  ArrowRight, CheckCircle, XCircle, AlertCircle, Calendar,
  Gavel, LayoutGrid, Trophy,
  IndianRupee
} from 'lucide-react';
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-home * { box-sizing: border-box; }

  .bc-home {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
  }

  .bc-home-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  /* ── Hero banner ── */
  .bc-home-hero {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 32px;
    min-height: 200px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(200,169,110,0.15);
  }
  .bc-home-hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.22) saturate(0.8);
  }
  .bc-home-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(105deg,
      rgba(10,10,15,0.98) 0%,
      rgba(10,10,15,0.80) 55%,
      rgba(30,12,60,0.5) 100%
    );
  }
  .bc-home-hero-line {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, transparent, #c8a96e 40%, #c8a96e 60%, transparent);
  }
  .bc-home-hero-content {
    position: relative; z-index: 2;
    padding: 52px 52px;
  }
  .bc-home-hero-eyebrow {
    font-size: 10px;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-home-hero-eyebrow::before {
    content: ''; width: 28px; height: 1px; background: #c8a96e;
  }
  .bc-home-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300; line-height: 1.1;
    color: #f5f0e8; margin-bottom: 12px;
  }
  .bc-home-hero-title em { font-style: italic; color: #c8a96e; }
  .bc-home-hero-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(220,215,205,0.55);
    line-height: 1.6; max-width: 440px;
  }

  /* ── Filters bar ── */
  .bc-home-filters {
    position: sticky; top: 60px; z-index: 30;
    background: rgba(13,12,20,0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(200,169,110,0.12);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .bc-home-filters-row {
    display: flex; flex-direction: column; gap: 12px;
  }
  @media (min-width: 640px) {
    .bc-home-filters-row { flex-direction: row; align-items: center; }
  }

  /* Search */
  .bc-home-search-wrap { position: relative; flex: 1; }
  .bc-home-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.45); pointer-events: none;
    transition: color 0.2s;
  }
  .bc-home-search-wrap:focus-within .bc-home-search-icon { color: #c8a96e; }
  .bc-home-search {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 11px 14px 11px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-home-search::placeholder { color: rgba(200,195,185,0.22); }
  .bc-home-search:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* Category select */
  .bc-home-cat-wrap { position: relative; width: 100%; }
  @media (min-width: 640px) { .bc-home-cat-wrap { width: 200px; flex-shrink: 0; } }
  .bc-home-cat-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.45); pointer-events: none;
  }
  .bc-home-cat {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 11px 36px 11px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none; appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c8a96e'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 14px;
    transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  }
  .bc-home-cat option { background: #13121a; color: #f0ebe0; }
  .bc-home-cat:focus {
    border-color: rgba(200,169,110,0.5);
    background-color: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  /* Status tabs */
  .bc-home-tabs {
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .bc-home-tab-label {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(200,195,185,0.3);
    margin-right: 4px;
    display: none;
  }
  @media (min-width: 480px) { .bc-home-tab-label { display: block; } }

  .bc-home-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.06em;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: rgba(220,215,205,0.5);
    cursor: pointer;
    transition: all 0.2s;
  }
  .bc-home-tab:hover { color: #e8d5a3; border-color: rgba(200,169,110,0.3); background: rgba(200,169,110,0.06); }
  .bc-home-tab--active-gold {
    background: linear-gradient(135deg, #c8a96e, #a07840);
    border-color: transparent;
    color: #0a0a0f;
    font-weight: 500;
    box-shadow: 0 4px 14px rgba(200,169,110,0.3);
  }
  .bc-home-tab--active-green {
    background: rgba(16,185,129,0.15);
    border-color: rgba(16,185,129,0.35);
    color: #6ee7b7;
    font-weight: 500;
  }
  .bc-home-tab--active-dim {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
    color: #e8d5a3;
    font-weight: 500;
  }

  .bc-home-tab-hint {
    margin-left: auto;
    font-size: 11px;
    color: rgba(200,195,185,0.28);
    display: none;
  }
  @media (min-width: 768px) { .bc-home-tab-hint { display: block; } }

  /* ── Loading ── */
  .bc-home-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 240px; gap: 16px;
  }
  .bc-home-spinner {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-home-spin 0.8s linear infinite;
  }
  @keyframes bc-home-spin { to { transform: rotate(360deg); } }
  .bc-home-loading-text {
    font-size: 13px; color: rgba(200,195,185,0.4);
    letter-spacing: 0.06em;
    animation: bc-home-pulse 1.5s ease-in-out infinite;
  }
  @keyframes bc-home-pulse {
    0%,100% { opacity: 0.4; } 50% { opacity: 0.9; }
  }

  /* ── Empty state ── */
  .bc-home-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 80px 24px;
    border: 1px dashed rgba(200,169,110,0.15);
    border-radius: 20px;
    text-align: center;
  }
  .bc-home-empty-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: rgba(200,169,110,0.06);
    border: 1px solid rgba(200,169,110,0.15);
    display: flex; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.45);
    margin-bottom: 20px;
  }
  .bc-home-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400;
    color: #f5f0e8; margin-bottom: 8px;
  }
  .bc-home-empty p {
    font-size: 13px; color: rgba(200,195,185,0.4);
    max-width: 320px; line-height: 1.65;
  }

  /* ── Grid ── */
  .bc-home-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 540px) { .bc-home-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .bc-home-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 1200px) { .bc-home-grid { grid-template-columns: repeat(4, 1fr); } }

  /* ── Item card ── */
  .bc-item-card {
    display: flex; flex-direction: column;
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .bc-item-card:hover {
    border-color: rgba(200,169,110,0.25);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,169,110,0.1);
  }

  /* Image */
  .bc-item-img-wrap {
    position: relative;
    height: 200px;
    background: #13121a;
    overflow: hidden;
  }
  .bc-item-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
  }
  .bc-item-card:hover .bc-item-img { transform: scale(1.07); }
  .bc-item-no-img {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: rgba(200,169,110,0.2);
    gap: 8px;
  }
  .bc-item-no-img span { font-size: 11px; letter-spacing: 0.1em; color: rgba(200,195,185,0.2); }
  .bc-item-img-hover {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.3s;
    pointer-events: none;
  }
  .bc-item-card:hover .bc-item-img-hover { background: rgba(0,0,0,0.15); }

  /* Badges on image */
  .bc-item-badge-status {
    position: absolute; top: 12px; right: 12px; z-index: 2;
  }
  .bc-item-badge-cat {
    position: absolute; top: 12px; left: 12px; z-index: 2;
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(220,215,205,0.8);
    background: rgba(10,10,15,0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
  }
  .bc-item-badge-cat svg { color: #c8a96e; }

  /* Status badge variants */
  .bc-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em;
    border-radius: 999px;
    backdrop-filter: blur(8px);
  }
  .bc-badge--upcoming {
    background: rgba(59,130,246,0.15);
    border: 1px solid rgba(59,130,246,0.3);
    color: #93c5fd;
  }
  .bc-badge--active {
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    color: #6ee7b7;
  }
  .bc-badge--sold {
    background: rgba(200,169,110,0.15);
    border: 1px solid rgba(200,169,110,0.3);
    color: #c8a96e;
  }
  .bc-badge--closed {
    background: rgba(107,114,128,0.15);
    border: 1px solid rgba(107,114,128,0.3);
    color: #9ca3af;
  }
  .bc-badge--expired {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5;
  }

  /* Card body */
  .bc-item-body {
    padding: 18px 18px 16px;
    display: flex; flex-direction: column; flex: 1;
  }
  .bc-item-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400;
    color: #f5f0e8; margin-bottom: 6px;
    line-height: 1.25;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color 0.2s;
  }
  .bc-item-card:hover .bc-item-title { color: #c8a96e; }
  .bc-item-desc {
    font-size: 12px; font-weight: 300;
    color: rgba(220,215,205,0.42);
    line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 36px;
    margin-bottom: 16px;
  }

  /* Bid / timer row */
  .bc-item-meta {
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 14px;
    display: flex; justify-content: space-between; align-items: flex-end;
    gap: 8px;
  }
  .bc-item-bid-label {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.3); margin-bottom: 4px;
  }
  .bc-item-bid-val {
    display: flex; align-items: center; gap: 3px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400;
    color: #c8a96e; line-height: 1;
  }
  .bc-item-bid-val svg { color: #c8a96e; }
  .bc-item-timer-label {
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.3); margin-bottom: 4px; text-align: right;
  }
  .bc-item-timer {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 400;
    color: rgba(220,215,205,0.55);
    justify-content: flex-end;
  }
  .bc-item-timer--upcoming { color: #93c5fd; }
  .bc-item-timer--ended   { color: rgba(200,195,185,0.28); }

  /* Seller + view row */
  .bc-item-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px;
  }
  .bc-item-seller {
    display: flex; align-items: center; gap: 7px;
    font-size: 11px; color: rgba(200,195,185,0.38);
  }
  .bc-item-seller-avatar {
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .bc-item-seller-avatar svg { color: rgba(200,169,110,0.5); }
  .bc-item-seller-name {
    max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .bc-item-view {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #c8a96e;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.25s, transform 0.25s;
  }
  .bc-item-card:hover .bc-item-view { opacity: 1; transform: translateX(0); }

  /* ── Pagination ── */
  .bc-home-pagination {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 48px;
  }
  .bc-home-page-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.08em;
    color: rgba(220,215,205,0.6);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .bc-home-page-btn:hover:not(:disabled) {
    color: #e8d5a3;
    border-color: rgba(200,169,110,0.35);
    background: rgba(200,169,110,0.07);
  }
  .bc-home-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .bc-home-page-info {
    padding: 9px 20px;
    font-size: 12px; letter-spacing: 0.06em;
    color: rgba(200,195,185,0.4);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
  }
  .bc-home-page-info span { color: #c8a96e; font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; }
`;

const PARTICLES = [
  { size: 4, left: '10%', delay: '0s',   dur: '16s' },
  { size: 6, left: '30%', delay: '4s',   dur: '20s' },
  { size: 3, left: '65%', delay: '2s',   dur: '14s' },
  { size: 5, left: '85%', delay: '6s',   dur: '18s' },
];

const Home = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const [inputValue, setInputValue]   = useState(initialSearch);
  const [searchTerm, setSearchTerm]   = useState(initialSearch);
  const [items, setItems]             = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [category, setCategory]       = useState('');
  const [status, setStatus]           = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [hasNext, setHasNext]         = useState(false);
  const [hasPrev, setHasPrev]         = useState(false);
  const [, setTick]                   = useState(0);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setInputValue(query); setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      setLoadingItems(true);
      const params = new URLSearchParams({ page: currentPage, limit: 12, search: searchTerm, category, status });
      const response = await api.get(`/items?${params}`);
      setItems(response.data.items);
      setTotalPages(response.data.pagination.total);
      setHasNext(response.data.pagination.hasNext);
      setHasPrev(response.data.pagination.hasPrev);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoadingItems(false);
    }
  }, [currentPage, searchTerm, category, status]);

  const debouncedUpdate = useCallback(
    debounce((value) => { setSearchTerm(value); setCurrentPage(1); }, 500), []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdate(value);
  };

  useEffect(() => { if (user) fetchItems(); }, [user, fetchItems]);

  if (!loading && !user) return <Navigate to="/login" />;

  const handleCategoryChange = (e) => { setCategory(e.target.value); setCurrentPage(1); };

  /* ── Timer ── */
  const formatTimer = (item) => {
    const now = new Date(), start = item.startTime ? new Date(item.startTime) : new Date(), end = new Date(item.endTime);
    if (now < start) {
      const diff = start - now;
      const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
            m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      return d > 0 ? `Starts: ${d}d ${h}h ${m}m ${s}s` : `Starts: ${h}h ${m}m ${s}s`;
    }
    const diff = end - now;
    if (diff <= 0) return 'Auction ended';
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    return d > 0 ? `${d}d ${h}h ${m}m ${s}s left` : `${h}h ${m}m ${s}s left`;
  };

  const getTimerClass = (item) => {
    const now = new Date();
    if (now < new Date(item.startTime)) return 'bc-item-timer bc-item-timer--upcoming';
    if (new Date(item.endTime) < now) return 'bc-item-timer bc-item-timer--ended';
    return 'bc-item-timer';
  };

  /* ── Status badge ── */
  const getStatusBadge = (item) => {
    const now = new Date(), start = new Date(item.startTime), end = new Date(item.endTime);
    if (now < start)
      return <span className="bc-badge bc-badge--upcoming"><Calendar size={10} /> Upcoming</span>;
    if (item.status === 'sold')
      return <span className="bc-badge bc-badge--sold"><CheckCircle size={10} /> Sold</span>;
    if (item.status === 'closed')
      return <span className="bc-badge bc-badge--closed"><XCircle size={10} /> Closed</span>;
    if (end <= now || item.status === 'expired')
      return <span className="bc-badge bc-badge--expired"><Clock size={10} /> Expired</span>;
    return <span className="bc-badge bc-badge--active"><AlertCircle size={10} /> Active</span>;
  };

  const tabClass = (val) => {
    if (status !== val) return 'bc-home-tab';
    if (val === 'active') return 'bc-home-tab bc-home-tab--active-gold';
    if (val === 'ended')  return 'bc-home-tab bc-home-tab--active-green';
    return 'bc-home-tab bc-home-tab--active-dim';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-home">
        <div className="bc-home-inner">

          {/* ── Hero banner ── */}
          <div className="bc-home-hero">
            <img
              src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"
              alt="" className="bc-home-hero-img"
            />
            <div className="bc-home-hero-overlay" />
            <div className="bc-home-hero-line" />
            <div className="bc-home-hero-content">
              <div className="bc-home-hero-eyebrow">Live Marketplace</div>
              <h1 className="bc-home-hero-title">
                Discover <em>Unique Auctions</em>
              </h1>
              <p className="bc-home-hero-sub">
                Bid on exclusive items, collectibles, and rare finds in real-time.
              </p>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="bc-home-filters">
            <div className="bc-home-filters-row">
              <div className="bc-home-search-wrap">
                <div className="bc-home-search-icon"><Search size={15} /></div>
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={inputValue}
                  onChange={handleInputChange}
                  className="bc-home-search"
                />
              </div>
              <div className="bc-home-cat-wrap">
                <div className="bc-home-cat-icon"><Tag size={14} /></div>
                <select value={category} onChange={handleCategoryChange} className="bc-home-cat">
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Art">Art</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="bc-home-tabs">
              <span className="bc-home-tab-label">Filter</span>
              <button className={tabClass('active')} onClick={() => { setStatus('active'); setCurrentPage(1); }}>
                <Gavel size={13} /> Active &amp; Upcoming
              </button>
              <button className={tabClass('ended')} onClick={() => { setStatus('ended'); setCurrentPage(1); }}>
                <Trophy size={13} /> Ended Auctions
              </button>
              <button className={tabClass('')} onClick={() => { setStatus(''); setCurrentPage(1); }}>
                <LayoutGrid size={13} /> All Items
              </button>
              <span className="bc-home-tab-hint">
                {status === 'active' && 'Showing live & upcoming auctions'}
                {status === 'ended'  && 'Showing completed auctions'}
                {status === ''       && 'Showing all items'}
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          {loadingItems ? (
            <div className="bc-home-loading">
              <div className="bc-home-spinner" />
              <span className="bc-home-loading-text">Finding treasures…</span>
            </div>
          ) : (
            <>
              <div className="bc-home-grid">
                {items.length === 0 ? (
                  <div className="bc-home-empty">
                    <div className="bc-home-empty-icon"><Search size={22} /></div>
                    <h3>No items found</h3>
                    <p>We couldn't find any items matching your search. Try adjusting your filters or search term.</p>
                  </div>
                ) : items.map(item => (
                  <Link key={item._id} to={`/item/${item._id}`} className="bc-item-card">
                    {/* Image */}
                    <div className="bc-item-img-wrap">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0] || "https://placehold.co/600x400/13121a/c8a96e?text=No+Image"} alt={item.title} className="bc-item-img" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/13121a/c8a96e?text=No+Image"; }} />
                      ) : (
                        <div className="bc-item-no-img">
                          <ImageIcon size={28} />
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="bc-item-img-hover" />
                      <div className="bc-item-badge-status">{getStatusBadge(item)}</div>
                      <div className="bc-item-badge-cat">
                        <Tag size={10} />{item.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="bc-item-body">
                      <div className="bc-item-title">{item.title}</div>
                      <p className="bc-item-desc">{item.description}</p>

                      <div className="bc-item-meta">
                        <div>
                          <div className="bc-item-bid-label">
                            {new Date() < new Date(item.startTime) ? 'Starting Bid' : 'Current Bid'}
                          </div>
                          <div className="bc-item-bid-val">
                            <IndianRupee size={14} strokeWidth={2.5} />
                            {item.currentBid || item.basePrice}
                          </div>
                        </div>
                        <div>
                          <div className="bc-item-timer-label">
                            {new Date() < new Date(item.startTime) ? 'Starts In' : 'Time Left'}
                          </div>
                          <div className={getTimerClass(item)}>
                            <Clock size={11} strokeWidth={2} />
                            {formatTimer(item)}
                          </div>
                        </div>
                      </div>

                      <div className="bc-item-footer">
                        <div className="bc-item-seller">
                          <div className="bc-item-seller-avatar"><User size={11} /></div>
                          <span className="bc-item-seller-name">{item.seller?.name || 'Unknown'}</span>
                        </div>
                        <div className="bc-item-view">
                          View <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bc-home-pagination">
                  <button
                    className="bc-home-page-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <div className="bc-home-page-info">
                    Page <span>{currentPage}</span> of {totalPages}
                  </div>
                  <button
                    className="bc-home-page-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!hasNext}
                  >
                    Next <ChevronRight size={14} />
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

export default Home;