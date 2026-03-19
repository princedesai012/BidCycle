import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, ArrowRight, Loader, Eye, EyeOff } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Injected styles – scoped to .bidcycle-login so they don't leak out
   ───────────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bidcycle-login * { box-sizing: border-box; }

  .bidcycle-login {
    min-height: 100vh;
    display: flex;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .bc-left {
    position: relative;
    width: 52%;
    display: none;
    overflow: hidden;
  }
  @media (min-width: 1024px) { .bc-left { display: block; } }

  .bc-left-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1529154691717-3306083d86e5?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
  }
  .bc-left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,10,20,0.88) 0%, rgba(30,12,60,0.75) 60%, rgba(10,10,20,0.95) 100%);
  }

  /* Animated particles */
  .bc-particles {
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  }
  .bc-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(180, 145, 255, 0.18);
    animation: floatUp linear infinite;
  }
  @keyframes floatUp {
    0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
  }

  /* Gold accent line */
  .bc-accent-line {
    position: absolute;
    left: 56px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.5) 70%, transparent);
  }

  .bc-left-content {
    position: relative; z-index: 10;
    height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 48px 64px 48px 80px;
    color: #fff;
  }

  .bc-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #e8d5a3;
  }
  .bc-logo span { color: #c8a96e; font-weight: 600; }

  .bc-tagline-block {}
  .bc-eyebrow {
    font-size: 11px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .bc-eyebrow::before {
    content: '';
    display: block; width: 32px; height: 1px;
    background: #c8a96e;
  }

  .bc-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 4.5vw, 62px);
    font-weight: 300;
    line-height: 1.12;
    margin: 0 0 24px;
    color: #f5f0e8;
  }
  .bc-headline em {
    font-style: italic;
    color: #c8a96e;
  }

  .bc-sub {
    font-size: 14px;
    color: rgba(220,215,205,0.7);
    line-height: 1.7;
    max-width: 340px;
  }

  .bc-stats {
    display: flex; gap: 40px;
  }
  .bc-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 300;
    color: #c8a96e;
    display: block;
  }
  .bc-stat-label {
    font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(220,215,205,0.5);
  }

  .bc-footer-text {
    font-size: 11px;
    color: rgba(220,215,205,0.35);
    letter-spacing: 0.08em;
  }

  /* ── Right panel ── */
  .bc-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 24px;
    background: #0a0a0f;
    position: relative;
  }

  /* Corner decorations */
  .bc-corner {
    position: absolute; width: 64px; height: 64px;
    pointer-events: none;
  }
  .bc-corner--tl { top: 24px; left: 24px; border-top: 1px solid rgba(200,169,110,0.35); border-left: 1px solid rgba(200,169,110,0.35); }
  .bc-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(200,169,110,0.35); border-right: 1px solid rgba(200,169,110,0.35); }

  .bc-card {
    width: 100%; max-width: 420px;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bc-card-header { margin-bottom: 40px; }
  .bc-card-eyebrow {
    font-size: 11px; letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-card-eyebrow::after {
    content: ''; flex: 1; max-width: 40px; height: 1px;
    background: linear-gradient(to right, #c8a96e, transparent);
  }

  .bc-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px; font-weight: 300; line-height: 1.1;
    color: #f5f0e8;
    margin: 0 0 8px;
  }
  .bc-card-title em { font-style: italic; color: #c8a96e; }

  .bc-card-sub {
    font-size: 13px; color: rgba(200,195,185,0.55);
    letter-spacing: 0.03em;
  }

  /* Error */
  .bc-error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.3);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
    animation: shake 0.35s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }
  .bc-error svg { color: #f87171; flex-shrink: 0; }
  .bc-error p  { font-size: 13px; color: #fca5a5; margin: 0; }

  /* Form */
  .bc-form { display: flex; flex-direction: column; gap: 20px; }

  .bc-field { display: flex; flex-direction: column; gap: 8px; }
  .bc-label {
    font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(200,195,185,0.5);
  }

  .bc-input-wrap { position: relative; }
  .bc-input-icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    pointer-events: none; z-index: 2;
    color: rgba(200,169,110,0.5);
    transition: color 0.2s;
  }

  .bc-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 16px 14px 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .bc-input::placeholder { color: rgba(200,195,185,0.25); }
  .bc-input:focus {
    border-color: rgba(200,169,110,0.6);
    background: rgba(200,169,110,0.06);
    box-shadow: 0 0 0 4px rgba(200,169,110,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .bc-input:focus ~ .bc-input-icon,
  .bc-input-wrap:focus-within .bc-input-icon { color: #c8a96e; }

  .bc-eye-btn {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 4px;
    color: rgba(200,195,185,0.4); z-index: 2;
    transition: color 0.2s;
  }
  .bc-eye-btn:hover { color: #c8a96e; }

  .bc-forgot {
    text-align: right; margin-top: -8px;
  }
  .bc-forgot a {
    font-size: 12px; color: rgba(200,169,110,0.7);
    text-decoration: none; letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .bc-forgot a:hover { color: #c8a96e; }

  /* Submit button */
  .bc-submit {
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
    margin-top: 4px;
  }
  .bc-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(200,169,110,0.35), 0 4px 12px rgba(0,0,0,0.5);
  }
  .bc-submit:hover:not(:disabled)::before { opacity: 1; }
  .bc-submit:active:not(:disabled) { transform: translateY(0); }
  .bc-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .bc-submit-arrow {
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .bc-submit:hover:not(:disabled) .bc-submit-arrow { transform: translateX(5px); }

  /* Divider */
  .bc-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 8px 0;
  }
  .bc-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.08);
  }
  .bc-divider-text {
    font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(200,195,185,0.3);
    white-space: nowrap;
  }

  /* Register link */
  .bc-register-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    letter-spacing: 0.1em;
    color: rgba(200,195,185,0.65);
    text-decoration: none;
    transition: border-color 0.25s, color 0.25s, background 0.25s;
  }
  .bc-register-btn:hover {
    border-color: rgba(200,169,110,0.4);
    color: #e8d5a3;
    background: rgba(200,169,110,0.05);
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .bc-spin { animation: spin 0.8s linear infinite; }
`;

/* Floating particles data */
const PARTICLES = [
  { size: 4,  left: '15%', delay: '0s',   dur: '14s' },
  { size: 6,  left: '30%', delay: '3s',   dur: '18s' },
  { size: 3,  left: '55%', delay: '1.5s', dur: '12s' },
  { size: 5,  left: '70%', delay: '5s',   dur: '16s' },
  { size: 7,  left: '85%', delay: '2s',   dur: '20s' },
  { size: 3,  left: '45%', delay: '7s',   dur: '15s' },
  { size: 4,  left: '10%', delay: '4s',   dur: '17s' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) navigate("/market");
      else setError(result.message);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bidcycle-login">

        {/* ── LEFT PANEL ── */}
        <div className="bc-left">
          <div className="bc-left-bg" />
          <div className="bc-left-overlay" />
          <div className="bc-accent-line" />
          <div className="bc-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="bc-particle" style={{
                width: p.size, height: p.size,
                left: p.left, bottom: '-20px',
                animationDelay: p.delay, animationDuration: p.dur,
              }} />
            ))}
          </div>

          <div className="bc-left-content">
            <div className="bc-logo">Bid<span>Cycle</span></div>

            <div className="bc-tagline-block">
              <div className="bc-eyebrow">Est. 2026 · Global Auctions</div>
              <h1 className="bc-headline">
                Discover<br /><em>Extraordinary</em><br />Items
              </h1>
              <p className="bc-sub">
                The world's most trusted marketplace for curated auctions.
                Bid, sell, and win with complete confidence.
              </p>
            </div>
            <div className="bc-footer-text">
              © {new Date().getFullYear()} BidCycle Inc. · All rights reserved.
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="bc-right">
          <div className="bc-corner bc-corner--tl" />
          <div className="bc-corner bc-corner--br" />

          <div className="bc-card">
            {/* Header */}
            <div className="bc-card-header">
              <div className="bc-card-eyebrow">Member Access</div>
              <h2 className="bc-card-title">Welcome <em>Back</em></h2>
              <p className="bc-card-sub">Sign in to continue to your account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bc-error">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <p>{error}</p>
              </div>
            )}

            <form className="bc-form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="bc-field">
                <label className="bc-label">Email Address</label>
                <div className="bc-input-wrap">
                  <div className="bc-input-icon">
                    <Mail size={16} />
                  </div>
                  <input
                    name="email" type="email" required
                    value={formData.email} onChange={handleChange}
                    className="bc-input" placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="bc-field">
                <label className="bc-label">Password</label>
                <div className="bc-input-wrap">
                  <div className="bc-input-icon">
                    <Lock size={16} />
                  </div>
                  <input
                    name="password" type={showPass ? "text" : "password"} required
                    value={formData.password} onChange={handleChange}
                    className="bc-input" placeholder="••••••••"
                  />
                  <button type="button" className="bc-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="bc-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" className="bc-submit" disabled={loading}>
                {loading
                  ? <Loader size={18} className="bc-spin" />
                  : <>
                      Sign In
                      <ArrowRight size={16} className="bc-submit-arrow" />
                    </>
                }
              </button>

              {/* Divider */}
              <div className="bc-divider">
                <div className="bc-divider-line" />
                <span className="bc-divider-text">New to BidCycle?</span>
                <div className="bc-divider-line" />
              </div>

              {/* Register */}
              <Link to="/register" className="bc-register-btn">
                Create an Account
              </Link>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;