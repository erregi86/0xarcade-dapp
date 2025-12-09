'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';

export function CyberConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal} 
                    className="bg-[#00ff41] text-black border border-[#00ff41] px-6 py-2 text-xs font-bold hover:bg-black hover:text-[#00ff41] transition-all uppercase tracking-widest clip-hud flex items-center gap-2"
                  >
                    <Wallet size={14} /> CONNECT
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="text-red-500 border border-red-500 px-4 py-2 font-bold animate-pulse">
                    WRONG NETWORK
                  </button>
                );
              }

              return (
                <div className="flex gap-2">
                  <button 
                    onClick={openChainModal} 
                    className="hidden md:flex items-center px-3 py-2 border border-[#00ff41]/50 bg-[#00ff41]/5 text-[#00ff41] font-mono text-xs"
                  >
                    {chain.name}
                  </button>
                  <button 
                    onClick={openAccountModal} 
                    className="flex items-center gap-2 px-4 py-2 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all font-mono text-xs font-bold"
                  >
                    {account.displayName}
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_8px_#00ff41]"></div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}