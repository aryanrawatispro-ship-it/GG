export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Get game state from registry
        this.gameState = this.registry.get('gameState');

        // Create Stardew Valley style UI
        this.createTopBar();
        this.createBottomBar();
        this.createJobQueue();
        this.createGPUStatsPanel();

        // Listen for updates
        this.registry.events.on('changedata', this.updateUI, this);
    }

    createTopBar() {
        // Top bar background (Stardew style brown wood)
        const topBar = this.add.graphics();
        topBar.fillStyle(0x4e342e, 0.95);
        topBar.fillRect(0, 0, 1280, 60);
        topBar.fillStyle(0x6d4c41, 0.9);
        topBar.fillRect(4, 4, 1272, 52);
        topBar.setScrollFactor(0);
        topBar.setDepth(200);

        // Gensyn logo text
        const logoText = this.add.text(20, 15, 'GENSYN GPU FARM', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#8bc34a',
            stroke: '#2e7d32',
            strokeThickness: 3
        });
        logoText.setScrollFactor(0);
        logoText.setDepth(201);

        // Credits display (like gold in Stardew)
        this.creditsText = this.add.text(400, 20, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.creditsText.setScrollFactor(0);
        this.creditsText.setDepth(201);

        // Level and rank
        this.rankText = this.add.text(650, 20, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.rankText.setScrollFactor(0);
        this.rankText.setDepth(201);

        // Time display
        this.timeText = this.add.text(1050, 20, '', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timeText.setScrollFactor(0);
        this.timeText.setDepth(201);

        this.updateTopBar();
    }

    createBottomBar() {
        // Energy bar (like Stardew's stamina bar)
        const barY = 660;

        // Energy label
        const energyLabel = this.add.text(20, barY - 20, 'Energy:', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        energyLabel.setScrollFactor(0);
        energyLabel.setDepth(201);

        // Energy bar background
        const energyBg = this.add.graphics();
        energyBg.fillStyle(0x4e342e);
        energyBg.fillRect(20, barY, 204, 24);
        energyBg.fillStyle(0x1a1a1a);
        energyBg.fillRect(22, barY + 2, 200, 20);
        energyBg.setScrollFactor(0);
        energyBg.setDepth(200);

        // Energy bar fill
        this.energyBar = this.add.graphics();
        this.energyBar.setScrollFactor(0);
        this.energyBar.setDepth(201);
        this.updateEnergyBar(100);
    }

    createJobQueue() {
        // Job queue panel (right side, Stardew style)
        const panelX = 1000;
        const panelY = 80;

        // Panel background
        const panel = this.add.graphics();
        panel.fillStyle(0x4e342e, 0.95);
        panel.fillRect(panelX, panelY, 260, 300);
        panel.fillStyle(0x6d4c41, 0.9);
        panel.fillRect(panelX + 4, panelY + 4, 252, 292);
        panel.setScrollFactor(0);
        panel.setDepth(200);

        // Panel title
        const title = this.add.text(panelX + 130, panelY + 15, 'Gensyn Jobs', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#8bc34a',
            stroke: '#000000',
            strokeThickness: 3
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);

        // Job list container
        this.jobListContainer = this.add.container(panelX + 10, panelY + 40);
        this.jobListContainer.setScrollFactor(0);
        this.jobListContainer.setDepth(201);

        // Create sample jobs
        this.createSampleJobs();
    }

    createSampleJobs() {
        const jobs = [
            {
                name: 'Tiny Fine Tune',
                reward: 25,
                duration: '5m',
                vram: 2,
                tier: 0,
                status: 'available'
            },
            {
                name: 'Small Eval Sweep',
                reward: 15,
                duration: '3m',
                vram: 1,
                tier: 0,
                status: 'available'
            },
            {
                name: 'Micro RLHF',
                reward: 30,
                duration: '8m',
                vram: 3,
                tier: 0,
                status: 'locked'
            }
        ];

        jobs.forEach((job, index) => {
            const jobY = index * 80;

            // Job card background
            const cardBg = this.add.graphics();
            cardBg.fillStyle(job.status === 'locked' ? 0x3e2723 : 0x5d4037);
            cardBg.fillRect(0, jobY, 240, 70);
            cardBg.fillStyle(job.status === 'locked' ? 0x4e342e : 0x6d4c41);
            cardBg.fillRect(2, jobY + 2, 236, 66);

            // Job name
            const jobName = this.add.text(10, jobY + 8, job.name, {
                fontSize: '14px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: job.status === 'locked' ? '#666666' : '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            });

            // Reward
            const rewardText = this.add.text(10, jobY + 28, `${job.reward} Credits`, {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: job.status === 'locked' ? '#888888' : '#ffd700',
                stroke: '#000000',
                strokeThickness: 2
            });

            // Requirements
            const reqText = this.add.text(10, jobY + 45, `${job.vram}GB VRAM • ${job.duration}`, {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: job.status === 'locked' ? '#666666' : '#aaaaaa'
            });

            // Accept button (if available)
            if (job.status === 'available') {
                const acceptBtn = this.add.graphics();
                acceptBtn.fillStyle(0x2e7d32);
                acceptBtn.fillRect(150, jobY + 40, 80, 24);
                acceptBtn.fillStyle(0x388e3c);
                acceptBtn.fillRect(152, jobY + 42, 76, 20);
                acceptBtn.setInteractive(
                    new Phaser.Geom.Rectangle(150, jobY + 40, 80, 24),
                    Phaser.Geom.Rectangle.Contains
                );
                acceptBtn.on('pointerdown', () => this.acceptJob(job));

                const btnText = this.add.text(190, jobY + 50, 'Accept', {
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    color: '#ffffff'
                });
                btnText.setOrigin(0.5);

                this.jobListContainer.add([cardBg, jobName, rewardText, reqText, acceptBtn, btnText]);
            } else {
                this.jobListContainer.add([cardBg, jobName, rewardText, reqText]);
            }
        });
    }

    createGPUStatsPanel() {
        // GPU stats panel (left side)
        const panelX = 20;
        const panelY = 80;

        // Panel background
        const panel = this.add.graphics();
        panel.fillStyle(0x4e342e, 0.95);
        panel.fillRect(panelX, panelY, 200, 200);
        panel.fillStyle(0x6d4c41, 0.9);
        panel.fillRect(panelX + 4, panelY + 4, 192, 192);
        panel.setScrollFactor(0);
        panel.setDepth(200);

        // Panel title
        const title = this.add.text(panelX + 100, panelY + 15, 'GPU 00 Stats', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(201);

        // Stats text
        this.gpuStatsText = this.add.text(panelX + 15, panelY + 40, '', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1,
            lineSpacing: 8
        });
        this.gpuStatsText.setScrollFactor(0);
        this.gpuStatsText.setDepth(201);

        this.updateGPUStats();
    }

    updateTopBar() {
        if (this.gameState) {
            this.creditsText.setText(`${this.gameState.credits} Credits`);
            this.rankText.setText(`Level ${this.gameState.level} • ${this.gameState.rank}`);
        }
    }

    updateEnergyBar(energy) {
        this.energyBar.clear();
        this.energyBar.fillStyle(0x2e7d32);
        this.energyBar.fillRect(22, 662, energy * 2, 20);
    }

    updateGPUStats() {
        const stats = `VRAM: 2/4 GB
Temperature: 32°C
Status: Idle
Mood: 😊

Jobs Done: 0
Uptime: 100%`;

        this.gpuStatsText.setText(stats);
    }

    updateUI(parent, key, data) {
        if (key === 'gameState') {
            this.gameState = data;
            this.updateTopBar();
        }

        if (key === 'dayTime') {
            // Convert minutes to time
            const totalMinutes = Math.floor(data);
            const hours = Math.floor(totalMinutes / 60) % 24;
            const minutes = totalMinutes % 60;
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;

            this.timeText.setText(`${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`);
        }
    }

    acceptJob(job) {
        console.log('Accepted job:', job.name);

        // Update credits
        this.gameState.credits += job.reward;
        this.gameState.completedJobs++;
        this.registry.set('gameState', this.gameState);

        // Show notification
        this.showNotification(`Started: ${job.name}`, 0x8bc34a);
    }

    showNotification(message, color = 0xffffff) {
        const notif = this.add.text(640, 400, message, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 },
            stroke: '#000000',
            strokeThickness: 4
        });
        notif.setOrigin(0.5);
        notif.setScrollFactor(0);
        notif.setDepth(300);

        // Fade out and destroy
        this.tweens.add({
            targets: notif,
            alpha: 0,
            y: 350,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => notif.destroy()
        });
    }
}
