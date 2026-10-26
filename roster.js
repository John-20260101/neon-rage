/* NEON RAGE // ROSTER ARCHIVE
   All character data is drawn from js/game.js and the game's existing copy. */

(() => {
  'use strict';

  const CATEGORY = {
    playable: { label: 'PLAYABLE', cn: '清街者', short: 'P' },
    boss: { label: 'BOSS', cn: 'V 先生麾下', short: 'B' },
    street: { label: 'STREET', cn: '街头打手', short: 'S' }
  };

  const ROSTER = [
    {
      id: 'rex', cat: 'playable', file: 'P-01', name: 'REX', cn: '雷克斯',
      role: '街头拳王 · 全能', roleEn: 'STREET CHAMPION', tag: 'BALANCED', threat: 'A',
      accent: '#ff5a36', accent2: '#ffd23f', artType: 'full',
      portrait: 'images/roster/rex.webp', stage: '全关卡 // PLAYABLE', stageShort: 'ALL STAGES',
      stageImg: 'images/stages/01-dockside.webp',
      hp: 112, atk: 13, atkLabel: '必杀', spd: 80, rng: 35, score: null,
      ratings: { hp: 72, atk: 70, spd: 70, rng: 60 }, edge: { l: 5, r: 5 },
      tags: ['BALANCED', 'EX-COP', 'FLAME'],
      quote: '城市不需要英雄。城市只需要明天早上，还有人愿意开门。',
      bio: [
        '前特警，因一次失败的码头缉毒行动离开警队。现在他以街头拳王的身份活动，专门接那些警察不能接的活。',
        '三连拳稳定，崩拳突进能撕开一排打手；他不相信英雄，但相信明早还会有人开门。'
      ],
      abilities: [
        { name: '三连拳', en: 'TRIPLE STRIKE', desc: '4 / 5 / 8 点伤害，第三段击倒。最稳定的起手与收尾。' },
        { name: '崩拳突进', en: 'RUSH FIST', desc: '前前 + J。13 点伤害，带火焰突进，可击倒一排。' },
        { name: '烈焰升龙', en: 'FLAME UPPERCUT', desc: '必杀技，13 点伤害。范围最大，被围住时的解围手段。' },
        { name: '零号通缉令', en: 'ZERO WARRANT', desc: '超必杀。三段 30 / 26 / 28 点伤害，持续约 3 秒。' }
      ]
    },
    {
      id: 'luna', cat: 'playable', file: 'P-02', name: 'LUNA', cn: '露娜',
      role: '夜行舞者 · 速度', roleEn: 'NIGHT DANCER', tag: 'FAST', threat: 'A',
      accent: '#47e5ff', accent2: '#b56cff', artType: 'full',
      portrait: 'images/roster/luna.webp', stage: '全关卡 // PLAYABLE', stageShort: 'ALL STAGES',
      stageImg: 'images/stages/04-neon-garden.webp',
      hp: 92, atk: 11, atkLabel: '必杀', spd: 93, rng: 34, score: null,
      ratings: { hp: 58, atk: 58, spd: 94, rng: 65 }, edge: { l: 32, r: 10 },
      tags: ['FAST', 'DANCER', 'LIGHTNING'],
      quote: '我不是离开。我只是把舞台，换到了没有人能买下它的地方。',
      bio: [
        '霓虹花园的夜行舞者，也是 V 先生最不愿意在账单上看到的名字。她把战斗当成编舞，靠速度和节奏拆掉对手的防线。',
        '雷光贯线让她能隔着一条街点名；她从不解释自己为什么离开舞台，只说舞台不该有老板。'
      ],
      abilities: [
        { name: '三连拳', en: 'TRIPLE STRIKE', desc: '3 / 4 / 7 点伤害，第三段击倒。出手最快的连段。' },
        { name: '流光踢', en: 'LIGHTNING KICK', desc: '前前 + J。11 点伤害，突进距离最远，带闪电残影。' },
        { name: '雷光贯线', en: 'LIGHTNING LINE', desc: '必杀技，11 点伤害。贯穿前方一条线，适合打断成排敌人。' },
        { name: '雷狱圆舞', en: 'THUNDER WALTZ', desc: '超必杀。三段 24 点伤害，以自身为圆心覆盖大片区域。' }
      ]
    },
    {
      id: 'bruno', cat: 'playable', file: 'P-03', name: 'BRUNO', cn: '布鲁诺',
      role: '码头重锤 · 力量', roleEn: 'DOCK HEAVY', tag: 'POWER', threat: 'A',
      accent: '#ffd23f', accent2: '#57e389', artType: 'full',
      portrait: 'images/roster/bruno.webp', stage: '全关卡 // PLAYABLE', stageShort: 'ALL STAGES',
      stageImg: 'images/stages/01-dockside.webp',
      hp: 138, atk: 17, atkLabel: '必杀', spd: 64, rng: 37, score: null,
      ratings: { hp: 96, atk: 96, spd: 52, rng: 55 }, edge: { l: 21, r: 7 },
      tags: ['POWER', 'ARMOR', 'DOCKSIDE'],
      quote: '我不懂什么新世界。但这个码头，从今天起归活着的人。',
      bio: [
        '第九码头的装卸工头，旧拳套比他的工龄还长。V 先生的打手来收保护费那天，他一个人把仓库清空。',
        '抗击打、重投技、裂地重砸；他不懂新世界，但知道码头应该归活着的人。'
      ],
      abilities: [
        { name: '三连拳', en: 'TRIPLE STRIKE', desc: '6 / 7 / 11 点伤害，第三段击倒。慢，但每一拳都重。' },
        { name: '蛮牛头槌', en: 'BULL HEADBUTT', desc: '前前 + J。18 点伤害，伤害最高的冲刺技。' },
        { name: '裂地重砸', en: 'GROUND SLAM', desc: '必杀技，17 点伤害。震开周身敌人，硬的解围。' },
        { name: '陨星断岳', en: 'METEOR BREAKER', desc: '超必杀。三段 40 / 35 / 25 点伤害，范围小但爆发最高。' }
      ]
    },

    {
      id: 'razor', cat: 'boss', file: 'B-01', name: 'RAZOR', cn: '剃刀',
      role: '码头行刑人', roleEn: 'DOCKSIDE ENFORCER', tag: 'BLADE', threat: 'A',
      accent: '#e9e3d3', accent2: '#ff2e63', artType: 'bust',
      portrait: 'images/bosses/razor.webp', stage: 'STAGE 01 // 第九码头', stageShort: 'STAGE 01',
      stageImg: 'images/stages/01-dockside.webp',
      hp: 215, atk: 11, atkLabel: '攻击', spd: 48, rng: 38, score: 2800,
      ratings: { hp: 45, atk: 55, spd: 62, rng: 55 },
      tags: ['BLADE', 'DOCKSIDE', 'ENFORCER'],
      quote: 'V 先生只说清场。我本来想打断你的腿——现在，我改主意了。',
      bio: [
        'V 先生放在第九码头的第一道闸门。收账、清场、把不听话的人挂上吊机，都是他的日常工作。',
        '刀快，话更多。他相信恐惧比钱更好用，也相信没有人能在他的刀光里走到下一秒。'
      ],
      abilities: [
        { name: '剃刀连斩', en: 'RAZOR COMBO', desc: '快速的两段近身斩击，第一段试探，第二段才是真账。' },
        { name: '横扫剑气', en: 'CROSS SLASH', desc: '大范围横向刀光，逼你跳跃或后撤。不要站在他的正前方。' },
        { name: '近身压制', en: 'CLOSE QUARTERS', desc: '利用攻击距离与出手间隔持续压迫，专门惩罚贪刀。' }
      ]
    },
    {
      id: 'titan', cat: 'boss', file: 'B-02', name: 'TITAN', cn: '泰坦',
      role: '地下拳王', roleEn: 'UNDERGROUND CHAMPION', tag: 'ARMOR', threat: 'A',
      accent: '#ff7a1e', accent2: '#ffd23f', artType: 'bust',
      portrait: 'images/bosses/titan.webp', stage: 'STAGE 02 // 七号轻轨', stageShort: 'STAGE 02',
      stageImg: 'images/stages/02-line07.webp',
      hp: 305, atk: 16, atkLabel: '攻击', spd: 29, rng: 39, score: 3800,
      ratings: { hp: 66, atk: 74, spd: 35, rng: 45 },
      tags: ['ARMOR', 'HEAVY', 'UNDERGROUND'],
      quote: '黑市擂台四十二场，没人撑过我一拳。你猜，这副骨头能撑几秒？',
      bio: [
        '黑市擂台四十二场不败。V 先生买下他十分钟，用来把任何敢进七号轻轨的人打成地基。',
        '慢，但每一次靠近都像一堵墙倒下来；和他换血，是最不划算的买卖。'
      ],
      abilities: [
        { name: '重拳', en: 'HEAVY FIST', desc: '伤害高、前摇明显。看清起手再闪，别用脸接。' },
        { name: '冲刺撞人', en: 'CHARGING TACKLE', desc: '远距离直线冲撞，会把站位撞散。横向走位躲开。' },
        { name: '跳跃重砸', en: 'JUMP SLAM', desc: '跳起后砸向落点，范围伤害。落点有预警，别站桩。' }
      ]
    },
    {
      id: 'vector', cat: 'boss', file: 'B-03', name: 'VECTOR', cn: '维克托',
      role: 'V 先生之影', roleEn: "V'S SHADOW", tag: 'PROXY', threat: 'S',
      accent: '#ffd23f', accent2: '#ff2e63', artType: 'bust',
      portrait: 'images/bosses/vector.webp', stage: 'STAGE 03 // V 塔天台', stageShort: 'STAGE 03',
      stageImg: 'images/stages/03-v-roof.webp',
      hp: 365, atk: 14, atkLabel: '攻击', spd: 54, rng: 35, score: 5400,
      ratings: { hp: 75, atk: 66, spd: 70, rng: 82 },
      tags: ['PROXY', 'UPPERCUT', 'PROJECTILE'],
      quote: 'V 先生从不出手。因为他知道，只要我站在这里，你就见不到他。',
      bio: [
        'V 先生从不出手，因为 VECTOR 站在他和世界之间。西装、金领带、影子；升龙拳和大型波动拳是他递出的名片。',
        '他从不急着结束战斗。他享受你意识到“影子也会杀人”的那一刻。'
      ],
      abilities: [
        { name: '升龙拳', en: 'DRAGON UPPERCUT', desc: '对空、对近身都危险。起手快，别在他的头顶停留。' },
        { name: '大型波动拳', en: 'GRAND PROJECTILE', desc: '覆盖大段直线的能量弹，逼迫你跳跃或绕后。' },
        { name: '影步', en: 'SHADOW STEP', desc: '用身法拉近距离或调整角度，不给你稳定输出的窗口。' }
      ]
    },
    {
      id: 'raven', cat: 'boss', file: 'B-04', name: 'RAVEN', cn: '渡鸦',
      role: '双子刺客 · 姐', roleEn: 'TWIN ASSASSIN / ELDER', tag: 'TWIN', threat: 'A',
      accent: '#ff2e63', accent2: '#b56cff', artType: 'bust',
      portrait: 'images/bosses/raven.webp', stage: 'STAGE 04 // 霓虹花园', stageShort: 'STAGE 04',
      stageImg: 'images/stages/04-neon-garden.webp',
      hp: 230, atk: 9, atkLabel: '攻击', spd: 62, rng: 36, score: 3200,
      ratings: { hp: 48, atk: 58, spd: 80, rng: 62 },
      tags: ['TWIN', 'TELEPORT', 'BLADE'],
      quote: '妹妹，你看他的眼神——还真以为自己是来赢的。',
      bio: [
        '双子中的姐姐。霓虹花园的最后一拍由她收尾；瞬移斩和四连刀让距离失去意义。',
        '她负责优雅，也负责把退路切干净。和 NYX 一起出现时，别只盯着其中一个人。'
      ],
      abilities: [
        { name: '瞬移斩', en: 'BLINK CUT', desc: '消失后从另一侧出现，斩击接得很快。看残影，不要看空位。' },
        { name: '四连刀', en: 'FOUR-HIT BLADE', desc: '连续四段斩击，最后一段击倒。中段不要抢招。' },
        { name: '血色残影', en: 'CRIMSON AFTERIMAGE', desc: '用位移制造真假难辨的落点，逼迫你提前交闪避。' }
      ]
    },
    {
      id: 'nyx', cat: 'boss', file: 'B-05', name: 'NYX', cn: '夜莺',
      role: '双子刺客 · 妹', roleEn: 'TWIN ASSASSIN / YOUNGER', tag: 'TWIN', threat: 'A',
      accent: '#47e5ff', accent2: '#ff2e63', artType: 'bust',
      portrait: 'images/bosses/nyx.webp', stage: 'STAGE 04 // 霓虹花园', stageShort: 'STAGE 04',
      stageImg: 'images/stages/04-neon-garden.webp',
      hp: 205, atk: 8, atkLabel: '攻击', spd: 72, rng: 34, score: 3100,
      ratings: { hp: 44, atk: 54, spd: 92, rng: 58 },
      tags: ['TWIN', 'AGILE', 'KICK'],
      quote: '那就让他记住：霓虹花园的最后一拍，永远由我们收。',
      bio: [
        '双子中的妹妹。比姐姐更快、更疯；飞跃踢与三连旋风腿把舞池变成绞肉机。',
        '她不讲节奏，只讲下一个落点。你刚看清她，她已经在你背后。'
      ],
      abilities: [
        { name: '飞跃踢', en: 'LEAP KICK', desc: '从远处腾空切入，落点刁钻。不要和她拼空中。' },
        { name: '三连旋风腿', en: 'TRIPLE SPIN', desc: '三段连续旋转踢，最后一段击倒。拉开距离再反击。' },
        { name: '空中变向', en: 'AIR SHIFT', desc: '在空中改变落点，专门骗你提前走位。' }
      ]
    },
    {
      id: 'house', cat: 'boss', file: 'B-06', name: 'THE HOUSE', cn: '庄家',
      role: '顶楼庄家', roleEn: 'THE HOUSE', tag: 'CASINO', threat: 'S',
      accent: '#d9b45b', accent2: '#ff2e63', artType: 'bust',
      portrait: 'images/bosses/house.webp', stage: 'STAGE 05 // 顶楼赌场', stageShort: 'STAGE 05',
      stageImg: 'images/stages/05-the-house.webp',
      hp: 420, atk: 11, atkLabel: '攻击', spd: 46, rng: 39, score: 6000,
      ratings: { hp: 84, atk: 64, spd: 55, rng: 95 },
      tags: ['CASINO', 'RANGED', '3 PHASES'],
      quote: '欢迎来到顶楼。这里的赔率从不骗人——只骗输不起的人。',
      bio: [
        '顶楼赌场的庄家，也是 V 先生的账房。纸牌、筹码、轮盘都是武器；他从不做赔本买卖。',
        '三阶段战斗，距离越远越危险。他喜欢看你为了追他，一步步踩进赔率里。'
      ],
      abilities: [
        { name: '纸牌扇', en: 'CARD FAN', desc: '扇形飞出的纸牌，覆盖中距离。看牌路，不要直线追。' },
        { name: '筹码雨', en: 'CHIP RAIN', desc: '从上方落下的筹码弹幕，逼迫你持续移动。' },
        { name: '轮盘', en: 'ROULETTE', desc: '沿场滚动的轮盘，封锁走位；别被逼进角落。' },
        { name: '全押冲锋', en: 'ALL-IN RUSH', desc: '第三阶段的近身冲锋，伤害高、收尾快。' }
      ]
    },
    {
      id: 'vprime', cat: 'boss', file: 'B-07', name: 'V-PRIME', cn: 'V先生·终焉',
      role: '终焉容器 · 三形态', roleEn: 'FINAL VESSEL', tag: 'FINAL', threat: 'S+',
      accent: '#ffcf5a', accent2: '#47e5ff', artType: 'bust',
      portrait: 'images/bosses/vprime.webp', stage: 'STAGE 06 // V 塔核心', stageShort: 'STAGE 06',
      stageImg: 'images/stages/06-v-core.webp',
      hp: 620, atk: 10, atkLabel: '攻击', spd: 44, rng: 38, score: 14000,
      ratings: { hp: 100, atk: 66, spd: 58, rng: 88 },
      tags: ['FINAL', '3 FORMS', 'RANGED'],
      quote: '城市需要一个神。而我，正好有三张脸。',
      bio: [
        'V 先生的最终容器。三具身体、三种形态：机枪、暴走、天翔；他相信城市需要一个神，而自己正好有三张脸。',
        '第一阶段用火力丈量距离，第二阶段用暴走撕开防线，第三阶段把天空也变成他的武器。'
      ],
      abilities: [
        { name: '机枪扫射', en: 'MACHINE GUN', desc: '第一形态的火力网。每发 10 点伤害，别在弹道上停留。' },
        { name: '暴走重击', en: 'BERSERK RUSH', desc: '第二形态的冲刺重拳与三连重击，近身压迫极强。' },
        { name: '天翔俯冲', en: 'AERIAL DESCENT', desc: '第三形态悬浮空中，俯冲砸地并发射能量弹。' }
      ]
    },

    {
      id: 'punk', cat: 'street', file: 'S-01', name: 'PUNK', cn: '混混',
      role: '街头混混 / 基础杂兵', roleEn: 'STREET PUNK', tag: 'BASIC', threat: 'D',
      accent: '#57e389', accent2: '#ff2e63', artType: 'square',
      portrait: 'images/enemies/punk.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/01-dockside.webp',
      hp: 25, atk: 6, atkLabel: '攻击', spd: 29, rng: 27, score: 130,
      ratings: { hp: 12, atk: 24, spd: 24, rng: 18 },
      tags: ['BASIC', 'MELEE', 'CROWD'],
      quote: null,
      bio: [
        'V 先生外围最廉价的人手。一个人不成威胁，一群人会把你堵在墙角。'
      ],
      abilities: [
        { name: '街头乱拳', en: 'STREET JAB', desc: '近身才出手，前摇明显。优先清掉，别让数量滚起来。' },
        { name: '人海包夹', en: 'CROWD PRESSURE', desc: '和同伴一起从两侧靠近，逼你放弃站位。' }
      ]
    },
    {
      id: 'blade', cat: 'street', file: 'S-02', name: 'BLADE', cn: '刀锋',
      role: '街头刀客 / 快攻', roleEn: 'STREET BLADE', tag: 'FAST', threat: 'C',
      accent: '#ffd23f', accent2: '#ff2e63', artType: 'square',
      portrait: 'images/enemies/blade.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/02-line07.webp',
      hp: 21, atk: 7, atkLabel: '攻击', spd: 45, rng: 30, score: 170,
      ratings: { hp: 10, atk: 30, spd: 60, rng: 25 },
      tags: ['FAST', 'BLADE', 'MELEE'],
      quote: null,
      bio: [
        '街头刀客，靠速度和连续突刺吃饭；血薄，但出手比多数人快。'
      ],
      abilities: [
        { name: '快速刀刺', en: 'QUICK STAB', desc: '短距离连续刺击，专抓你出手后的硬直。' },
        { name: '贴身追击', en: 'PURSUIT', desc: '后撤时仍会跟上，不要用后退解决他。' }
      ]
    },
    {
      id: 'brute', cat: 'street', file: 'S-03', name: 'BRUTE', cn: '重拳',
      role: '收账重拳手 / 霸体', roleEn: 'HEAVY ENFORCER', tag: 'ARMOR', threat: 'B',
      accent: '#ff7a1e', accent2: '#ffd23f', artType: 'square',
      portrait: 'images/enemies/brute.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/01-dockside.webp',
      hp: 64, atk: 13, atkLabel: '攻击', spd: 20, rng: 33, score: 330,
      ratings: { hp: 38, atk: 78, spd: 14, rng: 22 },
      tags: ['ARMOR', 'HEAVY', 'MELEE'],
      quote: null,
      bio: [
        '收保护费的重拳手，霸体、慢、疼；不要和他换血。'
      ],
      abilities: [
        { name: '霸体重拳', en: 'ARMORED FIST', desc: '部分攻击不会被打断，硬吃一套再还手很危险。' },
        { name: '慢速压迫', en: 'SLOW PRESSURE', desc: '移动慢，但会持续把你往角落推。绕背，别正面顶。' }
      ]
    },
    {
      id: 'kicker', cat: 'street', file: 'S-04', name: 'KICKER', cn: '踢手',
      role: '街头腿法 / 机动', roleEn: 'STREET KICKER', tag: 'MOBILE', threat: 'C',
      accent: '#47e5ff', accent2: '#ffd23f', artType: 'square',
      portrait: 'images/enemies/kicker.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/02-line07.webp',
      hp: 28, atk: 8, atkLabel: '攻击', spd: 38, rng: 28, score: 200,
      ratings: { hp: 14, atk: 36, spd: 64, rng: 24 },
      tags: ['FAST', 'KICK', 'MELEE'],
      quote: null,
      bio: [
        '腿法杂兵，喜欢用高踢和突进缩短距离；打断他的起手。'
      ],
      abilities: [
        { name: '高踢', en: 'HIGH KICK', desc: '起手快、范围比拳头长，别在刚好差一步的位置停住。' },
        { name: '突进步', en: 'STEP-IN', desc: '突然拉近距离接腿法，逼你提前出招。' }
      ]
    },
    {
      id: 'boxer', cat: 'street', file: 'S-05', name: 'BOXER', cn: '拳手',
      role: '地下拳台 / 侧闪', roleEn: 'STREET BOXER', tag: 'DODGE', threat: 'C',
      accent: '#f5c451', accent2: '#47e5ff', artType: 'square',
      portrait: 'images/enemies/boxer.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/02-line07.webp',
      hp: 34, atk: 4.5, atkLabel: '攻击', spd: 46, rng: 30, score: 240,
      ratings: { hp: 18, atk: 28, spd: 62, rng: 26 },
      tags: ['DODGE', 'BOXING', 'MELEE'],
      quote: null,
      bio: [
        '地下拳台出身，会侧闪三连拳；站桩对拳是最差的选择。'
      ],
      abilities: [
        { name: '侧闪', en: 'SIDE STEP', desc: '会躲开正面攻击，逼你改变节奏或预判落点。' },
        { name: '三连拳', en: 'TRIPLE JAB', desc: '连续三次快速出拳，单发不高，但很容易被黏住。' }
      ]
    },
    {
      id: 'whip', cat: 'street', file: 'S-06', name: 'LASH', cn: '鞭手',
      role: '中距离控制 / 长鞭', roleEn: 'WHIP HANDLER', tag: 'RANGE', threat: 'B',
      accent: '#e8a25a', accent2: '#ff2e63', artType: 'square',
      portrait: 'images/enemies/whip.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/04-neon-garden.webp',
      hp: 30, atk: 7, atkLabel: '攻击', spd: 36, rng: 68, score: 280,
      ratings: { hp: 16, atk: 34, spd: 50, rng: 78 },
      tags: ['RANGE', 'CONTROL', 'WHIP'],
      quote: null,
      bio: [
        '中距离控制者，鞭子比看上去更长；贴身之前先吃两鞭。'
      ],
      abilities: [
        { name: '远距鞭击', en: 'LONG LASH', desc: '攻击距离远，专门惩罚站在中距离观望的人。' },
        { name: '距离控制', en: 'SPACING', desc: '会主动拉开身位，不让你轻松近身。用突进或投技破局。' }
      ]
    },
    {
      id: 'gunner', cat: 'street', file: 'S-07', name: 'GUNNER', cn: '枪手',
      role: '远程火力 / 后撤射击', roleEn: 'STREET GUNNER', tag: 'RANGED', threat: 'B',
      accent: '#ff5a36', accent2: '#ffd23f', artType: 'square',
      portrait: 'images/enemies/gunner.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/03-v-roof.webp',
      hp: 26, atk: 8, atkLabel: '攻击', spd: 34, rng: 190, score: 300,
      ratings: { hp: 13, atk: 40, spd: 46, rng: 100 },
      tags: ['RANGED', 'GUN', 'PICKUP'],
      quote: null,
      bio: [
        '远程枪手，后撤射击；击败后可能掉落手枪。'
      ],
      abilities: [
        { name: '后撤射击', en: 'KITE SHOT', desc: '边退边开枪，逼你穿过火力线。利用掩体或突进近身。' },
        { name: '手枪掉落', en: 'DROP: PISTOL', desc: '击败后可能留下手枪；枪里还有子弹的话，记得捡。' }
      ]
    },
    {
      id: 'siren', cat: 'street', file: 'S-08', name: 'SIREN', cn: '塞壬',
      role: '高速空袭 / 飞踢', roleEn: 'STREET SIREN', tag: 'AIR', threat: 'C',
      accent: '#7df9ff', accent2: '#ff2e63', artType: 'square',
      portrait: 'images/enemies/siren.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/04-neon-garden.webp',
      hp: 32, atk: 7, atkLabel: '攻击', spd: 50, rng: 46, score: 260,
      ratings: { hp: 17, atk: 38, spd: 78, rng: 48 },
      tags: ['AIR', 'FAST', 'KICK'],
      quote: null,
      bio: [
        '高速空袭型，腾空飞踢；她会从你头顶换线。'
      ],
      abilities: [
        { name: '腾空飞踢', en: 'LEAP KICK', desc: '从空中切入，落点比看上去更远。别在原地等她落地。' },
        { name: '高速游走', en: 'HARASS', desc: '不断换线，逼你转身；用范围技或对空手段抓她。' }
      ]
    },
    {
      id: 'viper', cat: 'street', file: 'S-09', name: 'VIPER', cn: '蝰蛇',
      role: '远程飞刀 / 保持距离', roleEn: 'STREET VIPER', tag: 'RANGED', threat: 'B',
      accent: '#8dffcf', accent2: '#47e5ff', artType: 'square',
      portrait: 'images/enemies/viper.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/03-v-roof.webp',
      hp: 27, atk: 6.5, atkLabel: '攻击', spd: 42, rng: 160, score: 290,
      ratings: { hp: 14, atk: 32, spd: 54, rng: 92 },
      tags: ['RANGED', 'KNIFE', 'PICKUP'],
      quote: null,
      bio: [
        '后撤飞刀，保持距离；击败后可能掉落小刀。'
      ],
      abilities: [
        { name: '后撤飞刀', en: 'RETREAT THROW', desc: '拉开距离后投掷飞刀，直线速度快。横向移动靠近。' },
        { name: '小刀掉落', en: 'DROP: KNIFE', desc: '击败后可能留下小刀；近身与投掷都能用。' }
      ]
    },
    {
      id: 'wrecker', cat: 'street', file: 'S-10', name: 'WRECKER', cn: '摔跤手',
      role: '抓投壮汉 / 过肩摔', roleEn: 'STREET WRECKER', tag: 'GRAPPLE', threat: 'B',
      accent: '#ffb347', accent2: '#ff2e63', artType: 'square',
      portrait: 'images/enemies/wrecker.webp', stage: '全城街区 // STREET LEVEL', stageShort: 'STREET',
      stageImg: 'images/stages/05-the-house.webp',
      hp: 48, atk: 9, atkLabel: '攻击', spd: 38, rng: 28, score: 280,
      ratings: { hp: 30, atk: 58, spd: 50, rng: 30 },
      tags: ['GRAPPLE', 'HEAVY', 'THROW'],
      quote: null,
      bio: [
        '抓投型壮汉，近身过肩摔；不要让他抓住。'
      ],
      abilities: [
        { name: '近身抓取', en: 'GRAB', desc: '进入近身范围后会尝试抓取，被抓到就是一次过肩摔。' },
        { name: '过肩摔', en: 'BACKDROP', desc: '抓取成功后造成高额伤害并把你甩到身后。保持距离或抢先打断。' }
      ]
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = { filter: 'all', list: ROSTER, index: 0, lastFocus: null };

  const els = {
    playableGrid: $('#playable-grid'),
    bossGrid: $('#boss-grid'),
    streetGrid: $('#street-grid'),
    filterHint: $('#filter-hint'),
    filterButtons: $$('.filter-btn'),
    dossier: $('#dossier'),
    close: $('#dossier-close'),
    panel: $('.dossier-panel'),
    stage: $('#dossier-stage'),
    art: $('#dossier-art'),
    visualMeta: $('#dossier-visual-meta'),
    kicker: $('#dossier-kicker'),
    name: $('#dossier-name'),
    role: $('#dossier-role'),
    threat: $('#dossier-threat'),
    tags: $('#dossier-tags'),
    quote: $('#dossier-quote'),
    bio: $('#dossier-bio'),
    stats: $('#dossier-stats'),
    abilities: $('#dossier-abilities'),
    count: $('#dossier-count'),
    prev: $('#dossier-prev'),
    next: $('#dossier-next')
  };

  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const statValue = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  };

  const threatDots = (threat) => {
    const levels = { D: 1, C: 2, B: 3, A: 4, S: 5, 'S+': 5 };
    const n = levels[threat] || 1;
    return `<span class="threat-dots" aria-label="威胁等级 ${esc(threat)}">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  };

  const miniStat = (label, value, rating) => `
    <div class="mini-stat">
      <span>${label}</span>
      <div class="mini-track"><i style="width:${Math.max(4, Math.min(100, rating))}%"></i></div>
      <b>${value}</b>
    </div>`;

  function playerCard(item) {
    return `
      <article class="subject player-card" data-id="${item.id}" tabindex="0" role="button"
        aria-label="查看 ${item.name} ${item.cn} 的完整档案" style="--accent:${item.accent};--accent-2:${item.accent2};--edge-l:${item.edge ? item.edge.l : 5}%;--edge-r:${item.edge ? item.edge.r : 5}%">
        <div class="player-art">
          <span class="file-no">NR-${item.file}</span>
          <img src="${item.portrait}" alt="${item.name} ${item.cn} 全身立绘" loading="eager" decoding="async" />
        </div>
        <div class="player-copy">
          <div class="player-top">
            <span class="tag">${item.tag}</span>
            <span class="threat">THREAT <b>${item.threat}</b></span>
          </div>
          <div class="player-name"><h3>${item.name}</h3><span>${item.cn}</span></div>
          <p class="player-role">${item.role}</p>
          <p class="player-desc">${item.bio[0]}</p>
          <div class="mini-stats">
            ${miniStat('HP', item.hp, item.ratings.hp)}
            ${miniStat('ATK', item.atk, item.ratings.atk)}
            ${miniStat('SPD', item.spd, item.ratings.spd)}
          </div>
          <div class="player-footer">
            <span class="open-file">OPEN FILE <i></i></span>
            <span class="threat">${item.roleEn}</span>
          </div>
        </div>
      </article>`;
  }

  function bossCard(item) {
    return `
      <article class="subject boss-card" data-id="${item.id}" tabindex="0" role="button"
        aria-label="查看 ${item.name} ${item.cn} 的完整档案" style="--accent:${item.accent};--accent-2:${item.accent2}">
        <div class="boss-art">
          <span class="file-no">NR-${item.file}</span>
          <span class="boss-stage">${item.stageShort}</span>
          <img src="${item.portrait}" alt="${item.name} ${item.cn} 头像" loading="eager" decoding="async" />
          <div class="boss-art-title">
            <h3>${item.name}</h3>
            <span>${item.cn}</span>
          </div>
        </div>
        <div class="boss-copy">
          <div class="boss-role"><span>${item.role}</span><span class="threat">${item.threat}</span></div>
          <div class="boss-meta">
            <span>HP <b>${item.hp}</b></span>
            <span>ATK <b>${item.atk}</b></span>
            <span>SPD <b>${item.spd}</b></span>
          </div>
        </div>
      </article>`;
  }

  function enemyCard(item) {
    const i = ROSTER.indexOf(item);
    return `
      <article class="subject enemy-card" data-id="${item.id}" tabindex="0" role="button"
        aria-label="查看 ${item.name} ${item.cn} 的完整档案" style="--accent:${item.accent};--accent-2:${item.accent2};--i:${i % 10}">
        <div class="enemy-art">
          <span class="file-no">NR-${item.file}</span>
          <img src="${item.portrait}" alt="${item.name} ${item.cn} 头像" loading="eager" decoding="async" />
        </div>
        <div class="enemy-copy">
          <div class="enemy-name"><h3>${item.name}</h3><span>${item.cn}</span></div>
          <p class="enemy-role">${item.role}</p>
          <div class="enemy-data">
            <span>HP <b>${item.hp}</b></span>
            <span>ATK <b>${item.atk}</b></span>
            <span>${threatDots(item.threat)}</span>
          </div>
        </div>
      </article>`;
  }

  function renderGrids() {
    els.playableGrid.innerHTML = ROSTER.filter((i) => i.cat === 'playable').map(playerCard).join('');
    els.bossGrid.innerHTML = ROSTER.filter((i) => i.cat === 'boss').map(bossCard).join('') + `
      <aside class="boss-filler" aria-label="V 先生势力说明">
        <span class="file-no">NR-SYNDICATE</span>
        <div class="filler-v" aria-hidden="true">V</div>
        <h4>一条命令链</h4>
        <p>RAZOR 收码头，TITAN 守擂台，VECTOR 挡在塔顶。RAVEN 与 NYX 收尾，THE HOUSE 管账，V-PRIME 是最后一张脸。</p>
        <span class="filler-foot">THE SYNDICATE // 7 ENFORCERS</span>
      </aside>`;
    els.streetGrid.innerHTML = ROSTER.filter((i) => i.cat === 'street').map(enemyCard).join('');
  }

  function cardKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.subject');
    if (!card) return;
    event.preventDefault();
    openDossier(card.dataset.id, card);
  }

  function cardClick(event) {
    const card = event.target.closest('.subject');
    if (card) openDossier(card.dataset.id, card);
  }

  function filterItems(filter) {
    return filter === 'all' ? ROSTER.slice() : ROSTER.filter((item) => item.cat === filter);
  }

  function setFilter(filter, shouldScroll = false) {
    state.filter = filter;
    state.list = filterItems(filter);
    els.filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    $$('.section-block').forEach((section) => {
      const show = filter === 'all' || section.dataset.section === filter;
      section.classList.toggle('is-filtered', !show);
    });
    const label = filter === 'all' ? `显示全部 ${ROSTER.length} 名角色`
      : filter === 'playable' ? '显示 3 名可操作斗士'
      : filter === 'boss' ? '显示 7 名 Boss'
      : '显示 10 名街头打手';
    els.filterHint.textContent = label;
    if (shouldScroll) {
      const target = filter === 'all' ? $('#roster') : $(`#section-${filter}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function statCell(label, value, rating) {
    return `
      <div class="dossier-stat">
        <span>${label}</span>
        <b>${statValue(value)}</b>
        <i style="--value:${Math.max(3, Math.min(100, rating))}%"></i>
      </div>`;
  }

  function renderDossier(item) {
    const category = CATEGORY[item.cat];
    els.dossier.style.setProperty('--accent', item.accent);
    els.dossier.style.setProperty('--accent-2', item.accent2);
    els.stage.style.backgroundImage = `url("${item.stageImg}")`;

    els.art.className = `dossier-art is-${item.artType}`;
    els.art.style.setProperty('--edge-l', `${item.edge ? item.edge.l : 6}%`);
    els.art.style.setProperty('--edge-r', `${item.edge ? item.edge.r : 6}%`);
    els.art.innerHTML = `<img src="${item.portrait}" alt="${esc(item.name)} ${esc(item.cn)} 角色立绘" decoding="async" />`;

    els.visualMeta.innerHTML = `
      <span>NR-${item.file}</span>
      <b>${esc(item.stageShort)}</b>
      <span>${category.label} // ${esc(item.threat)}</span>`;

    els.kicker.textContent = `FILE NR-${item.file} // ${category.label} // ${item.stage}`;
    els.name.innerHTML = `${item.name} <small>${item.cn}</small>`;
    els.role.textContent = `${item.role} // ${item.roleEn}`;
    els.threat.textContent = item.threat;
    els.threat.setAttribute('aria-label', `威胁等级 ${item.threat}`);
    els.tags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join('');

    if (item.quote) {
      els.quote.hidden = false;
      els.quote.textContent = item.quote;
    } else {
      els.quote.hidden = true;
      els.quote.textContent = '';
    }

    els.bio.innerHTML = item.bio.map((paragraph) => `<p>${paragraph}</p>`).join('');

    els.stats.innerHTML = [
      statCell('HP', item.hp, item.ratings.hp),
      statCell(item.atkLabel || 'ATK', item.atk, item.ratings.atk),
      statCell('SPD', item.spd, item.ratings.spd),
      statCell('RNG', item.rng, item.ratings.rng)
    ].join('');

    els.abilities.innerHTML = item.abilities.map((ability, index) => `
      <div class="ability">
        <span class="ability-no">0${index + 1}</span>
        <div>
          <b>${ability.name}</b>
          <em>${ability.en}</em>
          <p>${ability.desc}</p>
        </div>
      </div>`).join('');

    state.index = state.list.findIndex((entry) => entry.id === item.id);
    els.count.textContent = `${String(state.index + 1).padStart(2, '0')} / ${String(state.list.length).padStart(2, '0')}`;
    els.prev.disabled = state.list.length < 2;
    els.next.disabled = state.list.length < 2;
  }

  function openDossier(id, trigger) {
    const item = ROSTER.find((entry) => entry.id === id);
    if (!item) return;
    state.list = filterItems(state.filter);
    state.lastFocus = trigger || document.activeElement;
    renderDossier(item);
    els.dossier.classList.add('is-open');
    els.dossier.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => els.close.focus({ preventScroll: true }));
  }

  function closeDossier() {
    if (!els.dossier.classList.contains('is-open')) return;
    els.dossier.classList.remove('is-open');
    els.dossier.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      state.lastFocus.focus({ preventScroll: true });
    }
  }

  function stepDossier(direction) {
    if (!state.list.length) return;
    state.index = (state.index + direction + state.list.length) % state.list.length;
    renderDossier(state.list[state.index]);
    els.close.focus({ preventScroll: true });
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || !els.dossier.classList.contains('is-open')) return;
    const focusables = $$('button, a[href], [tabindex]:not([tabindex="-1"])', els.panel)
      .filter((node) => !node.disabled && node.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]').forEach((node) => node.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .06, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach((node) => observer.observe(node));
  }

  function bind() {
    document.addEventListener('click', cardClick);
    document.addEventListener('keydown', cardKeydown);
    els.filterButtons.forEach((button) => {
      button.addEventListener('click', () => setFilter(button.dataset.filter, button.dataset.filter !== 'all'));
    });
    els.close.addEventListener('click', closeDossier);
    els.dossier.addEventListener('click', (event) => {
      if (event.target.closest('[data-close]')) closeDossier();
    });
    els.prev.addEventListener('click', () => stepDossier(-1));
    els.next.addEventListener('click', () => stepDossier(1));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDossier();
        return;
      }
      if (!els.dossier.classList.contains('is-open')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepDossier(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepDossier(1);
      }
      trapFocus(event);
    });
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('file-')) {
      const id = hash.replace('file-', '');
      if (ROSTER.some((item) => item.id === id)) {
        requestAnimationFrame(() => openDossier(id));
      }
    }
  }

  renderGrids();
  bind();
  initReveal();

  // Expose a tiny debug handle for visual QA without polluting the global scope.
  window.__NEON_ROSTER__ = { ROSTER, openDossier, closeDossier, setFilter };
})();
