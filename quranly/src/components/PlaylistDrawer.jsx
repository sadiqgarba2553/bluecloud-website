import { useState } from 'react';
import { Search, Shuffle, Repeat, Repeat1, Menu } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import './PlaylistDrawer.css';

const PlaylistDrawer = () => {
  const {
    queue, queueIndex, currentTrack, repeatMode, shuffleOn,
    setTrack, shuffleQueue, toggleRepeat, togglePlaylistDrawer,
  } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueue = queue.filter(s =>
    s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nameArabic.includes(searchQuery) ||
    s.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="drawer-overlay" onClick={togglePlaylistDrawer}>
      <div className="playlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Continue Playing</h3>
          <div className="drawer-actions">
            <button
              className={`icon-btn dark ${shuffleOn ? 'btn-active' : ''}`}
              onClick={shuffleQueue}
            >
              <Shuffle size={18} color={shuffleOn ? '#a78bfa' : '#9ca3af'} />
            </button>
            <button
              className={`icon-btn dark ${repeatMode !== 'off' ? 'btn-active' : ''}`}
              onClick={toggleRepeat}
            >
              {repeatMode === 'one'
                ? <Repeat1 size={18} color="#a78bfa" />
                : <Repeat size={18} color={repeatMode === 'all' ? '#a78bfa' : '#9ca3af'} />
              }
            </button>
          </div>
        </div>

        <div className="search-bar drawer-search">
          <Search size={20} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="queue-list">
          {filteredQueue.map((surah) => {
            const isCurrentTrack = currentTrack.surah.id === surah.id;
            const originalIndex = queue.findIndex(s => s.id === surah.id);
            return (
              <div
                className={`queue-item ${isCurrentTrack ? 'current' : ''}`}
                key={surah.id}
                onClick={() => setTrack(surah, null, queue, originalIndex)}
              >
                <span className={`queue-index ${isCurrentTrack ? 'highlight' : ''}`}>
                  {surah.id}
                </span>
                <div className="queue-info">
                  <h4>{surah.nameEnglish} ({surah.nameArabic})</h4>
                  <p>{surah.meaning}</p>
                </div>
                <Menu size={20} color="#6b7280" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDrawer;


