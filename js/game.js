/* NEON RAGE — game logic */
(function () {
  'use strict';

  const W = 480, H = 270;
  const FLOOR_TOP = 196;
  const FLOOR_BOTTOM = 252;
  const GRAVITY = 620;
  const STEP = 1 / 60;

  const $ = (id) => document.getElementById(id);

  const dom = {
    screen: $('screen'),
    canvas: $('game'),
    hud: $('hud'),
    hudPortrait: $('hud-portrait'),
    hudName: $('hud-name'),
    hudLives: $('hud-lives'),
    hpFill: $('hp-fill'),
    hpGhost: $('hp-ghost'),
    hpMeter: document.querySelector('.hp-meter'),
    hudWeapon: $('hud-weapon'),
    hudSpecial: $('hud-special'),
    hudStage: $('hud-stage'),
    hudGoal: $('hud-goal'),
    hudScore: $('hud-score'),
    hudCombo: $('hud-combo'),
    hudComboWrap: document.querySelector('.hud-combo'),
    bossUI: $('boss-ui'),
    bossName: $('boss-name'),
    bossFill: $('boss-fill'),
    bossRow2: $('boss-row-2'),
    bossName2: $('boss-name-2'),
    bossFill2: $('boss-fill-2'),
    title: $('title-screen'),
    select: $('select-screen'),
    stageCard: $('stage-card'),
    stageNum: $('stage-num'),
    stageTitle: $('stage-title'),
    stageCn: $('stage-cn'),
    stageDesc: $('stage-desc'),
    pause: $('pause-screen'),
    result: $('result-screen'),
    resultKicker: $('result-kicker'),
    resultGrade: $('result-grade'),
    resultTitle: $('result-title'),
    resultCopy: $('result-copy'),
    resultScore: $('result-score'),
    resultTime: $('result-time'),
    resultCombo: $('result-combo'),
    resultHits: $('result-hits'),
    btnNext: $('btn-next'),
    gameover: $('gameover-screen'),
    gameoverScore: $('gameover-score'),
    gameoverStage: $('gameover-stage'),
    toast: $('toast'),
    damageFlash: $('damage-flash'),
    touch: $('touch-controls'),
    rotate: $('rotate-hint'),
    soundBtn: $('btn-sound'),
    charGrid: $('char-grid'),
    btnStart: $('btn-start'),
    btnConfirm: $('btn-select-confirm'),
    btnSelectBack: $('btn-select-back'),
    btnResume: $('btn-resume'),
    btnRestart: $('btn-restart'),
    btnQuit: $('btn-quit'),
    btnResultTitle: $('btn-result-title'),
    btnRetry: $('btn-retry'),
    btnGameoverTitle: $('btn-gameover-title'),
    btnFullscreen: $('btn-fullscreen'),
    btnTouchPause: $('btn-touch-pause'),
    btnSound: $('btn-sound'),
    titleBest: $('title-best')
  };
  const ctx = dom.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const PLAYER_STATS = {
    rex: {
      name: 'REX', cn: '雷克斯', hp: 112, speed: 80, runSpeed: 154, power: 1, jump: 188, specialCost: 7,
      combo: [
        { startup: .062, active: .075, recovery: .115, damage: 4, range: 30, kb: 26, pose: 'punch1' },
        { startup: .058, active: .08, recovery: .135, damage: 5, range: 31, kb: 38, pose: 'punch2' },
        { startup: .10, active: .105, recovery: .235, damage: 8, range: 35, kb: 105, knockdown: true, pose: 'kick' }
      ],
      jumpKick: 8, special: 13,
      dash: {
        name: '崩拳突进', en: 'RUSH FIST', startup: .055, active: .13, recovery: .24,
        damage: 13, range: 43, kb: 135, knockdown: true, pose: 'punch1', speed: 205, duration: .2, fx: 'fire'
      }
    },
    luna: {
      name: 'LUNA', cn: '露娜', hp: 92, speed: 93, runSpeed: 172, power: .9, jump: 214, specialCost: 6,
      combo: [
        { startup: .052, active: .065, recovery: .085, damage: 3, range: 29, kb: 20, pose: 'punch1' },
        { startup: .05, active: .07, recovery: .10, damage: 4, range: 30, kb: 32, pose: 'punch2' },
        { startup: .085, active: .095, recovery: .19, damage: 7, range: 34, kb: 92, knockdown: true, pose: 'kick' }
      ],
      jumpKick: 7, special: 11,
      dash: {
        name: '流光踢', en: 'LIGHTNING KICK', startup: .045, active: .14, recovery: .21,
        damage: 11, range: 41, kb: 115, knockdown: true, pose: 'kick', speed: 240, duration: .19, fx: 'bolt'
      }
    },
    bruno: {
      name: 'BRUNO', cn: '布鲁诺', hp: 138, speed: 64, runSpeed: 132, power: 1.28, jump: 160, specialCost: 9,
      combo: [
        { startup: .085, active: .09, recovery: .16, damage: 6, range: 32, kb: 38, pose: 'punch1' },
        { startup: .082, active: .09, recovery: .18, damage: 7, range: 33, kb: 50, pose: 'punch2' },
        { startup: .13, active: .12, recovery: .30, damage: 11, range: 37, kb: 130, knockdown: true, pose: 'kick' }
      ],
      jumpKick: 10, special: 17,
      dash: {
        name: '蛮牛冲撞', en: 'BULL RUSH', startup: .07, active: .14, recovery: .28,
        damage: 18, range: 45, kb: 175, knockdown: true, pose: 'punch2', speed: 175, duration: .22, fx: 'smoke'
      }
    }
  };

  const WEAPONS = {
    pipe: {
      key: 'pipe', name: 'PIPE', cn: '钢管', type: 'melee',
      startup: .14, active: .12, recovery: .27, damage: 10, range: 41,
      kb: 85, knockdown: true, pose: 'punch2', dur: 12, step: 24
    },
    knife: {
      key: 'knife', name: 'KNIFE', cn: '小刀', type: 'melee',
      startup: .06, active: .075, recovery: .14, damage: 7, range: 34,
      kb: 24, knockdown: false, pose: 'punch1', dur: 10, step: 34, sound: 'knife'
    },
    pistol: {
      key: 'pistol', name: 'PISTOL', cn: '手枪', type: 'ranged',
      startup: .12, active: .04, recovery: .30, damage: 16, range: 280,
      ammo: 6, pose: 'punch1', step: 0
    }
  };

  const ENEMY_DATA = {
    punk: {
      name: 'PUNK', cn: '混混', hp: 25, speed: 29, damage: 6, range: 27, score: 130,
      scale: 1, coolMin: .85, coolMax: 1.55, hitbox: 12
    },
    blade: {
      name: 'BLADE', cn: '刀锋', hp: 21, speed: 45, damage: 7, range: 30, score: 170,
      scale: .98, coolMin: .7, coolMax: 1.25, hitbox: 11
    },
    brute: {
      name: 'BRUTE', cn: '重拳', hp: 64, speed: 20, damage: 13, range: 33, score: 330,
      scale: 1.08, coolMin: 1.4, coolMax: 2.2, armor: true, hitbox: 16
    },
    kicker: {
      name: 'KICKER', cn: '踢手', hp: 28, speed: 38, damage: 8, range: 28, score: 200,
      scale: .99, coolMin: .85, coolMax: 1.4, hitbox: 11
    },
    boxer: {
      name: 'BOXER', cn: '拳手', hp: 34, speed: 46, damage: 4.5, range: 30, score: 240,
      scale: 1.0, coolMin: .7, coolMax: 1.25, hitbox: 12, dodge: true
    },
    whip: {
      name: 'LASH', cn: '鞭手', hp: 30, speed: 36, damage: 7, range: 68, score: 280,
      scale: 1.0, coolMin: 1.1, coolMax: 1.8, hitbox: 11, keepDist: 48
    },
    gunner: {
      name: 'GUNNER', cn: '枪手', hp: 26, speed: 34, damage: 8, range: 190, score: 300,
      scale: 1.0, coolMin: 1.4, coolMax: 2.2, hitbox: 11, keepDist: 105, ranged: true
    },
    siren: {
      name: 'SIREN', cn: '塞壬', hp: 32, speed: 50, damage: 7, range: 46, score: 260,
      scale: .99, coolMin: .7, coolMax: 1.25, hitbox: 11, leap: true
    },
    viper: {
      name: 'VIPER', cn: '蝰蛇', hp: 27, speed: 42, damage: 6.5, range: 160, score: 290,
      scale: 1.0, coolMin: 1.0, coolMax: 1.7, hitbox: 11, keepDist: 92, ranged: true
    },
    razor: {
      name: 'RAZOR', cn: '剃刀', hp: 215, speed: 48, damage: 11, range: 38, score: 2800,
      scale: 1.12, coolMin: .55, coolMax: 1.1, boss: true, hitbox: 15, attackRange: 72
    },
    titan: {
      name: 'TITAN', cn: '泰坦', hp: 305, speed: 29, damage: 16, range: 39, score: 3800,
      scale: 1.2, coolMin: .8, coolMax: 1.45, boss: true, armor: true, hitbox: 18, attackRange: 86
    },
    vector: {
      name: 'VECTOR', cn: '维克托', hp: 365, speed: 54, damage: 14, range: 35, score: 5400,
      scale: 1.13, coolMin: .45, coolMax: .95, boss: true, hitbox: 15, attackRange: 132
    },
    raven: {
      name: 'RAVEN', cn: '渡鸦', hp: 230, speed: 62, damage: 9, range: 36, score: 3200,
      scale: 1.03, coolMin: .5, coolMax: .95, boss: true, hitbox: 13, dodge: true, agile: true, attackRange: 95
    },
    nyx: {
      name: 'NYX', cn: '夜莺', hp: 205, speed: 72, damage: 8, range: 34, score: 3100,
      scale: 1.0, coolMin: .45, coolMax: .9, boss: true, hitbox: 12, dodge: true, agile: true, attackRange: 86
    },
    wrecker: {
      name: 'WRECKER', cn: '摔跤手', hp: 48, speed: 38, damage: 9, range: 28, score: 280,
      scale: .96, coolMin: 1.1, coolMax: 1.8, hitbox: 14, attackRange: 64, grapple: true
    },
    vprime: {
      name: 'V-PRIME', cn: 'V先生·终焉', hp: 620, speed: 44, damage: 10, range: 38, score: 14000,
      scale: 1.15, coolMin: .55, coolMax: 1.0, boss: true, hitbox: 16, keepDist: 150, ranged: true, phases: 3
    }
  };

  const STAGES = [
    {
      number: '01', title: 'DOCKSIDE 9', cn: '第九码头',
      desc: '雨把整座城市洗成霓虹色。今晚，码头不接货，只接拳头。',
      goal: '清空第九码头', worldW: 2460, music: 'stage1', bossMusic: 'boss',
      waves: [
        { at: 300, spawns: [['punk', 210], ['punk', 242]] },
        { at: 760, spawns: [['punk', 204], ['boxer', 238], ['kicker', 218], ['siren', 248]] },
        { at: 1240, spawns: [['whip', 206], ['brute', 236], ['blade', 220], ['punk', 246], ['wrecker', 228]] },
        { at: 1710, spawns: [['boxer', 204], ['whip', 232], ['siren', 222], ['punk', 244], ['brute', 218]] },
        { at: 2070, boss: 'razor', spawns: [['razor', 230]] }
      ],
      props: [
        { type: 'crate', x: 475, y: 242 }, { type: 'barrel', x: 905, y: 224 },
        { type: 'crate', x: 1085, y: 244 }, { type: 'barrel', x: 1490, y: 220 },
        { type: 'crate', x: 1670, y: 244 }, { type: 'crate', x: 1780, y: 208 }
      ],
      pickups: [
        { type: 'burger', x: 640, y: 242 }, { type: 'knife', x: 1130, y: 238 },
        { type: 'moneybag', x: 1600, y: 244 }, { type: 'apple', x: 1860, y: 244 }
      ]
    },
    {
      number: '02', title: 'LINE 07', cn: '七号轻轨',
      desc: '末班车已经停运。站台上等你的，是一整队带刀的人。',
      goal: '夺回七号轻轨', worldW: 2520, music: 'stage2', bossMusic: 'boss',
      waves: [
        { at: 290, spawns: [['blade', 212], ['boxer', 240]] },
        { at: 720, spawns: [['kicker', 204], ['gunner', 238], ['viper', 220]] },
        { at: 1180, spawns: [['brute', 228], ['whip', 206], ['siren', 244], ['punk', 218]] },
        { at: 1630, spawns: [['gunner', 206], ['boxer', 240], ['brute', 220], ['viper', 246], ['wrecker', 214]] },
        { at: 2010, boss: 'titan', spawns: [['titan', 230]] }
      ],
      props: [
        { type: 'barrel', x: 430, y: 238 }, { type: 'crate', x: 970, y: 242 },
        { type: 'barrel', x: 1330, y: 218 }, { type: 'crate', x: 1700, y: 238 },
        { type: 'crate', x: 1760, y: 208 }
      ],
      pickups: [
        { type: 'soda', x: 540, y: 240 }, { type: 'pistol', x: 1250, y: 236 },
        { type: 'gold', x: 1600, y: 244 }, { type: 'burger', x: 1850, y: 242 }
      ]
    },
    {
      number: '03', title: 'V-TOWER ROOF', cn: 'V 塔天台',
      desc: '天快亮了。城市最高的地方，V 先生的影子守在门前。',
      goal: '击溃 V 先生的代理人', worldW: 2500, music: 'stage3', bossMusic: 'boss',
      waves: [
        { at: 280, spawns: [['kicker', 208], ['boxer', 238]] },
        { at: 700, spawns: [['brute', 226], ['gunner', 206], ['viper', 244]] },
        { at: 1130, spawns: [['blade', 204], ['boxer', 238], ['siren', 220], ['punk', 246], ['wrecker', 232]] },
        { at: 1570, spawns: [['brute', 214], ['viper', 242], ['boxer', 226], ['gunner', 246]] },
        { at: 1960, boss: 'vector', spawns: [['vector', 230]] }
      ],
      props: [
        { type: 'crate', x: 500, y: 236 }, { type: 'barrel', x: 1000, y: 218 },
        { type: 'crate', x: 1450, y: 240 }, { type: 'crate', x: 1760, y: 208 }
      ],
      pickups: [
        { type: 'medkit', x: 560, y: 240 }, { type: 'pistol', x: 1190, y: 238 },
        { type: 'gold', x: 1690, y: 242 }, { type: 'knife', x: 1810, y: 242 }
      ]
    },
    {
      number: '04', title: 'NEON GARDEN', cn: '霓虹花园',
      desc: '塔顶的私人会所还在营业。两位女招待，等你跳最后一支舞。',
      goal: '击溃双子守卫', worldW: 2700, music: 'stage4', bossMusic: 'twin',
      waves: [
        { at: 300, spawns: [['punk', 210], ['blade', 242]] },
        { at: 760, spawns: [['siren', 204], ['viper', 238], ['boxer', 218]] },
        { at: 1220, spawns: [['brute', 228], ['whip', 206], ['gunner', 244], ['siren', 220]] },
        { at: 1680, spawns: [['boxer', 204], ['blade', 238], ['viper', 220], ['siren', 246], ['wrecker', 214]] },
        { at: 2140, boss: 'twin', spawns: [['raven', 224, 'left'], ['nyx', 246, 'right']] }
      ],
      props: [
        { type: 'barrel', x: 480, y: 236 }, { type: 'crate', x: 980, y: 242 },
        { type: 'crate', x: 1500, y: 220 }, { type: 'barrel', x: 1960, y: 240 },
        { type: 'crate', x: 2320, y: 208 }
      ],
      pickups: [
        { type: 'medkit', x: 620, y: 240 }, { type: 'pistol', x: 1280, y: 238 },
        { type: 'gold', x: 1760, y: 244 }, { type: 'burger', x: 2020, y: 242 }
      ]
    },
    {
      number: '05', title: 'V-TOWER CORE', cn: 'V 塔核心',
      desc: '电梯停在地下三百层。塔的心脏里，V 先生给自己留了三具身体。',
      goal: '终结 V 先生', worldW: 2600, music: 'stage5', bossMusic: 'final',
      waves: [
        { at: 290, spawns: [['blade', 208], ['boxer', 240]] },
        { at: 700, spawns: [['siren', 204], ['viper', 238], ['gunner', 220]] },
        { at: 1100, spawns: [['brute', 226], ['whip', 206], ['boxer', 244], ['siren', 218]] },
        { at: 1500, spawns: [['siren', 204], ['viper', 242], ['gunner', 222], ['blade', 246], ['wrecker', 232]] },
        { at: 1950, boss: 'final', spawns: [['vprime', 230]] }
      ],
      props: [
        { type: 'crate', x: 460, y: 236 }, { type: 'barrel', x: 900, y: 218 },
        { type: 'barrel', x: 1380, y: 240 }, { type: 'crate', x: 1800, y: 208 },
        { type: 'crate', x: 2080, y: 242 }
      ],
      pickups: [
        { type: 'medkit', x: 560, y: 240 }, { type: 'pistol', x: 1120, y: 238 },
        { type: 'gold', x: 1580, y: 244 }, { type: 'burger', x: 1860, y: 240 },
        { type: 'knife', x: 2150, y: 242 }
      ]
    }
  ];

  const G = {
    mode: 'title',
    time: 0,
    stageIndex: 0,
    stage: null,
    visuals: null,
    titleVisuals: null,
    player: null,
    enemies: [],
    items: [],
    crates: [],
    projectiles: [],
    particles: [],
    floaters: [],
    effects: [],
    camera: { x: 0, shake: 0 },
    score: 0,
    lives: 3,
    combo: 0,
    comboTimer: 0,
    maxCombo: 0,
    hitstop: 0,
    damageFlash: 0,
    flash: 0,
    battle: null,
    waveIndex: 0,
    boss: null,
    boss2: null,
    bossDefeated: false,
    stageClearTimer: 0,
    finishing: false,
    stageTime: 0,
    scoreAtStageStart: 0,
    stats: { hitsTaken: 0 },
    announce: null,
    toastTimer: 0,
    selectedChar: 'rex',
    charKey: 'rex',
    muted: false,
    finalVictory: false,
    introTimer: 0,
    lastMode: 'title'
  };

  const Input = {
    state: Object.create(null),
    just: Object.create(null),
    attackQueue: 0,
    map: {
      ArrowUp: 'up', KeyW: 'up',
      ArrowDown: 'down', KeyS: 'down',
      ArrowLeft: 'left', KeyA: 'left',
      ArrowRight: 'right', KeyD: 'right',
      KeyJ: 'attack', KeyZ: 'attack',
      KeyK: 'jump', KeyX: 'jump',
      KeyL: 'special', KeyC: 'special',
      KeyE: 'grab', KeyV: 'grab',
      Enter: 'confirm', NumpadEnter: 'confirm', Space: 'confirm',
      Escape: 'pause', KeyP: 'pause'
    },
    down(action) { return !!this.state[action]; },
    pressed(action) { return !!this.just[action]; },
    set(action, value) {
      if (!action) return;
      if (value && !this.state[action]) {
        this.just[action] = true;
        if (action === 'attack') this.attackQueue = Math.min(4, this.attackQueue + 1);
      }
      this.state[action] = !!value;
    },
    consumeAttack() {
      if (this.attackQueue > 0) { this.attackQueue--; return true; }
      return false;
    },
    clear() { this.just = Object.create(null); },
    handleKey(e, down) {
      if (e.repeat && down) return;
      const action = this.map[e.code];
      if (!action) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(e.code)) e.preventDefault();
      this.set(action, down);
    }
  };

  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sign = (v) => v < 0 ? -1 : 1;
  const pad = (n, len) => String(Math.max(0, Math.floor(n))).padStart(len, '0');
  const fmtTime = (sec) => `${pad(sec / 60, 2)}:${pad(sec % 60, 2)}`;
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

  function makeEnemyChar(type) {
    const base = Art.CHARS[type] || Art.CHARS.punk;
    const c = { ...base, colors: { ...base.colors } };
    if (type === 'razor') c.accessory = 'shades';
    if (type === 'titan') c.accessory = 'mask';
    if (type === 'vector') c.accessory = 'shades';
    if (type === 'blade') c.accessory = 'earring';
    if (type === 'brute') c.accessory = 'beard';
    return c;
  }

  function shake(amount) { G.camera.shake = Math.max(G.camera.shake, amount); }
  function announce(main, sub, color, duration) {
    G.announce = { main, sub, color: color || '#ffd23f', timer: duration || 1.8, max: duration || 1.8 };
  }
  let toastTimeout = 0;
  function toast(msg, duration) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    G.toastTimer = duration || 2.1;
  }

  function show(el, visible) { el.classList.toggle('is-hidden', !visible); }

  function getBest() {
    try { return parseInt(localStorage.getItem('neonRageBest') || '0', 10) || 0; } catch (_) { return 0; }
  }
  function saveBest() {
    const best = getBest();
    if (G.score > best) {
      try { localStorage.setItem('neonRageBest', String(G.score)); } catch (_) {}
    }
    updateBestLabel();
  }
  function updateBestLabel() {
    if (dom.titleBest) dom.titleBest.textContent = `BEST ${pad(Math.max(G.score, getBest()), 6)}`;
  }
  function clearOverlays() {
    [dom.title, dom.select, dom.stageCard, dom.pause, dom.result, dom.gameover].forEach(el => show(el, false));
  }
  function blurFocus() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function updateHud() {
    const p = G.player;
    if (!p) return;
    const ratio = clamp(p.hp / p.maxHp, 0, 1);
    dom.hpFill.style.transform = `scaleX(${ratio})`;
    dom.hpGhost.style.transform = `scaleX(${clamp(ratio + .06, 0, 1)})`;
    dom.hpMeter.classList.toggle('low', ratio <= .26);
    dom.hudLives.textContent = `×${Math.max(0, G.lives)}`;
    dom.hudScore.textContent = pad(G.score, 6);
    dom.hudCombo.textContent = `×${G.combo}`;
    dom.hudComboWrap.classList.toggle('hot', G.combo >= 8);
    if (!p.weapon) dom.hudWeapon.textContent = 'FISTS';
    else if (p.weapon === 'pistol') dom.hudWeapon.textContent = `PISTOL ${p.ammo}/6`;
    else if (p.weapon === 'knife') dom.hudWeapon.textContent = `KNIFE ${Math.max(0, p.weaponDur)}/10`;
    else dom.hudWeapon.textContent = `PIPE ${Math.max(0, p.weaponDur)}/12`;
    dom.hudSpecial.textContent = `必杀 -${PLAYER_STATS[p.charKey].specialCost} HP`;
    const aliveBosses = [G.boss, G.boss2].filter(b => b && !b.dead);
    if (G.battle) {
      if (G.battle.boss) dom.hudGoal.textContent = aliveBosses.length ? (aliveBosses.length > 1 ? 'TWIN BOSS' : 'BOSS FIGHT') : 'TARGET DOWN';
      else dom.hudGoal.textContent = `ENEMIES ${Math.max(0, G.battle.remaining)}`;
    } else {
      dom.hudGoal.textContent = G.finishing ? 'AREA CLEAR' : G.stage ? G.stage.goal : '';
    }
    if (aliveBosses.length) {
      const b1 = aliveBosses[0];
      const b2 = aliveBosses[1];
      dom.bossFill.style.transform = `scaleX(${clamp(b1.hp / b1.maxHp, 0, 1)})`;
      dom.bossName.textContent = `${b1.def.name} // ${b1.def.cn}${b1.phase ? ` · P${b1.phase}` : ''}`;
      if (b2) {
        dom.bossFill2.style.transform = `scaleX(${clamp(b2.hp / b2.maxHp, 0, 1)})`;
        dom.bossName2.textContent = `${b2.def.name} // ${b2.def.cn}${b2.phase ? ` · P${b2.phase}` : ''}`;
        show(dom.bossRow2, true);
      } else {
        show(dom.bossRow2, false);
      }
      show(dom.bossUI, true);
    } else if (!G.finishing) {
      show(dom.bossUI, false);
    }
  }

  function resetHud() {
    dom.hudName.textContent = PLAYER_STATS[G.charKey].name;
    dom.hudStage.textContent = G.stage ? `STAGE ${G.stage.number}` : 'STAGE 01';
    dom.hudGoal.textContent = G.stage ? G.stage.goal : '';
    const pc = dom.hudPortrait.getContext('2d');
    pc.imageSmoothingEnabled = false;
    Art.drawHudPortrait(pc, dom.hudPortrait.width, dom.hudPortrait.height, G.charKey, G.time);
    updateHud();
  }

  // ————————————————————————————————————————————————
  // STAGE / PLAYER CREATION
  // ————————————————————————————————————————————————
  function createPlayer(charKey, x, y) {
    const st = PLAYER_STATS[charKey];
    return {
      kind: 'player',
      charKey,
      char: Art.CHARS[charKey],
      x, y, z: 0, vx: 0, vy: 0, vz: 0,
      facing: 1,
      anim: 0, state: 'idle', stateTime: 0,
      hp: st.hp, maxHp: st.hp,
      speed: st.speed, power: st.power,
      attack: null, specialHits: null,
      jumpHit: null, weapon: null, weaponDur: 0, ammo: 0, emptyWeapon: false,
      heldEnemy: null, grabTimer: 0,
      grabbedBy: null, throwDamage: 0, throwFromX: 0,
      invuln: 1.2, hitFlash: 0, deathTimer: 0,
      downTimer: 0, bounced: false,
      kneeHits: 0,
      comboStep: 0, queuedAttack: false, comboBuffer: 0,
      lastTapDir: 0, lastTapAt: -10, dashReady: 0, dashCooldown: 0, dashTrailTimer: 0,
      runTrailTimer: 0, runTime: 0, fxTimer: 0
    };
  }

  function setMode(mode) {
    G.lastMode = G.mode;
    G.mode = mode;
    dom.screen.dataset.mode = mode;
  }

  function openTitle(fromGame) {
    setMode('title');
    clearOverlays();
    show(dom.title, true);
    show(dom.hud, false);
    show(dom.bossUI, false);
    G.battle = null;
    G.boss = null;
    G.boss2 = null;
    G.player = null;
    G.enemies = [];
    G.items = [];
    G.crates = [];
    G.projectiles = [];
    G.particles = [];
    G.floaters = [];
    G.effects = [];
    G.camera.shake = 0;
    dom.damageFlash.style.opacity = '0';
    if (!G.titleVisuals) G.titleVisuals = Art.buildStage(0, 2460);
    Sound.setPaused(false);
    Sound.playTrack('title');
    saveBest();
    updateBestLabel();
    show(dom.touch, document.body.classList.contains('touch-mode') && !fromGame ? true : document.body.classList.contains('touch-mode'));
  }

  function openSelect() {
    setMode('select');
    clearOverlays();
    show(dom.select, true);
    show(dom.hud, false);
    show(dom.bossUI, false);
    G.selectedChar = G.charKey || 'rex';
    updateCharCards();
    Sound.playTrack('select');
    Sound.menu();
    blurFocus();
  }

  function updateCharCards() {
    const cards = [...document.querySelectorAll('.char-card')];
    cards.forEach(card => {
      card.classList.toggle('selected', card.dataset.char === G.selectedChar);
      card.setAttribute('aria-pressed', card.dataset.char === G.selectedChar ? 'true' : 'false');
    });
  }

  function selectChar(key, withSound) {
    if (!PLAYER_STATS[key]) return;
    G.selectedChar = key;
    updateCharCards();
    if (withSound) Sound.menu();
  }

  function beginRun(key) {
    G.charKey = key || G.selectedChar || 'rex';
    G.score = 0;
    G.lives = 3;
    G.maxCombo = 0;
    G.combo = 0;
    G.finalVictory = false;
    startStage(0);
  }

  function startStage(index) {
    const stage = STAGES[index];
    if (!stage) return;
    setMode('intro');
    clearOverlays();
    G.stageIndex = index;
    G.stage = stage;
    G.visuals = Art.buildStage(index, stage.worldW);
    G.enemies = [];
    G.items = [];
    G.crates = [];
    G.projectiles = [];
    G.particles = [];
    G.floaters = [];
    G.effects = [];
    G.camera.x = 0;
    G.camera.shake = 0;
    G.battle = null;
    G.waveIndex = 0;
    G.boss = null;
    G.boss2 = null;
    G.bossDefeated = false;
    G.stageClearTimer = 0;
    G.finishing = false;
    G.stageTime = 0;
    G.hitstop = 0;
    G.combo = 0;
    G.comboTimer = 0;
    G.maxCombo = 0;
    G.scoreAtStageStart = G.score;
    G.stats = { hitsTaken: 0 };
    const startX = document.body.classList.contains('touch-mode') ? 132 : 82;
    G.player = createPlayer(G.charKey, startX, 230);
    G.player.invuln = 2;
    // stage props
    stage.props.forEach(prop => {
      G.crates.push({
        kind: 'crate', type: prop.type, x: prop.x, y: prop.y, hp: 10, maxHp: 10,
        flash: 0, dead: false, anim: Math.random() * 10
      });
    });
    (stage.pickups || []).forEach(pickup => addItem(pickup.type, pickup.x, pickup.y));
    // reset UI
    dom.stageNum.textContent = stage.number;
    dom.stageTitle.textContent = stage.title;
    dom.stageCn.textContent = stage.cn;
    dom.stageDesc.textContent = stage.desc;
    dom.hudName.textContent = PLAYER_STATS[G.charKey].name;
    dom.hudStage.textContent = `STAGE ${stage.number}`;
    dom.hudGoal.textContent = stage.goal;
    dom.hudScore.textContent = pad(G.score, 6);
    show(dom.hud, false);
    show(dom.bossUI, false);
    show(dom.stageCard, true);
    dom.damageFlash.style.opacity = '0';
    G.introTimer = 2.8;
    Sound.stopMusic();
    Sound.setPaused(false);
    resetHud();
    dom.stageCard.querySelector('.stage-card-inner').style.animation = 'none';
    // force replay of CSS animation
    void dom.stageCard.offsetWidth;
    dom.stageCard.querySelector('.stage-card-inner').style.animation = '';
    blurFocus();
  }

  function startPlay() {
    if (G.mode !== 'intro') return;
    setMode('playing');
    show(dom.stageCard, false);
    show(dom.hud, true);
    resetHud();
    G.player.invuln = Math.max(G.player.invuln, .8);
    Input.attackQueue = 0;
    Sound.playTrack(G.stage.music);
    Sound.start();
    announce('FIGHT', `${G.stage.title} // ${G.stage.cn}`, '#ffd23f', 1.8);
    if (document.body.classList.contains('touch-mode')) toast('左侧移动 · 「打」连击 · 前前+打 突进技', 4.2);
    else toast('WASD 移动 · J 连击 · 前前+J 突进技 · L 必杀 · E 拾取', 4.2);
    dom.canvas.focus({ preventScroll: true });
    blurFocus();
  }

  function retryStage() {
    G.lives = 3;
    G.score = G.scoreAtStageStart || 0;
    startStage(G.stageIndex);
  }

  // ————————————————————————————————————————————————
  // SPAWNING
  // ————————————————————————————————————————————————
  function spawnEnemy(type, x, y, options) {
    const baseDef = ENEMY_DATA[type];
    const def = baseDef.boss ? { ...baseDef } : baseDef;
    const opt = options || {};
    const fromLeft = opt.side === 'left';
    const e = {
      kind: 'enemy', type, def,
      char: makeEnemyChar(type),
      x, y, z: 0, vx: 0, vy: 0, vz: 0,
      facing: fromLeft ? 1 : -1,
      fromLeft,
      anim: Math.random() * 10,
      state: opt.delay ? 'wait' : 'enter',
      stateTime: 0,
      enterDelay: opt.delay || 0,
      weapon: type === 'gunner' ? 'pistol' : type === 'whip' ? 'whip' : type === 'viper' ? 'knife' : type === 'vprime' ? 'machinegun' : type === 'razor' ? 'sword' : null,
      pose: 'walk',
      hp: def.hp, maxHp: def.hp,
      speed: def.speed,
      scale: def.scale,
      offsetY: rand(-12, 12),
      seed: Math.random() * 10,
      cooldown: rand(.7, 1.5),
      dodgeCooldown: rand(.8, 1.8),
      hitFlash: 0,
      invuln: 0,
      attack: null,
      attackCount: 0,
      attacking: false,
      dead: false,
      deadTimer: 0,
      downTimer: 0,
      bounced: false,
      thrown: false,
      thrownHitSet: null,
      grabbed: false,
      grabbing: false, grabTimer: 0,
      boss: !!def.boss,
      phase: def.phases ? 1 : 0,
      flying: false,
      phaseShift: 0
    };
    G.enemies.push(e);
    if (e.boss) {
      if (!G.boss || G.boss.dead) G.boss = e;
      else G.boss2 = e;
      G.bossDefeated = false;
      show(dom.bossUI, true);
      updateHud();
      Sound.warning();
      announce('WARNING', `${def.name} // ${def.cn}`, '#ff2e63', 2.4);
      shake(4);
    }
    return e;
  }

  function startWave(wave) {
    const spawnList = wave.spawns || [];
    const isBoss = !!wave.boss;
    let camX;
    if (isBoss) {
      camX = clamp(G.player.x - 198, 0, G.stage.worldW - W);
    } else {
      camX = clamp(Math.round(G.camera.x), 0, G.stage.worldW - W);
    }
    G.camera.x = camX;
    G.battle = {
      camX,
      remaining: spawnList.length,
      boss: isBoss,
      cleared: false,
      wave
    };
    G.waveIndex++;
    let leftCount = 0, rightCount = 0;
    spawnList.forEach(([type, y, side], i) => {
      // Enemies now enter from both edges; waves alternate unless a side is specified.
      const fromLeft = side ? side === 'left' : i % 2 === 1;
      const offset = fromLeft ? leftCount++ : rightCount++;
      const px = fromLeft ? camX - 20 - offset * 22 : camX + W + 20 + offset * 22;
      spawnEnemy(type, px, y, { delay: 0, side: fromLeft ? 'left' : 'right' });
      spawnDust(px, y, 3);
    });
    if (isBoss) {
      if (wave.boss === 'twin') announce('WARNING', 'TWIN BOSS // 双子守卫', '#ff2e63', 2.4);
      else if (wave.boss === 'final') announce('WARNING', 'V-PRIME // 最终形态', '#ff2e63', 2.6);
      Sound.playTrack(wave.boss === 'twin' ? 'twin' : wave.boss === 'final' ? 'final' : 'boss');
      G.finishing = false;
    }
    updateHud();
  }

  function clearBattle() {
    if (!G.battle || G.battle.cleared) return;
    G.battle.cleared = true;
    const wasBoss = G.battle.boss;
    show(dom.bossUI, false);
    if (wasBoss) {
      G.finishing = true;
      G.stageClearTimer = 2.6;
      announce('K.O.', 'AREA CLEAR // 区域已清空', '#ffd23f', 2.4);
      Sound.stopMusic();
      Sound.bossDown();
      G.score += 1500;
    } else {
      announce('CLEAR', 'GO →', '#29e7ff', 1.15);
      G.score += 250;
      if (G.player && (G.player.hp / G.player.maxHp < .55 || Math.random() < .42)) {
        const healType = G.player.hp / G.player.maxHp < .3 ? 'burger' : 'soda';
        addItem(healType, G.camera.x + W * .48, 238);
      }
      toast('前进。下一波在等你。', 1.4);
    }
    G.battle = null;
  }

  // ————————————————————————————————————————————————
  // PLAYER
  // ————————————————————————————————————————————————
  function nearestEnemy(x, y, maxDist, maxDepth) {
    let best = null, bestD = Infinity;
    for (const e of G.enemies) {
      if (e.dead || e.state === 'down' || e.state === 'thrown' || e.state === 'grabbed') continue;
      const dx = Math.abs(e.x - x), dy = Math.abs(e.y - y);
      if (dy > (maxDepth == null ? 18 : maxDepth)) continue;
      const d = dx + dy * 1.5;
      if (d < bestD && dx < (maxDist == null ? 80 : maxDist)) { bestD = d; best = e; }
    }
    return best;
  }

  function updatePlayer(dt) {
    const p = G.player;
    if (!p) return;
    p.anim += dt;
    p.stateTime += dt;
    if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
    if (p.hitFlash > 0) p.hitFlash = Math.max(0, p.hitFlash - dt);
    if (p.dashCooldown > 0) p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    if (p.dashReady > 0) p.dashReady = Math.max(0, p.dashReady - dt);

    if (p.state === 'grabbed') return;
    if (p.state === 'thrown') { updatePlayerThrown(dt); return; }
    if (p.state === 'dead') { updatePlayerDeath(dt); return; }
    if (p.state === 'down') { updatePlayerDown(dt); return; }
    if (p.state === 'hurt') {
      p.x += p.vx * dt;
      p.vx *= Math.max(0, 1 - dt * 7);
      if (p.stateTime > .34) {
        p.state = 'idle';
        p.stateTime = 0;
        p.vx = 0;
      }
      return;
    }
    if (p.state === 'jump' || p.state === 'jumpkick') { updatePlayerJump(dt); return; }
    if (p.state === 'run') { updateRun(dt); return; }
    if (p.state === 'dashattack') { updatePlayerDashAttack(dt); return; }
    if (p.state === 'attack') { updatePlayerAttack(dt); return; }
    if (p.state === 'special') { updatePlayerSpecial(dt); return; }
    if (p.state === 'grab') { updatePlayerGrab(dt); return; }
    if (p.state === 'throw') {
      if (p.stateTime > .18) { p.state = 'idle'; p.stateTime = 0; }
      return;
    }

    // double-tap forward: the second press starts a sustained run
    let tapDir = 0;
    if (Input.pressed('right')) tapDir = 1;
    else if (Input.pressed('left')) tapDir = -1;
    if (tapDir) {
      if (p.lastTapDir === tapDir && G.time - p.lastTapAt < .3) {
        startRun(tapDir);
        return;
      }
      p.lastTapDir = tapDir;
      p.lastTapAt = G.time;
    }

    // normal locomotion
    const dx = (Input.down('right') ? 1 : 0) - (Input.down('left') ? 1 : 0);
    const dy = (Input.down('down') ? 1 : 0) - (Input.down('up') ? 1 : 0);
    let mx = dx, my = dy;
    const len = Math.hypot(mx, my);
    if (len > 1) { mx /= len; my /= len; }
    if (dx !== 0) p.facing = dx > 0 ? 1 : -1;
    const moving = len > 0.01;
    p.state = moving ? 'walk' : 'idle';
    p.pose = p.state;
    p.x += mx * p.speed * dt;
    p.y += my * p.speed * .68 * dt;

    if (p.dashReady > 0 && p.dashCooldown <= 0 && Input.consumeAttack()) { startDashAttack(); return; }
    if (Input.consumeAttack()) { startPlayerAttack(); return; }
    if (Input.pressed('jump')) { startPlayerJump(); return; }
    if (Input.pressed('special')) { startPlayerSpecial(); return; }
    if (Input.pressed('grab')) { tryGrabOrPickup(); return; }
  }

  function autoFace(maxDist) {
    const p = G.player;
    const target = nearestEnemy(p.x, p.y, maxDist || 64, 20);
    if (target) p.facing = target.x >= p.x ? 1 : -1;
  }

  function startPlayerAttack() {
    const p = G.player;
    autoFace(p.weapon === 'pistol' ? 220 : 64);
    if (p.weapon && !WEAPONS[p.weapon]) { p.weapon = null; p.weaponDur = 0; p.ammo = 0; }
    if (p.weapon === 'pistol' && p.ammo <= 0) {
      p.weapon = null;
      p.weaponDur = 0;
      p.ammo = 0;
      toast('手枪已经空了。', 1.1);
    }
    if (p.weapon) {
      const w = WEAPONS[p.weapon];
      p.state = 'attack';
      p.stateTime = 0;
      p.comboBuffer = 0;
      p.queuedAttack = false;
      p.attack = {
        timer: 0,
        data: { ...w },
        index: 2,
        struck: false,
        weapon: true,
        weaponKey: p.weapon,
        gun: p.weapon === 'pistol'
      };
      if (w.type === 'ranged') Sound.trigger();
      else if (p.weapon === 'knife') Sound.knife();
      else Sound.whoosh();
      return;
    }
    const data = PLAYER_STATS[p.charKey].combo[0];
    p.state = 'attack';
    p.stateTime = 0;
    p.comboStep = 0;
    p.queuedAttack = false;
    p.comboBuffer = 0;
    p.attack = { timer: 0, data, index: 0, struck: false, weapon: false };
    Sound.whoosh();
  }

  function nextComboAttack() {
    const p = G.player;
    const combo = PLAYER_STATS[p.charKey].combo;
    const next = Math.min(combo.length - 1, p.attack.index + 1);
    p.attack = { timer: 0, data: combo[next], index: next, struck: false, weapon: false };
    p.stateTime = 0;
    p.queuedAttack = false;
    if (next === 2) Sound.whoosh();
  }

  function updatePlayerAttack(dt) {
    const p = G.player;
    const a = p.attack;
    if (!a) { p.state = 'idle'; return; }
    a.timer += dt;
    const d = a.data;
    // Buffer extra attack presses so quick three-tap combos never eat an input.
    while (Input.attackQueue > 0 && !a.weapon && a.index + 1 + p.comboBuffer < 3) {
      Input.attackQueue--;
      p.comboBuffer++;
      p.queuedAttack = true;
    }
    if (!a.weapon && a.index >= 2) Input.attackQueue = 0;
    // Small forward step during the active frames keeps the combo connected.
    const stepSpeed = a.weapon ? (d.step || 0) : a.index === 0 ? 38 : a.index === 1 ? 52 : 68;
    if (a.timer <= d.startup + d.active) p.x += p.facing * stepSpeed * dt;
    const strikeAt = d.startup;
    if (!a.struck && a.timer >= strikeAt) {
      a.struck = true;
      if (a.gun) firePlayerBullet(p);
      else performPlayerStrike(p, d, a.weapon);
    }
    const total = d.startup + d.active + d.recovery;
    if (a.timer >= total) {
      if (a.gun && p.ammo <= 0) {
        p.weapon = null;
        p.weaponDur = 0;
        p.state = 'idle';
        p.attack = null;
        p.stateTime = 0;
        p.comboStep = 0;
        p.queuedAttack = false;
        p.comboBuffer = 0;
        Input.attackQueue = 0;
        toast('子弹打空。手枪脱手。', 1.6);
        spawnBurst(p.x + p.facing * 25, p.y, 20, '#aeb8c4', 5, 30);
      } else if (a.gun && p.ammo > 0 && Input.attackQueue > 0) {
        Input.attackQueue--;
        startPlayerAttack();
        return;
      } else if (!a.gun && a.weapon && p.weapon && Input.attackQueue > 0) {
        Input.attackQueue--;
        startPlayerAttack();
        return;
      } else if (p.comboBuffer > 0 && a.index < 2 && !a.weapon) {
        p.comboBuffer--;
        nextComboAttack();
      } else {
        p.state = 'idle';
        p.attack = null;
        p.stateTime = 0;
        p.comboStep = 0;
        p.queuedAttack = false;
        p.comboBuffer = 0;
        Input.attackQueue = 0;
      }
    }
  }

  function performPlayerStrike(p, d, isWeapon) {
    const dir = p.facing;
    const wKey = p.weapon;
    let hitAny = false;
    for (const e of G.enemies) {
      if (e.dead || e.state === 'grabbed') continue;
      const dx = (e.x - p.x) * dir;
      if (dx < -7 || dx > d.range + (e.def.hitbox || 10)) continue;
      if (Math.abs(e.y - p.y) > 17) continue;
      if (Math.abs((e.z || 0) - (p.z || 0)) > 27) continue;
      const damage = d.damage * p.power;
      const ok = hitEnemy(e, damage, dir, {
        kb: d.kb,
        knockdown: !!d.knockdown || (wKey === 'pipe' && Math.random() < .35),
        color: wKey === 'knife' ? '#e9f5ff' : '#ffd23f'
      });
      if (ok) hitAny = true;
    }
    for (const c of G.crates) {
      if (c.dead) continue;
      const dx = (c.x - p.x) * dir;
      if (dx < -6 || dx > d.range + 7) continue;
      if (Math.abs(c.y - p.y) > 16) continue;
      damageCrate(c, d.damage * 1.6);
      hitAny = true;
    }
    if (isWeapon && hitAny && p.weapon) {
      p.weaponDur--;
      if (p.weaponDur <= 0) {
        const name = WEAPONS[p.weapon] ? WEAPONS[p.weapon].cn : '武器';
        p.weapon = null;
        p.weaponDur = 0;
        p.ammo = 0;
        toast(`${name}报废了。拳头还在。`, 1.6);
        spawnBurst(p.x + dir * 24, p.y, 20, '#dbe6f4', 8, 40);
        Sound.break();
      }
    }
    if (!hitAny) {
      // air swipe, tiny screen tremor
      G.camera.shake = Math.max(G.camera.shake, 1.2);
    }
  }

  function firePlayerBullet(p) {
    if (!p.weapon || p.weapon !== 'pistol' || p.ammo <= 0) return;
    p.ammo--;
    p.vx = -p.facing * 18;
    G.projectiles.push({
      x: p.x + p.facing * 10, y: p.y, z: 18,
      vx: p.facing * 470, damage: WEAPONS.pistol.damage,
      life: 1.25, color: '#ffe27a', friendly: true,
      kind: 'bullet', dir: p.facing, knockdown: false
    });
    spawnBurst(p.x + p.facing * 25, p.y, 21, '#ffe27a', 7, 38);
    spawnBurst(p.x + p.facing * 25, p.y, 21, '#fff4c4', 3, 20);
    G.flash = Math.max(G.flash, .14);
    shake(2.2);
    Sound.gunshot();
    updateHud();
  }

  function startRun(dir) {
    const p = G.player;
    p.state = 'run';
    p.stateTime = 0;
    p.facing = dir;
    p.dashReady = 0;
    p.attack = null;
    p.runTime = 0;
    p.runTrailTimer = 0;
    p.lastTapDir = 0;
    p.lastTapAt = -10;
    spawnDust(p.x, p.y, 5);
    Sound.dash();
  }

  function stopRun(grace) {
    const p = G.player;
    p.state = 'idle';
    p.stateTime = 0;
    p.pose = 'idle';
    p.runTime = 0;
    p.dashReady = grace == null ? .32 : grace;
  }

  function updateRun(dt) {
    const p = G.player;
    const st = PLAYER_STATS[p.charKey];
    p.runTime += dt;
    const dir = p.facing;
    const held = dir > 0 ? Input.down('right') : Input.down('left');
    const turned = (dir > 0 && Input.pressed('left')) || (dir < 0 && Input.pressed('right'));
    if (!held || turned) {
      stopRun(.34);
      return;
    }

    // Ramp up over the first few frames so the run reads as acceleration.
    const ramp = Math.min(1, p.runTime / .16);
    p.x += dir * st.runSpeed * (.55 + .45 * ramp) * dt;
    p.y = clamp(p.y, FLOOR_TOP, FLOOR_BOTTOM);
    p.runTrailTimer -= dt;
    if (p.runTrailTimer <= 0) {
      p.runTrailTimer = p.charKey === 'bruno' ? .06 : .08;
      spawnDust(p.x - dir * 8, p.y, p.charKey === 'bruno' ? 3 : 2);
      if (p.charKey === 'bruno') {
        spawnParticle('smoke', p.x - dir * 10, p.y, rand(0, 5), {
          vx: -dir * rand(10, 30), vz: rand(2, 14), color: '#8c7b6c',
          size: rand(3, 5), grow: 5, life: rand(.3, .5), drag: 1.5
        });
      }
    }

    if (Input.attackQueue > 0) {
      Input.consumeAttack();
      if (p.dashCooldown <= 0) {
        startDashAttack();
      } else {
        p.state = 'idle';
        p.stateTime = 0;
        startPlayerAttack();
      }
      return;
    }
    if (Input.pressed('jump')) { startPlayerJump(); return; }
    if (Input.pressed('special')) { startPlayerSpecial(); return; }
    if (Input.pressed('grab')) {
      p.state = 'idle';
      p.stateTime = 0;
      tryGrabOrPickup();
      return;
    }
  }

  function startDashAttack() {
    const p = G.player;
    if (p.dashCooldown > 0) return false;
    const dash = PLAYER_STATS[p.charKey].dash;
    p.state = 'dashattack';
    p.stateTime = 0;
    p.dashReady = 0;
    p.dashCooldown = .62;
    p.invuln = Math.max(p.invuln, .34);
    p.comboBuffer = 0;
    p.queuedAttack = false;
    p.fxTimer = 0;
    Input.attackQueue = 0;
    p.attack = { timer: 0, data: { ...dash }, index: 3, struck: false, weapon: false, dashSkill: true };
    spawnFloater(p.x, p.y, 46, dash.name, p.char.colors.accent);
    if (dash.fx === 'fire') {
      spawnBurst(p.x + p.facing * 18, p.y, 16, '#ff7a1e', 7, 45);
      spawnBurst(p.x + p.facing * 18, p.y, 16, '#ffd76b', 4, 30);
      G.flash = Math.max(G.flash, .14);
      Sound.flameBurst(true);
    } else if (dash.fx === 'bolt') {
      spawnBurst(p.x, p.y, 22, '#7ef4ff', 8, 55);
      spawnBurst(p.x, p.y, 22, '#ffffff', 4, 32);
      G.flash = Math.max(G.flash, .2);
      Sound.thunder(true);
    } else {
      spawnDust(p.x, p.y, 10);
      spawnBurst(p.x - p.facing * 8, p.y, 8, '#a08a73', 6, 35);
      G.flash = Math.max(G.flash, .07);
      Sound.quake(true);
    }
    Sound.dashStrike();
    shake(3.5);
    return true;
  }

  function updatePlayerDashAttack(dt) {
    const p = G.player;
    const a = p.attack;
    const dash = PLAYER_STATS[p.charKey].dash;
    if (!a) { p.state = 'idle'; return; }
    a.timer += dt;

    p.fxTimer -= dt;
    if (p.fxTimer <= 0) {
      p.fxTimer = dash.fx === 'smoke' ? .03 : .022;
      emitDashFx(p, dash);
    }

    if (a.timer <= dash.startup + dash.active) p.x += p.facing * dash.speed * dt;
    if (!a.struck && a.timer >= dash.startup) {
      a.struck = true;
      let hitAny = false;
      for (const e of G.enemies) {
        if (e.dead || e.state === 'grabbed') continue;
        const dx = (e.x - p.x) * p.facing;
        if (dx < -8 || dx > dash.range + (e.def.hitbox || 10)) continue;
        if (Math.abs(e.y - p.y) > 20) continue;
        hitEnemy(e, dash.damage * p.power, p.facing, {
          kb: dash.kb, knockdown: true, color: dashFxColor(dash.fx)
        });
        hitAny = true;
      }
      for (const c of G.crates) {
        if (c.dead) continue;
        const dx = (c.x - p.x) * p.facing;
        if (dx > -6 && dx < dash.range + 8 && Math.abs(c.y - p.y) < 18) damageCrate(c, 24);
      }
      dashImpactFx(p, dash);
      G.hitstop = Math.max(G.hitstop, .055);
      if (!hitAny) G.camera.shake = Math.max(G.camera.shake, 2);
      Sound.dashHit();
    }
    if (a.timer >= dash.startup + dash.active + dash.recovery) {
      p.state = 'idle';
      p.attack = null;
      p.stateTime = 0;
      p.dashReady = 0;
    }
  }

  function dashFxColor(fx) {
    if (fx === 'fire') return '#ffb03a';
    if (fx === 'bolt') return '#8ff6ff';
    return '#e0b98e';
  }

  function emitDashFx(p, dash) {
    const x = p.x - p.facing * rand(4, 16);
    const y = p.y;
    if (dash.fx === 'fire') {
      spawnParticle('flame', x, y, rand(2, 14), {
        vx: -p.facing * rand(35, 95), vz: rand(18, 65), color: choose(['#ff3d00', '#ff7a1e', '#ffb03a']),
        size: rand(2, 4), grow: 7, life: rand(.18, .38), gravity: -35, drag: 2.6, glow: true
      });
      if (Math.random() < .45) {
        spawnParticle('spark', x, y, rand(12, 34), {
          vx: -p.facing * rand(25, 70), vz: rand(55, 110), color: '#ffe9a3',
          size: 1, life: rand(.25, .5), gravity: 120, drag: 1.2, glow: true
        });
      }
    } else if (dash.fx === 'bolt') {
      const h = rand(8, 44);
      spawnParticle('spark', p.x + rand(-10, 10), y, h, {
        vx: -p.facing * rand(20, 80), vz: rand(-10, 45), color: choose(['#7ef4ff', '#c9fcff', '#ffffff']),
        size: 2, life: rand(.12, .28), gravity: 20, drag: 3.2, glow: true
      });
      if (Math.random() < .3) {
        spawnParticle('bolt', p.x + rand(-14, 14), y, rand(2, 38), {
          vx: -p.facing * rand(5, 22), vz: 0, color: '#aef8ff',
          size: rand(9, 16), life: rand(.1, .18), gravity: 0, drag: 2, glow: true
        });
      }
    } else {
      spawnParticle('smoke', x, y, rand(0, 8), {
        vx: -p.facing * rand(12, 38), vz: rand(6, 26), color: choose(['#8c7b6c', '#a4917d', '#6f6157']),
        size: rand(4, 7), grow: 9, life: rand(.4, .7), gravity: 12, drag: 1.8
      });
      if (Math.random() < .4) {
        spawnParticle('debris', x, y, rand(4, 18), {
          vx: -p.facing * rand(30, 80), vz: rand(50, 95), color: choose(['#7b6553', '#a08363', '#4d3f35']),
          size: rand(2, 3), life: rand(.3, .55), gravity: 420, drag: .6, spin: rand(-14, 14)
        });
      }
    }
  }

  function dashImpactFx(p, dash) {
    const x = p.x + p.facing * 28;
    const y = p.y;
    if (dash.fx === 'fire') {
      spawnBurst(x, y, 22, '#ff7a1e', 16, 80);
      spawnBurst(x, y, 22, '#ffd76b', 8, 55);
      G.effects.push({ x, y, radius: 10, maxRadius: 46, life: .4, maxLife: .4, color: '#ff8a2a', width: 3 });
      G.flash = Math.max(G.flash, .16);
      shake(6.5);
      Sound.flameBurst();
    } else if (dash.fx === 'bolt') {
      spawnBurst(x, y, 22, '#8ff6ff', 16, 90);
      spawnBurst(x, y, 22, '#ffffff', 7, 50);
      G.effects.push({ x, y, radius: 12, maxRadius: 52, life: .32, maxLife: .32, color: '#7ef4ff', width: 3 });
      G.flash = Math.max(G.flash, .28);
      shake(5);
      Sound.thunder();
    } else {
      spawnDust(x, y, 14);
      spawnBurst(x, y, 8, '#a08a73', 14, 70);
      spawnBurst(x, y, 12, '#6f6157', 8, 45);
      G.effects.push({ x, y, radius: 14, maxRadius: 58, life: .5, maxLife: .5, color: '#c9a27a', width: 4 });
      G.flash = Math.max(G.flash, .06);
      shake(8.5);
      Sound.quake();
    }
  }

  function startPlayerJump() {
    const p = G.player;
    const st = PLAYER_STATS[p.charKey];
    p.dashReady = 0;
    p.state = 'jump';
    p.stateTime = 0;
    p.vz = st.jump;
    p.z = 1;
    p.vx = (Input.down('left') ? -1 : Input.down('right') ? 1 : 0) * p.speed * .55;
    p.vy = 0;
    p.jumpHit = new Set();
    Sound.jump();
  }

  function updatePlayerJump(dt) {
    const p = G.player;
    p.z += p.vz * dt;
    p.vz -= GRAVITY * dt;
    p.x += p.vx * dt;
    p.x = clamp(p.x, 16, G.stage.worldW - 16);
    if (p.state === 'jump' && Input.consumeAttack()) {
      p.state = 'jumpkick';
      p.stateTime = 0;
      p.vz = Math.max(p.vz, 30);
      p.vx = p.facing * 92;
      Sound.whoosh();
    }
    if (p.state === 'jumpkick' && p.z > 3) {
      const d = { range: 35, damage: PLAYER_STATS[p.charKey].jumpKick * p.power, kb: 100 };
      for (const e of G.enemies) {
        if (e.dead || p.jumpHit.has(e)) continue;
        const dx = (e.x - p.x) * p.facing;
        if (dx > -8 && dx < d.range + e.def.hitbox && Math.abs(e.y - p.y) < 18) {
          p.jumpHit.add(e);
          hitEnemy(e, d.damage, p.facing, { kb: d.kb, knockdown: true, color: '#ffe98a' });
          p.vz = Math.max(p.vz, 30);
        }
      }
    }
    if (p.z <= 0) {
      p.z = 0;
      p.vz = 0;
      p.vx = 0;
      p.state = 'idle';
      p.stateTime = 0;
      spawnDust(p.x, p.y, 4);
      Sound.land();
    }
    p.x = clamp(p.x, 16, G.stage.worldW - 16);
  }

  function startPlayerSpecial() {
    const p = G.player;
    const st = PLAYER_STATS[p.charKey];
    if (p.hp <= 1) {
      toast('血量见底，必杀用不出来。', 1.5);
      return;
    }
    const cost = Math.min(st.specialCost, p.hp - 1);
    p.hp -= cost;
    p.dashReady = 0;
    p.state = 'special';
    p.stateTime = 0;
    p.specialStruck = false;
    p.specialHits = new Set();
    p.invuln = Math.max(p.invuln, .58);
    p.vx = 0;
    p.vy = 0;
    Sound.special();
    shake(6);
    G.flash = .55;
    const ring = { x: p.x, y: p.y, radius: 5, maxRadius: 70, life: .55, maxLife: .55, color: p.char.colors.accent, width: 3 };
    G.effects.push(ring);
    for (let i = 0; i < 2; i++) {
      G.effects.push({
        x: p.x, y: p.y, radius: 16 + i * 26, maxRadius: 96 + i * 12,
        life: .4 + i * .08, maxLife: .48, color: '#ffffff', width: 1
      });
    }
    spawnBurst(p.x, p.y, 24, p.char.colors.accent, 12, 60);
  }

  function updatePlayerSpecial(dt) {
    const p = G.player;
    const t = p.stateTime;
    if (t >= .16 && !p.specialStruck) {
      p.specialStruck = true;
      const st = PLAYER_STATS[p.charKey];
      for (const e of G.enemies) {
        if (e.dead) continue;
        if (Math.abs(e.x - p.x) < 76 + (e.def.hitbox || 10) && Math.abs(e.y - p.y) < 38) {
          hitEnemy(e, st.special * p.power, e.x >= p.x ? 1 : -1, {
            kb: 140, knockdown: true, color: p.char.colors.accent
          });
        }
      }
      for (const c of G.crates) {
        if (!c.dead && Math.abs(c.x - p.x) < 70 && Math.abs(c.y - p.y) < 32) damageCrate(c, 30);
      }
    }
    if (t >= .58) {
      p.state = 'idle';
      p.stateTime = 0;
      p.specialStruck = false;
      p.specialHits = null;
    }
  }

  function tryGrabOrPickup() {
    const p = G.player;
    p.dashReady = 0;
    // items first
    for (const item of G.items) {
      if (Math.abs(item.x - p.x) < 24 && Math.abs(item.y - p.y) < 17) {
        pickupItem(item);
        return;
      }
    }
    // then enemies
    let target = null, best = Infinity;
    for (const e of G.enemies) {
      if (e.dead || e.boss || e.state === 'down' || e.state === 'thrown' || e.state === 'grabbed') continue;
      const dx = Math.abs(e.x - p.x), dy = Math.abs(e.y - p.y);
      if (dx < 25 && dy < 15) {
        const d = dx + dy;
        if (d < best) { best = d; target = e; }
      }
    }
    if (!target) {
      // small whiff / nothing
      return;
    }
    p.state = 'grab';
    p.stateTime = 0;
    p.grabTimer = .95;
    p.heldEnemy = target;
    p.kneeHits = 0;
    p.facing = target.x >= p.x ? 1 : -1;
    target.state = 'grabbed';
    target.stateTime = 0;
    target.attack = null;
    target.attacking = false;
    target.facing = -p.facing;
    target.vx = 0;
    target.vy = 0;
    target.z = 0;
    Sound.whoosh();
    toast('J 膝击 · K 投掷', 1.2);
  }

  function updatePlayerGrab(dt) {
    const p = G.player;
    const e = p.heldEnemy;
    if (!e || e.dead) {
      p.state = 'idle';
      p.heldEnemy = null;
      return;
    }
    p.grabTimer -= dt;
    e.x = p.x + p.facing * 14;
    e.y = p.y;
    e.z = 0;
    e.facing = -p.facing;
    if (Input.consumeAttack()) {
      e.hp -= 4.5 * p.power;
      p.kneeHits++;
      G.combo++;
      G.comboTimer = 1.7;
      G.maxCombo = Math.max(G.maxCombo, G.combo);
      G.score += 55;
      spawnBurst(e.x, e.y, 17, '#ffd23f', 6, 40);
      spawnFloater(e.x, e.y, 28, '4', '#ffd23f');
      Sound.punch(false);
      shake(2.5);
      G.hitstop = Math.max(G.hitstop, .025);
      p.grabTimer = .75;
      if (e.hp <= 0) {
        p.heldEnemy = null;
        p.state = 'idle';
        e.state = 'hurt';
        e.stateTime = 0;
        killEnemy(e, p.facing, true);
        return;
      }
      if (p.kneeHits >= 3) throwHeldEnemy();
      return;
    }
    if (Input.pressed('jump') || Input.pressed('grab')) {
      throwHeldEnemy();
      return;
    }
    if (p.grabTimer <= 0) {
      e.state = 'hurt';
      e.stateTime = 0;
      e.vx = p.facing * 60;
      e.invuln = .35;
      p.state = 'idle';
      p.heldEnemy = null;
    }
  }

  function throwHeldEnemy() {
    const p = G.player;
    const e = p.heldEnemy;
    if (!e) return;
    p.heldEnemy = null;
    p.state = 'throw';
    p.stateTime = 0;
    p.invuln = Math.max(p.invuln, .28);
    e.state = 'thrown';
    e.stateTime = 0;
    e.z = 7;
    e.vz = 118;
    e.vx = p.facing * 195;
    e.thrown = true;
    e.thrownHitSet = new Set();
    e.downTimer = .8;
    e.hp -= 6 * p.power;
    e.facing = p.facing;
    G.combo++;
    G.comboTimer = 1.8;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.score += 120;
    spawnFloater(e.x, e.y, 30, 'THROW!', '#29e7ff');
    Sound.throw();
    shake(4);
    if (e.hp <= 0) {
      // still let the body fly, mark dead when it lands
      e.willDie = true;
    }
  }

  function releaseGrab() {
    const p = G.player;
    if (!p || !p.heldEnemy) return;
    const e = p.heldEnemy;
    e.state = 'hurt';
    e.stateTime = 0;
    e.vx = p.facing * 30;
    e.invuln = .2;
    p.heldEnemy = null;
    if (p.state !== 'dead') p.state = 'idle';
  }

  function updatePlayerThrown(dt) {
    const p = G.player;
    p.z += p.vz * dt;
    p.vz -= GRAVITY * dt;
    p.x += p.vx * dt;
    p.vx *= Math.max(0, 1 - dt * 1.5);
    p.y = clamp(p.y, FLOOR_TOP, FLOOR_BOTTOM);
    p.x = clamp(p.x, G.camera.x + 16, Math.min(G.stage.worldW - 16, G.camera.x + W - 16));
    if (p.z <= 0) {
      p.z = 0;
      p.vz = 0;
      p.vx = 0;
      const dmg = p.throwDamage || 8;
      const from = p.throwFromX || p.x;
      p.throwDamage = 0;
      p.state = 'idle';
      p.invuln = 0;
      hurtPlayer(dmg, from, true);
    }
  }

  function updatePlayerDown(dt) {
    const p = G.player;
    p.downTimer -= dt;
    p.z += p.vz * dt;
    p.vz -= GRAVITY * dt;
    p.x += p.vx * dt;
    p.vx *= Math.max(0, 1 - dt * 3.4);
    if (p.z <= 0) {
      p.z = 0;
      if (!p.bounced && p.vz < -90) { p.vz = 48; p.bounced = true; Sound.land(); }
      else p.vz = 0;
    }
    if (p.downTimer <= 0) {
      p.state = 'idle';
      p.stateTime = 0;
      p.invuln = 1.05;
      p.z = 0;
      p.vx = 0;
      spawnDust(p.x, p.y, 6);
    }
  }

  function killPlayer() {
    const p = G.player;
    if (p.state === 'dead') return;
    p.state = 'dead';
    p.stateTime = 0;
    p.deathTimer = 0;
    p.z = 0;
    p.vz = 0;
    p.vx = 0;
    p.hp = 0;
    G.lives--;
    G.combo = 0;
    G.damageFlash = 1;
    G.flash = .5;
    shake(8);
    Sound.ko();
    announce('DOWN', G.lives > 0 ? '继续战斗' : 'NO LIVES LEFT', '#ff2e63', 1.7);
    updateHud();
    releaseGrab();
  }

  function updatePlayerDeath(dt) {
    const p = G.player;
    p.deathTimer += dt;
    p.x += p.vx * dt;
    p.vx *= Math.max(0, 1 - dt * 3);
    if (p.deathTimer >= 2.0) {
      if (G.lives > 0) {
        respawnPlayer();
      } else {
        showGameOver();
      }
    }
  }

  function respawnPlayer() {
    const p = G.player;
    p.hp = p.maxHp;
    p.state = 'idle';
    p.stateTime = 0;
    p.deathTimer = 0;
    p.z = 0;
    p.vx = 0;
    p.vz = 0;
    p.invuln = 2.2;
    p.x = clamp(G.camera.x + 54, 20, G.stage.worldW - 20);
    p.y = 232;
    p.weapon = null;
    p.weaponDur = 0;
    p.ammo = 0;
    p.emptyWeapon = false;
    p.dashReady = 0;
    p.heldEnemy = null;
    p.attack = null;
    G.projectiles = [];
    G.combo = 0;
    updateHud();
    toast('继续战斗。', 1.3);
    announce('READY', 'GET UP', '#29e7ff', 1.1);
  }

  function hurtPlayer(amount, fromX, knockdown, comboHit) {
    const p = G.player;
    if (!p || p.state === 'dead') return false;
    if (p.invuln > 0 && (!comboHit || p.invuln > .22)) return false;
    if (p.z > 15) return false;
    if (p.state === 'down' || p.state === 'dead') return false;
    if (p.state === 'special' && p.invuln > 0) return false;
    if (p.grabbedBy) {
      const holder = p.grabbedBy;
      p.grabbedBy = null;
      if (holder && holder.state === 'grabbing') {
        holder.state = 'chase';
        holder.grabbing = false;
        holder.attack = null;
        holder.cooldown = rand(holder.def.coolMin, holder.def.coolMax);
      }
    }
    const dmg = Math.max(1, Math.round(amount));
    p.hp = Math.max(0, p.hp - dmg);
    p.invuln = comboHit ? (knockdown ? .42 : .1) : .88;
    p.hitFlash = .16;
    p.vy = 0;
    G.stats.hitsTaken++;
    G.combo = 0;
    G.comboTimer = 0;
    G.damageFlash = .95;
    G.flash = .18;
    shake(6.5);
    G.hitstop = Math.max(G.hitstop, .045);
    spawnBurst(p.x, p.y, 26, '#ff5b6d', 9, 55);
    spawnFloater(p.x, p.y, 32, `-${dmg}`, '#ff6b78');
    Sound.hurt();
    p.comboBuffer = 0;
    p.queuedAttack = false;
    p.dashReady = 0;
    Input.attackQueue = 0;
    if (p.heldEnemy) releaseGrab();
    const dir = p.x >= fromX ? 1 : -1;
    if (p.hp <= 0) {
      p.state = 'down';
      p.stateTime = 0;
      p.downTimer = 1;
      p.vz = 90;
      p.z = 1;
      p.vx = dir * 90;
      p.bounced = false;
      killPlayer();
      return true;
    }
    if (knockdown) {
      p.state = 'down';
      p.stateTime = 0;
      p.downTimer = 1.05;
      p.vz = 80;
      p.z = 1;
      p.vx = dir * 90;
      p.bounced = false;
      p.attack = null;
    } else {
      p.state = 'hurt';
      p.stateTime = 0;
      p.vx = dir * 48;
      p.attack = null;
    }
    updateHud();
    return true;
  }

  // ————————————————————————————————————————————————
  // ENEMIES
  // ————————————————————————————————————————————————
  const ATTACK_STYLES = {
    jab: { startup: .32, active: .10, recovery: .42, range: 28, kind: 'melee', pose: 'punch1' },
    slash: { startup: .34, active: .11, recovery: .4, range: 34, kind: 'melee', pose: 'punch2' },
    heavy: { startup: .55, active: .13, recovery: .62, range: 36, kind: 'melee', pose: 'punch2' },
    lunge: { startup: .40, active: .13, recovery: .55, range: 36, kind: 'melee', pose: 'punch1', lunge: 155 },
    jump: { startup: .28, active: .25, recovery: .5, range: 33, kind: 'jump', pose: 'jumpkick' },
    leap: { startup: .3, active: .3, recovery: .58, range: 34, kind: 'jump', pose: 'jumpkick', vz: 198, lunge: 138, height: 30 },
    throwknife: { startup: .36, active: .1, recovery: .52, range: 170, kind: 'projectile', projectile: 'knife', pose: 'throw' },
    combo: { startup: .24, active: .34, recovery: .4, range: 31, kind: 'multi', hits: 3, hitGap: .14, damageMul: .62, pose: 'punch1' },
    whip: { startup: .4, active: .2, recovery: .52, range: 72, kind: 'multi', hits: 2, hitGap: .18, damageMul: .85, pose: 'punch2', knockdownLast: true, color: '#ffcf75' },
    shot: { startup: .32, active: .1, recovery: .52, range: 190, kind: 'projectile', projectile: 'bullet', pose: 'punch1' },
    spin: { startup: .52, active: .25, recovery: .7, range: 52, kind: 'aoe', pose: 'special', radius: 58 },
    pound: { startup: .68, active: .18, recovery: .85, range: 68, kind: 'aoe', pose: 'special', radius: 70 },
    volley: { startup: .42, active: .12, recovery: .55, range: 150, kind: 'projectile', pose: 'punch2' },
    // Stage 4 twin guards
    flurry: { startup: .2, active: .38, recovery: .42, range: 40, kind: 'multi', hits: 4, hitGap: .095, damageMul: .52, pose: 'punch1', color: '#ff5d7d' },
    blink: { startup: .2, active: .12, recovery: .42, range: 44, kind: 'melee', pose: 'slash', lunge: 250, color: '#ff3d5f' },
    dive: { startup: .24, active: .3, recovery: .52, range: 38, kind: 'jump', pose: 'jumpkick', vz: 218, lunge: 165, height: 32 },
    tornado: { startup: .22, active: .34, recovery: .46, range: 40, kind: 'multi', hits: 3, hitGap: .13, damageMul: .72, pose: 'kick', kickCycle: true, knockdownLast: true },
    // Stage 5 final boss
    mg: { startup: .34, active: .42, recovery: .55, range: 240, kind: 'burst', projectile: 'bullet', shots: 7, shotGap: .065, damageMul: .42, pose: 'punch1' },
    heavycombo: { startup: .34, active: .36, recovery: .5, range: 42, kind: 'multi', hits: 3, hitGap: .17, damageMul: 1.05, pose: 'punch1', knockdownLast: true, lunge: 140 },
    dashpunch: { startup: .28, active: .14, recovery: .48, range: 44, kind: 'melee', pose: 'punch2', lunge: 285, dash: true },
    slam: { startup: .5, active: .2, recovery: .62, range: 72, kind: 'aoe', pose: 'special', radius: 74, dive: true },
    airvolley: { startup: .32, active: .3, recovery: .45, range: 210, kind: 'burst', projectile: 'energy', shots: 3, shotGap: .14, damageMul: .8, pose: 'punch2' },
    talon: { startup: .22, active: .13, recovery: .4, range: 48, kind: 'melee', pose: 'jumpkick', lunge: 175, height: 30 },
    // Stage boss signature moves
    sweep: { startup: .38, active: .22, recovery: .55, range: 96, kind: 'sweep', pose: 'slash', damageMul: 1.2, knockdown: true, color: '#ff5b7d' },
    charge: { startup: .34, active: .2, recovery: .56, range: 50, kind: 'melee', pose: 'punch2', lunge: 300, damageMul: 1.2, knockdown: true, dash: true },
    jumphammer: { startup: .34, active: .3, recovery: .58, range: 52, kind: 'jump', pose: 'jumpkick', lunge: 160, vz: 222, height: 32, damageMul: 1.15, knockdown: true, landShock: true },
    shoryu: { startup: .24, active: .18, recovery: .52, range: 44, kind: 'shoryu', pose: 'special', damageMul: 1.2, knockdown: true, height: 42 },
    hadou: { startup: .4, active: .16, recovery: .55, range: 250, kind: 'projectile', projectile: 'energy', pose: 'punch2', damageMul: 1.3, speed: 215, big: true },
    // Grappler
    grab: { startup: .32, active: .12, recovery: .5, range: 30, kind: 'grab', pose: 'grab', damageMul: 1.3 }
  };

  function canEnemyAttack(e) {
    if (e.boss) {
      if (e.type === 'raven' || e.type === 'nyx') {
        let attackers = 0;
        for (const other of G.enemies) {
          if (other !== e && !other.dead && other.attacking) attackers++;
        }
        return attackers < 1;
      }
      return true;
    }
    let count = 0;
    for (const other of G.enemies) {
      if (other !== e && !other.dead && other.attacking) count++;
    }
    return count < 2;
  }

  function chooseEnemyAttack(e) {
    if (e.type === 'razor') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 46 || e.attackCount % 4 === 0) return 'sweep';
      return e.attackCount % 3 === 0 ? 'spin' : 'slash';
    }
    if (e.type === 'titan') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 60) return 'charge';
      if (e.attackCount % 4 === 0) return 'jumphammer';
      return e.attackCount % 3 === 0 ? 'pound' : 'heavy';
    }
    if (e.type === 'vector') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 80) return 'hadou';
      if (e.attackCount % 4 === 0) return 'shoryu';
      if (e.attackCount % 3 === 0) return 'volley';
      return gap > 55 ? 'lunge' : 'slash';
    }
    if (e.type === 'wrecker') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap < 38) return 'grab';
      if (gap > 50) return 'lunge';
      return 'jab';
    }
    if (e.type === 'raven') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 80) return 'blink';
      return Math.random() < .62 ? 'flurry' : 'slash';
    }
    if (e.type === 'nyx') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 70) return 'dive';
      return Math.random() < .6 ? 'tornado' : 'jab';
    }
    if (e.type === 'vprime') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (e.phase === 3) {
        if (gap > 80) return 'airvolley';
        if (gap > 38) return 'talon';
        return 'slam';
      }
      if (e.phase === 2) {
        return gap > 55 ? 'dashpunch' : 'heavycombo';
      }
      if (gap > 60) return 'mg';
      return Math.random() < .45 ? 'mg' : 'jab';
    }
    if (e.type === 'boxer') {
      return Math.abs(G.player.x - e.x) < 42 && Math.random() < .72 ? 'combo' : 'jab';
    }
    if (e.type === 'whip') {
      return Math.abs(G.player.x - e.x) < 78 ? 'whip' : 'slash';
    }
    if (e.type === 'gunner') {
      return Math.abs(G.player.x - e.x) > 42 ? 'shot' : 'jab';
    }
    if (e.type === 'siren') {
      e.attackCount++;
      const gap = Math.abs(G.player.x - e.x);
      if (gap > 40) return 'leap';
      return Math.random() < .72 ? 'jump' : 'jab';
    }
    if (e.type === 'viper') {
      e.attackCount++;
      return Math.abs(G.player.x - e.x) > 46 ? 'throwknife' : 'slash';
    }
    if (e.type === 'blade') {
      if (Math.abs(G.player.x - e.x) > 42 && Math.random() < .55) return 'lunge';
      return 'slash';
    }
    if (e.type === 'brute') return 'heavy';
    if (e.type === 'kicker' && Math.random() < .4) return 'jump';
    return 'jab';
  }

  function startEnemyAttack(e) {
    const id = chooseEnemyAttack(e);
    const style = ATTACK_STYLES[id];
    e.state = 'attack';
    e.stateTime = 0;
    e.attacking = true;
    e.attack = {
      id, style, timer: 0, struck: false, hitIndex: 0, shotIndex: 0,
      radius: style.radius || 0,
      pose: style.pose,
      z0: 0
    };
    e.pose = style.pose;
    e.vx = 0;
    e.vz = 0;
    if (style.lunge) e.vx = e.facing * style.lunge;
    if (style.kind === 'jump') {
      e.vz = style.vz || 150;
      e.z = 1;
      e.vx = e.facing * (style.lunge || 78);
    }
    if (style.kind === 'shoryu') {
      e.vz = 185;
      e.z = 1;
    }
    if (style.kind === 'aoe') {
      // warning effect is drawn from attack state
      Sound.warning();
    }
  }

  function updateEnemyAttack(e, dt) {
    const a = e.attack;
    if (!a) { e.state = 'chase'; e.attacking = false; return; }
    a.timer += dt;
    if (e.vx) {
      e.x += e.vx * dt;
      e.vx *= Math.max(0, 1 - dt * 4.5);
    }
    if (!e.flying && (e.z > 0 || e.vz > 0)) {
      e.z += e.vz * dt;
      e.vz -= GRAVITY * dt;
      if (e.z <= 0) {
        e.z = 0;
        e.vz = 0;
        if (a.style.kind === 'jump') spawnDust(e.x, e.y, 4);
      }
    }
    const t = a.timer;
    const st = a.style;
    if (st.dive && e.z > 2) e.z = Math.max(2, e.z - 165 * dt);
    if (st.kind === 'multi') {
      const hits = st.hits || 1;
      while (a.hitIndex < hits && t >= st.startup + a.hitIndex * st.hitGap) {
        const last = a.hitIndex === hits - 1;
        const damage = e.def.damage * (st.damageMul || 1);
        enemyMeleeHit(e, st, damage, last && !!st.knockdownLast, true);
        a.hitIndex++;
        a.pose = st.kickCycle ? 'kick' : st.id === 'whip' ? 'punch2' : (a.hitIndex % 2 ? 'punch2' : 'punch1');
        if (st.id === 'whip') {
          spawnBurst(e.x + e.facing * 38, e.y, 25, '#ffcf75', 5, 38);
          Sound.whipCrack();
        }
        if (st.id === 'flurry') {
          spawnBurst(e.x + e.facing * 24, e.y, 24, '#ff3d5f', 4, 34);
          Sound.knife();
        }
        if (st.id === 'tornado') {
          spawnBurst(e.x + e.facing * 24, e.y, 20, '#5ef0ff', 4, 30);
          Sound.whoosh();
        }
      }
      a.struck = true;
    } else if (st.kind === 'burst') {
      const shots = st.shots || 3;
      while (a.shotIndex < shots && t >= st.startup + a.shotIndex * st.shotGap) {
        const isMg = st.id === 'mg';
        fireEnemyProjectile(e, st, {
          damage: e.def.damage * (st.damageMul || .5),
          spread: isMg ? 3 : 1.5,
          speed: isMg ? 395 : 300,
          mg: isMg
        });
        a.shotIndex++;
      }
      a.struck = true;
    } else if (!a.struck && t >= st.startup) {
      a.struck = true;
      triggerEnemyAttackHit(e, st, a);
    }
    const total = st.startup + st.active + st.recovery;
    if (t >= total) {
      e.state = 'chase';
      e.stateTime = 0;
      e.attacking = false;
      e.attack = null;
      e.pose = 'idle';
      e.cooldown = rand(e.def.coolMin, e.def.coolMax);
      if (e.boss) e.cooldown *= .8;
    }
  }

  function triggerEnemyAttackHit(e, st, a) {
    const p = G.player;
    if (!p || p.state === 'dead') return;
    if (st.kind === 'aoe') {
      const radius = st.radius || 60;
      G.effects.push({ x: e.x, y: e.y, radius: 8, maxRadius: radius, life: .5, maxLife: .5, color: e.boss ? '#ff5b3d' : '#ffd23f', width: 4 });
      spawnBurst(e.x, e.y, 4, e.boss ? '#ff7a3d' : '#cabda5', 12, 55);
      shake(7);
      Sound.punch(true);
      if (Math.hypot(p.x - e.x, (p.y - e.y) * 1.2) < radius && p.z < 20) {
        hurtPlayer(e.def.damage * 1.15, e.x, true);
      }
      return;
    }
    if (st.kind === 'sweep') {
      const p2 = G.player;
      if (p2 && p2.state !== 'dead') {
        const dx = (p2.x - e.x) * e.facing;
        if (dx > -24 && dx < st.range + (e.def.hitbox || 10) && Math.abs(p2.y - e.y) < 24 && p2.z < 24) {
          hurtPlayer(e.def.damage * (st.damageMul || 1), e.x, true);
        }
      }
      G.effects.push({ x: e.x + e.facing * 42, y: e.y, radius: 14, maxRadius: 110, life: .5, maxLife: .5, color: st.color || '#ff5b7d', width: 4 });
      spawnBurst(e.x + e.facing * 50, e.y, 24, st.color || '#ff5b7d', 14, 80);
      shake(6);
      Sound.knife();
      Sound.whoosh();
      return;
    }
    if (st.kind === 'shoryu') {
      const hit = enemyMeleeHit(e, st, e.def.damage * (st.damageMul || 1), true, false);
      for (let i = 0; i < 9; i++) {
        spawnParticle('spark', e.x + rand(-6, 6), e.y, rand(2, 44), {
          vx: rand(-30, 30), vz: rand(50, 120), color: choose(['#b57bff', '#f2d6ff', '#ffd34d']),
          size: 2, life: rand(.2, .4), gravity: 40, glow: true
        });
      }
      G.effects.push({ x: e.x, y: e.y, radius: 8, maxRadius: 42, life: .35, maxLife: .35, color: '#b57bff', width: 3 });
      if (hit) { G.flash = Math.max(G.flash, .16); shake(4); }
      Sound.whoosh();
      return;
    }
    if (st.kind === 'grab') {
      enemyGrabPlayer(e, st);
      return;
    }
    if (st.kind === 'projectile') {
      fireEnemyProjectile(e, st, {
        damage: e.def.damage * (st.damageMul || 1),
        speed: st.speed || undefined,
        big: !!st.big
      });
      return;
    }
    // melee / jump
    enemyMeleeHit(e, st, e.def.damage * (st.damageMul || 1), st.kind === 'heavy' || e.boss || !!st.knockdown, false);
    if (st.kind === 'jump') spawnDust(e.x, e.y, 3);
    if (st.landShock) {
      spawnDust(e.x, e.y, 12);
      G.effects.push({ x: e.x, y: e.y, radius: 10, maxRadius: 78, life: .45, maxLife: .45, color: '#d6b06a', width: 4 });
      shake(7);
    }
  }

  function fireEnemyProjectile(e, st, opts) {
    const o = opts || {};
    const isBullet = st.projectile === 'bullet';
    const isKnife = st.projectile === 'knife';
    const isEnergy = st.projectile === 'energy';
    const speed = o.speed || (isBullet ? 355 : isKnife ? 292 : 156);
    const yOff = o.spread ? rand(-o.spread, o.spread) : 0;
    G.projectiles.push({
      x: e.x + e.facing * (isBullet ? 15 : isKnife ? 18 : 20),
      y: e.y + yOff,
      z: isBullet ? 17 : isKnife ? 20 : 12,
      vx: e.facing * speed,
      damage: o.damage == null ? e.def.damage : o.damage,
      life: isBullet ? 1.8 : isKnife ? 2.2 : 2.5,
      color: isBullet ? '#ffe27a' : isKnife ? '#dff2ff' : (e.type === 'vprime' ? '#ff5b6d' : e.type === 'vector' ? '#b57bff' : '#ff7a3d'),
      owner: e, friendly: false,
      kind: isBullet ? 'bullet' : isKnife ? 'knife' : 'energy',
      spin: isKnife ? rand(18, 26) : 0,
      big: !!o.big,
      dir: e.facing
    });
    if (isBullet) {
      spawnBurst(e.x + e.facing * 22, e.y + yOff, 19, '#ffe27a', o.mg ? 2 : 4, o.mg ? 16 : 24);
      if (o.mg) Sound.mg(); else Sound.gunshot();
    } else if (isKnife) {
      spawnBurst(e.x + e.facing * 20, e.y, 22, '#dff2ff', 3, 20);
      Sound.knife();
    } else {
      spawnBurst(e.x + e.facing * 24, e.y + yOff, 22, isEnergy && e.type === 'vprime' ? '#ff5b6d' : '#ff7a3d', 4, 26);
      Sound.whoosh();
    }
  }

  function enemyMeleeHit(e, st, damage, knockdown, comboHit) {
    const p = G.player;
    if (!p || p.state === 'dead' || p.state === 'down') return false;
    const dx = (p.x - e.x) * e.facing;
    const depth = Math.abs(p.y - e.y);
    const reach = st.range + (e.def.hitbox || 10) * .25;
    const height = st.height || (st.kind === 'jump' ? 24 : 15);
    if (dx > -8 && dx < reach && depth < 20 && p.z < height) {
      return hurtPlayer(damage, e.x, knockdown, comboHit);
    }
    return false;
  }

  function updateEnemy(e, dt) {
    e.anim += dt;
    e.stateTime += dt;
    if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt);
    if (e.invuln > 0) e.invuln = Math.max(0, e.invuln - dt);

    if (e.dead) {
      e.deadTimer += dt;
      e.z += e.vz * dt;
      e.vz -= GRAVITY * dt;
      e.x += e.vx * dt;
      e.vx *= Math.max(0, 1 - dt * 3.2);
      if (e.z <= 0) { e.z = 0; e.vz = 0; }
      return;
    }

    // Keep interrupted jumpers from floating after their attack is cancelled.
    if (e.z > 0 && !e.flying && e.state !== 'attack' && e.state !== 'down' && e.state !== 'thrown' && e.state !== 'grabbed') {
      e.z += e.vz * dt;
      e.vz -= GRAVITY * dt;
      if (e.z <= 0) { e.z = 0; e.vz = 0; }
    }

    if (e.state === 'grabbing') {
      updateEnemyGrabbing(e, dt);
      return;
    }

    if (e.state === 'grabbed') {
      return;
    }

    if (e.state === 'thrown') {
      updateEnemyThrown(e, dt);
      return;
    }

    if (e.state === 'down') {
      updateEnemyDown(e, dt);
      return;
    }

    if (e.state === 'hurt') {
      e.x += e.vx * dt;
      e.vx *= Math.max(0, 1 - dt * 6);
      if (e.stateTime > (e.boss ? .18 : .27)) {
        e.state = 'chase';
        e.stateTime = 0;
        e.pose = 'idle';
        e.cooldown = Math.min(e.cooldown, rand(.2, .55));
      }
      return;
    }

    if (e.state === 'wait') {
      e.enterDelay -= dt;
      if (e.enterDelay <= 0) e.state = 'enter';
      return;
    }

    if (e.state === 'enter') {
      e.x += (e.fromLeft ? 1 : -1) * e.speed * 1.7 * dt;
      e.y += Math.sin(e.anim * 6) * 3 * dt;
      if (e.fromLeft ? e.x > G.camera.x + 26 : e.x < G.camera.x + W - 26) {
        e.state = 'chase';
        e.stateTime = 0;
        spawnDust(e.x, e.y, 2);
      }
      return;
    }

    if (e.state === 'attack') {
      updateEnemyAttack(e, dt);
      if (e.state === 'attack') e.pose = e.attack ? e.attack.pose : 'punch1';
      return;
    }

    const p = G.player;
    if (!p || p.state === 'dead' || p.state === 'down') {
      e.pose = 'idle';
      e.cooldown = Math.max(e.cooldown, .35);
      return;
    }

    // Final form: sustained flight above the arena.
    if (e.type === 'vprime' && e.phase === 3) {
      updateVprimeFlight(e, dt, p);
      return;
    }

    // chase / strafe / class-specific spacing
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    if (Math.abs(dx) > 1) e.facing = dx > 0 ? 1 : -1;
    e.cooldown -= dt;
    e.dodgeCooldown -= dt;
    const absdx = Math.abs(dx);
    const targetY = clamp(p.y + e.offsetY, FLOOR_TOP, FLOOR_BOTTOM);
    const slow = e.hp / e.maxHp < .45 && e.boss ? 1.15 : 1;
    const step = e.speed * slow * dt;

    // Boxers slip attacks with a lateral step instead of standing still.
    if (e.def.dodge && e.dodgeCooldown <= 0 && p.state === 'attack' && absdx < 62 && Math.random() < .075) {
      e.y = clamp(e.y + (Math.random() < .5 ? -1 : 1) * 20, FLOOR_TOP, FLOOR_BOTTOM);
      e.invuln = Math.max(e.invuln, .16);
      e.dodgeCooldown = rand(1.2, 2.0);
      e.pose = 'walk';
      spawnDust(e.x, e.y, 2);
      Sound.whoosh();
      return;
    }

    let moveX = 0;
    const keep = e.def.keepDist;
    if (keep) {
      if (absdx < keep - 16) moveX = -sign(dx); // back off
      else if (absdx > keep + 24) moveX = sign(dx); // close in
    } else if (absdx > e.def.range - 3) {
      moveX = absdx > 4 ? sign(dx) : 0;
    }
    const moveY = Math.abs(dy) > 8 ? sign(targetY - e.y) : 0;
    if (moveX || moveY) {
      e.x += moveX * step;
      e.y += moveY * step * .72;
      e.pose = 'walk';
      e.state = 'chase';
    } else {
      e.pose = 'idle';
      e.y += Math.sin(e.anim * 2.2 + e.seed) * 7 * dt;
    }
    const attackReach = e.def.attackRange || e.def.range;
    const band = keep ? absdx <= keep + 32 : absdx <= attackReach + 3;
    if (band && Math.abs(dy) < 16 && e.cooldown <= 0 && canEnemyAttack(e)) {
      startEnemyAttack(e);
      return;
    }
    e.y = clamp(e.y, FLOOR_TOP, FLOOR_BOTTOM);
  }

  function updateVprimeFlight(e, dt, p) {
    e.flying = true;
    e.cooldown -= dt;
    e.facing = p.x >= e.x ? 1 : -1;
    const targetZ = 22 + Math.sin(e.anim * 2.2) * 3;
    e.z += (targetZ - e.z) * Math.min(1, dt * 4.5);
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.abs(dx);
    const step = e.speed * 1.9 * dt;
    if (dist > 36) e.x += sign(dx) * step;
    else if (dist < 18) e.x -= sign(dx) * step * .8;
    if (Math.abs(dy) > 7) e.y += sign(dy) * step * .9;
    e.y = clamp(e.y, FLOOR_TOP, FLOOR_BOTTOM);
    e.y = clamp(e.y + Math.sin(e.anim * 1.6 + e.seed) * 6 * dt, FLOOR_TOP, FLOOR_BOTTOM);
    e.pose = 'jump';
    if (Math.random() < .55) {
      spawnParticle('spark', e.x - e.facing * rand(2, 10), e.y, e.z + rand(-3, 8), {
        vx: -e.facing * rand(18, 54), vz: rand(-26, 8),
        color: choose(['#ffd34d', '#ff5b6d', '#fff0b0']), size: 2,
        life: rand(.12, .26), gravity: 0, drag: 2.4, glow: true
      });
    }
    if (e.cooldown <= 0) startEnemyAttack(e);
  }

  function enemyGrabPlayer(e, st) {
    const p = G.player;
    if (!p || p.state === 'dead' || p.state === 'down' || p.state === 'grabbed' || p.state === 'thrown') return false;
    if (p.invuln > 0 || p.z > 15) return false;
    const dx = (p.x - e.x) * e.facing;
    const depth = Math.abs(p.y - e.y);
    const reach = (st.range || 30) + (e.def.hitbox || 10) * .35;
    if (dx < -8 || dx > reach || depth > 20) return false;
    if (p.heldEnemy) releaseGrab();
    p.state = 'grabbed';
    p.stateTime = 0;
    p.grabbedBy = e;
    p.attack = null;
    p.vx = 0; p.vz = 0; p.vy = 0;
    p.z = 8;
    p.invuln = Math.max(p.invuln, .7);
    p.comboBuffer = 0;
    p.queuedAttack = false;
    Input.attackQueue = 0;
    e.state = 'grabbing';
    e.stateTime = 0;
    e.grabbing = true;
    e.grabTimer = .58;
    e.attack = null;
    e.attacking = false;
    e.pose = 'throw';
    spawnFloater(e.x, e.y, 42, 'GRAB!', '#ffcf5a');
    Sound.whoosh();
    shake(2.5);
    return true;
  }

  function updateEnemyGrabbing(e, dt) {
    const p = G.player;
    e.grabTimer -= dt;
    e.pose = 'throw';
    if (!p || p.state !== 'grabbed' || p.grabbedBy !== e) {
      e.state = 'chase';
      e.stateTime = 0;
      e.grabbing = false;
      e.attack = null;
      e.cooldown = rand(e.def.coolMin, e.def.coolMax);
      if (p && p.state === 'grabbed') { p.state = 'idle'; p.grabbedBy = null; p.invuln = Math.max(p.invuln, .35); }
      return;
    }
    p.x = e.x - e.facing * 2;
    p.y = e.y;
    p.z = 8 + (1 - clamp(e.grabTimer / .58, 0, 1)) * 14;
    p.vx = 0; p.vz = 0;
    if (e.grabTimer <= 0) enemyThrowGrabbed(e);
  }

  function enemyThrowGrabbed(e) {
    const p = G.player;
    if (!p || p.state !== 'grabbed') {
      e.state = 'chase';
      e.grabbing = false;
      e.cooldown = rand(e.def.coolMin, e.def.coolMax);
      return;
    }
    p.grabbedBy = null;
    p.state = 'thrown';
    p.stateTime = 0;
    p.z = 22;
    p.vz = 175;
    p.vx = -e.facing * 250;
    p.throwDamage = Math.round(e.def.damage * 1.35);
    p.throwFromX = e.x;
    p.invuln = .2;
    p.bounced = false;
    p.attack = null;
    p.heldEnemy = null;
    e.state = 'chase';
    e.stateTime = 0;
    e.grabbing = false;
    e.attack = null;
    e.pose = 'idle';
    e.cooldown = rand(e.def.coolMin, e.def.coolMax);
    spawnFloater(e.x, e.y, 46, 'SHOULDER THROW!', '#ffcf5a');
    spawnDust(e.x, e.y, 6);
    Sound.throw();
    shake(5);
  }

  function updateEnemyDown(e, dt) {
    e.z += e.vz * dt;
    e.vz -= GRAVITY * dt;
    e.x += e.vx * dt;
    e.vx *= Math.max(0, 1 - dt * 3.2);
    e.downTimer -= dt;
    if (e.z <= 0) {
      e.z = 0;
      if (!e.bounced && e.vz < -80) {
        e.vz = 46;
        e.bounced = true;
        spawnDust(e.x, e.y, 4);
        Sound.land();
      } else {
        e.vz = 0;
      }
    }
    if (e.downTimer <= 0 && !e.willDie) {
      e.state = 'chase';
      e.stateTime = 0;
      e.pose = 'idle';
      e.invuln = .55;
      e.cooldown = rand(.2, .55);
      e.bounced = false;
    }
  }

  function updateEnemyThrown(e, dt) {
    e.z += e.vz * dt;
    e.vz -= GRAVITY * dt;
    e.x += e.vx * dt;
    e.vx *= Math.max(0, 1 - dt * 1.8);
    e.downTimer -= dt;
    if (e.thrownHitSet) {
      for (const other of G.enemies) {
        if (other === e || other.dead || other.state === 'thrown' || other.state === 'grabbed') continue;
        if (e.thrownHitSet.has(other)) continue;
        if (Math.abs(other.x - e.x) < 18 && Math.abs(other.y - e.y) < 14) {
          e.thrownHitSet.add(other);
          const dir = sign(other.x - e.x || e.facing);
          hitEnemy(other, 9, dir, { kb: 120, knockdown: true, color: '#29e7ff' });
          shake(3);
        }
      }
    }
    if (e.z <= 0) {
      e.z = 0;
      e.vz = 0;
      e.thrown = false;
      e.state = 'down';
      e.stateTime = 0;
      e.downTimer = Math.max(.8, e.downTimer);
      spawnDust(e.x, e.y, 6);
      Sound.land();
      if (e.hp <= 0 || e.willDie) {
        killEnemy(e, e.facing, true);
      }
    }
  }

  function advanceVprimePhase(e) {
    const ratio = e.hp / e.maxHp;
    if (e.phase === 1 && ratio <= 2 / 3) {
      e.phase = 2;
      e.invuln = 1.5;
      e.attack = null;
      e.attacking = false;
      e.state = 'chase';
      e.stateTime = 0;
      e.cooldown = 1.05;
      e.weapon = null;
      e.def.keepDist = 0;
      e.def.ranged = false;
      e.def.attackRange = 88;
      e.def.damage = 13;
      e.def.coolMin = .48;
      e.def.coolMax = .88;
      e.speed = 56;
      e.char = { ...e.char, colors: { ...e.char.colors, top: '#33101b', topShade: '#1a060d', accent: '#ff3d2e', sleeve: '#280c15' } };
      G.effects.push({ x: e.x, y: e.y, radius: 12, maxRadius: 120, life: .6, maxLife: .6, color: '#ff3d2e', width: 5 });
      spawnBurst(e.x, e.y, 20, '#ff3d2e', 18, 100);
      G.flash = Math.max(G.flash, .38);
      shake(8);
      announce('PHASE 2', 'HEAVY COMBAT // 暴走', '#ff5b3d', 2.2);
      Sound.special();
      updateHud();
      return true;
    }
    if (e.phase === 2 && ratio <= 1 / 3) {
      e.phase = 3;
      e.invuln = 1.6;
      e.attack = null;
      e.attacking = false;
      e.state = 'chase';
      e.stateTime = 0;
      e.cooldown = .9;
      e.flying = true;
      e.z = 26;
      e.vz = 0;
      e.weapon = null;
      e.def.damage = 15;
      e.def.keepDist = 0;
      e.def.ranged = false;
      e.def.coolMin = .42;
      e.def.coolMax = .78;
      e.speed = 62;
      e.char = { ...e.char, colors: { ...e.char.colors, top: '#101826', topShade: '#070b12', accent: '#ffd34d', sleeve: '#0b111b' } };
      G.effects.push({ x: e.x, y: e.y, radius: 14, maxRadius: 150, life: .7, maxLife: .7, color: '#ffd34d', width: 5 });
      spawnBurst(e.x, e.y, 26, '#ffd34d', 22, 110);
      G.flash = Math.max(G.flash, .45);
      shake(10);
      announce('PHASE 3', 'SKY BREAKER // 天翔', '#ffd34d', 2.4);
      Sound.special();
      updateHud();
      return true;
    }
    return false;
  }

  function hitEnemy(e, damage, dir, opts) {
    if (!e || e.dead || e.invuln > 0) return false;
    const o = opts || {};
    const dmg = Math.max(1, Math.round(damage));
    e.hp -= dmg;
    e.hitFlash = .12;
    e.attack = null;
    e.attacking = false;
    G.combo++;
    G.comboTimer = 1.85;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    const mult = 1 + Math.min(1.2, G.combo * .055);
    const points = Math.round(dmg * 10 * mult);
    G.score += points;
    G.lastScoreGain = points;
    G.hitstop = Math.max(G.hitstop, e.boss ? .028 : .045);
    shake(e.boss ? 3.5 : dmg >= 7 ? 4.5 : 2.6);
    spawnBurst(e.x, e.y, e.z + 17, o.color || '#ffd23f', dmg >= 8 ? 10 : 6, dmg * 5);
    spawnFloater(e.x, e.y, e.z + 32, String(dmg), o.color || '#ffd23f');
    Sound.punch(dmg >= 7 || e.boss);
    if (e.hp <= 0) {
      killEnemy(e, dir, false);
      return true;
    }
    if (e.type === 'vprime' && advanceVprimePhase(e)) return true;
    const kb = o.kb == null ? 35 : o.kb;
    if (o.knockdown || (!e.def.armor && dmg >= 8)) {
      e.state = 'down';
      e.stateTime = 0;
      e.z = Math.max(e.z, 1);
      e.vz = Math.max(70, kb * .55);
      e.vx = dir * kb;
      e.downTimer = e.boss ? .72 : 1.0;
      e.bounced = false;
      e.pose = 'down';
    } else if (e.def.armor) {
      e.vx = dir * kb * .22;
      e.stateTime = 0;
      e.pose = 'idle';
    } else {
      e.state = 'hurt';
      e.stateTime = 0;
      e.vx = dir * kb;
      e.pose = 'hurt';
    }
    return true;
  }

  function killEnemy(e, dir, silent) {
    if (!e || e.dead) return;
    if (e.state === 'grabbing' && G.player && G.player.grabbedBy === e) {
      G.player.grabbedBy = null;
      G.player.state = 'idle';
      G.player.z = 0;
      G.player.invuln = Math.max(G.player.invuln, .5);
    }
    e.grabbing = false;
    e.dead = true;
    e.state = 'dead';
    e.stateTime = 0;
    e.deadTimer = 0;
    e.hp = 0;
    e.z = Math.max(e.z, 1);
    e.vz = 95;
    e.vx = (dir || 1) * 110;
    e.attack = null;
    e.attacking = false;
    G.combo++;
    G.comboTimer = 1.9;
    G.maxCombo = Math.max(G.maxCombo, G.combo);
    G.score += e.def.score;
    spawnBurst(e.x, e.y, 20, '#ff5b6d', 12, 60);
    spawnBurst(e.x, e.y, 14, '#ffd23f', 7, 45);
    spawnFloater(e.x, e.y, 36, `+${e.def.score}`, '#ffd23f');
    if (!silent) Sound.ko();
    shake(5);
    if (G.battle) G.battle.remaining = Math.max(0, G.battle.remaining - 1);
    maybeDropEnemyLoot(e);
    if (e.boss) {
      const anotherBoss = [G.boss, G.boss2].some(b => b && b !== e && !b.dead);
      G.bossDefeated = !anotherBoss;
      G.battle && (G.battle.cleared = false);
      if (anotherBoss) {
        G.flash = Math.max(G.flash, .32);
        G.hitstop = Math.max(G.hitstop, .12);
        announce('K.O.', `${e.def.name} // DOWN — 1 LEFT`, '#ffd23f', 2.2);
      } else {
        // dramatic finish
        G.flash = .8;
        G.hitstop = .22;
        announce('K.O.', `${e.def.name} // DOWN`, '#ffd23f', 2.8);
        Sound.stopMusic();
        setTimeout(() => Sound.bossDown(), 180);
      }
    }
    updateHud();
  }

  // ————————————————————————————————————————————————
  // ITEMS / CRATES / PROJECTILES
  // ————————————————————————————————————————————————
  const HEAL_ITEMS = { apple: 24, soda: 18, burger: 40, medkit: 60 };
  const SCORE_ITEMS = { cash: 500, moneybag: 1200, gold: 3000 };
  const ITEM_NAMES = {
    apple: '苹果', soda: '汽水', burger: '汉堡', medkit: '医疗包',
    cash: '现金', moneybag: '钱袋', gold: '金条',
    pipe: '钢管', knife: '小刀', pistol: '手枪'
  };

  function addItem(type, x, y, extra) {
    const item = { kind: 'item', type, x, y, anim: 0, ...(extra || {}) };
    G.items.push(item);
    return item;
  }

  function rollCrateLoot() {
    const p = G.player;
    const lowHp = p && p.hp / p.maxHp < .45;
    if (lowHp && Math.random() < .55) {
      return choose(['apple', 'burger', 'medkit', 'soda']);
    }
    const roll = Math.random() * 100;
    if (roll < 14) return 'apple';
    if (roll < 22) return 'burger';
    if (roll < 30) return 'soda';
    if (roll < 34) return 'medkit';
    if (roll < 54) return 'cash';
    if (roll < 62) return 'moneybag';
    if (roll < 65) return 'gold';
    if (roll < 73) return 'pipe';
    if (roll < 83) return 'knife';
    if (roll < 90) return 'pistol';
    return null;
  }

  function damageCrate(c, amount) {
    if (c.dead) return;
    c.hp -= amount;
    c.flash = .1;
    spawnBurst(c.x, c.y, 14, '#d5b282', 4, 30);
    if (c.hp <= 0) {
      c.dead = true;
      G.score += 40;
      spawnBurst(c.x, c.y, 12, c.type === 'barrel' ? '#c75a42' : '#a77b54', 12, 70);
      Sound.break();
      shake(3.5);
      const type = rollCrateLoot();
      if (type) {
        const extra = type === 'pistol' ? { ammo: 6 } : {};
        addItem(type, c.x + rand(-5, 5), c.y + rand(-2, 3), extra);
      }
    }
  }

  function pickupItem(item) {
    const p = G.player;
    const heal = HEAL_ITEMS[item.type];
    if (heal && p.hp >= p.maxHp) {
      toast('血量已满，这个先留着。', 1.2);
      return;
    }
    const idx = G.items.indexOf(item);
    if (idx >= 0) G.items.splice(idx, 1);
    if (heal) {
      const before = p.hp;
      p.hp = Math.min(p.maxHp, p.hp + heal);
      const gained = Math.round(p.hp - before);
      spawnFloater(p.x, p.y, 34, `+${gained}`, '#57e389');
      spawnBurst(p.x, p.y, 22, '#57e389', 8, 45);
      Sound.heal();
      toast(`${ITEM_NAMES[item.type]}。恢复 ${gained} HP。`, 1.4);
    } else if (SCORE_ITEMS[item.type]) {
      const value = SCORE_ITEMS[item.type];
      G.score += value;
      spawnFloater(p.x, p.y, 34, `+${value}`, '#ffd23f');
      spawnBurst(p.x, p.y, 30, '#ffd76e', 10, 50);
      Sound.coin();
      toast(`${ITEM_NAMES[item.type]} +${value}`, 1.1);
    } else if (item.type === 'pipe') {
      p.weapon = 'pipe';
      p.weaponDur = WEAPONS.pipe.dur;
      p.ammo = 0;
      spawnFloater(p.x, p.y, 34, 'PIPE!', '#29e7ff');
      Sound.pickup();
      toast('钢管到手。攻击范围更远。', 1.6);
    } else if (item.type === 'knife') {
      p.weapon = 'knife';
      p.weaponDur = WEAPONS.knife.dur;
      p.ammo = 0;
      spawnFloater(p.x, p.y, 34, 'KNIFE!', '#dff4ff');
      Sound.pickup();
      toast('小刀到手。出刀快，伤害高。', 1.6);
    } else if (item.type === 'pistol') {
      const carried = p.weapon === 'pistol' ? p.ammo : 0;
      p.weapon = 'pistol';
      p.weaponDur = 0;
      p.ammo = Math.min(WEAPONS.pistol.ammo, carried + (item.ammo || WEAPONS.pistol.ammo));
      spawnFloater(p.x, p.y, 34, `${p.ammo} BULLETS`, '#ffe27a');
      Sound.pickup();
      toast(`手枪到手。${p.ammo} 发子弹，按 J 射击。`, 1.9);
    }
    updateHud();
  }

  function maybeDropEnemyLoot(e) {
    if (!e || e.boss) return;
    if (e.type === 'gunner' && Math.random() < .42) {
      addItem('pistol', e.x, e.y, { ammo: 3 });
      return;
    }
    if (e.type === 'viper' && Math.random() < .3) {
      addItem('knife', e.x, e.y);
      return;
    }
    if (e.type === 'siren' && Math.random() < .2) {
      addItem('soda', e.x, e.y);
      return;
    }
    if (e.type === 'wrecker' && Math.random() < .24) {
      addItem('burger', e.x, e.y);
      return;
    }
    if (e.type === 'blade' && Math.random() < .24) {
      addItem('knife', e.x, e.y);
      return;
    }
    if (e.type === 'boxer' && Math.random() < .16) {
      addItem('burger', e.x, e.y);
      return;
    }
    if (Math.random() < .10) {
      addItem(Math.random() < .65 ? 'cash' : 'moneybag', e.x, e.y);
      return;
    }
    if (Math.random() < .11) addItem(Math.random() < .5 ? 'soda' : 'apple', e.x, e.y);
  }

  function updateProjectiles(dt) {
    const p = G.player;
    for (const pr of G.projectiles) {
      pr.x += pr.vx * dt;
      pr.life -= dt;
      if (pr.kind === 'knife' && Math.random() < .55) {
        spawnParticle('spark', pr.x, pr.y, pr.z, {
          vx: -sign(pr.vx) * rand(24, 52), vz: rand(-6, 22),
          color: '#dff8ff', size: rand(1, 2), life: rand(.1, .2), gravity: 80, drag: 2, glow: true
        });
      }
      if (pr.friendly) {
        for (const e of G.enemies) {
          if (e.dead || e.state === 'grabbed' || e.state === 'down') continue;
          if (Math.abs(pr.x - e.x) > 10 + (e.def.hitbox || 10) * .3) continue;
          if (Math.abs(pr.y - e.y) > 12) continue;
          const dir = pr.dir || sign(pr.vx);
          hitEnemy(e, pr.damage, dir, { kb: 42, knockdown: !!pr.knockdown, color: '#ffe27a' });
          spawnBurst(pr.x, pr.y, 18, '#ffe27a', 7, 45);
          pr.life = 0;
          break;
        }
        if (pr.life > 0) {
          for (const c of G.crates) {
            if (c.dead) continue;
            if (Math.abs(pr.x - c.x) < 12 && Math.abs(pr.y - c.y) < 14) {
              damageCrate(c, pr.damage * 1.1);
              spawnBurst(pr.x, pr.y, 15, '#ffd9a0', 5, 35);
              pr.life = 0;
              break;
            }
          }
        }
        continue;
      }
      if (!p || p.state === 'dead') continue;
      const hitR = pr.big ? 17 : 10;
      if (Math.abs(pr.x - p.x) < hitR && Math.abs(pr.y - p.y) < hitR && p.z < (pr.big ? 20 : 13)) {
        if (hurtPlayer(pr.damage, pr.x, true)) {
          pr.life = 0;
          spawnBurst(pr.x, pr.y, 20, pr.color, 8, 45);
        }
      }
    }
    G.projectiles = G.projectiles.filter(pr => pr.life > 0 && pr.x > G.camera.x - 90 && pr.x < G.camera.x + W + 110);
  }

  function updateCrates(dt) {
    for (const c of G.crates) {
      if (c.flash > 0) c.flash = Math.max(0, c.flash - dt);
    }
    G.crates = G.crates.filter(c => !c.dead || c.hold);
  }

  // ————————————————————————————————————————————————
  // COMBAT FX / TIMERS
  // ————————————————————————————————————————————————
  function spawnBurst(x, y, z, color, count, force) {
    for (let i = 0; i < count; i++) {
      G.particles.push({
        x, y, z,
        vx: rand(-1, 1) * force,
        vy: rand(-.6, .6) * force * .5,
        vz: rand(.1, 1) * force,
        life: rand(.22, .55), maxLife: .55,
        color, size: rand(1, 3), gravity: 380
      });
    }
  }

  function spawnDust(x, y, count) {
    for (let i = 0; i < count; i++) {
      G.particles.push({
        x: x + rand(-6, 6), y: y + rand(-2, 3), z: rand(0, 4),
        vx: rand(-25, 25), vy: rand(-8, 8), vz: rand(10, 40),
        life: rand(.2, .45), maxLife: .45,
        color: '#8f849d', size: rand(1, 2), gravity: 90
      });
    }
  }

  function spawnParticle(kind, x, y, z, opts) {
    const o = opts || {};
    const life = o.life == null ? .35 : o.life;
    G.particles.push({
      kind, x, y, z,
      vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0,
      life, maxLife: life,
      color: o.color || '#ffffff',
      size: o.size || 2,
      gravity: o.gravity == null ? 60 : o.gravity,
      drag: o.drag || 0,
      grow: o.grow || 0,
      glow: !!o.glow,
      spin: o.spin || 0,
      rot: o.rot || 0
    });
  }

  function spawnFloater(x, y, z, text, color) {
    G.floaters.push({
      x, y, z, text, color,
      life: .65, maxLife: .65, vz: 34
    });
  }

  function updateParticles(dt) {
    for (const p of G.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vz -= p.gravity * dt;
      if (p.drag) {
        const f = Math.max(0, 1 - p.drag * dt);
        p.vx *= f;
        p.vy *= f;
      }
      if (p.grow) p.size += p.grow * dt;
      if (p.spin) p.rot = (p.rot || 0) + p.spin * dt;
      if (p.z < 0) { p.z = 0; p.vz *= -.3; p.vx *= .6; }
    }
    G.particles = G.particles.filter(p => p.life > 0);
    for (const f of G.floaters) {
      f.life -= dt;
      f.z += f.vz * dt;
      f.vz *= .96;
    }
    G.floaters = G.floaters.filter(f => f.life > 0);
    for (const e of G.effects) {
      e.life -= dt;
      e.radius += (e.maxRadius - e.radius) * Math.min(1, dt * 7);
    }
    G.effects = G.effects.filter(e => e.life > 0);
  }

  // ————————————————————————————————————————————————
  // UPDATE FLOW
  // ————————————————————————————————————————————————
  function updateBattle(dt) {
    if (!G.battle) {
      if (!G.finishing && G.player && G.player.state !== 'dead') {
        const wave = G.stage.waves[G.waveIndex];
        if (wave && G.player.x >= wave.at) startWave(wave);
      }
      return;
    }
    if (G.battle.remaining <= 0 && !G.battle.cleared) {
      if (G.battle.boss) {
        clearBattle();
      } else {
        clearBattle();
      }
    }
  }

  function updateCamera(dt) {
    const p = G.player;
    if (!p) return;
    if (G.battle) {
      G.camera.x = G.battle.camX;
    } else {
      const target = clamp(p.x - W * .42, 0, G.stage.worldW - W);
      G.camera.x += (target - G.camera.x) * Math.min(1, dt * 6.5);
    }
    p.x = clamp(p.x, G.camera.x + 16, Math.min(G.stage.worldW - 16, G.camera.x + W - 16));
    p.y = clamp(p.y, FLOOR_TOP, FLOOR_BOTTOM);
    // keep enemies from wandering out of the locked battle screen
    for (const e of G.enemies) {
      if (e.state === 'wait' || e.state === 'enter') continue;
      e.x = clamp(e.x, G.camera.x - 24, G.camera.x + W + 36);
      e.y = clamp(e.y, FLOOR_TOP, FLOOR_BOTTOM);
    }
  }

  function separateEnemies() {
    for (let i = 0; i < G.enemies.length; i++) {
      const a = G.enemies[i];
      if (a.dead || a.state === 'down' || a.state === 'thrown' || a.state === 'grabbed') continue;
      for (let j = i + 1; j < G.enemies.length; j++) {
        const b = G.enemies[j];
        if (b.dead || b.state === 'down' || b.state === 'thrown' || b.state === 'grabbed') continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) < 14 && Math.abs(dy) < 10) {
          const pushY = (10 - Math.abs(dy)) * .38;
          const pushX = (14 - Math.abs(dx)) * .3;
          const dirY = dy === 0 ? (i % 2 ? 1 : -1) : sign(dy);
          const dirX = dx === 0 ? (i % 2 ? 1 : -1) : sign(dx);
          b.y += dirY * pushY;
          a.y -= dirY * pushY * .5;
          b.x += dirX * pushX;
          a.x -= dirX * pushX * .5;
        }
      }
    }
  }

  function updatePlaying(dt) {
    G.stageTime += dt;
    if (G.hitstop > 0) {
      G.hitstop -= dt;
      updateParticles(dt * .25);
      G.damageFlash = Math.max(0, G.damageFlash - dt * 3);
      updateHud();
      return;
    }
    updatePlayer(dt);
    for (const e of G.enemies) updateEnemy(e, dt);
    separateEnemies();
    updateProjectiles(dt);
    updateCrates(dt);
    updateBattle(dt);
    updateCamera(dt);
    updateParticles(dt);
    if (G.comboTimer > 0) {
      G.comboTimer -= dt;
      if (G.comboTimer <= 0) G.combo = 0;
    }
    if (G.stageClearTimer > 0) {
      G.stageClearTimer -= dt;
      if (G.stageClearTimer <= 0) showResult(true);
    }
    // remove faded corpses after delay
    G.enemies = G.enemies.filter(e => !e.dead || e.deadTimer < 1.6);
    updateHud();
  }

  function update(dt) {
    G.time += dt;
    G.damageFlash = Math.max(0, G.damageFlash - dt * 4.2);
    dom.damageFlash.style.opacity = (G.damageFlash * .85).toFixed(2);
    if (G.camera.shake > 0) G.camera.shake = Math.max(0, G.camera.shake - dt * 28);
    if (G.announce) {
      G.announce.timer -= dt;
      if (G.announce.timer <= 0) G.announce = null;
    }
    if (G.toastTimer > 0) {
      G.toastTimer -= dt;
      if (G.toastTimer <= 0) dom.toast.classList.remove('show');
    }
    G.flash = Math.max(0, G.flash - dt * 5.5);

    switch (G.mode) {
      case 'title':
        if (Input.pressed('confirm')) openSelect();
        break;
      case 'select':
        if (Input.pressed('left')) selectChar(G.selectedChar === 'rex' ? 'bruno' : G.selectedChar === 'luna' ? 'rex' : 'luna', true);
        if (Input.pressed('right')) selectChar(G.selectedChar === 'rex' ? 'luna' : G.selectedChar === 'luna' ? 'bruno' : 'rex', true);
        if (Input.pressed('confirm')) {
          Sound.select();
          beginRun(G.selectedChar);
        }
        if (Input.pressed('pause')) openTitle(true);
        break;
      case 'intro':
        G.introTimer -= dt;
        G.player.anim += dt;
        if (G.introTimer <= 0 || Input.pressed('confirm')) startPlay();
        break;
      case 'playing':
        updatePlaying(dt);
        if (Input.pressed('pause')) pauseGame();
        break;
      case 'paused':
        if (Input.pressed('pause') || Input.pressed('confirm')) resumeGame();
        break;
      case 'result':
        if (Input.pressed('confirm') || Input.pressed('attack')) nextFromResult();
        break;
      case 'gameover':
        if (Input.pressed('confirm') || Input.pressed('attack')) retryStage();
        break;
    }
  }

  // ————————————————————————————————————————————————
  // RESULTS / PAUSE / GAME OVER
  // ————————————————————————————————————————————————
  function calcGrade() {
    const t = G.stageTime;
    const h = G.stats.hitsTaken;
    let score = 0;
    if (t < 130) score += 2; else if (t < 190) score += 1;
    if (h <= 1) score += 3; else if (h <= 3) score += 2; else if (h <= 6) score += 1;
    if (G.maxCombo >= 20) score += 2; else if (G.maxCombo >= 12) score += 1;
    if (score >= 5) return 'S';
    if (score >= 3) return 'A';
    if (score >= 2) return 'B';
    return 'C';
  }

  function showResult(cleared) {
    if (!cleared) return;
    const final = G.stageIndex >= STAGES.length - 1;
    G.finalVictory = final;
    setMode('result');
    clearOverlays();
    show(dom.result, true);
    show(dom.hud, false);
    show(dom.bossUI, false);
    G.battle = null;
    G.finishing = false;
    G.stageClearTimer = 0;
    if (G.player) {
      G.player.state = 'idle';
      G.player.vx = 0;
      G.player.invuln = 999;
    }
    const grade = calcGrade();
    const stage = G.stage;
    if (final) {
      dom.resultKicker.textContent = 'VICTORY // CITY SAVED';
      dom.resultGrade.textContent = grade;
      dom.resultTitle.textContent = '霓虹之城，天亮了';
      dom.resultCopy.textContent = '机枪、铁拳、天翔——三具身体都倒在核心。V 先生的帝国在晨曦中崩塌，城市终于安静下来。';
      dom.btnNext.querySelector('.btn-main').textContent = '再来一局';
      dom.btnNext.querySelector('.btn-sub').textContent = 'SELECT FIGHTER';
      G.score += 6000;
      Sound.victory();
    } else {
      dom.resultKicker.textContent = `STAGE ${stage.number} // CLEAR`;
      dom.resultGrade.textContent = grade;
      dom.resultTitle.textContent = stage.number === '04' ? '花园已清场' : stage.number === '05' ? '核心已停转' : '街区已清空';
      const copyByStage = {
        '01': '霓虹重新亮了起来。只是今晚，换了一群人倒下。',
        '02': '站台尽头，下一班车已经进站。你知道终点还有一个人在等。',
        '03': '天台的风停了。可 V 先生不在塔顶——他在更深的下面。',
        '04': '双子倒在霓虹灯下。电梯只剩一个按钮，向下。'
      };
      dom.resultCopy.textContent = copyByStage[stage.number] || '城市还没醒来，最后一段路在等你。';
      dom.btnNext.querySelector('.btn-main').textContent = '进入下一关';
      dom.btnNext.querySelector('.btn-sub').textContent = 'ENTER';
      Sound.playTrack('clear');
    }
    dom.resultScore.textContent = pad(G.score, 6);
    dom.resultTime.textContent = fmtTime(G.stageTime);
    dom.resultCombo.textContent = `×${G.maxCombo}`;
    dom.resultHits.textContent = String(G.stats.hitsTaken);
    saveBest();
    blurFocus();
    updateHud();
  }

  function nextFromResult() {
    if (G.mode !== 'result') return;
    Sound.stopMusic();
    if (G.finalVictory) {
      G.finalVictory = false;
      G.score = 0;
      G.lives = 3;
      openSelect();
      return;
    }
    startStage(G.stageIndex + 1);
  }

  function pauseGame() {
    if (G.mode !== 'playing') return;
    setMode('paused');
    show(dom.pause, true);
    show(dom.hud, false);
    Sound.setPaused(true);
    blurFocus();
  }

  function resumeGame() {
    if (G.mode !== 'paused') return;
    setMode('playing');
    show(dom.pause, false);
    show(dom.hud, true);
    Sound.setPaused(false);
    blurFocus();
  }

  function quitToTitle() {
    show(dom.pause, false);
    show(dom.result, false);
    show(dom.gameover, false);
    Sound.setPaused(false);
    Sound.stopMusic();
    openTitle(true);
  }

  function showGameOver() {
    if (G.mode === 'gameover') return;
    setMode('gameover');
    clearOverlays();
    show(dom.gameover, true);
    show(dom.hud, false);
    show(dom.bossUI, false);
    dom.gameoverScore.textContent = pad(G.score, 6);
    dom.gameoverStage.textContent = G.stage ? G.stage.number : '01';
    saveBest();
    Sound.stopMusic();
    Sound.gameover();
    blurFocus();
  }

  // ————————————————————————————————————————————————
  // RENDER
  // ————————————————————————————————————————————————
  function render(now) {
    const t = G.time;
    ctx.clearRect(0, 0, W, H);
    if (G.mode === 'title') {
      renderTitle(t);
    } else if (G.mode === 'select') {
      renderSelect(t);
    } else {
      renderWorld(t);
      if (G.mode === 'intro') {
        // world visible behind stage card
      }
    }
    if (G.flash > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(.75, G.flash);
      ctx.fillStyle = '#fff8e7';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    // subtle chromatic scanline edge to unify the pixel art
    ctx.save();
    ctx.globalAlpha = .06;
    ctx.fillStyle = '#29e7ff';
    ctx.fillRect(0, 0, 1, H);
    ctx.fillStyle = '#ff2e63';
    ctx.fillRect(W - 1, 0, 1, H);
    ctx.restore();
  }

  function renderTitle(t) {
    if (!G.titleVisuals) G.titleVisuals = Art.buildStage(0, 2460);
    const cam = 470 + Math.sin(t * .055) * 85;
    Art.drawBackground(ctx, 0, G.titleVisuals, cam, t, W, H);
    const trio = [
      { key: 'rex', x: 304, y: 238, pose: Math.sin(t * 1.25) > .84 ? 'punch1' : 'idle', ext: Math.sin(t * 1.25) > .84 ? 1 : 0, delay: 0 },
      { key: 'luna', x: 360, y: 246, pose: Math.sin(t * 1.25 + 1.1) > .88 ? 'kick' : 'idle', ext: Math.sin(t * 1.25 + 1.1) > .88 ? 1 : 0, delay: 1.2 },
      { key: 'bruno', x: 424, y: 234, pose: 'idle', ext: 0, delay: 2.1 }
    ];
    trio.sort((a, b) => a.y - b.y);
    for (const f of trio) {
      Art.drawShadow(ctx, f.x, f.y, 0, 1.3, .42);
      Art.drawFighter(ctx, {
        x: f.x, y: f.y, z: 0, facing: -1, scale: 1.42,
        char: Art.CHARS[f.key], pose: f.pose, ext: f.ext,
        anim: t + f.delay, alpha: .98, rim: Art.CHARS[f.key].colors.accent
      });
    }
    // foreground haze
    const grad = ctx.createLinearGradient(0, 180, 0, 270);
    grad.addColorStop(0, 'rgba(5,3,10,0)');
    grad.addColorStop(1, 'rgba(5,3,10,.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 170, W, 100);
  }

  function renderSelect(t) {
    if (!G.titleVisuals) G.titleVisuals = Art.buildStage(0, 2460);
    Art.drawBackground(ctx, 0, G.titleVisuals, 950, t, W, H);
    const vg = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 300);
    vg.addColorStop(0, 'rgba(4,2,10,.15)');
    vg.addColorStop(1, 'rgba(4,2,10,.78)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
    renderSelectPreviews(t);
  }

  let previewFrame = 0;
  function renderSelectPreviews(t) {
    previewFrame++;
    if (previewFrame % 2) return;
    const cards = document.querySelectorAll('.char-card');
    cards.forEach(card => {
      const canvas = card.querySelector('.char-preview');
      if (!canvas) return;
      const g = canvas.getContext('2d');
      g.imageSmoothingEnabled = false;
      Art.drawPreview(g, canvas.width, canvas.height, card.dataset.char, t);
    });
  }

  function drawGoIndicator(t) {
    if (G.mode !== 'playing' || G.battle || G.finishing || !G.player || G.player.state === 'dead') return;
    if (G.waveIndex >= G.stage.waves.length) return;
    const pulse = .72 + Math.sin(t * 5) * .25;
    const x = W - 36, y = 164;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = pulse;
    ctx.shadowColor = '#ffd23f';
    ctx.shadowBlur = 8;
    ctx.font = '900 italic 13px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0a0710';
    ctx.strokeText('GO!', 0, 0);
    ctx.fillStyle = '#ffe36e';
    ctx.fillText('GO!', 0, 0);
    ctx.font = '900 17px "Arial Black", Impact, sans-serif';
    ctx.strokeText('→', 0, 16);
    ctx.fillText('→', 0, 16);
    ctx.restore();
  }

  function drawWarnings() {
    for (const e of G.enemies) {
      if (e.dead || !e.attack || e.attack.style.kind !== 'aoe') continue;
      const a = e.attack;
      if (a.timer > a.style.startup) continue;
      const prog = clamp(a.timer / a.style.startup, 0, 1);
      const x = e.x - G.camera.x;
      const r = (a.style.radius || 60) * (.35 + prog * .65);
      ctx.save();
      ctx.globalAlpha = .22 + prog * .35;
      ctx.strokeStyle = '#ff3358';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.ellipse(x, e.y, r, r * .36, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = .08;
      ctx.fillStyle = '#ff3358';
      ctx.fill();
      ctx.restore();
    }
  }

  function entityPose(e) {
    if (e.kind === 'player') {
      const p = e;
      if (p.state === 'grabbed') return { pose: 'hurt', ext: 0 };
      if (p.state === 'thrown') return { pose: 'down', ext: 0 };
      if (p.state === 'dead' || p.state === 'down') return { pose: 'down', ext: 0 };
      if (p.state === 'hurt') return { pose: 'hurt', ext: 0 };
      if (p.state === 'jump') return { pose: 'jump', ext: 0 };
      if (p.state === 'jumpkick') return { pose: 'jumpkick', ext: 1 };
      if (p.state === 'run') return { pose: 'run', ext: 0 };
      if (p.state === 'dashattack' && p.attack) {
        const d = p.attack.data;
        let ext = 1;
        if (p.attack.timer < d.startup) ext = easeOut(p.attack.timer / d.startup) * .7;
        else if (p.attack.timer > d.startup + d.active) ext = Math.max(.2, 1 - (p.attack.timer - d.startup - d.active) / d.recovery * .8);
        return { pose: d.pose, ext };
      }
      if (p.state === 'special') return { pose: 'special', ext: 1 };
      if (p.state === 'grab') return { pose: 'grab', ext: 1 };
      if (p.state === 'throw') return { pose: 'throw', ext: 1 };
      if (p.state === 'attack' && p.attack) {
        const a = p.attack;
        const d = a.data;
        let ext = 1;
        if (a.timer < d.startup) ext = easeOut(a.timer / d.startup) * .65;
        else if (a.timer > d.startup + d.active) ext = Math.max(.2, 1 - (a.timer - d.startup - d.active) / d.recovery * .8);
        return { pose: d.pose, ext };
      }
      if (p.state === 'walk') return { pose: 'walk', ext: 0 };
      return { pose: 'idle', ext: 0 };
    }
    if (e.dead || e.state === 'dead' || e.state === 'thrown' || e.state === 'down') {
      return { pose: 'down', ext: 0 };
    }
    if (e.state === 'grabbing') return { pose: 'throw', ext: 1 };
    if (e.state === 'grabbed' || e.state === 'hurt') return { pose: 'hurt', ext: 0 };
    if (e.state === 'attack' && e.attack) {
      const a = e.attack;
      let ext = 1;
      if (a.timer < a.style.startup) ext = easeOut(a.timer / a.style.startup) * .7;
      else if (a.timer > a.style.startup + a.style.active) ext = Math.max(.2, 1 - (a.timer - a.style.startup - a.style.active) / a.style.recovery * .8);
      return { pose: a.pose || 'punch1', ext };
    }
    if (e.state === 'enter' || e.pose === 'walk') return { pose: 'walk', ext: 0 };
    if (e.pose === 'jump' || e.pose === 'jumpkick') return { pose: e.pose, ext: 1 };
    return { pose: 'idle', ext: 0 };
  }

  function drawWhipFx() {
    for (const e of G.enemies) {
      const a = e.attack;
      if (!a || a.id !== 'whip' || e.dead) continue;
      const t = a.timer;
      const st = a.style;
      if (t < st.startup - .1 || t > st.startup + st.active + .16) continue;
      const prog = clamp((t - (st.startup - .1)) / (st.active + .26), 0, 1);
      const sx = e.x - G.camera.x + e.facing * 8;
      const sy = e.y - 27;
      const tipX = e.x - G.camera.x + e.facing * (28 + prog * 44);
      const tipY = sy + (prog < .55 ? -Math.sin(prog * Math.PI) * 22 : 10);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = .35 + (1 - prog) * .6;
      ctx.strokeStyle = '#ffd681';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ffb347';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(sx, sy + 2);
      ctx.quadraticCurveTo(e.x - G.camera.x + e.facing * 38, sy - 30, tipX, tipY);
      ctx.stroke();
      ctx.strokeStyle = '#fff4cf';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  function boltLine(x1, y1, x2, y2, seed) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i <= 5; i++) {
      const t = i / 5;
      const jx = Math.sin(seed * 3.1 + i * 4.7) * (1 - t) * 5;
      const jy = Math.cos(seed * 2.3 + i * 3.1) * 2;
      ctx.lineTo(x1 + (x2 - x1) * t + jx, y1 + (y2 - y1) * t + jy);
    }
    ctx.stroke();
  }

  function drawVprimeAura(e, sx) {
    if (e.kind !== 'enemy' || e.type !== 'vprime' || e.dead) return;
    const by = e.y - (e.z || 0);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // phase-colored pressure glow
    const col = e.phase === 3 ? '255,211,77' : '255,61,46';
    const glow = ctx.createRadialGradient(sx, by - 22, 2, sx, by - 22, 40);
    glow.addColorStop(0, `rgba(${col},.2)`);
    glow.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 44, by - 66, 88, 70);
    if (e.phase === 3) {
      const flap = Math.sin(G.time * 9) * 5;
      ctx.globalAlpha = .65;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(sx + side * 5, by - 26);
        ctx.quadraticCurveTo(sx + side * 21, by - 50 - flap, sx + side * 34, by - 36 - flap);
        ctx.quadraticCurveTo(sx + side * 24, by - 22, sx + side * 8, by - 14);
        ctx.closePath();
        ctx.fillStyle = `rgba(${col},.18)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${col},.55)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = .65;
      ctx.strokeStyle = 'rgba(255,240,176,.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(sx, by - 1, 18, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.phase === 2) {
      ctx.globalAlpha = .4;
      ctx.strokeStyle = 'rgba(255,61,46,.65)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 2; i++) {
        const lx = sx - e.facing * (16 + i * 9);
        ctx.beginPath();
        ctx.moveTo(lx, by - 14 - i * 7);
        ctx.lineTo(lx - e.facing * 12, by - 14 - i * 7);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawDashAura(e, sx) {
    if (e.kind !== 'player' || e.state !== 'dashattack') return;
    const dash = PLAYER_STATS[e.charKey].dash;
    if (!dash.fx) return;
    const dir = e.facing;
    const by = e.y - (e.z || 0);
    const tick = Math.floor(G.time * 45);

    if (dash.fx === 'fire') {
      const flick = 1 + Math.sin(G.time * 42) * .14;
      const bx = sx - dir * 6;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      // outer flame tongue
      ctx.globalAlpha = .34;
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.moveTo(bx, by - 9);
      ctx.quadraticCurveTo(bx - dir * 26, by - 42 * flick, bx - dir * 62, by - 18);
      ctx.quadraticCurveTo(bx - dir * 30, by - 4, bx, by - 5);
      ctx.closePath();
      ctx.fill();
      // mid flame
      ctx.globalAlpha = .55;
      ctx.fillStyle = '#ff8a1e';
      ctx.beginPath();
      ctx.moveTo(bx, by - 11);
      ctx.quadraticCurveTo(bx - dir * 20, by - 30 * flick, bx - dir * 42, by - 16);
      ctx.quadraticCurveTo(bx - dir * 22, by - 7, bx, by - 8);
      ctx.closePath();
      ctx.fill();
      // white-hot core
      ctx.globalAlpha = .8;
      ctx.fillStyle = '#ffe9a3';
      ctx.beginPath();
      ctx.moveTo(bx, by - 14);
      ctx.quadraticCurveTo(bx - dir * 12, by - 22 * flick, bx - dir * 24, by - 15);
      ctx.quadraticCurveTo(bx - dir * 12, by - 11, bx, by - 12);
      ctx.closePath();
      ctx.fill();
      // ground sparks
      ctx.globalAlpha = .7;
      ctx.strokeStyle = '#ffb03a';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const lx = bx - dir * (10 + i * 14);
        const ly = by - 2;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - dir * 4, ly - 8 - (i % 2) * 4);
        ctx.stroke();
      }
      ctx.restore();
    } else if (dash.fx === 'bolt') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      // electric cage around the body
      for (let i = 0; i < 3; i++) {
        const seed = tick * 1.7 + i * 5.3;
        const y1 = by - 8 - i * 9;
        const x1 = sx + (i - 1) * 7;
        const x2 = sx - dir * (26 + i * 12) + Math.sin(seed) * 6;
        const y2 = by - 16 + Math.cos(seed) * 10;
        ctx.globalAlpha = .4;
        ctx.strokeStyle = '#2fd8ff';
        ctx.lineWidth = 3;
        boltLine(x1, y1, x2, y2, seed);
        ctx.globalAlpha = .95;
        ctx.strokeStyle = '#d7fdff';
        ctx.lineWidth = 1;
        boltLine(x1, y1, x2, y2, seed);
      }
      // ground ring
      ctx.globalAlpha = .55;
      ctx.strokeStyle = '#7ef4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx, by, 20, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      const puffs = 5;
      for (let i = 0; i < puffs; i++) {
        const t = (G.time * 1.6 + i * .23) % 1;
        const r = 5 + t * 13;
        const x = sx - dir * (6 + t * 48);
        const y = by - 5 - t * 9 + Math.sin(i * 2.1 + G.time * 5) * 2;
        const g = ctx.createRadialGradient(x, y, r * .2, x, y, r);
        g.addColorStop(0, 'rgba(180,160,140,.42)');
        g.addColorStop(1, 'rgba(120,105,92,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.save();
      ctx.globalAlpha = .35;
      ctx.strokeStyle = '#6f6157';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - dir * 8, by - 1);
      ctx.lineTo(sx - dir * 34, by - 1);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawItemPrompt() {
    if (!G.player || G.player.state === 'dead' || G.mode !== 'playing') return;
    let item = null;
    let best = Infinity;
    for (const it of G.items) {
      if (!it) continue;
      const d = Math.abs(it.x - G.player.x) + Math.abs(it.y - G.player.y);
      if (Math.abs(it.x - G.player.x) < 24 && Math.abs(it.y - G.player.y) < 17 && d < best) {
        best = d;
        item = it;
      }
    }
    if (!item) return;
    const touch = document.body.classList.contains('touch-mode');
    const key = touch ? '抓' : 'E';
    const label = `${key} ${ITEM_NAMES[item.type] || ''}`;
    const x = item.x - G.camera.x + (touch ? 24 : 0);
    const y = item.y - 29;
    ctx.save();
    ctx.font = 'bold 8px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(6,4,12,.78)';
    ctx.fillRect(x - tw / 2 - 4, y - 8, tw + 8, 12);
    ctx.strokeStyle = 'rgba(255,210,63,.65)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - tw / 2 - 4, y - 8, tw + 8, 12);
    ctx.fillStyle = '#ffe27a';
    ctx.fillText(label, x, y + 1);
    ctx.restore();
  }

  function drawEntity(e) {
    const sx = e.x - G.camera.x;
    const scale = e.scale || 1;
    let alpha = 1;
    let flash = false;
    if (e.kind === 'player') {
      if (e.invuln > 0 && G.mode !== 'intro' && Math.floor(G.time * 16) % 2 === 0) alpha = .42;
      flash = e.hitFlash > 0 && Math.floor(G.time * 50) % 2 === 0;
      if (e.state === 'dead') alpha *= Math.max(.35, 1 - e.deathTimer * .24);
    } else {
      flash = e.hitFlash > 0 && ((e.type === 'titan' || e.type === 'brute' || e.type === 'boxer') ? Math.floor(G.time * 35) % 3 === 0 : Math.floor(G.time * 55) % 2 === 0);
      if (e.dead) alpha = Math.max(0, 1 - e.deadTimer / 1.55);
      if (e.state === 'wait') alpha = 0;
    }
    if (alpha <= 0) return;
    Art.drawShadow(ctx, sx, e.y, e.z || 0, scale, e.kind === 'player' ? .38 : .32);
    drawVprimeAura(e, sx);
    const po = entityPose(e);
    drawDashAura(e, sx);
    if (e.kind === 'player' && (e.state === 'special' || e.state === 'dashattack')) {
      const ghostCount = e.state === 'special' ? 3 : 2;
      for (let i = ghostCount; i >= 1; i--) {
        Art.drawFighter(ctx, {
          x: sx - e.facing * i * (e.state === 'special' ? 7 : 18), y: e.y, z: e.z, facing: e.facing,
          scale, char: e.char, pose: po.pose, ext: po.ext, anim: e.anim - i * .05,
          alpha: .075 * (ghostCount + 1 - i), flash: false
        });
      }
    }
    if (e.kind === 'player' && (e.state === 'run' || e.state === 'dashattack')) {
      ctx.save();
      ctx.globalAlpha = e.state === 'run' ? .24 : .46;
      ctx.strokeStyle = e.state === 'run' ? '#d8cfe4' : e.char.colors.accent;
      ctx.lineWidth = 1;
      const lines = e.state === 'run' ? 2 : 3;
      for (let i = 0; i < lines; i++) {
        const lx = sx - e.facing * (18 + i * 9);
        const ly = e.y - e.z - 16 - i * 6;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx - e.facing * (e.state === 'run' ? 9 : 15), ly);
        ctx.stroke();
      }
      ctx.restore();
    }
    Art.drawFighter(ctx, {
      x: sx, y: e.y, z: e.z || 0, facing: e.facing, scale,
      char: e.char, pose: po.pose, ext: po.ext,
      anim: e.anim, flash, alpha,
      weapon: (e.kind === 'player' && e.state === 'dashattack') ? null : (e.weapon || null),
      boss: e.boss, auraColor: e.def && e.def.aura,
      rim: e.kind === 'player' ? e.char.colors.accent : (e.boss ? e.char.colors.accent : null)
    });
  }

  function drawBossAttackFx() {
    for (const e of G.enemies) {
      if (!e || e.dead || !e.attack) continue;
      const a = e.attack;
      const st = a.style;
      if (!st) continue;
      const sx = e.x - G.camera.x;
      const sy = e.y - (e.z || 0);
      const t = a.timer;
      if (a.id === 'sweep') {
        if (t < st.startup - .12 || t > st.startup + st.active + .16) continue;
        const prog = clamp((t - (st.startup - .12)) / (st.active + .3), 0, 1);
        const dir = e.facing;
        ctx.save();
        ctx.translate(sx, sy - 22);
        ctx.scale(dir, 1);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = .42 + Math.sin(prog * Math.PI) * .5;
        ctx.strokeStyle = st.color || '#ff5b7d';
        ctx.lineWidth = 7;
        ctx.shadowColor = '#ff2e63';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(18, 0, 54 + prog * 10, 32, 0, -1.22, .82);
        ctx.stroke();
        ctx.strokeStyle = '#ffe3ea';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha *= .55;
        ctx.beginPath();
        ctx.ellipse(12, 2, 40 + prog * 8, 24, 0, -1.1, .7);
        ctx.stroke();
        ctx.restore();
      } else if (a.id === 'shoryu') {
        if (t < st.startup - .1 || t > st.startup + st.active + .2) continue;
        const prog = clamp((t - (st.startup - .1)) / (st.active + .3), 0, 1);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = .5 + Math.sin(prog * Math.PI) * .4;
        const col = ctx.createLinearGradient(sx, sy - 8, sx, sy - 70);
        col.addColorStop(0, 'rgba(181,123,255,.0)');
        col.addColorStop(.55, 'rgba(181,123,255,.5)');
        col.addColorStop(1, 'rgba(255,240,255,0)');
        ctx.fillStyle = col;
        ctx.fillRect(sx - 10, sy - 72, 20, 68);
        ctx.strokeStyle = '#e8d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 8);
        ctx.quadraticCurveTo(sx + 10, sy - 38, sx - 4, sy - 66);
        ctx.stroke();
        ctx.restore();
      } else if (a.id === 'charge' || (a.id === 'blink' && t < st.startup + st.active)) {
        ctx.save();
        ctx.globalAlpha = .3;
        ctx.strokeStyle = '#ffd2a0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const lx = sx - e.facing * (14 + i * 8);
          const ly = sy - 12 - i * 6;
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - e.facing * 18, ly); ctx.stroke();
        }
        ctx.restore();
      }
    }
  }

  function drawEnemyHealthBars() {
    if (G.mode !== 'playing' && G.mode !== 'paused' && G.mode !== 'intro') return;
    for (const e of G.enemies) {
      if (e.dead || e.state === 'wait' || e.boss) continue;
      const sx = e.x - G.camera.x;
      if (sx < -32 || sx > W + 32) continue;
      const sc = e.scale || 1;
      const w = Math.round(20 * sc);
      const h = 3;
      const x = Math.round(sx - w / 2);
      const y = Math.round(e.y - (e.z || 0) - 46 * sc - 4);
      const ratio = clamp(e.hp / e.maxHp, 0, 1);
      if (ratio <= 0) continue;
      const fillW = Math.max(3, Math.round(w * ratio));
      ctx.save();
      ctx.fillStyle = 'rgba(8,5,13,.92)';
      ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
      ctx.fillStyle = '#4a2431';
      ctx.fillRect(x, y, w, h);
      let col = '#ff4b5e';
      if (ratio <= .3) col = '#ffb03a';
      if (ratio <= .14) col = Math.floor(G.time * 12) % 2 ? '#ffe36e' : '#ff4b5e';
      ctx.fillStyle = col;
      ctx.fillRect(x, y, fillW, h);
      ctx.fillStyle = 'rgba(255,255,255,.42)';
      ctx.fillRect(x, y, fillW, 1);
      // quarter notches keep the tiny bar readable at 480p
      ctx.fillStyle = 'rgba(8,5,13,.55)';
      for (let i = 1; i < 4; i++) ctx.fillRect(x + Math.round((w * i) / 4), y, 1, h);
      ctx.restore();
    }
  }

  function renderWorld(t) {
    const shakeX = G.camera.shake > .15 ? rand(-1, 1) * G.camera.shake : 0;
    const shakeY = G.camera.shake > .15 ? rand(-1, 1) * G.camera.shake * .55 : 0;
    ctx.save();
    ctx.translate(Math.round(shakeX), Math.round(shakeY));
    Art.drawBackground(ctx, G.stageIndex, G.visuals, G.camera.x, G.mode === 'paused' ? G.time : G.time, W, H);
    drawWarnings();
    drawWhipFx();
    // Ground loot sits below all fighters so prone bodies never cover pickups.
    for (const item of G.items) Art.drawItem(ctx, item.x - G.camera.x, item.y, item.type, G.time);
    const renderables = [];
    for (const c of G.crates) {
      if (c.dead) continue;
      renderables.push({ y: c.y, draw: () => Art.drawCrate(ctx, c.x - G.camera.x, c.y, c.type, c.flash > 0, G.time) });
    }
    for (const e of G.enemies) {
      renderables.push({ y: e.y, draw: () => drawEntity(e) });
    }
    if (G.player) renderables.push({ y: G.player.y, draw: () => drawEntity(G.player) });
    renderables.sort((a, b) => a.y - b.y);
    for (const r of renderables) r.draw();
    drawBossAttackFx();
    drawItemPrompt();

    // projectiles
    for (const pr of G.projectiles) {
      const x = pr.x - G.camera.x;
      const y = pr.y - pr.z;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = pr.color;
      ctx.shadowBlur = 10;
      if (pr.kind === 'bullet') {
        const dir = sign(pr.vx);
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-dir * 8, 0);
        ctx.lineTo(dir * 3, 0);
        ctx.stroke();
        ctx.fillStyle = '#fffbe0';
        ctx.fillRect(dir * 2 - 1, -1, 2, 2);
        ctx.globalAlpha = .35;
        ctx.fillStyle = pr.color;
        ctx.fillRect(-dir * 12, -1, 10, 2);
      } else if (pr.kind === 'knife') {
        const dir = sign(pr.vx);
        ctx.globalAlpha = .45;
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-dir * 26, 0);
        ctx.lineTo(-dir * 4, 0);
        ctx.stroke();
        ctx.globalAlpha = .85;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-dir * 16, -1);
        ctx.lineTo(-dir * 5, -1);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.rotate(G.time * (pr.spin || 22) * dir);
        ctx.fillStyle = '#f4fbff';
        ctx.beginPath();
        ctx.moveTo(9, 0);
        ctx.lineTo(0, -3);
        ctx.lineTo(-4, 0);
        ctx.lineTo(0, 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#b8cddd';
        ctx.fillRect(-1, 0, 4, 1);
        ctx.fillStyle = '#c79a4c';
        ctx.fillRect(-8, -1, 5, 2);
        ctx.fillStyle = '#4d3a24';
        ctx.fillRect(-9, -1, 1, 2);
      } else {
        const sc = pr.big ? 1.85 : 1;
        ctx.scale(sc, sc);
        ctx.strokeStyle = pr.color;
        ctx.lineWidth = pr.big ? 4 : 3;
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.quadraticCurveTo(10, 0, -8, 8);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        if (pr.big) {
          ctx.globalAlpha = .35;
          ctx.strokeStyle = pr.color;
          ctx.lineWidth = 8;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // particles (world)
    for (const p of G.particles) {
      const a = clamp(p.life / p.maxLife, 0, 1);
      const px = p.x - G.camera.x;
      const py = p.y - p.z;
      if (p.kind === 'smoke') {
        ctx.save();
        ctx.globalAlpha = a * .5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(px, py, p.size * 1.25, p.size * .8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }
      if (p.kind === 'flame') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * .9;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(px, py, p.size * .9, p.size * 1.15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a * .75;
        ctx.fillStyle = '#ffe9a3';
        ctx.beginPath();
        ctx.ellipse(px, py, p.size * .38, p.size * .55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }
      if (p.kind === 'spark') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * .022, py + p.vz * .018);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.restore();
        continue;
      }
      if (p.kind === 'bolt') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const h = p.size;
        ctx.moveTo(px, py);
        for (let i = 1; i <= 4; i++) {
          const yy = py - (h * i) / 4;
          const xx = px + Math.sin((p.life * 90 + i) * 2.7) * 3;
          ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        ctx.restore();
        continue;
      }
      if (p.kind === 'debris') {
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(px, py);
        ctx.rotate(p.rot || 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        continue;
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(px - p.size / 2), Math.round(py - p.size / 2), p.size, p.size);
    }
    ctx.globalAlpha = 1;

    drawEnemyHealthBars();

    // shockwave rings
    for (const e of G.effects) {
      const a = clamp(e.life / e.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a * .8;
      ctx.strokeStyle = e.color;
      ctx.lineWidth = e.width || 2;
      ctx.beginPath();
      ctx.ellipse(e.x - G.camera.x, e.y, e.radius, e.radius * .36, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // floating numbers
    for (const f of G.floaters) {
      const a = clamp(f.life / f.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = '900 8px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(8,5,13,.9)';
      ctx.strokeText(f.text, f.x - G.camera.x, f.y - f.z);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x - G.camera.x, f.y - f.z);
      ctx.restore();
    }

    ctx.restore();
    drawGoIndicator(t);
    drawAnnounce(t);
    drawLowHealth(t);
    drawComboPop(t);
  }

  function drawAnnounce(t) {
    const a = G.announce;
    if (!a) return;
    const p = a.timer / a.max;
    const fadeIn = clamp((1 - p) * 4, 0, 1);
    const fadeOut = clamp(p * 4, 0, 1);
    const alpha = Math.min(fadeIn, fadeOut);
    const scale = .92 + Math.min(1, (1 - p) * 6) * .08;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2, 92);
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';

    // Block stripes
    ctx.fillStyle = 'rgba(5,3,10,.5)';
    ctx.fillRect(-130, -23, 260, 48);
    ctx.fillStyle = a.color;
    ctx.fillRect(-130, -24, 260, 2);
    ctx.fillRect(-130, 24, 260, 1);

    ctx.font = '900 italic 20px "Arial Black", Impact, sans-serif';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#08050d';
    ctx.strokeText(a.main, 0, 5);
    ctx.fillStyle = a.color;
    ctx.fillText(a.main, 0, 5);
    if (a.sub) {
      ctx.font = 'bold 7px "Courier New", monospace';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#08050d';
      ctx.strokeText(a.sub, 0, 20);
      ctx.fillStyle = '#f4ecdc';
      ctx.fillText(a.sub, 0, 20);
    }
    ctx.restore();
  }

  function drawComboPop(t) {
    if (G.mode !== 'playing' || G.combo < 3) return;
    const p = G.player;
    if (!p) return;
    const x = clamp(p.x - G.camera.x + 24, 70, W - 70);
    const y = p.y - p.z - 61;
    const pop = Math.min(1, 1 - (G.comboTimer - 1.55) * 2);
    ctx.save();
    ctx.globalAlpha = clamp(G.comboTimer * 2, 0, 1) * .9;
    ctx.translate(x, y);
    ctx.scale(1 + Math.sin(pop * Math.PI) * .1, 1 + Math.sin(pop * Math.PI) * .1);
    ctx.font = '900 italic 12px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#08050d';
    ctx.strokeText(`${G.combo} HIT`, 0, 0);
    ctx.fillStyle = G.combo >= 8 ? '#ff2e63' : '#ffd23f';
    ctx.fillText(`${G.combo} HIT`, 0, 0);
    ctx.restore();
  }

  function drawLowHealth(t) {
    const p = G.player;
    if (!p || G.mode !== 'playing') return;
    const r = p.hp / p.maxHp;
    if (r > .28) return;
    const pulse = .25 + Math.sin(t * 6) * .12;
    const grad = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .78);
    grad.addColorStop(0, 'rgba(255,20,50,0)');
    grad.addColorStop(1, `rgba(255,20,50,${pulse})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // ————————————————————————————————————————————————
  // CONTROLS / UI EVENTS
  // ————————————————————————————————————————————————
  function toggleMute() {
    G.muted = !G.muted;
    Sound.ensure();
    Sound.setMuted(G.muted);
    dom.soundBtn.textContent = G.muted ? '♪ OFF' : '♪ ON';
    if (!G.muted && G.mode !== 'title') Sound.ensure();
  }

  function ensureAudio() {
    if (!Sound.ensure()) return;
    if (G.mode === 'title' && !Sound.trackName) Sound.playTrack('title');
  }

  function bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyM' && !e.repeat) {
        toggleMute();
        e.preventDefault();
        return;
      }
      Input.handleKey(e, true);
      ensureAudio();
    });
    window.addEventListener('keyup', (e) => { Input.handleKey(e, false); });
    window.addEventListener('blur', () => { Input.state = Object.create(null); });

    dom.btnStart.addEventListener('click', () => {
      ensureAudio();
      Sound.start();
      openSelect();
    });
    dom.charGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.char-card');
      if (!card) return;
      selectChar(card.dataset.char, true);
      ensureAudio();
    });
    dom.charGrid.addEventListener('dblclick', (e) => {
      const card = e.target.closest('.char-card');
      if (!card) return;
      selectChar(card.dataset.char, true);
      Sound.select();
      beginRun(G.selectedChar);
    });
    dom.btnConfirm.addEventListener('click', () => {
      ensureAudio();
      Sound.select();
      beginRun(G.selectedChar);
    });
    dom.btnSelectBack.addEventListener('click', () => { Sound.menu(); openTitle(true); });
    dom.btnResume.addEventListener('click', resumeGame);
    dom.btnRestart.addEventListener('click', () => { show(dom.pause, false); Sound.setPaused(false); startStage(G.stageIndex); });
    dom.btnQuit.addEventListener('click', quitToTitle);
    dom.btnNext.addEventListener('click', nextFromResult);
    dom.btnResultTitle.addEventListener('click', quitToTitle);
    dom.btnRetry.addEventListener('click', () => { show(dom.gameover, false); retryStage(); });
    dom.btnGameoverTitle.addEventListener('click', quitToTitle);
    dom.btnSound.addEventListener('click', toggleMute);
    dom.btnFullscreen.addEventListener('click', () => {
      try {
        if (!document.fullscreenElement) {
          const req = document.documentElement.requestFullscreen;
          if (req) {
            const p = req.call(document.documentElement);
            if (p && p.catch) p.catch(() => {});
          } else {
            toast('这个浏览器不支持全屏，试试横屏游玩。', 1.8);
          }
        } else if (document.exitFullscreen) {
          const p = document.exitFullscreen();
          if (p && p.catch) p.catch(() => {});
        }
      } catch (_) {}
    });
    document.addEventListener('fullscreenchange', () => {
      dom.btnFullscreen.textContent = document.fullscreenElement ? '⛶ 退出' : '⛶ 全屏';
    });
    dom.btnTouchPause.addEventListener('click', (e) => {
      e.preventDefault();
      if (G.mode === 'playing') pauseGame();
      else if (G.mode === 'paused') resumeGame();
    });

    // touch controls
    document.querySelectorAll('#touch-controls [data-action]').forEach(btn => {
      const action = btn.dataset.action;
      const down = (e) => {
        e.preventDefault();
        ensureAudio();
        btn.classList.add('pressed');
        Input.set(action, true);
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      };
      const up = (e) => {
        if (e) e.preventDefault();
        btn.classList.remove('pressed');
        Input.set(action, false);
      };
      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointercancel', up);
      btn.addEventListener('pointerleave', up);
      btn.addEventListener('lostpointercapture', up);
    });
    dom.screen.addEventListener('contextmenu', (e) => e.preventDefault());

    // initialize touch mode
    const isTouch = (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) {
      document.body.classList.add('touch-mode');
      dom.touch.classList.remove('is-hidden');
      const portrait = window.matchMedia('(orientation: portrait)');
      const updateRotate = () => {
        dom.rotate.classList.toggle('is-hidden', !(portrait.matches && window.innerWidth < 900));
      };
      updateRotate();
      if (portrait.addEventListener) portrait.addEventListener('change', updateRotate);
      window.addEventListener('resize', updateRotate);
    }
  }

  // ————————————————————————————————————————————————
  // BOOT
  // ————————————————————————————————————————————————
  function boot() {
    G.titleVisuals = Art.buildStage(0, 2460);
    bindEvents();
    setMode('title');
    show(dom.title, true);
    show(dom.hud, false);
    show(dom.bossUI, false);
    show(dom.result, false);
    show(dom.gameover, false);
    show(dom.stageCard, false);
    updateCharCards();
    updateBestLabel();
    resetHud();
    if (document.body.classList.contains('touch-mode')) dom.touch.classList.remove('is-hidden');

    let last = performance.now();
    let acc = 0;
    function frame(now) {
      const raw = (now - last) / 1000;
      last = now;
      acc += Math.min(.08, raw);
      let loops = 0;
      while (acc >= STEP && loops < 6) {
        update(STEP);
        // Keep buffered inputs alive through hit-stop frames so fast combo taps are not eaten.
        if (!(G.mode === 'playing' && G.hitstop > 0)) Input.clear();
        acc -= STEP;
        loops++;
      }
      render(now / 1000);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Read-only debug handle (useful for testing; harmless in play).
  window.__NEON_RAGE__ = { G, Input, STAGES, PLAYER_STATS, ENEMY_DATA, startStage, spawnEnemy, startRun, hurtPlayer, hitEnemy, killEnemy, clearBattle, showResult };

  boot();
})();
