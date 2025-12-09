import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem'; // 🟢 CHANGE: Import from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'; // Keep this if you need other chains, or remove if unused.

// 1. Define the Chiliz Spicy Testnet
export const spicy = defineChain({
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Chiliz',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: { http: ['https://spicy-rpc.chiliz.com/'] },
    public: { http: ['https://spicy-rpc.chiliz.com/'] }, // Added 'public' key which is often required
  },
  blockExplorers: {
    default: { name: 'Chiliscan', url: 'http://spicy-explorer.chiliz.com/' },
  },
  testnet: true,
});

// 2. Create the config
export const config = createConfig({
  chains: [spicy],
  transports: {
    [spicy.id]: http(),
  },
});