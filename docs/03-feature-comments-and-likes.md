# Task 03: UI Components Construction

## Context & Objectives
Build the visual layer of the game that reflects the current state. This includes the player characters, health bars, and the message log.

## Requirements from PRD
- **Layout**: P1 (Left/Bottom), P2 (Right/Top).
- **Health Bar**: Under name, HP text small on left.
- **Message Log**: Typing effect, bottom translucent box.
- **Orientation**: P1 flipped (scaleX(-1)), P2 normal.

## Implementation Steps
1.  **Game Container Layout**
    - Use CSS Grid or Flexbox to position P1 and P2.
    - **Mobile**: Stack vertically (P2 Top, P1 Bottom).
    - **Desktop**: Side by side (P1 Left, P2 Right diagonal).

2.  **Character Component**
    - Accepts `player` data.
    - Renders `FallbackImage` (Togepi).
    - Applies `scale-x-[-1]` for P1.
    - Reserved space for animation anchors.

3.  **HUD / Health Bar**
    - Create `HealthBar` component.
    - Smooth usage of CSS transition for width changes.
    - Display Name and numeric HP.

4.  **Message Log Component**
    - Fixed container at bottom.
    - Implement "Typewriter" effect hook: receives string, prints char by char.
    - Translucent background (`bg-black/50`).

## Deliverables
- [ ] Players positioned correctly on screen.
- [ ] Health bars update when props change.
- [ ] Message log displays text with typing effect.
