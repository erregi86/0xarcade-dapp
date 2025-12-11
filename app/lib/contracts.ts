// lib/contracts.ts

// ⚠️ IMPORTANTE: Sostituisci questa stringa con l'address copiato da Remix dopo il deploy!
export const ARCADE_CONTRACT_ADDRESS = "0x3de20218FBDE6aDe713cC7F1287c836C86754Ec4"; 

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
  {
    "inputs": [
      { "internalType": "uint256", "name": "_challengeId", "type": "uint256" }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Eventi (Utili per il futuro, li lasciamo per completezza)
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "challengeId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "challenger", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "opponent", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "wager", "type": "uint256" }
    ],
    "name": "ChallengeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "challengeId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "RewardClaimed",
    "type": "event"
  }
] as const;