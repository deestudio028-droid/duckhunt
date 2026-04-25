# Duck Hunt Hand Edition

Studio-grade webcam arcade hunting built by **DeeStudio**. 

A completely modern, hands-free web game. Play directly in your browser using hand-tracking controls to aim and shoot—just point and pinch!

![DeeStudio Logo](assets/logo.png)

## Features

- **Gesture Control**: Aim with your index finger, shoot by pinching your thumb and index finger together. Fully driven by MediaPipe hand-tracking.
- **Multiple Game Modes**:
  - **Solo Mode**: Try to survive endless waves and get the highest score.
  - **Local Versus**: Play a passing turn-based match with a friend on the same device.
  - **Online Multiplayer**: Real-time networked arcade action against random opponents. Both players experience identical duck spawns and can see each other's crosshairs.
- **Global Leaderboard**: Save your high scores online and compete to be the best!
- **Accessibility & Customization**: Features high-contrast modes, color-blind friendly options, seated mode, crosshair sizing, and more.

## Installation & Running

Since the game now uses a Node.js backend for multiplayer and leaderboards, you need to run the server:

1. Open your terminal in the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your web browser and go to: **`http://localhost:3000`**

## How to Play Online Multiplayer
When both players load the game, select **Settings** -> **Multiplayer Mode** -> **Online Multiplayer**. Click **Start Hunt**. The game will automatically match you with another waiting player.

## Credits
- **Design & Gameplay**: DeeStudio Team
- **Hand Tracking**: Google MediaPipe
- **Multiplayer & Server**: Node.js & Socket.IO
