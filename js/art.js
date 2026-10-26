/* NEON RAGE — original procedural pixel art */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const INK = '#100b16';
  const INK2 = '#08060d';

  const CHARS = {
    rex: {
      key: 'rex', build: 'normal', hair: 'spiky', outfit: 'jacket',
      colors: {
        skin: '#e8a273', skinShade: '#bd744e', hair: '#4a2a20', hairHi: '#7a462b',
        top: '#d52f46', topShade: '#8c192d', sleeve: '#b3233a', shirt: '#f1e6d2',
        pants: '#27466f', pantsShade: '#182c4a', shoe: '#e8dcc4', sole: '#5a493b',
        accent: '#ffd23f', metal: '#c9ced8', eye: '#171019'
      }
    },
    luna: {
      key: 'luna', build: 'slim', hair: 'ponytail', outfit: 'crop',
      colors: {
        skin: '#f0b38e', skinShade: '#bd7c5a', hair: '#342044', hairHi: '#9a62bb',
        top: '#9a5cff', topShade: '#6630c6', sleeve: '#7b3be0', shirt: '#241b36',
        pants: '#3a2d52', pantsShade: '#241b34', shoe: '#ff4b7d', sole: '#5c1428',
        accent: '#4ff5ff', metal: '#e5e0f2', eye: '#171019'
      }
    },
    bruno: {
      key: 'bruno', build: 'big', hair: 'bald', outfit: 'tank',
      colors: {
        skin: '#9d613d', skinShade: '#76442a', hair: '#15100e', hairHi: '#33231b',
        top: '#4f8b4a', topShade: '#2d5a31', sleeve: '#9d613d', shirt: '#c7bb9b',
        pants: '#6b4a32', pantsShade: '#47301f', shoe: '#2b211c', sole: '#17100d',
        accent: '#f2a33a', metal: '#d0b069', eye: '#171019'
      }
    },

    punk: {
      key: 'punk', build: 'normal', hair: 'mohawk', outfit: 'vest',
      colors: {
        skin: '#ca8c60', skinShade: '#9b633f', hair: '#38d68c', hairHi: '#a7ffd4',
        top: '#4b3266', topShade: '#2d1d41', sleeve: '#3d2954', shirt: '#cfc2a8',
        pants: '#262936', pantsShade: '#161820', shoe: '#3e3030', sole: '#1a1212',
        accent: '#ff5b5b', metal: '#c9ced8', eye: '#171019'
      }
    },
    blade: {
      key: 'blade', build: 'slim', hair: 'bandana', outfit: 'jacket',
      colors: {
        skin: '#df9a74', skinShade: '#ad6d4d', hair: '#221826', hairHi: '#4b3152',
        top: '#b52b3a', topShade: '#741625', sleeve: '#8f1f30', shirt: '#1a1420',
        pants: '#2a2333', pantsShade: '#17121e', shoe: '#d6c19e', sole: '#4b3a32',
        accent: '#e9d79a', metal: '#d9dde5', eye: '#171019'
      }
    },
    brute: {
      key: 'brute', build: 'big', hair: 'bald', outfit: 'tank',
      colors: {
        skin: '#b87c52', skinShade: '#8d5838', hair: '#1a1310', hairHi: '#3b2a20',
        top: '#6f6f76', topShade: '#4a4a50', sleeve: '#b87c52', shirt: '#5a4f45',
        pants: '#815b32', pantsShade: '#573a20', shoe: '#33261e', sole: '#1a120e',
        accent: '#f0b04b', metal: '#b7c2cc', eye: '#171019'
      }
    },
    kicker: {
      key: 'kicker', build: 'slim', hair: 'hood', outfit: 'hoodie',
      colors: {
        skin: '#d79b70', skinShade: '#a86b49', hair: '#2b2b44', hairHi: '#4a4a66',
        top: '#2255a8', topShade: '#14336b', sleeve: '#1b438a', shirt: '#101624',
        pants: '#1b2038', pantsShade: '#101322', shoe: '#59e5ff', sole: '#173542',
        accent: '#59e5ff', metal: '#c9ced8', eye: '#171019'
      }
    },


    boxer: {
      key: 'boxer', build: 'normal', hair: 'spiky', outfit: 'tank', accessory: 'headgear', gloves: true,
      colors: {
        skin: '#c8875b', skinShade: '#97603d', hair: '#18131a', hairHi: '#443544',
        top: '#2f6fd0', topShade: '#1c4a96', sleeve: '#c8875b', shirt: '#ead8b8',
        pants: '#dfb43d', pantsShade: '#a5761d', shoe: '#c63b47', sole: '#57151d',
        accent: '#ffd23f', metal: '#d6dde5', eye: '#151019', gloves: '#cf3048'
      }
    },
    whip: {
      key: 'whip', build: 'slim', hair: 'ponytail', outfit: 'coat', accessory: 'earring',
      colors: {
        skin: '#e1a07b', skinShade: '#ae6d4f', hair: '#2a1420', hairHi: '#743456',
        top: '#6f1f3a', topShade: '#3f0f20', sleeve: '#59162b', shirt: '#1b1017',
        pants: '#271a27', pantsShade: '#170f18', shoe: '#c9a24a', sole: '#5a4220',
        accent: '#ffd23f', metal: '#d9dde5', eye: '#151019'
      }
    },
    gunner: {
      key: 'gunner', build: 'normal', hair: 'slick', outfit: 'vest', accessory: 'shades',
      colors: {
        skin: '#c78b63', skinShade: '#94603f', hair: '#201a1d', hairHi: '#56444a',
        top: '#365b45', topShade: '#203b2c', sleeve: '#2b4b39', shirt: '#c8bda3',
        pants: '#252b33', pantsShade: '#141820', shoe: '#141619', sole: '#08090b',
        accent: '#ff5b55', metal: '#d9e0e6', eye: '#151019'
      }
    },

    siren: {
      key: 'siren', build: 'slim', hair: 'long', outfit: 'crop', accessory: 'choker', female: true,
      colors: {
        skin: '#e6a27e', skinShade: '#b3704f', hair: '#e83f86', hairHi: '#ff9ec4',
        top: '#1d1830', topShade: '#100c1c', sleeve: '#241d38', shirt: '#2c2340',
        pants: '#3a1f33', pantsShade: '#22101d', shoe: '#ffd45e', sole: '#7a4a12',
        accent: '#4ff5ff', metal: '#e5e0f2', eye: '#171019'
      }
    },
    viper: {
      key: 'viper', build: 'slim', hair: 'bob', outfit: 'bodysuit', accessory: 'earring', female: true, knifeBelt: true,
      colors: {
        skin: '#e3a87f', skinShade: '#b3744f', hair: '#1c2b26', hairHi: '#4f7d68',
        top: '#1f4a3d', topShade: '#102a22', sleeve: '#1a3c32', shirt: '#0e1a16',
        pants: '#17211d', pantsShade: '#0c1310', shoe: '#c9a24a', sole: '#4a3413',
        accent: '#7dffce', metal: '#dfe9e2', eye: '#171019'
      }
    },
    raven: {
      key: 'raven', build: 'slim', hair: 'long', outfit: 'coat', accessory: 'choker', female: true, knifeBelt: true,
      colors: {
        skin: '#e0a07a', skinShade: '#ad6c4b', hair: '#1a0c16', hairHi: '#b52c52',
        top: '#2a0f1f', topShade: '#150711', sleeve: '#20101a', shirt: '#3b1020',
        pants: '#1b1018', pantsShade: '#0d070c', shoe: '#c2954a', sole: '#4a2c14',
        accent: '#ff3d5f', metal: '#e8edf2', eye: '#171019'
      }
    },
    nyx: {
      key: 'nyx', build: 'slim', hair: 'ponytail', outfit: 'bodysuit', accessory: 'earring', female: true,
      colors: {
        skin: '#f0c3a8', skinShade: '#bd8a6b', hair: '#e8eef5', hairHi: '#ffffff',
        top: '#1a3a4a', topShade: '#0d222c', sleeve: '#173340', shirt: '#24505f',
        pants: '#14262f', pantsShade: '#0a161c', shoe: '#d9f6ff', sole: '#3d6670',
        accent: '#5ef0ff', metal: '#f2fbff', eye: '#171019'
      }
    },
    wrecker: {
      key: 'wrecker', build: 'big', hair: 'bald', outfit: 'tank', accessory: 'mask', gloves: true,
      colors: {
        skin: '#b87c52', skinShade: '#8d5838', hair: '#1a1310', hairHi: '#3b2a20',
        top: '#a3263a', topShade: '#651522', sleeve: '#b87c52', shirt: '#4a2025',
        pants: '#2d2a33', pantsShade: '#19171e', shoe: '#d6b06a', sole: '#5a4222',
        accent: '#ffcf5a', metal: '#9ea7b0', eye: '#171019', gloves: '#d8324a'
      }
    },
    house: {
      key: 'house', build: 'boss', hair: 'slick', outfit: 'suit',
      colors: {
        skin: '#d0a17d', skinShade: '#a07252', hair: '#171015', hairHi: '#4b2a35',
        top: '#a3263a', topShade: '#5e0d1b', sleeve: '#821527', shirt: '#fff1d8',
        pants: '#24121b', pantsShade: '#13090e', shoe: '#120c10', sole: '#070406',
        accent: '#ffd34d', metal: '#f0dca8', eye: '#171019'
      }
    },
    vprime: {
      key: 'vprime', build: 'boss', hair: 'slick', outfit: 'suit',
      colors: {
        skin: '#c9a07e', skinShade: '#9b7458', hair: '#f2e4c6', hairHi: '#fff8e0',
        top: '#14121a', topShade: '#08070c', sleeve: '#101017', shirt: '#f4f0e6',
        pants: '#101017', pantsShade: '#07070b', shoe: '#0d0c11', sole: '#050406',
        accent: '#ffd34d', metal: '#e6e1d4', eye: '#171019'
      }
    },
    razor: {
      key: 'razor', build: 'boss', hair: 'mohawk', outfit: 'coat',
      colors: {
        skin: '#dca67c', skinShade: '#a86e4e', hair: '#f4e9d2', hairHi: '#ffffff',
        top: '#d6d6df', topShade: '#91919f', sleeve: '#b8b8c4', shirt: '#292332',
        pants: '#31313f', pantsShade: '#1c1c26', shoe: '#1a171d', sole: '#0b090d',
        accent: '#ff264f', metal: '#e8eef4', eye: '#171019'
      }
    },
    titan: {
      key: 'titan', build: 'big', hair: 'helmet', outfit: 'tank',
      colors: {
        skin: '#a26845', skinShade: '#7a4a2f', hair: '#212227', hairHi: '#4b4d55',
        top: '#7a2a2a', topShade: '#4e1717', sleeve: '#a26845', shirt: '#a9a1a0',
        pants: '#c46a25', pantsShade: '#854416', shoe: '#2e2926', sole: '#171312',
        accent: '#d6d6df', metal: '#9ea7b0', eye: '#ff5b3d'
      }
    },
    vector: {
      key: 'vector', build: 'boss', hair: 'slick', outfit: 'suit',
      colors: {
        skin: '#c9a07e', skinShade: '#9b7458', hair: '#121016', hairHi: '#3a3148',
        top: '#1b1b26', topShade: '#0e0e15', sleeve: '#15151e', shirt: '#f4f0e6',
        pants: '#171821', pantsShade: '#0c0c11', shoe: '#0d0c11', sole: '#050406',
        accent: '#ffd34d', metal: '#e6e1d4', eye: '#171019'
      }
    }
  };

  const BUILD = {
    slim: { height: 39, headH: 8, headW: 7, torsoW: 10, armW: 3, legW: 3, torsoBottom: -16 },
    normal: { height: 41, headH: 9, headW: 8, torsoW: 12, armW: 4, legW: 4, torsoBottom: -16 },
    big: { height: 45, headH: 10, headW: 9, torsoW: 17, armW: 5, legW: 5, torsoBottom: -17 },
    boss: { height: 45, headH: 10, headW: 9, torsoW: 15, armW: 5, legW: 5, torsoBottom: -16 }
  };

  function metrics(c) {
    const b = BUILD[c.build] || BUILD.normal;
    const torsoTop = -b.height + b.headH + 1;
    return {
      ...b,
      top: -b.height,
      headBottom: -b.height + b.headH,
      torsoTop,
      torsoH: b.torsoBottom - torsoTop,
      neckY: torsoTop,
      shoulderY: torsoTop + 3,
      hipY: b.torsoBottom + 1
    };
  }

  function px(g, x, y, w, h, color) {
    g.fillStyle = color;
    g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  }

  function pline(g, x1, y1, x2, y2, w, color) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    const o = Math.floor(w / 2);
    g.fillStyle = color;
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x1 + (dx * i) / n) - o;
      const y = Math.round(y1 + (dy * i) / n) - o;
      g.fillRect(x, y, w, w);
    }
  }

  function limb(g, x1, y1, x2, y2, w, color) {
    pline(g, x1, y1, x2, y2, w + 2, INK);
    pline(g, x1, y1, x2, y2, w, color);
  }

  function mix(a, b, t) {
    const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
    const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
    const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
    return '#' + [ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]
      .map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }

  function computePose(o, m) {
    const pose = o.pose || 'idle';
    const ext = Math.max(0, Math.min(1, o.ext == null ? 1 : o.ext));
    const anim = o.anim || 0;
    const swing = pose === 'walk' ? Math.sin(anim * 11) : 0;
    const idleSway = pose === 'idle' ? Math.sin(anim * 3.2) * 0.7 : 0;
    const hipF = m.torsoW * 0.2;
    const hipB = -m.torsoW * 0.2;
    const fsX = m.torsoW * 0.34;
    const bsX = -m.torsoW * 0.33;
    const shY = m.shoulderY;
    let bob = pose === 'idle' ? Math.sin(anim * 3.4) * 0.5 : pose === 'walk' ? -Math.abs(Math.sin(anim * 11)) * 0.8 : 0;
    let lean = 0;
    let headDX = 0, headDY = 0;

    let fa = { sx: fsX, sy: shY, ex: fsX + 2 + idleSway, ey: shY + 6, hx: fsX + 3 + idleSway, hy: shY + 12 };
    let ba = { sx: bsX, sy: shY, ex: bsX - 2 - idleSway, ey: shY + 6, hx: bsX - 3 - idleSway, hy: shY + 12 };
    let fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 3, ky: -7, fx: hipF + 4, fy: 0 };
    let bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 3, ky: -7, fx: hipB - 4, fy: 0 };

    if (pose === 'walk') {
      fl.fx += swing * 5;
      fl.kx += swing * 3;
      fl.fy = -Math.max(0, swing) * 2.5;
      bl.fx -= swing * 5;
      bl.kx -= swing * 3;
      bl.fy = -Math.max(0, -swing) * 2.5;
      fa.hx -= swing * 4;
      fa.ex -= swing * 2;
      ba.hx += swing * 4;
      ba.ex += swing * 2;
    }

    switch (pose) {
      case 'run': {
        const rs = Math.sin(anim * 15);
        bob = -Math.abs(rs) * 1.1;
        lean = 2.6;
        fl = {
          hx: hipF, hy: m.torsoBottom,
          kx: hipF + 4 + rs * 4, ky: -8 + Math.max(0, rs) * 2,
          fx: hipF + 7 + rs * 10, fy: -Math.max(0, rs) * 6
        };
        bl = {
          hx: hipB, hy: m.torsoBottom,
          kx: hipB - 4 - rs * 4, ky: -8 + Math.max(0, -rs) * 2,
          fx: hipB - 7 - rs * 10, fy: -Math.max(0, -rs) * 6
        };
        fa = {
          sx: fsX, sy: shY,
          ex: fsX + 4 - rs * 5, ey: shY + 3,
          hx: fsX + 6 - rs * 8, hy: shY + 6 + rs * 2
        };
        ba = {
          sx: bsX, sy: shY,
          ex: bsX - 3 + rs * 5, ey: shY + 4,
          hx: bsX - 5 + rs * 8, hy: shY + 8 - rs * 2
        };
        headDX = 1.6;
        break;
      }
      case 'headbutt':
        bob = 0;
        lean = 3.2;
        headDX = 2.4;
        headDY = .6;
        fa = { sx: fsX, sy: shY, ex: fsX - 2, ey: shY + 4, hx: fsX - 4, hy: shY + 8 };
        ba = { sx: bsX, sy: shY, ex: bsX - 3, ey: shY + 5, hx: bsX - 5, hy: shY + 9 };
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 3, ky: -8, fx: hipF + 5, fy: 0 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 4, ky: -8, fx: hipB - 6, fy: 0 };
        break;
      case 'punch1':
        lean = 0.8;
        fa = { sx: fsX, sy: shY, ex: fsX + 5 + 4 * ext, ey: shY + 2, hx: fsX + 8 + 14 * ext, hy: shY + 1 };
        ba = { sx: bsX, sy: shY, ex: bsX + 1, ey: shY + 5, hx: bsX + 2, hy: shY + 8 };
        headDX = 0.7;
        break;
      case 'punch2':
        lean = 1.4;
        ba = { sx: bsX, sy: shY, ex: bsX + 5 + 5 * ext, ey: shY + 1, hx: bsX + 8 + 15 * ext, hy: shY - 1 };
        fa = { sx: fsX, sy: shY, ex: fsX - 1, ey: shY + 4, hx: fsX + 1, hy: shY + 7 };
        headDX = 1.2;
        break;
      case 'kick':
        lean = -1.6;
        fl = {
          hx: hipF, hy: m.torsoBottom,
          kx: hipF + 4 + 5 * ext, ky: -9,
          fx: hipF + 7 + 15 * ext, fy: -12 - 2 * ext
        };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 2, ky: -7, fx: hipB - 4, fy: 0 };
        fa = { sx: fsX, sy: shY, ex: fsX + 1, ey: shY + 5, hx: fsX + 3, hy: shY + 8 };
        ba = { sx: bsX, sy: shY, ex: bsX - 4, ey: shY + 3, hx: bsX - 5, hy: shY + 5 };
        headDX = -1.2; headDY = -0.4;
        break;
      case 'jump':
        bob = 0;
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 4, ky: -8, fx: hipF + 6, fy: -6 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 3, ky: -8, fx: hipB - 5, fy: -5 };
        fa = { sx: fsX, sy: shY, ex: fsX + 4, ey: shY + 2, hx: fsX + 7, hy: shY - 1 };
        ba = { sx: bsX, sy: shY, ex: bsX - 4, ey: shY + 3, hx: bsX - 7, hy: shY + 1 };
        break;
      case 'jumpkick':
        bob = 0;
        lean = -2;
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 6 + 4 * ext, ky: -8, fx: hipF + 9 + 15 * ext, fy: -12 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 2, ky: -8, fx: hipB - 5, fy: -5 };
        fa = { sx: fsX, sy: shY, ex: fsX + 4, ey: shY + 3, hx: fsX + 7, hy: shY + 2 };
        ba = { sx: bsX, sy: shY, ex: bsX - 4, ey: shY + 2, hx: bsX - 7, hy: shY };
        break;
      case 'uppercut':
        lean = 2.2;
        headDX = 1.2;
        headDY = -.6;
        bob = -1.2;
        fa = { sx: fsX, sy: shY, ex: fsX + 4, ey: shY - 3, hx: fsX + 7, hy: shY - 16 };
        ba = { sx: bsX, sy: shY, ex: bsX - 4, ey: shY + 4, hx: bsX - 6, hy: shY + 8 };
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 4, ky: -8, fx: hipF + 7, fy: -4 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 3, ky: -7, fx: hipB - 5, fy: 0 };
        break;
      case 'slam':
        lean = 1.6;
        headDX = .8;
        bob = 1.4;
        fa = { sx: fsX, sy: shY, ex: fsX + 2, ey: shY + 5, hx: fsX + 2, hy: shY + 10 };
        ba = { sx: bsX, sy: shY, ex: bsX - 2, ey: shY + 5, hx: bsX - 2, hy: shY + 10 };
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 5, ky: -7, fx: hipF + 7, fy: 0 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 5, ky: -7, fx: hipB - 7, fy: 0 };
        break;
      case 'special':
        bob = Math.sin(anim * 35) * 0.8;
        fa = { sx: fsX, sy: shY, ex: fsX + 7, ey: shY - 1, hx: fsX + 13, hy: shY - 3 };
        ba = { sx: bsX, sy: shY, ex: bsX - 7, ey: shY + 1, hx: bsX - 13, hy: shY + 3 };
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 4, ky: -7, fx: hipF + 7, fy: -3 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 4, ky: -7, fx: hipB - 7, fy: -3 };
        break;
      case 'hurt':
        lean = -3;
        fa = { sx: fsX, sy: shY, ex: fsX - 2, ey: shY - 1, hx: fsX - 1, hy: shY - 6 };
        ba = { sx: bsX, sy: shY, ex: bsX - 5, ey: shY - 2, hx: bsX - 7, hy: shY - 7 };
        fl = { hx: hipF, hy: m.torsoBottom, kx: hipF + 5, ky: -8, fx: hipF + 6, fy: 0 };
        bl = { hx: hipB, hy: m.torsoBottom, kx: hipB - 5, ky: -8, fx: hipB - 6, fy: 0 };
        headDX = -2; headDY = 1;
        break;
      case 'grab':
        lean = 0.8;
        fa = { sx: fsX, sy: shY, ex: fsX + 5, ey: shY + 2, hx: fsX + 11, hy: shY + 2 };
        ba = { sx: bsX, sy: shY, ex: bsX + 3, ey: shY + 3, hx: bsX + 7, hy: shY + 3 };
        headDX = 0.5;
        break;
      case 'throw':
        lean = -1;
        fa = { sx: fsX, sy: shY, ex: fsX + 5, ey: shY - 4, hx: fsX + 9, hy: shY - 11 };
        ba = { sx: bsX, sy: shY, ex: bsX + 4, ey: shY - 2, hx: bsX + 8, hy: shY - 8 };
        break;
      case 'victory':
        fa = { sx: fsX, sy: shY, ex: fsX + 4, ey: shY - 5, hx: fsX + 5, hy: shY - 14 };
        ba = { sx: bsX, sy: shY, ex: bsX - 3, ey: shY + 5, hx: bsX - 4, hy: shY + 10 };
        headDX = 0.5;
        break;
      case 'block':
        fa = { sx: fsX, sy: shY, ex: fsX + 2, ey: shY + 1, hx: fsX + 3, hy: shY - 5 };
        ba = { sx: bsX, sy: shY, ex: bsX + 3, ey: shY + 1, hx: bsX + 5, hy: shY - 5 };
        break;
    }

    return { fa, ba, fl, bl, bob, lean, headDX, headDY, swing };
  }

  function drawHair(g, c, m, pose, C) {
    const headX = 1 + (pose.headDX || 0);
    const top = m.top + (pose.headDY || 0);
    const hw = m.headW;
    const left = headX - hw / 2;
    const color = C.hair;
    const hi = C.hairHi;

    if (c.hair === 'ponytail') {
      // tail behind
      const sway = Math.sin((pose.anim || 0) * 4) * 1.4;
      pline(g, left - 1, top + 5, left - 5, top + 10 + sway, 5, INK);
      pline(g, left - 1, top + 5, left - 5, top + 10 + sway, 3, color);
      pline(g, left - 5, top + 10 + sway, left - 8, top + 18 - sway, 4, INK);
      pline(g, left - 5, top + 10 + sway, left - 8, top + 18 - sway, 2, color);
      px(g, left - 2, top + 1, hw + 2, 4, INK);
      px(g, left - 1, top + 1, hw + 1, 3, color);
      px(g, left, top, hw - 1, 2, color);
      px(g, left + 1, top, 3, 1, hi);
      px(g, left, top + 3, 2, 3, color);
      px(g, left + hw - 2, top + 2, 2, 3, color);
      return;
    }

    if (c.hair === 'spiky') {
      px(g, left - 1, top, hw + 2, 4, INK);
      px(g, left, top, hw, 3, color);
      px(g, left - 1, top - 1, hw - 1, 2, color);
      // spikes
      const spikes = [[-2, -3, 3, 1], [2, -4, 3, 1], [5, -2, 2, 1], [7, 0, 2, 1]];
      spikes.forEach(([x, y, w, h]) => px(g, left + x, top + y, w, h + 2, INK));
      px(g, left - 1, top - 2, 3, 3, color);
      px(g, left + 2, top - 3, 3, 3, color);
      px(g, left + 5, top - 1, 3, 3, color);
      px(g, left + 1, top, 3, 1, hi);
      px(g, left - 1, top + 3, 2, 3, color);
      px(g, left + hw - 2, top + 3, 2, 2, color);
      return;
    }

    if (c.hair === 'bald') {
      px(g, left + 1, top + 1, hw - 1, 2, C.skinShade);
      px(g, left + 2, top + 1, 2, 1, mix(C.skin, '#ffffff', .2));
      if (c.build === 'big' || c.key === 'bruno') {
        // beard
        px(g, left + 1, top + 5, hw - 1, 4, color);
        px(g, left + 3, top + 8, hw - 4, 2, color);
        px(g, left + 5, top + 6, 2, 1, C.skinShade);
        // battered gold headband gives Bruno a readable brow line
        px(g, left, top + 2, hw, 1, C.accent);
        px(g, left - 2, top + 1, 2, 3, C.accent);
        px(g, left - 3, top + 2, 1, 3, C.topShade);
      }
      return;
    }

    if (c.hair === 'mohawk') {
      px(g, left, top + 1, 2, 4, C.skinShade);
      px(g, left + hw - 2, top + 1, 2, 3, C.skinShade);
      px(g, left + 2, top - 1, 4, 4, INK);
      px(g, left + 3, top - 2, 2, 4, color);
      px(g, left + 2, top - 3, 2, 2, color);
      px(g, left + 5, top - 1, 2, 3, color);
      px(g, left + 3, top + 1, 2, 2, color);
      px(g, left + 3, top - 1, 1, 2, hi);
      return;
    }

    if (c.hair === 'bandana') {
      px(g, left - 1, top, hw + 2, 4, color);
      px(g, left + 1, top, hw - 1, 2, C.top);
      px(g, left + 3, top, 2, 1, C.accent);
      // tails behind
      px(g, left - 4, top + 3, 4, 2, INK);
      px(g, left - 4, top + 3, 3, 1, C.top);
      px(g, left - 6, top + 5, 4, 2, INK);
      px(g, left - 6, top + 5, 3, 1, C.topShade);
      return;
    }

    if (c.hair === 'hood') {
      px(g, left - 2, top - 1, hw + 4, 8, INK);
      px(g, left - 1, top - 1, hw + 2, 7, C.topShade);
      px(g, left + 1, top + 1, hw - 2, m.headH - 3, C.skin);
      px(g, left + 1, top + 1, hw - 2, 2, mix(C.topShade, '#000000', .25));
      px(g, left + 1, top + 4, 2, 2, C.skinShade);
      px(g, left - 1, top + 5, hw + 2, 3, C.topShade);
      return;
    }

    if (c.hair === 'helmet') {
      px(g, left - 2, top - 1, hw + 4, 5, INK);
      px(g, left - 1, top - 1, hw + 2, 4, C.metal);
      px(g, left, top, hw, 1, mix(C.metal, '#ffffff', .25));
      px(g, left - 1, top + 2, 2, 4, C.metal);
      px(g, left + hw - 1, top + 2, 2, 4, C.metal);
      px(g, left + 3, top, 2, 1, C.accent);
      return;
    }

    if (c.hair === 'slick') {
      px(g, left - 1, top, hw + 2, 4, INK);
      px(g, left, top, hw, 3, color);
      px(g, left + 1, top - 1, hw - 2, 2, color);
      px(g, left + 1, top, 4, 1, hi);
      px(g, left - 1, top + 3, 2, 3, color);
      px(g, left + hw - 3, top + 3, 2, 2, color);
      return;
    }

    if (c.hair === 'long') {
      // Long hair mass falls behind the shoulders and sways with movement.
      const sway = Math.sin((pose.anim || 0) * 3.4) * 1.4;
      px(g, left - 3, top + 4, 5, 15, INK);
      px(g, left - 2, top + 4 + Math.round(sway * .25), 4, 14, color);
      px(g, left - 2, top + 8 + Math.round(sway * .25), 2, 9, mix(color, '#000000', .22));
      px(g, left + hw - 1, top + 4, 4, 14, INK);
      px(g, left + hw - 1, top + 4 + Math.round(sway * .2), 3, 13, color);
      // crown
      px(g, left - 1, top - 1, hw + 2, 5, INK);
      px(g, left, top, hw, 4, color);
      px(g, left + 1, top, 4, 1, hi);
      // side locks framing the face (front lock stays off the nose)
      px(g, left - 1, top + 3, 2, 7, color);
      px(g, left + hw - 1, top + 3, 1, 6, color);
      px(g, left + hw - 1, top + 9, 2, 4, color);
      px(g, left - 1, top + 7, 2, 3, mix(color, '#000000', .25));
      px(g, left + hw - 1, top + 11, 2, 3, mix(color, '#000000', .25));
      return;
    }

    if (c.hair === 'bob') {
      px(g, left - 2, top - 1, hw + 4, 7, INK);
      px(g, left - 1, top, hw + 2, 6, color);
      px(g, left + 1, top, 4, 1, hi);
      // chin-length sides
      px(g, left - 2, top + 4, 3, 5, INK);
      px(g, left - 1, top + 4, 2, 4, color);
      px(g, left + hw, top + 4, 3, 5, INK);
      px(g, left + hw, top + 4, 2, 4, color);
      // swept fringe on the back side of the face
      px(g, left + 1, top + 2, 3, 2, color);
      px(g, left + 1, top + 2, 2, 1, hi);
      px(g, left + hw - 1, top + 3, 1, 2, mix(color, '#000000', .2));
      return;
    }

    px(g, left - 1, top, hw + 2, 4, INK);
    px(g, left, top, hw, 3, color);
    px(g, left + 1, top - 1, hw - 2, 2, color);
    px(g, left + 1, top + 1, 3, 1, hi);
    px(g, left - 1, top + 3, 2, 2, color);
  }

  function drawHead(g, c, m, pose, C) {
    const headX = 1 + (pose.headDX || 0);
    const top = m.top + (pose.headDY || 0);
    const hw = m.headW;
    const hh = m.headH;
    const left = headX - hw / 2;

    // neck
    px(g, -1, m.headBottom - 1, 4, 4, INK);
    px(g, 0, m.headBottom - 1, 3, 3, C.skinShade);

    // head outline + skin
    px(g, left - 1, top - 1, hw + 2, hh + 2, INK);
    px(g, left, top, hw, hh, C.skin);
    px(g, left + hw - 2, top + 1, 2, hh - 2, C.skinShade);
    px(g, left + 1, top + hh - 2, hw - 2, 2, C.skinShade);

    // ear
    px(g, left - 2, top + 4, 2, 2, INK);
    px(g, left - 1, top + 4, 1, 1, C.skinShade);

    drawHair(g, c, m, pose, C);
    if (c.key === 'luna') {
      px(g, left - 1, top + 1, 2, 4, C.accent);
      px(g, left - 2, top + 2, 1, 2, C.accent);
    }

    // eye + brow (drawn after hair so sweeping fringes never hide the face)
    px(g, left + hw - 4, top + 3, 2, 2, C.eye);
    px(g, left + hw - 4, top + 3, 1, 1, '#fff8e8');
    px(g, left + hw - 5, top + 2, 4, 1, C.hair);
    if (c.skinShade === '#bd7c5a' || c.key === 'bruno' || c.key === 'titan') {
      px(g, left + hw - 5, top + 3, 1, 1, mix(C.skin, '#ffffff', .35));
      px(g, left + 2, top + 3, 3, 1, mix(C.skin, '#ffffff', .16));
      px(g, left + hw - 6, top + 4, 4, 1, C.skinShade);
    }
    // nose / mouth
    px(g, left + hw - 2, top + 5, 1, 2, C.skinShade);
    px(g, left + hw - 5, top + hh - 2, 3, 1, C.skinShade);

    if (c.accessory === 'headgear') {
      px(g, left - 1, top + 1, hw + 2, 2, C.accent);
      px(g, left - 2, top + 1, 2, 4, C.topShade);
      px(g, left + hw, top + 1, 2, 4, C.topShade);
      px(g, left + 2, top + 1, 3, 1, '#fff0b0');
    }
    if (c.accessory === 'monocle') {
      px(g, left + hw - 7, top + 2, 7, 4, C.accent);
      px(g, left + hw - 6, top + 3, 5, 2, mix(C.top, '#ffffff', .12));
      px(g, left + hw - 4, top + 3, 2, 2, C.eye);
      px(g, left + hw, top + 4, 1, 3, C.accent);
      px(g, left + hw + 1, top + 6, 1, 2, C.accent);
    }
    if (c.accessory === 'shades') {
      px(g, left + hw - 7, top + 3, 7, 2, '#09080d');
      px(g, left + hw - 6, top + 3, 2, 1, '#4d5a69');
      px(g, left - 1, top + 3, 2, 1, '#09080d');
    }
    if (c.accessory === 'mask') {
      px(g, left + 1, top + 6, hw - 1, 4, C.metal);
      px(g, left + 2, top + 7, hw - 3, 1, C.topShade);
      for (let i = 0; i < 3; i++) px(g, left + 2 + i * 2, top + 8, 1, 1, INK);
    }
    if (c.accessory === 'beard') {
      px(g, left + 1, top + hh - 3, hw - 1, 3, C.hair);
      px(g, left + 2, top + hh - 1, hw - 3, 1, C.hair);
    }
    if (c.accessory === 'headset') {
      px(g, left - 2, top + 2, 2, 4, C.metal);
      px(g, left - 3, top + 3, 1, 2, C.accent);
    }
    if (c.accessory === 'scar') {
      px(g, left + hw - 6, top + 5, 1, 4, '#a24f5e');
    }
    if (c.accessory === 'earring') {
      px(g, left - 2, top + 6, 1, 2, C.accent);
    }
    if (c.accessory === 'choker') {
      px(g, -1, m.headBottom + 1, 4, 1, INK);
      px(g, 0, m.headBottom + 1, 3, 1, C.accent);
      px(g, 1, m.headBottom + 2, 1, 1, C.accent);
    }
    if (c.hair === 'mohawk' && c.key === 'razor') {
      px(g, left + 2, top - 2, 2, 5, C.accent);
    }
  }

  function drawTorso(g, c, m, pose, C) {
    const hw = m.torsoW;
    const left = -hw / 2;
    const top = m.torsoTop;
    const bottom = m.torsoBottom;
    const h = bottom - top;
    const lean = pose.lean || 0;
    const chestX = left + lean * 0.7;

    // coat tails behind
    if (c.outfit === 'coat') {
      px(g, chestX - 1, bottom - 1, hw + 3, 13, INK);
      px(g, chestX, bottom, hw + 1, 11, C.topShade);
      px(g, chestX + hw - 2, bottom, 2, 10, C.top);
      px(g, chestX + 2, bottom + 4, hw - 3, 1, C.accent);
    }

    // outline
    px(g, chestX - 1, top - 1, hw + 2, h + 2, INK);
    px(g, chestX, top, hw, h, C.top);
    // shading
    px(g, chestX, top, 3, h, C.topShade);
    px(g, chestX + hw - 2, top + 2, 2, h - 4, mix(C.top, '#ffffff', .1));
    px(g, chestX + 4, top + 2, hw - 7, 1, C.topShade);

    if (c.outfit === 'jacket' || c.outfit === 'coat') {
      // open jacket / shirt strip
      px(g, chestX + hw * 0.45, top + 1, Math.max(2, hw * 0.22), h - 3, C.shirt);
      px(g, chestX + hw * 0.52, top + 2, 1, h - 5, C.topShade);
      px(g, chestX + hw * 0.31, top + 1, 1, h - 3, C.topShade);
      // collar
      px(g, chestX + 2, top, hw - 4, 2, C.topShade);
      px(g, chestX + 3, top + 2, 2, 2, C.topShade);
      // zip
      px(g, chestX + hw * 0.5, top + 2, 1, h - 4, C.metal);
      // pockets
      px(g, chestX + 2, top + h - 6, 3, 1, C.topShade);
      px(g, chestX + hw - 5, top + h - 6, 3, 1, C.topShade);
    } else if (c.outfit === 'crop') {
      px(g, chestX + 1, bottom - 2, hw - 1, 2, C.skinShade);
      px(g, chestX + 2, top + 2, hw - 5, h - 6, C.top);
      px(g, chestX + 1, top, 2, h - 3, C.topShade);
      px(g, chestX + hw - 3, top + 1, 2, h - 4, C.topShade);
      px(g, chestX + 2, top + h - 4, hw - 6, 1, C.accent);
      if (c.female) {
        // exposed midriff + waist shading for the female crop-top silhouette
        px(g, chestX + 2, bottom - 6, hw - 4, 4, C.skin);
        px(g, chestX + 2, bottom - 6, hw - 4, 1, C.skinShade);
        px(g, chestX + Math.round(hw * .5), bottom - 3, 1, 1, C.skinShade);
        px(g, chestX + 1, bottom - 7, 2, 6, C.skinShade);
        px(g, chestX + hw - 3, bottom - 7, 2, 6, C.skinShade);
        px(g, chestX + 3, bottom - 7, hw - 7, 1, C.accent);
      }
    } else if (c.outfit === 'tank') {
      px(g, chestX + 1, top + 1, 3, 5, C.skin);
      px(g, chestX + hw - 4, top + 1, 3, 5, C.skin);
      px(g, chestX + 4, top + 1, hw - 8, h - 2, C.top);
      px(g, chestX + 4, top + 2, 2, h - 4, C.topShade);
      px(g, chestX + hw - 6, top + 2, 1, h - 4, mix(C.top, '#ffffff', .15));
      // straps
      px(g, chestX + 3, top - 1, 2, 4, C.topShade);
      px(g, chestX + hw - 5, top - 1, 2, 4, C.topShade);
    } else if (c.outfit === 'vest') {
      px(g, chestX + hw * 0.37, top, hw * 0.26, h, C.shirt);
      px(g, chestX + 1, top, hw * 0.31, h - 1, C.topShade);
      px(g, chestX + hw * 0.69, top, hw * 0.27, h - 1, C.topShade);
      px(g, chestX + 3, top + 3, 2, 2, C.accent);
      px(g, chestX + hw - 5, top + 3, 2, 2, C.accent);
    } else if (c.outfit === 'hoodie') {
      px(g, chestX + 2, top + 1, hw - 4, h - 2, C.top);
      px(g, chestX + 1, top + 1, 2, h - 3, C.topShade);
      px(g, chestX + hw - 3, top + 1, 2, h - 3, C.topShade);
      px(g, chestX + hw * 0.35, top + 5, hw * 0.3, h - 8, C.topShade);
      px(g, chestX + hw * 0.42, top + 4, 1, 3, C.accent);
      px(g, chestX + hw * 0.55, top + 4, 1, 3, C.accent);
    } else if (c.outfit === 'suit') {
      // white shirt V
      px(g, chestX + hw * 0.34, top, hw * 0.32, 5, C.shirt);
      px(g, chestX + hw * 0.32, top, 2, h - 2, C.shirt);
      px(g, chestX + hw * 0.66, top, 2, h - 2, C.shirt);
      px(g, chestX + hw * 0.47, top + 5, 2, h - 7, C.accent);
      px(g, chestX + hw * 0.5, top, hw * 0.3, h - 1, C.topShade);
      px(g, chestX + 1, top, hw * 0.3, h - 1, C.topShade);
      px(g, chestX + 2, top + 1, 1, h - 2, mix(C.top, '#ffffff', .16));
    } else if (c.outfit === 'bodysuit') {
      // tight stealth suit: dark side panels, bright seam, chest emblem
      px(g, chestX + 1, top + 1, 2, h - 3, C.topShade);
      px(g, chestX + hw - 3, top + 1, 2, h - 3, C.topShade);
      px(g, chestX + hw * 0.5, top + 1, 1, h - 4, C.metal);
      px(g, chestX + 3, top + 3, hw - 6, 1, C.accent);
      px(g, chestX + 2, top + 6, 1, h - 10, C.accent);
      px(g, chestX + hw - 3, top + 6, 1, h - 10, C.accent);
      px(g, chestX + hw * 0.5 - 2, top + 5, 5, 2, C.topShade);
      px(g, chestX + hw * 0.5 - 1, top + 5, 3, 1, C.accent);
      // waist taper reads as a fitted silhouette
      px(g, chestX + 1, bottom - 5, 2, 3, C.topShade);
      px(g, chestX + hw - 3, bottom - 5, 2, 3, C.topShade);
      if (c.female) {
        // side cut-outs at the waist: keeps the stealth suit, reads female at a glance
        px(g, chestX + 1, bottom - 7, 2, 4, C.skin);
        px(g, chestX + hw - 3, bottom - 7, 2, 4, C.skin);
        px(g, chestX + 1, bottom - 7, 2, 1, C.skinShade);
        px(g, chestX + hw - 3, bottom - 7, 2, 1, C.skinShade);
        px(g, chestX + 1, bottom - 4, 2, 1, C.skinShade);
        px(g, chestX + hw - 3, bottom - 4, 2, 1, C.skinShade);
      }
    }

    // belt
    px(g, chestX, bottom - 2, hw, 3, INK);
    px(g, chestX + 1, bottom - 2, hw - 2, 2, C.pantsShade);
    px(g, chestX + hw * 0.45, bottom - 2, 3, 2, C.accent);
    // throwing knives clipped to the belt
    if (c.knifeBelt) {
      for (let i = 0; i < 3; i++) {
        const kx = chestX + 3 + i * 3;
        px(g, kx, bottom - 6, 1, 5, INK);
        px(g, kx, bottom - 6, 1, 3, C.metal);
        px(g, kx, bottom - 4, 1, 2, '#b58a45');
      }
    }
    // shoulder highlight
    px(g, chestX + 1, top + 1, hw - 2, 1, mix(C.top, '#ffffff', .18));
  }

  function drawArm(g, arm, m, c, C, isBack, ext) {
    const w = m.armW;
    const sleeve = isBack ? C.sleeve : C.top;
    const upperColor = (c.outfit === 'tank') ? C.skin : sleeve;
    limb(g, arm.sx, arm.sy, arm.ex, arm.ey, w, upperColor);
    limb(g, arm.ex, arm.ey, arm.hx, arm.hy, Math.max(2, w - 1), C.skin);
    // hand / boxing glove
    if (c.gloves) {
      px(g, arm.hx - 3, arm.hy - 3, 6, 6, INK);
      px(g, arm.hx - 2, arm.hy - 2, 5, 5, C.gloves || C.top);
      px(g, arm.hx - 1, arm.hy - 2, 2, 1, mix(C.gloves || C.top, '#ffffff', .28));
      px(g, arm.hx + 1, arm.hy + 1, 1, 1, C.topShade);
    } else {
      px(g, arm.hx - 2, arm.hy - 2, 4, 4, INK);
      px(g, arm.hx - 1, arm.hy - 1, 3, 3, C.skin);
      if (isBack) {
        px(g, arm.hx + 1, arm.hy, 1, 2, C.skinShade);
      } else {
        px(g, arm.hx, arm.hy + 1, 1, 1, C.skinShade);
      }
    }
    // elbow pad / sleeve detail
    if (!isBack && c.outfit !== 'tank') {
      px(g, arm.sx - 1, arm.sy + 3, w, 2, C.accent);
    }
  }

  function drawLeg(g, leg, m, c, C, isBack) {
    const w = m.legW;
    limb(g, leg.hx, leg.hy, leg.kx, leg.ky, w, isBack ? C.pantsShade : C.pants);
    limb(g, leg.kx, leg.ky, leg.fx, leg.fy - 2, Math.max(2, w - 1), isBack ? C.pantsShade : C.pants);
    // knee accent
    px(g, leg.kx - 1, leg.ky - 1, 3, 2, isBack ? C.pantsShade : mix(C.pants, C.accent, .22));
    // shoe
    px(g, leg.fx - 3, leg.fy - 3, 7, 3, INK);
    px(g, leg.fx - 2, leg.fy - 3, 5, 2, isBack ? C.sole : C.shoe);
    px(g, leg.fx + 1, leg.fy - 2, 2, 1, isBack ? C.shoe : mix(C.shoe, '#ffffff', .25));
  }

  function drawWeapon(g, hand, pose, o, C) {
    if (!o.weapon) return;
    const ext = Math.max(0, Math.min(1, o.ext == null ? 1 : o.ext));
    let tx, ty;
    if (pose === 'punch1' || pose === 'punch2' || pose === 'special') {
      tx = hand.hx + 17 + 6 * ext;
      ty = hand.hy - 2;
    } else if (pose === 'grab' || pose === 'throw') {
      tx = hand.hx + 9;
      ty = hand.hy - 5;
    } else {
      tx = hand.hx + 6;
      ty = hand.hy + 13;
    }
    if (o.weapon === 'whip') {
      const attacking = pose === 'punch1' || pose === 'punch2' || pose === 'special';
      if (!attacking) {
        // Coiled whip at the hip instead of a cane-like line dragging on the floor.
        const p1 = [hand.hx + 8, hand.hy + 5];
        const p2 = [hand.hx + 2, hand.hy + 12];
        const p3 = [hand.hx - 5, hand.hy + 6];
        pline(g, hand.hx, hand.hy, p1[0], p1[1], 4, INK);
        pline(g, p1[0], p1[1], p2[0], p2[1], 4, INK);
        pline(g, p2[0], p2[1], p3[0], p3[1], 4, INK);
        pline(g, hand.hx, hand.hy, p1[0], p1[1], 2, '#5c2d22');
        pline(g, p1[0], p1[1], p2[0], p2[1], 2, '#7c3b2a');
        pline(g, p2[0], p2[1], p3[0], p3[1], 2, '#5c2d22');
        px(g, p3[0] - 1, p3[1] - 1, 3, 3, C.accent);
        return;
      }
      const wx = hand.hx + 34 + 16 * ext;
      const wy = hand.hy + 1;
      const mx = hand.hx + 21 + 8 * ext;
      const my = hand.hy - 8;
      pline(g, hand.hx, hand.hy, mx, my, 4, INK);
      pline(g, hand.hx, hand.hy, mx, my, 2, '#5c2d22');
      pline(g, mx, my, wx, wy, 4, INK);
      pline(g, mx, my, wx, wy, 2, '#7c3b2a');
      px(g, wx - 1, wy - 1, 3, 3, C.accent);
      return;
    }
    if (o.weapon === 'sword') {
      const tipX = hand.hx + 27 + 12 * ext;
      const tipY = hand.hy - 9 - 7 * ext;
      pline(g, hand.hx, hand.hy, tipX, tipY, 6, INK);
      pline(g, hand.hx, hand.hy, tipX, tipY, 3, C.metal);
      pline(g, hand.hx + 2, hand.hy - 1, tipX - 2, tipY + 2, 1, '#ffffff');
      // crossguard
      px(g, hand.hx - 2, hand.hy - 2, 6, 4, INK);
      px(g, hand.hx - 1, hand.hy - 1, 4, 2, '#c9a24a');
      // grip
      pline(g, hand.hx - 7, hand.hy + 4, hand.hx, hand.hy, 5, INK);
      pline(g, hand.hx - 6, hand.hy + 3, hand.hx - 1, hand.hy + 1, 3, '#5c2d22');
      px(g, hand.hx - 7, hand.hy + 3, 2, 2, C.accent);
      return;
    }
    if (o.weapon === 'knife') {
      const kx = hand.hx + 7 + 7 * ext;
      const ky = hand.hy - 6 - 4 * ext;
      pline(g, hand.hx, hand.hy + 2, hand.hx + 4, hand.hy - 1, 5, INK);
      pline(g, hand.hx, hand.hy + 2, hand.hx + 4, hand.hy - 1, 3, '#442c22');
      pline(g, hand.hx + 3, hand.hy - 1, kx, ky, 4, INK);
      pline(g, hand.hx + 3, hand.hy - 1, kx, ky, 2, C.metal);
      pline(g, hand.hx + 4, hand.hy - 1, kx - 2, ky + 2, 1, '#ffffff');
      px(g, hand.hx + 1, hand.hy - 3, 5, 2, '#b58a45');
      return;
    }
    if (o.weapon === 'machinegun') {
      const y = hand.hy - 4;
      // receiver
      px(g, hand.hx - 5, y, 19, 6, INK);
      px(g, hand.hx - 4, y + 1, 17, 4, '#4f5b66');
      px(g, hand.hx - 4, y + 1, 14, 1, '#d9e3ec');
      px(g, hand.hx - 4, y + 3, 9, 1, '#2d353d');
      // barrel + heat shroud
      px(g, hand.hx + 12, y + 1, 12, 4, INK);
      px(g, hand.hx + 13, y + 2, 10, 2, '#788592');
      px(g, hand.hx + 17, y + 1, 2, 4, '#b9c4ce');
      // drum magazine
      px(g, hand.hx + 2, y + 5, 8, 8, INK);
      px(g, hand.hx + 3, y + 6, 6, 6, '#5a6670');
      px(g, hand.hx + 4, y + 7, 4, 1, '#aab6c1');
      // stock / grip
      px(g, hand.hx - 9, y + 2, 5, 3, INK);
      px(g, hand.hx - 8, y + 2, 4, 2, '#6d4a2f');
      px(g, hand.hx - 1, y + 4, 4, 6, INK);
      px(g, hand.hx, y + 4, 2, 5, '#3a302b');
      px(g, hand.hx + 22, y + 2, 3, 2, '#ffd76b');
      return;
    }
    if (o.weapon === 'pistol') {
      px(g, hand.hx - 2, hand.hy - 3, 12, 5, INK);
      px(g, hand.hx - 1, hand.hy - 2, 9, 3, '#5b6470');
      px(g, hand.hx - 1, hand.hy - 2, 7, 1, C.metal);
      px(g, hand.hx + 1, hand.hy + 1, 4, 5, INK);
      px(g, hand.hx + 2, hand.hy + 1, 2, 4, '#3a302b');
      px(g, hand.hx + 1, hand.hy + 1, 1, 2, '#b58a45');
      px(g, hand.hx + 8, hand.hy - 2, 2, 1, '#ffd76b');
      return;
    }
    if (o.weapon === 'bat') {
      pline(g, hand.hx, hand.hy, tx, ty, 5, INK);
      pline(g, hand.hx, hand.hy, tx, ty, 3, '#a86b3d');
      pline(g, hand.hx, hand.hy, tx - 2, ty - 2, 1, '#e1b478');
    } else {
      pline(g, hand.hx, hand.hy, tx, ty, 5, INK);
      pline(g, hand.hx, hand.hy, tx, ty, 2, C.metal);
      pline(g, hand.hx, hand.hy, tx, ty, 1, '#f4f8fb');
      px(g, hand.hx - 1, hand.hy - 2, 3, 3, INK);
    }
  }

  function drawDown(g, c, m, C) {
    // horizontal body, feet pointing forward
    const y = -9;
    px(g, -21, y - 1, 40, 9, INK);
    // legs
    px(g, 8, y, 17, 7, C.pantsShade);
    px(g, 20, y, 6, 5, C.pants);
    px(g, 24, y + 4, 7, 3, C.shoe);
    px(g, 24, y + 4, 7, 1, mix(C.shoe, '#ffffff', .2));
    // torso
    px(g, -9, y, 18, 8, C.top);
    px(g, -8, y + 1, 16, 2, C.topShade);
    px(g, -4, y + 3, 10, 2, C.shirt);
    // arm
    px(g, -11, y + 4, 9, 3, C.sleeve);
    px(g, -14, y + 5, 4, 3, C.skin);
    // head
    px(g, -20, y - 2, 10, 8, INK);
    px(g, -19, y - 1, 8, 6, C.skin);
    px(g, -15, y, 2, 2, C.eye);
    px(g, -20, y - 2, 9, 2, C.hair);
    px(g, -21, y + 4, 3, 2, C.hair);
    // sneaker sole
    px(g, 22, y + 7, 9, 2, C.sole);
  }

  function drawFighter(g, o) {
    const c = o.char || CHARS.rex;
    const m = metrics(c);
    const pose = o.pose || 'idle';
    const p = computePose(o, m);
    const scale = (o.scale == null ? 1 : o.scale);
    const facing = o.facing == null ? 1 : o.facing;
    const alpha = o.alpha == null ? 1 : o.alpha;
    const flash = !!o.flash;

    const C = flash ? {
      ...c.colors, skin: '#ffe4cc', skinShade: '#eab995', hair: '#ffe9bb', hairHi: '#fff8df',
      top: '#fff1da', topShade: '#e1c7ac', sleeve: '#fff1da', shirt: '#fff5e4', pants: '#e8d6c2',
      pantsShade: '#cfb69c', shoe: '#fff8ea', sole: '#c1a58b', accent: '#fff9e6', metal: '#fffdf4', gloves: '#fff4df'
    } : c.colors;

    g.save();
    g.globalAlpha = alpha;
    const sx = Math.round(o.x);
    const sy = Math.round(o.y - (o.z || 0));
    g.translate(sx, sy);
    g.scale(facing * scale, scale);

    if (o.boss) {
      const glow = g.createRadialGradient(0, -22, 2, 0, -22, 34);
      glow.addColorStop(0, o.auraColor || 'rgba(255,46,99,.18)');
      glow.addColorStop(1, 'rgba(255,46,99,0)');
      g.fillStyle = glow;
      g.fillRect(-36, -60, 72, 65);
    }

    if (pose === 'down' || pose === 'dead') {
      drawDown(g, c, m, C);
      g.restore();
      return;
    }

    g.translate(0, p.bob);
    p.anim = o.anim || 0;

    // back arm, legs, torso, head, front arm
    drawArm(g, p.ba, m, c, C, true, o.ext);
    drawLeg(g, p.bl, m, c, C, true);
    drawLeg(g, p.fl, m, c, C, false);
    drawTorso(g, c, m, p, C);
    drawHead(g, c, m, p, C);
    drawArm(g, p.fa, m, c, C, false, o.ext);
    if (o.rim && !flash) {
      g.save();
      g.globalAlpha = .58;
      const rim = o.rim;
      px(g, m.headW / 2 - 2, m.top + 1, 2, 1, rim);
      px(g, p.fa.sx + 1, p.fa.sy - 1, 2, 2, rim);
      px(g, m.torsoW / 2 - 1, m.torsoTop + 3, 1, Math.max(3, m.torsoH - 7), rim);
      px(g, p.fl.kx + 1, p.fl.ky - 1, 1, 3, rim);
      px(g, p.fl.fx + 1, p.fl.fy - 3, 2, 1, rim);
      g.restore();
    }
    drawWeapon(g, p.fa, pose, o, C);
    if (c.key === 'house') {
      // Dealer's fanned hand: readable silhouette even at gameplay scale.
      const hand = p.fa;
      g.save();
      g.translate(hand.hx + 1, hand.hy - 2);
      g.rotate(-.35);
      for (let i = 0; i < 3; i++) {
        g.save();
        g.rotate(i * .34);
        px(g, -2, -7, 5, 9, '#100b10');
        px(g, -1, -6, 3, 7, '#fff2d8');
        px(g, 0, -5, 1, 2, C.accent);
        g.restore();
      }
      g.restore();
    }

    // little ground contact glint for jump? no
    g.restore();
  }

  function drawShadow(g, x, y, z, scale, alpha) {
    const size = 12 * (scale || 1) * (1 - Math.min(0.4, (z || 0) / 170));
    g.save();
    g.globalAlpha = (alpha == null ? 0.36 : alpha) * (1 - Math.min(0.55, (z || 0) / 160));
    g.fillStyle = '#000000';
    g.beginPath();
    g.ellipse(x, y + 1, size, size * 0.34, 0, 0, TAU);
    g.fill();
    g.restore();
  }

  function drawPreview(g, w, h, key, t) {
    g.clearRect(0, 0, w, h);
    const c = CHARS[key] || CHARS.rex;
    // backdrop ring
    const grd = g.createRadialGradient(w / 2, h * 0.62, 4, w / 2, h * 0.62, w * 0.55);
    grd.addColorStop(0, 'rgba(255,46,99,.13)');
    grd.addColorStop(1, 'rgba(255,46,99,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.08)';
    g.lineWidth = 1;
    g.beginPath();
    g.ellipse(w / 2, h - 11, w * 0.28, 3, 0, 0, TAU);
    g.stroke();

    drawShadow(g, w / 2, h - 10, 0, 1.55, 0.4);
    drawFighter(g, {
      x: w / 2, y: h - 9, z: 0, facing: 1, scale: 2.05,
      char: c, pose: 'idle', anim: t + (key === 'luna' ? 1.3 : key === 'bruno' ? 2.1 : 0),
      ext: 0, weapon: key === 'rex' ? null : null, rim: c.colors.accent
    });
    // ground line
    g.fillStyle = 'rgba(255,255,255,.08)';
    g.fillRect(w * 0.18, h - 10, w * 0.64, 1);
  }

  function drawHudPortrait(g, w, h, key, t) {
    g.clearRect(0, 0, w, h);
    const c = CHARS[key] || CHARS.rex;
    g.fillStyle = 'rgba(5,3,10,.2)';
    g.fillRect(0, 0, w, h);
    drawFighter(g, {
      x: w / 2, y: h - 4, z: 0, facing: 1, scale: 1.02,
      char: c, pose: 'idle', anim: t * 0.8, ext: 0, rim: c.colors.accent
    });
    // vignette
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(5,3,10,.05)');
    grad.addColorStop(1, 'rgba(5,3,10,.45)');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
  }

  // A head-and-shoulders crop used by enemy HUD nameplates. Rendering the
  // existing fighter at a larger scale keeps every enemy portrait consistent
  // with its in-game sprite without adding a second asset set.
  function drawHeadPortrait(g, w, h, charOrKey, t) {
    const c = typeof charOrKey === 'string' ? (CHARS[charOrKey] || CHARS.rex) : (charOrKey || CHARS.rex);
    const m = metrics(c);
    const scale = (w * .78) / Math.max(1, m.headW);
    const headCenterY = h * .5;
    const feetY = headCenterY + scale * (m.height - m.headH / 2);

    g.save();
    g.beginPath();
    g.rect(0, 0, w, h);
    g.clip();

    const bg = g.createRadialGradient(w / 2, h * .4, 1, w / 2, h * .55, w * .9);
    bg.addColorStop(0, mix(c.colors.accent, '#24101c', .62));
    bg.addColorStop(1, '#0b0710');
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    drawFighter(g, {
      x: w / 2 - scale, y: feetY, z: 0, facing: 1, scale,
      char: c, pose: 'idle', anim: (t || 0) * .8, ext: 0, rim: c.colors.accent
    });

    const fade = g.createLinearGradient(0, 0, 0, h);
    fade.addColorStop(0, 'rgba(5,3,10,0)');
    fade.addColorStop(.72, 'rgba(5,3,10,.08)');
    fade.addColorStop(1, 'rgba(5,3,10,.7)');
    g.fillStyle = fade;
    g.fillRect(0, 0, w, h);
    g.restore();
  }

  // ————————————————————————————————————————————————
  // BACKGROUNDS
  // ————————————————————————————————————————————————
  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gradientFill(g, x, y, w, h, stops, horizontal) {
    const gr = horizontal ? g.createLinearGradient(x, y, x + w, y) : g.createLinearGradient(x, y, x, y + h);
    stops.forEach(([p, c]) => gr.addColorStop(p, c));
    g.fillStyle = gr;
    g.fillRect(x, y, w, h);
  }

  function neonSign(g, x, y, text, color, size, glow) {
    g.save();
    g.font = `bold ${size || 10}px "Courier New", monospace`;
    g.textAlign = 'center';
    g.shadowColor = color;
    g.shadowBlur = glow == null ? 12 : glow;
    g.fillStyle = color;
    g.fillText(text, x, y);
    g.shadowBlur = 0;
    g.globalAlpha = 0.4;
    g.fillStyle = '#ffffff';
    g.fillText(text, x, y);
    g.restore();
  }

  function drawWindowGrid(g, x, y, w, h, cols, rows, color, seed, lit = 0.42) {
    const cw = w / cols, ch = h / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const litOn = seed() < lit;
        if (litOn) {
          g.fillStyle = color;
          g.globalAlpha = 0.35 + seed() * 0.5;
          g.fillRect(x + i * cw + 1, y + j * ch + 1, Math.max(1, cw - 2), Math.max(1, ch - 2));
        }
      }
    }
    g.globalAlpha = 1;
  }

  function buildDocks(worldW) {
    const rand = mulberry32(0x9e3779b9);
    const sky = makeCanvas(480, 270);
    const sg = sky.getContext('2d');
    gradientFill(sg, 0, 0, 480, 270, [
      [0, '#060817'], [0.35, '#171034'], [0.66, '#4e1c4c'], [0.85, '#a3345c'], [1, '#1b1025']
    ]);
    // stars
    for (let i = 0; i < 80; i++) {
      const x = rand() * 480, y = rand() * 135;
      sg.fillStyle = rand() < 0.2 ? '#ffd9a3' : '#b9d8ff';
      sg.globalAlpha = 0.2 + rand() * 0.65;
      sg.fillRect(x, y, rand() < 0.1 ? 2 : 1, 1);
    }
    sg.globalAlpha = 1;
    // moon
    const moon = sg.createRadialGradient(388, 42, 4, 388, 42, 44);
    moon.addColorStop(0, 'rgba(255,214,224,.5)');
    moon.addColorStop(0.25, 'rgba(255,180,200,.16)');
    moon.addColorStop(1, 'rgba(255,150,190,0)');
    sg.fillStyle = moon; sg.fillRect(330, 0, 116, 100);
    sg.fillStyle = '#f6d8d4';
    sg.beginPath(); sg.arc(388, 42, 15, 0, TAU); sg.fill();
    sg.fillStyle = '#e9bdc2'; sg.beginPath(); sg.arc(384, 39, 3, 0, TAU); sg.fill();
    sg.beginPath(); sg.arc(392, 47, 2, 0, TAU); sg.fill();
    // clouds
    for (let i = 0; i < 6; i++) {
      const y = 66 + rand() * 45, w = 50 + rand() * 90, x = rand() * 480;
      sg.globalAlpha = 0.08 + rand() * 0.08;
      sg.fillStyle = '#ca7baa';
      sg.beginPath(); sg.ellipse(x, y, w, 8 + rand() * 4, 0, 0, TAU); sg.fill();
    }
    sg.globalAlpha = 1;

    const far = makeCanvas(1440, 270);
    const f = far.getContext('2d');
    // distant skyline
    let bx = -30;
    while (bx < 1470) {
      const bw = 22 + rand() * 52;
      const bh = 35 + rand() * 85;
      const y = 170 - bh;
      f.fillStyle = rand() < 0.5 ? '#0e0c22' : '#13102a';
      f.fillRect(bx, y, bw, bh + 4);
      if (rand() < 0.72) {
        drawWindowGrid(f, bx + 4, y + 6, bw - 8, bh - 12, Math.max(1, Math.floor(bw / 9)), Math.max(1, Math.floor(bh / 12)), rand() < 0.3 ? '#67e8ff' : '#ffca6b', rand, 0.28);
      }
      if (rand() < 0.3) {
        f.fillStyle = '#0a0917';
        f.fillRect(bx + bw * 0.45, y - 13, 2, 13);
        f.fillStyle = '#ff466e';
        f.fillRect(bx + bw * 0.45 - 1, y - 15, 4, 3);
      }
      bx += bw + 2 + rand() * 8;
    }
    // distant neon signs
    neonSign(f, 120, 78, '24H', '#ff4e76', 13, 14);
    neonSign(f, 390, 96, 'NOODLE', '#42e7ff', 9, 11);
    neonSign(f, 705, 70, 'MOTEL', '#ffcb45', 11, 13);
    neonSign(f, 1010, 88, 'LIQUOR', '#ff5b9d', 9, 12);
    neonSign(f, 1280, 72, 'ARCADE', '#5fffc4', 10, 13);
    // crane silhouette
    f.strokeStyle = '#080712'; f.lineWidth = 3;
    f.beginPath(); f.moveTo(1100, 170); f.lineTo(1100, 56); f.lineTo(1260, 56); f.lineTo(1260, 80); f.stroke();
    f.lineWidth = 1; f.beginPath(); f.moveTo(1100, 56); f.lineTo(1176, 30); f.lineTo(1260, 56); f.stroke();
    f.fillStyle = '#ff3b63'; f.fillRect(1258, 78, 3, 5);

    const mid = makeCanvas(1440, 270);
    const m = mid.getContext('2d');
    // warehouse / streetfront buildings
    let x = -60;
    while (x < 1480) {
      const w = 180 + rand() * 180;
      const h = 105 + rand() * 55;
      const top = 170 - h;
      const base = rand() < 0.4 ? '#1b1426' : rand() < 0.5 ? '#191725' : '#211629';
      m.fillStyle = base;
      m.fillRect(x, top, w, h + 2);
      m.fillStyle = 'rgba(255,255,255,.04)';
      m.fillRect(x, top, w, 3);
      // roof lip
      m.fillStyle = '#0c0912'; m.fillRect(x - 2, top - 4, w + 4, 5);
      // windows / signage
      if (rand() < 0.65) {
        drawWindowGrid(m, x + 14, top + 18, w * 0.35, h * 0.42, 3, 3, '#ffb959', rand, 0.4);
      }
      // door + awning
      const dw = 28 + rand() * 10;
      m.fillStyle = '#0b0910';
      m.fillRect(x + w * 0.56, 170 - 48, dw, 48);
      m.fillStyle = rand() < 0.5 ? '#4c1832' : '#1a3548';
      m.fillRect(x + w * 0.53, 116, dw + 12, 6);
      m.fillStyle = 'rgba(255,255,255,.1)';
      for (let s = 0; s < 4; s++) m.fillRect(x + w * 0.53 + s * (dw + 12) / 4, 116, 4, 6);
      // big neon sign
      if (rand() < 0.55) {
        const names = ['DOCK 9', 'LUCKY', 'PAWN', 'HOTEL', 'RAMEN', 'DINER'];
        const cols = ['#ff3e6c', '#30e5ff', '#ffd23f', '#b96bff', '#63ffb1'];
        neonSign(m, x + w * 0.42, top + 28, names[Math.floor(rand() * names.length)], cols[Math.floor(rand() * cols.length)], 9 + rand() * 4, 10);
      }
      // pipes / graffiti
      m.fillStyle = '#09070f';
      m.fillRect(x + 6, top + 8, 3, h - 8);
      if (rand() < 0.5) {
        m.strokeStyle = rand() < 0.5 ? '#7d2c4a' : '#2b5960';
        m.globalAlpha = 0.5; m.lineWidth = 1;
        for (let k = 0; k < 4; k++) {
          const gx = x + 20 + rand() * w * 0.4, gy = 148 + rand() * 12;
          m.beginPath(); m.moveTo(gx, gy); m.quadraticCurveTo(gx + 8, gy - 9, gx + 17, gy + 1); m.stroke();
        }
        m.globalAlpha = 1;
      }
      x += w + 6 + rand() * 16;
    }
    // hand-placed storefront sign cluster to anchor the left side of the playfield
    neonSign(m, 84, 103, 'OPEN', '#59ffd0', 8, 10);
    neonSign(m, 214, 92, 'RAMEN', '#ffcf45', 9, 12);
    neonSign(m, 332, 111, 'PAWN', '#ff5b9d', 7, 9);
    for (const sx of [70, 196, 318]) {
      const lg = m.createRadialGradient(sx, 132, 1, sx, 132, 42);
      lg.addColorStop(0, 'rgba(255,196,109,.12)');
      lg.addColorStop(1, 'rgba(255,196,109,0)');
      m.fillStyle = lg;
      m.fillRect(sx - 44, 96, 88, 76);
      m.fillStyle = 'rgba(255,224,166,.09)';
      m.fillRect(sx - 26, 118, 52, 28);
    }
    // parked car silhouette
    m.fillStyle = '#08060e';
    m.fillRect(560, 144, 92, 18);
    m.fillRect(576, 132, 54, 14);
    m.fillStyle = '#20263c';
    m.fillRect(582, 135, 19, 8);
    m.fillRect(606, 135, 19, 8);
    m.fillStyle = '#07050b';
    m.beginPath(); m.arc(580, 163, 6, 0, TAU); m.fill();
    m.beginPath(); m.arc(632, 163, 6, 0, TAU); m.fill();
    m.fillStyle = 'rgba(255,61,95,.45)'; m.fillRect(651, 149, 4, 3);

    // chainlink fence
    m.save();
    m.globalAlpha = 0.5;
    m.strokeStyle = '#3d4057'; m.lineWidth = 1;
    for (let fx = 0; fx < 1440; fx += 9) {
      m.beginPath(); m.moveTo(fx, 142); m.lineTo(fx + 9, 170); m.stroke();
      m.beginPath(); m.moveTo(fx, 170); m.lineTo(fx + 9, 142); m.stroke();
    }
    m.globalAlpha = 1; m.restore();
    // lamp posts
    for (let lx = 90; lx < 1440; lx += 300) {
      m.fillStyle = '#08070e';
      m.fillRect(lx, 56, 3, 114);
      m.fillRect(lx, 54, 22, 3);
      m.fillStyle = '#ffe3a0'; m.fillRect(lx + 18, 56, 6, 3);
      const glow = m.createRadialGradient(lx + 21, 57, 1, lx + 21, 57, 24);
      glow.addColorStop(0, 'rgba(255,221,148,.35)');
      glow.addColorStop(1, 'rgba(255,221,148,0)');
      m.fillStyle = glow; m.fillRect(lx - 4, 33, 50, 50);
    }

    const ground = makeCanvas(worldW, 100);
    const gg = ground.getContext('2d');
    gradientFill(gg, 0, 0, worldW, 100, [
      [0, '#252035'], [0.18, '#191624'], [0.55, '#12101b'], [1, '#0a0810']
    ]);
    // curb / sidewalk top
    gg.fillStyle = '#2f2a3d'; gg.fillRect(0, 0, worldW, 17);
    gg.fillStyle = '#4a435c'; gg.fillRect(0, 0, worldW, 2);
    gg.fillStyle = '#18141f'; gg.fillRect(0, 16, worldW, 3);
    // sidewalk slabs
    for (let sx = 0; sx < worldW; sx += 38) {
      gg.fillStyle = 'rgba(0,0,0,.22)';
      gg.fillRect(sx, 2, 1, 14);
      gg.fillStyle = 'rgba(255,255,255,.035)';
      gg.fillRect(sx + 2, 3, 26, 1);
    }
    // asphalt streaks
    for (let i = 0; i < 160; i++) {
      const sx = rand() * worldW, sy = 21 + rand() * 70;
      gg.globalAlpha = 0.06 + rand() * 0.1;
      gg.fillStyle = rand() < 0.5 ? '#9086b5' : '#05040a';
      gg.fillRect(sx, sy, 10 + rand() * 40, 1);
    }
    gg.globalAlpha = 1;
    // road lane dashed line
    for (let lx = 40; lx < worldW; lx += 96) {
      gg.fillStyle = 'rgba(255,210,63,.18)';
      gg.fillRect(lx, 72, 50, 3);
    }
    // puddles
    for (let i = 0; i < 22; i++) {
      const pxX = 50 + rand() * (worldW - 100), py = 28 + rand() * 55;
      const rw = 18 + rand() * 46, rh = 3 + rand() * 7;
      gg.save();
      gg.globalAlpha = 0.45;
      const pgrad = gg.createLinearGradient(pxX - rw, py, pxX + rw, py);
      pgrad.addColorStop(0, 'rgba(27,25,48,.1)');
      pgrad.addColorStop(0.45, 'rgba(98,28,84,.55)');
      pgrad.addColorStop(0.7, rand() < 0.5 ? 'rgba(20,95,116,.5)' : 'rgba(128,34,98,.45)');
      pgrad.addColorStop(1, 'rgba(12,10,24,.1)');
      gg.fillStyle = pgrad;
      gg.beginPath(); gg.ellipse(pxX, py, rw, rh, 0, 0, TAU); gg.fill();
      gg.globalAlpha = 0.35; gg.fillStyle = rand() < 0.5 ? '#ff4b7c' : '#39d9ff';
      gg.fillRect(pxX - rw * 0.45, py - 1, rw * 0.5, 1);
      gg.restore();
    }
    // manholes
    for (let i = 0; i < 8; i++) {
      const mx = 120 + rand() * (worldW - 240), my = 40 + rand() * 40;
      gg.fillStyle = 'rgba(0,0,0,.45)';
      gg.beginPath(); gg.ellipse(mx, my, 10, 3, 0, 0, TAU); gg.fill();
      gg.strokeStyle = 'rgba(130,120,160,.3)'; gg.lineWidth = 1;
      gg.beginPath(); gg.ellipse(mx, my, 9, 2.6, 0, 0, TAU); gg.stroke();
    }
    // wet neon reflections columns
    for (let i = 0; i < 13; i++) {
      const rx = 60 + rand() * (worldW - 120);
      const col = rand() < 0.45 ? '255,46,99' : rand() < 0.75 ? '41,231,255' : '255,210,63';
      const ggrd = gg.createLinearGradient(rx, 25, rx, 90);
      ggrd.addColorStop(0, `rgba(${col},.2)`);
      ggrd.addColorStop(1, `rgba(${col},0)`);
      gg.fillStyle = ggrd;
      gg.fillRect(rx, 25, 2 + rand() * 3, 60);
    }
    // trash / paper
    for (let i = 0; i < 55; i++) {
      const tx = rand() * worldW, ty = 24 + rand() * 66;
      gg.fillStyle = rand() < 0.4 ? 'rgba(210,190,150,.25)' : 'rgba(120,105,130,.16)';
      gg.fillRect(tx, ty, 2 + rand() * 4, 1);
    }

    return { sky, far, mid, ground, ambient: 'rain' };
  }

  function buildSubway(worldW) {
    const rand = mulberry32(0x123abc42);
    const sky = makeCanvas(480, 270);
    const sg = sky.getContext('2d');
    gradientFill(sg, 0, 0, 480, 270, [
      [0, '#090a0d'], [0.4, '#101a1b'], [0.7, '#162225'], [1, '#090a0c']
    ]);
    const far = makeCanvas(1440, 270);
    const f = far.getContext('2d');
    // tiled wall
    gradientFill(f, 0, 22, 1440, 148, [
      [0, '#233233'], [0.5, '#1a292a'], [1, '#101b1c']
    ]);
    for (let ty = 24; ty < 166; ty += 10) {
      for (let tx = 0; tx < 1440; tx += 16) {
        const shade = rand() < 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.08)';
        f.fillStyle = shade; f.fillRect(tx + 1, ty + 1, 14, 8);
        f.fillStyle = 'rgba(0,0,0,.15)'; f.fillRect(tx, ty + 9, 16, 1);
      }
    }
    // top moulding
    f.fillStyle = '#0a1112'; f.fillRect(0, 16, 1440, 8);
    f.fillStyle = '#304143'; f.fillRect(0, 16, 1440, 2);
    // station signs
    const signNames = ['NEO CITY // LINE 07', 'CENTRAL PLATFORM', 'NEXT STOP: MIDTOWN', 'MIND THE GAP'];
    for (let i = 0; i < 4; i++) {
      const sx = 120 + i * 360;
      f.fillStyle = '#0b1415'; f.fillRect(sx, 38, 190, 26);
      f.strokeStyle = '#3c6d6b'; f.lineWidth = 2; f.strokeRect(sx, 38, 190, 26);
      f.fillStyle = '#d8ecd9'; f.font = 'bold 9px "Courier New", monospace'; f.textAlign = 'center';
      f.fillText(signNames[i], sx + 95, 55);
      f.fillStyle = '#ffcf42'; f.fillRect(sx + 4, 42, 3, 18);
    }
    // old posters
    for (let i = 0; i < 6; i++) {
      const pxX = 60 + rand() * 1320, py = 80 + rand() * 38;
      const pw = 26 + rand() * 18, ph = 38 + rand() * 14;
      f.fillStyle = ['#2c1f3c', '#3d2322', '#1c3542', '#2e3320'][Math.floor(rand() * 4)];
      f.fillRect(pxX, py, pw, ph);
      f.fillStyle = 'rgba(255,255,255,.15)'; f.fillRect(pxX + 3, py + 3, pw - 6, 2);
      f.fillStyle = ['#ff5b7d', '#48d6c8', '#ffd45b', '#b776ff'][Math.floor(rand() * 4)];
      f.fillRect(pxX + 4, py + 9, pw - 8, ph - 14);
      f.fillStyle = 'rgba(5,10,12,.55)'; f.fillRect(pxX + 7, py + 15, pw - 14, 2);
      f.fillRect(pxX + 7, py + 20, pw - 10, 1);
      f.globalAlpha = 0.3; f.fillStyle = '#000'; f.fillRect(pxX, py + ph, pw, 2); f.globalAlpha = 1;
    }
    // grate / tunnel dark at far left
    const tunnel = f.createLinearGradient(0, 0, 180, 0);
    tunnel.addColorStop(0, 'rgba(0,0,0,.92)');
    tunnel.addColorStop(1, 'rgba(0,0,0,0)');
    f.fillStyle = tunnel; f.fillRect(0, 16, 190, 160);
    // hanging cables
    f.strokeStyle = '#080d0e'; f.lineWidth = 2;
    for (let cx = 0; cx < 1440; cx += 240) {
      f.beginPath(); f.moveTo(cx, 16); f.bezierCurveTo(cx + 40, 34, cx + 80, 22, cx + 120, 22); f.stroke();
    }
    // ceiling lights
    for (let lx = 60; lx < 1440; lx += 180) {
      f.fillStyle = '#0a0f10'; f.fillRect(lx, 20, 52, 4);
      f.fillStyle = '#d8f3dd'; f.fillRect(lx + 3, 23, 46, 2);
      const lg = f.createLinearGradient(lx + 26, 24, lx + 26, 95);
      lg.addColorStop(0, 'rgba(204,244,215,.18)');
      lg.addColorStop(1, 'rgba(204,244,215,0)');
      f.fillStyle = lg;
      f.beginPath(); f.moveTo(lx + 8, 24); f.lineTo(lx + 44, 24); f.lineTo(lx + 62, 95); f.lineTo(lx - 10, 95); f.closePath(); f.fill();
    }
    // mid: pillars, benches, ads
    const mid = makeCanvas(1440, 270);
    const m = mid.getContext('2d');
    // train doorway silhouette at far depth? just panels
    for (let pxX = 0; pxX < 1440; pxX += 320) {
      const grad = m.createLinearGradient(pxX, 0, pxX + 44, 0);
      grad.addColorStop(0, 'rgba(8,14,15,.2)');
      grad.addColorStop(0.35, '#1b2c2c');
      grad.addColorStop(0.65, '#243a39');
      grad.addColorStop(1, 'rgba(8,14,15,.1)');
      m.fillStyle = grad; m.fillRect(pxX, 14, 44, 156);
      m.fillStyle = '#0b1415'; m.fillRect(pxX - 2, 12, 48, 5);
      m.fillStyle = '#344c4b'; m.fillRect(pxX + 7, 30, 3, 130);
      m.fillStyle = '#5a7370'; m.fillRect(pxX + 9, 30, 1, 130);
      m.fillStyle = '#0d1718'; m.fillRect(pxX + 16, 26, 18, 8);
      const pg = m.createLinearGradient(pxX + 21, 28, pxX + 21, 42);
      pg.addColorStop(0, 'rgba(255,210,90,.8)'); pg.addColorStop(1, 'rgba(255,210,90,0)');
      m.fillStyle = pg; m.fillRect(pxX + 18, 28, 14, 20);
    }
    // benches
    for (let bx = 150; bx < 1440; bx += 430) {
      m.fillStyle = '#0a0e0f'; m.fillRect(bx - 1, 142, 78, 25);
      m.fillStyle = '#332624'; m.fillRect(bx, 144, 76, 5);
      m.fillStyle = '#3d2b28'; m.fillRect(bx, 154, 76, 4);
      m.fillStyle = '#151112'; m.fillRect(bx + 6, 158, 4, 12);
      m.fillRect(bx + 66, 158, 4, 12);
      m.fillStyle = 'rgba(255,255,255,.1)'; m.fillRect(bx + 4, 145, 68, 1);
      // trash can
      m.fillStyle = '#0b1011'; m.fillRect(bx + 94, 146, 17, 24);
      m.fillStyle = '#283b3a'; m.fillRect(bx + 95, 147, 15, 4);
      m.fillStyle = '#111b1b'; m.fillRect(bx + 97, 153, 2, 15); m.fillRect(bx + 101, 153, 2, 15);
    }
    // vending machine
    m.fillStyle = '#080d0f'; m.fillRect(760, 116, 40, 54);
    m.fillStyle = '#5b1b2d'; m.fillRect(762, 118, 36, 50);
    m.fillStyle = '#e4d3a2'; m.fillRect(765, 121, 28, 20);
    m.fillStyle = '#15131b'; for (let i = 0; i < 3; i++) m.fillRect(768, 124 + i * 5, 22, 3);
    m.fillStyle = '#2ae5c7'; m.fillRect(765, 146, 26, 3);
    m.fillStyle = '#ffd23f'; m.fillRect(765, 153, 10, 4);
    // pillar overlay lighting
    for (let pxX = 0; pxX < 1440; pxX += 320) {
      const glow = m.createLinearGradient(pxX + 44, 0, pxX + 90, 0);
      glow.addColorStop(0, 'rgba(255,210,95,.1)'); glow.addColorStop(1, 'rgba(255,210,95,0)');
      m.fillStyle = glow; m.fillRect(pxX + 44, 20, 46, 150);
    }

    const ground = makeCanvas(worldW, 100);
    const gg = ground.getContext('2d');
    gradientFill(gg, 0, 0, worldW, 100, [[0, '#22292b'], [0.3, '#182022'], [1, '#0b0e10']]);
    // platform edge / tactile strip
    gg.fillStyle = '#39362f'; gg.fillRect(0, 0, worldW, 11);
    gg.fillStyle = '#ffcf42'; gg.fillRect(0, 12, worldW, 5);
    gg.fillStyle = 'rgba(0,0,0,.45)';
    for (let x = 0; x < worldW; x += 12) gg.fillRect(x, 12, 5, 5);
    gg.fillStyle = '#0a0c0e'; gg.fillRect(0, 17, worldW, 4);
    // tile grid
    for (let x = 0; x < worldW; x += 34) {
      gg.fillStyle = 'rgba(0,0,0,.2)'; gg.fillRect(x, 21, 1, 79);
      gg.fillStyle = 'rgba(255,255,255,.03)'; gg.fillRect(x + 2, 21, 30, 1);
    }
    for (let y = 21; y < 100; y += 18) {
      gg.fillStyle = 'rgba(0,0,0,.18)'; gg.fillRect(0, y, worldW, 1);
      gg.fillStyle = 'rgba(255,255,255,.02)'; gg.fillRect(0, y + 1, worldW, 1);
    }
    // stains, gum
    for (let i = 0; i < 80; i++) {
      const x = rand() * worldW, y = 23 + rand() * 74;
      gg.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,.2)' : 'rgba(190,185,165,.1)';
      gg.fillRect(x, y, 1 + rand() * 4, 1);
    }
    // wet reflections
    for (let i = 0; i < 20; i++) {
      const x = rand() * worldW;
      const grad = gg.createLinearGradient(x, 25, x, 95);
      grad.addColorStop(0, 'rgba(255,210,90,.12)');
      grad.addColorStop(1, 'rgba(255,210,90,0)');
      gg.fillStyle = grad; gg.fillRect(x, 25, 1 + rand() * 2, 58);
    }
    // hazard line at bottom
    gg.save();
    gg.globalAlpha = 0.25;
    for (let x = 0; x < worldW; x += 28) {
      gg.fillStyle = '#ffcf42';
      gg.beginPath(); gg.moveTo(x, 98); gg.lineTo(x + 14, 98); gg.lineTo(x + 24, 88); gg.lineTo(x + 10, 88); gg.closePath(); gg.fill();
    }
    gg.restore();

    return { sky, far, mid, ground, ambient: 'subway' };
  }

  function buildRooftop(worldW) {
    const rand = mulberry32(0xbeefcafe);
    const sky = makeCanvas(480, 270);
    const sg = sky.getContext('2d');
    gradientFill(sg, 0, 0, 480, 270, [
      [0, '#130d30'], [0.38, '#4a1c58'], [0.62, '#a83b63'], [0.8, '#f07b55'], [1, '#3a1e39']
    ]);
    // sun
    const sun = sg.createRadialGradient(352, 126, 8, 352, 126, 110);
    sun.addColorStop(0, 'rgba(255,230,160,.95)');
    sun.addColorStop(0.12, 'rgba(255,179,91,.75)');
    sun.addColorStop(0.45, 'rgba(255,99,86,.18)');
    sun.addColorStop(1, 'rgba(255,80,90,0)');
    sg.fillStyle = sun; sg.fillRect(210, 0, 290, 250);
    sg.fillStyle = '#ffe0a0';
    sg.beginPath(); sg.arc(352, 126, 25, 0, TAU); sg.fill();
    // clouds bands
    for (let i = 0; i < 10; i++) {
      const y = 80 + rand() * 70, x = rand() * 480, w = 40 + rand() * 100;
      sg.globalAlpha = 0.08 + rand() * 0.12;
      sg.fillStyle = i % 2 ? '#ffb989' : '#5b2d63';
      sg.beginPath(); sg.ellipse(x, y, w, 3 + rand() * 4, 0, 0, TAU); sg.fill();
    }
    sg.globalAlpha = 1;
    // stars up top
    for (let i = 0; i < 30; i++) {
      sg.globalAlpha = 0.2 + rand() * 0.5;
      sg.fillStyle = '#e7d8ff';
      sg.fillRect(rand() * 480, rand() * 60, 1, 1);
    }
    sg.globalAlpha = 1;

    const far = makeCanvas(1440, 270);
    const f = far.getContext('2d');
    // distant skyline silhouettes
    let bx = -20;
    while (bx < 1470) {
      const bw = 26 + rand() * 60;
      const bh = 30 + rand() * 100;
      const y = 170 - bh;
      f.fillStyle = rand() < 0.4 ? '#2c1830' : '#211328';
      f.fillRect(bx, y, bw, bh + 4);
      if (rand() < 0.6) drawWindowGrid(f, bx + 4, y + 5, bw - 8, bh - 12, Math.max(1, Math.floor(bw / 10)), Math.max(1, Math.floor(bh / 14)), '#ffc36b', rand, 0.2);
      if (rand() < 0.18) {
        f.fillStyle = '#ff596e'; f.fillRect(bx + bw * 0.5, y - 3, 2, 2);
      }
      bx += bw + 2 + rand() * 9;
    }
    // elevated highway
    f.fillStyle = '#170e1d'; f.fillRect(0, 138, 1440, 7);
    f.fillStyle = '#0d0811'; f.fillRect(0, 145, 1440, 3);
    for (let i = 0; i < 18; i++) f.fillRect(30 + i * 82, 138, 3, 32);
    // billboard
    f.fillStyle = '#0a0710'; f.fillRect(1000, 52, 180, 54);
    f.fillStyle = '#26122b'; f.fillRect(1003, 55, 174, 48);
    f.strokeStyle = '#ff486a'; f.lineWidth = 2; f.strokeRect(1006, 58, 168, 42);
    neonSign(f, 1090, 80, 'V-TEK', '#ff3d69', 19, 15);
    f.fillStyle = '#ffd23f'; f.fillRect(1014, 88, 30, 2);
    f.fillStyle = '#0a0710'; f.fillRect(1020, 106, 3, 64); f.fillRect(1158, 106, 3, 64);

    const mid = makeCanvas(1440, 270);
    const m = mid.getContext('2d');
    // parapet
    m.fillStyle = '#261a2b'; m.fillRect(0, 136, 1440, 34);
    m.fillStyle = '#3a293d'; m.fillRect(0, 136, 1440, 3);
    m.fillStyle = '#0d0911'; m.fillRect(0, 165, 1440, 7);
    // railing
    m.strokeStyle = '#0a070d'; m.lineWidth = 2;
    m.beginPath(); m.moveTo(0, 130); m.lineTo(1440, 130); m.stroke();
    for (let rx = 20; rx < 1440; rx += 48) {
      m.beginPath(); m.moveTo(rx, 130); m.lineTo(rx, 163); m.stroke();
    }
    // penthouse glass wall / roof structures
    m.fillStyle = '#0b0810'; m.fillRect(40, 38, 270, 132);
    m.fillStyle = '#171321'; m.fillRect(44, 42, 262, 125);
    for (let i = 0; i < 4; i++) {
      const gx = 52 + i * 62;
      const room = m.createLinearGradient(gx, 50, gx, 150);
      room.addColorStop(0, 'rgba(255,171,104,.2)');
      room.addColorStop(.55, 'rgba(145,76,78,.1)');
      room.addColorStop(1, 'rgba(18,12,22,.05)');
      m.fillStyle = room;
      m.fillRect(gx, 50, 54, 100);
      m.fillStyle = 'rgba(255,206,145,.4)';
      m.fillRect(gx + 9, 56, 20, 2);
      m.fillStyle = 'rgba(20,13,22,.72)';
      m.fillRect(gx + 5, 118, 38, 3);
      m.fillRect(gx + 8, 121, 2, 12);
      m.fillRect(gx + 36, 121, 2, 12);
      m.fillStyle = 'rgba(15,10,17,.8)';
      m.fillRect(gx + 25, 94, 3, 24);
      m.fillRect(gx + 22, 91, 9, 5);
      m.fillStyle = 'rgba(255,213,160,.16)';
      m.fillRect(gx + 12, 111, 14, 1);
      m.fillStyle = 'rgba(255,190,120,.16)';
      m.fillRect(gx + 2, 52, 2, 96);
      m.fillStyle = 'rgba(8,6,12,.65)';
      m.fillRect(gx + 54, 48, 2, 102);
    }
    m.fillStyle = 'rgba(10,7,14,.7)';
    m.fillRect(40, 88, 270, 2);
    neonSign(m, 176, 78, 'SECTOR V', '#ffcf6b', 6, 6);
    m.fillStyle = '#08060c'; m.fillRect(40, 34, 270, 5);
    // AC units
    for (let i = 0; i < 3; i++) {
      const ax = 370 + i * 72, ay = 116 + (i % 2) * 9;
      m.fillStyle = '#0a0710'; m.fillRect(ax, ay, 48, 50);
      m.fillStyle = '#2a2431'; m.fillRect(ax + 2, ay + 2, 44, 45);
      m.fillStyle = '#17131d'; m.fillRect(ax + 6, ay + 7, 36, 21);
      m.strokeStyle = '#484052'; m.lineWidth = 1;
      for (let k = 1; k < 4; k++) { m.beginPath(); m.moveTo(ax + 6, ay + 7 + k * 5); m.lineTo(ax + 42, ay + 7 + k * 5); m.stroke(); }
      m.fillStyle = '#ffd23f'; m.fillRect(ax + 39, ay + 33, 3, 3);
    }
    // antenna
    m.strokeStyle = '#0a0710'; m.lineWidth = 3;
    m.beginPath(); m.moveTo(760, 160); m.lineTo(760, 28); m.stroke();
    m.lineWidth = 1;
    m.beginPath(); m.moveTo(735, 48); m.lineTo(785, 48); m.moveTo(742, 65); m.lineTo(778, 65); m.stroke();
    m.fillStyle = '#ff3d5f'; m.fillRect(758, 24, 4, 4);
    const beacon = m.createRadialGradient(760, 26, 1, 760, 26, 30);
    beacon.addColorStop(0, 'rgba(255,61,95,.5)'); beacon.addColorStop(1, 'rgba(255,61,95,0)');
    m.fillStyle = beacon; m.fillRect(730, -4, 60, 60);
    // rooftop stairs
    m.fillStyle = '#0a070f'; m.fillRect(1180, 70, 180, 100);
    m.fillStyle = '#1a1420'; m.fillRect(1184, 74, 172, 96);
    m.fillStyle = '#08060b'; m.fillRect(1220, 108, 48, 62);
    m.fillStyle = '#ffd23f'; m.fillRect(1222, 100, 12, 3);
    neonSign(m, 1270, 92, 'EXIT', '#ffd23f', 8, 8);

    const ground = makeCanvas(worldW, 100);
    const gg = ground.getContext('2d');
    gradientFill(gg, 0, 0, worldW, 100, [[0, '#211a26'], [0.25, '#17131d'], [1, '#0b0810']]);
    // concrete slabs
    for (let x = 0; x < worldW; x += 52) {
      gg.fillStyle = 'rgba(0,0,0,.25)'; gg.fillRect(x, 12, 1, 88);
      gg.fillStyle = 'rgba(255,255,255,.035)'; gg.fillRect(x + 2, 12, 44, 1);
    }
    for (let y = 12; y < 100; y += 25) {
      gg.fillStyle = 'rgba(0,0,0,.22)'; gg.fillRect(0, y, worldW, 1);
      gg.fillStyle = 'rgba(255,200,140,.03)'; gg.fillRect(0, y + 1, worldW, 1);
    }
    // roof edge / warning stripes
    gg.fillStyle = '#33232d'; gg.fillRect(0, 0, worldW, 8);
    gg.fillStyle = '#100b14'; gg.fillRect(0, 8, worldW, 4);
    // helipad circle near boss arena
    const hx = Math.max(0, worldW - 330), hy = 56;
    gg.strokeStyle = 'rgba(255,210,63,.3)'; gg.lineWidth = 2;
    gg.beginPath(); gg.ellipse(hx, hy, 70, 24, 0, 0, TAU); gg.stroke();
    gg.font = 'bold 44px "Arial Black", sans-serif'; gg.textAlign = 'center';
    gg.fillStyle = 'rgba(255,210,63,.2)'; gg.fillText('H', hx, hy + 15);
    // vents
    for (let i = 0; i < 7; i++) {
      const vx = 80 + rand() * (worldW - 160), vy = 28 + rand() * 45;
      gg.fillStyle = 'rgba(0,0,0,.55)';
      gg.fillRect(vx, vy, 22, 8);
      gg.fillStyle = 'rgba(180,170,160,.18)';
      for (let k = 0; k < 4; k++) gg.fillRect(vx + 2, vy + 1 + k * 2, 18, 1);
    }
    // scattered sparks / dust
    for (let i = 0; i < 40; i++) {
      gg.fillStyle = rand() < 0.25 ? 'rgba(255,190,90,.2)' : 'rgba(170,160,180,.12)';
      gg.fillRect(rand() * worldW, 12 + rand() * 80, 1 + rand() * 2, 1);
    }
    // cables
    gg.strokeStyle = 'rgba(0,0,0,.65)'; gg.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const cx = 120 + rand() * (worldW - 240);
      gg.beginPath(); gg.moveTo(cx, 14); gg.bezierCurveTo(cx + 20, 36, cx + 70, 26, cx + 100, 44); gg.stroke();
    }

    return { sky, far, mid, ground, ambient: 'roof' };
  }

  function buildClub(worldW) {
    const vis = buildRooftop(worldW);
    const rand = mulberry32(0x51c0ffee);

    // Night interior: keep the skyline behind smoked glass, kill the sunset.
    const sg = vis.sky.getContext('2d');
    sg.fillStyle = 'rgba(4,2,12,.84)';
    sg.fillRect(0, 0, 480, 270);
    for (let i = 0; i < 5; i++) {
      const y = 12 + i * 9;
      const g = sg.createLinearGradient(0, y, 480, y + 3);
      g.addColorStop(0, 'rgba(255,61,130,0)');
      g.addColorStop(.35, `rgba(255,61,130,${.12 - i * .015})`);
      g.addColorStop(.65, `rgba(79,245,255,${.09 - i * .012})`);
      g.addColorStop(1, 'rgba(79,245,255,0)');
      sg.fillStyle = g;
      sg.fillRect(0, y, 480, 3);
    }
    neonSign(sg, 240, 48, 'NEON GARDEN', '#ff4fa3', 17, 13);
    sg.globalAlpha = .35;
    neonSign(sg, 240, 52, 'NEON GARDEN', '#4ff5ff', 17, 7);
    sg.globalAlpha = 1;

    // Midground: dark glass wall, neon hoops, speaker stacks, hanging truss.
    const m = vis.mid.getContext('2d');
    m.fillStyle = 'rgba(5,2,13,.64)';
    m.fillRect(0, 0, 1440, 270);
    m.strokeStyle = 'rgba(120,35,90,.6)';
    m.lineWidth = 2;
    for (let x = 20; x < 1440; x += 92) {
      m.beginPath(); m.moveTo(x, 12); m.lineTo(x, 168); m.stroke();
    }
    for (let x = 80; x < 1440; x += 360) {
      m.save();
      m.globalCompositeOperation = 'lighter';
      m.strokeStyle = 'rgba(255,79,163,.45)';
      m.lineWidth = 5;
      m.beginPath(); m.ellipse(x, 76, 52, 17, 0, 0, TAU); m.stroke();
      m.strokeStyle = 'rgba(79,245,255,.38)';
      m.lineWidth = 2;
      m.beginPath(); m.ellipse(x, 76, 62, 22, 0, 0, TAU); m.stroke();
      m.restore();
      neonSign(m, x, 84, 'GARDEN', '#ff8ac4', 8, 8);
    }
    // speaker stacks
    for (let x = 180; x < 1440; x += 360) {
      m.fillStyle = '#07040c'; m.fillRect(x, 92, 46, 76);
      m.fillStyle = '#1c1322'; m.fillRect(x + 3, 95, 40, 70);
      for (let k = 0; k < 3; k++) {
        m.fillStyle = '#0b0810'; m.fillRect(x + 7, 101 + k * 21, 32, 14);
        m.fillStyle = '#2c2034'; m.beginPath(); m.arc(x + 23, 108 + k * 21, 5, 0, TAU); m.fill();
      }
      m.fillStyle = '#ff4fa3'; m.fillRect(x + 40, 158, 2, 2);
    }
    // truss / warm house lights
    m.fillStyle = '#0a0710'; m.fillRect(0, 24, 1440, 4);
    for (let x = 40; x < 1440; x += 120) {
      m.strokeStyle = '#241a2b'; m.lineWidth = 2;
      m.beginPath(); m.moveTo(x, 28); m.lineTo(x, 46); m.stroke();
      m.fillStyle = '#ffcf7a'; m.fillRect(x - 4, 46, 9, 3);
      m.fillStyle = 'rgba(255,207,122,.16)'; m.fillRect(x - 7, 49, 15, 1);
    }

    // Ground: checkered dance floor with neon light pools.
    const gg = vis.ground.getContext('2d');
    gg.fillStyle = 'rgba(9,3,16,.62)';
    gg.fillRect(0, 0, worldW, 100);
    for (let x = 0; x < worldW; x += 28) {
      for (let y = 12; y < 100; y += 20) {
        const even = ((x / 28) | 0) % 2 === ((y / 20) | 0) % 2;
        gg.fillStyle = even ? 'rgba(255,79,163,.05)' : 'rgba(79,245,255,.045)';
        gg.fillRect(x + 1, y + 1, 26, 18);
      }
    }
    for (let x = 140; x < worldW; x += 320) {
      const pool = gg.createRadialGradient(x, 56, 2, x, 56, 92);
      pool.addColorStop(0, x % 640 ? 'rgba(255,79,163,.14)' : 'rgba(79,245,255,.13)');
      pool.addColorStop(1, 'rgba(0,0,0,0)');
      gg.fillStyle = pool;
      gg.fillRect(x - 100, 12, 200, 88);
    }
    gg.fillStyle = '#2b1730'; gg.fillRect(0, 0, worldW, 5);
    gg.fillStyle = '#ffd23f'; gg.globalAlpha = .2; gg.fillRect(0, 5, worldW, 1); gg.globalAlpha = 1;
    // velvet rope posts
    for (let x = 60; x < worldW; x += 210) {
      gg.fillStyle = '#0b0810'; gg.fillRect(x, 20, 3, 15);
      gg.fillStyle = '#c9a24a'; gg.fillRect(x, 18, 3, 3);
    }

    vis.ambient = 'club';
    vis.clubLights = [];
    for (let i = 0; i < 6; i++) vis.clubLights.push({ x: rand() * 1440, phase: rand() * TAU, speed: .4 + rand() * .7, color: rand() < .5 ? '255,79,163' : '79,245,255' });
    return vis;
  }

  function buildFinale(worldW) {
    const vis = buildRooftop(worldW);
    const rand = mulberry32(0x0deada55);

    // Eclipse dawn: the sunset is swallowed by a black-red halo.
    const sg = vis.sky.getContext('2d');
    sg.fillStyle = 'rgba(5,2,8,.8)';
    sg.fillRect(0, 0, 480, 270);
    const halo = sg.createRadialGradient(240, 98, 10, 240, 98, 120);
    halo.addColorStop(0, 'rgba(255,38,79,.5)');
    halo.addColorStop(.35, 'rgba(150,18,52,.22)');
    halo.addColorStop(1, 'rgba(20,4,12,0)');
    sg.fillStyle = halo; sg.fillRect(90, -10, 300, 230);
    sg.fillStyle = '#07030a';
    sg.beginPath(); sg.arc(240, 98, 34, 0, TAU); sg.fill();
    sg.strokeStyle = '#ff264f'; sg.lineWidth = 3; sg.globalAlpha = .9;
    sg.beginPath(); sg.arc(240, 98, 37, 0, TAU); sg.stroke();
    sg.globalAlpha = 1;
    neonSign(sg, 240, 172, 'V // THRONE', '#ff264f', 13, 12);
    for (let i = 0; i < 8; i++) {
      sg.globalAlpha = .15 + rand() * .2;
      sg.fillStyle = '#ff6b7f';
      sg.fillRect(rand() * 480, rand() * 55, 1 + rand() * 2, 1);
    }
    sg.globalAlpha = 1;

    // Midground: monolithic core wall, server pylons, cables, gold banners.
    const m = vis.mid.getContext('2d');
    m.fillStyle = 'rgba(7,2,9,.7)';
    m.fillRect(0, 0, 1440, 270);
    for (let x = 0; x < 1440; x += 60) {
      m.fillStyle = 'rgba(36,10,24,.55)';
      m.fillRect(x, 40, 2, 130);
    }
    for (let x = 260; x < 1440; x += 430) {
      // server monolith
      m.fillStyle = '#08050c'; m.fillRect(x, 52, 70, 118);
      m.fillStyle = '#1a0d1a'; m.fillRect(x + 3, 55, 64, 112);
      for (let y = 62; y < 158; y += 10) {
        m.fillStyle = 'rgba(255,38,79,.28)'; m.fillRect(x + 8, y, 42, 1);
        if ((y / 10) % 3 === 0) { m.fillStyle = 'rgba(255,211,77,.5)'; m.fillRect(x + 56, y, 4, 2); }
      }
      m.fillStyle = '#ff264f'; m.fillRect(x + 33, 46, 4, 6);
      // cable
      m.strokeStyle = 'rgba(0,0,0,.8)'; m.lineWidth = 2;
      m.beginPath(); m.moveTo(x + 35, 170); m.bezierCurveTo(x + 80, 190, x - 10, 200, x + 45, 230); m.stroke();
    }
    // giant V sigil
    m.save();
    m.globalCompositeOperation = 'lighter';
    m.strokeStyle = 'rgba(255,38,79,.4)';
    m.lineWidth = 12;
    m.beginPath();
    m.moveTo(900, 54); m.lineTo(1015, 168); m.lineTo(1130, 54);
    m.stroke();
    m.strokeStyle = 'rgba(255,211,77,.18)';
    m.lineWidth = 4;
    m.stroke();
    m.restore();
    // gold banners
    for (let x = 120; x < 1440; x += 360) {
      m.fillStyle = '#3a0d1b'; m.fillRect(x, 30, 26, 96);
      m.fillStyle = '#c9a24a'; m.fillRect(x + 3, 30, 2, 96);
      m.fillStyle = 'rgba(255,211,77,.16)'; m.fillRect(x + 8, 44, 10, 1);
    }

    // Ground: black marble with gold inlay and the boss sigil.
    const gg = vis.ground.getContext('2d');
    gg.fillStyle = 'rgba(6,2,8,.72)';
    gg.fillRect(0, 0, worldW, 100);
    for (let x = 0; x < worldW; x += 80) {
      gg.fillStyle = 'rgba(201,162,74,.10)'; gg.fillRect(x, 12, 1, 88);
      gg.fillStyle = 'rgba(255,38,79,.07)'; gg.fillRect(x + 2, 12, 46, 1);
    }
    for (let y = 24; y < 100; y += 26) {
      gg.fillStyle = 'rgba(201,162,74,.08)'; gg.fillRect(0, y, worldW, 1);
    }
    const arena = worldW - 650;
    const ring = gg.createRadialGradient(arena, 52, 4, arena, 52, 78);
    ring.addColorStop(0, 'rgba(255,38,79,.18)');
    ring.addColorStop(.6, 'rgba(255,38,79,.07)');
    ring.addColorStop(1, 'rgba(0,0,0,0)');
    gg.fillStyle = ring; gg.fillRect(arena - 90, 12, 180, 88);
    gg.strokeStyle = 'rgba(255,211,77,.35)'; gg.lineWidth = 2;
    gg.beginPath(); gg.ellipse(arena, 56, 66, 22, 0, 0, TAU); gg.stroke();
    gg.fillStyle = 'rgba(255,38,79,.4)';
    gg.font = 'bold 26px "Arial Black", sans-serif'; gg.textAlign = 'center';
    gg.fillText('V', arena, 66);
    gg.fillStyle = '#2b1018'; gg.fillRect(0, 0, worldW, 5);
    gg.fillStyle = '#c9a24a'; gg.globalAlpha = .4; gg.fillRect(0, 5, worldW, 1); gg.globalAlpha = 1;

    vis.ambient = 'finale';
    vis.finaleMotes = [];
    for (let i = 0; i < 28; i++) vis.finaleMotes.push({ x: rand() * 480, y: rand() * 270, speed: 8 + rand() * 24, size: 1 + Math.floor(rand() * 2), phase: rand() * TAU });
    return vis;
  }

  function buildHouse(worldW) {
    const vis = buildClub(worldW);
    const rand = mulberry32(0x40e5ca51);

    const sg = vis.sky.getContext('2d');
    sg.clearRect(0, 0, 480, 270);
    gradientFill(sg, 0, 0, 480, 270, [
      [0, '#12060d'], [.42, '#260b17'], [.72, '#4a1520'], [1, '#12060d']
    ]);
    for (let x = 0; x < 480; x += 48) {
      sg.fillStyle = 'rgba(255,211,77,.055)'; sg.fillRect(x, 0, 1, 182);
      sg.fillStyle = 'rgba(0,0,0,.22)'; sg.fillRect(x + 1, 0, 2, 182);
    }
    for (let i = 0; i < 3; i++) {
      const x = 92 + i * 108;
      sg.fillStyle = '#070c14'; sg.fillRect(x, 22, 76, 142);
      sg.strokeStyle = 'rgba(201,162,74,.55)'; sg.lineWidth = 2; sg.strokeRect(x, 22, 76, 142);
      sg.strokeStyle = 'rgba(201,162,74,.18)'; sg.lineWidth = 1;
      sg.beginPath(); sg.moveTo(x + 38, 22); sg.lineTo(x + 38, 164); sg.stroke();
      sg.beginPath(); sg.moveTo(x, 72); sg.lineTo(x + 76, 72); sg.stroke();
      for (let k = 0; k < 16; k++) {
        sg.fillStyle = k % 3 ? 'rgba(255,207,122,.36)' : 'rgba(255,79,120,.35)';
        sg.fillRect(x + 6 + rand() * 64, 32 + rand() * 128, 1 + rand() * 2, 1 + rand() * 2);
      }
      for (let k = 0; k < 12; k++) {
        sg.strokeStyle = 'rgba(180,215,255,.18)'; sg.lineWidth = 1;
        const rx = x + 4 + rand() * 68, ry = 24 + rand() * 135;
        sg.beginPath(); sg.moveTo(rx, ry); sg.lineTo(rx - 2, ry + 6 + rand() * 5); sg.stroke();
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = 64 + i * 176;
      sg.strokeStyle = 'rgba(255,211,77,.5)'; sg.lineWidth = 2;
      sg.beginPath(); sg.moveTo(x, 0); sg.lineTo(x, 22); sg.stroke();
      for (let k = 0; k < 5; k++) {
        sg.fillStyle = 'rgba(255,211,77,.55)';
        sg.fillRect(x - 16 + k * 8, 22, 2, 4 + (k % 2) * 4);
      }
      const glow = sg.createRadialGradient(x, 34, 2, x, 34, 70);
      glow.addColorStop(0, 'rgba(255,211,77,.22)'); glow.addColorStop(1, 'rgba(255,211,77,0)');
      sg.fillStyle = glow; sg.fillRect(x - 75, 0, 150, 120);
    }
    neonSign(sg, 240, 30, 'THE HOUSE', '#ffd34d', 17, 12);
    sg.globalAlpha = .28;
    neonSign(sg, 240, 34, 'THE HOUSE', '#ff4f6d', 17, 6);
    sg.globalAlpha = 1;

    const m = vis.mid.getContext('2d');
    m.clearRect(0, 0, 1440, 270);
    m.fillStyle = 'rgba(12,4,9,.56)'; m.fillRect(0, 0, 1440, 270);
    for (let x = 0; x < 1440; x += 120) {
      m.fillStyle = 'rgba(255,211,77,.05)'; m.fillRect(x, 0, 2, 176);
      m.fillStyle = 'rgba(0,0,0,.26)'; m.fillRect(x + 2, 0, 3, 176);
    }
    for (let x = 60; x < 1440; x += 360) {
      m.fillStyle = '#09060a'; m.fillRect(x, 30, 24, 150);
      m.fillStyle = '#2b1018'; m.fillRect(x + 3, 34, 18, 146);
      m.fillStyle = '#c9a24a'; m.fillRect(x + 10, 38, 2, 138);
      m.fillStyle = 'rgba(255,211,77,.14)'; m.fillRect(x + 14, 42, 4, 128);
      m.fillStyle = '#120a10'; m.fillRect(x + 34, 90, 120, 8);
      m.fillStyle = '#5b2a24'; m.fillRect(x + 34, 98, 120, 4);
      m.fillStyle = 'rgba(255,211,77,.25)'; m.fillRect(x + 36, 102, 116, 1);
      for (let b = 0; b < 7; b++) {
        m.fillStyle = b % 2 ? '#5b2a24' : '#2f5a4a';
        m.fillRect(x + 42 + b * 11, 76 + (b % 3), 3, 14);
        m.fillStyle = 'rgba(255,211,77,.4)'; m.fillRect(x + 43 + b * 11, 76 + (b % 3), 1, 3);
      }
    }
    for (let x = 150; x < 1440; x += 430) {
      m.fillStyle = '#0a070a'; m.fillRect(x, 114, 112, 38);
      m.fillStyle = '#1b5a3b'; m.fillRect(x + 3, 117, 106, 32);
      m.fillStyle = 'rgba(255,211,77,.32)'; m.fillRect(x + 3, 117, 106, 1);
      m.fillStyle = 'rgba(0,0,0,.35)'; m.fillRect(x + 8, 122, 96, 1);
      m.fillStyle = '#c9a24a'; m.beginPath(); m.arc(x + 56, 130, 13, 0, TAU); m.fill();
      m.fillStyle = '#1b5a3b'; m.beginPath(); m.arc(x + 56, 130, 9, 0, TAU); m.fill();
      m.fillStyle = '#ff4f6d'; m.fillRect(x + 55, 124, 2, 4);
      m.fillStyle = '#0a070a'; m.fillRect(x + 54, 135, 4, 12);
      m.strokeStyle = '#c9a24a'; m.lineWidth = 1;
      m.beginPath(); m.moveTo(x + 56, 0); m.lineTo(x + 56, 62); m.stroke();
      m.fillStyle = '#ffd34d'; m.fillRect(x + 48, 62, 16, 3);
      m.fillStyle = 'rgba(255,211,77,.18)'; m.fillRect(x + 40, 65, 32, 1);
    }
    for (let x = 20; x < 1440; x += 210) {
      m.fillStyle = '#0b0709'; m.fillRect(x, 150, 3, 20);
      m.fillStyle = '#c9a24a'; m.fillRect(x, 148, 3, 3);
      m.strokeStyle = 'rgba(255,79,109,.32)'; m.lineWidth = 2;
      m.beginPath(); m.moveTo(x - 49, 151); m.quadraticCurveTo(x, 163, x + 49, 151); m.stroke();
    }

    // House wordmark: the neon anchor for the stage card and the room.
    neonSign(m, 240, 74, 'THE HOUSE', '#ffd34d', 22, 11);
    m.globalAlpha = .32;
    neonSign(m, 240, 77, 'THE HOUSE', '#ff4f6d', 22, 5);
    m.globalAlpha = 1;
    for (let x = 720; x < 1440; x += 480) {
      m.globalAlpha = .45;
      neonSign(m, x, 70, 'BET', '#ff4f6d', 10, 7);
      m.globalAlpha = 1;
    }

    // Chandeliers: brass arms, warm bulbs and crystal drops.
    for (let x = 240; x < 1440; x += 480) {
      m.strokeStyle = 'rgba(201,162,74,.8)'; m.lineWidth = 2;
      m.beginPath(); m.moveTo(x, 0); m.lineTo(x, 22); m.stroke();
      m.fillStyle = '#c9a24a'; m.beginPath(); m.ellipse(x, 24, 34, 7, 0, 0, TAU); m.fill();
      m.fillStyle = '#7a4e18'; m.beginPath(); m.ellipse(x, 25, 22, 4, 0, 0, TAU); m.fill();
      m.strokeStyle = '#ffd34d'; m.lineWidth = 2;
      for (let k = 0; k < 6; k++) {
        const a = -Math.PI * .85 + k * Math.PI * .34;
        const ex = x + Math.cos(a) * 42, ey = 30 + Math.sin(a) * 18;
        m.beginPath(); m.moveTo(x, 26); m.quadraticCurveTo(x + Math.cos(a) * 22, 18, ex, ey); m.stroke();
        m.fillStyle = '#fff2b0'; m.fillRect(ex - 2, ey, 4, 3);
        for (let d = 0; d < 3; d++) {
          m.fillStyle = d % 2 ? 'rgba(255,242,176,.8)' : 'rgba(255,211,77,.55)';
          m.fillRect(ex - 1 + (d - 1) * 3, ey + 4 + d * 3, 1, 4);
        }
      }
      m.fillStyle = '#ffd34d'; m.beginPath(); m.arc(x, 28, 5, 0, TAU); m.fill();
      const glow = m.createRadialGradient(x, 36, 2, x, 36, 80);
      glow.addColorStop(0, 'rgba(255,211,77,.18)'); glow.addColorStop(1, 'rgba(255,211,77,0)');
      m.fillStyle = glow; m.fillRect(x - 90, 0, 180, 125);
    }

    // Roulette wheels: the signature casino silhouette.
    for (let x = 360; x < 1440; x += 720) {
      m.fillStyle = 'rgba(0,0,0,.45)'; m.beginPath(); m.ellipse(x, 160, 42, 8, 0, 0, TAU); m.fill();
      m.fillStyle = '#1a1008'; m.fillRect(x - 4, 126, 8, 30);
      m.fillStyle = '#c9a24a'; m.beginPath(); m.arc(x, 108, 38, 0, TAU); m.fill();
      m.fillStyle = '#0d3b2a'; m.beginPath(); m.arc(x, 108, 33, 0, TAU); m.fill();
      for (let k = 0; k < 16; k++) {
        const a = k * TAU / 16;
        m.strokeStyle = k % 2 ? 'rgba(255,79,109,.8)' : 'rgba(255,242,176,.8)';
        m.lineWidth = 2;
        m.beginPath(); m.moveTo(x + Math.cos(a) * 14, 108 + Math.sin(a) * 14); m.lineTo(x + Math.cos(a) * 31, 108 + Math.sin(a) * 31); m.stroke();
      }
      m.strokeStyle = '#ffd34d'; m.lineWidth = 2; m.beginPath(); m.arc(x, 108, 27, 0, TAU); m.stroke();
      m.fillStyle = '#c9a24a'; m.beginPath(); m.arc(x, 108, 8, 0, TAU); m.fill();
      m.fillStyle = '#3a1808'; m.beginPath(); m.arc(x, 108, 4, 0, TAU); m.fill();
      m.fillStyle = '#fff8e0'; m.beginPath(); m.arc(x + 18, 94, 2, 0, TAU); m.fill();
      const glow = m.createRadialGradient(x, 108, 4, x, 108, 62);
      glow.addColorStop(0, 'rgba(255,211,77,.16)'); glow.addColorStop(1, 'rgba(255,211,77,0)');
      m.fillStyle = glow; m.fillRect(x - 70, 46, 140, 125);
    }

    // Chip stacks and a fanned hand on the green table.
    for (let x = 150; x < 1440; x += 430) {
      for (let s = 0; s < 3; s++) {
        const cx = x + 18 + s * 13, ch = 3 + (s % 2) * 3;
        for (let k = 0; k < ch; k++) {
          m.fillStyle = k % 2 ? '#c73b4d' : '#f1d27a';
          m.beginPath(); m.ellipse(cx, 129 - k * 3, 7, 2.4, 0, 0, TAU); m.fill();
          m.strokeStyle = 'rgba(20,8,10,.5)'; m.lineWidth = 1;
          m.beginPath(); m.ellipse(cx, 129 - k * 3, 7, 2.4, 0, 0, TAU); m.stroke();
        }
      }
      for (let c = 0; c < 5; c++) {
        m.save(); m.translate(x + 78 + c * 5, 128 - c * 2); m.rotate(-.18 + c * .09);
        m.fillStyle = '#fff4d2'; m.fillRect(-4, -8, 8, 11);
        m.strokeStyle = '#c9a24a'; m.lineWidth = 1; m.strokeRect(-4, -8, 8, 11);
        m.fillStyle = c % 2 ? '#b3122b' : '#161018'; m.fillRect(-1, -5, 2, 2);
        m.restore();
      }
    }


    const gg = vis.ground.getContext('2d');
    gg.clearRect(0, 0, worldW, 100);
    gg.fillStyle = 'rgba(18,5,10,.64)'; gg.fillRect(0, 0, worldW, 100);
    for (let x = 0; x < worldW; x += 36) {
      gg.strokeStyle = 'rgba(201,162,74,.10)'; gg.lineWidth = 1;
      gg.beginPath(); gg.moveTo(x, 10); gg.lineTo(x + 18, 28); gg.lineTo(x, 46); gg.lineTo(x - 18, 28); gg.closePath(); gg.stroke();
    }
    for (let x = 140; x < worldW; x += 320) {
      const pool = gg.createRadialGradient(x, 36, 2, x, 36, 100);
      pool.addColorStop(0, 'rgba(255,211,77,.13)'); pool.addColorStop(1, 'rgba(255,211,77,0)');
      gg.fillStyle = pool; gg.fillRect(x - 110, 4, 220, 90);
    }
    gg.fillStyle = '#2b1018'; gg.fillRect(0, 0, worldW, 5);
    gg.fillStyle = '#c9a24a'; gg.globalAlpha = .5; gg.fillRect(0, 5, worldW, 1); gg.globalAlpha = 1;
    for (let x = 60; x < worldW; x += 150) {
      gg.fillStyle = '#c9a24a'; gg.fillRect(x, 14, 2, 2);
      gg.fillStyle = '#ff4f6d'; gg.fillRect(x + 5, 15, 2, 2);
    }

    vis.ambient = 'house';
    vis.houseLights = [];
    for (let i = 0; i < 7; i++) vis.houseLights.push({ x: rand() * 1440, phase: rand() * TAU, speed: .35 + rand() * .6 });
    return vis;
  }

  function buildStage(index, worldW) {
    const vis = index === 0 ? buildDocks(worldW)
      : index === 1 ? buildSubway(worldW)
      : index === 2 ? buildRooftop(worldW)
      : index === 3 ? buildClub(worldW)
      : index === 4 ? buildHouse(worldW)
      : buildFinale(worldW);
    const rand = mulberry32(0xabc123 + index * 777);
    vis.rain = [];
    for (let i = 0; i < 80; i++) {
      vis.rain.push({ x: rand() * 480, y: rand() * 270, speed: 130 + rand() * 130, len: 5 + rand() * 6, alpha: 0.12 + rand() * 0.2 });
    }
    vis.motes = [];
    for (let i = 0; i < 34; i++) {
      vis.motes.push({ x: rand() * 480, y: rand() * 270, speed: 6 + rand() * 18, size: 1 + Math.floor(rand() * 2), phase: rand() * TAU });
    }
    vis.lights = [];
    for (let i = 0; i < 12; i++) vis.lights.push({ x: rand() * 1440, y: 20 + rand() * 20, phase: rand() * TAU, speed: 0.7 + rand() * 2 });
    return vis;
  }

  function drawBackground(g, index, vis, camX, t, W, H) {
    g.drawImage(vis.sky, 0, 0, W, H);
    // far parallax
    const farW = vis.far.width;
    let off = (camX * 0.13) % farW;
    for (let x = -off; x < W; x += farW) g.drawImage(vis.far, Math.round(x), 0);
    // mid parallax
    const midW = vis.mid.width;
    off = (camX * 0.37) % midW;
    for (let x = -off; x < W; x += midW) g.drawImage(vis.mid, Math.round(x), 0);

    // dynamic lights in the midground
    if (vis.ambient === 'subway') {
      for (const l of vis.lights) {
        const sx = (l.x - camX * 0.37) % 1440;
        if (sx < -80 || sx > W + 80) continue;
        const flicker = 0.32 + Math.sin(t * l.speed * 3 + l.phase) * 0.12 + (Math.sin(t * 19 + l.phase) > 0.96 ? -0.18 : 0);
        const grd = g.createRadialGradient(sx, 24, 2, sx, 24, 46);
        grd.addColorStop(0, `rgba(209,245,214,${Math.max(.04, flicker)})`);
        grd.addColorStop(1, 'rgba(209,245,214,0)');
        g.fillStyle = grd;
        g.fillRect(sx - 50, 0, 100, 95);
      }
    } else if (vis.ambient === 'roof') {
      // sun haze
      const haze = g.createLinearGradient(0, 50, 0, 180);
      haze.addColorStop(0, 'rgba(255,171,98,0.05)');
      haze.addColorStop(0.55, 'rgba(255,128,80,0.11)');
      haze.addColorStop(1, 'rgba(255,128,80,0)');
      g.fillStyle = haze; g.fillRect(0, 40, W, 160);
    } else if (vis.ambient === 'club') {
      // moving spotlights sweeping the dance floor
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const l of vis.clubLights) {
        const sx = (l.x - camX * 0.37) % 1440;
        if (sx < -140 || sx > W + 140) continue;
        const sway = Math.sin(t * l.speed + l.phase) * 58;
        const topX = sx, floorX = sx + sway;
        const grd = g.createLinearGradient(topX, 16, floorX, 190);
        grd.addColorStop(0, `rgba(${l.color},.16)`);
        grd.addColorStop(1, `rgba(${l.color},0)`);
        g.fillStyle = grd;
        g.beginPath();
        g.moveTo(topX - 5, 16);
        g.lineTo(topX + 5, 16);
        g.lineTo(floorX + 44, 196);
        g.lineTo(floorX - 44, 196);
        g.closePath();
        g.fill();
      }
      g.restore();
    } else if (vis.ambient === 'house') {
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const l of vis.houseLights) {
        const sx = (l.x - camX * 0.37) % 1440;
        if (sx < -120 || sx > W + 120) continue;
        const sway = Math.sin(t * l.speed + l.phase) * 24;
        const grd = g.createRadialGradient(sx + sway, 22, 2, sx + sway, 22, 120);
        grd.addColorStop(0, 'rgba(255,211,77,.13)');
        grd.addColorStop(.5, 'rgba(255,79,109,.045)');
        grd.addColorStop(1, 'rgba(255,211,77,0)');
        g.fillStyle = grd; g.fillRect(sx - 130, 0, 260, 210);
      }
      g.restore();
    } else if (vis.ambient === 'finale') {
      const haze = g.createLinearGradient(0, 40, 0, 190);
      haze.addColorStop(0, 'rgba(255,38,79,.08)');
      haze.addColorStop(.55, 'rgba(120,10,32,.12)');
      haze.addColorStop(1, 'rgba(255,38,79,0)');
      g.fillStyle = haze; g.fillRect(0, 30, W, 170);
      // distant lightning behind the eclipse
      const strike = Math.sin(t * 1.7) + Math.sin(t * 4.3);
      if (strike > 1.86) {
        g.save();
        g.globalAlpha = .3;
        g.strokeStyle = '#ff6b7f';
        g.lineWidth = 1;
        g.beginPath();
        let lx = 300, ly = 20;
        g.moveTo(lx, ly);
        for (let i = 0; i < 5; i++) { lx += Math.sin(t * 20 + i) * 14; ly += 15; g.lineTo(lx, ly); }
        g.stroke();
        g.restore();
      }
    }

    // ground crop
    const gy = 170;
    g.drawImage(vis.ground, camX, 0, W, 100, 0, gy, W, 100);
    // soft mist at ground level
    const mist = g.createLinearGradient(0, gy - 4, 0, gy + 35);
    if (vis.ambient === 'roof') {
      mist.addColorStop(0, 'rgba(255,150,100,.06)');
      mist.addColorStop(1, 'rgba(255,150,100,0)');
    } else if (vis.ambient === 'subway') {
      mist.addColorStop(0, 'rgba(140,210,190,.05)');
      mist.addColorStop(1, 'rgba(140,210,190,0)');
    } else if (vis.ambient === 'club') {
      mist.addColorStop(0, 'rgba(255,79,163,.08)');
      mist.addColorStop(1, 'rgba(79,245,255,0)');
    } else if (vis.ambient === 'finale') {
      mist.addColorStop(0, 'rgba(255,38,79,.09)');
      mist.addColorStop(1, 'rgba(255,211,77,0)');
    } else {
      mist.addColorStop(0, 'rgba(130,90,180,.08)');
      mist.addColorStop(1, 'rgba(130,90,180,0)');
    }
    g.fillStyle = mist; g.fillRect(0, gy - 4, W, 38);

    // weather / particles
    if (vis.ambient === 'rain') {
      g.save();
      g.lineCap = 'butt';
      for (const r of vis.rain) {
        const x = ((r.x - camX * 0.55 - t * 17) % W + W) % W;
        const y = ((r.y + t * r.speed) % (H + 30)) - 15;
        g.globalAlpha = r.alpha;
        g.strokeStyle = '#a9d8ff';
        g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2.5, y + r.len); g.stroke();
      }
      g.restore();
      // neon glow wash
      const glow = g.createLinearGradient(0, 150, 0, 270);
      glow.addColorStop(0, 'rgba(255,46,99,0)');
      glow.addColorStop(1, 'rgba(255,46,99,.045)');
      g.fillStyle = glow; g.fillRect(0, 140, W, 130);
    } else if (vis.ambient === 'subway') {
      for (let i = 0; i < 26; i++) {
        const p = vis.motes[i];
        const x = (p.x + Math.sin(t * 0.5 + p.phase) * 14) % W;
        const y = (p.y + t * p.speed * 0.4) % H;
        g.globalAlpha = 0.16;
        g.fillStyle = '#d6efdf';
        g.fillRect(x, y, p.size, p.size);
      }
      g.globalAlpha = 1;
    } else if (vis.ambient === 'roof') {
      // embers
      for (let i = 0; i < 28; i++) {
        const p = vis.motes[i];
        const x = (p.x + t * p.speed * 0.6 + Math.sin(t + p.phase) * 20) % W;
        const y = ((p.y - t * p.speed * 0.9) % H + H) % H;
        g.globalAlpha = 0.15 + (Math.sin(t * 2 + p.phase) + 1) * 0.12;
        g.fillStyle = i % 3 === 0 ? '#ffd56a' : '#ff8a62';
        g.fillRect(x, y, p.size, p.size);
      }
      g.globalAlpha = 1;
    } else if (vis.ambient === 'club') {
      // glitter drifting through the spotlights
      for (let i = 0; i < 30; i++) {
        const p = vis.motes[i];
        const x = (p.x + Math.sin(t * .6 + p.phase) * 12) % W;
        const y = ((p.y + t * p.speed * .35) % H + H) % H;
        g.globalAlpha = .12 + (Math.sin(t * 3 + p.phase) + 1) * .1;
        g.fillStyle = i % 3 === 0 ? '#4ff5ff' : '#ff8ac4';
        g.fillRect(x, y, p.size, p.size);
      }
      g.globalAlpha = 1;
    } else if (vis.ambient === 'finale') {
      // burning motes and slow energy streaks
      for (let i = 0; i < 28; i++) {
        const p = vis.finaleMotes[i];
        const x = (p.x + t * p.speed * .6 + Math.sin(t + p.phase) * 18) % W;
        const y = ((p.y - t * p.speed * .8) % H + H) % H;
        g.globalAlpha = .16 + (Math.sin(t * 2.4 + p.phase) + 1) * .14;
        g.fillStyle = i % 4 === 0 ? '#ffd34d' : '#ff4b5e';
        g.fillRect(x, y, p.size, p.size);
      }
      g.globalAlpha = 1;
    }
  }

  function drawItem(g, x, y, type, t) {
    const bob = Math.sin(t * 5 + x * 0.2) * 1.4;
    const yy = y + bob;
    const heal = type === 'apple' || type === 'burger' || type === 'milk' || type === 'steak';
    const money = type === 'cash' || type === 'gold' || type === 'moneybag';
    const upgradeColor = type === 'boostAttack' ? '255,91,107' : type === 'boostDefense' ? '87,227,137' : type === 'boostSpeed' ? '41,231,255' : null;
    const col = upgradeColor ? `rgba(${upgradeColor},` : type === 'moneybag' ? 'rgba(196,137,74,' : type === 'overdrive' ? 'rgba(165,108,255,' : heal ? 'rgba(87,227,137,' : money ? 'rgba(255,210,63,' : 'rgba(41,231,255,';
    g.save();
    const grd = g.createRadialGradient(x, yy - 7, 1, x, yy - 7, 17);
    grd.addColorStop(0, col + '.26)');
    grd.addColorStop(1, col + '0)');
    g.fillStyle = grd; g.fillRect(x - 18, yy - 24, 36, 32);
    if (type === 'apple') {
      px(g, x - 4, yy - 10, 8, 8, INK);
      px(g, x - 3, yy - 9, 6, 6, '#e7414f');
      px(g, x - 2, yy - 9, 2, 2, '#ff9a94');
      px(g, x, yy - 12, 2, 3, '#6b3e24');
      px(g, x + 2, yy - 12, 3, 2, '#57e389');
    } else if (type === 'burger') {
      px(g, x - 7, yy - 11, 14, 3, INK);
      px(g, x - 6, yy - 12, 12, 5, '#d89a42');
      px(g, x - 6, yy - 8, 12, 2, '#8cbf4c');
      px(g, x - 6, yy - 6, 12, 3, '#6b3422');
      px(g, x - 6, yy - 3, 12, 3, '#e0aa55');
      px(g, x - 4, yy - 11, 7, 1, '#ffd27c');
      px(g, x - 4, yy - 5, 8, 1, '#b5582f');
    } else if (type === 'milk') {
      // milk carton
      px(g, x - 5, yy - 12, 10, 13, INK);
      px(g, x - 4, yy - 11, 8, 11, '#f3ead8');
      px(g, x - 4, yy - 11, 8, 3, '#62c7e8');
      px(g, x - 4, yy - 7, 2, 7, '#d8f5ff');
      px(g, x + 1, yy - 7, 2, 4, '#2c5c92');
      px(g, x - 2, yy - 13, 4, 2, '#62c7e8');
      px(g, x + 2, yy - 14, 1, 3, '#f3ead8');
    } else if (type === 'steak') {
      // T-bone steak
      px(g, x - 8, yy - 10, 16, 11, INK);
      px(g, x - 7, yy - 9, 13, 8, '#8e3f31');
      px(g, x - 6, yy - 8, 11, 6, '#c85a44');
      px(g, x - 5, yy - 7, 7, 3, '#e98968');
      px(g, x + 3, yy - 10, 6, 3, '#f1e3cd');
      px(g, x + 6, yy - 11, 2, 2, '#fff8e8');
      px(g, x - 4, yy - 4, 7, 1, '#5b2a22');
    } else if (type === 'overdrive') {
      // overdrive core: a violet prism with a gold core
      px(g, x - 6, yy - 13, 12, 15, INK);
      px(g, x - 5, yy - 12, 10, 12, '#3b1a58');
      px(g, x - 4, yy - 11, 8, 10, '#a56cff');
      px(g, x - 2, yy - 9, 4, 6, '#fff3b0');
      px(g, x - 1, yy - 8, 2, 4, '#fffdf0');
      px(g, x - 4, yy - 2, 8, 2, '#6d38b8');
      px(g, x - 7, yy - 11, 2, 4, '#cba9ff');
      px(g, x + 5, yy - 6, 2, 3, '#ffd34d');
    } else if (type === 'cash') {
      px(g, x - 7, yy - 8, 15, 9, INK);
      px(g, x - 6, yy - 8, 13, 7, '#4f9d58');
      px(g, x - 4, yy - 7, 9, 5, '#7ed67d');
      px(g, x - 2, yy - 6, 5, 3, '#d8f5c9');
      px(g, x + 3, yy - 2, 6, 3, '#ffd23f');
    } else if (type === 'gold') {
      // two stacked gold ingots
      px(g, x - 9, yy - 7, 18, 8, INK);
      px(g, x - 8, yy - 6, 16, 6, '#b8781c');
      px(g, x - 10, yy - 12, 15, 7, INK);
      px(g, x - 9, yy - 11, 14, 5, '#ffd24a');
      px(g, x - 7, yy - 11, 8, 1, '#fff2a6');
      px(g, x - 6, yy - 5, 7, 1, '#ffe68b');
      px(g, x + 3, yy - 4, 3, 2, '#8d5a12');
    } else if (type === 'moneybag') {
      px(g, x - 8, yy - 9, 16, 12, INK);
      px(g, x - 7, yy - 8, 14, 10, '#6d4a26');
      px(g, x - 6, yy - 6, 12, 7, '#8b5d30');
      px(g, x - 4, yy - 4, 8, 4, '#aa7740');
      px(g, x - 3, yy - 12, 6, 4, INK);
      px(g, x - 2, yy - 11, 4, 3, '#b47a38');
      px(g, x - 3, yy - 8, 6, 2, '#5f8a45');
      px(g, x - 1, yy - 8, 2, 2, '#a7d47a');
      px(g, x - 7, yy - 1, 14, 2, '#4d3019');
      g.font = 'bold 7px "Courier New", monospace';
      g.textAlign = 'center';
      g.fillStyle = '#ffe27a';
      g.fillText('$', x, yy - 2);
    } else if (type === 'knife') {
      g.save(); g.translate(x, yy - 5); g.rotate(-.32);
      px(g, -10, -2, 18, 4, INK);
      px(g, -9, -1, 14, 2, '#c7d1dc');
      px(g, -9, -1, 12, 1, '#ffffff');
      px(g, 5, -3, 5, 6, INK);
      px(g, 6, -2, 3, 4, '#7c4a2e');
      g.restore();
    } else if (type === 'pistol') {
      px(g, x - 9, yy - 8, 18, 6, INK);
      px(g, x - 8, yy - 7, 16, 4, '#77838f');
      px(g, x - 8, yy - 7, 14, 1, '#e8eef4');
      px(g, x - 8, yy - 5, 10, 1, '#aab6c1');
      px(g, x - 3, yy - 3, 5, 7, INK);
      px(g, x - 2, yy - 3, 3, 6, '#805b3d');
      px(g, x + 6, yy - 6, 3, 1, '#ffe27a');
      px(g, x - 8, yy - 9, 9, 1, 'rgba(41,231,255,.35)');
    } else if (type === 'boostSpeed' || type === 'boostAttack' || type === 'boostDefense') {
      const c = type === 'boostAttack' ? '#ff5b6b' : type === 'boostDefense' ? '#57e389' : '#29e7ff';
      px(g, x - 7, yy - 10, 14, 12, INK);
      px(g, x - 6, yy - 9, 12, 10, '#161523');
      px(g, x - 5, yy - 8, 10, 8, c);
      px(g, x - 5, yy - 8, 10, 2, '#f4ecdc');
      if (type === 'boostSpeed') {
        px(g, x - 3, yy - 5, 5, 2, '#071018');
        px(g, x - 1, yy - 7, 2, 2, '#071018');
        px(g, x + 2, yy - 5, 2, 2, '#071018');
      } else if (type === 'boostAttack') {
        px(g, x - 3, yy - 6, 6, 4, '#071018');
        px(g, x - 2, yy - 7, 2, 2, '#071018');
        px(g, x + 1, yy - 7, 2, 2, '#071018');
      } else {
        px(g, x - 4, yy - 7, 8, 5, '#071018');
        px(g, x - 2, yy - 3, 4, 2, '#071018');
        px(g, x - 3, yy - 6, 6, 2, c);
      }
    } else {
      // pipe
      g.save();
      g.translate(x, yy - 5);
      g.rotate(-0.28);
      px(g, -12, -3, 25, 6, INK);
      px(g, -11, -2, 22, 3, '#aeb8c4');
      px(g, -11, -2, 22, 1, '#f0f5fa');
      px(g, -12, -3, 3, 4, '#626c79');
      g.restore();
    }
    g.restore();
  }

  function drawCrate(g, x, y, type, flash, t, upgrade) {
    const hitShake = flash ? Math.sin(t * 70) * 1.4 : 0;
    g.save();
    g.translate(Math.round(x + hitShake), Math.round(y));
    if (type === 'barrel') {
      px(g, -8, -21, 16, 21, INK);
      px(g, -7, -20, 14, 20, flash ? '#fff1d0' : '#7b3434');
      px(g, -7, -16, 14, 2, '#451c24');
      px(g, -7, -8, 14, 2, '#451c24');
      px(g, -3, -14, 6, 5, '#d8a13f');
      px(g, -1, -13, 2, 3, '#2a1714');
      px(g, -6, -19, 3, 1, '#b75a4e');
      px(g, -9, -3, 18, 3, INK);
      px(g, -8, -3, 16, 2, '#3b2326');
      if (upgrade) {
        const c = upgrade === 'attack' ? '#ff5b6b' : upgrade === 'defense' ? '#57e389' : '#29e7ff';
        const pulse = .55 + Math.sin(t * 3) * .25;
        g.globalAlpha = pulse;
        g.strokeStyle = c;
        g.lineWidth = 1;
        g.strokeRect(-7.5, -20.5, 15, 20);
        g.fillStyle = c;
        px(g, -4, -24, 8, 2, c);
        px(g, -2, -26, 4, 2, c);
        g.globalAlpha = 1;
        px(g, -2, -15, 4, 4, c);
        px(g, -1, -14, 2, 2, '#071018');
      }
    } else {
      px(g, -12, -20, 24, 20, INK);
      px(g, -11, -19, 22, 19, flash ? '#fff1d0' : '#72513a');
      px(g, -11, -16, 22, 2, '#4e3526');
      px(g, -11, -7, 22, 2, '#4e3526');
      px(g, -2, -18, 4, 18, '#8f6747');
      px(g, -9, -14, 3, 3, '#3b2a1d');
      px(g, 7, -10, 3, 3, '#3b2a1d');
      px(g, -8, -17, 16, 1, '#a77b54');
      // stencil
      g.font = 'bold 5px "Courier New", monospace';
      g.fillStyle = '#d5b282'; g.textAlign = 'center';
      g.fillText('NR', 0, -9);
    }
    g.restore();
  }

  window.Art = {
    CHARS, drawFighter, drawShadow, drawPreview, drawHudPortrait, drawHeadPortrait,
    buildStage, drawBackground, drawItem, drawCrate
  };
})();
