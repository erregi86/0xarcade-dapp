'use client';

import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';

interface Props {
  onRunGame: () => void;
}

export function BettingControls({ onRunGame }: Props) {
  const { address } = useAccount();
  const [betAmount, setBetAmount] = useState('10'); // Default 10 CHZ

  const { data: hash, sendTransaction, isPending, error: sendError } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onRunGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onRunGame]);

  const handleBet = async () => {
    if (!address) {
        // Se non c'è indirizzo, il parent component (GamePage) intercetta e apre il wallet.
        // Qui chiamiamo comunque onRunGame per innescare quella logica nel parent.
        onRunGame(); 
        return;
    }

    // Invia a se stesso per test (in produzione sarà lo Smart Contract)
    const targetAddress = address; 

    try {
      sendTransaction({
        to: targetAddress,
        value: parseEther(betAmount),
      });
    } catch (e) {
      console.error("Bet Error:", e);
    }
  };

  return (
    <div className="w-full">
      
      <div className="mb-6">
        <label className="block text-xs mb-3 opacity-70 tracking-widest text-[#00ff41]">STAKE AMOUNT (CHZ)</label>
        <div className="grid grid-cols-4 gap-2">
          {['10', '50', '100', '500'].map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={`border py-2 text-sm font-bold transition-all ${
                betAmount === amount 
                  ? 'bg-[#00ff41] text-black border-[#00ff41]' 
                  : 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/20'
              }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
          <label className="block text-xs mb-2 opacity-70 tracking-widest text-[#00ff41]">MANUAL INPUT</label>
          <div className="flex items-center border border-[#00ff41] bg-black">
              <input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-transparent text-[#00ff41] p-3 w-full outline-none font-mono font-bold"
              />
              <span className="pr-4 text-xs font-bold text-[#00ff41]">CHZ</span>
          </div>
      </div>

      {/* BOTTONE CON HOVER CORRETTO */}
      <button 
        onClick={handleBet} 
        disabled={isPending || isConfirming || isSuccess}
        className={`
            w-full py-4 font-bold tracking-widest transition-all uppercase border border-[#00ff41]
            ${isSuccess 
                ? 'bg-[#00ff41] text-black cursor-default' 
                : 'bg-transparent text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
            }
            ${(isPending || isConfirming) ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        {isPending ? 'CHECK WALLET...' : isConfirming ? 'PROCESSING...' : isSuccess ? 'ACCESS GRANTED' : 'INITIATE CONTRACT'}
      </button>

      {/* Status Logs (Corretti con &gt;&gt;) */}
      <div className="mt-4 min-h-[20px] text-[10px] font-mono text-center">
        {hash && <p className="text-gray-400 truncate">TX: {hash}</p>}
        {isSuccess && <p className="text-[#00ff41] animate-pulse">&gt;&gt; TRANSACTION CONFIRMED. LOADING...</p>}
        {sendError && <p className="text-[#ff003c]">&gt;&gt; ERROR: {sendError.message.split('\n')[0]}</p>}
      </div>
    </div>
  );
}