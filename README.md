# 0xArcade Protocol 🕹️

![Status](https://img.shields.io/badge/SYSTEM-ONLINE-00ff41?style=for-the-badge&labelColor=050505)
![Stack](https://img.shields.io/badge/NEXT.JS-16-00ff41?style=for-the-badge&labelColor=050505)
![License](https://img.shields.io/badge/LICENSE-MIT-00ff41?style=for-the-badge&labelColor=050505)

**0xArcade** is a decentralized application (dApp) built on the Chiliz Chain that allows users to compete in skill-based arcade games for crypto rewards. Unlike traditional gaming platforms, 0xArcade features a hybrid Web2.5 architecture, combining the speed of a centralized database for real-time matchmaking and leaderboards with the security of blockchain for wagers and payouts.

Operatives can connect their wallets, build their reputation on the global leaderboard, and issue direct PVP Challenges to other players, staking $CHZ on the outcome.

> **// SYSTEM MESSAGE:** > Welcome to the grid. The protocol connects nostalgic arcade visuals with modern on-chain liquidity.

## ⚡ Key Features

### 🎮 Tactical Arcade Suite
Three distinct game modules tuned for progressive difficulty and competitive play:
* **NET RUNNER**: High-velocity endless runner. Dodge firewalls, increase speed, survive the grid.
* **CYBER FLAP**: Precision flight simulator with dynamic gap narrowing.
* **DATA BREAKER**: A tactical brick-breaker with keyboard/mouse dual control and multi-level progression.

### 🖥️ Cyberpunk Terminal UI
A custom design system built on **Tailwind CSS**, strictly adhering to the `#00ff41` (Neon Green) and `#050505` (Void Black) palette. Features include CRT flicker effects, monospace typography, and high-contrast accessibility.

### 📊 Tactical Dashboard (Clearance Lvl 1)
Military-grade analytics interface for tracking protocol metrics:
* **Tactical Grid Layout:** HUD-style borders and decorative elements.
* **Live System Logs:** Simulated terminal feeds providing immersive feedback.
* **Real-time Stats:** Active operatives, block height, and network volume.

### 🧭 Advanced Navigation
* **Responsive Sidebar:** Collapsible mobile menu with backdrop blur.
* **Live Alerts:** Dynamic **[NEW]** pulsing tags to highlight recent feature drops (e.g., Leaderboard).
* **Smooth Routing:** Powered by Next.js App Router.

### 🔗 Web3 Native
* **Wagmi Integration:** Full hook support for wallet connection and state management.
* **Smart Contract Interaction:** (Coming Soon) Direct interaction with Arcade Protocol contracts.

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript (`.tsx`)
* **Styling:** Tailwind CSS + Lucide React Icons
* **Blockchain:** Wagmi / Viem
* **Fonts:** 'Press Start 2P' (Headers) & Monospace (Body)

## 🚀 Getting Started

Initialize the protocol locally:

```bash
# 1. Clone the repository
git clone [https://github.com/erregi86/0xarcade-dapp.git](https://github.com/erregi86/0xarcade-dapp.git)

# 2. Enter the directory
cd 0xarcade-dapp

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev