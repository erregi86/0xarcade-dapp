'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Medal } from 'lucide-react';
import { getLeaderboard } from '../../lib/db';

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carica dati reali
    getLeaderboard().then(({ data }) => {
      if (data) setLeaders(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 md:p-8 text-[#00ff41] font-mono max-w-6xl mx-auto"
    >
      <div className="mb-8 border-l-4 border-[#00ff41] pl-6 py-2">
        <h2 className="mb-2 tracking-wider font-bold text-2xl">GLOBAL RANKINGS</h2>
        <p className="text-xs opacity-70">ELITE OPERATIVES // TOP XP HOLDERS</p>
      </div>

      <div className="border border-[#00ff41] bg-[#050505] relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-xl animate-pulse">LOADING DATA...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#00ff41] bg-[#00ff41]/10 text-xs tracking-wider">
                  <th className="p-4">RANK</th>
                  <th className="p-4">OPERATIVE</th>
                  <th className="p-4">LEVEL</th>
                  <th className="p-4 text-right">XP</th>
                  <th className="p-4 text-right">TOTAL WON (CHZ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff41]/20">
                {leaders.map((user, index) => (
                  <tr 
                    key={user.wallet_address}
                    className="hover:bg-[#00ff41]/5 transition-colors group"
                  >
                    <td className="p-4 font-bold">
                      {index === 0 ? <Trophy className="text-yellow-400" size={20} /> :
                       index === 1 ? <Medal className="text-gray-400" size={20} /> :
                       index === 2 ? <Medal className="text-amber-700" size={20} /> :
                       `#${String(index + 1).padStart(2, '0')}`}
                    </td>
                    <td className="p-4 font-mono flex items-center gap-3">
                      <div className="w-8 h-8 border border-[#00ff41] flex items-center justify-center bg-[#00ff41]/10 rounded-sm">
                        <User size={14} />
                      </div>
                      <span className={user.username ? "text-white" : "text-gray-500"}>
                        {user.username || `${user.wallet_address.slice(0,6)}...`}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">LVL {user.level}</td>
                    <td className="p-4 text-right font-bold tracking-widest">{user.xp.toLocaleString()}</td>
                    <td className="p-4 text-right opacity-80">{user.total_won || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}