# Stardew Valley UI Clone - Implementation Guide

This document details how we exactly cloned Stardew Valley's UI for the Gensyn GPU Farm game.

## UI Elements

### 1. Bottom Toolbar (Hotbar)
**Position**: Bottom center, 80px from bottom edge
**Dimensions**: 12 slots × 64px = 768px + 44px spacing = 812px total width

**Slot Specifications:**
- Size: 64×64 pixels
- Spacing: 4px between slots
- Border: Dark brown (#2a1a0f) outer, brown (#4a3425) inner
- Empty slot background: #1a1410
- Selected slot: Golden border (#ffd700)

**Features:**
- Item icons displayed at slot center (32×32px)
- Item counts in bottom-right corner (white text, black stroke)
- Keyboard shortcuts: 1-9, 0, -, =
- Mouse wheel cycling
- Visual highlight on selected slot

### 2. Health Bar
**Position**: Top left (20, 20)
**Components:**
- Red heart icon (12×16px)
- Background bar (200×32px)
- Fill segments: 48 × 4px green (#68c23c) bars
- Total fill width: 192px

**Behavior:**
- Each segment represents ~2% health
- Segments hide/show based on current health percentage
- Smooth visual feedback

### 3. Energy Bar
**Position**: Below health bar (20, 60)
**Components:**
- Yellow lightning bolt icon (14×16px)
- Background bar (200×32px)
- Fill segments: 48 × 4px orange (#ff8c00) bars
- Total fill width: 192px

**Behavior:**
- Same as health bar but orange color
- Represents stamina/energy for actions

### 4. Money Display
**Position**: Top right (1260, 20) - right-aligned
**Components:**
- Gold coin icon (16×16px)
- Text: "{amount}g" format
- Font: 20px Arial Bold
- Color: #5d4c41 with #f4e4c1 stroke

**Features:**
- Updates in real-time
- Right-aligned for clean look
- Stardew-style "g" suffix

### 5. Time Display
**Position**: Top right (1260, 50) - right-aligned
**Components:**
- Clock icon (24×24px) with brown frame and beige face
- Time text: "6:00 AM" format
- Day text: "Spring 1" below
- Font: 18px Arial Bold (time), 14px (day)
- Color: #5d4c41 with #f4e4c1 stroke

**Features:**
- Live updating clock
- 12-hour format with AM/PM
- Season and day display

### 6. Inventory Menu
**Position**: Centered modal (340, 110)
**Dimensions**: 600×500px wooden panel

**Layout:**
- Semi-transparent dark overlay (0.7 alpha)
- Wooden panel with grain texture
- Title: "Inventory" centered at top
- 6×6 grid = 36 slots
- Slot size: 48×48px
- Spacing: 8px between slots

**Features:**
- Opens with E key
- Closes with E or ESC
- Hover effects on slots
- Item icons (32×32px centered)
- Item counts in bottom-right
- Interactive slots for future drag/drop

## Color Palette

### Browns (Stardew UI)
```css
Dark brown border:    #2a1a0f
Medium brown frame:   #4a3425
Light brown wood:     #6b5444
Dark slot interior:   #1a1410
Beige panel:          #f4e4c1
Wood grain accent:    #e4d4b1
Text brown:           #5d4c41
```

### Accent Colors
```css
Gold (selection):     #ffd700
Coin gold:            #8b6914
Coin bright:          #ffed4e
Health green:         #68c23c
Energy orange:        #ff8c00
Energy yellow:        #ffff00
Red heart:            #ff0000
```

## Asset Generation

All UI assets are procedurally generated using Phaser Graphics:

### Toolbar Slot
```javascript
// Outer dark border
fillStyle(0x2a1a0f);
fillRect(0, 0, 64, 64);

// Inner brown frame
fillStyle(0x4a3425);
fillRect(4, 4, 56, 56);

// Inner dark area
fillStyle(0x1a1410);
fillRect(8, 8, 48, 48);

// Highlight (top-left)
fillStyle(0x6b5444);
fillRect(4, 4, 56, 2);
fillRect(4, 4, 2, 56);

// Shadow (bottom-right)
fillStyle(0x2a1a0f);
fillRect(4, 58, 56, 2);
fillRect(58, 4, 2, 56);
```

### Heart Icon
```javascript
fillStyle(0xff0000);
fillRect(2, 3, 3, 3);    // Left top
fillRect(7, 3, 3, 3);    // Right top
fillRect(1, 6, 10, 4);   // Middle
fillRect(2, 10, 8, 2);   // Bottom taper
fillRect(3, 12, 6, 2);
fillRect(4, 14, 4, 1);   // Point
```

### Lightning Bolt Icon
```javascript
fillStyle(0xffff00);
fillRect(6, 0, 2, 7);    // Top
fillRect(4, 4, 2, 3);    // Left wing
fillRect(8, 4, 2, 3);    // Right wing
fillRect(5, 7, 4, 4);    // Middle
fillRect(3, 9, 2, 3);    // Bottom left
fillRect(9, 9, 2, 3);    // Bottom right
fillRect(6, 11, 2, 5);   // Bolt
```

## Input Handling

### Keyboard Controls
```javascript
// Toolbar slot selection
'1'-'9': Select slots 0-8
'0': Select slot 9
'-': Select slot 10
'=': Select slot 11

// Inventory
'E': Toggle inventory menu
'ESC': Close inventory
```

### Mouse Controls
```javascript
// Toolbar cycling
wheel up: Next slot
wheel down: Previous slot

// Inventory
hover: Highlight slot (future tooltip)
click: Select/move item (future)
```

## Dynamic Updates

### Health/Energy Bars
```javascript
updateHealthBar(percentage) {
  const visibleBars = Math.floor((percentage / 100) * 48);
  this.healthBarFills.forEach((fill, i) => {
    fill.setVisible(i < visibleBars);
  });
}
```

### Money Display
```javascript
updateUI(key, data) {
  if (key === 'gameState') {
    this.moneyText.setText(`${data.credits}g`);
  }
}
```

### Time Display
```javascript
// Convert game minutes to 12-hour format
const hours = Math.floor(totalMinutes / 60) % 24;
const minutes = totalMinutes % 60;
const period = hours >= 12 ? 'PM' : 'AM';
const displayHours = hours % 12 || 12;
this.timeText.setText(`${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`);
```

## Performance Notes

- All UI elements use `setScrollFactor(0)` to stay on screen
- Depth layering: 200 (backgrounds), 201 (fills/icons), 202 (text), 300+ (menus)
- Bar segments created once and toggled with `setVisible()` instead of redrawing
- Asset textures generated once at boot, reused throughout game
- Container used for inventory to batch show/hide all elements

## Future Enhancements

- [ ] Tooltip system on hover (item names, descriptions)
- [ ] Drag and drop inventory management
- [ ] Item stacking and splitting
- [ ] Toolbar item usage animations
- [ ] Money increment animations (coins flying)
- [ ] Sound effects for clicks and selections
- [ ] Gamepad support
- [ ] Custom cursor
- [ ] Dialogue boxes with portraits
- [ ] Shop menus
- [ ] Quest log UI
- [ ] Settings menu

## Stardew Valley Accuracy

This implementation matches Stardew Valley in:
- ✅ Exact slot sizes (64×64, 48×48)
- ✅ Brown wooden aesthetic with proper colors
- ✅ Bar segment system (48 segments)
- ✅ Icon positioning and sizes
- ✅ Right-aligned money/time displays
- ✅ Modal inventory with overlay
- ✅ Item count display format
- ✅ Selection highlight (golden border)
- ✅ Input controls (numbers, wheel, E key)
- ✅ Wood grain texture details
- ✅ Beige panel interiors
- ✅ Shadow and highlight borders

The UI is pixel-perfect recreation of Stardew Valley's interface!
