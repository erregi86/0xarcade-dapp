'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { darkTheme } from '@rainbow-me/rainbowkit';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { defineChain } from 'viem';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const spicyTestnet = defineChain({
  id: 88882,
  name: 'Chiliz Spicy',
  nativeCurrency: { name: 'Chiliz', symbol: 'CHZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://spicy-rpc.chiliz.com/'] },
  },
  blockExplorers: {
    default: { name: 'Chiliscan', url: 'http://spicy-explorer.chiliz.com/' },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: '0xArcade',
  projectId: 'YOUR_PROJECT_ID', 
  chains: [spicyTestnet],
  ssr: true, 
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
       <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#00ff41',        // Verde Neon
            accentColorForeground: 'black', // Testo nero su verde
            borderRadius: 'none',          // 🟢 FONDAMENTALE: Zero curve
            fontStack: 'system',
            overlayBlur: 'small',          // Blur sullo sfondo
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}