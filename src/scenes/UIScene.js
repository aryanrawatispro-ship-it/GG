export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Get game state from registry
        this.gameState = this.registry.get('gameState');

        // Initialize inventory
        this.inventory = {
            toolbar: [
                { item: 'item_gpu', count: 1 },
                { item: 'item_credits', count: 5 },
                null, null, null, null, null, null, null, null, null, null
            ],
            selectedSlot: 0,
            full: [] // Full 36-slot inventory
        };

        // Fill full inventory with toolbar + extras
        for (let i = 0; i < 36; i++) {
            if (i < 12 && this.inventory.toolbar[i]) {
                this.inventory.full[i] = this.inventory.toolbar[i];
            } else {
                this.inventory.full[i] = null;
            }
        }

        // Create EXACT Stardew Valley UI
        this.createToolbar();
        this.createHealthBar();
        this.createEnergyBar();
        this.createMoneyDisplay();
        this.createTimeDisplay();

        // Inventory menu (hidden by default)
        this.inventoryMenuOpen = false;
        this.createInventoryMenu();

        // Set up input
        this.input.keyboard.on('keydown-E', () => this.toggleInventory());
        this.input.keyboard.on('keydown-ESC', () => this.closeInventory());

        // Number keys for toolbar selection
        for (let i = 1; i <= 9; i++) {
            this.input.keyboard.on(`keydown-${i}`, () => this.selectToolbarSlot(i - 1));
        }
        this.input.keyboard.on('keydown-ZERO', () => this.selectToolbarSlot(9));
        this.input.keyboard.on('keydown-MINUS', () => this.selectToolbarSlot(10));
        this.input.keyboard.on('keydown-EQUALS', () => this.selectToolbarSlot(11));

        // Mouse wheel for toolbar
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0) {
                this.selectToolbarSlot((this.inventory.selectedSlot + 1) % 12);
            } else {
                this.selectToolbarSlot((this.inventory.selectedSlot + 11) % 12);
            }
        });

        // Listen for updates
        this.registry.events.on('changedata', this.updateUI, this);

        // Update displays
        this.updateAllDisplays();
    }

    createToolbar() {
        // EXACT Stardew Valley bottom toolbar
        const toolbarY = 720 - 80; // Bottom of screen
        const toolbarX = (1280 - (12 * 64 + 11 * 4)) / 2; // Centered

        this.toolbarSlots = [];
        this.toolbarItems = [];
        this.toolbarCounts = [];

        for (let i = 0; i < 12; i++) {
            const x = toolbarX + i * (64 + 4);
            const y = toolbarY;

            // Slot background
            const slot = this.add.image(x, y, 'toolbar_slot');
            slot.setOrigin(0);
            slot.setScrollFactor(0);
            slot.setDepth(200);

            this.toolbarSlots.push(slot);

            // Item icon (if exists)
            const itemIcon = this.add.image(x + 32, y + 32, 'toolbar_slot');
            itemIcon.setScrollFactor(0);
            itemIcon.setDepth(201);
            itemIcon.setVisible(false);
            this.toolbarItems.push(itemIcon);

            // Item count text
            const countText = this.add.text(x + 48, y + 48, '', {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            });
            countText.setOrigin(1, 1);
            countText.setScrollFactor(0);
            countText.setDepth(202);
            this.toolbarCounts.push(countText);
        }

        // Selected slot indicator
        this.updateToolbarSelection();
        this.updateToolbarItems();
    }

    createHealthBar() {
        // EXACT Stardew health bar position (top left)
        const x = 20;
        const y = 20;

        // Heart icon
        const heart = this.add.image(x, y, 'heart_icon');
        heart.setOrigin(0);
        heart.setScrollFactor(0);
        heart.setDepth(200);

        // Health bar background
        const healthBg = this.add.image(x + 20, y, 'health_bg');
        healthBg.setOrigin(0);
        healthBg.setScrollFactor(0);
        healthBg.setDepth(200);

        // Health bar fill (dynamic)
        this.healthBarFills = [];
        for (let i = 0; i < 48; i++) { // 48 segments = 192px / 4px per segment
            const fill = this.add.image(x + 24 + i * 4, y + 4, 'health_fill');
            fill.setOrigin(0);
            fill.setScrollFactor(0);
            fill.setDepth(201);
            this.healthBarFills.push(fill);
        }

        this.updateHealthBar(100); // Start at 100%
    }

    createEnergyBar() {
        // EXACT Stardew energy bar position (below health)
        const x = 20;
        const y = 60;

        // Energy icon (lightning bolt)
        const bolt = this.add.image(x, y, 'energy_icon');
        bolt.setOrigin(0);
        bolt.setScrollFactor(0);
        bolt.setDepth(200);

        // Energy bar background
        const energyBg = this.add.image(x + 20, y, 'energy_bg');
        energyBg.setOrigin(0);
        energyBg.setScrollFactor(0);
        energyBg.setDepth(200);

        // Energy bar fill (dynamic)
        this.energyBarFills = [];
        for (let i = 0; i < 48; i++) {
            const fill = this.add.image(x + 24 + i * 4, y + 4, 'energy_fill');
            fill.setOrigin(0);
            fill.setScrollFactor(0);
            fill.setDepth(201);
            this.energyBarFills.push(fill);
        }

        this.updateEnergyBar(100); // Start at 100%
    }

    createMoneyDisplay() {
        // EXACT Stardew money display (top right)
        const x = 1260;
        const y = 20;

        // Coin icon
        const coin = this.add.image(x - 150, y, 'coin_icon');
        coin.setOrigin(0);
        coin.setScrollFactor(0);
        coin.setDepth(200);

        // Money text
        this.moneyText = this.add.text(x - 125, y + 8, '100g', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#5d4c41',
            stroke: '#f4e4c1',
            strokeThickness: 2
        });
        this.moneyText.setOrigin(1, 0);
        this.moneyText.setScrollFactor(0);
        this.moneyText.setDepth(200);
    }

    createTimeDisplay() {
        // EXACT Stardew time display (top right, below money)
        const x = 1260;
        const y = 50;

        // Clock icon
        const clock = this.add.image(x - 100, y, 'clock_icon');
        clock.setOrigin(0);
        clock.setScrollFactor(0);
        clock.setDepth(200);

        // Time text
        this.timeText = this.add.text(x - 65, y + 12, '6:00 AM', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#5d4c41',
            stroke: '#f4e4c1',
            strokeThickness: 2
        });
        this.timeText.setOrigin(1, 0.5);
        this.timeText.setScrollFactor(0);
        this.timeText.setDepth(200);

        // Day display
        this.dayText = this.add.text(x - 10, y + 35, 'Spring 1', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#5d4c41',
            stroke: '#f4e4c1',
            strokeThickness: 2
        });
        this.dayText.setOrigin(1, 0);
        this.dayText.setScrollFactor(0);
        this.dayText.setDepth(200);
    }

    createInventoryMenu() {
        // Container for inventory (hidden by default)
        this.inventoryContainer = this.add.container(0, 0);
        this.inventoryContainer.setScrollFactor(0);
        this.inventoryContainer.setDepth(300);
        this.inventoryContainer.setVisible(false);

        // Overlay
        const overlay = this.add.image(0, 0, 'menu_overlay');
        overlay.setOrigin(0);

        // Inventory panel (centered)
        const panelX = (1280 - 600) / 2;
        const panelY = (720 - 500) / 2;

        const panel = this.add.image(panelX, panelY, 'inventory_panel');
        panel.setOrigin(0);

        // Title
        const title = this.add.text(panelX + 300, panelY + 30, 'Inventory', {
            fontSize: '28px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#5d4c41'
        });
        title.setOrigin(0.5, 0);

        // Inventory slots (6x6 grid = 36 slots)
        this.inventorySlots = [];
        this.inventoryIcons = [];
        this.inventoryCounts = [];

        const startX = panelX + 50;
        const startY = panelY + 80;
        const slotSize = 48;
        const padding = 8;

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const index = row * 6 + col;
                const x = startX + col * (slotSize + padding);
                const y = startY + row * (slotSize + padding);

                // Slot
                const slot = this.add.image(x, y, 'inventory_slot');
                slot.setOrigin(0);
                slot.setInteractive();
                slot.on('pointerover', () => this.onInventorySlotHover(index));
                slot.on('pointerout', () => this.onInventorySlotOut(index));
                this.inventorySlots.push(slot);

                // Icon
                const icon = this.add.image(x + 24, y + 24, 'item_gpu');
                icon.setVisible(false);
                this.inventoryIcons.push(icon);

                // Count
                const count = this.add.text(x + 42, y + 42, '', {
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3
                });
                count.setOrigin(1, 1);
                this.inventoryCounts.push(count);
            }
        }

        // Add all to container
        this.inventoryContainer.add(overlay);
        this.inventoryContainer.add(panel);
        this.inventoryContainer.add(title);
        this.inventorySlots.forEach(slot => this.inventoryContainer.add(slot));
        this.inventoryIcons.forEach(icon => this.inventoryContainer.add(icon));
        this.inventoryCounts.forEach(count => this.inventoryContainer.add(count));

        // Close button hint
        const closeHint = this.add.text(panelX + 300, panelY + 470, 'Press E or ESC to close', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#5d4c41'
        });
        closeHint.setOrigin(0.5);
        this.inventoryContainer.add(closeHint);
    }

    // Toolbar methods
    selectToolbarSlot(index) {
        this.inventory.selectedSlot = index;
        this.updateToolbarSelection();
    }

    updateToolbarSelection() {
        // Update all slot visuals
        this.toolbarSlots.forEach((slot, i) => {
            if (i === this.inventory.selectedSlot) {
                slot.setTexture('toolbar_slot_selected');
            } else {
                slot.setTexture('toolbar_slot');
            }
        });
    }

    updateToolbarItems() {
        // Update item icons and counts
        this.inventory.toolbar.forEach((item, i) => {
            if (item) {
                this.toolbarItems[i].setTexture(item.item);
                this.toolbarItems[i].setVisible(true);
                this.toolbarCounts[i].setText(item.count > 1 ? item.count : '');
            } else {
                this.toolbarItems[i].setVisible(false);
                this.toolbarCounts[i].setText('');
            }
        });
    }

    // Health/Energy methods
    updateHealthBar(percentage) {
        const visibleBars = Math.floor((percentage / 100) * 48);
        this.healthBarFills.forEach((fill, i) => {
            fill.setVisible(i < visibleBars);
        });
    }

    updateEnergyBar(percentage) {
        const visibleBars = Math.floor((percentage / 100) * 48);
        this.energyBarFills.forEach((fill, i) => {
            fill.setVisible(i < visibleBars);
        });
    }

    // Inventory menu methods
    toggleInventory() {
        this.inventoryMenuOpen = !this.inventoryMenuOpen;
        this.inventoryContainer.setVisible(this.inventoryMenuOpen);

        if (this.inventoryMenuOpen) {
            this.updateInventoryDisplay();
        }
    }

    closeInventory() {
        this.inventoryMenuOpen = false;
        this.inventoryContainer.setVisible(false);
    }

    updateInventoryDisplay() {
        this.inventory.full.forEach((item, i) => {
            if (item) {
                this.inventoryIcons[i].setTexture(item.item);
                this.inventoryIcons[i].setVisible(true);
                this.inventoryCounts[i].setText(item.count > 1 ? item.count : '');
            } else {
                this.inventoryIcons[i].setVisible(false);
                this.inventoryCounts[i].setText('');
            }
        });
    }

    onInventorySlotHover(index) {
        // Future: show tooltip
    }

    onInventorySlotOut(index) {
        // Future: hide tooltip
    }

    // Update methods
    updateAllDisplays() {
        if (this.gameState) {
            this.moneyText.setText(`${this.gameState.credits}g`);
        }
        this.updateToolbarItems();
    }

    updateUI(parent, key, data) {
        if (key === 'gameState') {
            this.gameState = data;
            this.moneyText.setText(`${this.gameState.credits}g`);
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

        if (key === 'playerHealth') {
            this.updateHealthBar(data);
        }

        if (key === 'playerEnergy') {
            this.updateEnergyBar(data);
        }
    }

    showNotification(message, color = 0xffffff) {
        // Stardew-style notification popup
        const notif = this.add.container(640, 100);
        notif.setScrollFactor(0);
        notif.setDepth(400);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x2a1a0f, 0.95);
        bg.fillRect(-150, -30, 300, 60);
        bg.fillStyle(0x4a3425);
        bg.fillRect(-145, -25, 290, 50);
        bg.fillStyle(0xf4e4c1);
        bg.fillRect(-140, -20, 280, 40);

        // Text
        const text = this.add.text(0, 0, message, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#5d4c41'
        });
        text.setOrigin(0.5);

        notif.add([bg, text]);

        // Fade out
        this.tweens.add({
            targets: notif,
            alpha: 0,
            y: 50,
            duration: 2000,
            delay: 1000,
            ease: 'Power2',
            onComplete: () => notif.destroy()
        });
    }
}
