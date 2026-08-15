/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import staticSurahs from '../data/surahs';
import staticReciters from '../data/reciters';
import {
  fetchReciters, fetchSuwar, fetchRiwayat,
  fetchMoshaf, fetchRadios, fetchTafasir,
  buildSurahAudioUrl,
} from '../services/mp3quranApi';
import { getSoundUrl } from '../data/sounds';

import { getReciterAvatarUrl } from '../utils/reciterPhotos';

import {
  getDownloadedTracks, isTrackDownloaded,
  downloadAudioTrack, removeAudioTrack, getCachedAudioUrl,
} from '../services/offlineCache';
import SubscriptionModal from '../components/SubscriptionModal';
import AuthModal from '../components/AuthModal';
import { auth, subscribeUserData, saveUserDataToFirestore } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { evaluateUserAchievements } from '../utils/achievements';
import { recordReciterPlay, recordListeningDuration, recordSurahCompleted } from '../utils/reciterAnalytics';

// ─── Shape Mappers ────────────────────────────────────────────
function mapReciter(r) {
  const moshafList = (r.moshaf ?? []).map(m => ({
    ...m,
    server: m.server ? m.server.replace(/^http:\/\//i, 'https://') : m.server,
  }));
  return {
    id: r.id,
    name: r.name,
    letter: r.letter,
    country: r.country || '',
    avatar: getReciterAvatarUrl(r.name, r.id),
    moshaf: moshafList.length > 0 ? moshafList : (r.server ? [{ id: 1, name: 'Standard', server: r.server }] : []),
    server: moshafList[0]?.server ?? (r.server ? r.server.replace(/^http:\/\//i, 'https://') : null),
    categories: r.categories ?? ['All'],
  };
}

function mapSurah(s) {
  const staticMatch = staticSurahs.find(st => st.id === s.id);
  return {
    id: s.id,
    nameArabic: staticMatch?.nameArabic ?? s.name,
    nameEnglish: staticMatch?.nameEnglish ?? s.name,
    meaning: staticMatch?.meaning ?? '',
    verseCount: staticMatch?.verseCount ?? 10,
    type: s.makkia === 1 ? 'Meccan' : 'Medinan',
    apiName: s.name,
    startPage: s.start_page,
    endPage: s.end_page,
  };
}

function getAudioUrlFromReciter(reciter, surahId, moshafIndex = 0) {
  if (!reciter) return null;
  let serverUrl = null;
  if (reciter.moshaf && reciter.moshaf.length > 0) {
    const m = reciter.moshaf[moshafIndex] ?? reciter.moshaf[0];
    serverUrl = m?.server;
  }
  if (!serverUrl && reciter.server) {
    serverUrl = reciter.server;
  }
  if (!serverUrl) return null;

  // Enforce https to prevent browser mixed content blocking
  const secureServer = serverUrl.replace(/^http:\/\//i, 'https://');
  return buildSurahAudioUrl(secureServer, surahId);
}

// ─── LocalStorage Helpers ─────────────────────────────────────
const loadSavedSet = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return new Set(JSON.parse(saved));
  } catch (e) {
    console.error('Error loading saved set:', e);
  }
  return new Set();
};

const loadSavedJson = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading saved json:', e);
  }
  return fallback;
};

// ─── Initial State ─────────────────────────────────────────
const rawSavedTrack = loadSavedJson('quranly_last_track', null);
const savedLastTrack = (rawSavedTrack?.track?.surah?.id && rawSavedTrack?.track?.reciter?.id) ? rawSavedTrack : null;

const initialState = {
  // Playback State
  queue: [],
  queueIndex: 0,
  currentTrack: savedLastTrack ? savedLastTrack.track : { surah: staticSurahs[0], reciter: staticReciters[0], moshafIndex: 0 },
  currentTime: savedLastTrack ? savedLastTrack.currentTime : 0,
  isPlaying: false,
  duration: 0,
  volume: 1,
  playbackSpeed: 1,
  repeatMode: 'off',
  shuffleOn: false,
  isBuffering: false,
  audioError: null,

  // Pro & Subscription State
  isPro: localStorage.getItem('quranly_pro_active') === 'true',
  isSubscriptionModalOpen: false,
  downloadedTracks: getDownloadedTracks(),
  downloadingTrackId: null,
  downloadProgress: 0,

  themeMode: localStorage.getItem('quranly_theme') || 'light', // 'light' (default) | 'dark' | 'system'
  appTheme: localStorage.getItem('quranly_app_theme') || 'white', // 'white' | 'indigo'
  playerNatureTheme: localStorage.getItem('quranly_player_nature_theme') || 'stars', // 'stars' | 'aurora' | 'ocean' | 'none'

  favouriteSurahIds: loadSavedSet('quranly_fav_surahs'),
  favouriteReciterIds: loadSavedSet('quranly_fav_reciters'),
  bookmarkedVerses: loadSavedJson('quranly_bookmarks', []),
  customPlaylists: loadSavedJson('quranly_custom_playlists', []),
  verseReflections: loadSavedJson('quranly_verse_reflections', []),
  groupKhatms: loadSavedJson('quranly_group_khatms', []),

  activeSound: 'None',
  soundVolume: 0.4,

  sleepMinutes: null,
  sleepEndTime: null,
  sleepMode: 'timer', // 'timer' | 'endOfSurah'

  listeningHistory: loadSavedJson('quranly_listening_history', {
    [new Date().toISOString().split('T')[0]]: 0,
  }),
  dailyGoalMinutes: loadSavedJson('quranly_daily_goal', 10),
  recentReciterIds: loadSavedJson('quranly_recent_reciter_ids', [1, 2, 3]),
  completedAzkarCount: loadSavedJson('quranly_azkar_count', 0),
  dailyAzkarGoal: loadSavedJson('quranly_azkar_goal', 5),

  isPlayerOpen: false,
  isSoundModalOpen: false,
  isPlaylistDrawerOpen: false,
  isSleepTimerOpen: false,
  isQuranTextOpen: false,
  isVolumeOpen: false,
  activeProfileReciter: null,

  // Auth & Firebase State
  currentUser: null,
  isAuthModalOpen: false,
  isCloudLoaded: false,

  reciters: staticReciters,
  surahs: staticSurahs,
  riwayat: [],
  moshaf: [],
  radios: [],
  tafasir: [],
  apiLanguage: 'eng',
  apiLoading: true,
  apiError: null,
};

// ─── Reducer ────────────────────────────────────────────────
function playerReducer(state, action) {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true, audioError: null };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying, audioError: null };

    case 'SET_TRACK': {
      const { surah, reciter, queue, queueIndex, moshafIndex } = action.payload;
      return {
        ...state,
        currentTrack: {
          surah,
          reciter: reciter || state.currentTrack.reciter,
          moshafIndex: moshafIndex ?? state.currentTrack.moshafIndex,
        },
        queue: queue || state.queue,
        queueIndex: queueIndex ?? state.queueIndex,
        currentTime: 0,
        duration: 0,
        isPlaying: true,
        isBuffering: true,
        audioError: null,
      };
    }

    case 'PLAY_NEXT': {
      // Sleep end-of-surah: pause instead of advancing
      if (state.sleepMode === 'endOfSurah' && state.sleepEndTime === -1) {
        return { ...state, isPlaying: false, sleepMode: 'timer', sleepEndTime: null, sleepMinutes: null };
      }
      if (state.repeatMode === 'one') {
        return { ...state, currentTime: 0, isPlaying: true, isBuffering: true };
      }

      let nextIndex;
      if (state.shuffleOn && state.queue.length > 1) {
        let randomIndex = state.queueIndex;
        while (randomIndex === state.queueIndex) {
          randomIndex = Math.floor(Math.random() * state.queue.length);
        }
        nextIndex = randomIndex;
      } else {
        nextIndex = state.queueIndex + 1;
        if (nextIndex >= state.queue.length) {
          nextIndex = 0; // continuous playback loop
        }
      }

      const nextSurah = state.queue[nextIndex];
      return {
        ...state,
        currentTrack: { ...state.currentTrack, surah: nextSurah },
        queueIndex: nextIndex,
        currentTime: 0,
        duration: 0,
        isPlaying: true,
        isBuffering: true,
        audioError: null,
      };
    }

    case 'PLAY_PREV': {
      if (state.currentTime > 3) return { ...state, currentTime: 0 };
      let prevIndex = state.queueIndex - 1;
      if (prevIndex < 0) prevIndex = state.repeatMode === 'all' ? state.queue.length - 1 : 0;
      const prevSurah = state.queue[prevIndex];
      return {
        ...state,
        currentTrack: { ...state.currentTrack, surah: prevSurah },
        queueIndex: prevIndex,
        currentTime: 0,
        duration: 0,
        isPlaying: true,
        isBuffering: true,
        audioError: null,
      };
    }

    case 'SEEK':
      return { ...state, currentTime: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_SOUND_VOLUME':
      return { ...state, soundVolume: action.payload };

    case 'AUDIO_TIME_UPDATE':
      return { ...state, currentTime: action.payload };
    case 'AUDIO_DURATION':
      return { ...state, duration: action.payload, isBuffering: false };
    case 'AUDIO_BUFFERING':
      return { ...state, isBuffering: action.payload };
    case 'AUDIO_ERROR':
      return { ...state, audioError: action.payload, isPlaying: false, isBuffering: false };

    case 'CYCLE_SPEED': {
      const speeds = [1, 1.5, 2, 0.5];
      const idx = speeds.indexOf(state.playbackSpeed);
      return { ...state, playbackSpeed: speeds[(idx + 1) % speeds.length] };
    }

    case 'SET_QUEUE':
      return { ...state, queue: action.payload.queue, queueIndex: action.payload.queueIndex ?? 0 };

    case 'SHUFFLE_QUEUE': {
      const shuffled = [...state.queue].sort(() => Math.random() - 0.5);
      const newIdx = shuffled.findIndex(s => s.id === state.currentTrack.surah.id);
      return { ...state, queue: shuffled, queueIndex: newIdx >= 0 ? newIdx : 0, shuffleOn: !state.shuffleOn };
    }

    case 'TOGGLE_REPEAT': {
      const modes = ['off', 'all', 'one'];
      const idx = modes.indexOf(state.repeatMode);
      return { ...state, repeatMode: modes[(idx + 1) % modes.length] };
    }

    case 'SET_RECITER':
      return {
        ...state,
        currentTrack: { ...state.currentTrack, reciter: action.payload },
        recentReciterIds: [action.payload.id, ...state.recentReciterIds.filter(id => id !== action.payload.id)].slice(0, 10),
      };

    case 'SET_MOSHAF_INDEX':
      return { ...state, currentTrack: { ...state.currentTrack, moshafIndex: action.payload } };

    case 'TOGGLE_FAVOURITE_SURAH': {
      const newSet = new Set(state.favouriteSurahIds);
      const rawId = action.payload;
      const numId = Number(rawId);
      const strId = String(rawId);
      const hasIt = newSet.has(rawId) || newSet.has(numId) || newSet.has(strId);

      if (hasIt) {
        newSet.delete(rawId);
        newSet.delete(numId);
        newSet.delete(strId);
      } else {
        newSet.add(rawId);
        if (!isNaN(numId)) newSet.add(numId);
        newSet.add(strId);
      }
      // Immediately persist to localStorage so refresh retains the favourite
      try { localStorage.setItem('quranly_fav_surahs', JSON.stringify([...newSet])); } catch { }
      return { ...state, favouriteSurahIds: newSet };
    }
    case 'TOGGLE_FAVOURITE_RECITER': {
      const newSet = new Set(state.favouriteReciterIds);
      const rawId = action.payload;
      const numId = Number(rawId);
      const strId = String(rawId);
      const hasIt = newSet.has(rawId) || newSet.has(numId) || newSet.has(strId);

      if (hasIt) {
        newSet.delete(rawId);
        newSet.delete(numId);
        newSet.delete(strId);
      } else {
        newSet.add(rawId);
        if (!isNaN(numId)) newSet.add(numId);
        newSet.add(strId);
      }
      // Immediately persist to localStorage so refresh retains the followed Qari
      try { localStorage.setItem('quranly_fav_reciters', JSON.stringify([...newSet])); } catch { }
      return { ...state, favouriteReciterIds: newSet };
    }

    case 'TOGGLE_BOOKMARK': {
      const { surahId, verseNumber, verseText } = action.payload;
      const key = `${surahId}:${verseNumber}`;
      const exists = state.bookmarkedVerses.some(b => b.key === key);
      let newBookmarks;
      if (exists) {
        newBookmarks = state.bookmarkedVerses.filter(b => b.key !== key);
      } else {
        newBookmarks = [
          ...state.bookmarkedVerses,
          { key, surahId, verseNumber, verseText: verseText?.slice(0, 80) ?? '', addedAt: Date.now() },
        ];
      }
      // Immediately persist to localStorage
      try { localStorage.setItem('quranly_bookmarks', JSON.stringify(newBookmarks)); } catch { }
      return { ...state, bookmarkedVerses: newBookmarks };
    }

    case 'SET_SOUND':
      return { ...state, activeSound: action.payload };

    case 'SET_SLEEP_TIMER': {
      if (action.payload === null) {
        return { ...state, sleepMinutes: null, sleepEndTime: null, sleepMode: 'timer' };
      }
      if (action.payload === 'endOfSurah') {
        return { ...state, sleepMinutes: -1, sleepEndTime: -1, sleepMode: 'endOfSurah' };
      }
      return {
        ...state,
        sleepMinutes: action.payload,
        sleepEndTime: Date.now() + action.payload * 60 * 1000,
        sleepMode: 'timer',
      };
    }

    case 'ADD_LISTENING_TIME': {
      const today = new Date().toISOString().split('T')[0];
      const prev = state.listeningHistory[today] || 0;
      const newHistory = { ...state.listeningHistory, [today]: prev + action.payload };
      try { localStorage.setItem('quranly_listening_history', JSON.stringify(newHistory)); } catch { }
      return { ...state, listeningHistory: newHistory };
    }

    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoalMinutes: Math.max(1, action.payload) };

    // API
    case 'SET_API_LOADING':
      return { ...state, apiLoading: action.payload };
    case 'SET_API_ERROR':
      return { ...state, apiError: action.payload, apiLoading: false };
    case 'SET_API_DATA': {
      const { reciters, surahs, riwayat, moshaf, radios, tafasir } = action.payload;
      const combinedReciters = [...reciters];
      staticReciters.forEach(sr => {
        if (!combinedReciters.some(cr => cr.id === sr.id || cr.name.toLowerCase() === sr.name.toLowerCase())) {
          combinedReciters.push(sr);
        }
      });
      const currentReciter = combinedReciters.find(r => r.id === state.currentTrack.reciter.id) || combinedReciters[0];
      const currentSurah = surahs.find(s => s.id === state.currentTrack.surah.id) || surahs[0];
      return {
        ...state,
        reciters: combinedReciters,
        surahs, riwayat, moshaf, radios, tafasir,
        apiLoading: false,
        apiError: null,
        currentTrack: { surah: currentSurah, reciter: currentReciter, moshafIndex: 0 },
        queue: surahs.slice(0, 10),
      };
    }
    case 'SET_API_LANGUAGE':
      return { ...state, apiLanguage: action.payload, apiLoading: true };

    case 'SET_APP_THEME':
      try { localStorage.setItem('quranly_app_theme', action.payload); } catch { }
      return { ...state, appTheme: action.payload };

    case 'INCREMENT_AZKAR_COUNT': {
      const nextCount = state.completedAzkarCount + (action.payload || 1);
      try { localStorage.setItem('quranly_azkar_count', JSON.stringify(nextCount)); } catch { }
      if (state.currentUser?.uid) {
        saveUserDataToFirestore(state.currentUser.uid, { completedAzkarCount: nextCount });
      }
      return { ...state, completedAzkarCount: nextCount };
    }

    case 'SET_DAILY_AZKAR_GOAL': {
      const goal = action.payload;
      try { localStorage.setItem('quranly_azkar_goal', JSON.stringify(goal)); } catch { }
      if (state.currentUser?.uid) {
        saveUserDataToFirestore(state.currentUser.uid, { dailyAzkarGoal: goal });
      }
      return { ...state, dailyAzkarGoal: goal };
    }

    case 'SET_PLAYER_NATURE_THEME':
      try { localStorage.setItem('quranly_player_nature_theme', action.payload); } catch { }
      return { ...state, playerNatureTheme: action.payload };

    case 'SET_ACTIVE_PROFILE_RECITER':
      return { ...state, activeProfileReciter: action.payload };

    // UI
    case 'OPEN_PLAYER':
      return { ...state, isPlayerOpen: true };
    case 'CLOSE_PLAYER':
      return { ...state, isPlayerOpen: false, isSoundModalOpen: false, isPlaylistDrawerOpen: false, isSleepTimerOpen: false, isQuranTextOpen: false, isVolumeOpen: false };
    case 'TOGGLE_SOUND_MODAL':
      return { ...state, isSoundModalOpen: !state.isSoundModalOpen };
    case 'TOGGLE_PLAYLIST_DRAWER':
      return { ...state, isPlaylistDrawerOpen: !state.isPlaylistDrawerOpen };
    case 'TOGGLE_SLEEP_TIMER_MODAL':
      return { ...state, isSleepTimerOpen: !state.isSleepTimerOpen };
    case 'TOGGLE_QURAN_TEXT':
      return { ...state, isQuranTextOpen: !state.isQuranTextOpen };
    case 'TOGGLE_VOLUME':
      return { ...state, isVolumeOpen: !state.isVolumeOpen };
    case 'CLOSE_MODALS':
      return { ...state, isSoundModalOpen: false, isPlaylistDrawerOpen: false, isSleepTimerOpen: false, isQuranTextOpen: false, isVolumeOpen: false, isSubscriptionModalOpen: false };

    // Pro & Downloads
    case 'SET_PRO_STATUS':
      return { ...state, isPro: action.payload };
    case 'SET_SUBSCRIPTION_MODAL_OPEN':
      return { ...state, isSubscriptionModalOpen: action.payload };
    case 'SET_DOWNLOADED_TRACKS':
      return { ...state, downloadedTracks: action.payload };
    case 'SET_DOWNLOADING':
      return { ...state, downloadingTrackId: action.payload.trackId, downloadProgress: action.payload.progress ?? 0 };

    // Theme
    case 'SET_THEME_MODE':
      return { ...state, themeMode: action.payload };

    // Auth & Firebase
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_AUTH_MODAL_OPEN':
      return { ...state, isAuthModalOpen: action.payload };
    case 'RESET_USER_DATA': {
      // isCloudLoaded = false prevents auto-sync from writing empty data back to Firestore
      // We do NOT clear favouriteSurahIds, favouriteReciterIds, etc.
      // This preserves the user's local/offline data if they are not logged in.
      return {
        ...state,
        currentUser: null,
        isCloudLoaded: false,
        isPro: false,
      };
    }
    case 'SYNC_FIREBASE_DATA': {
      const d = action.payload;
      let restoredTrack = state.currentTrack;

      if (d.lastPlayedSurahId && state.surahs.length > 0) {
        const foundSurah = state.surahs.find(s => s.id === d.lastPlayedSurahId) || state.surahs[0];
        const foundReciter = (d.lastPlayedReciterId && state.reciters.length > 0)
          ? state.reciters.find(r => r.id === d.lastPlayedReciterId) || state.currentTrack.reciter
          : state.currentTrack.reciter;
        restoredTrack = {
          surah: foundSurah,
          reciter: foundReciter,
          moshafIndex: d.lastPlayedMoshafIndex ?? 0,
        };
      }

      // Merge: take union of cloud and local state to prevent data loss if cloud writes are failing
      const mergedFavSurahs = Array.from(new Set([
        ...(d.favouriteSurahIds || []),
        ...state.favouriteSurahIds
      ]));
      const mergedFavReciters = Array.from(new Set([
        ...(d.favouriteReciterIds || []),
        ...state.favouriteReciterIds
      ]));

      const mergedBookmarksMap = new Map();
      (state.bookmarkedVerses || []).forEach(b => mergedBookmarksMap.set(b.key, b));
      (d.bookmarkedVerses || []).forEach(b => mergedBookmarksMap.set(b.key, b));
      const mergedBookmarks = Array.from(mergedBookmarksMap.values());

      const mergedPlaylistsMap = new Map();
      (state.customPlaylists || []).forEach(p => mergedPlaylistsMap.set(p.id, p));
      (d.customPlaylists || []).forEach(p => {
        if (mergedPlaylistsMap.has(p.id)) {
          const existing = mergedPlaylistsMap.get(p.id);
          mergedPlaylistsMap.set(p.id, {
            ...existing,
            ...p,
            surahIds: Array.from(new Set([...(existing.surahIds || []), ...(p.surahIds || [])]))
          });
        } else {
          mergedPlaylistsMap.set(p.id, p);
        }
      });
      const mergedPlaylists = Array.from(mergedPlaylistsMap.values());

      const mergedHistory = { ...(state.listeningHistory || {}), ...(d.listeningHistory || {}) };
      const mergedGoal = Math.max(d.dailyGoalMinutes || 10, state.dailyGoalMinutes || 10);
      const mergedPro = d.isPro ?? state.isPro;

      const mergedKhatmsMap = new Map();
      (state.groupKhatms || []).forEach(k => mergedKhatmsMap.set(k.id, k));
      (d.groupKhatms || []).forEach(k => {
        const existing = mergedKhatmsMap.get(k.id);
        if (existing) {
          mergedKhatmsMap.set(k.id, {
            ...existing,
            ...k,
            claimedJuz: { ...(existing.claimedJuz || {}), ...(k.claimedJuz || {}) },
          });
        } else {
          mergedKhatmsMap.set(k.id, k);
        }
      });
      const mergedKhatms = Array.from(mergedKhatmsMap.values())
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Sync merged data to localStorage
      try {
        localStorage.setItem('quranly_pro_active', String(mergedPro));
        localStorage.setItem('quranly_fav_surahs', JSON.stringify(mergedFavSurahs));
        localStorage.setItem('quranly_fav_reciters', JSON.stringify(mergedFavReciters));
        localStorage.setItem('quranly_bookmarks', JSON.stringify(mergedBookmarks));
        localStorage.setItem('quranly_custom_playlists', JSON.stringify(mergedPlaylists));
        localStorage.setItem('quranly_listening_history', JSON.stringify(mergedHistory));
        localStorage.setItem('quranly_daily_goal', JSON.stringify(mergedGoal));
        localStorage.setItem('quranly_group_khatms', JSON.stringify(mergedKhatms));
      } catch (e) {
        console.error('LocalStorage sync error:', e);
      }

      return {
        ...state,
        isCloudLoaded: true,
        currentTrack: restoredTrack,
        isPro: mergedPro,
        favouriteSurahIds: new Set(mergedFavSurahs),
        favouriteReciterIds: new Set(mergedFavReciters),
        bookmarkedVerses: mergedBookmarks,
        customPlaylists: mergedPlaylists,
        listeningHistory: mergedHistory,
        dailyGoalMinutes: mergedGoal,
        groupKhatms: mergedKhatms,
      };
    }

    case 'CREATE_PLAYLIST': {
      const sanitizedName = String(action.payload || 'My Playlist')
        .replace(/<[^>]*>?/gm, '')
        .trim()
        .slice(0, 50);

      const newPlaylist = {
        id: 'pl_' + Date.now(),
        name: sanitizedName || 'My Playlist',
        surahIds: [],
        createdAt: Date.now(),
      };
      const afterCreate = [...state.customPlaylists, newPlaylist];
      try { localStorage.setItem('quranly_custom_playlists', JSON.stringify(afterCreate)); } catch { }
      return { ...state, customPlaylists: afterCreate };
    }
    case 'DELETE_PLAYLIST': {
      const afterDelete = state.customPlaylists.filter(p => p.id !== action.payload);
      try { localStorage.setItem('quranly_custom_playlists', JSON.stringify(afterDelete)); } catch { }
      return { ...state, customPlaylists: afterDelete };
    }
    case 'ADD_TO_PLAYLIST': {
      const { playlistId, surahId } = action.payload;
      const afterAdd = state.customPlaylists.map(p => {
        if (p.id === playlistId && !p.surahIds.includes(surahId)) {
          return { ...p, surahIds: [...p.surahIds, surahId] };
        }
        return p;
      });
      try { localStorage.setItem('quranly_custom_playlists', JSON.stringify(afterAdd)); } catch { }
      return { ...state, customPlaylists: afterAdd };
    }
    case 'REMOVE_FROM_PLAYLIST': {
      const { playlistId: rmPlId, surahId: rmSurahId } = action.payload;
      const afterRemove = state.customPlaylists.map(p => {
        if (p.id === rmPlId) {
          return { ...p, surahIds: p.surahIds.filter(id => id !== rmSurahId) };
        }
        return p;
      });
      try { localStorage.setItem('quranly_custom_playlists', JSON.stringify(afterRemove)); } catch { }
      return { ...state, customPlaylists: afterRemove };
    }

    case 'SAVE_REFLECTION': {
      const reflection = action.payload; // { surahId, verseNumber, verseText, noteText, tags, id? }
      const key = `${reflection.surahId}:${reflection.verseNumber}`;
      const id = reflection.id || `refl_${Date.now()}`;
      const updatedItem = {
        ...reflection,
        id,
        key,
        updatedAt: Date.now(),
      };
      const existsIndex = state.verseReflections.findIndex(r => r.id === id || r.key === key);
      let newReflections;
      if (existsIndex >= 0) {
        newReflections = [...state.verseReflections];
        newReflections[existsIndex] = updatedItem;
      } else {
        newReflections = [updatedItem, ...state.verseReflections];
      }
      try { localStorage.setItem('quranly_verse_reflections', JSON.stringify(newReflections)); } catch { }
      return { ...state, verseReflections: newReflections };
    }

    case 'DELETE_REFLECTION': {
      const id = action.payload;
      const filtered = state.verseReflections.filter(r => r.id !== id && r.key !== id);
      try { localStorage.setItem('quranly_verse_reflections', JSON.stringify(filtered)); } catch { }
      return { ...state, verseReflections: filtered };
    }

    case 'CREATE_GROUP_KHATM': {
      const { title, type, targetDate } = action.payload;
      const newKhatm = {
        id: `khatm_${Date.now()}`,
        title: title || 'Family & Friends Khatm',
        type: type || 'group',
        targetDate: targetDate || null,
        claimedJuz: {}, // { 1: { claimedBy: 'User', status: 'completed' } }
        createdAt: Date.now(),
      };
      const afterKhatm = [newKhatm, ...state.groupKhatms];
      try { localStorage.setItem('quranly_group_khatms', JSON.stringify(afterKhatm)); } catch { }
      return { ...state, groupKhatms: afterKhatm };
    }

    case 'CLAIM_KHATM_JUZ': {
      const { khatmId, juzNumber, claimedBy, status } = action.payload;
      const updatedKhatms = state.groupKhatms.map(k => {
        if (k.id === khatmId) {
          const currentClaimed = { ...(k.claimedJuz || {}) };
          if (status === 'unclaimed') {
            delete currentClaimed[juzNumber];
          } else {
            currentClaimed[juzNumber] = {
              claimedBy: claimedBy || state.currentUser?.displayName || 'Me',
              status: status || 'claimed',
              updatedAt: Date.now(),
            };
          }
          return { ...k, claimedJuz: currentClaimed };
        }
        return k;
      });
      try { localStorage.setItem('quranly_group_khatms', JSON.stringify(updatedKhatms)); } catch { }
      return { ...state, groupKhatms: updatedKhatms };
    }

    case 'DELETE_GROUP_KHATM': {
      const khatmId = action.payload;
      const filteredKhatms = state.groupKhatms.filter(k => k.id !== khatmId);
      try { localStorage.setItem('quranly_group_khatms', JSON.stringify(filteredKhatms)); } catch { }
      return { ...state, groupKhatms: filteredKhatms };
    }

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────
const PlayerContext = createContext(null);

export const APP_THEMES = {
  white: {
    primary: '#000000',
    hover: '#18181b',
    darkPrimary: '#ffffff',
    darkHover: '#e4e4e7',
  },
  indigo: {
    primary: '#6366f1',
    hover: '#4f46e5',
    darkPrimary: '#818cf8',
    darkHover: '#a5b4fc',
  },
  amethyst: {
    primary: '#a855f7',
    hover: '#9333ea',
    darkPrimary: '#c084fc',
    darkHover: '#d8b4fe',
  },
  ocean: {
    primary: '#0ea5e9',
    hover: '#0284c7',
    darkPrimary: '#38bdf8',
    darkHover: '#7dd3fc',
  },
  emerald: {
    primary: '#10b981',
    hover: '#059669',
    darkPrimary: '#34d399',
    darkHover: '#6ee7b7',
  },
  sunset: {
    primary: '#f97316',
    hover: '#ea580c',
    darkPrimary: '#fb923c',
    darkHover: '#fdba74',
  },
};

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // ── Persistent audio elements ─────────────────────────────
  const audioRef = useRef(null);
  const bgAudioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
  }
  if (!bgAudioRef.current) {
    bgAudioRef.current = new Audio();
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.4;
  }
  const audio = audioRef.current;
  const bgAudio = bgAudioRef.current;

  // ── Fetch API data on language change ─────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const lang = state.apiLanguage;
    dispatch({ type: 'SET_API_LOADING', payload: true });

    Promise.all([
      fetchReciters(lang, signal), fetchSuwar(lang, signal),
      fetchRiwayat(lang, signal), fetchMoshaf(lang, signal),
      fetchRadios(lang, signal), fetchTafasir(lang, signal),
    ])
      .then(([rec, sur, riw, mos, rad, taf]) => {
        const mappedReciters = (rec.reciters ?? []).map(mapReciter);
        const mappedSurahs = (sur.suwar ?? []).map(mapSurah);
        dispatch({
          type: 'SET_API_DATA',
          payload: {
            reciters: mappedReciters.length > 0 ? mappedReciters : staticReciters,
            surahs: mappedSurahs.length > 0 ? mappedSurahs : staticSurahs,
            riwayat: riw.riwayat ?? [],
            moshaf: mos.moshaf ?? [],
            radios: rad.radios ?? [],
            tafasir: taf.tafasir ?? [],
          },
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('API fetch failed, using fallback:', err);
        dispatch({ type: 'SET_API_ERROR', payload: err.message });
      });

    return () => controller.abort();
  }, [state.apiLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wire audio src on track change (with Cache API lookup) ──
  const surah = state.currentTrack?.surah || staticSurahs[0];
  const reciter = state.currentTrack?.reciter || staticReciters[0];
  const moshafIndex = state.currentTrack?.moshafIndex || 0;
  useEffect(() => {
    if (!reciter || !surah) return;
    const rawUrl = getAudioUrlFromReciter(reciter, surah.id, moshafIndex);
    if (!rawUrl) { audio.pause(); audio.src = ''; return; }

    getCachedAudioUrl(rawUrl).then((url) => {
      audio.src = url;
      audio.load();
      audio.playbackRate = state.playbackSpeed;
      if (state.isPlaying) {
        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch((err) => console.warn('Autoplay error on track change:', err));
        }
      }
      if (reciter?.id && surah?.id) {
        recordReciterPlay(reciter.id, surah.id);
      }
    });
  }, [surah.id, reciter.id, moshafIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gapless Audio Preloader for Next Track ─────────────────
  const nextAudioRef = useRef(null);
  useEffect(() => {
    if (!nextAudioRef.current && typeof Audio !== 'undefined') {
      nextAudioRef.current = new Audio();
    }
    const currentId = surah?.id || 1;
    const nextSurahId = currentId < 114 ? currentId + 1 : 1;
    const nextRawUrl = getAudioUrlFromReciter(reciter, nextSurahId, moshafIndex || 0);
    if (nextRawUrl && nextAudioRef.current) {
      getCachedAudioUrl(nextRawUrl).then((nextUrl) => {
        if (nextAudioRef.current && nextAudioRef.current.src !== nextUrl) {
          nextAudioRef.current.src = nextUrl;
          nextAudioRef.current.preload = 'auto';
        }
      });
    }
  }, [surah.id, reciter, moshafIndex]);

  // ── Play / pause ──────────────────────────────────────────
  useEffect(() => {
    if (state.isPlaying) {
      if (!audio.src) return;
      audio.playbackRate = state.playbackSpeed;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => console.warn('Play error:', err));
      }
    } else {
      audio.pause();
    }
  }, [state.isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Volume & Playback Speed ───────────────────────────────
  useEffect(() => { audio.volume = state.volume; }, [state.volume]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { audio.playbackRate = state.playbackSpeed; }, [state.playbackSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── LocalStorage Sync ─────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('quranly_fav_surahs', JSON.stringify([...state.favouriteSurahIds]));
  }, [state.favouriteSurahIds]);

  useEffect(() => {
    localStorage.setItem('quranly_fav_reciters', JSON.stringify([...state.favouriteReciterIds]));
  }, [state.favouriteReciterIds]);

  useEffect(() => {
    localStorage.setItem('quranly_bookmarks', JSON.stringify(state.bookmarkedVerses));
  }, [state.bookmarkedVerses]);

  useEffect(() => {
    localStorage.setItem('quranly_listening_history', JSON.stringify(state.listeningHistory));
  }, [state.listeningHistory]);

  useEffect(() => {
    localStorage.setItem('quranly_daily_goal', JSON.stringify(state.dailyGoalMinutes));
  }, [state.dailyGoalMinutes]);

  // ── Save Last Played Track (Throttled Resume State) ──────
  const timeBucket = Math.floor((state.currentTime || 0) / 5);
  useEffect(() => {
    try {
      localStorage.setItem('quranly_last_track', JSON.stringify({
        track: state.currentTrack,
        currentTime: state.currentTime
      }));
    } catch { }
  }, [state.currentTrack, state.currentTime, timeBucket]);

  // ── Background sound ──────────────────────────────────────
  useEffect(() => {
    const url = getSoundUrl(state.activeSound);
    if (!url) {
      bgAudio.pause();
      bgAudio.src = '';
    } else {
      if (bgAudio.src !== url) { bgAudio.src = url; bgAudio.load(); }
      bgAudio.play().catch(() => { });
    }
  }, [state.activeSound]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bgAudio.volume = state.soundVolume; }, [state.soundVolume]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sleep timer (wall-clock) ──────────────────────────────
  useEffect(() => {
    if (state.sleepMode === 'timer' && state.sleepEndTime && state.sleepEndTime !== -1 && Date.now() >= state.sleepEndTime) {
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_SLEEP_TIMER', payload: null });
    }
  }, [state.currentTime, state.sleepEndTime, state.sleepMode]);

  // ── Bookmarked Verses Persistence ─────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('quranly_bookmarks', JSON.stringify(state.bookmarkedVerses));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [state.bookmarkedVerses]);

  // ── Audio event listeners (registered once) ───────────────
  const currentTrackRef = useRef(state.currentTrack);
  useEffect(() => {
    currentTrackRef.current = state.currentTrack;
  }, [state.currentTrack]);

  useEffect(() => {
    let lastTimeUpdate = 0;
    let lastDurationLog = Date.now();

    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastTimeUpdate >= 350) {
        lastTimeUpdate = now;
        dispatch({ type: 'AUDIO_TIME_UPDATE', payload: audio.currentTime });
      }

      // Record real listening duration to reciter analytics every 5s
      if (now - lastDurationLog >= 5000) {
        lastDurationLog = now;
        const track = currentTrackRef.current;
        if (track?.reciter?.id) {
          recordListeningDuration(track.reciter.id, 5);
        }
      }
    };
    const onLoadedMetadata = () => {
      audio.playbackRate = state.playbackSpeed;
      if (state.currentTime > 0 && Math.abs(audio.currentTime - state.currentTime) > 1) {
        audio.currentTime = state.currentTime;
      }
      dispatch({ type: 'AUDIO_DURATION', payload: audio.duration });
      dispatch({ type: 'AUDIO_BUFFERING', payload: false });
    };
    const onWaiting = () => dispatch({ type: 'AUDIO_BUFFERING', payload: true });
    const onCanPlay = () => {
      audio.playbackRate = state.playbackSpeed;
      dispatch({ type: 'AUDIO_BUFFERING', payload: false });
    };
    const onEnded = () => {
      const track = currentTrackRef.current;
      if (track?.reciter?.id && track?.surah?.id) {
        recordSurahCompleted(track.reciter.id, track.surah.id);
      }
      try { audio.currentTime = 0; } catch { }
      dispatch({ type: 'PLAY_NEXT' });
    };
    const onError = () => {
      const padded = String(state.currentTrack?.surah?.id || 1).padStart(3, '0');
      const fallbackUrl = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaaseee/${padded}.mp3`;
      if (audio.src !== fallbackUrl) {
        audio.src = fallbackUrl;
        audio.play().catch(() => {
          const msgs = { 1: 'Playback aborted.', 2: 'Network error.', 3: 'Decoding error.', 4: 'Format not supported.' };
          dispatch({ type: 'AUDIO_ERROR', payload: msgs[audio.error?.code] || 'Audio stream unavailable.' });
        });
      } else {
        const msgs = { 1: 'Playback aborted.', 2: 'Network error.', 3: 'Decoding error.', 4: 'Format not supported.' };
        dispatch({ type: 'AUDIO_ERROR', payload: msgs[audio.error?.code] || 'Audio error.' });
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- APP THEME ENGINE (accent only; light/dark from data-theme CSS) ---
  useEffect(() => {
    const resolveMode = () => {
      const mode = state.themeMode || 'light';
      if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return mode === 'dark' ? 'dark' : 'light';
    };

    const applyTheme = () => {
      const resolved = resolveMode();
      document.documentElement.setAttribute('data-theme', resolved);

      const freeThemes = ['white', 'indigo'];
      const effectiveTheme = (!state.isPro && !freeThemes.includes(state.appTheme))
        ? 'white'
        : (state.appTheme || 'white');
      const themeConfig = APP_THEMES[effectiveTheme] || APP_THEMES.white;
      const isDark = resolved === 'dark';
      const primary = isDark ? (themeConfig.darkPrimary || themeConfig.primary) : themeConfig.primary;
      const hover = isDark ? (themeConfig.darkHover || themeConfig.hover) : themeConfig.hover;

      const root = document.documentElement.style;
      root.setProperty('--accent-primary', primary);
      root.setProperty('--accent-color', primary);
      root.setProperty('--accent-hover', hover);
      root.setProperty('--accent-gradient', 'none');
    };

    applyTheme();

    if (state.themeMode !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [state.appTheme, state.themeMode, state.isPro]);

  // ── Media Session API (lock screen / notification bar) ───
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const { surah, reciter } = state.currentTrack;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${surah.nameEnglish} (${surah.nameArabic})`,
      artist: reciter.name,
      album: 'Quranly — Quran Recitation',
      artwork: [
        { src: reciter.avatar || '/logo.png', sizes: '512x512', type: 'image/png' },
      ],
    });
    navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';
  }, [state.currentTrack, state.isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => dispatch({ type: 'PLAY' }));
    navigator.mediaSession.setActionHandler('pause', () => dispatch({ type: 'PAUSE' }));
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch({ type: 'PLAY_NEXT' }));
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch({ type: 'PLAY_PREV' }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Real Listening time tracker (syncs seconds instead of minutes) ──
  const accRef = useRef(0);
  useEffect(() => {
    if (state.isPlaying && state.currentTime > 0) {
      accRef.current += 1;
      if (accRef.current >= 5) {
        dispatch({ type: 'ADD_LISTENING_TIME', payload: 5 });
        accRef.current = 0;
      }
    }
  }, [Math.floor(state.currentTime)]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Action creators ──────────────────────────────────────
  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), []);
  const playNext = useCallback(() => dispatch({ type: 'PLAY_NEXT' }), []);
  const playPrev = useCallback(() => dispatch({ type: 'PLAY_PREV' }), []);
  const seek = useCallback((time) => { audio.currentTime = time; dispatch({ type: 'SEEK', payload: time }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const setVolume = useCallback((v) => dispatch({ type: 'SET_VOLUME', payload: v }), []);
  const setSoundVolume = useCallback((v) => dispatch({ type: 'SET_SOUND_VOLUME', payload: v }), []);
  const cycleSpeed = useCallback(() => dispatch({ type: 'CYCLE_SPEED' }), []);
  const setTrack = useCallback((surah, reciter, queue, queueIndex, moshafIndex) =>
    dispatch({ type: 'SET_TRACK', payload: { surah, reciter, queue, queueIndex, moshafIndex } }), []);
  const setReciter = useCallback((r) => dispatch({ type: 'SET_RECITER', payload: r }), []);
  const setMoshafIndex = useCallback((i) => dispatch({ type: 'SET_MOSHAF_INDEX', payload: i }), []);
  const setQueue = useCallback((queue, queueIndex) => dispatch({ type: 'SET_QUEUE', payload: { queue, queueIndex } }), []);
  const shuffleQueue = useCallback(() => dispatch({ type: 'SHUFFLE_QUEUE' }), []);
  const toggleRepeat = useCallback(() => dispatch({ type: 'TOGGLE_REPEAT' }), []);
  const toggleFavouriteSurah = useCallback((id) => dispatch({ type: 'TOGGLE_FAVOURITE_SURAH', payload: id }), []);
  const toggleFavouriteReciter = useCallback((id) => dispatch({ type: 'TOGGLE_FAVOURITE_RECITER', payload: id }), []);
  const toggleBookmark = useCallback((surahId, verseNumber, verseText) =>
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: { surahId, verseNumber, verseText } }), []);
  const setSound = useCallback((id) => dispatch({ type: 'SET_SOUND', payload: id }), []);
  const setSleepTimer = useCallback((val) => dispatch({ type: 'SET_SLEEP_TIMER', payload: val }), []);
  const setDailyGoal = useCallback((min) => dispatch({ type: 'SET_DAILY_GOAL', payload: min }), []);
  const openPlayer = useCallback(() => dispatch({ type: 'OPEN_PLAYER' }), []);
  const closePlayer = useCallback(() => dispatch({ type: 'CLOSE_PLAYER' }), []);
  const toggleSoundModal = useCallback(() => dispatch({ type: 'TOGGLE_SOUND_MODAL' }), []);
  const togglePlaylistDrawer = useCallback(() => dispatch({ type: 'TOGGLE_PLAYLIST_DRAWER' }), []);
  const toggleSleepTimerModal = useCallback(() => dispatch({ type: 'TOGGLE_SLEEP_TIMER_MODAL' }), []);
  const toggleQuranText = useCallback(() => dispatch({ type: 'TOGGLE_QURAN_TEXT' }), []);
  const toggleVolume = useCallback(() => dispatch({ type: 'TOGGLE_VOLUME' }), []);
  const closeModals = useCallback(() => dispatch({ type: 'CLOSE_MODALS' }), []);
  const setApiLanguage = useCallback((lang) => dispatch({ type: 'SET_API_LANGUAGE', payload: lang }), []);
  const getAudioUrl = useCallback((reciter, surahId, moshafIndex = 0) =>
    getAudioUrlFromReciter(reciter, surahId, moshafIndex), []);

  // Pro & Download Actions
  const openSubscriptionModal = useCallback(() => dispatch({ type: 'SET_SUBSCRIPTION_MODAL_OPEN', payload: true }), []);
  const closeSubscriptionModal = useCallback(() => dispatch({ type: 'SET_SUBSCRIPTION_MODAL_OPEN', payload: false }), []);

  const subscribePro = useCallback((details) => {
    localStorage.setItem('quranly_pro_active', 'true');
    dispatch({ type: 'SET_PRO_STATUS', payload: true });
    if (state.currentUser?.uid) {
      saveUserDataToFirestore(state.currentUser.uid, { isPro: true, proLicense: details || null });
    }
  }, [state.currentUser]);

  const cancelPro = useCallback(() => {
    localStorage.setItem('quranly_pro_active', 'false');
    localStorage.removeItem('quranly_pro_license_data');
    dispatch({ type: 'SET_PRO_STATUS', payload: false });
    if (state.currentUser?.uid) {
      saveUserDataToFirestore(state.currentUser.uid, { isPro: false, proLicense: null });
    }
  }, [state.currentUser]);

  const downloadTrack = useCallback(async (targetSurah, targetReciter) => {
    if (!state.isPro) {
      dispatch({ type: 'SET_SUBSCRIPTION_MODAL_OPEN', payload: true });
      return;
    }
    const audioUrl = getAudioUrlFromReciter(targetReciter, targetSurah.id);
    if (!audioUrl) return;

    const trackId = `${targetSurah.id}_${targetReciter.id}`;
    dispatch({ type: 'SET_DOWNLOADING', payload: { trackId, progress: 0 } });

    try {
      await downloadAudioTrack(audioUrl, targetSurah, targetReciter, (progress) => {
        dispatch({ type: 'SET_DOWNLOADING', payload: { trackId, progress } });
      });
      dispatch({ type: 'SET_DOWNLOADED_TRACKS', payload: getDownloadedTracks() });
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      dispatch({ type: 'SET_DOWNLOADING', payload: { trackId: null, progress: 0 } });
    }
  }, [state.isPro]);

  const removeTrack = useCallback(async (surahId, reciterId) => {
    const updated = await removeAudioTrack(surahId, reciterId);
    dispatch({ type: 'SET_DOWNLOADED_TRACKS', payload: updated });
  }, []);

  const isDownloaded = useCallback((surahId, reciterId) => {
    return isTrackDownloaded(surahId, reciterId);
  }, []);

  // ── Theme Manager ────────
  const setThemeMode = useCallback((mode) => {
    localStorage.setItem('quranly_theme', mode);
    dispatch({ type: 'SET_THEME_MODE', payload: mode });
  }, []);
  const setAppTheme = useCallback((theme) => {
    dispatch({ type: 'SET_APP_THEME', payload: theme });
  }, []);

  // ── Firebase Auth & Firestore Sync Listener ──────────────
  useEffect(() => {
    let unsubscribeFirestore = () => { };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      if (user) {
        unsubscribeFirestore = subscribeUserData(user.uid, (data) => {
          if (data) {
            dispatch({ type: 'SYNC_FIREBASE_DATA', payload: data });
          } else {
            // New user account with no Firestore record yet -> start fresh & clean!
            const freshUserData = {
              isPro: false,
              favouriteSurahIds: [],
              favouriteReciterIds: [],
              bookmarkedVerses: [],
              customPlaylists: [],
              groupKhatms: [],
              listeningHistory: { [new Date().toISOString().split('T')[0]]: 0 },
              dailyGoalMinutes: 10,
              email: user.email,
              displayName: user.displayName || '',
            };
            saveUserDataToFirestore(user.uid, freshUserData);
            dispatch({ type: 'SYNC_FIREBASE_DATA', payload: freshUserData });
          }
        });
      } else {
        // User is not logged in. Just unsubscribe from Firestore and reset auth state.
        // We DO NOT clear localStorage here, otherwise anonymous users lose data on refresh.
        unsubscribeFirestore();
        dispatch({ type: 'RESET_USER_DATA' });
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  // ── Firestore Auto-Sync Effect (Cloud Progress Backup) ──
  // Use a ref to skip the FIRST run after isCloudLoaded becomes true,
  // preventing the race condition where stale state overwrites Firestore.
  const cloudSyncInitRef = useRef(false);
  useEffect(() => {
    if (!state.currentUser?.uid || !state.isCloudLoaded) {
      cloudSyncInitRef.current = false;
      return;
    }
    // Skip the very first trigger after cloud data loads — that trigger
    // fires before React has committed the merged state from SYNC_FIREBASE_DATA.
    if (!cloudSyncInitRef.current) {
      cloudSyncInitRef.current = true;
      return;
    }
    const stats = evaluateUserAchievements({
      listeningHistory: state.listeningHistory,
      dailyGoalMinutes: state.dailyGoalMinutes,
      favouriteReciterIds: state.favouriteReciterIds,
      bookmarkedVerses: state.bookmarkedVerses,
    });

    saveUserDataToFirestore(state.currentUser.uid, {
      isPro: state.isPro,
      favouriteSurahIds: [...state.favouriteSurahIds],
      favouriteReciterIds: [...state.favouriteReciterIds],
      bookmarkedVerses: state.bookmarkedVerses,
      customPlaylists: state.customPlaylists,
      listeningHistory: state.listeningHistory,
      dailyGoalMinutes: state.dailyGoalMinutes,
      groupKhatms: state.groupKhatms,
      lastPlayedSurahId: state.currentTrack?.surah?.id,
      lastPlayedReciterId: state.currentTrack?.reciter?.id,
      lastPlayedMoshafIndex: state.currentTrack?.moshafIndex || 0,
      email: state.currentUser.email,
      displayName: state.currentUser.displayName || '',
      streak: stats.streak,
      totalMinutes: stats.totalMinutes,
      totalXP: stats.totalXP,
      levelTitle: stats.levelTitle,
      unlockedBadgesCount: stats.unlockedCount,
    }).catch(err => console.error("Firestore sync error:", err));
  }, [
    state.currentUser, state.isCloudLoaded, state.isPro, state.favouriteSurahIds,
    state.favouriteReciterIds, state.bookmarkedVerses,
    state.customPlaylists, state.listeningHistory, state.dailyGoalMinutes,
    state.groupKhatms,
    state.currentTrack?.surah?.id, state.currentTrack?.reciter?.id, state.currentTrack?.moshafIndex,
  ]);

  const openAuthModal = useCallback(() => dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: true }), []);
  const closeAuthModal = useCallback(() => dispatch({ type: 'SET_AUTH_MODAL_OPEN', payload: false }), []);

  // Custom Playlist Actions
  const createPlaylist = useCallback((name) => dispatch({ type: 'CREATE_PLAYLIST', payload: name }), []);
  const deletePlaylist = useCallback((id) => dispatch({ type: 'DELETE_PLAYLIST', payload: id }), []);
  const addSurahToPlaylist = useCallback((playlistId, surahId) =>
    dispatch({ type: 'ADD_TO_PLAYLIST', payload: { playlistId, surahId } }), []);
  const removeSurahFromPlaylist = useCallback((playlistId, surahId) =>
    dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: { playlistId, surahId } }), []);

  const setPlayerNatureTheme = useCallback((theme) =>
    dispatch({ type: 'SET_PLAYER_NATURE_THEME', payload: theme }), []);

  const saveReflection = useCallback((reflection) => dispatch({ type: 'SAVE_REFLECTION', payload: reflection }), []);
  const deleteReflection = useCallback((id) => dispatch({ type: 'DELETE_REFLECTION', payload: id }), []);

  const openReciterProfile = useCallback((reciter) =>
    dispatch({ type: 'SET_ACTIVE_PROFILE_RECITER', payload: reciter }), []);

  const createGroupKhatm = useCallback((khatm) => dispatch({ type: 'CREATE_GROUP_KHATM', payload: khatm }), []);
  const claimKhatmJuz = useCallback((data) => dispatch({ type: 'CLAIM_KHATM_JUZ', payload: data }), []);
  const deleteGroupKhatm = useCallback((id) => dispatch({ type: 'DELETE_GROUP_KHATM', payload: id }), []);

  const value = {
    ...state,
    play, pause, togglePlay, playNext, playPrev, seek, cycleSpeed,
    setVolume, setSoundVolume,
    setTrack, setReciter, setMoshafIndex, setQueue, shuffleQueue, toggleRepeat,
    toggleFavouriteSurah, toggleFavouriteReciter, toggleBookmark,
    setSound, setSleepTimer, setDailyGoal,
    openPlayer, closePlayer, toggleSoundModal, togglePlaylistDrawer,
    toggleSleepTimerModal, toggleQuranText, toggleVolume, closeModals,
    setApiLanguage, getAudioUrl,
    incrementAzkarCount: (amt = 1) => dispatch({ type: 'INCREMENT_AZKAR_COUNT', payload: amt }),
    setDailyAzkarGoal: (goal) => dispatch({ type: 'SET_DAILY_AZKAR_GOAL', payload: goal }),
    completedAzkarCount: state.completedAzkarCount,
    dailyAzkarGoal: state.dailyAzkarGoal,
    openSubscriptionModal, closeSubscriptionModal, subscribePro, cancelPro,
    downloadTrack, removeTrack, isDownloaded, setThemeMode, setAppTheme, setPlayerNatureTheme,
    openAuthModal, closeAuthModal, openReciterProfile,
    createPlaylist, deletePlaylist, addSurahToPlaylist, removeSurahFromPlaylist,
    saveReflection, deleteReflection,
    createGroupKhatm, claimKhatmJuz, deleteGroupKhatm,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <SubscriptionModal
        isOpen={state.isSubscriptionModalOpen}
        onClose={closeSubscriptionModal}
        isPro={state.isPro}
        onSubscribeSuccess={subscribePro}
        onCancelPro={cancelPro}
      />
      <AuthModal
        isOpen={state.isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}


