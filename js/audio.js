/* NEON RAGE — original Web Audio synth score + SFX */
(function () {
  'use strict';

  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  const TRACKS = {
    title: {
      bpm: 92, root: 45, gain: 0.78,
      bass: [0, null, 0, null, 3, null, 0, null, 0, null, 7, null, 3, null, 0, null],
      lead: [12, null, null, 15, null, 19, null, 15, 12, null, null, 17, null, 15, null, null],
      chords: [0, -2, 3, 0],
      hat: 0.35, snare: 0.4
    },
    select: {
      bpm: 108, root: 43, gain: 0.84,
      bass: [0, 0, null, 0, 7, null, 0, null, 0, 0, null, 5, 3, null, -2, null],
      lead: [12, null, 15, null, 19, null, 15, 12, 19, null, 22, null, 19, 15, 12, null],
      chords: [0, 3, -2, 0],
      hat: 0.6, snare: 0.55
    },
    stage1: {
      bpm: 118, root: 40, gain: 0.95,
      bass: [0, 0, null, 0, 7, null, 0, 0, 0, 0, null, 3, 5, null, 7, 10],
      lead: [12, null, 15, 19, null, 15, 12, null, 19, 22, null, 19, 15, 12, null, 10],
      chords: [0, 0, 8, 7],
      hat: 0.8, snare: 0.85
    },
    stage2: {
      bpm: 126, root: 38, gain: 0.92,
      bass: [0, null, 0, 0, 0, null, 10, 0, 0, null, 0, 7, 5, 3, 2, 0],
      lead: [19, null, 17, 15, null, 12, null, 15, 17, null, 19, 22, null, 19, 17, 15],
      chords: [0, -3, 5, 2],
      hat: 0.95, snare: 0.9
    },
    stage3: {
      bpm: 112, root: 41, gain: 1.0,
      bass: [0, 0, 0, null, 5, null, 0, null, 3, 3, null, 7, 5, null, 3, 2],
      lead: [12, 15, 19, 22, null, 19, 22, 24, 22, 19, 15, 12, null, 15, 19, null],
      chords: [0, 5, 3, 7],
      hat: 0.72, snare: 0.9
    },
    stage4: {
      bpm: 132, root: 42, gain: 0.96,
      bass: [0, null, 0, 0, 7, null, 0, null, 5, null, 5, 0, 3, null, 7, null],
      lead: [19, null, 22, null, 24, 22, 19, null, 17, null, 19, 22, null, 19, 15, null],
      chords: [0, 3, 5, 2],
      hat: 0.95, snare: 0.9
    },
    stage5: {
      bpm: 120, root: 39, gain: 1.0,
      bass: [0, 0, 3, null, 0, 0, 7, null, 5, null, 3, 2, 0, null, 10, 7],
      lead: [12, null, 15, 18, 15, 12, null, 10, 12, 15, 18, 22, 21, 18, 15, 12],
      chords: [0, -2, 5, 3],
      hat: 0.8, snare: 0.92
    },
    bossHouse: {
      bpm: 128, root: 43, gain: 0.98,
      bass: [0, null, 0, 7, null, 3, 0, null, 10, null, 7, 5, 3, null, 0, null],
      lead: [12, null, 15, 19, 22, null, 19, 15, 17, null, 22, 24, 22, 19, 15, 12],
      chords: [0, 3, 5, 2],
      hat: 0.7, snare: 0.6
    },
    twin: {
      bpm: 142, root: 44, gain: 1.0,
      bass: [0, 0, 12, 0, 10, null, 7, 0, 0, 12, 0, 3, 5, 7, 10, 12],
      lead: [24, 22, 19, 22, 24, 27, 24, 22, 19, 17, 15, 17, 19, 22, 24, 27],
      chords: [0, 3, -2, 5],
      hat: 1, snare: 1
    },
    final: {
      bpm: 152, root: 35, gain: 1.0,
      bass: [0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 0, 1, 3, 5, 6, 10],
      lead: [24, null, 23, 24, 27, null, 31, 27, 24, 23, 19, 24, 27, 31, 34, 31],
      chords: [0, 0, -1, 1],
      hat: 1, snare: 1
    },
    boss: {
      bpm: 146, root: 36, gain: 1.0,
      bass: [0, 0, 12, 0, 0, 10, 0, 0, 0, 0, 12, 0, 3, 5, 7, 10],
      lead: [24, null, 22, null, 19, null, 22, 24, 27, null, 24, 22, 19, 17, 15, 12],
      chords: [0, 0, -2, -3],
      hat: 1, snare: 1
    },
    bossRazor: {
      bpm: 152, root: 37, gain: 1.03,
      bass: [0, null, 0, 7, 0, null, 10, null, 0, 7, null, 3, 5, null, 7, 10],
      lead: [19, null, 22, 24, null, 22, 19, 15, 19, 22, null, 24, 27, 24, 22, 19],
      chords: [0, -2, 3, 5],
      hat: .95, snare: 1
    },
    bossTitan: {
      bpm: 132, root: 32, gain: 1.08,
      bass: [0, null, null, 0, null, null, 0, 3, 0, null, null, 0, 5, null, 3, 2],
      lead: [12, null, 15, null, 12, null, 7, null, 10, null, 12, 15, null, 17, 15, 12],
      chords: [0, -3, 0, -5],
      hat: .7, snare: 1
    },
    bossVector: {
      bpm: 158, root: 40, gain: 1.02,
      bass: [0, 0, 7, 0, 3, 3, 10, 3, 0, 0, 7, 0, 5, 5, 12, 7],
      lead: [19, 22, 24, 22, 27, 24, 22, 19, 24, 27, 31, 27, 24, 22, 19, 15],
      chords: [0, 3, 7, 5],
      hat: 1, snare: .95
    },
    clear: {
      bpm: 124, root: 48, gain: 0.9,
      bass: [0, 0, null, 0, 7, null, 0, null, 5, null, 7, null, 12, null, null, null],
      lead: [12, null, 15, null, 19, null, 24, null, 19, null, 22, null, 24, null, 27, null],
      chords: [0, 5, 7, 12],
      hat: 0.5, snare: 0.6
    }
  };

  const STEPS_PER_SECTION = 16;
  const ARRANGEMENT = ['A', 'A', 'B', 'A', 'C', 'A', 'B', 'A'];
  const LOOP_STEPS = STEPS_PER_SECTION * ARRANGEMENT.length;
  const DEFAULT_MASTER = 0.8;
  const DEFAULT_MUSIC = 0.7;
  const DEFAULT_SFX = 0.8;
  const SFX_BURST = 24;
  const SFX_REFILL = 24;
  const clamp01 = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : fallback;
  };

  const MUSIC_PACKS = {
    classic: {
      name: 'NEON CLASSIC', cn: '霓虹经典',
      bpmMul: 1, transpose: 0, gainMul: 1,
      leadWave: 'square', bassWave: 'sawtooth', padWave: 'sawtooth',
      drumMul: 1, hatMul: 1, filterMul: 1, delayGain: .18
    },
    midnight: {
      name: 'MIDNIGHT DRIVE', cn: '午夜驱动',
      bpmMul: .9, transpose: -3, gainMul: .9,
      leadWave: 'triangle', bassWave: 'triangle', padWave: 'sine',
      drumMul: .82, hatMul: .78, filterMul: .72, delayGain: .28
    },
    steel: {
      name: 'STEEL PULSE', cn: '钢铁脉冲',
      bpmMul: 1.08, transpose: 2, gainMul: 1.04,
      leadWave: 'sawtooth', bassWave: 'square', padWave: 'sawtooth',
      drumMul: 1.16, hatMul: 1.18, filterMul: 1.3, delayGain: .1
    }
  };

  function applyMusicPack(track, pack) {
    const p = pack || MUSIC_PACKS.classic;
    return {
      ...track,
      bpm: track.bpm * p.bpmMul,
      root: track.root + p.transpose,
      gain: track.gain * p.gainMul
    };
  }

  class SoundSystem {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.compressor = null;
      this.musicBus = null;
      this.musicVolumeNode = null;
      this.musicDuck = null;
      this.sfxBus = null;
      this.sfxVolumeNode = null;
      this.trackBus = null;
      this.trackFader = null;
      this.trackBusObj = null;
      this.delay = null;
      this.delayGain = null;
      this.noiseBuffer = null;
      this.timer = null;
      this.trackName = null;
      this.track = null;
      this.step = 0;
      this.nextTime = 0;
      this.muted = false;
      this.paused = false;
      this.volume = DEFAULT_MASTER;
      this.musicVolume = DEFAULT_MUSIC;
      this.sfxVolume = DEFAULT_SFX;
      this.intensity = 0;
      this.transportPaused = false;
      this.lastHitAt = 0;
      this.lastSfxAt = Object.create(null);
      this.sfxTokens = SFX_BURST;
      this.sfxTokenAt = 0;
      this.stepDur = 0;
      this.musicPackKey = 'classic';
      this.musicPack = MUSIC_PACKS.classic;
      this.visibilityBound = false;
    }

    setMusicPack(key) {
      if (!MUSIC_PACKS[key]) return false;
      this.musicPackKey = key;
      this.musicPack = MUSIC_PACKS[key];
      if (this.delayGain && this.ctx) this.delayGain.gain.value = this.musicPack.delayGain;
      const current = this.trackName;
      if (current) {
        this.stopMusic(0.12);
        this.playTrack(current);
      }
      return true;
    }

    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();

        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : this.volume;

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -18;
        this.compressor.knee.value = 12;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;

        this.master.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);

        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 0.55;
        this.musicVolumeNode = this.ctx.createGain();
        this.musicVolumeNode.gain.value = this.musicVolume;
        this.musicDuck = this.ctx.createGain();
        this.musicDuck.gain.value = 1;
        this.musicBus.connect(this.musicVolumeNode);
        this.musicVolumeNode.connect(this.musicDuck);
        this.musicDuck.connect(this.master);

        this.sfxBus = this.ctx.createGain();
        this.sfxBus.gain.value = 0.62;
        this.sfxVolumeNode = this.ctx.createGain();
        this.sfxVolumeNode.gain.value = this.sfxVolume;
        this.sfxBus.connect(this.sfxVolumeNode);
        this.sfxVolumeNode.connect(this.master);

        const len = Math.floor(this.ctx.sampleRate * 1.2);
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }

      if (this.ctx.state === 'suspended') this.ctx.resume();

      if (!this.visibilityBound && typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden && this.ctx) {
            this.nextTime = Math.max(this.nextTime, this.ctx.currentTime + 0.08);
          }
        });
        this.visibilityBound = true;
      }
      return true;
    }

    setMuted(muted) {
      this.muted = !!muted;
      if (this.master && this.ctx) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime + 0.08);
      }
    }

    setMusicVolume(value) {
      this.musicVolume = clamp01(value, this.musicVolume);
      if (this.musicVolumeNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.musicVolumeNode.gain.cancelScheduledValues(now);
        this.musicVolumeNode.gain.setTargetAtTime(this.musicVolume, now, 0.03);
      }
    }

    setSfxVolume(value) {
      this.sfxVolume = clamp01(value, this.sfxVolume);
      if (this.sfxVolumeNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.sfxVolumeNode.gain.cancelScheduledValues(now);
        this.sfxVolumeNode.gain.setTargetAtTime(this.sfxVolume, now, 0.03);
      }
    }

    setIntensity(value) {
      this.intensity = clamp01(value, this.intensity);
    }

    duckMusic(amount, hold) {
      if (!this.musicDuck || !this.ctx) return;
      const g = this.musicDuck.gain;
      const now = this.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(Math.max(0.02, 1 - clamp01(amount, 0.3)), now + 0.03);
      g.linearRampToValueAtTime(1, now + 0.03 + Math.max(0.05, hold || 0.3));
    }

    setPaused(paused) {
      this.paused = !!paused;
      this.transportPaused = this.paused;
      if (this.trackFader && this.ctx) {
        const g = this.trackFader.gain;
        const now = this.ctx.currentTime;
        g.cancelScheduledValues(now);
        g.setValueAtTime(g.value, now);
        g.linearRampToValueAtTime(paused ? 0.0001 : 1, now + 0.15);
      }
      if (!paused && this.ctx) this.nextTime = this.ctx.currentTime + 0.08;
    }

    playTrack(name) {
      if (!this.ensure()) return;
      if (!TRACKS[name]) return;
      if (this.trackName === name && this.timer) return;
      this.stopMusic(0.18);
      this.trackName = name;
      this.track = applyMusicPack(TRACKS[name], this.musicPack);
      this.step = 0;
      this.intensity = 0;
      this.stepDur = 60 / this.track.bpm / 4;
      this.nextTime = this.ctx.currentTime + 0.08;

      const bus = this.createTrackBus();
      this.trackBusObj = bus;
      this.trackBus = bus.input;
      this.trackFader = bus.fader;
      this.delay = bus.delay;
      this.delayGain = bus.delayGain;
      this.trackFader.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.trackFader.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.15);

      this.timer = setInterval(() => this.schedule(), 25);
      this.schedule();
    }

    createTrackBus() {
      const c = this.ctx;
      const input = c.createGain();
      const fader = c.createGain();
      const delay = c.createDelay(0.6);
      const delayGain = c.createGain();
      delay.delayTime.value = 0.22;
      delayGain.gain.value = this.musicPack.delayGain;
      input.connect(fader);
      fader.connect(this.musicBus);
      input.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(fader);
      delayGain.connect(delay);
      return { input, fader, delay, delayGain };
    }

    fadeOutTrack(bus, duration) {
      if (!bus || !this.ctx) return;
      const now = this.ctx.currentTime;
      const fade = Math.max(0.02, duration || 0.2);
      const g = bus.fader.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.0001, now + fade);
      setTimeout(() => {
        try {
          bus.input.disconnect();
          bus.fader.disconnect();
          bus.delay.disconnect();
          bus.delayGain.disconnect();
        } catch (e) { /* already disconnected */ }
      }, fade * 1000 + 120);
    }

    stopMusic(fade) {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      const old = this.trackBusObj;
      this.trackBusObj = null;
      this.trackBus = null;
      this.trackFader = null;
      this.delay = null;
      this.delayGain = null;
      this.trackName = null;
      this.track = null;
      if (old) this.fadeOutTrack(old, fade == null ? 0.22 : fade);
    }

    schedule() {
      if (!this.ctx || !this.track || this.transportPaused) return;
      const now = this.ctx.currentTime;
      if (this.nextTime < now - 0.05) this.nextTime = now + 0.05;
      const horizon = now + 0.14;
      while (this.nextTime < horizon) {
        this.playStep(this.step, this.nextTime);
        this.nextTime += this.stepDur;
        this.step = (this.step + 1) % LOOP_STEPS;
      }
    }

    playStep(step, when) {
      const t = this.track;
      const sectionIndex = Math.floor(step / STEPS_PER_SECTION) % ARRANGEMENT.length;
      const section = ARRANGEMENT[sectionIndex];
      const s = step % STEPS_PER_SECTION;
      const bar = Math.floor((step % 32) / STEPS_PER_SECTION);
      const chord = t.chords[Math.floor(step / 8) % t.chords.length];
      const root = t.root + chord;
      const g = t.gain;
      const intro = step < 8;
      const dp = this.musicPack.drumMul;
      const hp = this.musicPack.hatMul;

      // Bass: A/B alternate every other section, C drops to a half-time pulse.
      if (section !== 'C' || s % 8 === 0) {
        let bassOffset = t.bass[s];
        if (bassOffset !== null && bassOffset !== undefined) {
          if (section === 'B' && s >= 8) bassOffset += 12;
          const bassGain = 0.09 * g * (section === 'B' ? 0.82 : 1);
          this.bass(midi(root + bassOffset - 12), when, this.stepDur * (section === 'C' ? 2.4 : 1.35), bassGain);
        }
      }

      // Pad: C is a long breathing chord; A/B keep the original half-bar stabs.
      if (s === 0 || (section !== 'C' && s === 8)) {
        const padNotes = section === 'C' ? [0, 7, 12] : [0, 3, 7];
        const padDur = this.stepDur * (section === 'C' ? 14 : 6.5);
        const padGain = 0.017 * g * (section === 'C' ? 1.25 : 1);
        this.pad(padNotes.map(n => midi(t.root + chord + n + 12)), when, padDur, padGain);
      }

      // Lead: enters after the first two beats; B lifts the second half; C rests.
      if (!intro && section !== 'C') {
        const leadOffset = t.lead[s];
        if (leadOffset !== null && leadOffset !== undefined) {
          let octave = 0;
          if (section === 'B' && s >= 8) octave = 12;
          else if (section === 'A' && bar === 1 && s >= 12) octave = 12;
          const leadGain = 0.044 * g * (section === 'B' ? 0.9 : 1);
          this.lead(midi(t.root + chord + leadOffset + octave), when, this.stepDur * 1.4, leadGain);
        }
      }

      // Drums.
      if (section === 'C') {
        if (s === 0 || s === 8) this.kick(when, 0.14 * g * dp);
        if (s === 4) this.snare(when, 0.045 * g * dp, 0.9);
        if (s % 4 === 0) this.hat(when, 0.018 * g * t.hat * hp);
      } else {
        if (s === 0 || s === 4 || s === 8 || s === 12) this.kick(when, 0.17 * g * dp);
        if (section === 'B' && (s === 10 || s === 14)) this.kick(when, 0.09 * g * dp);
        if (s === 4 || s === 12) this.snare(when, 0.09 * g * dp);
        if (s === 7 || s === 15) this.snare(when, 0.035 * g * dp, 1.3);
        if (s % 2 === 0) this.hat(when, 0.024 * g * t.hat * hp);
        if (s === 2 || s === 10) this.hat(when, 0.038 * g * t.hat * hp, 1.25);
        if (section === 'B' && (s === 6 || s === 14)) this.hat(when, 0.03 * g * hp, 1.35);
        if (bar === 1 && s === 15 && Math.random() < 0.6) this.hat(when, 0.025 * g * hp, 1.4);
      }

      // A short tom/snare fill at the end of every other section (2-bar phrase).
      if (sectionIndex % 2 === 1 && s >= 14) {
        const power = (sectionIndex === 3 || sectionIndex === 7) ? 1 : 0.55;
        this.snare(when, (s === 14 ? 0.03 : 0.05) * g * power, 1.05 + (s - 14) * 0.18);
        if (s === 15) this.hat(when, 0.03 * g * power, 1.6);
      }

      // Boss phase layers: extra offbeat hats and a high arpeggio.
      if (this.intensity > 0.02 && section !== 'C') {
        if (s % 2 === 0) this.hat(when, 0.012 * g * this.intensity, 1.8);
        if (s % 4 === 0) {
          const arpNote = root + 24 + (((s / 4) % 2) ? 7 : 0);
          this.arp(midi(arpNote), when, this.stepDur * 0.7, 0.016 * g * this.intensity);
        }
      }
    }

    // ——— instruments ———
    bass(freq, when, dur, gain) {
      const c = this.ctx;
      const o = c.createOscillator();
      const f = c.createBiquadFilter();
      const g = c.createGain();
      o.type = this.musicPack.bassWave;
      o.frequency.setValueAtTime(freq, when);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(520 * this.musicPack.filterMul, when);
      f.frequency.exponentialRampToValueAtTime(160 * this.musicPack.filterMul, when + dur);
      f.Q.value = 4;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(f); f.connect(g); g.connect(this.trackBus || this.musicBus);
      o.start(when); o.stop(when + dur + 0.02);
    }

    lead(freq, when, dur, gain) {
      const c = this.ctx;
      const o = c.createOscillator();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      o.type = this.musicPack.leadWave;
      o.frequency.setValueAtTime(freq, when);
      f.type = 'lowpass'; f.frequency.value = 2800 * this.musicPack.filterMul;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(f); f.connect(g); g.connect(this.trackBus || this.musicBus);
      if (this.delay) g.connect(this.delay);
      o.start(when); o.stop(when + dur + 0.02);
    }

    arp(freq, when, dur, gain) {
      const c = this.ctx;
      const o = c.createOscillator();
      const f = c.createBiquadFilter();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, when);
      f.type = 'lowpass'; f.frequency.value = 4200;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(gain, when + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(f); f.connect(g); g.connect(this.trackBus || this.musicBus);
      o.start(when); o.stop(when + dur + 0.02);
    }

    pad(freqs, when, dur, gain) {
      const c = this.ctx;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(gain, when + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      g.connect(this.trackBus || this.musicBus);
      freqs.forEach((freq, i) => {
        const o = c.createOscillator();
        const f = c.createBiquadFilter();
        o.type = i % 2 ? 'triangle' : this.musicPack.padWave;
        o.frequency.value = freq;
        o.detune.value = i * 7 - 7;
        f.type = 'lowpass'; f.frequency.value = 900 * this.musicPack.filterMul;
        o.connect(f); f.connect(g);
        o.start(when); o.stop(when + dur + 0.03);
      });
    }

    kick(when, gain) {
      const c = this.ctx;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(145, when);
      o.frequency.exponentialRampToValueAtTime(42, when + 0.12);
      g.gain.setValueAtTime(gain, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.17);
      o.connect(g); g.connect(this.trackBus || this.musicBus);
      o.start(when); o.stop(when + 0.2);
    }

    noise(when, dur, gain, type, freq, q, bus) {
      if (bus === this.sfxBus && !this.spendSfx()) return;
      const c = this.ctx;
      const src = c.createBufferSource();
      src.buffer = this.noiseBuffer;
      const f = c.createBiquadFilter();
      const g = c.createGain();
      f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      g.gain.setValueAtTime(gain, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      src.connect(f); f.connect(g); g.connect(bus || this.trackBus || this.musicBus);
      src.start(when); src.stop(when + dur + 0.02);
    }

    snare(when, gain, pitch) {
      this.noise(when, 0.12, gain, 'bandpass', 1800 * (pitch || 1), 0.8);
      const c = this.ctx;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(190, when);
      o.frequency.exponentialRampToValueAtTime(110, when + 0.07);
      g.gain.setValueAtTime(gain * 0.6, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
      o.connect(g); g.connect(this.trackBus || this.musicBus);
      o.start(when); o.stop(when + 0.1);
    }

    hat(when, gain, pitch) {
      this.noise(when, 0.035, gain, 'highpass', 7000 * (pitch || 1), 0.4);
    }

    sweep(from, to, dur, type, gain, when) {
      if (!this.ensure() || !this.spendSfx()) return;
      const c = this.ctx;
      const t = when || c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.sfxBus);
      o.start(t); o.stop(t + dur + 0.02);
    }

    tone(freq, dur, type, gain, slideTo) {
      if (!this.ensure() || !this.spendSfx()) return;
      const c = this.ctx;
      const t = c.currentTime;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.sfxBus);
      o.start(t); o.stop(t + dur + 0.02);
    }

    spendSfx(cost) {
      if (!this.ctx) return true;
      const now = this.ctx.currentTime;
      const elapsed = Math.max(0, now - this.sfxTokenAt);
      this.sfxTokens = Math.min(SFX_BURST, this.sfxTokens + elapsed * SFX_REFILL);
      this.sfxTokenAt = now;
      if (this.sfxTokens < (cost || 1)) return false;
      this.sfxTokens -= (cost || 1);
      return true;
    }

    cooldown(name, ms) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (now - (this.lastSfxAt[name] || 0) < ms) return false;
      this.lastSfxAt[name] = now;
      return true;
    }

    phaseStinger() {
      if (!this.ensure()) return;
      this.duckMusic(0.45, 0.55);
      const t = this.ctx.currentTime;
      this.noise(t, 0.55, 0.24, 'lowpass', 650, 0.6, this.sfxBus);
      this.sweep(90, 420, 0.5, 'sawtooth', 0.14);
      this.tone(110, 0.5, 'triangle', 0.1, 55);
    }

    // ——— game SFX ———
    punch(heavy) {
      if (!this.ensure()) return;
      const now = this.ctx.currentTime;
      if (now - this.lastHitAt < 0.025) return;
      this.lastHitAt = now;
      const jitter = 0.94 + Math.random() * 0.12;
      const variation = 0.92 + Math.random() * 0.16;
      this.noise(now, heavy ? 0.11 : 0.07, (heavy ? 0.24 : 0.16) * variation, 'lowpass', (heavy ? 900 : 1500) * jitter, 0.8, this.sfxBus);
      this.sweep((heavy ? 160 : 210) * jitter, 55, heavy ? 0.12 : 0.07, 'triangle', (heavy ? 0.24 : 0.14) * variation);
      if (heavy) this.tone(58, 0.14, 'sine', 0.09 * variation, 34);
    }
    kick() { this.punch(true); }
    hurt() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      const jitter = 0.94 + Math.random() * 0.12;
      this.sweep(180 * jitter, 70, 0.16, 'sawtooth', 0.16);
      this.noise(t, 0.12, 0.18, 'lowpass', 700 * jitter, 0.6, this.sfxBus);
    }
    jump() { this.sweep(260, 620, 0.16, 'square', 0.08); }
    land() { this.sweep(120, 50, 0.09, 'triangle', 0.1); }
    whoosh() {
      if (!this.ensure() || !this.cooldown('whoosh', 35)) return;
      const jitter = 0.85 + Math.random() * 0.3;
      this.noise(this.ctx.currentTime, 0.13 + Math.random() * 0.05, 0.09, 'bandpass', 900 * jitter, 2.5, this.sfxBus);
    }
    special() {
      if (!this.ensure() || !this.cooldown('special', 100)) return;
      this.duckMusic(0.35, 0.34);
      this.sweep(80, 780, 0.42, 'sawtooth', 0.18);
      this.noise(this.ctx.currentTime, 0.45, 0.2, 'bandpass', 600, 1.2, this.sfxBus);
      this.tone(440, 0.35, 'square', 0.06, 880);
    }
    knife() {
      if (!this.ensure() || !this.cooldown('knife', 35)) return;
      const jitter = 0.9 + Math.random() * 0.2;
      this.noise(this.ctx.currentTime, 0.09, 0.08, 'highpass', 1800 * jitter, 0.8, this.sfxBus);
      this.sweep(1400 * jitter, 380, 0.1, 'sawtooth', 0.07);
    }
    gunshot() {
      if (!this.ensure() || !this.cooldown('gunshot', 45)) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.16, 0.32, 'lowpass', 1700, 0.6, this.sfxBus);
      this.sweep(190, 42, 0.16, 'square', 0.22);
      this.noise(t + 0.02, 0.08, 0.1, 'highpass', 3200, 0.4, this.sfxBus);
    }
    mg() {
      if (!this.ensure() || !this.cooldown('mg', 55)) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.09, 0.2, 'lowpass', 2200, 0.6, this.sfxBus);
      this.sweep(240, 70, 0.08, 'square', 0.11);
      this.noise(t + 0.01, 0.05, 0.06, 'highpass', 3600, 0.5, this.sfxBus);
    }
    trigger() {
      if (!this.ensure() || !this.cooldown('trigger', 50)) return;
      this.tone(880, 0.035, 'square', 0.05, 520);
    }
    whipCrack() {
      if (!this.ensure() || !this.cooldown('whip', 45)) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.06, 0.13, 'bandpass', 2900, 1.2, this.sfxBus);
      this.sweep(620, 160, 0.07, 'sawtooth', 0.08);
    }
    dash() {
      if (!this.ensure() || !this.cooldown('dash', 80)) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.2, 0.12, 'bandpass', 680, 1.4, this.sfxBus);
      this.sweep(190, 480, 0.2, 'sawtooth', 0.09);
    }
    dashStrike() {
      if (!this.ensure() || !this.cooldown('dashStrike', 100)) return;
      this.duckMusic(0.15, 0.2);
      const t = this.ctx.currentTime;
      this.noise(t, 0.24, 0.2, 'bandpass', 1200, 1.2, this.sfxBus);
      this.sweep(260, 900, 0.22, 'square', 0.12);
      this.tone(1100, 0.12, 'triangle', 0.06, 1500);
    }
    dashHit() {
      if (!this.ensure() || !this.cooldown('dashHit', 50)) return;
      this.duckMusic(0.2, 0.24);
      const t = this.ctx.currentTime;
      this.noise(t, 0.16, 0.3, 'lowpass', 1200, 0.6, this.sfxBus);
      this.sweep(170, 48, 0.2, 'triangle', 0.24);
      this.tone(880, 0.08, 'square', 0.06, 440);
    }
    flameBurst(soft) {
      if (!this.ensure() || !this.cooldown('flame', 45)) return;
      this.duckMusic(0.12, 0.2);
      const t = this.ctx.currentTime;
      this.noise(t, soft ? 0.18 : 0.3, soft ? 0.14 : 0.28, 'lowpass', 1100, 0.7, this.sfxBus);
      this.noise(t + 0.02, 0.24, soft ? 0.07 : 0.12, 'bandpass', 1900, 1.3, this.sfxBus);
      this.sweep(soft ? 320 : 240, 62, 0.24, 'sawtooth', soft ? 0.07 : 0.11);
      this.tone(120, 0.2, 'triangle', 0.07, 58);
    }
    thunder(soft) {
      if (!this.ensure() || !this.cooldown('thunder', 55)) return;
      this.duckMusic(0.25, 0.3);
      const t = this.ctx.currentTime;
      this.noise(t, soft ? 0.2 : 0.32, soft ? 0.18 : 0.3, 'highpass', 2600, 0.7, this.sfxBus);
      this.noise(t + 0.01, 0.16, 0.16, 'bandpass', 4200, 1.4, this.sfxBus);
      this.sweep(1100, 90, 0.22, 'square', soft ? 0.07 : 0.12);
      this.tone(70, 0.26, 'triangle', soft ? 0.06 : 0.1, 34);
    }
    quake(soft) {
      if (!this.ensure() || !this.cooldown('quake', 70)) return;
      this.duckMusic(0.3, 0.4);
      const t = this.ctx.currentTime;
      this.sweep(95, 28, 0.38, 'sawtooth', soft ? 0.12 : 0.2);
      this.noise(t, soft ? 0.3 : 0.46, soft ? 0.16 : 0.27, 'lowpass', 430, 0.6, this.sfxBus);
      this.tone(58, 0.4, 'sine', soft ? 0.07 : 0.12, 30);
    }
    pickup() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      [660, 880, 1320].forEach((f, i) => this.sweep(f, f * 1.01, 0.08, 'square', 0.09, t + i * 0.06));
    }
    coin() {
      if (!this.ensure() || !this.cooldown('coin', 40)) return;
      const t = this.ctx.currentTime;
      this.sweep(1046, 1046, 0.07, 'square', 0.09, t);
      this.sweep(1568, 1568, 0.16, 'square', 0.08, t + 0.07);
    }
    heal() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      [523, 659, 784, 1046].forEach((f, i) => this.sweep(f, f, 0.12, 'triangle', 0.1, t + i * 0.07));
    }
    break() {
      if (!this.ensure() || !this.cooldown('break', 60)) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.3, 0.3, 'lowpass', 1400, 0.6, this.sfxBus);
      this.sweep(220, 40, 0.28, 'sawtooth', 0.12);
    }
    throw() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.22, 0.16, 'bandpass', 500, 1.8, this.sfxBus);
      this.sweep(300, 80, 0.3, 'triangle', 0.12);
    }
    ko() {
      if (!this.ensure()) return;
      this.duckMusic(0.2, 0.3);
      const t = this.ctx.currentTime;
      this.sweep(120, 35, 0.6, 'sawtooth', 0.2);
      this.noise(t, 0.5, 0.22, 'lowpass', 500, 0.5, this.sfxBus);
    }
    menu() {
      if (!this.ensure() || !this.cooldown('menu', 20)) return;
      this.tone(540, 0.06, 'square', 0.08, 660);
    }
    select() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.sweep(440, 440, 0.08, 'square', 0.09, t);
      this.sweep(660, 660, 0.1, 'square', 0.09, t + 0.08);
      this.sweep(880, 880, 0.16, 'square', 0.08, t + 0.17);
    }
    start() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      [220, 330, 440, 660].forEach((f, i) => this.sweep(f, f, 0.14, 'sawtooth', 0.1, t + i * 0.09));
    }
    warning() {
      if (!this.ensure() || !this.cooldown('warning', 180)) return;
      this.duckMusic(0.25, 0.45);
      const t = this.ctx.currentTime;
      this.sweep(180, 140, 0.28, 'sawtooth', 0.12, t);
      this.sweep(180, 140, 0.28, 'sawtooth', 0.12, t + 0.36);
    }
    bossDown() {
      if (!this.ensure()) return;
      this.duckMusic(0.5, 0.7);
      const t = this.ctx.currentTime;
      this.noise(t, 1.0, 0.32, 'lowpass', 800, 0.7, this.sfxBus);
      [523, 440, 349, 262].forEach((f, i) => this.sweep(f, f * 0.98, 0.36, 'sawtooth', 0.1, t + 0.25 + i * 0.2));
    }
    victory() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      [262, 330, 392, 523, 659, 784].forEach((f, i) => this.sweep(f, f, 0.2, 'square', 0.09, t + i * 0.12));
    }
    gameover() {
      if (!this.ensure()) return;
      this.duckMusic(0.4, 0.8);
      const t = this.ctx.currentTime;
      [220, 196, 175, 131].forEach((f, i) => this.sweep(f, f * 0.97, 0.34, 'triangle', 0.12, t + i * 0.23));
    }
  }

  window.Sound = new SoundSystem();
})();
