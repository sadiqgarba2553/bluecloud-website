import { useRef, useCallback, useState } from 'react';
import {
  CloudRain, Star, Play, Pause, Rewind, FastForward,
  Moon, Volume2, VolumeX, ListVideo, Share2, Loader, WifiOff,
  Download, Check, Lock, Repeat2, Repeat1, Shuffle
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

import { useEffect } from 'react';
import { Video } from 'lucide-react';

function NatureCanvas({ mode = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps for battery/perf

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Reduced particle count: 70 → 35 (imperceptible visual difference)
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
    }));

    let step = 0;
    let paused = false;

    // Pause when tab/page is not visible
    const handleVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (timestamp) => {
      animId = requestAnimationFrame(render);

      if (paused) return;

      // 30fps frame gate
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      if (mode === 0) {
        // Mode 0: Cosmic Night Sky & Twinkling Stars
        const bgGrad = ctx.createRadialGradient(
          width / 2, height * 0.35, 10,
          width / 2, height * 0.35, width * 0.85
        );
        bgGrad.addColorStop(0, 'rgba(30, 58, 138, 0.55)');
        bgGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.9)');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.alpha += Math.sin(step + p.x) * 0.012;
          const a = Math.max(0.2, Math.min(0.95, p.alpha));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(191, 219, 254, ${a})`;
          ctx.fill();

          p.y -= p.speed * 0.25;
          if (p.y < 0) p.y = height;
        });
      } else if (mode === 1) {
        // Mode 1: Aurora Borealis Nature Light Waves
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(0.4, '#111111');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        [
          { color: 'rgba(255, 255, 255, 0.3)', speed: 1, yOff: height * 0.3 },
          { color: 'rgba(16, 185, 129, 0.25)', speed: 1.3, yOff: height * 0.42 },
          { color: 'rgba(99, 102, 241, 0.25)', speed: 0.8, yOff: height * 0.52 },
        ].forEach((wave) => {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const y = wave.yOff + Math.sin(step * wave.speed + x * 0.007) * 50;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = wave.color;
          ctx.fill();
        });
      } else {
        // Mode 2: Peaceful Ocean Wave Horizon
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, 'rgba(14, 116, 144, 0.45)');
        bgGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.9)');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const y = height * 0.35 + i * 40 + Math.cos(step * 0.8 + x * 0.006 + i) * 35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = `rgba(56, 189, 248, ${0.15 - i * 0.03})`;
          ctx.fill();
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="fs-nature-bg-canvas" style={{ willChange: 'transform' }} />;
}

import { useNavigate } from 'react-router-dom';

const resolveAsset = (p) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
};

const NATURE_IMAGES = [
  resolveAsset('/nature/naturebackground.jpg'),
  resolveAsset('/nature/naturebackground1.jpg'),
  resolveAsset('/nature/naturebackground2.jpg'),
  resolveAsset('/nature/naturebackground3.jpg')
];

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
    favouriteSurahIds, playerNatureTheme = 'stars',
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

  const [bgImage, setBgImage] = useState(() => NATURE_IMAGES[Math.floor(Math.random() * NATURE_IMAGES.length)]);

  useEffect(() => {
    if (currentTrack?.surah?.id) {
      setBgImage(prev => {
        let next;
        do {
          next = NATURE_IMAGES[Math.floor(Math.random() * NATURE_IMAGES.length)];
        } while (next === prev);
        return next;
      });
    }
  }, [currentTrack?.surah?.id]);

  const { surah, reciter } = currentTrack;
  const isFavSurah = favouriteSurahIds.has(surah.id);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(null); // { time, percent }

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const remaining = Math.max(0, duration - displayTime);
  const progressBarRef = useRef(null);

  const canvasMode = playerNatureTheme === 'aurora' ? 1 : playerNatureTheme === 'ocean' ? 2 : playerNatureTheme === 'none' ? null : 0;

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

  return (
    <div className="full-screen-player open">
      {/* Background Video / Canvas & Gradient Overlay */}
      <div className="fs-background-gradient">
        <img
          src={bgImage}
          alt="Nature Background"
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.55)',
            transition: 'opacity 0.6s ease',
            zIndex: 0
          }}
        />
        {canvasMode !== null && <NatureCanvas mode={canvasMode} />}
        <div className="fs-video-dark-overlay" />
      </div>

      <div className="fs-content">
        {/* Handle / Close */}
        <div className="fs-top-handle" onClick={closePlayer}>
          <div className="drag-handle"></div>
        </div>

        {/* Sound selector pill */}
        <div className="fs-sound-selector">
          <button className="sound-pill glass-panel pressable" onClick={() => { toggleSoundModal(); triggerHaptic(10); }}>
            <CloudRain size={16} />
            <span>{activeSound === 'None' ? 'Sound off' : activeSound}</span>
          </button>
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


