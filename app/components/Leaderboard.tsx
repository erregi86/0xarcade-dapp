'use client';

// Dati finti per simulare la classifica
const FAKE_DATA = [
  { rank: 1, user: '0x71...8A22', score: '9,450', win: '450 CHZ' },
  { rank: 2, user: '0x33...B1C9', score: '8,200', win: '320 CHZ' },
  { rank: 3, user: '0xAA...9001', score: '7,890', win: '150 CHZ' },
  { rank: 4, user: 'YOU', score: '0', win: '0 CHZ' }, // Placeholder per l'utente
  { rank: 5, user: '0x11...FFFF', score: '6,500', win: '50 CHZ' },
];

export default function Leaderboard({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-end mb-6 border-b border-cyber-green pb-2">
        <h2 className="text-4xl font-pixel text-white neon-text">GLOBAL RANKING</h2>
        <button onClick={onClose} className="text-sm text-cyber-green hover:underline">&lt;&lt; BACK TO LOBBY</button>
      </div>

      <div className="border border-cyber-green bg-cyber-dark/80 p-1">
        <table className="w-full text-left font-tech">
          <thead className="bg-cyber-green text-black">
            <tr>
              <th className="p-3">RANK</th>
              <th className="p-3">OPERATOR</th>
              <th className="p-3">HIGH SCORE</th>
              <th className="p-3 text-right">TOTAL WON</th>
            </tr>
          </thead>
          <tbody>
            {FAKE_DATA.map((item, index) => (
              <tr key={index} className="border-b border-cyber-green/20 hover:bg-cyber-green/10 transition-colors">
                <td className="p-4 font-bold text-cyber-green">#{item.rank}</td>
                <td className="p-4 font-mono text-white">{item.user}</td>
                <td className="p-4 text-cyber-greenDim">{item.score}</td>
                <td className="p-4 text-right text-white">{item.win}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-cyber-greenDim font-mono text-center">
         * LEADERBOARD RESETS EVERY 24H. TOP 3 WALLETS RECEIVE AIRDROP.
      </div>
    </div>
  );
}