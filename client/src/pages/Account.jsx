import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import axios from "axios";
import {
  User, Lock, Camera, Trash2, Mail, Phone, MapPin, FileText,
  AlertTriangle, CheckCircle, X, Upload, Save, Eye, EyeOff
} from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .bc-acct * { box-sizing: border-box; }

  .bc-acct {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    color: #f0ebe0;
    padding: 40px 24px 72px;
  }
  .bc-acct-inner { max-width: 1100px; margin: 0 auto; }

  /* ── Loading ── */
  .bc-acct-loading {
    min-height: 100vh; background: #0a0a0f;
    display: flex; align-items: center; justify-content: center;
  }
  .bc-acct-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid rgba(200,169,110,0.15);
    border-top-color: #c8a96e;
    animation: bc-acct-spin 0.8s linear infinite;
  }
  @keyframes bc-acct-spin { to { transform: rotate(360deg); } }

  /* ── Header ── */
  .bc-acct-header {
    margin-bottom: 36px;
    padding-bottom: 26px;
    border-bottom: 1px solid rgba(200,169,110,0.12);
  }
  .bc-acct-eyebrow {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
    color: #c8a96e; margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .bc-acct-eyebrow::before { content: ''; width: 24px; height: 1px; background: #c8a96e; }
  .bc-acct-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 300; line-height: 1.1; color: #f5f0e8;
  }
  .bc-acct-title em { font-style: italic; color: #c8a96e; }
  .bc-acct-sub { font-size: 13px; color: rgba(200,195,185,0.38); margin-top: 6px; }

  /* ── Global message ── */
  .bc-acct-msg {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    border-radius: 12px; padding: 13px 16px;
    margin-bottom: 28px; font-size: 13px;
    animation: bc-acct-fadein 0.3s ease;
  }
  @keyframes bc-acct-fadein { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .bc-acct-msg--success {
    background: rgba(16,185,129,0.09); border: 1px solid rgba(16,185,129,0.22); color: #6ee7b7;
  }
  .bc-acct-msg--error {
    background: rgba(239,68,68,0.09); border: 1px solid rgba(239,68,68,0.22); color: #fca5a5;
    animation: bc-acct-shake 0.35s ease;
  }
  @keyframes bc-acct-shake {
    0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)}
  }
  .bc-acct-msg-left { display: flex; align-items: center; gap: 9px; }
  .bc-acct-msg-close {
    background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6;
    padding: 2px; transition: opacity 0.2s; flex-shrink: 0;
  }
  .bc-acct-msg-close:hover { opacity: 1; }

  /* ── Two-column layout ── */
  .bc-acct-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 768px) {
    .bc-acct-layout { grid-template-columns: 260px 1fr; }
  }

  /* ── Sidebar ── */
  .bc-acct-sidebar {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    overflow: hidden;
    height: fit-content;
    position: sticky;
    top: 80px;
  }

  .bc-acct-profile-banner {
    padding: 28px 20px 24px;
    background: linear-gradient(135deg, rgba(200,169,110,0.12) 0%, rgba(124,58,237,0.08) 100%);
    border-bottom: 1px solid rgba(200,169,110,0.1);
    text-align: center;
    position: relative;
  }
  .bc-acct-profile-banner::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(to right, transparent, rgba(200,169,110,0.4), transparent);
  }

  .bc-acct-avatar-ring {
    width: 88px; height: 88px; border-radius: 50%;
    background: linear-gradient(135deg, #c8a96e, #7c5c2a);
    padding: 2px; margin: 0 auto 14px; flex-shrink: 0;
  }
  .bc-acct-avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: #1a1625;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .bc-acct-avatar-initial {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 400; color: #c8a96e;
  }
  .bc-acct-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }

  .bc-acct-sidebar-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f5f0e8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .bc-acct-sidebar-email {
    font-size: 12px; color: rgba(200,195,185,0.38);
    margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* Nav */
  .bc-acct-nav { padding: 10px; }
  .bc-acct-nav-btn {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    border-radius: 10px; border: none; cursor: pointer;
    background: transparent;
    color: rgba(220,215,205,0.5);
    transition: background 0.2s, color 0.2s;
    margin-bottom: 2px; text-align: left;
  }
  .bc-acct-nav-btn:hover {
    background: rgba(200,169,110,0.07); color: #e8d5a3;
  }
  .bc-acct-nav-btn--active {
    background: rgba(200,169,110,0.1);
    color: #c8a96e;
    border: 1px solid rgba(200,169,110,0.15);
  }
  .bc-acct-nav-btn--danger { color: rgba(248,113,113,0.6); }
  .bc-acct-nav-btn--danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }
  .bc-acct-nav-btn--danger-active {
    background: rgba(239,68,68,0.09);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .bc-acct-nav-btn svg { flex-shrink: 0; }

  /* ── Content panel ── */
  .bc-acct-content {
    background: #0d0c14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 32px;
    min-height: 500px;
  }

  /* Section header */
  .bc-acct-section-head {
    display: flex; align-items: center; gap: 14px;
    padding-bottom: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 28px;
  }
  .bc-acct-section-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(200,169,110,0.08);
    border: 1px solid rgba(200,169,110,0.18);
    color: #c8a96e;
  }
  .bc-acct-section-icon--danger {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.2);
    color: #f87171;
  }
  .bc-acct-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 400; color: #f5f0e8;
  }
  .bc-acct-section-sub { font-size: 12px; color: rgba(200,195,185,0.38); margin-top: 3px; }

  /* Form fields */
  .bc-acct-form { display: flex; flex-direction: column; gap: 20px; }
  .bc-acct-grid-2 { display: grid; grid-template-columns: 1fr; gap: 20px; }
  @media (min-width: 640px) { .bc-acct-grid-2 { grid-template-columns: 1fr 1fr; } }

  .bc-acct-field { display: flex; flex-direction: column; gap: 8px; }
  .bc-acct-label {
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(200,195,185,0.4);
  }
  .bc-acct-input-wrap { position: relative; }
  .bc-acct-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-acct-input-wrap:focus-within .bc-acct-input-icon { color: #c8a96e; }
  .bc-acct-textarea-icon {
    position: absolute; top: 14px; left: 14px;
    color: rgba(200,169,110,0.4); pointer-events: none; z-index: 2;
    transition: color 0.2s;
  }
  .bc-acct-input-wrap:focus-within .bc-acct-textarea-icon { color: #c8a96e; }

  .bc-acct-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-acct-input::placeholder { color: rgba(200,195,185,0.2); }
  .bc-acct-input:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }
  .bc-acct-input:disabled {
    opacity: 0.4; cursor: not-allowed;
    background: rgba(255,255,255,0.02);
  }
  .bc-acct-input--pr { padding-right: 42px; }
  .bc-acct-input--no-icon { padding-left: 14px; }
  .bc-acct-input--danger:focus {
    border-color: rgba(239,68,68,0.45);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.07);
  }

  .bc-acct-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 11px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #f0ebe0;
    outline: none; resize: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .bc-acct-textarea::placeholder { color: rgba(200,195,185,0.2); }
  .bc-acct-textarea:focus {
    border-color: rgba(200,169,110,0.5);
    background: rgba(200,169,110,0.04);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.07);
  }

  .bc-acct-eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 3px;
    color: rgba(200,195,185,0.35); z-index: 2; transition: color 0.2s;
  }
  .bc-acct-eye-btn:hover { color: #c8a96e; }

  /* Buttons */
  .bc-acct-form-footer { display: flex; justify-content: flex-end; padding-top: 8px; }

  .bc-acct-save-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #0a0a0f; border: none; border-radius: 11px; cursor: pointer;
    background: linear-gradient(135deg, #c8a96e, #a07840);
    box-shadow: 0 6px 20px rgba(200,169,110,0.25);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .bc-acct-save-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .bc-acct-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(200,169,110,0.35); }
  .bc-acct-save-btn:hover:not(:disabled)::before { opacity: 1; }
  .bc-acct-save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .bc-acct-danger-btn {
    width: 100%;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #fff; border: none; border-radius: 11px; cursor: pointer;
    background: linear-gradient(135deg, #ef4444, #b91c1c);
    box-shadow: 0 6px 20px rgba(239,68,68,0.2);
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .bc-acct-danger-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(239,68,68,0.3); }
  .bc-acct-danger-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Profile pic tab */
  .bc-acct-pic-zone {
    border: 1px dashed rgba(200,169,110,0.18);
    border-radius: 16px;
    padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center;
    background: rgba(200,169,110,0.02);
  }
  .bc-acct-pic-avatar {
    width: 160px; height: 160px; border-radius: 50%;
    background: linear-gradient(135deg, #c8a96e, #7c5c2a);
    padding: 3px; margin-bottom: 28px;
  }
  .bc-acct-pic-avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: #13121a;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; color: rgba(200,169,110,0.25);
  }
  .bc-acct-pic-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }

  .bc-acct-pic-actions { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px; }

  .bc-acct-file-label {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px 16px;
    font-size: 12px; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(220,215,205,0.55);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .bc-acct-file-label:hover {
    color: #e8d5a3; border-color: rgba(200,169,110,0.35); background: rgba(200,169,110,0.06);
  }
  .bc-acct-pic-hint { font-size: 11px; color: rgba(200,195,185,0.25); letter-spacing: 0.06em; margin-top: 4px; text-align: center; }

  /* Delete warning box */
  .bc-acct-danger-box {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 14px; padding: 22px;
    margin-bottom: 24px;
  }
  .bc-acct-danger-box-title {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: #f87171;
    margin-bottom: 8px;
  }
  .bc-acct-danger-box-text { font-size: 13px; color: rgba(248,113,113,0.65); line-height: 1.7; }

  .bc-acct-delete-form {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px; padding: 22px;
    max-width: 420px;
    display: flex; flex-direction: column; gap: 18px;
  }
`;

const TabWrapper = ({ children }) => <div>{children}</div>;

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState("profile");
  const [loading, setLoading]       = useState(false);
  const [message, setMessage]       = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "", address: "", bio: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [deleteData, setDeleteData] = useState({ password: "", confirmText: "" });

  const [showCurrentPassword, setShowCurrentPassword]   = useState(false);
  const [showNewPassword, setShowNewPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword]   = useState(false);
  const [showDeletePassword, setShowDeletePassword]     = useState(false);

  const [profilePic, setProfilePic]             = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || "", email: user.email || "", phone: user.phone || "", address: user.address || "", bio: user.bio || "" });
      setProfilePicPreview(user.profilePic);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: "", text: "" });
    try {
      const response = await api.put("/auth/profile", profileData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setMessage({ type: "", text: "" });
    if (passwordData.newPassword !== passwordData.confirmPassword) { setMessage({ type: "error", text: "New passwords do not match" }); return; }
    if (passwordData.newPassword.length < 6) { setMessage({ type: "error", text: "Password must be at least 6 characters" }); return; }
    setLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
    } finally { setLoading(false); }
  };

  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePic) { setMessage({ type: "error", text: "Please select an image first" }); return; }
    setLoading(true); setMessage({ type: "", text: "" });
    const formData = new FormData();
    formData.append("profilePic", profilePic);
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${baseURL}/auth/profile-pic`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: "success", text: "Profile picture updated!" });
      setProfilePicPreview(response.data.profilePic);
      setProfilePic(null);
      const updatedUser = { ...user, profilePic: response.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to upload profile picture" });
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteData.confirmText !== "DELETE") { setMessage({ type: "error", text: 'Please type DELETE to confirm' }); return; }
    setLoading(true);
    try {
      await api.delete("/auth/account", { data: { password: deleteData.password } });
      setMessage({ type: "success", text: "Account deleted. Goodbye!" });
      setTimeout(() => { logout(); navigate("/"); }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to delete account" });
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

  if (!user) return <div className="bc-acct-loading"><div className="bc-acct-spinner" /></div>;

  const tabs = [
    { id: "profile",     icon: <User size={15} />,          label: "Profile Info" },
    { id: "password",    icon: <Lock size={15} />,          label: "Security" },
    { id: "profile-pic", icon: <Camera size={15} />,        label: "Profile Picture" },
    { id: "delete",      icon: <Trash2 size={15} />,        label: "Delete Account", danger: true },
  ];

  const switchTab = (id) => { setActiveTab(id); setMessage({ type: "", text: "" }); };

  return (
    <>
      <style>{styles}</style>
      <div className="bc-acct">
        <div className="bc-acct-inner">

          {/* Header */}
          <div className="bc-acct-header">
            <div className="bc-acct-eyebrow">My Account</div>
            <h1 className="bc-acct-title">Account <em>Settings</em></h1>
            <p className="bc-acct-sub">Manage your personal information and preferences</p>
          </div>

          {/* Global message */}
          {message.text && (
            <div className={`bc-acct-msg bc-acct-msg--${message.type}`}>
              <div className="bc-acct-msg-left">
                {message.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {message.text}
              </div>
              <button className="bc-acct-msg-close" onClick={() => setMessage({ type: "", text: "" })}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="bc-acct-layout">

            {/* ── Sidebar ── */}
            <aside className="bc-acct-sidebar">
              <div className="bc-acct-profile-banner">
                <div className="bc-acct-avatar-ring">
                  <div className="bc-acct-avatar-inner">
                    {profilePicPreview || user.profilePic
                      ? <img src={profilePicPreview || user.profilePic} alt="Profile" />
                      : <span className="bc-acct-avatar-initial">{user.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                </div>
                <div className="bc-acct-sidebar-name">{user.name}</div>
                <div className="bc-acct-sidebar-email">{user.email}</div>
              </div>

              <nav className="bc-acct-nav">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  const cls = tab.danger
                    ? `bc-acct-nav-btn ${isActive ? "bc-acct-nav-btn--danger-active" : "bc-acct-nav-btn--danger"}`
                    : `bc-acct-nav-btn ${isActive ? "bc-acct-nav-btn--active" : ""}`;
                  return (
                    <button key={tab.id} className={cls} onClick={() => switchTab(tab.id)}>
                      {tab.icon} {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* ── Content ── */}
            <div className="bc-acct-content">

              {/* ── Profile tab ── */}
              {activeTab === "profile" && (
                <TabWrapper>
                  <div className="bc-acct-section-head">
                    <div className="bc-acct-section-icon"><User size={18} /></div>
                    <div>
                      <div className="bc-acct-section-title">Personal Information</div>
                      <div className="bc-acct-section-sub">Update your public profile details</div>
                    </div>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="bc-acct-form">
                    <div className="bc-acct-grid-2">
                      <div className="bc-acct-field">
                        <label className="bc-acct-label">Full Name</label>
                        <div className="bc-acct-input-wrap">
                          <div className="bc-acct-input-icon"><User size={14} /></div>
                          <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="bc-acct-input" />
                        </div>
                      </div>
                      <div className="bc-acct-field">
                        <label className="bc-acct-label">Email Address</label>
                        <div className="bc-acct-input-wrap">
                          <div className="bc-acct-input-icon"><Mail size={14} /></div>
                          <input type="email" value={profileData.email} disabled className="bc-acct-input" />
                        </div>
                      </div>
                      <div className="bc-acct-field">
                        <label className="bc-acct-label">Phone Number</label>
                        <div className="bc-acct-input-wrap">
                          <div className="bc-acct-input-icon"><Phone size={14} /></div>
                          <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="bc-acct-input" />
                        </div>
                      </div>
                      <div className="bc-acct-field">
                        <label className="bc-acct-label">Address</label>
                        <div className="bc-acct-input-wrap">
                          <div className="bc-acct-input-icon"><MapPin size={14} /></div>
                          <input type="text" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="bc-acct-input" />
                        </div>
                      </div>
                    </div>
                    <div className="bc-acct-field">
                      <label className="bc-acct-label">Bio</label>
                      <div className="bc-acct-input-wrap">
                        <div className="bc-acct-textarea-icon"><FileText size={14} /></div>
                        <textarea rows={4} value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} placeholder="Tell us a bit about yourself…" className="bc-acct-textarea" />
                      </div>
                    </div>
                    <div className="bc-acct-form-footer">
                      <button type="submit" disabled={loading} className="bc-acct-save-btn">
                        <Save size={13} /> {loading ? "Saving…" : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </TabWrapper>
              )}

              {/* ── Password tab ── */}
              {activeTab === "password" && (
                <TabWrapper>
                  <div className="bc-acct-section-head">
                    <div className="bc-acct-section-icon"><Lock size={18} /></div>
                    <div>
                      <div className="bc-acct-section-title">Change Password</div>
                      <div className="bc-acct-section-sub">Update your security credentials</div>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordChange} className="bc-acct-form" style={{maxWidth:'420px'}}>
                    {[
                      { label:"Current Password", key:"currentPassword", show:showCurrentPassword, toggle:()=>setShowCurrentPassword(p=>!p) },
                      { label:"New Password",     key:"newPassword",     show:showNewPassword,     toggle:()=>setShowNewPassword(p=>!p) },
                      { label:"Confirm New Password", key:"confirmPassword", show:showConfirmPassword, toggle:()=>setShowConfirmPassword(p=>!p) },
                    ].map(f => (
                      <div className="bc-acct-field" key={f.key}>
                        <label className="bc-acct-label">{f.label}</label>
                        <div className="bc-acct-input-wrap">
                          <input
                            type={f.show ? "text" : "password"}
                            required
                            value={passwordData[f.key]}
                            onChange={e => setPasswordData({...passwordData, [f.key]: e.target.value})}
                            className="bc-acct-input bc-acct-input--no-icon bc-acct-input--pr"
                          />
                          <button type="button" className="bc-acct-eye-btn" onClick={f.toggle}>
                            {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="bc-acct-form-footer">
                      <button type="submit" disabled={loading} className="bc-acct-save-btn">
                        {loading ? "Updating…" : "Update Password"}
                      </button>
                    </div>
                  </form>
                </TabWrapper>
              )}

              {/* ── Profile pic tab ── */}
              {activeTab === "profile-pic" && (
                <TabWrapper>
                  <div className="bc-acct-section-head">
                    <div className="bc-acct-section-icon"><Camera size={18} /></div>
                    <div>
                      <div className="bc-acct-section-title">Profile Picture</div>
                      <div className="bc-acct-section-sub">Update your public avatar</div>
                    </div>
                  </div>
                  <div className="bc-acct-pic-zone">
                    <div className="bc-acct-pic-avatar">
                      <div className="bc-acct-pic-avatar-inner">
                        {profilePicPreview
                          ? <img src={profilePicPreview} alt="Preview" />
                          : <User size={52} />
                        }
                      </div>
                    </div>
                    <div className="bc-acct-pic-actions">
                      <label className="bc-acct-file-label">
                        <Upload size={13} /> Choose Image File
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} />
                      </label>
                      <button
                        onClick={handleProfilePicUpload}
                        disabled={loading || !profilePic}
                        className="bc-acct-save-btn"
                        style={{width:'100%', justifyContent:'center'}}
                      >
                        {loading ? "Uploading…" : "Upload New Picture"}
                      </button>
                      <p className="bc-acct-pic-hint">Supported formats: JPG, PNG, JPEG</p>
                    </div>
                  </div>
                </TabWrapper>
              )}

              {/* ── Delete tab ── */}
              {activeTab === "delete" && (
                <TabWrapper>
                  <div className="bc-acct-section-head">
                    <div className="bc-acct-section-icon bc-acct-section-icon--danger"><AlertTriangle size={18} /></div>
                    <div>
                      <div className="bc-acct-section-title">Delete Account</div>
                      <div className="bc-acct-section-sub">Permanently remove your account and data</div>
                    </div>
                  </div>
                  <div className="bc-acct-danger-box">
                    <div className="bc-acct-danger-box-title"><AlertTriangle size={16} /> Warning: This action is irreversible</div>
                    <p className="bc-acct-danger-box-text">
                      Deleting your account will permanently remove all your personal data, active bids, and listed items.
                      This action cannot be undone. Please be certain before proceeding.
                    </p>
                  </div>
                  <form onSubmit={handleDeleteAccount} className="bc-acct-delete-form">
                    <div className="bc-acct-field">
                      <label className="bc-acct-label">Enter Password to Confirm</label>
                      <div className="bc-acct-input-wrap">
                        <input
                          type={showDeletePassword ? "text" : "password"}
                          required
                          value={deleteData.password}
                          onChange={e => setDeleteData({...deleteData, password: e.target.value})}
                          placeholder="Your password"
                          className="bc-acct-input bc-acct-input--no-icon bc-acct-input--pr bc-acct-input--danger"
                        />
                        <button type="button" className="bc-acct-eye-btn" onClick={() => setShowDeletePassword(p => !p)}>
                          {showDeletePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="bc-acct-field">
                      <label className="bc-acct-label">Type "DELETE"</label>
                      <div className="bc-acct-input-wrap">
                        <input
                          type="text"
                          required
                          placeholder="DELETE"
                          value={deleteData.confirmText}
                          onChange={e => setDeleteData({...deleteData, confirmText: e.target.value})}
                          className="bc-acct-input bc-acct-input--no-icon bc-acct-input--danger"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="bc-acct-danger-btn">
                      {loading ? "Deleting…" : <><Trash2 size={14} /> Permanently Delete Account</>}
                    </button>
                  </form>
                </TabWrapper>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;