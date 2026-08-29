import { Moon, X } from 'lucide-react';
import { usePlayback, usePlayerActions } from '../context/PlayerContext';
import './SleepTimerModal.css';

const SleepTimerModal = () => {
  const { sleepEndTime, sleepMinutes } = usePlayback();
  const { setSleepTimer, toggleSleepTimerModal } = usePlayerActions();

  const presets = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: 'End of Surah', value: -1 }, // special: will be handled by context
  ];

  const handleSelect = (minutes) => {
    if (minutes === -1) {
      // "End of Surah" — pause after the current surah ends instead of advancing
      setSleepTimer('endOfSurah');
      toggleSleepTimerModal();
      return;
    }
    setSleepTimer(minutes);
    toggleSleepTimerModal();
  };

  const handleClear = () => {
    setSleepTimer(null);
    toggleSleepTimerModal();
  };

  // Calculate remaining time if timer is active
  let remainingText = null;
  if (sleepEndTime) {
    const remaining = Math.max(0, Math.ceil((sleepEndTime - Date.now()) / 60000));
    remainingText = `${remaining} min remaining`;
  }

  return (
    <div className="modal-overlay" onClick={toggleSleepTimerModal}>
      <div className="sleep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sleep-modal-header">
          <Moon size={24} color="#a78bfa" />
          <h3>Sleep Timer</h3>
          <button className="icon-btn dark" onClick={toggleSleepTimerModal}>
            <X size={20} color="#fff" />
          </button>
        </div>

        {remainingText && (
          <div className="sleep-active-banner">
            <span className="sleep-pulse"></span>
            <span>{remainingText}</span>
            <button className="clear-timer-btn" onClick={handleClear}>Clear</button>
          </div>
        )}

        <div className="sleep-presets">
          {presets.map((preset) => (
            <button
              key={preset.value}
              className={`sleep-preset-btn ${sleepMinutes === preset.value ? 'active' : ''}`}
              onClick={() => handleSelect(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepTimerModal;


