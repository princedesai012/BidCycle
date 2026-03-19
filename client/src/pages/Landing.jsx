import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Shield, Zap, Globe, Trophy } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-land * { box-sizing: border-box; margin: 0; padding: 0; }

  .bc-land {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    overflow-x: hidden;
  }

  /* ════════════════════════════════
     HERO
  ════════════════════════════════ */
  .bc-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  /* Right image panel */
  .bc-hero-img {
    position: absolute;
    inset: 0; right: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center;
    filter: brightness(0.28) saturate(0.9);
  }

  /* Layered overlays */
  .bc-hero-overlay-l {
    position: absolute; inset: 0;
    background: linear-gradient(105deg,
      rgba(10,10,15,1) 0%,
      rgba(10,10,15,0.97) 32%,
      rgba(10,10,15,0.7) 58%,
      rgba(10,10,15,0.15) 80%,
      transparent 100%
    );
  }
  .bc-hero-overlay-b {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 220px;
    background: linear-gradient(to top, #0a0a0f, transparent);
  }

  /* Particles */
  .bc-hero-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .bc-hero-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(180,145,255,0.14);
    animation: bc-land-floatUp linear infinite;
  }
  @keyframes bc-land-floatUp {
    0%   { transform: translateY(110vh) scale(0.4); opacity: 0; }
    8%   { opacity: 0.8; }
    92%  { opacity: 0.4; }
    100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
  }

  /* Gold vertical line */
  .bc-hero-line {
    position: absolute;
    left: 80px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(200,169,110,0.45) 25%,
      rgba(200,169,110,0.45) 75%,
      transparent
    );
    display: none;
  }
  @media (min-width: 1024px) { .bc-hero-line { display: block; } }

  /* Hero content */
  .bc-hero-content {
    position: relative; z-index: 10;
    max-width: 1280px;
    margin: 0 auto;
    padding: 100px 24px 100px;
    width: 100%;
  }
  @media (min-width: 1024px) { .bc-hero-content { padding: 120px 80px 120px 110px; } }

  .bc-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 12px;
    font-size: 11px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 28px;
    animation: bc-land-fadeUp 0.8s 0.1s both;
  }
  .bc-hero-eyebrow::before {
    content: '';
    display: block; width: 36px; height: 1px;
    background: #c8a96e;
  }

  .bc-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 300;
    line-height: 1.05;
    color: #f5f0e8;
    margin-bottom: 28px;
    max-width: 680px;
    animation: bc-land-fadeUp 0.8s 0.2s both;
  }
  .bc-hero-title em {
    font-style: italic;
    color: #c8a96e;
    display: block;
  }

  .bc-hero-sub {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.75;
    color: rgba(220,215,205,0.6);
    max-width: 460px;
    margin-bottom: 48px;
    animation: bc-land-fadeUp 0.8s 0.3s both;
  }

  .bc-hero-actions {
    display: flex; flex-wrap: wrap; align-items: center; gap: 14px;
    animation: bc-land-fadeUp 0.8s 0.4s both;
  }

  .bc-hero-cta {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #0a0a0f;
    text-decoration: none;
    border-radius: 999px;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 8px 28px rgba(200,169,110,0.3);
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .bc-hero-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(200,169,110,0.4); }
  .bc-hero-cta:hover::before { opacity: 1; }
  .bc-hero-cta-arrow { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .bc-hero-cta:hover .bc-hero-cta-arrow { transform: translateX(5px); }

  .bc-hero-signin {
    display: inline-flex; align-items: center;
    padding: 14px 28px;
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(220,215,205,0.6);
    text-decoration: none;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.1);
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-hero-signin:hover {
    color: #e8d5a3;
    border-color: rgba(200,169,110,0.4);
    background: rgba(200,169,110,0.06);
  }

  /* Stats row */
  .bc-hero-stats {
    display: flex; flex-wrap: wrap; gap: 40px;
    margin-top: 72px;
    padding-top: 40px;
    border-top: 1px solid rgba(255,255,255,0.07);
    animation: bc-land-fadeUp 0.8s 0.55s both;
  }
  .bc-hero-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 300;
    color: #c8a96e;
    display: block;
    line-height: 1;
  }
  .bc-hero-stat-label {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(220,215,205,0.4);
    margin-top: 6px;
  }

  @keyframes bc-land-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════════════════════════════
     FEATURES
  ════════════════════════════════ */
  .bc-features {
    position: relative;
    padding: 120px 24px;
    background: #0d0c14;
  }
  /* subtle separator */
  .bc-features::before {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 1px; height: 80px;
    background: linear-gradient(to bottom, rgba(200,169,110,0.5), transparent);
  }

  .bc-features-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .bc-features-head {
    text-align: center;
    margin-bottom: 80px;
  }
  .bc-features-eyebrow {
    font-size: 11px; letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 16px;
    display: flex; align-items: center; justify-content: center; gap: 14px;
  }
  .bc-features-eyebrow::before,
  .bc-features-eyebrow::after {
    content: ''; display: block;
    width: 40px; height: 1px;
    background: linear-gradient(to right, transparent, #c8a96e);
  }
  .bc-features-eyebrow::after { background: linear-gradient(to left, transparent, #c8a96e); }

  .bc-features-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4.5vw, 56px);
    font-weight: 300;
    line-height: 1.12;
    color: #f5f0e8;
  }
  .bc-features-title em { font-style: italic; color: #c8a96e; }

  .bc-features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2px;
    background: rgba(200,169,110,0.08);
    border: 1px solid rgba(200,169,110,0.1);
    border-radius: 20px;
    overflow: hidden;
  }
  @media (min-width: 768px) { .bc-features-grid { grid-template-columns: 1fr 1fr; } }

  .bc-feature-card {
    background: #0d0c14;
    padding: 48px 44px;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .bc-feature-card::after {
    content: '';
    position: absolute; bottom: 0; left: 44px; right: 44px;
    height: 1px;
    background: rgba(200,169,110,0.08);
  }
  .bc-feature-card:hover { background: #11101a; }

  .bc-feature-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    border: 1px solid rgba(200,169,110,0.25);
    background: rgba(200,169,110,0.07);
    display: flex; align-items: center; justify-content: center;
    color: #c8a96e;
    margin-bottom: 24px;
    transition: background 0.3s, box-shadow 0.3s;
    box-shadow: 0 0 0 rgba(200,169,110,0);
  }
  .bc-feature-card:hover .bc-feature-icon {
    background: rgba(200,169,110,0.12);
    box-shadow: 0 0 20px rgba(200,169,110,0.12);
  }

  .bc-feature-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400;
    color: #f5f0e8;
    margin-bottom: 12px;
    letter-spacing: 0.02em;
  }
  .bc-feature-desc {
    font-size: 13px; font-weight: 300;
    line-height: 1.75;
    color: rgba(220,215,205,0.5);
  }

  /* decorative large number */
  .bc-feature-num {
    position: absolute;
    top: 20px; right: 28px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px; font-weight: 300;
    color: rgba(200,169,110,0.04);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  /* ════════════════════════════════
     CTA BANNER
  ════════════════════════════════ */
  .bc-cta-section {
    padding: 120px 24px;
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }
  .bc-cta-section::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(200,169,110,0.3) 40%, rgba(200,169,110,0.3) 60%, transparent);
  }
  .bc-cta-orb {
    position: absolute;
    border-radius: 50%; filter: blur(80px);
    pointer-events: none;
  }
  .bc-cta-orb-1 { width: 400px; height: 400px; background: rgba(124,58,237,0.08); top: -100px; right: -80px; }
  .bc-cta-orb-2 { width: 300px; height: 300px; background: rgba(200,169,110,0.06); bottom: -80px; left: -60px; }

  .bc-cta-inner {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    position: relative; z-index: 2;
  }
  .bc-cta-eyebrow {
    font-size: 11px; letter-spacing: 0.35em;
    text-transform: uppercase; color: #c8a96e;
    margin-bottom: 20px;
  }
  .bc-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 300; line-height: 1.1;
    color: #f5f0e8;
    margin-bottom: 20px;
  }
  .bc-cta-title em { font-style: italic; color: #c8a96e; }
  .bc-cta-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(220,215,205,0.5);
    line-height: 1.7; margin-bottom: 44px;
  }
  .bc-cta-actions {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px;
  }

  /* ════════════════════════════════
     FOOTER
  ════════════════════════════════ */
  .bc-footer {
    background: #08080d;
    border-top: 1px solid rgba(200,169,110,0.1);
    padding: 40px 24px;
  }
  .bc-footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between;
    gap: 16px;
  }
  .bc-footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #e8d5a3;
  }
  .bc-footer-logo span { color: #c8a96e; font-style: italic; }
  .bc-footer-copy {
    font-size: 12px; letter-spacing: 0.06em;
    color: rgba(220,215,205,0.3);
  }
  .bc-footer-tagline {
    font-size: 12px;
    color: rgba(220,215,205,0.28);
  }
`;

const PARTICLES = [
  { size: 5,  left: '8%',  delay: '0s',   dur: '18s' },
  { size: 7,  left: '22%', delay: '4s',   dur: '22s' },
  { size: 3,  left: '40%', delay: '1.5s', dur: '14s' },
  { size: 6,  left: '60%', delay: '6s',   dur: '20s' },
  { size: 4,  left: '75%', delay: '2.5s', dur: '16s' },
  { size: 8,  left: '88%', delay: '3s',   dur: '24s' },
  { size: 3,  left: '52%', delay: '8s',   dur: '15s' },
];

const FEATURES = [
  {
    icon: <Zap size={20} />,
    name: 'Real-Time Bidding',
    desc: 'Experience the thrill of live auctions with instant updates. Never miss a deal with our high-performance socket connection.',
  },
  {
    icon: <Shield size={20} />,
    name: 'Secure Transactions',
    desc: 'Your security is our priority. We use industry-standard encryption and verified payment processes to keep you safe.',
  },
  {
    icon: <Globe size={20} />,
    name: 'Global Marketplace',
    desc: 'Connect with buyers and sellers from around the world. Expand your reach and find items you can\'t find anywhere else.',
  },
  {
    icon: <Trophy size={20} />,
    name: 'Premium Auctions',
    desc: 'Access exclusive, high-value items vetted by our experts. Quality and authenticity guaranteed.',
  },
];

const Landing = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/market" replace />;

  return (
    <>
      <style>{styles}</style>
      <div className="bc-land">

        {/* ════════ HERO ════════ */}
        <section className="bc-hero">
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="bc-hero-img"
          />
          <div className="bc-hero-overlay-l" />
          <div className="bc-hero-overlay-b" />
          <div className="bc-hero-line" />
          <div className="bc-hero-particles">
            {PARTICLES.map((p, i) => (
              <div key={i} className="bc-hero-particle" style={{
                width: p.size, height: p.size,
                left: p.left, bottom: '-20px',
                animationDelay: p.delay, animationDuration: p.dur,
              }} />
            ))}
          </div>

          <div className="bc-hero-content">
            <div className="bc-hero-eyebrow">Est. 2026 · Global Auctions</div>

            <h1 className="bc-hero-title">
              The World's Premier<br />
              <em>Marketplace for Auctions</em>
            </h1>

            <p className="bc-hero-sub">
              Discover rare collectibles, unique items, and exclusive deals.
              BidCycle connects buyers and sellers in a secure, real-time bidding environment.
            </p>

            <div className="bc-hero-actions">
              <Link to="/register" className="bc-hero-cta">
                Get Started
                <ArrowRight size={15} className="bc-hero-cta-arrow" />
              </Link>
              <Link to="/login" className="bc-hero-signin">
                Sign In
              </Link>
            </div>

            <div className="bc-hero-stats">
              <div>
                <span className="bc-hero-stat-num">50K+</span>
                <div className="bc-hero-stat-label">Active Bidders</div>
              </div>
              <div>
                <span className="bc-hero-stat-num">12K+</span>
                <div className="bc-hero-stat-label">Items Listed</div>
              </div>
              <div>
                <span className="bc-hero-stat-num">99%</span>
                <div className="bc-hero-stat-label">Secure Transactions</div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FEATURES ════════ */}
        <section className="bc-features">
          <div className="bc-features-inner">
            <div className="bc-features-head">
              <div className="bc-features-eyebrow">Features</div>
              <h2 className="bc-features-title">
                Why Choose <em>BidCycle?</em>
              </h2>
            </div>

            <div className="bc-features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="bc-feature-card">
                  <div className="bc-feature-num">0{i + 1}</div>
                  <div className="bc-feature-icon">{f.icon}</div>
                  <div className="bc-feature-name">{f.name}</div>
                  <p className="bc-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ CTA BANNER ════════ */}
        <section className="bc-cta-section">
          <div className="bc-cta-orb bc-cta-orb-1" />
          <div className="bc-cta-orb bc-cta-orb-2" />
          <div className="bc-cta-inner">
            <div className="bc-cta-eyebrow">Join Today</div>
            <h2 className="bc-cta-title">
              Ready to Start<br /><em>Bidding?</em>
            </h2>
            <p className="bc-cta-sub">
              Trusted by thousands of bidders worldwide. Create your free account
              and discover extraordinary items waiting to be won.
            </p>
            <div className="bc-cta-actions">
              <Link to="/register" className="bc-hero-cta">
                Create Free Account
                <ArrowRight size={15} className="bc-hero-cta-arrow" />
              </Link>
              <Link to="/login" className="bc-hero-signin">
                Already a member? Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ════════ FOOTER ════════ */}
        <footer className="bc-footer">
          <div className="bc-footer-inner">
            <div className="bc-footer-logo">Bid<span>Cycle</span></div>
            <div className="bc-footer-tagline">Trusted by thousands of bidders worldwide.</div>
            <div className="bc-footer-copy">© {new Date().getFullYear()} BidCycle, Inc. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Landing;