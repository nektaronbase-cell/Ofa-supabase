/**
 * Generate fighters JSON file for manual import into Supabase
 * This bypasses RLS issues by allowing manual import via Supabase dashboard
 */

import { writeFileSync } from 'fs';
import { makeFighter } from '../lib/game-utils';
import { randomUUID } from 'crypto';

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

interface FighterSeedData {
  firstName: string;
  lastName: string;
  nickname?: string;
  age: number;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  style: string;
  weightClass: string;
  rank: number;
  isChampion?: boolean;
  wins: number;
  losses: number;
}

// Import the same fighters data from seed-fighters.ts
const fighters: FighterSeedData[] = [
  // FLYWEIGHT
  { firstName: 'Joshua', lastName: 'Van', nickname: '', age: 28, height: 66, weight: 125, reach: 67, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 0, isChampion: true, wins: 15, losses: 2 },
  { firstName: 'Alexandre', lastName: 'Pantoja', nickname: 'The Cannibal', age: 34, height: 65, weight: 125, reach: 67, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 1, wins: 28, losses: 5 },
  { firstName: 'Manel', lastName: 'Kape', nickname: 'Starboy', age: 31, height: 66, weight: 125, reach: 68, stance: 'Switch', style: 'muay_thai', weightClass: 'flyweight', rank: 2, wins: 20, losses: 6 },
  { firstName: 'Tatsuro', lastName: 'Taira', nickname: '', age: 24, height: 67, weight: 125, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 3, wins: 16, losses: 0 },
  { firstName: 'Brandon', lastName: 'Royval', nickname: 'Raw Dawg', age: 32, height: 69, weight: 125, reach: 69, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 4, wins: 17, losses: 7 },
  // Add more fighters... (truncated for brevity, use full list from seed-fighters.ts)
];

console.log('Generating fighters JSON...');

const generatedFighters = fighters.map(fighterData => {
  const fighterId = randomUUID();
  const baseFighter = makeFighter({
    firstName: fighterData.firstName,
    lastName: fighterData.lastName,
    nickname: fighterData.nickname,
    age: fighterData.age,
    height: fighterData.height,
    weight: fighterData.weight,
    reach: fighterData.reach,
    stance: fighterData.stance,
    style: fighterData.style,
    weightClass: fighterData.weightClass,
    points: {}
  }, SYSTEM_USER_ID);

  return {
    ...baseFighter,
    id: fighterId,
    wins: fighterData.wins,
    losses: fighterData.losses,
    rank: fighterData.rank === 0 ? null : fighterData.rank,
    is_champion: fighterData.isChampion || false,
    money: 100000 + (fighterData.rank === 0 ? 500000 : (15 - fighterData.rank) * 25000),
    training_points: 10,
    popularity: 50 + (15 - fighterData.rank) * 3,
  };
});

// Write to JSON file
const outputPath = './scripts/fighters-seed-data.json';
writeFileSync(outputPath, JSON.stringify(generatedFighters, null, 2));

console.log(`✓ Generated ${generatedFighters.length} fighters`);
console.log(`✓ Saved to ${outputPath}`);
console.log('\nTo import:');
console.log('1. Go to Supabase Dashboard → Table Editor → fighters');
console.log('2. Click "Insert" → "Import data from CSV/JSON"');
console.log('3. Upload the fighters-seed-data.json file');
