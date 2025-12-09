'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Activity, TrendingUp, Skull, Zap } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getUserProfile, UserProfile } from '../../lib/db';

export function StatsPage() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (address) {
      getUserProfile(address).then(({ data }) => setProfile(data));
    }
  }, [address]);

  if (!isConnected) return <div className="p-10 text-center text-[#00ff41]">CONNECT WALLET TO VIEW DOSSIER</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 md:p-8 text-[#00ff41] font-mono max-w-6xl mx-auto"
    >
      <div className="mb-8 border-l-4 border-[#00ff41] pl-6 py-2 flex justify-between items-end">
        <div>
            <h2 className="mb-2 tracking-wider font-bold text-2xl">NEURAL ANALYTICS</h2>
            <p className="text-xs opacity-70">OPERATIVE DOSSIER: {profile?.username || 'UNKNOWN'}</p>
        </div>
        <div className="text-4xl font-bold border border-[#00ff41] px-4 py-2 bg-[#00ff41]/10">
            LVL {profile?.level || 1}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "TOTAL XP", value: profile?.xp || 0, icon: Zap },
          { label: "GAMES PLAYED", value: profile?.games_played || 0, icon: Activity },
          { label: "TOTAL WON (CHZ)", value: profile?.total_won || 0, icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="border border-[#00ff41] p-6 bg-[#00ff41]/5 relative overflow-hidden group hover:bg-[#00ff41]/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <stat.icon size={64} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <stat.icon size={24} className="opacity-80" />
              <div className="text-[10px] opacity-60">ID: {i + 1}0{i + 1}</div>
            </div>
            <div className="text-4xl font-bold mb-1 tracking-tighter relative z-10">{stat.value}</div>
            <div className="text-[10px] opacity-70 tracking-widest relative z-10">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* High Scores Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-[#00ff41] p-6 bg-[#050505]">
             <h3 className="text-xl font-bold mb-6 border-b border-[#00ff41]/30 pb-2">HIGH SCORES</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span>CYBER RUNNER</span>
                    <span className="font-bold text-xl">{profile?.high_score_runner || 0}</span>
                </div>
                <div className="w-full h-1 bg-[#00ff41]/20"><div style={{width: `${Math.min(100, (profile?.high_score_runner||0)/10)}%`}} className="h-full bg-[#00ff41]"></div></div>
                
                <div className="flex justify-between items-center">
                    <span>CYBER FLAP</span>
                    <span className="font-bold text-xl">{profile?.high_score_flappy || 0}</span>
                </div>
                <div className="w-full h-1 bg-[#00ff41]/20"><div style={{width: `${Math.min(100, (profile?.high_score_flappy||0)/5)}%`}} className="h-full bg-[#00ff41]"></div></div>

                <div className="flex justify-between items-center">
                    <span>DATA BREAKER</span>
                    <span className="font-bold text-xl">{profile?.high_score_breaker || 0}</span>
                </div>
                <div className="w-full h-1 bg-[#00ff41]/20"><div style={{width: `${Math.min(100, (profile?.high_score_breaker||0)/5)}%`}} className="h-full bg-[#00ff41]"></div></div>
             </div>
          </div>

          <div className="border border-[#00ff41] p-6 bg-[#00ff41]/5 flex items-center justify-center text-center opacity-70 border-dashed">
             <div>
                <Skull size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-bold">PVP HISTORY</h3>
                <p className="text-xs">NO COMBAT DATA FOUND</p>
             </div>
          </div>
      </div>
    </motion.div>
  );
}