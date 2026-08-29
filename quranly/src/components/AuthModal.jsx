import { useState } from 'react';
import {
  X, Mail, Lock, User, LogOut, Loader, AlertCircle, CloudCheck,
  Crown, ArrowRight, Edit2, Check, Sparkles
} from 'lucide-react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOutUser,
  updateUserProfileName,
  saveUserDataToFirestore
} from '../services/firebase';
import { useUserData, usePlayerActions } from '../context/PlayerContext';
import './AuthModal.css';

// Custom Google 'G' icon for authentic branding
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const AuthModal = ({ isOpen, onClose }) => {
  const {
    currentUser, isPro,
    favouriteSurahIds, favouriteReciterIds, bookmarkedVerses,
    listeningHistory = {}, dailyGoalMinutes = 10
  } = useUserData();
  const { openSubscriptionModal } = usePlayerActions();

  const [mode, setMode] = useState('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inline name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [syncingStatus, setSyncingStatus] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setError(err.message || 'Could not sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!displayName) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      console.error('Email Auth Error:', err);
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOutUser();
      onClose();
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const handleSaveName = async () => {
    if (!editNameText.trim()) return;
    setIsSavingName(true);
    try {
      await updateUserProfileName(editNameText.trim());
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleManualSync = async () => {
    if (!currentUser?.uid) return;
    setSyncingStatus(true);
    try {
      await saveUserDataToFirestore(currentUser.uid, {
        isPro,
        favouriteSurahIds: [...favouriteSurahIds],
        favouriteReciterIds: [...favouriteReciterIds],
        bookmarkedVerses,
        listeningHistory,
        dailyGoalMinutes,
        email: currentUser.email,
        displayName: currentUser.displayName || '',
      });
      setTimeout(() => setSyncingStatus(false), 800);
    } catch (err) {
      setSyncingStatus(false);
    }
  };

  const getUserInitials = (name, email) => {
    if (name) return name.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return 'Q';
  };

  // Real statistics formatting
  const today = new Date().toISOString().split('T')[0];
  const rawTodayTime = listeningHistory[today] || 0;
  const formattedListening = rawTodayTime >= 60
    ? `${Math.floor(rawTodayTime / 60)}h ${rawTodayTime % 60}m`
    : `${rawTodayTime}m`;

  const totalFavoritesCount = (favouriteSurahIds?.size || 0) + (favouriteReciterIds?.size || 0);
  const totalBookmarksCount = bookmarkedVerses?.length || 0;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal spotify-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="Close">
          <X size={18} color="#fff" />
        </button>

        {currentUser ? (
          /* ── Spotify-Grade User Profile View ── */
          <div className="spotify-profile-content">
            {/* Spotify-style Header Banner */}
            <div className="spotify-profile-header">
              <div className="spotify-avatar-container">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName} className="spotify-avatar-img" width={48} height={48} loading="lazy" decoding="async" />
                ) : (
                  <div className="spotify-avatar-initials">
                    {getUserInitials(currentUser.displayName, currentUser.email)}
                  </div>
                )}
                {isPro && (
                  <div className="spotify-pro-badge" title="Quranly Pro Member">
                    <Crown size={12} color="#000" />
                  </div>
                )}
              </div>

              <div className="spotify-user-meta">
                <span className="spotify-account-tag">
                  {isPro ? 'QURANLY PRO' : 'FREE ACCOUNT'}
                </span>

                {isEditingName ? (
                  <div className="spotify-name-edit-form">
                    <input
                      type="text"
                      value={editNameText}
                      onChange={(e) => setEditNameText(e.target.value)}
                      placeholder="Display Name"
                      autoFocus
                    />
                    <button className="spotify-save-name-btn" onClick={handleSaveName} disabled={isSavingName}>
                      {isSavingName ? <Loader size={14} className="spin" /> : <Check size={14} color="#fff" />}
                    </button>
                  </div>
                ) : (
                  <div className="spotify-name-row">
                    <h2 className="spotify-display-name">{currentUser.displayName || 'Quranly Member'}</h2>
                    <button
                      className="spotify-edit-btn"
                      onClick={() => { setEditNameText(currentUser.displayName || ''); setIsEditingName(true); }}
                      title="Edit Name"
                    >
                      <Edit2 size={14} color="#94a3b8" />
                    </button>
                  </div>
                )}

                <p className="spotify-email">{currentUser.email}</p>
              </div>
            </div>

            {/* Spotify-style Horizontal Stats Summary Bar */}
            <div className="spotify-stats-bar">
              <div className="spotify-stat-item">
                <span className="stat-num">{totalFavoritesCount}</span>
                <span className="stat-text">Favorites</span>
              </div>
              <span className="stat-dot">•</span>
              <div className="spotify-stat-item">
                <span className="stat-num">{totalBookmarksCount}</span>
                <span className="stat-text">Bookmarks</span>
              </div>
              <span className="stat-dot">•</span>
              <div className="spotify-stat-item">
                <span className="stat-num">{formattedListening}</span>
                <span className="stat-text">Listen Today</span>
              </div>
              <span className="stat-dot">•</span>
              <div className="spotify-stat-item">
                <span className="stat-num">{dailyGoalMinutes}m</span>
                <span className="stat-text">Daily Goal</span>
              </div>
            </div>

            {/* Spotify-style Menu Options List */}
            <div className="spotify-menu-list">
              <div className="spotify-menu-row" onClick={handleManualSync} style={{ cursor: 'pointer' }}>
                <div className="menu-left">
                  <CloudCheck size={18} color="#6366f1" />
                  <div className="menu-labels">
                    <span className="menu-title">Firebase Cloud Sync</span>
                    <span className="menu-sub">Favorites &amp; history backed up in cloud</span>
                  </div>
                </div>
                <span className="menu-badge-status">
                  {syncingStatus ? 'Syncing...' : 'Synced'}
                </span>
              </div>

              <div
                className="spotify-menu-row"
                onClick={() => { onClose(); openSubscriptionModal(); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="menu-left">
                  <Crown size={18} color={isPro ? '#fbbf24' : '#6366f1'} />
                  <div className="menu-labels">
                    <span className="menu-title">Subscription Tier</span>
                    <span className="menu-sub">{isPro ? 'Pro Active (All features unlocked)' : 'Upgrade for offline audio & premium Hadith'}</span>
                  </div>
                </div>
                <span className={`menu-tier-pill ${isPro ? 'pro-pill' : ''}`}>
                  {isPro ? 'Pro Member' : 'Upgrade'}
                </span>
              </div>
            </div>

            {/* Spotify-style Full Width Actions */}
            <div className="spotify-actions-area">
              {!isPro && (
                <button
                  className="spotify-primary-btn"
                  onClick={() => { onClose(); openSubscriptionModal(); }}
                >
                  <Sparkles size={16} />
                  <span>Get Quranly Pro</span>
                </button>
              )}

              <button className="spotify-signout-btn" onClick={handleSignOut}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── Sign In / Sign Up View ── */
          <>
            <div className="auth-header">
              <img src="/logo.png" alt="Quranly Logo" className="auth-brand-logo" width={44} height={44} loading="lazy" decoding="async" />
              <h2 className="auth-title">Welcome to Quranly</h2>
              <p className="auth-subtitle">Sync your favorites, playlists &amp; subscription across devices</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => { setMode('signin'); setError(null); }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { setMode('signup'); setError(null); }}
              >
                Sign Up
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Google Login Button */}
            <button className="google-auth-btn" onClick={handleGoogleLogin} disabled={loading}>
              <GoogleLogo size={20} />
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider">
              <span>OR WITH EMAIL</span>
            </div>

            {/* Email Form */}
            <form className="auth-form" onSubmit={handleEmailAuth}>
              {mode === 'signup' && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-field-wrap">
                    <User size={16} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-field-wrap">
                  <Mail size={16} color="#94a3b8" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-field-wrap">
                  <Lock size={16} color="#94a3b8" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <Loader size={18} className="spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;


