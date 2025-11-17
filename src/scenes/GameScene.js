export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.gpuCharacters = [];
        this.gameTime = 0;
        this.dayTime = 0; // 0 = 6am, 1440 = midnight (minutes)
        this.timeScale = 10; // Game minutes per real second
    }

    create() {
        // Create the farm map
        this.createMap();

        // Create player
        this.createPlayer();

        // Create initial GPU character (GPU 00)
        this.createGPU(400, 300, 'gpu_00');

        // Set up camera
        this.cameras.main.setBounds(0, 0, 1280, 720);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Start UI scene
        this.scene.launch('UIScene');

        // Set up day/night cycle
        this.setupDayNightCycle();

        // Game state
        this.gameState = {
            credits: 100,
            level: 1,
            rank: 'Rusty Rig',
            experience: 0,
            gpuTier: 0,
            activeJobs: [],
            completedJobs: 0
        };

        // Share game state with UI
        this.registry.set('gameState', this.gameState);
    }

    createMap() {
        // Create a Stardew Valley style map using tiles
        const mapWidth = 80;
        const mapHeight = 45;

        // Base grass layer
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                this.add.image(x * 16, y * 16, 'tile_grass').setOrigin(0);
            }
        }

        // Create dirt paths (like Stardew)
        for (let x = 15; x < 65; x++) {
            this.add.image(x * 16, 20 * 16, 'tile_dirt').setOrigin(0);
        }
        for (let y = 10; y < 30; y++) {
            this.add.image(40 * 16, y * 16, 'tile_dirt').setOrigin(0);
        }

        // Create starting shed (wooden building)
        this.createBuilding(10, 10, 15, 10, 'GPU Shed');

        // Create small rack area
        this.createRackArea(12, 12, 4, 3);

        // Add some decorative elements (rocks, patches)
        this.addDecorativeElements();

        // Create boundaries
        this.createBoundaries(mapWidth, mapHeight);
    }

    createBuilding(x, y, width, height, label) {
        // Stardew style building with wooden floor
        for (let by = 0; by < height; by++) {
            for (let bx = 0; bx < width; bx++) {
                this.add.image(x * 16 + bx * 16, y * 16 + by * 16, 'tile_wood').setOrigin(0);
            }
        }

        // Walls (darker brown)
        const wallGraphics = this.add.graphics();
        wallGraphics.lineStyle(2, 0x4e342e);
        wallGraphics.strokeRect(x * 16, y * 16, width * 16, height * 16);

        // Building label
        const text = this.add.text(
            x * 16 + (width * 16) / 2,
            y * 16 - 10,
            label,
            {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        text.setOrigin(0.5);
    }

    createRackArea(x, y, rackWidth, rackHeight) {
        // Create GPU rack area (stone tiles)
        for (let ry = 0; ry < rackHeight; ry++) {
            for (let rx = 0; rx < rackWidth; rx++) {
                this.add.image(x * 16 + rx * 16, y * 16 + ry * 16, 'tile_stone').setOrigin(0);
            }
        }

        // Add rack visual (simple box)
        const rackBox = this.add.graphics();
        rackBox.fillStyle(0x212121);
        rackBox.fillRect(x * 16 + 8, y * 16 + 8, rackWidth * 16 - 16, rackHeight * 16 - 16);
        rackBox.fillStyle(0x424242);
        rackBox.fillRect(x * 16 + 12, y * 16 + 12, rackWidth * 16 - 24, rackHeight * 16 - 24);

        // Add blinking LED indicators
        for (let i = 0; i < 3; i++) {
            const led = this.add.circle(
                x * 16 + 20 + i * 12,
                y * 16 + 20,
                2,
                0x00ff00
            );
            this.tweens.add({
                targets: led,
                alpha: 0.3,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                delay: i * 300
            });
        }
    }

    addDecorativeElements() {
        // Add some stones (like Stardew)
        const stonePositions = [
            [5, 5], [70, 8], [15, 35], [60, 30], [25, 15]
        ];

        stonePositions.forEach(([x, y]) => {
            const stone = this.add.graphics();
            stone.fillStyle(0x78909c);
            stone.fillCircle(x * 16 + 8, y * 16 + 8, 6);
            stone.fillStyle(0x90a4ae);
            stone.fillCircle(x * 16 + 6, y * 16 + 6, 2);
        });
    }

    createBoundaries(mapWidth, mapHeight) {
        // Create invisible boundaries
        this.physics.world.setBounds(0, 0, mapWidth * 16, mapHeight * 16);
    }

    createPlayer() {
        // Create player sprite with physics
        this.player = this.physics.add.sprite(640, 360, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);

        // Player stats
        this.player.energy = 100;
        this.player.maxEnergy = 100;
    }

    createGPU(x, y, gpuType) {
        // Create GPU character with physics
        const gpu = this.physics.add.sprite(x, y, gpuType);
        gpu.setCollideWorldBounds(true);
        gpu.setDepth(9);

        // GPU stats
        gpu.energy = 100;
        gpu.maxEnergy = 100;
        gpu.temperature = 25; // Celsius
        gpu.maxTemp = 90;
        gpu.vram = 4; // GB
        gpu.maxVram = 4;
        gpu.usedVram = 0;
        gpu.mood = 'idle'; // idle, working, stressed, sleeping
        gpu.tier = 0; // GPU 00

        // AI behavior
        gpu.aiTimer = 0;
        gpu.targetX = x;
        gpu.targetY = y;

        // Add to collection
        this.gpuCharacters.push(gpu);

        // Make GPU waddle around randomly
        this.time.addEvent({
            delay: 3000,
            callback: () => this.gpuWander(gpu),
            loop: true
        });

        return gpu;
    }

    gpuWander(gpu) {
        if (gpu.mood === 'sleeping') return;

        // Random wander behavior
        const wanderRadius = 100;
        gpu.targetX = gpu.x + Phaser.Math.Between(-wanderRadius, wanderRadius);
        gpu.targetY = gpu.y + Phaser.Math.Between(-wanderRadius, wanderRadius);
    }

    setupDayNightCycle() {
        // Create overlay for day/night
        this.nightOverlay = this.add.rectangle(0, 0, 1280, 720, 0x000033, 0);
        this.nightOverlay.setOrigin(0);
        this.nightOverlay.setDepth(100);
        this.nightOverlay.setScrollFactor(0);
    }

    update(time, delta) {
        // Update game time
        this.gameTime += delta;
        this.dayTime += (delta / 1000) * this.timeScale;

        if (this.dayTime >= 1440) {
            this.dayTime = 0; // New day
            this.onNewDay();
        }

        // Update day/night overlay
        this.updateDayNight();

        // Handle player movement
        this.handlePlayerMovement();

        // Update GPU AI
        this.updateGPUBehavior(delta);

        // Update registry for UI
        this.registry.set('dayTime', this.dayTime);
    }

    handlePlayerMovement() {
        const speed = 100;

        this.player.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(speed);
        }

        // Normalize diagonal movement
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(speed);
        }
    }

    updateGPUBehavior(delta) {
        this.gpuCharacters.forEach(gpu => {
            // Move towards target
            const dx = gpu.targetX - gpu.x;
            const dy = gpu.targetY - gpu.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const speed = 30;
                gpu.setVelocity(
                    (dx / distance) * speed,
                    (dy / distance) * speed
                );
            } else {
                gpu.setVelocity(0, 0);
            }

            // Update temperature (slowly cool down when idle)
            if (gpu.mood === 'idle') {
                gpu.temperature = Math.max(25, gpu.temperature - delta * 0.01);
            }

            // Check if overheated
            if (gpu.temperature > 80) {
                gpu.mood = 'stressed';
            } else if (gpu.temperature < 40 && gpu.mood === 'stressed') {
                gpu.mood = 'idle';
            }
        });
    }

    updateDayNight() {
        // Calculate time of day (0-1440 minutes)
        // 6am (360) = full light, midnight (0 or 1440) = dark, 6pm (1080) = dusk
        let alpha = 0;

        if (this.dayTime < 360) {
            // Night to dawn (midnight to 6am)
            alpha = 0.6 - (this.dayTime / 360) * 0.6;
        } else if (this.dayTime < 1080) {
            // Day (6am to 6pm)
            alpha = 0;
        } else {
            // Dusk to night (6pm to midnight)
            alpha = ((this.dayTime - 1080) / 360) * 0.6;
        }

        this.nightOverlay.setAlpha(alpha);
    }

    onNewDay() {
        console.log('New day started!');
        // Reset player energy
        this.player.energy = this.player.maxEnergy;

        // Reset GPU energy
        this.gpuCharacters.forEach(gpu => {
            gpu.energy = gpu.maxEnergy;
        });
    }
}
