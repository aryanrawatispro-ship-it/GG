export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar with Stardew Valley style
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x3e2723, 0.8);
        progressBox.fillRect(width / 2 - 320, height / 2 - 30, 640, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading Gensyn GPU Farm...',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x8bc34a, 1);
            progressBar.fillRect(width / 2 - 310, height / 2 - 20, 620 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load assets - we'll generate these procedurally for now
        this.loadProceduralAssets();
    }

    loadProceduralAssets() {
        // We'll create pixel art textures procedurally
        // This is a placeholder - we'll generate actual sprites in create()
    }

    create() {
        // Generate all pixel art assets
        this.createTiles();
        this.createPlayerSprite();
        this.createGPUSprites();
        this.createUIAssets();

        // Start the main game scene
        this.scene.start('GameScene');
    }

    createTiles() {
        // Grass tile (Stardew style)
        const grassTile = this.add.graphics();
        grassTile.fillStyle(0x6ba853);
        grassTile.fillRect(0, 0, 16, 16);
        grassTile.fillStyle(0x7bb863);
        grassTile.fillRect(2, 2, 3, 3);
        grassTile.fillRect(8, 5, 2, 2);
        grassTile.fillRect(11, 9, 3, 3);
        grassTile.fillRect(4, 11, 2, 2);
        grassTile.generateTexture('tile_grass', 16, 16);
        grassTile.destroy();

        // Dirt path tile
        const dirtTile = this.add.graphics();
        dirtTile.fillStyle(0x8b6f47);
        dirtTile.fillRect(0, 0, 16, 16);
        dirtTile.fillStyle(0x9b7f57);
        dirtTile.fillRect(3, 1, 2, 1);
        dirtTile.fillRect(9, 4, 3, 1);
        dirtTile.fillRect(2, 8, 1, 2);
        dirtTile.fillRect(11, 11, 2, 2);
        dirtTile.generateTexture('tile_dirt', 16, 16);
        dirtTile.destroy();

        // Wooden floor (for buildings)
        const woodTile = this.add.graphics();
        woodTile.fillStyle(0x6d4c41);
        woodTile.fillRect(0, 0, 16, 16);
        woodTile.fillStyle(0x5d4037);
        woodTile.fillRect(0, 4, 16, 1);
        woodTile.fillRect(0, 12, 16, 1);
        woodTile.fillStyle(0x8b6f47);
        woodTile.fillRect(6, 0, 1, 16);
        woodTile.generateTexture('tile_wood', 16, 16);
        woodTile.destroy();

        // Stone tile
        const stoneTile = this.add.graphics();
        stoneTile.fillStyle(0x78909c);
        stoneTile.fillRect(0, 0, 16, 16);
        stoneTile.fillStyle(0x607d8b);
        stoneTile.fillRect(1, 1, 6, 6);
        stoneTile.fillRect(9, 9, 6, 6);
        stoneTile.fillStyle(0x90a4ae);
        stoneTile.fillRect(2, 2, 1, 1);
        stoneTile.fillRect(10, 10, 1, 1);
        stoneTile.generateTexture('tile_stone', 16, 16);
        stoneTile.destroy();
    }

    createPlayerSprite() {
        // Create a simple player sprite (Stardew style farmer)
        const player = this.add.graphics();

        // Body
        player.fillStyle(0x2196f3); // Blue shirt
        player.fillRect(4, 8, 8, 6);

        // Pants
        player.fillStyle(0x1565c0); // Dark blue pants
        player.fillRect(5, 14, 3, 4);
        player.fillRect(8, 14, 3, 4);

        // Head
        player.fillStyle(0xffcc80); // Skin tone
        player.fillRect(5, 2, 6, 6);

        // Hair
        player.fillStyle(0x5d4037); // Brown hair
        player.fillRect(5, 1, 6, 3);

        // Eyes
        player.fillStyle(0x000000);
        player.fillRect(6, 4, 1, 1);
        player.fillRect(9, 4, 1, 1);

        player.generateTexture('player', 16, 18);
        player.destroy();
    }

    createGPUSprites() {
        // GPU 00 - Weak starter GPU (walking PCB character)
        const gpu00 = this.add.graphics();

        // PCB body (green circuit board)
        gpu00.fillStyle(0x2e7d32);
        gpu00.fillRect(2, 4, 12, 10);

        // Circuit traces
        gpu00.fillStyle(0xffd700);
        gpu00.fillRect(3, 6, 10, 1);
        gpu00.fillRect(3, 9, 10, 1);
        gpu00.fillRect(6, 5, 1, 8);
        gpu00.fillRect(9, 5, 1, 8);

        // VRAM chips (eyes)
        gpu00.fillStyle(0x000000);
        gpu00.fillRect(5, 7, 2, 2);
        gpu00.fillRect(9, 7, 2, 2);

        // Eye glow
        gpu00.fillStyle(0x00ff00);
        gpu00.fillRect(5, 7, 1, 1);
        gpu00.fillRect(9, 7, 1, 1);

        // Tiny fan
        gpu00.fillStyle(0x424242);
        gpu00.fillRect(6, 11, 4, 2);

        // Legs (for waddling)
        gpu00.fillStyle(0xffd700);
        gpu00.fillRect(4, 14, 2, 3);
        gpu00.fillRect(10, 14, 2, 3);

        gpu00.generateTexture('gpu_00', 16, 18);
        gpu00.destroy();

        // GPU 01 - Mid tier GPU (slightly bigger, better fan)
        const gpu01 = this.add.graphics();
        gpu01.fillStyle(0x2e7d32);
        gpu01.fillRect(2, 4, 12, 10);
        gpu01.fillStyle(0xffd700);
        gpu01.fillRect(3, 6, 10, 1);
        gpu01.fillRect(3, 9, 10, 1);
        gpu01.fillRect(6, 5, 1, 8);
        gpu01.fillRect(9, 5, 1, 8);
        gpu01.fillStyle(0x000000);
        gpu01.fillRect(5, 7, 2, 2);
        gpu01.fillRect(9, 7, 2, 2);
        gpu01.fillStyle(0x00ffff); // Cyan glow (better GPU)
        gpu01.fillRect(5, 7, 1, 1);
        gpu01.fillRect(9, 7, 1, 1);
        gpu01.fillStyle(0x616161); // Bigger fan
        gpu01.fillRect(5, 11, 6, 2);
        gpu01.fillStyle(0xffd700);
        gpu01.fillRect(4, 14, 2, 3);
        gpu01.fillRect(10, 14, 2, 3);
        gpu01.generateTexture('gpu_01', 16, 18);
        gpu01.destroy();
    }

    createUIAssets() {
        // Create Stardew Valley style UI panel
        const panel = this.add.graphics();

        // Brown wooden border
        panel.fillStyle(0x4e342e);
        panel.fillRect(0, 0, 200, 100);

        // Inner lighter area
        panel.fillStyle(0x6d4c41);
        panel.fillRect(4, 4, 192, 92);

        // Decorative corner details
        panel.fillStyle(0x8b6f47);
        panel.fillRect(6, 6, 8, 2);
        panel.fillRect(186, 6, 8, 2);
        panel.fillRect(6, 92, 8, 2);
        panel.fillRect(186, 92, 8, 2);

        panel.generateTexture('ui_panel', 200, 100);
        panel.destroy();

        // Create button
        const button = this.add.graphics();
        button.fillStyle(0x5d4037);
        button.fillRect(0, 0, 100, 32);
        button.fillStyle(0x6d4c41);
        button.fillRect(2, 2, 96, 28);
        button.fillStyle(0x8b6f47);
        button.fillRect(4, 4, 92, 24);
        button.generateTexture('ui_button', 100, 32);
        button.destroy();

        // Energy bar (like Stardew's health bar)
        const energyBar = this.add.graphics();
        energyBar.fillStyle(0x2e7d32);
        energyBar.fillRect(0, 0, 100, 10);
        energyBar.generateTexture('ui_energy_bar', 100, 10);
        energyBar.destroy();

        // VRAM bar (for GPU stats)
        const vramBar = this.add.graphics();
        vramBar.fillStyle(0x1976d2);
        vramBar.fillRect(0, 0, 100, 10);
        vramBar.generateTexture('ui_vram_bar', 100, 10);
        vramBar.destroy();

        // Temperature bar (for overheating)
        const tempBar = this.add.graphics();
        tempBar.fillStyle(0xf44336);
        tempBar.fillRect(0, 0, 100, 10);
        tempBar.generateTexture('ui_temp_bar', 100, 10);
        tempBar.destroy();
    }
}
