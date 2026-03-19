import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, ArrowLeft, Loader, KeyRound } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bidcycle-forgot * { box-sizing: border-box; }

  .bidcycle-forgot {
    min-height: 100vh;
    display: flex;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Left panel ── */
  .bc-f-left {
    display: none;
    width: 48%;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  @media (min-width: 1024px) { .bc-f-left { display: block; } }

  .bc-f-left-bg {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat;
  }
  .bc-f-left-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,10,20,0.93) 0%, rgba(30,12,60,0.80) 60%, rgba(10,10,20,0.97) 100%);
  }

  .bc-f-particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .bc-f-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(180,145,255,0.18);
    animation: bc-f-floatUp linear infinite;
  }
  @keyframes bc-f-floatUp {
    0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
  }

  .bc-f-accent-line {
    position: absolute;
    left: 48px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.5) 30%, rgba(212,175,55,0.5) 70%, transparent);
  }

  .bc-f-left-content {
    position: relative; z-index: 10;
    height: 100%;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 48px 56px 48px 72px;
    color: #fff;
  }

  .bc-f-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #e8d5a3;
  }
  .bc-f-logo span { color: #c8a96e; font-weight: 600; }

  .bc-f-eyebrow {
    font-size: 11px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .bc-f-eyebrow::before {
    content: '';
    display: block; width: 32px; height: 1px;
    background: #c8a96e;
  }

  .bc-f-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 3.8vw, 56px);
    font-weight: 300;
    line-height: 1.12;
    margin: 0 0 24px;
    color: #f5f0e8;
  }
  .bc-f-headline em { font-style: italic; color: #c8a96e; }

  .bc-f-sub {
    font-size: 13px;
    color: rgba(220,215,205,0.65);
    line-height: 1.7;
    max-width: 300px;
    margin-bottom: 36px;
  }

  .bc-f-steps { display: flex; flex-direction: column; gap: 16px; }
  .bc-f-step { display: flex; align-items: flex-start; gap: 14px; }
  .bc-f-step-num {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid rgba(200,169,110,0.5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; color: #c8a96e;
    flex-shrink: 0; margin-top: 1px;
  }
  .bc-f-step-text {
    font-size: 12px;
    color: rgba(220,215,205,0.55);
    line-height: 1.6;
    letter-spacing: 0.03em;
  }
  .bc-f-step-text strong {
    display: block;
    color: rgba(220,215,205,0.8);
    font-weight: 500;
    margin-bottom: 2px;
  }

  .bc-f-footer-text {
    font-size: 11px;
    color: rgba(220,215,205,0.3);
    letter-spacing: 0.08em;
  }

  /* ── Right panel ── */
  .bc-f-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 24px;
    background: #0a0a0f;
    position: relative;
    min-height: 100vh;
  }
  @media (min-width: 1024px) { .bc-f-right { padding: 40px 56px; } }

  .bc-f-corner {
    position: absolute; width: 64px; height: 64px;
    pointer-events: none;
  }
  .bc-f-corner--tl { top: 24px; left: 24px; border-top: 1px solid rgba(200,169,110,0.3); border-left: 1px solid rgba(200,169,110,0.3); }
  .bc-f-corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(200,169,110,0.3); border-right: 1px solid rgba(200,169,110,0.3); }

  .bc-f-card {
    width: 100%; max-width: 420px;
    animation: bc-f-fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes bc-f-fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Icon badge */
  .bc-f-icon-badge {
    width: 56px; height: 56px;
    border-radius: 16px;
    border: 1px solid rgba(200,169,110,0.3);
    background: rgba(200,169,110,0.07);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
    color: #c8a96e;
    box-shadow: 0 0 24px rgba(200,169,110,0.1);
  }

  .bc-f-card-header { margin-bottom: 36px; }
  .bc-f-card-eyebrow {
    font-size: 11px; letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-f-card-eyebrow::after {
    content: ''; flex: 1; max-width: 40px; height: 1px;
    background: linear-gradient(to right, #c8a96e, transparent);
  }
  .bc-f-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 300; line-height: 1.1;
    color: #f5f0e8;
    margin: 0 0 10px;
  }
  .bc-f-card-title em { font-style: italic; color: #c8a96e; }
  .bc-f-card-sub {
    font-size: 13px; color: rgba(200,195,185,0.5);
    line-height: 1.65;
    letter-spacing: 0.02em;
    max-width: 320px;
  }

  /* Error */
  .bc-f-error {
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.3);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
    animation: bc-f-shake 0.35s ease;
  }
  @keyframes bc-f-shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }
  .bc-f-error p { font-size: 13px; color: #fca5a5; margin: 0; }

  /* Form */
  .bc-f-form { display: flex; flex-direction: column; gap: 20px; }

  .bc-f-field { display: flex; flex-direction: column; gap: 8px; }
  .bc-f-label {
    font-size: 11px; letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(200,195,185,0.45);
  }

  .bc-f-input-wrap { position: relative; }
  .bc-f-input-icon {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    pointer-events: none; z-index: 2;
    color: rgba(200,169,110,0.45);
    transition: color 0.2s;
  }
  .bc-f-input-wrap:focus-within .bc-f-input-icon { color: #c8a96e; }

  .bc-f-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 14px 16px 14px 44px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .bc-f-input::placeholder { color: rgba(200,195,185,0.2); }
  .bc-f-input:focus {
    border-color: rgba(200,169,110,0.55);
    background: rgba(200,169,110,0.05);
    box-shadow: 0 0 0 4px rgba(200,169,110,0.07), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  /* Submit */
  .bc-f-submit {
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
  .bc-f-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-f-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(200,169,110,0.35), 0 4px 12px rgba(0,0,0,0.5);
  }
  .bc-f-submit:hover:not(:disabled)::before { opacity: 1; }
  .bc-f-submit:active:not(:disabled) { transform: translateY(0); }
  .bc-f-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Back link */
  .bc-f-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; letter-spacing: 0.05em;
    color: rgba(200,195,185,0.45);
    text-decoration: none;
    transition: color 0.2s, gap 0.2s;
    margin-top: 8px;
  }
  .bc-f-back:hover { color: #c8a96e; gap: 12px; }
  .bc-f-back-icon { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .bc-f-back:hover .bc-f-back-icon { transform: translateX(-4px); }

  @keyframes bc-f-spin { to { transform: rotate(360deg); } }
  .bc-f-spin { animation: bc-f-spin 0.8s linear infinite; }
`;

const PARTICLES = [
  { size: 4,  left: '15%', delay: '0s',   dur: '14s' },
  { size: 6,  left: '35%', delay: '3s',   dur: '18s' },
  { size: 3,  left: '58%', delay: '1.5s', dur: '12s' },
  { size: 5,  left: '72%', delay: '5s',   dur: '16s' },
  { size: 4,  left: '88%', delay: '2.5s', dur: '20s' },
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        navigate("/verify-otp", { state: { email, token: result.token } });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bidcycle-forgot">

        {/* ── LEFT PANEL ── */}
        <div className="bc-f-left">
          <div className="bc-f-left-bg" />
          <div className="bc-f-left-overlay" />
          <div className="bc-f-accent-line" />
          <div className="bc-f-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="bc-f-particle" style={{
                width: p.size, height: p.size,
                left: p.left, bottom: '-20px',
                animationDelay: p.delay, animationDuration: p.dur,
              }} />
            ))}
          </div>

          <div className="bc-f-left-content">
            <div className="bc-f-logo">Bid<span>Cycle</span></div>

            <div>
              <div className="bc-f-eyebrow">Account Recovery</div>
              <h1 className="bc-f-headline">
                Regain Your<br /><em>Access</em>
              </h1>
              <p className="bc-f-sub">
                Don't worry — it happens to the best of us. We'll get you back into your account in just a few steps.
              </p>
              <div className="bc-f-steps">
                <div className="bc-f-step">
                  <div className="bc-f-step-num">1</div>
                  <div className="bc-f-step-text">
                    <strong>Enter your email</strong>
                    Provide the address linked to your account.
                  </div>
                </div>
                <div className="bc-f-step">
                  <div className="bc-f-step-num">2</div>
                  <div className="bc-f-step-text">
                    <strong>Check your inbox</strong>
                    We'll send a secure verification code.
                  </div>
                </div>
                <div className="bc-f-step">
                  <div className="bc-f-step-num">3</div>
                  <div className="bc-f-step-text">
                    <strong>Reset your password</strong>
                    Choose a new password and regain access.
                  </div>
                </div>
              </div>
            </div>

            <div className="bc-f-footer-text">
              © {new Date().getFullYear()} BidCycle Inc. · All rights reserved.
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="bc-f-right">
          <div className="bc-f-corner bc-f-corner--tl" />
          <div className="bc-f-corner bc-f-corner--br" />

          <div className="bc-f-card">
            {/* Icon badge */}
            <div className="bc-f-icon-badge">
              <KeyRound size={24} />
            </div>

            {/* Header */}
            <div className="bc-f-card-header">
              <div className="bc-f-card-eyebrow">Password Reset</div>
              <h2 className="bc-f-card-title">Forgot <em>Password?</em></h2>
              <p className="bc-f-card-sub">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bc-f-error">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#f87171" style={{flexShrink:0}}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <p>{error}</p>
              </div>
            )}

            <form className="bc-f-form" onSubmit={handleSubmit}>
              <div className="bc-f-field">
                <label className="bc-f-label">Email Address</label>
                <div className="bc-f-input-wrap">
                  <div className="bc-f-input-icon"><Mail size={16} /></div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bc-f-input"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="bc-f-submit">
                {loading ? (
                  <Loader size={18} className="bc-f-spin" />
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>

            <div style={{ marginTop: "28px", textAlign: "center" }}>
              <Link to="/login" className="bc-f-back">
                <ArrowLeft size={15} className="bc-f-back-icon" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ForgotPassword;