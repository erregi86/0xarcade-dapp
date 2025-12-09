import { supabase } from './supabase';

// --- TIPI ---
export interface UserProfile {
  wallet_address: string;
  username: string | null;
  xp: number;
  level: number;
  games_played: number;
  total_won: number; // Numero vittorie o CHZ vinti? Assumiamo vittorie per il winrate
  total_wagered: number;
  high_score_runner: number;
  high_score_flappy: number;
  high_score_breaker: number;
}

export interface Challenge {
  id: string;
  created_at: string;
  challenger_address: string;
  target_address: string;
  game_id: string;
  wager_amount: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

// --- 1. GESTIONE UTENTE & PUNTEGGI (Tua logica originale) ---

export async function saveGameScore(wallet: string, gameId: number, score: number) {
  if (!wallet) return;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', wallet)
    .single();

  if (!user) {
    // Se l'utente non esiste, lo creiamo
    await supabase.from('users').insert([{ wallet_address: wallet }]);
  }

  let columnToUpdate = '';
  if (gameId === 1) columnToUpdate = 'high_score_runner';
  if (gameId === 2) columnToUpdate = 'high_score_flappy';
  if (gameId === 3) columnToUpdate = 'high_score_breaker';

  // Calcolo XP: Base + Score (Tua formula)
  const xpGained = 10 + Math.floor(score / 5);
  const currentXp = (user?.xp || 0) + xpGained;
  const newLevel = Math.floor(currentXp / 1000) + 1;

  const updates: any = {
    games_played: (user?.games_played || 0) + 1,
    xp: currentXp,
    level: newLevel,
  };

  // Aggiorna High Score solo se superato
  if (columnToUpdate && score > (user?.[columnToUpdate] || 0)) {
    updates[columnToUpdate] = score;
  }

  await supabase.from('users').update(updates).eq('wallet_address', wallet);
}

export async function updateUsername(wallet: string, newName: string) {
  const { error } = await supabase
    .from('users')
    .update({ username: newName })
    .eq('wallet_address', wallet);
  
  if (error) throw error;
}

export async function getUserProfile(wallet: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', wallet)
    .single();
  
  return { data, error };
}

// --- 2. LEADERBOARD (Adattata per il Frontend) ---
export async function getLeaderboard() {
  // Prende i top 50 ordinati per XP (che usiamo come "Score" principale per il ranking)
  const { data, error } = await supabase
    .from('users')
    .select('username, wallet_address, xp, level, games_played, total_won')
    .order('xp', { ascending: false })
    .limit(20);
    
  // Mapping per il frontend (opzionale, ma utile per standardizzare)
  // Il frontend si aspetta: { address, username, score, winRate, status }
  const formattedData = data?.map(user => {
    // Calcolo WinRate approssimativo
    const wr = user.games_played > 0 
      ? Math.round((user.total_won / user.games_played) * 100) 
      : 0;

    return {
      wallet_address: user.wallet_address,
      username: user.username,
      score: user.xp, // Usiamo XP come punteggio classifica
      win_rate: wr,
      status: 'online' // Placeholder, o implementa logica 'last_seen'
    };
  });

  return { data: formattedData, error };
}

// --- 3. CHALLENGE SYSTEM (Nuove Funzioni) ---

// Crea una sfida
export async function createChallengeDB(challenger: string, target: string, game: string, wager: string) {
  return await supabase.from('challenges').insert({
    challenger_address: challenger,
    target_address: target,
    game_id: game,
    wager_amount: wager,
    status: 'pending'
  });
}

// Scarica le sfide in arrivo (Pending)
export async function getPendingChallenges(myAddress: string) {
  return await supabase
    .from('challenges')
    .select('*')
    .eq('target_address', myAddress)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
}

// Rispondi alla sfida (Accept/Decline)
export async function respondToChallenge(id: string, status: 'accepted' | 'declined') {
  return await supabase
    .from('challenges')
    .update({ status })
    .eq('id', id);
}