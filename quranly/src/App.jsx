import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import Onboarding from './components/Onboarding';
import FullScreenPlayer from './components/FullScreenPlayer';
import BadgePopup from './components/BadgePopup';
import { evaluateUserAchievements } from './utils/achievements';

// Lazy load route pages for optimal initial load speed & bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Reciters = lazy(() => import('./pages/Reciters'));
const Hadith = lazy(() => import('./pages/Hadith'));
const Playlists = lazy(() => import('./pages/Playlists'));
const Insights = lazy(() => import('./pages/Insights'));
const Search = lazy(() => import('./pages/Search'));
const Mushaf = lazy(() => import('./pages/Mushaf'));
const Settings = lazy(() => import('./pages/Settings'));
const Radio = lazy(() => import('./pages/Radio'));
const Memorize = lazy(() => import('./pages/Memorize'));
const AskAI = lazy(() => import('./pages/AskAI'));
const Downloads = lazy(() => import('./pages/Downloads'));
const Azkar = lazy(() => import('./pages/Azkar'));

function AppContent() {
  const { isPlayerOpen, listeningHistory, dailyGoalMinutes, favouriteReciterIds, bookmarkedVerses } = usePlayer();
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('quranly_onboarded') === 'true'
  );
  
  // Gamification tracking
  const [previousUnlockedIds, setPreviousUnlockedIds] = useState(null);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    // Real-time achievement evaluation
    const stats = evaluateUserAchievements({
      listeningHistory,
      dailyGoalMinutes,
      favouriteReciterIds,
      bookmarkedVerses,
    });
    
    const unlockedIds = stats.badges.filter(b => b.unlocked).map(b => b.id);
    
    // Only compare if we have a previous state to compare against
    if (previousUnlockedIds !== null) {
      const newlyUnlocked = unlockedIds.filter(id => !previousUnlockedIds.includes(id));
      if (newlyUnlocked.length > 0) {
        // Find the full badge object for the first newly unlocked badge to show in the popup
        const newlyUnlockedBadge = stats.badges.find(b => b.id === newlyUnlocked[0]);
        setNewBadge(newlyUnlockedBadge);
      }
    }
    
    setPreviousUnlockedIds(unlockedIds);
  }, [listeningHistory, dailyGoalMinutes, favouriteReciterIds, bookmarkedVerses]);

  useEffect(() => {
    const initStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (e) {
        // Ignored on web
      }
    };
    initStatusBar();
  }, []);

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return (
    <div className="app-container">
      <main className="page-content">
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
            <span>Loading Quranly...</span>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reciters" element={<Reciters />} />
            <Route path="/hadith" element={<Hadith />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/search" element={<Search />} />
            <Route path="/mushaf" element={<Mushaf />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/memorize" element={<Memorize />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/azkar" element={<Azkar />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global persistent components */}
      <MiniPlayer />
      <BottomNav />
      <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />

      {/* Overlay Full Screen Player */}
      {isPlayerOpen && <FullScreenPlayer />}
    </div>
  );
}

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/quranly')) {
    return '/quranly';
  }
  return '';
};

function App() {
  return (
    <Router basename={getBasename()}>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </Router>
  );
}

export default App;


