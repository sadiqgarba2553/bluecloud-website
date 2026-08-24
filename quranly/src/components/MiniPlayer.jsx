import { memo } from 'react';
import { Play, Pause, FastForward } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import './MiniPlayer.css';

const MiniPlayer = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack, isPlaying, togglePlay, playNext, openPlayer, openReciterProfile } = usePlayer();

  if (!currentTrack || location.pathname === '/mushaf') return null;
  const { surah, reciter } = currentTrack;

  const handleQariClick = (e) => {
    e.stopPropagation();
    if (reciter) {
      openReciterProfile(reciter);
      navigate('/reciters');
    }
  };

  return (
    <div className="mini-player glass-panel" onClick={openPlayer} style={{ cursor: 'pointer' }}>
      <div className="player-info">
        <div className="player-avatar" onClick={handleQariClick} title={`View ${reciter.name} profile`}>
          <img src={reciter.avatar} alt={reciter.name} />
        </div>
        <div className="player-text">
          <h4 className="track-title">{surah.id}. {surah.nameEnglish} ({surah.nameArabic})</h4>
          <p className="track-artist" onClick={handleQariClick} title={`View ${reciter.name} profile`}>
            {reciter.name}
          </p>
        </div>
      </div>
      <div className="player-controls">
        <button
          className="control-btn"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        >
          {isPlaying
            ? <Pause size={20} fill="currentColor" strokeWidth={0} />
            : <Play size={20} fill="currentColor" strokeWidth={0} />
          }
        </button>
        <button
          className="control-btn"
          aria-label="Next"
          onClick={(e) => { e.stopPropagation(); playNext(); }}
        >
          <FastForward size={24} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </div>
  );
});

MiniPlayer.displayName = 'MiniPlayer';

export default MiniPlayer;
