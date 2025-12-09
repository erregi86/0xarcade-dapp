'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { getUserProfile, updateUsername } from '../../lib/db'; // Ensure this path is correct
import { Save, User, Shield } from 'lucide-react';

export function SettingsPage() {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Fetch current profile on mount
  useEffect(() => {
    if (address) {
      getUserProfile(address).then(({ data }) => {
        if (data && data.username) setUsername(data.username);
      });
    }
  }, [address]);

  const handleSave = async () => {
    if (!address || !username) return;
    setLoading(true);
    try {
      await updateUsername(address, username);
      setMsg('IDENTITY UPDATED SUCCESSFULLY');
      // Optional: Emit a custom event if you need immediate update elsewhere without reload
      // window.dispatchEvent(new Event('profileUpdated')); 
    } catch (e) {
      console.error(e);
      setMsg('ERROR UPDATING IDENTITY');
    }
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="p-8 text-[#00ff41] font-mono text-center border border-[#00ff41]/30 mt-10 bg-black">
        SYSTEM LOCKED. CONNECT WALLET TO ACCESS CONFIG.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 md:p-8 text-[#00ff41] font-mono max-w-4xl mx-auto"
    >
      <div className="mb-8 border-l-4 border-[#00ff41] pl-6 py-2">
        <h2 className="mb-2 tracking-wider font-bold text-2xl">SYSTEM CONFIGURATION</h2>
        <p className="text-xs opacity-70">IDENTITY // SECURITY // PREFERENCES</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Identity Section */}
        <section className="border border-[#00ff41] p-6 bg-[#050505] relative">
          <div className="flex items-center gap-3 mb-6 border-b border-[#00ff41]/30 pb-4">
            <User />
            <h3 className="text-lg font-bold">OPERATIVE IDENTITY</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs opacity-70 mb-2 block tracking-widest">CODENAME</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER_CODENAME"
                className="w-full bg-[#00ff41]/5 border border-[#00ff41]/50 p-3 text-[#00ff41] focus:outline-none focus:border-[#00ff41] placeholder-[#00ff41]/30 font-bold font-mono"
              />
            </div>
            
            <div className="text-[10px] text-gray-500 font-mono border border-gray-800 p-2 bg-black">
              LINKED WALLET: <br/>
              <span className="text-[#00ff41]">{address}</span>
            </div>

            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 mt-4 border border-[#00ff41] bg-[#00ff41] text-black font-bold hover:bg-black hover:text-[#00ff41] transition-all uppercase tracking-widest clip-hud flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {loading ? 'SAVING...' : 'SAVE CONFIG'}
            </button>
            
            {msg && (
              <div className="text-xs text-center mt-2 p-2 border border-[#00ff41]/30 bg-[#00ff41]/10 animate-pulse">
                {'>'} {msg}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="border border-[#00ff41]/50 p-6 bg-[#00ff41]/5">
          <div className="flex items-center gap-3 mb-6 border-b border-[#00ff41]/30 pb-4">
            <Shield />
            <h3 className="text-lg font-bold">SECURITY CLEARANCE</h3>
          </div>
          <div className="space-y-4 text-xs leading-relaxed font-mono text-gray-400">
            <p>Your identity is cryptographically linked to your Chiliz Wallet address.</p>
            <p>This codename will be displayed on the Global Leaderboard and during PvP matches.</p>
            <div className="mt-4 p-4 border border-dashed border-[#00ff41]/50 text-[#00ff41]">
                STATUS: <span className="font-bold">VERIFIED</span><br/>
                CLEARANCE: <span className="font-bold">LEVEL 1</span>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}