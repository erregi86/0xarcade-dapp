import { supabase } from './supabase';

// Tipi dati utente
export interface UserProfile {
  wallet_address: string;
  username: string | null;
  xp: number;
  level: number;
  games_played: number;
  total_won: number;
  total_wagered: number;
  high_score_runner: number;
  high_score_flappy: number;
  high_score_breaker: number;
}

// 1. Salva Punteggio (Già esistente, aggiornato)
export async function saveGameScore(wallet: string, gameId: number, score: number) {
  if (!wallet) return;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', wallet)
    .single();

  if (!user) {
    await supabase.from('users').insert([{ wallet_address: wallet }]);
  }

  let columnToUpdate = '';
  if (gameId === 1) columnToUpdate = 'high_score_runner';
  if (gameId === 2) columnToUpdate = 'high_score_flappy';
  if (gameId === 3) columnToUpdate = 'high_score_breaker';

  // Calcolo XP: Base + Score
  const xpGained = 10 + Math.floor(score / 5);
  
  // Calcolo Livello: Ogni 1000 XP sali di livello (formula semplice)
  const currentXp = (user?.xp || 0) + xpGained;
  const newLevel = Math.floor(currentXp / 1000) + 1;

  const updates: any = {
    games_played: (user?.games_played || 0) + 1,
    xp: currentXp,
    level: newLevel,
  };

  if (columnToUpdate && score > (user?.[columnToUpdate] || 0)) {
    updates[columnToUpdate] = score;
  }

  await supabase.from('users').update(updates).eq('wallet_address', wallet);
}

// 2. Aggiorna Username
export async function updateUsername(wallet: string, newName: string) {
  const { error } = await supabase
    .from('users')
    .update({ username: newName })
    .eq('wallet_address', wallet);
  
  if (error) throw error;
}

// 3. Ottieni Profilo Utente
export async function getUserProfile(wallet: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', wallet)
    .single();
  
  return { data, error };
}

// 4. Ottieni Leaderboard Globale
export async function getLeaderboard() {
  // Prende i top 50 per XP
  const { data, error } = await supabase
    .from('users')
    .select('username, wallet_address, xp, level, games_played, total_won')
    .order('xp', { ascending: false })
    .limit(50);
    
  return { data, error };
}