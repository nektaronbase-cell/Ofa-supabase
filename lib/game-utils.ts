// Game Constants and Utilities

export const WEIGHT_CLASSES = [
  { id: 'flyweight', name: 'Flyweight', min: 115, max: 125 },
  { id: 'bantamweight', name: 'Bantamweight', min: 126, max: 135 },
  { id: 'featherweight', name: 'Featherweight', min: 136, max: 145 },
  { id: 'lightweight', name: 'Lightweight', min: 146, max: 155 },
  { id: 'welterweight', name: 'Welterweight', min: 156, max: 170 },
  { id: 'middleweight', name: 'Middleweight', min: 171, max: 185 },
  { id: 'lightheavyweight', name: 'Light Heavyweight', min: 186, max: 205 },
  { id: 'heavyweight', name: 'Heavyweight', min: 206, max: 265 },
];

export const STYLES = [
  { id: 'boxer', name: 'Boxer', icon: '🥊', bonuses: { striking: 15, headMovement: 12 }, penalties: { wrestling: -10 } },
  { id: 'wrestler', name: 'Wrestler', icon: '🤼', bonuses: { wrestling: 15, takedowns: 12 }, penalties: { striking: -5 } },
  { id: 'bjj', name: 'BJJ', icon: '🥋', bonuses: { submissions: 18, groundGame: 15 }, penalties: { striking: -10 } },
  { id: 'muaythai', name: 'Muay Thai', icon: '🦵', bonuses: { kicks: 15, clinch: 10 }, penalties: { wrestling: -10 } },
  { id: 'mma', name: 'MMA', icon: '🏟️', bonuses: { striking: 5, wrestling: 5, cardio: 8 }, penalties: {} },
];

export const STANCES = ['Orthodox', 'Southpaw', 'Switch'];

export const ATTRIBUTE_CATEGORIES = {
  Physical: ['strength', 'speed', 'power', 'cardio', 'chin', 'recovery'],
  Striking: ['striking', 'kicks', 'headMovement', 'footwork'],
  Grappling: ['wrestling', 'takedowns', 'takedownDefense', 'groundGame', 'submissions'],
  Mental: ['fightIQ', 'composure', 'aggression', 'timing'],
};

// Utility functions
export const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const money = (n: number) => '$' + n.toLocaleString();
export const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// Generate attributes for a fighter based on style
export const genAttrs = (style: string, addRand = true) => {
  const a: Record<string, number> = {
    strength: 50, speed: 50, power: 50, cardio: 50, chin: 50, recovery: 50,
    striking: 50, kicks: 50, headMovement: 50, footwork: 50,
    wrestling: 50, takedowns: 50, takedownDefense: 50, clinch: 50,
    groundGame: 50, submissions: 50,
    fightIQ: 50, composure: 50, aggression: 50, timing: 50
  };

  const s = STYLES.find(x => x.id === style);
  if (s) {
    Object.entries(s.bonuses).forEach(([k, v]) => a[k] && (a[k] += v));
    Object.entries(s.penalties || {}).forEach(([k, v]) => a[k] && (a[k] += v));
  }

  if (addRand) {
    let p = 50;
    const keys = Object.keys(a);
    while (p > 0) {
      const k = pick(keys);
      const add = Math.min(p, rand(1, 4));
      a[k] = clamp(a[k] + add, 30, 99);
      p -= add;
    }
  }

  return a;
};

// Create a new fighter
export const makeFighter = (data: any, ownerId: string) => {
  const s = STYLES.find(x => x.id === data.style) || STYLES[4];
  const attrs = genAttrs(data.style, false);
  
  if (data.points) {
    Object.entries(data.points).forEach(([k, v]) => {
      if (attrs[k]) {
        attrs[k] = clamp(attrs[k] + (v as number), 30, 99);
      }
    });
  }

  return {
    id: genId(),
    owner_id: ownerId,
    first_name: data.firstName,
    last_name: data.lastName,
    nickname: data.nickname || null,
    age: data.age || 25,
    height: data.height || 70,
    weight: data.weight || 170,
    reach: data.reach || 72,
    stance: data.stance || 'Orthodox',
    style: data.style,
    style_name: s.name,
    style_icon: s.icon,
    weight_class: data.weightClass,
    attributes: attrs,
    wins: 0,
    losses: 0,
    draws: 0,
    ko_wins: 0,
    sub_wins: 0,
    dec_wins: 0,
    money: 5000,
    training_points: 5,
    popularity: 10,
    rank: undefined,
    is_champion: false,
    injury: undefined,
    injury_weeks: 0,
  };
};

// Fight simulation engine
export const simFight = (f1: any, f2: any) => {
  const st = {
    f1: { head: 100, stam: 100, kd: 0 },
    f2: { head: 100, stam: 100, kd: 0 }
  };
  const stats = {
    f1: { land: 0, td: 0, kd: 0 },
    f2: { land: 0, td: 0, kd: 0 }
  };
  const scores = { f1: [] as number[], f2: [] as number[] };
  let win: any = null;
  let meth: string | null = null;
  let rnd: number | null = null;
  let time: string | null = null;

  const attr = (f: any, a: string) => f.attributes?.[a] || 50;

  for (let r = 1; r <= 3 && !win; r++) {
    let d1 = 0, d2 = 0;
    
    for (let x = 0; x < 50 && !win; x++) {
      const is1 = attr(f1, 'aggression') + rand(-20, 20) >= attr(f2, 'aggression') + rand(-20, 20);
      const atk = is1 ? f1 : f2;
      const def = is1 ? f2 : f1;
      const aS = is1 ? st.f1 : st.f2;
      const dS = is1 ? st.f2 : st.f1;
      const aSt = is1 ? stats.f1 : stats.f2;

      if (Math.random() < 0.15 && attr(atk, 'wrestling') > 50) {
        if (Math.random() < 0.4) {
          aSt.td++;
          if (Math.random() < 0.15 && attr(atk, 'submissions') > 55 && Math.random() < 0.3) {
            win = atk;
            meth = 'Submission';
            rnd = r;
            time = `${Math.floor(x / 10)}:${String((x % 10) * 6).padStart(2, '0')}`;
          }
        }
      } else {
        const hit = clamp(attr(atk, 'striking') / 150 + 0.3, 0.2, 0.7);
        for (let i = 0; i < rand(1, 3) && !win; i++) {
          if (Math.random() < hit) {
            aSt.land++;
            const dmg = (attr(atk, 'power') / 80) * rand(4, 10);
            dS.head -= dmg;
            if (is1) d1 += dmg; else d2 += dmg;
            
            if (dS.head < 45 && Math.random() < 0.15) {
              aSt.kd++;
              dS.kd++;
              dS.head -= 10;
              if (dS.head <= 0 || dS.kd >= 3) {
                win = atk;
                meth = 'KO';
                rnd = r;
                time = `${Math.floor(x / 10)}:${String((x % 10) * 6).padStart(2, '0')}`;
              }
            }
          }
        }
      }
    }

    if (!win) {
      let s1 = 10, s2 = 10;
      if (d1 > d2 + 5 || stats.f1.kd > stats.f2.kd) s2 = 9;
      else if (d2 > d1 + 5 || stats.f2.kd > stats.f1.kd) s1 = 9;
      scores.f1.push(s1);
      scores.f2.push(s2);
      st.f1.kd = 0;
      st.f2.kd = 0;
      st.f1.head = Math.min(100, st.f1.head + 10);
      st.f2.head = Math.min(100, st.f2.head + 10);
    }
  }

  if (!win) {
    const t1 = scores.f1.reduce((a, b) => a + b, 0);
    const t2 = scores.f2.reduce((a, b) => a + b, 0);
    win = t1 > t2 ? f1 : t2 > t1 ? f2 : stats.f1.land > stats.f2.land ? f1 : f2;
    meth = 'Decision';
    rnd = 3;
    time = '5:00';
  }

  return {
    winner: win,
    loser: win.id === f1.id ? f2 : f1,
    method: meth,
    round: rnd,
    time,
    stats
  };
};
