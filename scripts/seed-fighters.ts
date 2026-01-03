/**
 * Seed script to populate OFA database with real UFC fighters
 * Run this script to add top 15 fighters from each weight class
 */

import { createClient } from '@supabase/supabase-js';
import { makeFighter } from '../lib/game-utils';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// System user ID for seeded fighters (use a fixed UUID)
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

interface FighterSeedData {
  firstName: string;
  lastName: string;
  nickname?: string;
  age: number;
  height: number; // inches
  weight: number; // lbs
  reach: number; // inches
  stance: string;
  style: string;
  weightClass: string;
  rank: number;
  isChampion?: boolean;
  wins: number;
  losses: number;
}

// Real UFC fighters data
const fighters: FighterSeedData[] = [
  // FLYWEIGHT (125 lbs)
  { firstName: 'Joshua', lastName: 'Van', nickname: '', age: 28, height: 66, weight: 125, reach: 67, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 0, isChampion: true, wins: 15, losses: 2 },
  { firstName: 'Alexandre', lastName: 'Pantoja', nickname: 'The Cannibal', age: 34, height: 65, weight: 125, reach: 67, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 1, wins: 28, losses: 5 },
  { firstName: 'Manel', lastName: 'Kape', nickname: 'Starboy', age: 31, height: 66, weight: 125, reach: 68, stance: 'Switch', style: 'muay_thai', weightClass: 'flyweight', rank: 2, wins: 20, losses: 6 },
  { firstName: 'Tatsuro', lastName: 'Taira', nickname: '', age: 24, height: 67, weight: 125, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 3, wins: 16, losses: 0 },
  { firstName: 'Brandon', lastName: 'Royval', nickname: 'Raw Dawg', age: 32, height: 69, weight: 125, reach: 69, stance: 'Orthodox', style: 'bjj', weightClass: 'flyweight', rank: 4, wins: 17, losses: 7 },
  { firstName: 'Brandon', lastName: 'Moreno', nickname: 'The Assassin Baby', age: 31, height: 67, weight: 125, reach: 70, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 5, wins: 22, losses: 8 },
  { firstName: 'Amir', lastName: 'Albazi', nickname: 'The Prince', age: 31, height: 69, weight: 125, reach: 70, stance: 'Orthodox', style: 'wrestler', weightClass: 'flyweight', rank: 6, wins: 17, losses: 1 },
  { firstName: 'Asu', lastName: 'Almabayev', nickname: '', age: 31, height: 67, weight: 125, reach: 67, stance: 'Orthodox', style: 'wrestler', weightClass: 'flyweight', rank: 7, wins: 20, losses: 2 },
  { firstName: 'Kyoji', lastName: 'Horiguchi', nickname: '', age: 34, height: 65, weight: 125, reach: 67, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 8, wins: 32, losses: 5 },
  { firstName: 'Tim', lastName: 'Elliott', nickname: '', age: 38, height: 66, weight: 125, reach: 67, stance: 'Switch', style: 'wrestler', weightClass: 'flyweight', rank: 9, wins: 20, losses: 13 },
  { firstName: 'Steve', lastName: 'Erceg', nickname: 'Astro Boy', age: 28, height: 70, weight: 125, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 10, wins: 12, losses: 2 },
  { firstName: 'Alex', lastName: 'Perez', nickname: '', age: 33, height: 65, weight: 125, reach: 65, stance: 'Orthodox', style: 'wrestler', weightClass: 'flyweight', rank: 11, wins: 25, losses: 8 },
  { firstName: 'Tagir', lastName: 'Ulanbekov', nickname: '', age: 33, height: 66, weight: 125, reach: 66, stance: 'Orthodox', style: 'wrestler', weightClass: 'flyweight', rank: 12, wins: 16, losses: 2 },
  { firstName: 'Charles', lastName: 'Johnson', nickname: 'InnerG', age: 29, height: 68, weight: 125, reach: 70, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 13, wins: 16, losses: 6 },
  { firstName: 'Bruno', lastName: 'Silva', nickname: 'Bulldog', age: 34, height: 67, weight: 125, reach: 68, stance: 'Orthodox', style: 'muay_thai', weightClass: 'flyweight', rank: 14, wins: 24, losses: 10 },
  { firstName: 'Loneer', lastName: 'Kavanagh', nickname: '', age: 28, height: 68, weight: 125, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'flyweight', rank: 15, wins: 11, losses: 3 },

  // BANTAMWEIGHT (135 lbs)
  { firstName: 'Petr', lastName: 'Yan', nickname: 'No Mercy', age: 31, height: 67, weight: 135, reach: 67, stance: 'Orthodox', style: 'boxer', weightClass: 'bantamweight', rank: 0, isChampion: true, wins: 18, losses: 5 },
  { firstName: 'Merab', lastName: 'Dvalishvili', nickname: 'The Machine', age: 34, height: 68, weight: 135, reach: 68, stance: 'Orthodox', style: 'wrestler', weightClass: 'bantamweight', rank: 1, wins: 18, losses: 4 },
  { firstName: 'Umar', lastName: 'Nurmagomedov', nickname: 'Young Eagle', age: 28, height: 68, weight: 135, reach: 70, stance: 'Southpaw', style: 'wrestler', weightClass: 'bantamweight', rank: 2, wins: 18, losses: 0 },
  { firstName: 'Sean', lastName: 'OMalley', nickname: 'Sugar', age: 30, height: 71, weight: 135, reach: 72, stance: 'Switch', style: 'boxer', weightClass: 'bantamweight', rank: 3, wins: 18, losses: 2 },
  { firstName: 'Cory', lastName: 'Sandhagen', nickname: 'The Sandman', age: 33, height: 71, weight: 135, reach: 70, stance: 'Switch', style: 'mma', weightClass: 'bantamweight', rank: 4, wins: 17, losses: 7 },
  { firstName: 'Song', lastName: 'Yadong', nickname: '', age: 27, height: 69, weight: 135, reach: 68, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 5, wins: 22, losses: 8 },
  { firstName: 'Deiveson', lastName: 'Figueiredo', nickname: 'Deus da Guerra', age: 37, height: 65, weight: 135, reach: 68, stance: 'Orthodox', style: 'bjj', weightClass: 'bantamweight', rank: 6, wins: 24, losses: 4 },
  { firstName: 'Aiemann', lastName: 'Zahabi', nickname: '', age: 35, height: 68, weight: 135, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 7, wins: 11, losses: 2 },
  { firstName: 'Marlon', lastName: 'Vera', nickname: 'Chito', age: 32, height: 68, weight: 135, reach: 70, stance: 'Switch', style: 'muay_thai', weightClass: 'bantamweight', rank: 8, wins: 23, losses: 10 },
  { firstName: 'Mario', lastName: 'Bautista', nickname: '', age: 31, height: 69, weight: 135, reach: 72, stance: 'Orthodox', style: 'wrestler', weightClass: 'bantamweight', rank: 9, wins: 15, losses: 3 },
  { firstName: 'David', lastName: 'Martinez', nickname: '', age: 28, height: 68, weight: 135, reach: 68, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 10, wins: 10, losses: 2 },
  { firstName: 'Payton', lastName: 'Talbott', nickname: '', age: 26, height: 69, weight: 135, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 11, wins: 9, losses: 0 },
  { firstName: 'Rob', lastName: 'Font', nickname: '', age: 37, height: 68, weight: 135, reach: 69, stance: 'Orthodox', style: 'boxer', weightClass: 'bantamweight', rank: 12, wins: 20, losses: 8 },
  { firstName: 'Vinicius', lastName: 'Oliveira', nickname: '', age: 30, height: 67, weight: 135, reach: 68, stance: 'Orthodox', style: 'bjj', weightClass: 'bantamweight', rank: 13, wins: 21, losses: 3 },
  { firstName: 'Kyler', lastName: 'Phillips', nickname: 'Matrix', age: 30, height: 69, weight: 135, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 14, wins: 12, losses: 3 },
  { firstName: 'Montel', lastName: 'Jackson', nickname: 'Quik', age: 33, height: 69, weight: 135, reach: 73, stance: 'Orthodox', style: 'mma', weightClass: 'bantamweight', rank: 15, wins: 14, losses: 3 },

  // FEATHERWEIGHT (145 lbs)
  { firstName: 'Alexander', lastName: 'Volkanovski', nickname: 'The Great', age: 36, height: 66, weight: 145, reach: 71, stance: 'Orthodox', style: 'wrestler', weightClass: 'featherweight', rank: 0, isChampion: true, wins: 27, losses: 4 },
  { firstName: 'Movsar', lastName: 'Evloev', nickname: '', age: 31, height: 69, weight: 145, reach: 72, stance: 'Orthodox', style: 'wrestler', weightClass: 'featherweight', rank: 1, wins: 18, losses: 0 },
  { firstName: 'Diego', lastName: 'Lopes', nickname: '', age: 30, height: 69, weight: 145, reach: 70, stance: 'Orthodox', style: 'bjj', weightClass: 'featherweight', rank: 2, wins: 26, losses: 6 },
  { firstName: 'Yair', lastName: 'Rodriguez', nickname: 'Pantera', age: 33, height: 71, weight: 145, reach: 70, stance: 'Orthodox', style: 'muay_thai', weightClass: 'featherweight', rank: 3, wins: 16, losses: 4 },
  { firstName: 'Lerone', lastName: 'Murphy', nickname: 'The Miracle', age: 33, height: 70, weight: 145, reach: 73, stance: 'Switch', style: 'mma', weightClass: 'featherweight', rank: 4, wins: 15, losses: 0 },
  { firstName: 'Aljamain', lastName: 'Sterling', nickname: 'Funk Master', age: 35, height: 67, weight: 145, reach: 71, stance: 'Switch', style: 'wrestler', weightClass: 'featherweight', rank: 5, wins: 24, losses: 5 },
  { firstName: 'Arnold', lastName: 'Allen', nickname: 'Almighty', age: 31, height: 69, weight: 145, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 6, wins: 20, losses: 3 },
  { firstName: 'Youssef', lastName: 'Zalal', nickname: 'The Moroccan Devil', age: 28, height: 70, weight: 145, reach: 72, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 7, wins: 16, losses: 5 },
  { firstName: 'Steve', lastName: 'Garcia', nickname: 'Mean Machine', age: 33, height: 69, weight: 145, reach: 71, stance: 'Orthodox', style: 'boxer', weightClass: 'featherweight', rank: 8, wins: 16, losses: 6 },
  { firstName: 'Brian', lastName: 'Ortega', nickname: 'T-City', age: 34, height: 68, weight: 145, reach: 69, stance: 'Southpaw', style: 'bjj', weightClass: 'featherweight', rank: 9, wins: 16, losses: 4 },
  { firstName: 'Jean', lastName: 'Silva', nickname: 'Lord', age: 31, height: 68, weight: 145, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 10, wins: 14, losses: 2 },
  { firstName: 'Josh', lastName: 'Emmett', nickname: '', age: 40, height: 65, weight: 145, reach: 66, stance: 'Orthodox', style: 'wrestler', weightClass: 'featherweight', rank: 11, wins: 19, losses: 5 },
  { firstName: 'Patricio', lastName: 'Pitbull', nickname: '', age: 38, height: 67, weight: 145, reach: 68, stance: 'Orthodox', style: 'bjj', weightClass: 'featherweight', rank: 12, wins: 36, losses: 7 },
  { firstName: 'Kevin', lastName: 'Vallejos', nickname: '', age: 27, height: 68, weight: 145, reach: 69, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 13, wins: 11, losses: 2 },
  { firstName: 'Dan', lastName: 'Ige', nickname: '50k', age: 33, height: 70, weight: 145, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 14, wins: 18, losses: 8 },
  { firstName: 'David', lastName: 'Onama', nickname: '', age: 30, height: 69, weight: 145, reach: 70, stance: 'Orthodox', style: 'mma', weightClass: 'featherweight', rank: 15, wins: 13, losses: 3 },

  // LIGHTWEIGHT (155 lbs)
  { firstName: 'Islam', lastName: 'Makhachev', nickname: '', age: 33, height: 70, weight: 155, reach: 70, stance: 'Southpaw', style: 'wrestler', weightClass: 'lightweight', rank: 0, isChampion: true, wins: 28, losses: 1 },
  { firstName: 'Arman', lastName: 'Tsarukyan', nickname: 'Ahalkalakets', age: 28, height: 69, weight: 155, reach: 69, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 1, wins: 22, losses: 3 },
  { firstName: 'Charles', lastName: 'Oliveira', nickname: 'Do Bronx', age: 35, height: 70, weight: 155, reach: 74, stance: 'Orthodox', style: 'bjj', weightClass: 'lightweight', rank: 2, wins: 35, losses: 10 },
  { firstName: 'Max', lastName: 'Holloway', nickname: 'Blessed', age: 33, height: 71, weight: 155, reach: 69, stance: 'Orthodox', style: 'boxer', weightClass: 'lightweight', rank: 3, wins: 26, losses: 8 },
  { firstName: 'Justin', lastName: 'Gaethje', nickname: 'The Highlight', age: 36, height: 71, weight: 155, reach: 71, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 4, wins: 26, losses: 5 },
  { firstName: 'Paddy', lastName: 'Pimblett', nickname: 'The Baddy', age: 30, height: 71, weight: 155, reach: 73, stance: 'Orthodox', style: 'bjj', weightClass: 'lightweight', rank: 5, wins: 22, losses: 3 },
  { firstName: 'Dan', lastName: 'Hooker', nickname: 'The Hangman', age: 35, height: 72, weight: 155, reach: 75, stance: 'Southpaw', style: 'muay_thai', weightClass: 'lightweight', rank: 6, wins: 24, losses: 13 },
  { firstName: 'Mateusz', lastName: 'Gamrot', nickname: 'Gamer', age: 34, height: 69, weight: 155, reach: 70, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 7, wins: 25, losses: 3 },
  { firstName: 'Benoit', lastName: 'Saint Denis', nickname: 'God of War', age: 29, height: 70, weight: 155, reach: 72, stance: 'Orthodox', style: 'mma', weightClass: 'lightweight', rank: 8, wins: 13, losses: 3 },
  { firstName: 'Rafael', lastName: 'Fiziev', nickname: 'Ataman', age: 32, height: 69, weight: 155, reach: 70, stance: 'Switch', style: 'muay_thai', weightClass: 'lightweight', rank: 9, wins: 13, losses: 3 },
  { firstName: 'Renato', lastName: 'Moicano', nickname: '', age: 35, height: 70, weight: 155, reach: 72, stance: 'Orthodox', style: 'bjj', weightClass: 'lightweight', rank: 10, wins: 19, losses: 6 },
  { firstName: 'Beneil', lastName: 'Dariush', nickname: 'Benny', age: 36, height: 70, weight: 155, reach: 72, stance: 'Southpaw', style: 'bjj', weightClass: 'lightweight', rank: 11, wins: 23, losses: 6 },
  { firstName: 'Michael', lastName: 'Chandler', nickname: 'Iron', age: 39, height: 68, weight: 155, reach: 71, stance: 'Orthodox', style: 'wrestler', weightClass: 'lightweight', rank: 12, wins: 23, losses: 9 },
  { firstName: 'Manuel', lastName: 'Torres', nickname: 'El Loco', age: 30, height: 70, weight: 155, reach: 71, stance: 'Orthodox', style: 'mma', weightClass: 'lightweight', rank: 13, wins: 16, losses: 2 },
  { firstName: 'Mauricio', lastName: 'Ruffy', nickname: '', age: 27, height: 71, weight: 155, reach: 73, stance: 'Orthodox', style: 'mma', weightClass: 'lightweight', rank: 14, wins: 11, losses: 1 },
  { firstName: 'Fares', lastName: 'Ziam', nickname: 'Smile Killer', age: 29, height: 70, weight: 155, reach: 72, stance: 'Orthodox', style: 'mma', weightClass: 'lightweight', rank: 15, wins: 16, losses: 4 },

  // WELTERWEIGHT (170 lbs)
  { firstName: 'Jack', lastName: 'Della Maddalena', nickname: '', age: 28, height: 71, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 1, wins: 18, losses: 2 },
  { firstName: 'Shavkat', lastName: 'Rakhmonov', nickname: 'Nomad', age: 30, height: 72, weight: 170, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 2, wins: 18, losses: 0 },
  { firstName: 'Ian', lastName: 'Machado Garry', nickname: 'The Future', age: 27, height: 75, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 3, wins: 15, losses: 0 },
  { firstName: 'Michael', lastName: 'Morales', nickname: '', age: 26, height: 71, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 4, wins: 17, losses: 0 },
  { firstName: 'Belal', lastName: 'Muhammad', nickname: 'Remember the Name', age: 37, height: 70, weight: 170, reach: 72, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 5, wins: 24, losses: 3 },
  { firstName: 'Carlos', lastName: 'Prates', nickname: 'The Nightmare', age: 31, height: 73, weight: 170, reach: 76, stance: 'Orthodox', style: 'muay_thai', weightClass: 'welterweight', rank: 6, wins: 21, losses: 6 },
  { firstName: 'Sean', lastName: 'Brady', nickname: '', age: 32, height: 71, weight: 170, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 7, wins: 17, losses: 2 },
  { firstName: 'Kamaru', lastName: 'Usman', nickname: 'The Nigerian Nightmare', age: 38, height: 72, weight: 170, reach: 76, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 8, wins: 20, losses: 4 },
  { firstName: 'Leon', lastName: 'Edwards', nickname: 'Rocky', age: 33, height: 74, weight: 170, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 9, wins: 23, losses: 3 },
  { firstName: 'Joaquin', lastName: 'Buckley', nickname: 'New Mansa', age: 31, height: 72, weight: 170, reach: 73, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 10, wins: 20, losses: 6 },
  { firstName: 'Gabriel', lastName: 'Bonfim', nickname: 'Fly', age: 27, height: 71, weight: 170, reach: 73, stance: 'Orthodox', style: 'bjj', weightClass: 'welterweight', rank: 11, wins: 16, losses: 1 },
  { firstName: 'Gilbert', lastName: 'Burns', nickname: 'Durinho', age: 39, height: 70, weight: 170, reach: 71, stance: 'Orthodox', style: 'bjj', weightClass: 'welterweight', rank: 12, wins: 22, losses: 7 },
  { firstName: 'Geoff', lastName: 'Neal', nickname: 'Handz of Steel', age: 34, height: 75, weight: 170, reach: 75, stance: 'Southpaw', style: 'boxer', weightClass: 'welterweight', rank: 13, wins: 16, losses: 6 },
  { firstName: 'Colby', lastName: 'Covington', nickname: 'Chaos', age: 37, height: 70, weight: 170, reach: 72, stance: 'Orthodox', style: 'wrestler', weightClass: 'welterweight', rank: 14, wins: 17, losses: 4 },
  { firstName: 'Daniel', lastName: 'Rodriguez', nickname: 'D-Rod', age: 38, height: 72, weight: 170, reach: 76, stance: 'Orthodox', style: 'mma', weightClass: 'welterweight', rank: 15, wins: 18, losses: 4 },

  // MIDDLEWEIGHT (185 lbs)
  { firstName: 'Khamzat', lastName: 'Chimaev', nickname: 'Borz', age: 31, height: 74, weight: 185, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'middleweight', rank: 0, isChampion: true, wins: 14, losses: 0 },
  { firstName: 'Dricus', lastName: 'Du Plessis', nickname: 'Stillknocks', age: 31, height: 73, weight: 185, reach: 76, stance: 'Southpaw', style: 'mma', weightClass: 'middleweight', rank: 1, wins: 22, losses: 2 },
  { firstName: 'Nassourdine', lastName: 'Imavov', nickname: '', age: 29, height: 76, weight: 185, reach: 76, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 2, wins: 15, losses: 4 },
  { firstName: 'Sean', lastName: 'Strickland', nickname: 'Tarzan', age: 34, height: 73, weight: 185, reach: 76, stance: 'Orthodox', style: 'boxer', weightClass: 'middleweight', rank: 3, wins: 29, losses: 6 },
  { firstName: 'Anthony', lastName: 'Hernandez', nickname: 'Fluffy', age: 31, height: 73, weight: 185, reach: 77, stance: 'Orthodox', style: 'wrestler', weightClass: 'middleweight', rank: 4, wins: 13, losses: 2 },
  { firstName: 'Brendan', lastName: 'Allen', nickname: 'All In', age: 29, height: 73, weight: 185, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'middleweight', rank: 5, wins: 24, losses: 6 },
  { firstName: 'Israel', lastName: 'Adesanya', nickname: 'The Last Stylebender', age: 36, height: 76, weight: 185, reach: 80, stance: 'Switch', style: 'muay_thai', weightClass: 'middleweight', rank: 6, wins: 24, losses: 4 },
  { firstName: 'Caio', lastName: 'Borralho', nickname: 'The Natural', age: 32, height: 73, weight: 185, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 7, wins: 17, losses: 1 },
  { firstName: 'Reinier', lastName: 'De Ridder', nickname: 'The Dutch Knight', age: 34, height: 76, weight: 185, reach: 77, stance: 'Orthodox', style: 'bjj', weightClass: 'middleweight', rank: 8, wins: 18, losses: 2 },
  { firstName: 'Robert', lastName: 'Whittaker', nickname: 'The Reaper', age: 34, height: 72, weight: 185, reach: 73, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 9, wins: 26, losses: 8 },
  { firstName: 'Jared', lastName: 'Cannonier', nickname: 'The Killa Gorilla', age: 41, height: 71, weight: 185, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 10, wins: 17, losses: 8 },
  { firstName: 'Michael', lastName: 'Page', nickname: 'Venom', age: 38, height: 75, weight: 185, reach: 78, stance: 'Southpaw', style: 'muay_thai', weightClass: 'middleweight', rank: 11, wins: 23, losses: 3 },
  { firstName: 'Roman', lastName: 'Dolidze', nickname: 'The Caucasian', age: 37, height: 75, weight: 185, reach: 76, stance: 'Orthodox', style: 'wrestler', weightClass: 'middleweight', rank: 12, wins: 13, losses: 3 },
  { firstName: 'Paulo', lastName: 'Costa', nickname: 'The Eraser', age: 34, height: 72, weight: 185, reach: 72, stance: 'Orthodox', style: 'muay_thai', weightClass: 'middleweight', rank: 13, wins: 14, losses: 3 },
  { firstName: 'Gregory', lastName: 'Rodrigues', nickname: 'Robocop', age: 32, height: 73, weight: 185, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 14, wins: 16, losses: 6 },
  { firstName: 'Joe', lastName: 'Pyfer', nickname: 'Bodybagz', age: 28, height: 73, weight: 185, reach: 74, stance: 'Orthodox', style: 'mma', weightClass: 'middleweight', rank: 15, wins: 13, losses: 3 },

  // LIGHT HEAVYWEIGHT (205 lbs)
  { firstName: 'Alex', lastName: 'Pereira', nickname: 'Poatan', age: 37, height: 76, weight: 205, reach: 79, stance: 'Orthodox', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 0, isChampion: true, wins: 13, losses: 3 },
  { firstName: 'Jiri', lastName: 'Prochazka', nickname: 'Denisa', age: 33, height: 76, weight: 205, reach: 80, stance: 'Orthodox', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 1, wins: 31, losses: 5 },
  { firstName: 'Magomed', lastName: 'Ankalaev', nickname: '', age: 33, height: 75, weight: 205, reach: 75, stance: 'Orthodox', style: 'wrestler', weightClass: 'light_heavyweight', rank: 2, wins: 20, losses: 1 },
  { firstName: 'Carlos', lastName: 'Ulberg', nickname: 'Black Jag', age: 34, height: 74, weight: 205, reach: 78, stance: 'Switch', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 3, wins: 12, losses: 1 },
  { firstName: 'Khalil', lastName: 'Rountree Jr', nickname: 'The War Horse', age: 35, height: 71, weight: 205, reach: 77, stance: 'Orthodox', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 4, wins: 14, losses: 6 },
  { firstName: 'Jan', lastName: 'Blachowicz', nickname: 'Prince of Cieszyn', age: 42, height: 74, weight: 205, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 5, wins: 30, losses: 11 },
  { firstName: 'Azamat', lastName: 'Murzakanov', nickname: '', age: 34, height: 73, weight: 205, reach: 75, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 6, wins: 14, losses: 0 },
  { firstName: 'Jamahal', lastName: 'Hill', nickname: 'Sweet Dreams', age: 34, height: 76, weight: 205, reach: 79, stance: 'Orthodox', style: 'boxer', weightClass: 'light_heavyweight', rank: 7, wins: 12, losses: 2 },
  { firstName: 'Volkan', lastName: 'Oezdemir', nickname: 'No Time', age: 36, height: 74, weight: 205, reach: 75, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 8, wins: 20, losses: 7 },
  { firstName: 'Dominick', lastName: 'Reyes', nickname: 'The Devastator', age: 35, height: 76, weight: 205, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 9, wins: 13, losses: 5 },
  { firstName: 'Bogdan', lastName: 'Guskov', nickname: '', age: 35, height: 74, weight: 205, reach: 76, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 10, wins: 17, losses: 3 },
  { firstName: 'Aleksandar', lastName: 'Rakic', nickname: 'Rocket', age: 33, height: 76, weight: 205, reach: 78, stance: 'Southpaw', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 11, wins: 14, losses: 4 },
  { firstName: 'Johnny', lastName: 'Walker', nickname: '', age: 33, height: 77, weight: 205, reach: 82, stance: 'Southpaw', style: 'muay_thai', weightClass: 'light_heavyweight', rank: 12, wins: 22, losses: 9 },
  { firstName: 'Nikita', lastName: 'Krylov', nickname: 'The Miner', age: 33, height: 75, weight: 205, reach: 79, stance: 'Southpaw', style: 'bjj', weightClass: 'light_heavyweight', rank: 13, wins: 31, losses: 11 },
  { firstName: 'Zhang', lastName: 'Mingyang', nickname: '', age: 28, height: 75, weight: 205, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 14, wins: 19, losses: 7 },
  { firstName: 'Alonzo', lastName: 'Menifield', nickname: 'Atomic', age: 37, height: 73, weight: 205, reach: 79, stance: 'Orthodox', style: 'mma', weightClass: 'light_heavyweight', rank: 15, wins: 16, losses: 5 },

  // HEAVYWEIGHT (265 lbs)
  { firstName: 'Tom', lastName: 'Aspinall', nickname: '', age: 32, height: 77, weight: 255, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 0, isChampion: true, wins: 15, losses: 3 },
  { firstName: 'Ciryl', lastName: 'Gane', nickname: 'Bon Gamin', age: 35, height: 76, weight: 247, reach: 81, stance: 'Switch', style: 'muay_thai', weightClass: 'heavyweight', rank: 1, wins: 12, losses: 2 },
  { firstName: 'Alexander', lastName: 'Volkov', nickname: 'Drago', age: 36, height: 79, weight: 255, reach: 80, stance: 'Orthodox', style: 'muay_thai', weightClass: 'heavyweight', rank: 2, wins: 38, losses: 11 },
  { firstName: 'Sergei', lastName: 'Pavlovich', nickname: '', age: 33, height: 75, weight: 260, reach: 84, stance: 'Orthodox', style: 'boxer', weightClass: 'heavyweight', rank: 3, wins: 18, losses: 3 },
  { firstName: 'Curtis', lastName: 'Blaydes', nickname: 'Razor', age: 34, height: 76, weight: 265, reach: 80, stance: 'Orthodox', style: 'wrestler', weightClass: 'heavyweight', rank: 4, wins: 18, losses: 5 },
  { firstName: 'Waldo', lastName: 'Cortes Acosta', nickname: '', age: 30, height: 75, weight: 260, reach: 76, stance: 'Orthodox', style: 'wrestler', weightClass: 'heavyweight', rank: 5, wins: 13, losses: 1 },
  { firstName: 'Jailton', lastName: 'Almeida', nickname: 'Malhadinho', age: 33, height: 75, weight: 240, reach: 78, stance: 'Orthodox', style: 'bjj', weightClass: 'heavyweight', rank: 6, wins: 21, losses: 3 },
  { firstName: 'Serghei', lastName: 'Spivac', nickname: 'The Polar Bear', age: 30, height: 75, weight: 245, reach: 75, stance: 'Orthodox', style: 'bjj', weightClass: 'heavyweight', rank: 7, wins: 17, losses: 4 },
  { firstName: 'Derrick', lastName: 'Lewis', nickname: 'The Black Beast', age: 40, height: 75, weight: 265, reach: 79, stance: 'Orthodox', style: 'boxer', weightClass: 'heavyweight', rank: 8, wins: 28, losses: 12 },
  { firstName: 'Ante', lastName: 'Delija', nickname: '', age: 36, height: 77, weight: 260, reach: 79, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 9, wins: 24, losses: 6 },
  { firstName: 'Marcin', lastName: 'Tybura', nickname: 'Tybur', age: 39, height: 75, weight: 250, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 10, wins: 25, losses: 9 },
  { firstName: 'Shamil', lastName: 'Gaziev', nickname: '', age: 33, height: 75, weight: 260, reach: 76, stance: 'Orthodox', style: 'wrestler', weightClass: 'heavyweight', rank: 11, wins: 13, losses: 1 },
  { firstName: 'Tai', lastName: 'Tuivasa', nickname: 'Bam Bam', age: 32, height: 74, weight: 265, reach: 75, stance: 'Orthodox', style: 'boxer', weightClass: 'heavyweight', rank: 12, wins: 15, losses: 8 },
  { firstName: 'Mick', lastName: 'Parkin', nickname: '', age: 29, height: 77, weight: 260, reach: 78, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 13, wins: 10, losses: 0 },
  { firstName: 'Valter', lastName: 'Walker', nickname: '', age: 28, height: 76, weight: 255, reach: 77, stance: 'Orthodox', style: 'mma', weightClass: 'heavyweight', rank: 14, wins: 12, losses: 2 },
  { firstName: 'Tallison', lastName: 'Teixeira', nickname: '', age: 30, height: 74, weight: 250, reach: 75, stance: 'Orthodox', style: 'bjj', weightClass: 'heavyweight', rank: 15, wins: 10, losses: 2 },
];

async function seedFighters() {
  console.log('Starting fighter seed...');
  console.log(`Total fighters to seed: ${fighters.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const fighterData of fighters) {
    try {
      // Create fighter using game utils with UUID
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
          points: {} // Real fighters get base attributes from their style
        },
        SYSTEM_USER_ID
      );

      // Override with real fighter data and UUID
      const fighter = {
        ...baseFighter,
        id: fighterId,
        wins: fighterData.wins,
        losses: fighterData.losses,
        rank: fighterData.rank === 0 ? undefined : fighterData.rank,
        is_champion: fighterData.isChampion || false,
        money: 100000 + (fighterData.rank === 0 ? 500000 : (15 - fighterData.rank) * 25000),
        training_points: 10,
        popularity: 50 + (15 - fighterData.rank) * 3,
      };

      // Insert into database
      const { error } = await supabase
        .from('fighters')
        .insert(fighter);

      if (error) {
        console.error(`Error seeding ${fighterData.firstName} ${fighterData.lastName}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Seeded: ${fighterData.firstName} ${fighterData.lastName} (${fighterData.weightClass})`);
        successCount++;
      }
    } catch (err) {
      console.error(`Exception seeding ${fighterData.firstName} ${fighterData.lastName}:`, err);
      errorCount++;
    }
  }

  console.log('\n=== Seed Summary ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${fighters.length}`);
}

// Run the seed
seedFighters()
  .then(() => {
    console.log('\nSeed completed!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nSeed failed:', err);
    process.exit(1);
  });
