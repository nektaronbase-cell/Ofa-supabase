import { describe, it, expect } from 'vitest';
import { 
  WEIGHT_CLASSES, 
  STYLES, 
  STANCES, 
  ATTRIBUTE_CATEGORIES,
  rand, 
  pick, 
  clamp, 
  money, 
  genId,
  genAttrs,
  makeFighter,
  simFight
} from '../../lib/game-utils';

describe('Game Utilities', () => {
  it('should have correct weight classes', () => {
    expect(WEIGHT_CLASSES).toHaveLength(8);
    expect(WEIGHT_CLASSES[0].id).toBe('flyweight');
    expect(WEIGHT_CLASSES[7].id).toBe('heavyweight');
  });

  it('should have correct fighting styles', () => {
    expect(STYLES).toHaveLength(5);
    expect(STYLES.map(s => s.id)).toContain('mma');
    expect(STYLES.map(s => s.id)).toContain('boxer');
  });

  it('should generate random number in range', () => {
    const result = rand(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('should pick random item from array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pick(arr);
    expect(arr).toContain(result);
  });

  it('should clamp values correctly', () => {
    expect(clamp(50, 0, 100)).toBe(50);
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('should format money correctly', () => {
    expect(money(1000)).toBe('$1,000');
    expect(money(50000)).toBe('$50,000');
  });

  it('should generate unique IDs', () => {
    const id1 = genId();
    const id2 = genId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });
});

describe('Fighter Generation', () => {
  it('should generate attributes for a style', () => {
    const attrs = genAttrs('mma', false);
    expect(Object.keys(attrs)).toHaveLength(20);
    expect(attrs.striking).toBeGreaterThanOrEqual(30);
    expect(attrs.striking).toBeLessThanOrEqual(99);
  });

  it('should apply style bonuses correctly', () => {
    const boxerAttrs = genAttrs('boxer', false);
    const wrestlerAttrs = genAttrs('wrestler', false);
    
    // Boxer should have higher striking
    expect(boxerAttrs.striking).toBeGreaterThan(50);
    // Wrestler should have higher wrestling
    expect(wrestlerAttrs.wrestling).toBeGreaterThan(50);
  });

  it('should create a complete fighter', () => {
    const fighterData = {
      firstName: 'Test',
      lastName: 'Fighter',
      nickname: 'The Test',
      age: 25,
      height: 70,
      weight: 170,
      reach: 72,
      stance: 'Orthodox',
      style: 'mma',
      weightClass: 'welterweight',
      points: { striking: 10, wrestling: 5 }
    };

    const fighter = makeFighter(fighterData, 'user123');
    
    expect(fighter.first_name).toBe('Test');
    expect(fighter.last_name).toBe('Fighter');
    expect(fighter.nickname).toBe('The Test');
    expect(fighter.owner_id).toBe('user123');
    expect(fighter.wins).toBe(0);
    expect(fighter.losses).toBe(0);
    expect(fighter.money).toBe(5000);
    expect(fighter.training_points).toBe(5);
    expect(fighter.attributes.striking).toBeGreaterThan(50);
  });

  it('should apply attribute points correctly', () => {
    const fighterData = {
      firstName: 'Test',
      lastName: 'Fighter',
      style: 'mma',
      weightClass: 'welterweight',
      points: { striking: 15, cardio: 10 }
    };

    const fighter = makeFighter(fighterData, 'user123');
    
    // Base MMA striking is 55, plus 15 points
    expect(fighter.attributes.striking).toBeGreaterThanOrEqual(65);
    // Base cardio is 58, plus 10 points
    expect(fighter.attributes.cardio).toBeGreaterThanOrEqual(65);
  });
});

describe('Fight Simulation', () => {
  it('should simulate a complete fight', () => {
    const fighter1 = makeFighter({
      firstName: 'Fighter',
      lastName: 'One',
      style: 'boxer',
      weightClass: 'welterweight',
      points: { striking: 15, power: 10 }
    }, 'user1');

    const fighter2 = makeFighter({
      firstName: 'Fighter',
      lastName: 'Two',
      style: 'wrestler',
      weightClass: 'welterweight',
      points: { wrestling: 15, submissions: 10 }
    }, 'user2');

    const result = simFight(fighter1, fighter2);

    expect(result.winner).toBeDefined();
    expect(result.loser).toBeDefined();
    expect(result.method).toMatch(/KO|Submission|Decision/);
    expect(result.round).toBeGreaterThanOrEqual(1);
    expect(result.round).toBeLessThanOrEqual(3);
    expect(result.time).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.stats.f1).toBeDefined();
    expect(result.stats.f2).toBeDefined();
  });

  it('should produce valid fight statistics', () => {
    const fighter1 = makeFighter({
      firstName: 'Test',
      lastName: 'One',
      style: 'mma',
      weightClass: 'welterweight',
      points: {}
    }, 'user1');

    const fighter2 = makeFighter({
      firstName: 'Test',
      lastName: 'Two',
      style: 'mma',
      weightClass: 'welterweight',
      points: {}
    }, 'user2');

    const result = simFight(fighter1, fighter2);

    expect(result.stats.f1.land).toBeGreaterThanOrEqual(0);
    expect(result.stats.f2.land).toBeGreaterThanOrEqual(0);
    expect(result.stats.f1.td).toBeGreaterThanOrEqual(0);
    expect(result.stats.f2.td).toBeGreaterThanOrEqual(0);
    expect(result.stats.f1.kd).toBeGreaterThanOrEqual(0);
    expect(result.stats.f2.kd).toBeGreaterThanOrEqual(0);
  });

  it('should have one winner and one loser', () => {
    const fighter1 = makeFighter({
      firstName: 'Test',
      lastName: 'One',
      style: 'mma',
      weightClass: 'welterweight',
      points: {}
    }, 'user1');

    const fighter2 = makeFighter({
      firstName: 'Test',
      lastName: 'Two',
      style: 'mma',
      weightClass: 'welterweight',
      points: {}
    }, 'user2');

    const result = simFight(fighter1, fighter2);

    expect(result.winner.id).not.toBe(result.loser.id);
    expect([fighter1.id, fighter2.id]).toContain(result.winner.id);
    expect([fighter1.id, fighter2.id]).toContain(result.loser.id);
  });
});

describe('Attribute Categories', () => {
  it('should have all attribute categories', () => {
    expect(ATTRIBUTE_CATEGORIES.Physical).toBeDefined();
    expect(ATTRIBUTE_CATEGORIES.Striking).toBeDefined();
    expect(ATTRIBUTE_CATEGORIES.Grappling).toBeDefined();
    expect(ATTRIBUTE_CATEGORIES.Mental).toBeDefined();
  });

  it('should have correct attributes in each category', () => {
    expect(ATTRIBUTE_CATEGORIES.Physical).toContain('strength');
    expect(ATTRIBUTE_CATEGORIES.Physical).toContain('cardio');
    expect(ATTRIBUTE_CATEGORIES.Striking).toContain('striking');
    expect(ATTRIBUTE_CATEGORIES.Striking).toContain('kicks');
    expect(ATTRIBUTE_CATEGORIES.Grappling).toContain('wrestling');
    expect(ATTRIBUTE_CATEGORIES.Grappling).toContain('submissions');
    expect(ATTRIBUTE_CATEGORIES.Mental).toContain('fightIQ');
    expect(ATTRIBUTE_CATEGORIES.Mental).toContain('composure');
  });

  it('should have 19 total attributes', () => {
    const totalAttrs = Object.values(ATTRIBUTE_CATEGORIES).flat();
    expect(totalAttrs).toHaveLength(19);
  });
});
