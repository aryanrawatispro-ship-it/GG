# Gensyn GPU Farm

A cozy pixel art GPU farm management game inspired by Stardew Valley! Manage your GPU farm, complete Gensyn jobs, and grow from a tiny shed with one weak GPU to a legendary validator farm.

## Features

### Stardew Valley Aesthetic
- 16x16 pixel art tiles and sprites
- Top-down perspective with smooth movement
- Warm, earthy color palette with wooden UI elements
- Day/night cycle with atmospheric lighting
- Cozy farm atmosphere meets data center vibes

### Core Gameplay
- **GPU Characters**: Cute walking GPU cards with PCB bodies, glowing VRAM chip eyes, and spinning fans
- **Farm Management**: Start with GPU 00 and upgrade to better tiers
- **Gensyn Jobs**: Complete AI training jobs to earn Gensyn credits
- **Progression System**: Level up from "Rusty Rig" to "Elite Gensyn Validator"
- **Resource Management**: Balance power, cooling, and network capacity

### GPU Tiers
- **GPU 00**: Scrappy entry-level card (starter)
- **GPU 01**: Mid-tier upgrade with better specs
- **GPU 02+**: Higher tier cards with more fans, LEDs, and compute power
- **Validator GPUs**: Special elite variants for high-reward tasks

### Current Implementation
✅ Stardew Valley-style pixel art
✅ Top-down farm map with grass, dirt paths, and buildings
✅ Player character with WASD/Arrow key movement
✅ GPU 00 character with wandering AI
✅ Day/night cycle (6am to midnight)
✅ Wooden UI panels matching Stardew's aesthetic
✅ Job queue system with Gensyn jobs
✅ Energy bars and stats panels
✅ Credits and leveling system

## How to Run

### Quick Start
```bash
# Install dependencies (optional - using CDN)
# npm install

# Start local server
npm start

# Or use Python directly
python3 -m http.server 8000
```

Then open your browser to:
```
http://localhost:8000
```

### Controls
- **WASD** or **Arrow Keys**: Move player
- **Mouse**: Interact with UI elements
- **Click "Accept"**: Start Gensyn jobs

## Game Mechanics

### Time System
- 1 real second = 10 game minutes
- 6:00 AM - Full daylight
- 6:00 PM - Dusk begins
- Midnight - Darkest point
- New day resets energy

### GPU Behavior
- GPUs waddle around the farm autonomously
- They have energy, temperature, and mood stats
- Overheating causes stress
- They can sleep in beds to recover

### Jobs System
- Jobs appear in the right panel
- Each job shows:
  - Name (e.g., "Tiny Fine Tune")
  - Reward in Gensyn credits
  - Duration
  - VRAM requirements
  - GPU tier requirements
- Click "Accept" to start a job

## Future Features (From CLAUDE.md)

### Coming Soon
- 🎮 CodeAssist & BlockAssist helper robots
- 🏭 More buildings (cooling towers, power rooms, network rooms)
- 🌾 Compute crops (VRAM Vines, Throughput Trees, etc.)
- 🔧 Real problems: CUDA OOM, driver mismatches, overheating
- 📊 Tech tree with upgrades
- 🎯 More job types and global Gensyn events
- 😊 GPU character expressions and speech bubbles
- 🛏️ GPU sleeping animations
- 🔥 Temperature-based fan animations
- 💾 Save system

### Realistic Problems to Implement
- CUDA out of memory errors
- Driver version mismatches
- GPU overheating and throttling
- Network latency issues
- Power brownouts
- Storage management
- Job queue congestion

## Technical Stack

- **Engine**: Phaser 3 (v3.60.0)
- **Graphics**: Procedurally generated pixel art
- **Physics**: Arcade Physics
- **Deployment**: Static web app (no build step needed)

## File Structure

```
GG/
├── index.html              # Main HTML entry point
├── package.json            # Project metadata
├── src/
│   ├── main.js            # Game configuration
│   └── scenes/
│       ├── BootScene.js   # Asset loading & generation
│       ├── GameScene.js   # Main game world
│       └── UIScene.js     # User interface
└── README.md
```

## Credits

Inspired by:
- **Stardew Valley** - For the cozy farming game aesthetic
- **Gensyn** - For the GPU compute network theme
- **Real ML Engineers** - For the authentic infrastructure pain

## Development

Built with love for Gensyn users, GPU owners, and ML engineers everywhere. May your VRAM never overflow and your drivers always match! 🌾⚡🖥️
