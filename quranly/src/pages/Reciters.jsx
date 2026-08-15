import { useState } from 'react';
import { Search, ChevronRight, Loader, WifiOff } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import GlassCard from '../components/GlassCard';
import ReciterAvatar from '../components/ReciterAvatar';
import ReciterProfile from '../components/ReciterProfile';
import ErrorBoundary from '../components/ErrorBoundary';
import './Reciters.css';

const Reciters = () => {
  const {
    reciters, apiLoading, apiError,
    activeProfileReciter, openReciterProfile,
  } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [localProfileReciter, setLocalProfileReciter] = useState(null);

  const displayReciter = activeProfileReciter || localProfileReciter;

  const safeReciters = Array.isArray(reciters) ? reciters : [];

  // Filter by search
  const allFiltered = searchQuery
    ? safeReciters.filter(r =>
        r?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r?.country && r.country.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  // Open Spotify-style Reciter Profile
  const handleReciterClick = (reciter) => {
    if (reciter) openReciterProfile(reciter);
  };

  // Group by letter
  const topReciters = safeReciters.slice(0, 5);
  const byLetter = safeReciters.reduce((acc, r) => {
    if (!r) return acc;
    const key = (r.letter || r.name?.[0] || '#').toUpperCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const sortedLetters = Object.keys(byLetter).sort();

  const renderReciterCircle = (reciter) => {
    return (
      <div
        className="reciter-circle"
        key={reciter.id}
        onClick={() => handleReciterClick(reciter)}
        style={{ cursor: 'pointer' }}
      >
        <div className="circle-img-wrap">
          <ReciterAvatar name={reciter.name} src={reciter.avatar} alt={reciter.name} />
          {reciter.moshaf?.length > 1 && (
            <span className="moshaf-badge">{reciter.moshaf.length}</span>
          )}
        </div>
        <p className="reciter-name">{reciter.name}</p>
      </div>
    );
  };

  // If a reciter profile is open, show Spotify-style ReciterProfile
  if (displayReciter) {
    return (
      <ErrorBoundary>
        <ReciterProfile
          reciter={displayReciter}
          onBack={() => {
            openReciterProfile(null);
            setLocalProfileReciter(null);
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="reciters-page">
      <div className="search-bar glass-panel">
        <Search size={20} color="#9ca3af" />
        <input
          type="text"
          placeholder="Search reciters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1>Reciters</h1>

      {apiLoading && (
        <div className="api-loading-center">
          <Loader size={32} className="spin" />
          <p>Loading reciters from MP3Quran…</p>
        </div>
      )}

      {apiError && !apiLoading && (
        <GlassCard className="api-error-card">
          <WifiOff size={24} color="#f87171" />
          <div>
            <p className="api-error-title">Could not load live data</p>
            <p className="api-error-sub">Showing offline reciters.</p>
          </div>
        </GlassCard>
      )}

      {!apiLoading && allFiltered ? (
        <div className="search-results">
          {allFiltered.length === 0 && (
            <p className="no-results">No reciters found for "{searchQuery}"</p>
          )}
          <div className="horizontal-scroll" style={{ flexWrap: 'wrap', gap: '16px' }}>
            {allFiltered.map(renderReciterCircle)}
          </div>
        </div>
      ) : !apiLoading ? (
        <>
          <GlassCard className="top-reciters-card">
            <div className="overlapping-avatars">
              {topReciters.slice(0, 3).map((r, i) => (
                <div key={r.id || i} className={`top-avatar-wrap av${i + 1}`}>
                  <ReciterAvatar name={r.name} src={r.avatar} alt={r.name} />
                </div>
              ))}
            </div>
            <div className="top-reciters-info">
              <div>
                <h3>Top Reciters</h3>
                <p>{safeReciters.length} available</p>
              </div>
              <ChevronRight size={22} color="var(--text-primary)" />
            </div>
          </GlassCard>

          {sortedLetters.map((letter) => (
            <div key={letter}>
              <div className="section-header">
                <h2 className="section-title">{letter}</h2>
              </div>
              <div className="horizontal-scroll">
                {byLetter[letter].map(renderReciterCircle)}
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default Reciters;


