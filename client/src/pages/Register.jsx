import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Injected styles – scoped to .bidcycle-register
   ───────────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bidcycle-register * { box-sizing: border-box; }

  .bidcycle-register {
    min-height: 100vh;
    display: flex;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Left panel ── */
  .bc-r-left {
    display: none;
    width: 42%;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  @media (min-width: 1024px) { .bc-r-left { display: block; } }

  .bc-r-left-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1550537687-c913840e89ae?q=80&w=2071&auto=format&fit=crop') center/cover no-repeat;
  }
  .bc-r-left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,10,20,0.92) 0%, rgba(30,12,60,0.78) 60%, rgba(10,10,20,0.97) 100%);
  }

  .bc-r-particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .bc-r-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(180,145,255,0.18);
    animation: bc-r-floatUp linear infinite;
  }
  @keyframes bc-r-floatUp {
    0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
  }

  .bc-r-accent-line {
    position: absolute;
    left: 48px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.5) 70%, transparent);
  }

  .bc-r-left-content {
    position: relative; z-index: 10;
    height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 48px 56px 48px 72px;
    color: #fff;
  }

  .bc-r-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #e8d5a3;
  }
  .bc-r-logo span { color: #c8a96e; font-weight: 600; }

  .bc-r-eyebrow {
    font-size: 11px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .bc-r-eyebrow::before {
    content: '';
    display: block; width: 32px; height: 1px;
    background: #c8a96e;
  }

  .bc-r-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 3.8vw, 56px);
    font-weight: 300;
    line-height: 1.12;
    margin: 0 0 24px;
    color: #f5f0e8;
  }
  .bc-r-headline em { font-style: italic; color: #c8a96e; }

  .bc-r-sub {
    font-size: 13px;
    color: rgba(220,215,205,0.65);
    line-height: 1.7;
    max-width: 300px;
    margin-bottom: 32px;
  }

  .bc-r-pills { display: flex; flex-direction: column; gap: 12px; }
  .bc-r-pill {
    display: flex; align-items: center; gap: 12px;
    font-size: 12px;
    color: rgba(220,215,205,0.55);
    letter-spacing: 0.05em;
  }
  .bc-r-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c8a96e; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(200,169,110,0.6);
  }

  .bc-r-footer-text {
    font-size: 11px;
    color: rgba(220,215,205,0.3);
    letter-spacing: 0.08em;
  }

  /* ── Right panel ── */
  .bc-r-right {
    flex: 1;
    display: flex; align-items: flex-start; justify-content: center;
    padding: 40px 24px;
    background: #0a0a0f;
    position: relative;
    min-height: 100vh;
  }
  @media (min-width: 1024px) {
    .bc-r-right { padding: 40px 56px; }
  }

  .bc-r-corner {
    position: fixed; width: 64px; height: 64px;
    pointer-events: none;
  }
  .bc-r-corner--tr { top: 24px; right: 24px; border-top: 1px solid rgba(200,169,110,0.3); border-right: 1px solid rgba(200,169,110,0.3); }
  .bc-r-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(200,169,110,0.3); border-right: 1px solid rgba(200,169,110,0.3); }

  .bc-r-card {
    width: 100%; max-width: 520px;
    animation: bc-r-fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes bc-r-fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bc-r-card-header { margin-bottom: 32px; }
  .bc-r-card-eyebrow {
    font-size: 11px; letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-r-card-eyebrow::after {
    content: ''; flex: 1; max-width: 40px; height: 1px;
    background: linear-gradient(to right, #c8a96e, transparent);
  }
  .bc-r-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 300; line-height: 1.1;
    color: #f5f0e8;
    margin: 0 0 8px;
  }
  .bc-r-card-title em { font-style: italic; color: #c8a96e; }
  .bc-r-card-sub {
    font-size: 13px; color: rgba(200,195,185,0.5);
    letter-spacing: 0.03em;
  }

  /* Error */
  .bc-r-error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.3);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
    animation: bc-r-shake 0.35s ease;
  }
  @keyframes bc-r-shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }
  .bc-r-error p { font-size: 13px; color: #fca5a5; margin: 0; }

  /* Form */
  .bc-r-form { display: flex; flex-direction: column; gap: 18px; }

  .bc-r-field { display: flex; flex-direction: column; gap: 8px; }
  .bc-r-label {
    font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(200,195,185,0.45);
  }

  .bc-r-grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }
  @media (min-width: 540px) {
    .bc-r-grid-2 { grid-template-columns: 1fr 1fr; }
  }

  .bc-r-input-wrap { position: relative; }
  .bc-r-input-icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    pointer-events: none; z-index: 2;
    color: rgba(200,169,110,0.45);
    transition: color 0.2s;
  }
  .bc-r-input-wrap:focus-within .bc-r-input-icon { color: #c8a96e; }

  .bc-r-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 13px 16px 13px 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .bc-r-input::placeholder { color: rgba(200,195,185,0.2); }
  .bc-r-input:focus {
    border-color: rgba(200,169,110,0.55);
    background: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 4px rgba(200,169,110,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .bc-r-input-pr { padding-right: 44px; }

  .bc-r-textarea-icon {
    position: absolute; top: 14px; left: 16px;
    color: rgba(200,169,110,0.45);
    pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-r-input-wrap:focus-within .bc-r-textarea-icon { color: #c8a96e; }

  .bc-r-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 13px 16px 13px 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none; resize: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .bc-r-textarea::placeholder { color: rgba(200,195,185,0.2); }
  .bc-r-textarea:focus {
    border-color: rgba(200,169,110,0.55);
    background: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 4px rgba(200,169,110,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .bc-r-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 13px 36px 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23c8a96e'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    cursor: pointer;
    transition: border-color 0.25s, background-color 0.25s, box-shadow 0.25s;
  }
  .bc-r-select option { background: #1a1625; color: #f0ebe0; }
  .bc-r-select:focus {
    border-color: rgba(200,169,110,0.55);
    background-color: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 4px rgba(200,169,110,0.07);
  }

  .bc-r-eye-btn {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 4px;
    color: rgba(200,195,185,0.35); z-index: 2;
    transition: color 0.2s;
  }
  .bc-r-eye-btn:hover { color: #c8a96e; }

  .bc-r-divider {
    display: flex; align-items: center; gap: 16px;
  }
  .bc-r-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
  .bc-r-divider-text {
    font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(200,195,185,0.28);
    white-space: nowrap;
  }

  .bc-r-submit {
    position: relative; overflow: hidden;
    width: 100%;
    background: linear-gradient(135deg, #c8a96e 0%, #a07840 100%);
    border: none; border-radius: 12px;
    padding: 15px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #0a0a0f;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 8px 32px rgba(200,169,110,0.25), 0 2px 8px rgba(0,0,0,0.4);
  }
  .bc-r-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-r-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(200,169,110,0.35), 0 4px 12px rgba(0,0,0,0.5);
  }
  .bc-r-submit:hover:not(:disabled)::before { opacity: 1; }
  .bc-r-submit:active:not(:disabled) { transform: translateY(0); }
  .bc-r-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .bc-r-submit-arrow {
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .bc-r-submit:hover:not(:disabled) .bc-r-submit-arrow { transform: translateX(5px); }

  .bc-r-login-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 14px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.1em;
    color: rgba(200,195,185,0.6);
    text-decoration: none;
    transition: border-color 0.25s, color 0.25s, background 0.25s;
  }
  .bc-r-login-btn:hover {
    border-color: rgba(200,169,110,0.4);
    color: #e8d5a3;
    background: rgba(200,169,110,0.05);
  }

  @keyframes bc-r-spin { to { transform: rotate(360deg); } }
  .bc-r-spin { animation: bc-r-spin 0.8s linear infinite; }
`;

const PARTICLES = [
  { size: 4,  left: '12%', delay: '0s',   dur: '15s' },
  { size: 6,  left: '28%', delay: '3.5s', dur: '19s' },
  { size: 3,  left: '50%', delay: '1s',   dur: '13s' },
  { size: 5,  left: '68%', delay: '5s',   dur: '17s' },
  { size: 7,  left: '82%', delay: '2s',   dur: '21s' },
  { size: 3,  left: '40%', delay: '7s',   dur: '14s' },
  { size: 4,  left: '8%',  delay: '4.5s', dur: '16s' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    password: "",
    confirmPassword: "",
    role: "Buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        navigate("/market");
      } else {
        setError(result.message);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bidcycle-register">

        {/* ── LEFT PANEL ── */}
        <div className="bc-r-left">
          <div className="bc-r-left-bg" />
          <div className="bc-r-left-overlay" />
          <div className="bc-r-accent-line" />
          <div className="bc-r-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="bc-r-particle" style={{
                width: p.size, height: p.size,
                left: p.left, bottom: '-20px',
                animationDelay: p.delay, animationDuration: p.dur,
              }} />
            ))}
          </div>

          <div className="bc-r-left-content">
            <div className="bc-r-logo">Bid<span>Cycle</span></div>

            <div>
              <div className="bc-r-eyebrow">Est. 2026 · Global Auctions</div>
              <h1 className="bc-r-headline">
                Join the<br /><em>Community</em>
              </h1>
              <p className="bc-r-sub">
                Create an account to start bidding on exclusive items or selling
                your own treasures to a global audience.
              </p>
              <div className="bc-r-pills">
                <div className="bc-r-pill"><div className="bc-r-pill-dot" />Secure &amp; Encrypted Bidding</div>
                <div className="bc-r-pill"><div className="bc-r-pill-dot" />Real-time Auction Updates</div>
                <div className="bc-r-pill"><div className="bc-r-pill-dot" />Global Seller Network</div>
              </div>
            </div>

            <div className="bc-r-footer-text">
              © {new Date().getFullYear()} BidCycle Inc. · All rights reserved.
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="bc-r-right">
          <div className="bc-r-corner bc-r-corner--tr" />
          <div className="bc-r-corner bc-r-corner--br" />

          <div className="bc-r-card">
            <div className="bc-r-card-header">
              <div className="bc-r-card-eyebrow">New Member</div>
              <h2 className="bc-r-card-title">Create <em>Account</em></h2>
              <p className="bc-r-card-sub">Start your journey with BidCycle</p>
            </div>

            {error && (
              <div className="bc-r-error">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#f87171" style={{flexShrink:0}}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <p>{error}</p>
              </div>
            )}

            <form className="bc-r-form" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="bc-r-field">
                <label className="bc-r-label">Full Name</label>
                <div className="bc-r-input-wrap">
                  <div className="bc-r-input-icon"><User size={16} /></div>
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="bc-r-input" placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="bc-r-grid-2">
                <div className="bc-r-field">
                  <label className="bc-r-label">Email Address</label>
                  <div className="bc-r-input-wrap">
                    <div className="bc-r-input-icon"><Mail size={16} /></div>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      className="bc-r-input" placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="bc-r-field">
                  <label className="bc-r-label">Phone Number</label>
                  <div className="bc-r-input-wrap">
                    <div className="bc-r-input-icon"><Phone size={16} /></div>
                    <input
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      className="bc-r-input" placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Role */}
              <div className="bc-r-grid-2">
                <div className="bc-r-field">
                  <label className="bc-r-label">Address</label>
                  <div className="bc-r-input-wrap">
                    <div className="bc-r-input-icon"><MapPin size={16} /></div>
                    <input
                      type="text" name="address" required
                      value={formData.address} onChange={handleChange}
                      className="bc-r-input" placeholder="Your address"
                    />
                  </div>
                </div>
                <div className="bc-r-field">
                  <label className="bc-r-label">I want to</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="bc-r-select"
                  >
                    <option value="Buyer">Buy Items</option>
                    <option value="Seller">Sell Items</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div className="bc-r-field">
                <label className="bc-r-label">Bio</label>
                <div className="bc-r-input-wrap">
                  <div className="bc-r-textarea-icon"><FileText size={16} /></div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={2}
                    className="bc-r-textarea"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </div>

              {/* Security divider */}
              <div className="bc-r-divider">
                <div className="bc-r-divider-line" />
                <span className="bc-r-divider-text">Security</span>
                <div className="bc-r-divider-line" />
              </div>

              {/* Password & Confirm */}
              <div className="bc-r-grid-2">
                <div className="bc-r-field">
                  <label className="bc-r-label">Password</label>
                  <div className="bc-r-input-wrap">
                    <div className="bc-r-input-icon"><Lock size={16} /></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password" required
                      value={formData.password} onChange={handleChange}
                      className="bc-r-input bc-r-input-pr" placeholder="••••••••"
                    />
                    <button type="button" className="bc-r-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bc-r-field">
                  <label className="bc-r-label">Confirm</label>
                  <div className="bc-r-input-wrap">
                    <div className="bc-r-input-icon"><Lock size={16} /></div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword" required
                      value={formData.confirmPassword} onChange={handleChange}
                      className="bc-r-input bc-r-input-pr" placeholder="••••••••"
                    />
                    <button type="button" className="bc-r-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="bc-r-submit" disabled={loading}>
                {loading ? (
                  <Loader size={18} className="bc-r-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} className="bc-r-submit-arrow" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="bc-r-divider">
                <div className="bc-r-divider-line" />
                <span className="bc-r-divider-text">Already a member?</span>
                <div className="bc-r-divider-line" />
              </div>

              {/* Sign In */}
              <Link to="/login" className="bc-r-login-btn">
                Sign In to Your Account
              </Link>

            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;