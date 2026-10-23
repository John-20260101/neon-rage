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
      this.musicBus = null;
      this.sfxBus = null;
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
      this.volume = 0.58;
      this.lastHitAt = 0;
      this.stepDur = 0;
      this.musicPackKey = 'classic';
      this.musicPack = MUSIC_PACKS.classic;
    }

    setMusicPack(key) {
      if (!MUSIC_PACKS[key]) return false;
      this.musicPackKey = key;
      this.musicPack = MUSIC_PACKS[key];
      if (this.delayGain && this.ctx) this.delayGain.gain.value = this.musicPack.delayGain;
      const current = this.trackName;
      if (current) {
        this.stopMusic();
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
        this.master.connect(this.ctx.destination);

        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 0.42;
        this.musicBus.connect(this.master);

        this.sfxBus = this.ctx.createGain();
        this.sfxBus.gain.value = 0.62;
        this.sfxBus.connect(this.master);

        this.delay = this.ctx.createDelay(0.6);
        this.delay.delayTime.value = 0.22;
        this.delayGain = this.ctx.createGain();
        this.delayGain.gain.value = this.musicPack.delayGain;
        this.delay.connect(this.delayGain);
        this.delayGain.connect(this.master);
        this.delayGain.connect(this.delay);

        const len = Math.floor(this.ctx.sampleRate * 1.2);
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }

    setMuted(muted) {
      this.muted = muted;
      if (this.master && this.ctx) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime + 0.08);
      }
    }

    setPaused(paused) {
      this.paused = paused;
      if (this.musicBus && this.ctx) {
        this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
        this.musicBus.gain.linearRampToValueAtTime(paused ? 0.06 : 0.42, this.ctx.currentTime + 0.12);
      }
    }

    playTrack(name) {
      if (!this.ensure()) return;
      if (!TRACKS[name]) return;
      if (this.trackName === name && this.timer) return;
      this.stopMusic();
      this.trackName = name;
      this.track = applyMusicPack(TRACKS[name], this.musicPack);
      this.step = 0;
      this.nextTime = this.ctx.currentTime + 0.08;
      this.stepDur = 60 / this.track.bpm / 4;
      this.timer = setInterval(() => this.schedule(), 25);
      this.schedule();
    }

    stopMusic() {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      this.trackName = null;
      this.track = null;
    }

    schedule() {
      if (!this.ctx || !this.track) return;
      const horizon = this.ctx.currentTime + 0.12;
      while (this.nextTime < horizon) {
        this.playStep(this.step, this.nextTime);
        this.nextTime += this.stepDur;
        this.step = (this.step + 1) % 32;
      }
    }

    playStep(step, when) {
      const t = this.track;
      const chord = t.chords[Math.floor(step / 8) % t.chords.length];
      const root = t.root + chord;
      const g = t.gain;
      const s = step % 16;
      const half = Math.floor(step / 16);

      // bass on 8ths
      const bassOffset = t.bass[s];
      if (bassOffset !== null && bassOffset !== undefined) {
        this.bass(midi(root + bassOffset + (half ? 0 : 0) - 12), when, this.stepDur * 1.35, 0.09 * g);
      }

      // chord / pad at phrase boundaries
      if (s === 0 || s === 8) {
        this.pad([0, 3, 7].map(n => midi(t.root + chord + n + 12)), when, this.stepDur * 6.5, 0.017 * g);
      }

      // lead
      const leadOffset = t.lead[s];
      if (leadOffset !== null && leadOffset !== undefined) {
        const octave = half ? 0 : 0;
        this.lead(midi(t.root + chord + leadOffset + octave), when, this.stepDur * 1.4, 0.044 * g);
      }

      // drums
      const dp = this.musicPack.drumMul;
      const hp = this.musicPack.hatMul;
      if (s === 0 || s === 4 || s === 8 || s === 12) this.kick(when, 0.17 * g * dp);
      if (s === 14 && half === 1) this.kick(when, 0.12 * g * dp);
      if (s === 4 || s === 12) this.snare(when, 0.09 * g * dp);
      if (s === 7 || s === 15) this.snare(when, 0.035 * g * dp, 1.3);
      if (s % 2 === 0) this.hat(when, 0.024 * g * t.hat * hp);
      if (s === 2 || s === 10) this.hat(when, 0.038 * g * t.hat * hp, 1.25);
      if (half === 1 && s === 15 && Math.random() < 0.6) this.hat(when, 0.025 * g * hp, 1.4);
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
      o.connect(f); f.connect(g); g.connect(this.musicBus);
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
      o.connect(f); f.connect(g); g.connect(this.musicBus);
      if (this.delay) g.connect(this.delay);
      o.start(when); o.stop(when + dur + 0.02);
    }

    pad(freqs, when, dur, gain) {
      const c = this.ctx;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(gain, when + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      g.connect(this.musicBus);
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
      o.connect(g); g.connect(this.musicBus);
      o.start(when); o.stop(when + 0.2);
    }

    noise(when, dur, gain, type, freq, q, bus) {
      const c = this.ctx;
      const src = c.createBufferSource();
      src.buffer = this.noiseBuffer;
      const f = c.createBiquadFilter();
      const g = c.createGain();
      f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      g.gain.setValueAtTime(gain, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      src.connect(f); f.connect(g); g.connect(bus || this.musicBus);
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
      o.connect(g); g.connect(this.musicBus);
      o.start(when); o.stop(when + 0.1);
    }

    hat(when, gain, pitch) {
      this.noise(when, 0.035, gain, 'highpass', 7000 * (pitch || 1), 0.4);
    }

    sweep(from, to, dur, type, gain, when) {
      if (!this.ensure()) return;
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
      if (!this.ensure()) return;
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

    // ——— game SFX ———
    punch(heavy) {
      if (!this.ensure()) return;
      const now = this.ctx.currentTime;
      if (now - this.lastHitAt < 0.025) return;
      this.lastHitAt = now;
      this.noise(now, heavy ? 0.11 : 0.07, heavy ? 0.24 : 0.16, 'lowpass', heavy ? 900 : 1500, 0.8, this.sfxBus);
      this.sweep(heavy ? 160 : 210, 55, heavy ? 0.12 : 0.07, 'triangle', heavy ? 0.24 : 0.14);
    }
    kick() { this.punch(true); }
    hurt() {
      this.sweep(180, 70, 0.16, 'sawtooth', 0.16);
      this.noise(this.ctx ? this.ctx.currentTime : 0, 0.12, 0.18, 'lowpass', 700, 0.6, this.sfxBus);
    }
    jump() { this.sweep(260, 620, 0.16, 'square', 0.08); }
    land() { this.sweep(120, 50, 0.09, 'triangle', 0.1); }
    whoosh() {
      if (!this.ensure()) return;
      this.noise(this.ctx.currentTime, 0.16, 0.09, 'bandpass', 900, 2.5, this.sfxBus);
    }
    special() {
      if (!this.ensure()) return;
      this.sweep(80, 780, 0.42, 'sawtooth', 0.18);
      this.noise(this.ctx.currentTime, 0.45, 0.2, 'bandpass', 600, 1.2, this.sfxBus);
      this.tone(440, 0.35, 'square', 0.06, 880);
    }
    knife() {
      if (!this.ensure()) return;
      this.noise(this.ctx.currentTime, 0.09, 0.08, 'highpass', 1800, 0.8, this.sfxBus);
      this.sweep(1400, 380, 0.1, 'sawtooth', 0.07);
    }
    gunshot() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.16, 0.32, 'lowpass', 1700, 0.6, this.sfxBus);
      this.sweep(190, 42, 0.16, 'square', 0.22);
      this.noise(t + 0.02, 0.08, 0.1, 'highpass', 3200, 0.4, this.sfxBus);
    }
    mg() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.09, 0.2, 'lowpass', 2200, 0.6, this.sfxBus);
      this.sweep(240, 70, 0.08, 'square', 0.11);
      this.noise(t + 0.01, 0.05, 0.06, 'highpass', 3600, 0.5, this.sfxBus);
    }
    trigger() {
      if (!this.ensure()) return;
      this.tone(880, 0.035, 'square', 0.05, 520);
    }
    whipCrack() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.06, 0.13, 'bandpass', 2900, 1.2, this.sfxBus);
      this.sweep(620, 160, 0.07, 'sawtooth', 0.08);
    }
    dash() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.2, 0.12, 'bandpass', 680, 1.4, this.sfxBus);
      this.sweep(190, 480, 0.2, 'sawtooth', 0.09);
    }
    dashStrike() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.24, 0.2, 'bandpass', 1200, 1.2, this.sfxBus);
      this.sweep(260, 900, 0.22, 'square', 0.12);
      this.tone(1100, 0.12, 'triangle', 0.06, 1500);
    }
    dashHit() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.16, 0.3, 'lowpass', 1200, 0.6, this.sfxBus);
      this.sweep(170, 48, 0.2, 'triangle', 0.24);
      this.tone(880, 0.08, 'square', 0.06, 440);
    }
    flameBurst(soft) {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, soft ? 0.18 : 0.3, soft ? 0.14 : 0.28, 'lowpass', 1100, 0.7, this.sfxBus);
      this.noise(t + 0.02, 0.24, soft ? 0.07 : 0.12, 'bandpass', 1900, 1.3, this.sfxBus);
      this.sweep(soft ? 320 : 240, 62, 0.24, 'sawtooth', soft ? 0.07 : 0.11);
      this.tone(120, 0.2, 'triangle', 0.07, 58);
    }
    thunder(soft) {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, soft ? 0.2 : 0.32, soft ? 0.18 : 0.3, 'highpass', 2600, 0.7, this.sfxBus);
      this.noise(t + 0.01, 0.16, 0.16, 'bandpass', 4200, 1.4, this.sfxBus);
      this.sweep(1100, 90, 0.22, 'square', soft ? 0.07 : 0.12);
      this.tone(70, 0.26, 'triangle', soft ? 0.06 : 0.1, 34);
    }
    quake(soft) {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.sweep(95, 28, 0.38, 'sawtooth', soft ? 0.12 : 0.2);
      this.noise(t, soft ? 0.3 : 0.46, soft ? 0.16 : 0.27, 'lowpass', 430, 0.6, this.sfxBus);
      this.tone(58, 0.4, 'sine', soft ? 0.07 : 0.12, 30);
    }
    pickup() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      [660, 880, 1320].forEach((f, i) => this.sweep(f, f * 1.01, 0.08, 'square', 0.09, t + i * 0.06));
    }
    coin() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      this.sweep(1046, 1046, 0.07, 'square', 0.09, t);
      this.sweep(1568, 1568, 0.16, 'square', 0.08, t + 0.07);
    }
    heal() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      [523, 659, 784, 1046].forEach((f, i) => this.sweep(f, f, 0.12, 'triangle', 0.1, t + i * 0.07));
    }
    break() {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime;
      this.noise(t, 0.3, 0.3, 'lowpass', 1400, 0.6, this.sfxBus);
      this.sweep(220, 40, 0.28, 'sawtooth', 0.12);
    }
    throw() {
      this.noise(this.ctx ? this.ctx.currentTime : 0, 0.22, 0.16, 'bandpass', 500, 1.8, this.sfxBus);
      this.sweep(300, 80, 0.3, 'triangle', 0.12);
    }
    ko() {
      this.sweep(120, 35, 0.6, 'sawtooth', 0.2);
      this.noise(this.ctx ? this.ctx.currentTime : 0, 0.5, 0.22, 'lowpass', 500, 0.5, this.sfxBus);
    }
    menu() { this.tone(540, 0.06, 'square', 0.08, 660); }
    select() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      this.sweep(440, 440, 0.08, 'square', 0.09, t);
      this.sweep(660, 660, 0.1, 'square', 0.09, t + 0.08);
      this.sweep(880, 880, 0.16, 'square', 0.08, t + 0.17);
    }
    start() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      [220, 330, 440, 660].forEach((f, i) => this.sweep(f, f, 0.14, 'sawtooth', 0.1, t + i * 0.09));
    }
    warning() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      this.sweep(180, 140, 0.28, 'sawtooth', 0.12, t);
      this.sweep(180, 140, 0.28, 'sawtooth', 0.12, t + 0.36);
    }
    bossDown() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      this.noise(t, 1.0, 0.32, 'lowpass', 800, 0.7, this.sfxBus);
      [523, 440, 349, 262].forEach((f, i) => this.sweep(f, f * 0.98, 0.36, 'sawtooth', 0.1, t + 0.25 + i * 0.2));
    }
    victory() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      [262, 330, 392, 523, 659, 784].forEach((f, i) => this.sweep(f, f, 0.2, 'square', 0.09, t + i * 0.12));
    }
    gameover() {
      const t = this.ctx ? this.ctx.currentTime : 0;
      [220, 196, 175, 131].forEach((f, i) => this.sweep(f, f * 0.97, 0.34, 'triangle', 0.12, t + i * 0.23));
    }
  }

  window.Sound = new SoundSystem();
})();
