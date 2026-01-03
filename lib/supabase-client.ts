import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fighter type
export interface Fighter {
  id: string;
  owner_id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  age: number;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  style: string;
  style_name: string;
  style_icon: string;
  weight_class: string;
  attributes: Record<string, number>;
  wins: number;
  losses: number;
  draws: number;
  ko_wins: number;
  sub_wins: number;
  dec_wins: number;
  money: number;
  training_points: number;
  popularity: number;
  rank?: number;
  is_champion: boolean;
  injury?: string;
  injury_weeks: number;
  created_at: string;
}

// Challenge type
export interface Challenge {
  id: string;
  challenger_id: string;
  challenger_fighter_id: string;
  challenger_name: string;
  defender_id: string;
  defender_fighter_id: string;
  defender_name: string;
  weight_class: string;
  status: "pending" | "done" | "declined";
  created_at: string;
}

// Auth functions
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

// Fighter functions
export async function createFighter(fighter: Omit<Fighter, "created_at">) {
  return supabase.from("fighters").insert(fighter);
}

export async function getFighters(userId: string) {
  return supabase.from("fighters").select("*").eq("owner_id", userId);
}

export async function getFighterById(id: string) {
  return supabase.from("fighters").select("*").eq("id", id).single();
}

export async function updateFighter(id: string, updates: Partial<Fighter>) {
  return supabase.from("fighters").update(updates).eq("id", id);
}

export async function getRankings(weightClass: string) {
  return supabase
    .from("fighters")
    .select("*")
    .eq("weight_class", weightClass)
    .order("wins", { ascending: false })
    .order("losses", { ascending: true })
    .limit(25);
}

// Challenge functions
export async function createChallenge(challenge: Omit<Challenge, "created_at">) {
  return supabase.from("challenges").insert(challenge);
}

export async function getChallenges(userId: string) {
  return supabase
    .from("challenges")
    .select("*")
    .eq("defender_id", userId)
    .eq("status", "pending");
}

export async function updateChallenge(id: string, status: Challenge["status"]) {
  return supabase.from("challenges").update({ status }).eq("id", id);
}

export async function deleteChallenge(id: string) {
  return supabase.from("challenges").delete().eq("id", id);
}

// Subscribe to real-time updates
export function subscribeToFighters(userId: string, callback: () => void) {
  return supabase
    .channel(`fighters:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "fighters",
        filter: `owner_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToChallenges(userId: string, callback: () => void) {
  return supabase
    .channel(`challenges:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "challenges",
        filter: `defender_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}
