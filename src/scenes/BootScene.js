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
        // EXACT STARDEW VALLEY UI RECREATION

        // Toolbar slot (single slot for 12-slot toolbar)
        this.createToolbarSlot();

        // Inventory slot (for inventory menu)
        this.createInventorySlot();

        // Health bar
        this.createHealthBar();

        // Energy bar
        this.createEnergyBar();

        // Icons
        this.createIcons();

        // Dialogue box
        this.createDialogueBox();

        // Menu background
        this.createMenuBackground();
    }

    createToolbarSlot() {
        // Exact Stardew toolbar slot (64x64 with brown border)
        const slot = this.add.graphics();

        // Outer dark border
        slot.fillStyle(0x2a1a0f);
        slot.fillRect(0, 0, 64, 64);

        // Inner brown frame
        slot.fillStyle(0x4a3425);
        slot.fillRect(4, 4, 56, 56);

        // Inner area (darker for empty slot)
        slot.fillStyle(0x1a1410);
        slot.fillRect(8, 8, 48, 48);

        // Highlight on top-left
        slot.fillStyle(0x6b5444);
        slot.fillRect(4, 4, 56, 2);
        slot.fillRect(4, 4, 2, 56);

        // Shadow on bottom-right
        slot.fillStyle(0x2a1a0f);
        slot.fillRect(4, 58, 56, 2);
        slot.fillRect(58, 4, 2, 56);

        slot.generateTexture('toolbar_slot', 64, 64);
        slot.destroy();

        // Selected slot (with yellow border)
        const selectedSlot = this.add.graphics();
        selectedSlot.fillStyle(0x2a1a0f);
        selectedSlot.fillRect(0, 0, 64, 64);
        selectedSlot.fillStyle(0xffd700);
        selectedSlot.fillRect(2, 2, 60, 60);
        selectedSlot.fillStyle(0x4a3425);
        selectedSlot.fillRect(4, 4, 56, 56);
        selectedSlot.fillStyle(0x1a1410);
        selectedSlot.fillRect(8, 8, 48, 48);
        selectedSlot.generateTexture('toolbar_slot_selected', 64, 64);
        selectedSlot.destroy();
    }

    createInventorySlot() {
        // Same as toolbar but smaller (for inventory grid)
        const slot = this.add.graphics();
        slot.fillStyle(0x2a1a0f);
        slot.fillRect(0, 0, 48, 48);
        slot.fillStyle(0x4a3425);
        slot.fillRect(3, 3, 42, 42);
        slot.fillStyle(0x1a1410);
        slot.fillRect(6, 6, 36, 36);
        slot.fillStyle(0x6b5444);
        slot.fillRect(3, 3, 42, 2);
        slot.fillRect(3, 3, 2, 42);
        slot.fillStyle(0x2a1a0f);
        slot.fillRect(3, 43, 42, 2);
        slot.fillRect(43, 3, 2, 42);
        slot.generateTexture('inventory_slot', 48, 48);
        slot.destroy();
    }

    createHealthBar() {
        // Stardew health bar background
        const healthBg = this.add.graphics();
        healthBg.fillStyle(0x1a1410);
        healthBg.fillRect(0, 0, 200, 32);
        healthBg.fillStyle(0x2a1a0f);
        healthBg.fillRect(2, 2, 196, 28);
        healthBg.generateTexture('health_bg', 200, 32);
        healthBg.destroy();

        // Health fill (green)
        const healthFill = this.add.graphics();
        healthFill.fillStyle(0x68c23c);
        healthFill.fillRect(0, 0, 4, 24);
        healthFill.generateTexture('health_fill', 4, 24);
        healthFill.destroy();

        // Heart icon
        const heart = this.add.graphics();
        heart.fillStyle(0xff0000);
        // Simple pixel heart
        heart.fillRect(2, 3, 3, 3);
        heart.fillRect(7, 3, 3, 3);
        heart.fillRect(1, 6, 10, 4);
        heart.fillRect(2, 10, 8, 2);
        heart.fillRect(3, 12, 6, 2);
        heart.fillRect(4, 14, 4, 1);
        heart.generateTexture('heart_icon', 12, 16);
        heart.destroy();
    }

    createEnergyBar() {
        // Energy bar background (same as health)
        const energyBg = this.add.graphics();
        energyBg.fillStyle(0x1a1410);
        energyBg.fillRect(0, 0, 200, 32);
        energyBg.fillStyle(0x2a1a0f);
        energyBg.fillRect(2, 2, 196, 28);
        energyBg.generateTexture('energy_bg', 200, 32);
        energyBg.destroy();

        // Energy fill (orange/amber)
        const energyFill = this.add.graphics();
        energyFill.fillStyle(0xff8c00);
        energyFill.fillRect(0, 0, 4, 24);
        energyFill.generateTexture('energy_fill', 4, 24);
        energyFill.destroy();

        // Energy icon (lightning bolt)
        const bolt = this.add.graphics();
        bolt.fillStyle(0xffff00);
        bolt.fillRect(6, 0, 2, 7);
        bolt.fillRect(4, 4, 2, 3);
        bolt.fillRect(8, 4, 2, 3);
        bolt.fillRect(5, 7, 4, 4);
        bolt.fillRect(3, 9, 2, 3);
        bolt.fillRect(9, 9, 2, 3);
        bolt.fillRect(6, 11, 2, 5);
        bolt.generateTexture('energy_icon', 14, 16);
        bolt.destroy();
    }

    createIcons() {
        // Gold coin icon
        const coin = this.add.graphics();
        coin.fillStyle(0x8b6914);
        coin.fillCircle(8, 8, 7);
        coin.fillStyle(0xffd700);
        coin.fillCircle(8, 8, 6);
        coin.fillStyle(0xffed4e);
        coin.fillCircle(6, 6, 3);
        coin.fillStyle(0xffd700);
        coin.fillRect(7, 7, 3, 3);
        coin.generateTexture('coin_icon', 16, 16);
        coin.destroy();

        // Clock icon
        const clock = this.add.graphics();
        clock.fillStyle(0x4a3425);
        clock.fillCircle(12, 12, 10);
        clock.fillStyle(0xf4e4c1);
        clock.fillCircle(12, 12, 8);
        clock.fillStyle(0x2a1a0f);
        clock.fillRect(11, 5, 2, 7);
        clock.fillRect(11, 11, 5, 2);
        clock.fillCircle(12, 12, 2);
        clock.generateTexture('clock_icon', 24, 24);
        clock.destroy();

        // GPU item icon (for inventory)
        const gpuItem = this.add.graphics();
        gpuItem.fillStyle(0x2e7d32);
        gpuItem.fillRect(4, 4, 24, 24);
        gpuItem.fillStyle(0xffd700);
        gpuItem.fillRect(6, 8, 20, 1);
        gpuItem.fillRect(6, 12, 20, 1);
        gpuItem.fillRect(6, 16, 20, 1);
        gpuItem.fillStyle(0x00ff00);
        gpuItem.fillRect(8, 10, 2, 2);
        gpuItem.fillRect(18, 10, 2, 2);
        gpuItem.generateTexture('item_gpu', 32, 32);
        gpuItem.destroy();

        // Credits item icon
        const creditItem = this.add.graphics();
        creditItem.fillStyle(0x8bc34a);
        creditItem.fillRect(8, 6, 16, 20);
        creditItem.fillStyle(0x2e7d32);
        creditItem.fillRect(12, 10, 8, 2);
        creditItem.fillRect(12, 14, 8, 2);
        creditItem.fillRect(12, 18, 8, 2);
        creditItem.generateTexture('item_credits', 32, 32);
        creditItem.destroy();
    }

    createDialogueBox() {
        // Stardew dialogue box (brown wooden panel)
        const dialogue = this.add.graphics();

        // Outer dark border
        dialogue.fillStyle(0x2a1a0f);
        dialogue.fillRect(0, 0, 800, 200);

        // Brown frame
        dialogue.fillStyle(0x4a3425);
        dialogue.fillRect(8, 8, 784, 184);

        // Inner beige area
        dialogue.fillStyle(0xf4e4c1);
        dialogue.fillRect(16, 16, 768, 168);

        // Wood grain texture
        dialogue.fillStyle(0xe4d4b1);
        for (let i = 0; i < 20; i++) {
            dialogue.fillRect(20 + i * 38, 20, 2, 160);
        }

        dialogue.generateTexture('dialogue_box', 800, 200);
        dialogue.destroy();
    }

    createMenuBackground() {
        // Full inventory menu background
        const menu = this.add.graphics();

        // Semi-transparent dark overlay
        menu.fillStyle(0x000000, 0.7);
        menu.fillRect(0, 0, 1280, 720);

        menu.generateTexture('menu_overlay', 1280, 720);
        menu.destroy();

        // Inventory panel (large wooden panel)
        const invPanel = this.add.graphics();
        invPanel.fillStyle(0x2a1a0f);
        invPanel.fillRect(0, 0, 600, 500);
        invPanel.fillStyle(0x4a3425);
        invPanel.fillRect(8, 8, 584, 484);
        invPanel.fillStyle(0xf4e4c1);
        invPanel.fillRect(16, 16, 568, 468);

        // Wood grain
        invPanel.fillStyle(0xe4d4b1);
        for (let i = 0; i < 15; i++) {
            invPanel.fillRect(20 + i * 38, 20, 2, 460);
        }

        invPanel.generateTexture('inventory_panel', 600, 500);
        invPanel.destroy();
    }
}
