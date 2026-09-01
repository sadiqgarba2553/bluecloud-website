import { useRef, useCallback, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudRain, Star, Play, Pause, Rewind, FastForward,
  Moon, Volume2, VolumeX, ListVideo, Share2, Loader, WifiOff,
  Download, Check, Lock, Repeat2, Repeat1, Shuffle, ChevronDown
} from 'lucide-react';
import {
  usePlayback,
  useCurrentTime,
  useUserData,
  useUIState,
  usePlayerActions,
} from '../context/PlayerContext';
import SoundModal from './SoundModal';
import PlaylistDrawer from './PlaylistDrawer';
import SleepTimerModal from './SleepTimerModal';
import QuranTextModal from './QuranTextModal';
import ReciterAvatar from './ReciterAvatar';

const AcidSquares = lazy(() => import('./AcidSquares'));
const Prism = lazy(() => import('./Prism'));
const DarkVeil = lazy(() => import('./DarkVeil'));
const LiquidEther = lazy(() => import('./LiquidEther'));
import './FullScreenPlayer.css';

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

// Custom iOS Control Center style Volume Pill Slider
function VolumePill({ value, onChange, disabled, icon: Icon, fillGradient, label }) {
  const trackRef = useRef(null);

  const handlePointer = (e) => {
    if (disabled) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const offsetY = rect.bottom - clientY;
    const pct = Math.max(0, Math.min(offsetY / rect.height, 1));
    onChange(Math.round(pct * 100) / 100);
  };

  const handleDown = (e) => {
    handlePointer(e);
    const move = (ev) => handlePointer(ev);
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', up, { passive: true });
  };

  const pct = Math.round((value || 0) * 100);

  return (
    <div className={`volume-pill-item ${disabled ? 'disabled' : ''}`}>
      <div
        className="volume-pill-track"
        ref={trackRef}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
      >
        <div
          className="volume-pill-fill"
          style={{ height: `${pct}%`, background: fillGradient }}
        />
        <div className="volume-pill-icon-inner">
          <Icon size={16} />
        </div>
      </div>
      <span className="volume-pill-title">{label}</span>
      <span className="volume-pill-pct">{pct}%</span>
    </div>
  );
}

const FullScreenPlayer = () => {
  const navigate = useNavigate();

  const {
    currentTrack, isPlaying, duration, playbackSpeed,
    activeSound, sleepEndTime,
    isBuffering, audioError, volume,
    soundVolume, repeatMode, shuffleOn,
  } = usePlayback();

  const currentTime = useCurrentTime();

  const {
    favouriteSurahIds, playerNatureTheme = 'darkveil',
    isPro, downloadingTrackId, downloadProgress,
  } = useUserData();

  const {
    isVolumeOpen, isSoundModalOpen, isPlaylistDrawerOpen,
    isSleepTimerOpen, isQuranTextOpen,
  } = useUIState();

  const {
    setSoundVolume, togglePlay, playNext, playPrev, seek, cycleSpeed,
    toggleFavouriteSurah, closePlayer, setVolume, toggleVolume,
    toggleSoundModal, togglePlaylistDrawer, toggleSleepTimerModal, toggleQuranText,
    downloadTrack, isDownloaded, toggleRepeat, shuffleQueue, openReciterProfile,
  } = usePlayerActions();

  const { surah, reciter } = currentTrack;
  const isFavSurah = favouriteSurahIds.has(surah.id);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(null); // { time, percent }

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const remaining = Math.max(0, duration - displayTime);
  const progressBarRef = useRef(null);
  const isFreeTheme = playerNatureTheme === 'darkveil' || playerNatureTheme === 'none';
  const activeTheme = isPro || isFreeTheme ? playerNatureTheme : 'darkveil';

  // ── Swipe-to-Dismiss State ─────────────────────────────────
  const [swipeDeltaY, setSwipeDeltaY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const swipeStartRef = useRef({ y: 0, time: 0 });
  const swipeHistoryRef = useRef([]); // [{y, t}] for velocity
  const playerRef = useRef(null);

  const handleGoToQariProfile = () => {
    if (reciter) {
      openReciterProfile(reciter);
      closePlayer();
      navigate('/reciters');
    }
  };

  // ── Calculate Seek Time from Mouse / Touch ─────────────────
  const calculateSeekTime = useCallback((clientX) => {
    const bar = progressBarRef.current;
    if (!bar || duration <= 0) return 0;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.floor((x / rect.width) * duration);
  }, [duration]);

  // ── Pointer Scrubbing Handlers ────────────────────────────
  const handlePointerDown = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const time = calculateSeekTime(clientX);
    setIsDragging(true);
    setDragTime(time);
    triggerHaptic(10);

    const move = (ev) => {
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const t = calculateSeekTime(cx);
      setDragTime(t);
    };

    const up = (ev) => {
      setIsDragging(false);
      const cx = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
      const finalTime = calculateSeekTime(cx);
      seek(finalTime);
      triggerHaptic(15);

      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', up, { passive: true });
  }, [calculateSeekTime, seek]);

  const handleMouseMove = (e) => {
    if (isDragging || !progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    const time = Math.floor((x / rect.width) * duration);
    setHoverPosition({ time, percent });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  // ── Share / Cast ────────────────────────────────────────
  const [shareToast, setShareToast] = useState(false);
  const handleShare = async () => {
    const text = `Listening to ${surah.nameEnglish} (${surah.nameArabic}) recited by ${reciter.name} on Quranly`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Quranly', text }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // ── Swipe-to-Dismiss Handlers ───────────────────────────
  const rubberband = (overshoot, dimension, constant = 0.55) => {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  };

  const handleSwipeStart = useCallback((e) => {
    // Don't intercept drags on progress bar, volume controls, or modals
    const tag = e.target.tagName;
    if (['INPUT', 'BUTTON', 'A'].includes(tag)) return;
    if (e.target.closest('.fs-progress-bar-area') || e.target.closest('.volume-pill-track') || e.target.closest('.sound-modal') || e.target.closest('.playlist-drawer')) return;

    const clientY = e.clientY;
    swipeStartRef.current = { y: clientY, time: Date.now() };
    swipeHistoryRef.current = [{ y: clientY, t: Date.now() }];
    setIsSwiping(true);

    const onMove = (ev) => {
      const cy = ev.clientY;
      const delta = cy - swipeStartRef.current.y;

      // Track velocity history (last 5 points)
      swipeHistoryRef.current.push({ y: cy, t: Date.now() });
      if (swipeHistoryRef.current.length > 5) swipeHistoryRef.current.shift();

      // Allow downward freely, rubber-band upward
      const clamped = delta > 0 ? delta : rubberband(delta, window.innerHeight);
      setSwipeDeltaY(clamped);
    };

    const onEnd = () => {
      setIsSwiping(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onEnd);
      document.removeEventListener('pointercancel', onEnd);

      // Calculate velocity from history
      const history = swipeHistoryRef.current;
      let velocityY = 0;
      if (history.length >= 2) {
        const last = history[history.length - 1];
        const first = history[0];
        const dt = (last.t - first.t) / 1000; // seconds
        if (dt > 0) velocityY = (last.y - first.y) / dt; // px/s
      }

      const currentDelta = swipeStartRef.current.y;
      const finalDelta = (history.length > 0 ? history[history.length - 1].y : currentDelta) - swipeStartRef.current.y;

      // Dismiss if dragged far enough or velocity is high enough
      if (finalDelta > 120 || velocityY > 500) {
        setIsClosing(true);
        setSwipeDeltaY(window.innerHeight); // animate off-screen
        setTimeout(() => {
          closePlayer();
          setIsClosing(false);
          setSwipeDeltaY(0);
        }, 300);
      } else {
        // Snap back
        setSwipeDeltaY(0);
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
    document.addEventListener('pointercancel', onEnd);
  }, [closePlayer]);

  return (
    <div
      ref={playerRef}
      className={`full-screen-player open ${isClosing ? 'closing' : ''} ${isSwiping ? 'dragging' : ''}`}
      style={{
        transform: swipeDeltaY !== 0 ? `translateY(${swipeDeltaY}px)` : undefined,
        transition: isSwiping ? 'none' : 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onPointerDown={handleSwipeStart}
    >
      {/* Drag Handle Pill */}
      <div className="fs-drag-handle"><div className="fs-drag-pill" /></div>

      {/* Background Video / Canvas / LiquidEther / Prism / DarkVeil / AcidSquares & Gradient Overlay */}
      <div className="fs-background-gradient">
        <Suspense fallback={<div className="fs-solid-backdrop" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: '#09090b' }} />}>
          {activeTheme === 'liquidether' ? (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <LiquidEther
                colors={['#5227FF', '#FF9FFC', '#B497CF']}
                mouseForce={20}
                cursorSize={100}
                isViscous={false}
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo={true}
                autoSpeed={0.5}
                autoIntensity={2.2}
                takeoverDuration={0.25}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
              />
            </div>
          ) : activeTheme === 'darkveil' ? (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <DarkVeil
                hueShift={0}
                noiseIntensity={0.02}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                resolutionScale={1}
              />
            </div>
          ) : activeTheme === 'prism' ? (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <Prism
                animationType="rotate"
                timeScale={0.5}
                height={3.5}
                baseWidth={5.5}
                scale={3.6}
                hueShift={0}
                colorFrequency={1}
                noise={0.5}
                glow={1}
              />
            </div>
          ) : activeTheme === 'acid' ? (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <AcidSquares
                color1="#3300ff"
                color2="#6c26af"
                color3="#FFFFFF"
                detail="medium"
                speed={0.7}
                waveDepth={1}
                zoom={1.3}
                density={10.0}
                glow={1.0}
                exposure={2700}
                spread={0.3}
                stepSize={0.002}
                colorShift={0}
                contrast={1}
                brightness={1.0}
                opacity={1.0}
                mouseInteraction={true}
                mouseStrength={0.1}
                mouseRadius={0.35}
                blur={0}
                grain={true}
                grainIntensity={0.05}
              />
            </div>
          ) : (
            <div className="fs-solid-backdrop" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: '#09090b' }} />
          )}
        </Suspense>
        <div className="fs-video-dark-overlay" />
      </div>

      <div className="fs-content">
        {/* Top Header Bar with Safe-Area & Collapse */}
        <div className="fs-top-bar">
          <button className="fs-header-btn pressable" onClick={closePlayer} title="Close Player">
            <ChevronDown size={24} />
          </button>

          {/* Sound selector pill */}
          <div className="fs-sound-selector">
            <button className="sound-pill pressable" onClick={() => { toggleSoundModal(); triggerHaptic(10); }}>
              <CloudRain size={15} />
              <span>{activeSound === 'None' ? 'Sound off' : activeSound}</span>
            </button>
          </div>

          <div className="fs-header-spacer" />
        </div>

        <div className="fs-main-controls">
          {/* Track info */}
          <div className="fs-track-info">
            <div className="fs-track-left">
              <div
                className="fs-avatar clickable-qari pressable"
                onClick={handleGoToQariProfile}
                style={{ cursor: 'pointer' }}
                title={`View ${reciter.name} profile`}
              >
                <ReciterAvatar name={reciter.name} src={reciter.avatar} alt={reciter.name} />
              </div>
              <div className="fs-text">
                <h2>{surah.nameEnglish}</h2>
                <p
                  className="clickable-qari-name"
                  onClick={handleGoToQariProfile}
                  style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                  title={`View ${reciter.name} profile`}
                >
                  {reciter.name}
                </p>
              </div>
            </div>
            <button
              className={`fs-star-btn pressable ${isFavSurah ? 'active' : ''}`}
              onClick={() => { toggleFavouriteSurah(surah.id); triggerHaptic(12); }}
              title="Favorite Surah"
            >
              <Star size={24} fill={isFavSurah ? '#fbbf24' : 'none'} color={isFavSurah ? '#fbbf24' : '#9ca3af'} />
            </button>
          </div>

          {/* Audio error */}
          {audioError && (
            <div className="fs-audio-error">
              <WifiOff size={14} />
              <span>{audioError}</span>
            </div>
          )}

          {/* Controls */}
          <div className="fs-playback-controls">
            <button
              className={`fs-speed pressable ${shuffleOn ? 'active-control' : ''}`}
              onClick={() => { shuffleQueue(); triggerHaptic(10); }}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            <div className="fs-main-buttons">
              <button className="pressable" onClick={() => { playPrev(); triggerHaptic(10); }}><Rewind size={28} fill="currentColor" /></button>
              <button className={`fs-play-btn pressable ${isPlaying ? 'playing' : ''}`} onClick={() => { togglePlay(); triggerHaptic(15); }}>
                {isBuffering
                  ? <Loader size={36} className="spin" />
                  : isPlaying
                    ? <Pause size={36} fill="currentColor" />
                    : <Play size={36} fill="currentColor" />
                }
              </button>
              <button className="pressable" onClick={() => { playNext(); triggerHaptic(10); }}><FastForward size={28} fill="currentColor" /></button>
            </div>
            <button
              className={`fs-repeat-btn pressable ${repeatMode !== 'off' ? 'active-control' : ''}`}
              onClick={() => { toggleRepeat(); triggerHaptic(10); }}
              title={repeatMode === 'off' ? 'No repeat' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat2 size={20} />}
            </button>
          </div>

          {/* Progress bar */}
          <div className="fs-progress-wrapper">
            <div
              className={`fs-progress-bar ${isDragging ? 'dragging' : ''}`}
              ref={progressBarRef}
              onMouseDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="fs-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              <div className="fs-progress-thumb" style={{ left: `${progressPercent}%` }}>
                {isDragging && (
                  <div className="fs-seek-tooltip">
                    {formatTime(dragTime)}
                  </div>
                )}
              </div>
              {!isDragging && hoverPosition && (
                <div className="fs-seek-hover-indicator" style={{ left: `${hoverPosition.percent}%` }}>
                  <span className="fs-seek-hover-time">{formatTime(hoverPosition.time)}</span>
                </div>
              )}
            </div>
            <div className="fs-time-info">
              <span>{formatTime(displayTime)}</span>
              <span>-{formatTime(remaining)}</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="fs-bottom-bar">
            {/* Dual Volume Popup */}
            <div className="fs-volume-wrap">
              <button onClick={toggleVolume} title="Volume Controls">
                {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              {isVolumeOpen && (
                <>
                  <div className="fs-volume-backdrop" onClick={toggleVolume} />
                  <div className="fs-volume-popup-card">
                    <VolumePill
                      value={volume}
                      onChange={setVolume}
                      icon={Volume2}
                      fillGradient="linear-gradient(to top, #334155, #818cf8)"
                      label="Recitation"
                    />
                    <div className="volume-pill-divider"></div>
                    <VolumePill
                      value={soundVolume}
                      onChange={setSoundVolume}
                      disabled={activeSound === 'None'}
                      icon={CloudRain}
                      fillGradient="linear-gradient(to top, #6366f1 10%, #a5b4fc)"
                      label="Ambient"
                    />
                  </div>
                </>
              )}
            </div>
            {/* Speed */}
            <button className="fs-speed" onClick={cycleSpeed} title="Playback speed">{playbackSpeed}x</button>

            {/* Sleep timer */}
            <button
              className={`fs-sleep ${sleepEndTime ? 'active' : ''}`}
              onClick={toggleSleepTimerModal}
              title="Sleep timer"
            >
              <Moon size={20} fill={sleepEndTime ? '#a78bfa' : 'none'} color={sleepEndTime ? '#a78bfa' : 'currentColor'} />
            </button>

            {/* Download button */}
            <button
              onClick={() => downloadTrack(surah, reciter)}
              title={isDownloaded(surah.id, reciter.id) ? 'Downloaded offline' : isPro ? 'Download for offline playback' : 'Pro Feature: Download'}
              className="download-btn-fs"
            >
              {downloadingTrackId === `${surah.id}_${reciter.id}` ? (
                <span className="dl-progress-ring">{downloadProgress}%</span>
              ) : isDownloaded(surah.id, reciter.id) ? (
                <Check size={22} color="#10b981" />
              ) : isPro ? (
                <Download size={22} color="#e0e7ff" />
              ) : (
                <Lock size={20} color="#fbbf24" />
              )}
            </button>

            {/* Quran text */}
            <button className="q-icon" onClick={toggleQuranText} title="View Quran text">ق</button>

            {/* Share / Cast */}
            <div className="fs-share-wrap">
              <button onClick={handleShare} title="Share">
                <Share2 size={24} />
              </button>
              {shareToast && <div className="share-toast">Link copied!</div>}
            </div>

            {/* Queue */}
            <button onClick={togglePlaylistDrawer}><ListVideo size={24} /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isSoundModalOpen && <SoundModal />}
      {isPlaylistDrawerOpen && <PlaylistDrawer />}
      {isSleepTimerOpen && <SleepTimerModal />}
      {isQuranTextOpen && <QuranTextModal surahId={surah.id} surahName={surah.nameEnglish} surahArabic={surah.nameArabic} />}
    </div>
  );
};

export default FullScreenPlayer;


