/**
 * audioEngine.js — High-craft audio engine utilities for Quranly
 * Implements smooth micro-gain ramps (zero clicks/pops), CDN fallbacks, and MediaSession helpers.
 */

// Smoothly ramps an HTMLMediaElement volume over durationMs
export function fadeVolume(audio, targetVolume, durationMs = 60) {
  if (!audio) return Promise.resolve();
  const clampedTarget = Math.max(0, Math.min(1, targetVolume));
  const startVolume = audio.volume;
  const diff = clampedTarget - startVolume;

  if (Math.abs(diff) < 0.01) {
    audio.volume = clampedTarget;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Smooth cubic-bezier ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, startVolume + diff * ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        audio.volume = clampedTarget;
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

// Fallback audio mirrors for high reliability
export function getAlternateAudioUrls(surahId, reciterName) {
  const paddedSurah = String(surahId).padStart(3, '0');
  const urls = [
    `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaaseee/${paddedSurah}.mp3`,
    `https://server8.mp3quran.net/afs/${paddedSurah}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}001.mp3`
  ];
  return urls;
}

// Haptic feedback trigger for tactile interactions (safe on all browsers)
export function triggerHaptic(duration = 10) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  } catch (_) {}
}
