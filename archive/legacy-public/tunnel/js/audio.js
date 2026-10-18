// Tunnel Arcade - Web Audio Synthesizer & Music Engine
class ArcadeAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    
    this.sfxMuted = localStorage.getItem('tunnel_sfx_muted') === 'true';
    this.musicMuted = localStorage.getItem('tunnel_music_muted') === 'true' || localStorage.getItem('tunnel_music_muted') === null; // default BGM muted until user toggle
    this.sfxVolume = parseFloat(localStorage.getItem('tunnel_sfx_vol') || '0.7');
    this.musicVolume = parseFloat(localStorage.getItem('tunnel_music_vol') || '0.35');

    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;

    // Auto-initialize on first user interaction
    const unlockAudio = () => {
      this.initContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSFX() {
    this.sfxMuted = !this.sfxMuted;
    localStorage.setItem('tunnel_sfx_muted', this.sfxMuted);
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
    if (!this.sfxMuted) this.play('coin');
    return !this.sfxMuted;
  }

  toggleMusic() {
    this.musicMuted = !this.musicMuted;
    localStorage.setItem('tunnel_music_muted', this.musicMuted);
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : this.musicVolume, this.ctx.currentTime);
    }
    if (!this.musicMuted) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return !this.musicMuted;
  }

  // Plays synthesized sound effect
  play(effect) {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      switch (effect) {
        case 'click':
        case 'move':
          this._synthTone(320, 240, 0.04, 'square', 0.15);
          break;

        case 'rotate':
          this._synthTone(480, 640, 0.06, 'triangle', 0.2);
          break;

        case 'laser':
        case 'shoot':
          this._synthTone(880, 110, 0.12, 'sawtooth', 0.25);
          break;

        case 'jump':
        case 'flap':
          this._synthTone(150, 480, 0.1, 'sine', 0.3);
          break;

        case 'coin':
        case 'score': {
          const osc1 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(987.77, t); // B5
          osc1.frequency.setValueAtTime(1318.51, t + 0.08); // E6
          gain1.gain.setValueAtTime(0.3, t);
          gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc1.connect(gain1);
          gain1.connect(this.sfxGain);
          osc1.start(t);
          osc1.stop(t + 0.35);
          break;
        }

        case 'powerup': {
          const notes = [440, 554, 659, 880];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.06);
            g.gain.setValueAtTime(0.25, t + idx * 0.06);
            g.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * 0.06 + 0.1);
            osc.connect(g);
            g.connect(this.sfxGain);
            osc.start(t + idx * 0.06);
            osc.stop(t + (idx + 1) * 0.06 + 0.1);
          });
          break;
        }

        case 'levelUp': {
          const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + idx * 0.08);
            g.gain.setValueAtTime(0.2, t + idx * 0.08);
            g.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * 0.08 + 0.15);
            osc.connect(g);
            g.connect(this.sfxGain);
            osc.start(t + idx * 0.08);
            osc.stop(t + (idx + 1) * 0.08 + 0.15);
          });
          break;
        }

        case 'explosion':
        case 'hit':
          this._synthNoise(0.25, 0.4);
          break;

        case 'gameover': {
          const notes = [330, 311, 293, 277, 261];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t + idx * 0.12);
            g.gain.setValueAtTime(0.3, t + idx * 0.12);
            g.gain.exponentialRampToValueAtTime(0.001, t + (idx + 1) * 0.12 + 0.2);
            osc.connect(g);
            g.connect(this.sfxGain);
            osc.start(t + idx * 0.12);
            osc.stop(t + (idx + 1) * 0.12 + 0.2);
          });
          break;
        }

        case 'bounce':
          this._synthTone(220, 440, 0.05, 'sine', 0.25);
          break;
      }
    } catch (e) {
      console.warn('SFX synthesis error:', e);
    }
  }

  _synthTone(startFreq, endFreq, duration, type = 'sine', volume = 0.25) {
    if (!this.ctx || this.sfxMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), t + duration);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  _synthNoise(duration = 0.2, volume = 0.3) {
    if (!this.ctx || this.sfxMuted) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  // Procedural Synthwave / Cyber Ambient BGM loop
  startAmbientMusic() {
    if (this.bgmPlaying || this.musicMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.bgmPlaying = true;

    // Synthwave bassline notes (A minor / F / C / G progression)
    const bassline = [
      110, 110, 110, 110, 87.31, 87.31, 87.31, 87.31,
      65.41, 65.41, 65.41, 65.41, 98.0, 98.0, 98.0, 98.0
    ];
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [130.81, 164.81, 196.0], // C
      [196.0, 246.94, 293.66]  // G
    ];

    const stepDuration = 0.24; // ~125 BPM 8th notes

    const tick = () => {
      if (!this.bgmPlaying) return;
      const t = this.ctx.currentTime;
      const freq = bassline[this.bgmStep % bassline.length];

      // Bass synth note
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + stepDuration * 0.9);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + stepDuration * 0.9);

      // Pad chord on step 0, 4, 8, 12
      if (this.bgmStep % 4 === 0) {
        const chordIdx = Math.floor((this.bgmStep % 16) / 4);
        const chord = chords[chordIdx];
        chord.forEach(cNote => {
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          const cFilter = this.ctx.createBiquadFilter();
          cOsc.type = 'triangle';
          cOsc.frequency.setValueAtTime(cNote, t);
          cFilter.type = 'lowpass';
          cFilter.frequency.setValueAtTime(600, t);
          cGain.gain.setValueAtTime(0.04, t);
          cGain.gain.linearRampToValueAtTime(0.07, t + stepDuration);
          cGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 3.8);
          cOsc.connect(cFilter);
          cFilter.connect(cGain);
          cGain.connect(this.musicGain);
          cOsc.start(t);
          cOsc.stop(t + stepDuration * 3.9);
        });
      }

      this.bgmStep++;
      this.bgmTimer = setTimeout(tick, stepDuration * 1000);
    };

    tick();
  }

  stopAmbientMusic() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

window.tunnelAudio = new ArcadeAudioEngine();
