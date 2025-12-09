// lib/contracts.ts

// Indirizzo del contratto Arcade su Chiliz Spicy Testnet (Esempio)
// Quando farai il deploy vero, sostituirai questa stringa.
export const ARCADE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

export const ARCADE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_opponent", "type": "address" },
      { "internalType": "uint256", "name": "_gameId", "type": "uint256" }
    ],
    "name": "createChallenge",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // 🟢 AGGIUNTO: Funzione per reclamare la vittoria
  {
    "inputs": [
      { "internalType": "string", "name": "_challengeId", "type": "string" }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;