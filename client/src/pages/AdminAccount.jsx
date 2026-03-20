import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import axios from "axios";
import {
  User, Lock, Settings, Camera, Save, Upload, Shield,
  Bell, AlertTriangle, CheckCircle, X, Mail, Phone,
  MapPin, FileText, Eye, EyeOff
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-adm * { box-sizing: border-box; }

  .bc-adm {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-adm-inner { max-width: 1100px; margin: 0 auto; }

  /* ── Access denied ── */
  .bc-adm-denied {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .bc-adm-denied-card {
    background: #0d0c14;
    border: 1px solid rgba(200,169,110,0.15);
    border-radius: 20px;
    padding: 52px 44px; text-align: center; max-width: 400px;
  }
  .bc-adm-denied-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #f87171; margin: 0 auto 20px;
  }
  .bc-adm-denied h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: #f5f0e8; margin-bottom: 8px;
  }
  .bc-adm-denied p { font-size: 13px; color: rgba(200,195,185,0.45); line-height: 1.65; }

  /* ── Header ── */
  .bc-adm-header {
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-adm-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-adm-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-adm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-adm-title em { font-style: italic; color: #c8a96e; }
  .bc-adm-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* ── Global message ── */
  .bc-adm-msg {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    border-radius: 12px; padding: 13px 16px;
    margin-bottom: 28px; font-size: 13px;
    animation: bc-adm-fadein 0.3s ease;
  }
  @keyframes bc-adm-fadein { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .bc-adm-msg--success { background:rgba(16,185,129,0.09); border:1px solid rgba(16,185,129,0.22); color:#6ee7b7; }
  .bc-adm-msg--error {
    background:rgba(239,68,68,0.09); border:1px solid rgba(239,68,68,0.22); color:#fca5a5;
    animation: bc-adm-shake 0.35s ease;
  }
  @keyframes bc-adm-shake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)}
  }
  .bc-adm-msg-left { display:flex; align-items:center; gap:9px; }
  .bc-adm-msg-close { background:none; border:none; cursor:pointer; color:inherit; opacity:.6; padding:2px; transition:opacity .2s; }
  .bc-adm-msg-close:hover { opacity:1; }

  /* ── Layout ── */
  .bc-adm-layout {
    display: grid; grid-template-columns: 1fr; gap: 20px;
  }
  @media (min-width: 768px) { .bc-adm-layout { grid-template-columns: 260px 1fr; } }

  /* ── Sidebar ── */
  .bc-adm-sidebar {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px; overflow: hidden;
    height: fit-content; position: sticky; top: 80px;
  }
  .bc-adm-banner {
    padding: 28px 20px 24px;
    background: linear-gradient(135deg, rgba(200,169,110,0.12) 0%, rgba(124,58,237,0.1) 100%);
    border-bottom: 1px solid rgba(200,169,110,0.1);
    text-align: center; position: relative;
  }
  .bc-adm-banner::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(200,169,110,0.4), transparent);
  }
  .bc-adm-avatar-ring {
    width: 88px; height: 88px; border-radius: 50%;
    background: linear-gradient(135deg, #c8a96e, #7c5c2a);
    padding: 2px; margin: 0 auto 14px;
  }
  .bc-adm-avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: #1a1625;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .bc-adm-avatar-initial {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 400; color: #c8a96e;
  }
  .bc-adm-avatar-inner img { width:100%; height:100%; object-fit:cover; }
  .bc-adm-sidebar-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f5f0e8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .bc-adm-sidebar-email {
    font-size: 12px; color: rgba(200,195,185,0.38);
    margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .bc-adm-admin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 10px;
    padding: 4px 12px; border-radius: 999px;
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
    background: rgba(200,169,110,0.12); border: 1px solid rgba(200,169,110,0.25); color: #c8a96e;
  }

  /* Nav */
  .bc-adm-nav { padding: 10px; }
  .bc-adm-nav-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    border-radius: 10px; border: none; cursor: pointer;
    background: transparent; color: rgba(220,215,205,0.5);
    transition: background .2s, color .2s; margin-bottom: 2px; text-align: left;
  }
  .bc-adm-nav-btn:hover { background: rgba(200,169,110,0.07); color: #e8d5a3; }
  .bc-adm-nav-btn--active {
    background: rgba(200,169,110,0.1); color: #c8a96e;
    border: 1px solid rgba(200,169,110,0.15);
  }

  /* ── Content panel ── */
  .bc-adm-content {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px; padding: 32px; min-height: 500px;
  }

  /* Section head */
  .bc-adm-sec-head {
    display: flex; align-items: center; gap: 14px;
    padding-bottom: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 28px;
  }
  .bc-adm-sec-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.08); border: 1px solid rgba(200,169,110,0.18); color: #c8a96e;
  }
  .bc-adm-sec-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 400; color: #f5f0e8;
  }
  .bc-adm-sec-sub { font-size: 12px; color: rgba(200,195,185,0.38); margin-top: 3px; }

  /* Fields */
  .bc-adm-form { display: flex; flex-direction: column; gap: 18px; }
  .bc-adm-grid-2 { display: grid; grid-template-columns: 1fr; gap: 18px; }
  @media (min-width: 640px) { .bc-adm-grid-2 { grid-template-columns: 1fr 1fr; } }
  .bc-adm-field { display: flex; flex-direction: column; gap: 7px; }
  .bc-adm-label { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: rgba(200,195,185,0.38); }

  .bc-adm-input-wrap { position: relative; }
  .bc-adm-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2; transition: color .2s;
  }
  .bc-adm-textarea-icon {
    position: absolute; top: 13px; left: 14px;
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2; transition: color .2s;
  }
  .bc-adm-input-wrap:focus-within .bc-adm-input-icon,
  .bc-adm-input-wrap:focus-within .bc-adm-textarea-icon { color: #c8a96e; }

  .bc-adm-input {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px; padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #f0ebe0;
    outline: none; transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .bc-adm-input::placeholder { color: rgba(200,195,185,0.18); }
  .bc-adm-input:focus {
    border-color: rgba(200,169,110,0.5); background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }
  .bc-adm-input:disabled { opacity:.4; cursor:not-allowed; background:rgba(255,255,255,.02); }
  .bc-adm-input--pr { padding-right: 42px; }
  .bc-adm-input--no-icon { padding-left: 14px; }

  .bc-adm-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px; padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #f0ebe0;
    outline: none; resize: none; transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .bc-adm-textarea::placeholder { color: rgba(200,195,185,0.18); }
  .bc-adm-textarea:focus {
    border-color: rgba(200,169,110,0.5); background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-adm-eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 3px;
    color: rgba(200,195,185,0.35); z-index: 2; transition: color .2s;
  }
  .bc-adm-eye-btn:hover { color: #c8a96e; }

  /* ── Toggle rows ── */
  .bc-adm-toggles { display: flex; flex-direction: column; gap: 10px; }
  .bc-adm-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .bc-adm-toggle-row:hover {
    border-color: rgba(200,169,110,0.18); background: rgba(200,169,110,0.03);
  }
  .bc-adm-toggle-left { display: flex; align-items: center; gap: 12px; }
  .bc-adm-toggle-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, border-color .2s;
  }
  .bc-adm-toggle-icon--on {
    background: rgba(200,169,110,0.1); border: 1px solid rgba(200,169,110,0.2); color: #c8a96e;
  }
  .bc-adm-toggle-icon--off {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(200,195,185,0.3);
  }
  .bc-adm-toggle-label {
    font-size: 13px; color: rgba(220,215,205,0.65); text-transform: capitalize;
  }

  /* Custom toggle switch */
  .bc-adm-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
  .bc-adm-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
  .bc-adm-switch-track {
    position: absolute; inset: 0; border-radius: 999px;
    transition: background .2s;
  }
  .bc-adm-switch-track--on { background: linear-gradient(135deg, #c8a96e, #a07840); }
  .bc-adm-switch-track--off { background: rgba(255,255,255,0.08); }
  .bc-adm-switch-thumb {
    position: absolute; top: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    transition: transform .2s cubic-bezier(.34,1.56,.64,1);
  }
  .bc-adm-switch-thumb--on  { transform: translateX(23px); }
  .bc-adm-switch-thumb--off { transform: translateX(3px); }

  /* Buttons */
  .bc-adm-form-footer { display: flex; justify-content: flex-end; padding-top: 8px; }
  .bc-adm-save-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: #0a0a0f; border: none; border-radius: 11px; cursor: pointer;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
    transition: transform .2s, box-shadow .2s, opacity .2s;
  }
  .bc-adm-save-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity .2s;
  }
  .bc-adm-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,0.35); }
  .bc-adm-save-btn:hover:not(:disabled)::before { opacity: 1; }
  .bc-adm-save-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* Profile pic zone */
  .bc-adm-pic-zone {
    border: 1px dashed rgba(200,169,110,0.18); border-radius: 16px;
    padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center;
    background: rgba(200,169,110,0.02);
  }
  .bc-adm-pic-avatar {
    width: 160px; height: 160px; border-radius: 50%;
    background: linear-gradient(135deg, #c8a96e, #7c5c2a);
    padding: 3px; margin-bottom: 28px;
  }
  .bc-adm-pic-avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: #13121a;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    color: rgba(200,169,110,0.25);
  }
  .bc-adm-pic-avatar-inner img { width:100%; height:100%; object-fit:cover; }
  .bc-adm-pic-actions { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px; }
  .bc-adm-file-label {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px 16px;
    font-size: 12px; font-weight: 400; letter-spacing: .1em; text-transform: uppercase;
    color: rgba(220,215,205,0.55);
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; cursor: pointer;
    transition: color .2s, border-color .2s, background .2s;
  }
  .bc-adm-file-label:hover { color: #e8d5a3; border-color: rgba(200,169,110,0.35); background: rgba(200,169,110,0.06); }
  .bc-adm-pic-hint { font-size: 11px; color: rgba(200,195,185,0.25); letter-spacing: .06em; margin-top: 4px; text-align: center; }
`;

const TOGGLE_ICONS = {
  emailNotifications: <Bell size={15} />,
  systemAlerts:        <AlertTriangle size={15} />,
  autoBanSuspiciousUsers: <Shield size={15} />,
  requireApprovalForItems: <FileText size={15} />,
};

const TabWrapper = ({ children }) => <div>{children}</div>;

const AdminAccount = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [activeTab, setActiveTab]   = useState("profile");
  const [loading, setLoading]       = useState(false);
  const [message, setMessage]       = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({ name:"", email:"", phone:"", address:"", bio:"" });
  const [passwordData, setPasswordData] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [adminSettings, setAdminSettings] = useState({
    emailNotifications: true, systemAlerts: true,
    autoBanSuspiciousUsers: false, requireApprovalForItems: false,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profilePic, setProfilePic]               = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name||"", email: user.email||"", phone: user.phone||"", address: user.address||"", bio: user.bio||"" });
      setProfilePicPreview(user.profilePic);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type:"", text:"" });
    try {
      const res = await api.put("/auth/profile", profileData);
      setMessage({ type:"success", text:"Profile updated successfully!" });
      localStorage.setItem("user", JSON.stringify({ ...user, ...res.data }));
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Failed to update profile" });
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type:"", text:"" });
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type:"error", text:"New passwords do not match" }); setLoading(false); return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type:"error", text:"Password must be at least 6 characters" }); setLoading(false); return;
    }
    try {
      await api.put("/auth/change-password", { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setMessage({ type:"success", text:"Password changed successfully!" });
      setPasswordData({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Failed to change password" });
    } finally { setLoading(false); }
  };

  const handleAdminSettingsUpdate = async (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setMessage({ type:"success", text:"Admin settings updated successfully!" }); setLoading(false); }, 800);
  };

  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePic) { setMessage({ type:"error", text:"Please select an image first" }); return; }
    setLoading(true); setMessage({ type:"", text:"" });
    const formData = new FormData();
    formData.append("profilePic", profilePic);
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${baseURL}/auth/profile-pic`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type:"success", text:"Profile picture updated successfully!" });
      setProfilePicPreview(res.data.profilePic); setProfilePic(null);
      const cur = JSON.parse(localStorage.getItem("user"));
      cur.profilePic = res.data.profilePic;
      localStorage.setItem("user", JSON.stringify(cur));
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Failed to upload profile picture" });
    } finally { setLoading(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!user || user.role !== "Admin") return (
    <div className="bc-adm-denied">
      <div className="bc-adm-denied-card">
        <div className="bc-adm-denied-icon"><Shield size={26} /></div>
        <h2>Access Denied</h2>
        <p>This page is only accessible to administrators.</p>
      </div>
    </div>
  );

  const tabs = [
    { id:"profile",        icon:<User size={15} />,     label:"Profile Info" },
    { id:"password",       icon:<Lock size={15} />,     label:"Security" },
    { id:"admin-settings", icon:<Settings size={15} />, label:"System Config" },
    { id:"profile-pic",    icon:<Camera size={15} />,   label:"Profile Picture" },
  ];

  const switchTab = (id) => { setActiveTab(id); setMessage({ type:"", text:"" }); };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-adm">
        <div className="bc-adm-inner">

          {/* Header */}
          <div className="bc-adm-header">
            <div className="bc-adm-eyebrow">Admin Portal</div>
            <h1 className="bc-adm-title">Admin <em>Settings</em></h1>
            <p className="bc-adm-sub">Manage your account and system preferences</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`bc-adm-msg bc-adm-msg--${message.type}`}>
              <div className="bc-adm-msg-left">
                {message.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {message.text}
              </div>
              <button className="bc-adm-msg-close" onClick={() => setMessage({ type:"", text:"" })}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="bc-adm-layout">

            {/* ── Sidebar ── */}
            <aside className="bc-adm-sidebar">
              <div className="bc-adm-banner">
                <div className="bc-adm-avatar-ring">
                  <div className="bc-adm-avatar-inner">
                    {profilePicPreview || user.profilePic
                      ? <img src={profilePicPreview || user.profilePic} alt="Profile" />
                      : <span className="bc-adm-avatar-initial">{user.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                </div>
                <div className="bc-adm-sidebar-name">{user.name}</div>
                <div className="bc-adm-sidebar-email">{user.email}</div>
                <div className="bc-adm-admin-badge"><Shield size={10} /> Admin</div>
              </div>

              <nav className="bc-adm-nav">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`bc-adm-nav-btn${activeTab === tab.id ? " bc-adm-nav-btn--active" : ""}`}
                    onClick={() => switchTab(tab.id)}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── Content ── */}
            <div className="bc-adm-content">

              {/* Profile tab */}
              {activeTab === "profile" && (
                <TabWrapper>
                  <div className="bc-adm-sec-head">
                    <div className="bc-adm-sec-icon"><User size={18} /></div>
                    <div>
                      <div className="bc-adm-sec-title">Profile Information</div>
                      <div className="bc-adm-sec-sub">Update your personal details</div>
                    </div>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="bc-adm-form">
                    <div className="bc-adm-grid-2">
                      <div className="bc-adm-field">
                        <label className="bc-adm-label">Full Name</label>
                        <div className="bc-adm-input-wrap">
                          <div className="bc-adm-input-icon"><User size={14} /></div>
                          <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name:e.target.value})} className="bc-adm-input" />
                        </div>
                      </div>
                      <div className="bc-adm-field">
                        <label className="bc-adm-label">Email Address</label>
                        <div className="bc-adm-input-wrap">
                          <div className="bc-adm-input-icon"><Mail size={14} /></div>
                          <input type="email" value={profileData.email} disabled className="bc-adm-input" />
                        </div>
                      </div>
                      <div className="bc-adm-field">
                        <label className="bc-adm-label">Phone Number</label>
                        <div className="bc-adm-input-wrap">
                          <div className="bc-adm-input-icon"><Phone size={14} /></div>
                          <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone:e.target.value})} className="bc-adm-input" />
                        </div>
                      </div>
                    </div>
                    <div className="bc-adm-field">
                      <label className="bc-adm-label">Address</label>
                      <div className="bc-adm-input-wrap">
                        <div className="bc-adm-textarea-icon"><MapPin size={14} /></div>
                        <textarea rows={2} value={profileData.address} onChange={e => setProfileData({...profileData, address:e.target.value})} className="bc-adm-textarea" />
                      </div>
                    </div>
                    <div className="bc-adm-field">
                      <label className="bc-adm-label">Bio</label>
                      <div className="bc-adm-input-wrap">
                        <div className="bc-adm-textarea-icon"><FileText size={14} /></div>
                        <textarea rows={4} value={profileData.bio} onChange={e => setProfileData({...profileData, bio:e.target.value})} placeholder="Tell us about yourself…" className="bc-adm-textarea" />
                      </div>
                    </div>
                    <div className="bc-adm-form-footer">
                      <button type="submit" disabled={loading} className="bc-adm-save-btn">
                        <Save size={13} /> {loading ? "Saving…" : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </TabWrapper>
              )}

              {/* Password tab */}
              {activeTab === "password" && (
                <TabWrapper>
                  <div className="bc-adm-sec-head">
                    <div className="bc-adm-sec-icon"><Lock size={18} /></div>
                    <div>
                      <div className="bc-adm-sec-title">Security Settings</div>
                      <div className="bc-adm-sec-sub">Manage your password and security</div>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordChange} className="bc-adm-form" style={{maxWidth:'420px'}}>
                    {[
                      { label:"Current Password", key:"currentPassword", show:showCurrentPassword, toggle:()=>setShowCurrentPassword(p=>!p) },
                      { label:"New Password",     key:"newPassword",     show:showNewPassword,     toggle:()=>setShowNewPassword(p=>!p) },
                      { label:"Confirm New Password", key:"confirmPassword", show:showConfirmPassword, toggle:()=>setShowConfirmPassword(p=>!p) },
                    ].map(f => (
                      <div className="bc-adm-field" key={f.key}>
                        <label className="bc-adm-label">{f.label}</label>
                        <div className="bc-adm-input-wrap">
                          <input
                            type={f.show ? "text" : "password"}
                            required value={passwordData[f.key]}
                            onChange={e => setPasswordData({...passwordData, [f.key]:e.target.value})}
                            className="bc-adm-input bc-adm-input--no-icon bc-adm-input--pr"
                          />
                          <button type="button" className="bc-adm-eye-btn" onClick={f.toggle}>
                            {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="bc-adm-form-footer">
                      <button type="submit" disabled={loading} className="bc-adm-save-btn">
                        {loading ? "Updating…" : "Update Password"}
                      </button>
                    </div>
                  </form>
                </TabWrapper>
              )}

              {/* Admin settings tab */}
              {activeTab === "admin-settings" && (
                <TabWrapper>
                  <div className="bc-adm-sec-head">
                    <div className="bc-adm-sec-icon"><Settings size={18} /></div>
                    <div>
                      <div className="bc-adm-sec-title">System Configuration</div>
                      <div className="bc-adm-sec-sub">Configure platform settings</div>
                    </div>
                  </div>
                  <form onSubmit={handleAdminSettingsUpdate} style={{maxWidth:'500px'}}>
                    <div className="bc-adm-toggles" style={{marginBottom:'24px'}}>
                      {Object.keys(adminSettings).map(key => {
                        const on = adminSettings[key];
                        return (
                          <label key={key} className="bc-adm-toggle-row">
                            <div className="bc-adm-toggle-left">
                              <div className={`bc-adm-toggle-icon bc-adm-toggle-icon--${on?'on':'off'}`}>
                                {TOGGLE_ICONS[key]}
                              </div>
                              <span className="bc-adm-toggle-label">
                                {key.replace(/([A-Z])/g, " $1")}
                              </span>
                            </div>
                            <div className="bc-adm-switch">
                              <input
                                type="checkbox" checked={on}
                                onChange={() => setAdminSettings({...adminSettings, [key]: !on})}
                              />
                              <span className={`bc-adm-switch-track bc-adm-switch-track--${on?'on':'off'}`} />
                              <span className={`bc-adm-switch-thumb bc-adm-switch-thumb--${on?'on':'off'}`} />
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    <div className="bc-adm-form-footer">
                      <button type="submit" disabled={loading} className="bc-adm-save-btn">
                        {loading ? "Saving…" : "Save Configuration"}
                      </button>
                    </div>
                  </form>
                </TabWrapper>
              )}

              {/* Profile pic tab */}
              {activeTab === "profile-pic" && (
                <TabWrapper>
                  <div className="bc-adm-sec-head">
                    <div className="bc-adm-sec-icon"><Camera size={18} /></div>
                    <div>
                      <div className="bc-adm-sec-title">Profile Picture</div>
                      <div className="bc-adm-sec-sub">Update your public avatar</div>
                    </div>
                  </div>
                  <div className="bc-adm-pic-zone">
                    <div className="bc-adm-pic-avatar">
                      <div className="bc-adm-pic-avatar-inner">
                        {profilePicPreview
                          ? <img src={profilePicPreview} alt="Preview" />
                          : <User size={52} />
                        }
                      </div>
                    </div>
                    <div className="bc-adm-pic-actions">
                      <label className="bc-adm-file-label">
                        <Upload size={13} /> Choose Image File
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
                      </label>
                      <button
                        onClick={handleProfilePicUpload}
                        disabled={loading || !profilePic}
                        className="bc-adm-save-btn"
                        style={{width:'100%', justifyContent:'center'}}
                      >
                        {loading ? "Uploading…" : "Upload New Picture"}
                      </button>
                      <p className="bc-adm-pic-hint">Supported formats: JPG, PNG, JPEG</p>
                    </div>
                  </div>
                </TabWrapper>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAccount;