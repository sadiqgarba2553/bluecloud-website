import { useState } from 'react';
import { X, Check, Search } from 'lucide-react';
import { usePlayback, usePlayerActions } from '../context/PlayerContext';
import sounds, { getSoundIcon } from '../data/sounds';
import './SoundModal.css';

// Inline MinusCircle SVG component
function MinusCircle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

const SoundModal = () => {
  const { activeSound } = usePlayback();
  const { setSound, toggleSoundModal } = usePlayerActions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSounds = sounds.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (soundId) => {
    setSound(soundId);
  };

  return (
    <div className="modal-overlay" onClick={toggleSoundModal}>
      <div className="sound-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="icon-btn dark" onClick={toggleSoundModal}>
            <X size={20} color="#fff" />
          </button>
          <h3>Background sound</h3>
          <button className="icon-btn light" onClick={toggleSoundModal}>
            <Check size={20} color="#000" />
          </button>
        </div>

        <div className="search-bar sound-search">
          <Search size={20} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sounds-grid">
          {filteredSounds.map((sound) => {
            const Icon = sound.iconName === 'MinusCircle' ? MinusCircle : getSoundIcon(sound.iconName);
            const isActive = activeSound === sound.id;
            if (!Icon && sound.iconName !== 'MinusCircle') return null;
            return (
              <div
                key={sound.id}
                className={`sound-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(sound.id)}
              >
                <div className="sound-icon-wrapper">
                  <Icon size={28} color="#fff" />
                  {isActive && <div className="active-badge"><Check size={10} color="#000" strokeWidth={4} /></div>}
                  {sound.type === 'download' && !isActive && (
                    <div className="download-badge">↓</div>
                  )}
                </div>
                <span className="sound-name">{sound.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SoundModal;


