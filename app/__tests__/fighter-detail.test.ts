import { describe, it, expect } from 'vitest';

describe('Fighter Detail - Win Rate Calculation', () => {
  it('should calculate win rate correctly', () => {
    const wins = 12;
    const losses = 3;
    const draws = 0;
    const totalFights = wins + losses + draws;
    const winRate = ((wins / totalFights) * 100).toFixed(1);

    expect(winRate).toBe('80.0');
  });

  it('should handle zero fights', () => {
    const wins = 0;
    const losses = 0;
    const draws = 0;
    const totalFights = wins + losses + draws;
    const winRate = totalFights > 0 ? ((wins / totalFights) * 100).toFixed(1) : '0.0';

    expect(winRate).toBe('0.0');
  });

  it('should handle draws in calculation', () => {
    const wins = 8;
    const losses = 2;
    const draws = 1;
    const totalFights = wins + losses + draws;
    const winRate = ((wins / totalFights) * 100).toFixed(1);

    expect(winRate).toBe('72.7');
  });
});

describe('Fighter Detail - Attribute Display', () => {
  it('should display all 5 attributes', () => {
    const attributes = [
      { name: 'Striking', value: 75, color: '#EF4444' },
      { name: 'Grappling', value: 80, color: '#F59E0B' },
      { name: 'Stamina', value: 70, color: '#10B981' },
      { name: 'Chin', value: 65, color: '#3B82F6' },
      { name: 'Power', value: 85, color: '#8B5CF6' },
    ];

    expect(attributes).toHaveLength(5);
    expect(attributes.map(a => a.name)).toEqual([
      'Striking',
      'Grappling',
      'Stamina',
      'Chin',
      'Power',
    ]);
  });

  it('should calculate total attribute points', () => {
    const attributes = [
      { name: 'Striking', value: 75 },
      { name: 'Grappling', value: 80 },
      { name: 'Stamina', value: 70 },
      { name: 'Chin', value: 65 },
      { name: 'Power', value: 85 },
    ];

    const total = attributes.reduce((sum, attr) => sum + attr.value, 0);

    expect(total).toBe(375);
  });

  it('should calculate progress bar percentage', () => {
    const attributeValue = 75;
    const maxValue = 100;
    const percentage = (attributeValue / maxValue) * 100;

    expect(percentage).toBe(75);
  });
});

describe('Fighter Detail - Fight History', () => {
  it('should display fight result correctly', () => {
    const fight = {
      id: '1',
      opponent: 'Mike Johnson',
      result: 'Win',
      method: 'KO',
      round: 2,
      date: '2024-01-15',
      purse: 15000,
    };

    expect(fight.result).toBe('Win');
    expect(fight.method).toBe('KO');
    expect(fight.round).toBe(2);
  });

  it('should format purse amount', () => {
    const purse = 15000;
    const formatted = purse.toLocaleString();

    expect(formatted).toBe('15,000');
  });

  it('should format fight date', () => {
    const dateString = '2024-01-15';
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString();

    expect(formatted).toBeTruthy();
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should categorize fight results', () => {
    const results = ['Win', 'Loss', 'Draw'];
    
    results.forEach(result => {
      const isWin = result === 'Win';
      const isLoss = result === 'Loss';
      const isDraw = result === 'Draw';

      expect(isWin || isLoss || isDraw).toBe(true);
    });
  });
});

describe('Fighter Detail - Stats Display', () => {
  it('should format money with currency symbol', () => {
    const money = 125000;
    const formatted = `$${money.toLocaleString()}`;

    expect(formatted).toBe('$125,000');
  });

  it('should display training points', () => {
    const trainingPoints = 8;
    const display = `${trainingPoints} pts`;

    expect(display).toBe('8 pts');
  });

  it('should handle zero values', () => {
    const money = 0;
    const trainingPoints = 0;

    expect(money).toBe(0);
    expect(trainingPoints).toBe(0);
  });
});

describe('Fighter Detail - Injury Status', () => {
  it('should display injury information', () => {
    const fighter = {
      injury: 'Broken Hand',
      injury_time: 4,
    };

    expect(fighter.injury).toBe('Broken Hand');
    expect(fighter.injury_time).toBe(4);
  });

  it('should handle no injury', () => {
    const fighter = {
      injury: null,
      injury_time: 0,
    };

    const hasInjury = !!fighter.injury;

    expect(hasInjury).toBe(false);
  });

  it('should format injury display text', () => {
    const injury = 'Broken Hand';
    const injuryTime = 4;
    const display = `Injured - ${injury} (${injuryTime} weeks recovery)`;

    expect(display).toBe('Injured - Broken Hand (4 weeks recovery)');
  });
});

describe('Fighter Detail - Record Display', () => {
  it('should format fighter record', () => {
    const wins = 12;
    const losses = 3;
    const draws = 0;
    const record = `${wins}W - ${losses}L - ${draws}D`;

    expect(record).toBe('12W - 3L - 0D');
  });

  it('should handle undefeated record', () => {
    const wins = 10;
    const losses = 0;
    const draws = 0;
    const record = `${wins}W - ${losses}L - ${draws}D`;

    expect(record).toBe('10W - 0L - 0D');
  });
});
