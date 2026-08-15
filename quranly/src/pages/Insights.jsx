import { useMemo, useState, useEffect } from 'react';
import {
  Info, Play, X, Check, ChevronUp, ChevronDown, Flame, Calendar, Award, Pencil,
  Trophy, Sparkles, Zap, Crown, Clock, Headphones, Users, Bookmark, Target,
  Lock, CheckCircle2, Globe, Shield, RefreshCw, Heart, Tag, Trash2, Search as SearchIcon
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { evaluateUserAchievements } from '../utils/achievements';
import { getLeaderboardFromFirestore } from '../services/firebase';
import GlassCard from '../components/GlassCard';
import './Insights.css';

// Map icon strings to Lucide components
const ICON_MAP = {
  Sparkles, Flame, Zap, Crown, Clock, Headphones, Users, Bookmark, Target, Trophy, Medal: Award
};

const Insights = () => {
  const {
    listeningHistory, dailyGoalMinutes, isPlaying,
    openPlayer, togglePlay, setDailyGoal, favouriteReciterIds,
    bookmarkedVerses, currentUser, isPro,
    verseReflections = [], deleteReflection
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'badges' | 'leaderboard' | 'journal'
  const [showMore, setShowMore] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(dailyGoalMinutes));
  
  // Journal Filter State
  const [journalTagFilter, setJournalTagFilter] = useState('ALL');
  const [journalSearch, setJournalSearch] = useState('');
  
  // Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaySeconds = listeningHistory[today] || 0;
  const todayMinutes = todaySeconds / 60;
  const goalSeconds = dailyGoalMinutes * 60;
  const progressPercent = Math.min(100, (todaySeconds / goalSeconds) * 100);
  const todayFormatted = `${Math.floor(todayMinutes)}:${String(Math.floor(todaySeconds % 60)).padStart(2, '0')}`;

  // Evaluate user badges & achievements live
  const achievementStats = useMemo(() => {
    return evaluateUserAchievements({
      listeningHistory,
      dailyGoalMinutes,
      favouriteReciterIds,
      bookmarkedVerses,
    });
  }, [listeningHistory, dailyGoalMinutes, favouriteReciterIds, bookmarkedVerses]);

  const { streak, weekTotal, record, days } = useMemo(() => {
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    let weekTotal = 0;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const listened = listeningHistory[dateStr] || 0;
      const isToday = dateStr === today;
      const isPast = d < now && !isToday;

      let status = 'future';
      if (isToday) status = listened >= goalSeconds ? 'completed' : 'active';
      else if (isPast) status = listened >= goalSeconds ? 'completed' : 'missed';

      weekTotal += listened;
      days.push({ name: dayNames[d.getDay()], status, listened, dateStr });
    }

    const calculatedStreak = achievementStats.streak;
    return { streak: calculatedStreak, weekTotal: Math.round(weekTotal / 60), record: calculatedStreak, days };
  }, [listeningHistory, dailyGoalMinutes, today, goalSeconds, achievementStats.streak]);

  // Fetch Community Leaderboard
  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    const users = await getLeaderboardFromFirestore(20);
    
    // Ensure current user is in the list with live calculated data
    if (currentUser) {
      const myDisplayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'You';
      const myEntry = {
        uid: currentUser.uid,
        displayName: `${myDisplayName} (You)`,
        totalMinutes: achievementStats.totalMinutes,
        streak: achievementStats.streak,
        totalXP: achievementStats.totalXP,
        levelTitle: achievementStats.levelTitle,
        isPro: isPro,
        isMe: true,
      };

      const existingIndex = users.findIndex(u => u.uid === currentUser.uid);
      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...myEntry };
      } else {
        users.push(myEntry);
      }
      users.sort((a, b) => b.totalXP - a.totalXP || b.streak - a.streak);
    }
    
    setLeaderboardData(users);
    setLoadingLeaderboard(false);
  };

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab, currentUser, achievementStats.totalXP]);

  // Arc strokeDasharray math (r=80 semi-circle arc length = π * 80 = 251.327)
  const ARC_LENGTH = 251.327;
  const dashOffset = ARC_LENGTH * (1 - Math.min(100, Math.max(0, progressPercent)) / 100);

  // Build last 14 days for bar chart
  const last14 = useMemo(() => {
    const result = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const sec = listeningHistory[dateStr] || 0;
      result.push({ dateStr, minutes: Math.round(sec / 60), label: d.toLocaleDateString('en', { weekday: 'short' }) });
    }
    return result;
  }, [listeningHistory]);

  const maxMin = Math.max(...last14.map(d => d.minutes), dailyGoalMinutes);

  const handleGoalSave = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) setDailyGoal(val);
    setEditingGoal(false);
  };

  return (
    <div className="insights-page">
      <div className="section-header">
        <h1 className="insights-title">
          Insights & Badges
        </h1>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="insights-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Flame size={15} /> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          <Heart size={15} color="#ec4899" /> Spiritual Journal ({verseReflections.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          <Trophy size={15} /> Badges ({achievementStats.unlockedCount}/{achievementStats.totalBadgesCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Globe size={15} /> Leaderboard
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <>
          <GlassCard className="insights-card">
            <div className="stats-row">
              <div className="stat-box">
                <span className="stat-icon flame"><Flame size={18} color="#f97316" /></span>
                <p>Streak</p>
                <h3>{streak} days</h3>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-icon calendar"><Calendar size={18} color="var(--text-primary)" /></span>
                <p>This week</p>
                <h3>{weekTotal} min</h3>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-icon medal"><Award size={18} color="#fbbf24" /></span>
                <p>XP Level</p>
                <h3>Lvl {achievementStats.levelNumber}</h3>
              </div>
            </div>

            <div className="progress-section">
              <svg className="progress-arc" viewBox="0 0 200 120">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="var(--accent-color, #6366f1)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={ARC_LENGTH}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <div className="progress-info">
                <p>Today's listening</p>
                <h2>{todayFormatted}</h2>
                {editingGoal ? (
                  <div className="goal-edit-row">
                    <input
                      className="goal-input"
                      type="number"
                      min="1" max="180"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGoalSave()}
                      autoFocus
                    />
                    <span>min</span>
                    <button className="goal-save-btn" onClick={handleGoalSave}><Check size={14} /></button>
                  </div>
                ) : (
                  <p className="goal-text" onClick={() => { setEditingGoal(true); setGoalInput(String(dailyGoalMinutes)); }}>
                    of your {dailyGoalMinutes}-min goal <span className="goal-edit-hint"><Pencil size={12} /></span>
                  </p>
                )}
              </div>
            </div>

            <div className="week-tracker">
              {days.map((day, idx) => (
                <div className={`day-circle ${day.status}`} key={idx}>
                  <div className="circle-inner">
                    {day.status === 'missed' && <X size={12} color="#fff" />}
                    {day.status === 'completed' && <Check size={12} color="#fff" />}
                  </div>
                  <span>{day.name}</span>
                </div>
              ))}
            </div>

            <button className="continue-listening-btn" onClick={() => { if (!isPlaying) togglePlay(); openPlayer(); }}>
              <Play size={16} fill="currentColor" />
              <span>Continue listening</span>
            </button>
          </GlassCard>

          {/* Toggle 14-day detailed history */}
          <div className="more-toggle-row">
            <button className="see-all" onClick={() => setShowMore(v => !v)}>
              {showMore ? <><ChevronUp size={14} /> Hide 14-day history</> : <><ChevronDown size={14} /> Show 14-day history</>}
            </button>
          </div>

          {showMore && (
            <GlassCard className="bar-chart-card">
              <h3 className="bar-chart-title">Last 14 days</h3>
              <div className="bar-chart">
                {last14.map((d, i) => {
                  const pct = maxMin > 0 ? (d.minutes / maxMin) * 100 : 0;
                  const isGoalMet = d.minutes >= dailyGoalMinutes;
                  return (
                    <div className="bar-col" key={i}>
                      <span className="bar-minutes">{d.minutes > 0 ? `${d.minutes}m` : ''}</span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${isGoalMet ? 'goal-met' : ''}`}
                          style={{ height: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                      <span className="bar-label">{d.label.slice(0, 2)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="bar-chart-legend">
                <span className="legend-dot goal-met-dot"></span> Goal met
                <span className="legend-dot" style={{ marginLeft: 12 }}></span> Below goal
              </p>
            </GlassCard>
          )}
        </>
      )}

      {/* ── TAB 2: BADGES & ACHIEVEMENTS ────────────────────── */}
      {activeTab === 'badges' && (
        <div className="badges-section">
          {/* User Level Header Card */}
          <GlassCard className="user-level-card">
            <div className="level-header">
              <div className="level-badge">
                <Shield size={24} color="#818cf8" />
                <span>Level {achievementStats.levelNumber}</span>
              </div>
              <div className="xp-tag">
                <Sparkles size={14} color="#fbbf24" />
                <span>{achievementStats.totalXP} Total XP</span>
              </div>
            </div>

            <h2 className="level-title">{achievementStats.levelTitle}</h2>
            <p className="level-sub">
              Unlocked {achievementStats.unlockedCount} of {achievementStats.totalBadgesCount} achievements
            </p>

            <div className="xp-bar-container">
              <div className="xp-bar-track">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${Math.min(100, (achievementStats.totalXP / achievementStats.nextLevelXP) * 100)}%` }}
                />
              </div>
              <div className="xp-bar-labels">
                <span>{achievementStats.totalXP} XP</span>
                <span>Next Lvl: {achievementStats.nextLevelXP} XP</span>
              </div>
            </div>
          </GlassCard>

          {/* Badges Grid */}
          <h3 className="badges-grid-title">Earnable Badges</h3>
          <div className="badges-grid">
            {achievementStats.badges.map((badge) => {
              const IconComp = ICON_MAP[badge.icon] || Sparkles;
              return (
                <GlassCard
                  key={badge.id}
                  className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div
                    className="badge-icon-wrapper"
                    style={{
                      background: badge.unlocked
                        ? `radial-gradient(circle, ${badge.color}40 0%, ${badge.color}10 100%)`
                        : 'rgba(255, 255, 255, 0.05)',
                      borderColor: badge.unlocked ? badge.color : 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <IconComp
                      size={24}
                      color={badge.unlocked ? badge.color : '#6b7280'}
                    />
                    {!badge.unlocked && <Lock size={12} className="lock-badge" />}
                    {badge.unlocked && <CheckCircle2 size={14} className="check-badge" color="#10b981" />}
                  </div>

                  <div className="badge-details">
                    <h4>{badge.title}</h4>
                    <p>{badge.description}</p>
                    
                    {!badge.unlocked && (
                      <div className="badge-progress-bar">
                        <div
                          className="badge-progress-fill"
                          style={{ width: `${badge.progress}%`, background: badge.color }}
                        />
                      </div>
                    )}

                    <div className="badge-footer">
                      <span className="badge-category">{badge.category}</span>
                      <span className="badge-xp">+{badge.xp} XP</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: COMMUNITY LEADERBOARD ─────────────────────── */}
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
          <GlassCard className="leaderboard-header-card">
            <div className="lb-header-text">
              <Globe size={22} color="#818cf8" />
              <div>
                <h2>Global Quran Community</h2>
                <p>Top reciters ranked by weekly consistency and XP</p>
              </div>
            </div>
            <button className="refresh-lb-btn" onClick={fetchLeaderboard} disabled={loadingLeaderboard}>
              <RefreshCw size={14} className={loadingLeaderboard ? 'spinning' : ''} />
            </button>
          </GlassCard>

          <div className="leaderboard-list">
            {leaderboardData.length === 0 ? (
              <GlassCard className="empty-lb-card">
                <p>Loading community rankings...</p>
              </GlassCard>
            ) : (
              leaderboardData.map((user, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <div
                    key={user.uid || index}
                    className={`lb-row ${user.isMe ? 'is-me' : ''} ${isTop3 ? `rank-${rank}` : ''}`}
                  >
                    <div className="lb-rank">
                      {rank === 1 && <Crown size={18} color="#fbbf24" />}
                      {rank === 2 && <Award size={18} color="#94a3b8" />}
                      {rank === 3 && <Award size={18} color="#b45309" />}
                      {rank > 3 && <span>#{rank}</span>}
                    </div>

                    <div className="lb-user-info">
                      <div className="lb-name-row">
                        <span className="lb-name">{user.displayName}</span>
                        {user.isPro && <span className="lb-pro-tag">PRO</span>}
                      </div>
                      <span className="lb-subtext">{user.levelTitle} • {user.streak}d streak • {user.completedAzkarCount || 0} Azkar</span>
                    </div>

                    <div className="lb-xp">
                      <Zap size={13} color="#fbbf24" />
                      <span>{user.totalXP} XP</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: SPIRITUAL JOURNAL ─────────────────────────── */}
      {activeTab === 'journal' && (
        <div className="journal-tab-content">
          <GlassCard className="journal-header-card">
            <div className="journal-header-text">
              <Heart size={22} color="#ec4899" />
              <div>
                <h2>Spiritual Journal & Verse Reflections</h2>
                <p>All your personal notes, insights, and spiritual reflections attached to Quranic verses</p>
              </div>
            </div>
          </GlassCard>

          {/* Search bar */}
          <div className="journal-controls-row">
            <div className="journal-search-input glass-panel">
              <SearchIcon size={16} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search reflections, surahs or verses..."
                value={journalSearch}
                onChange={e => setJournalSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Reflections List */}
          <div className="journal-reflections-list">
            {verseReflections.length === 0 ? (
              <GlassCard className="empty-journal-card">
                <Heart size={32} color="#ec4899" style={{ opacity: 0.6 }} />
                <h3>No Verse Reflections Yet</h3>
                <p>When reading in the Mushaf, tap any verse and select <strong>Reflect & Note</strong> to record your spiritual notes here.</p>
              </GlassCard>
            ) : (
              verseReflections
                .filter(r => {
                  const matchSearch = !journalSearch.trim() || 
                    r.noteText?.toLowerCase().includes(journalSearch.toLowerCase()) ||
                    r.verseText?.includes(journalSearch) ||
                    r.surahName?.toLowerCase().includes(journalSearch.toLowerCase());
                  return matchSearch;
                })
                .map(item => (
                  <GlassCard key={item.id || item.key} className="reflection-item-card">
                    <div className="reflection-card-header">
                      <span className="reflection-verse-badge">{item.surahName || `Surah ${item.surahId}`} {item.surahId}:{item.verseNumber}</span>
                      <button className="reflection-del-btn" onClick={() => deleteReflection(item.id)} title="Delete Note">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="reflection-arabic-text arabic-font">{item.verseText}</div>
                    
                    <div className="reflection-user-note">
                      "{item.noteText}"
                    </div>

                    <div className="reflection-tags-row">
                      {item.tags?.map(t => (
                        <span key={t} className="reflection-tag-chip">
                          <Tag size={10} /> {t}
                        </span>
                      ))}
                      <span className="reflection-date">{new Date(item.updatedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </GlassCard>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;


