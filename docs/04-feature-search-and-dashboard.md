# Task 04: GSAP Animations and Visual Effects

## Context & Objectives
Implement the "Magical" feel using GSAP. This is the core "Wow" factor of the game.

## Requirements from PRD
- **Moves**: Distinct animations for Tackle, Thunderbolt, Hyper Beam, Heal, Leer, Splash.
- **Timing**: 0.8s duration for moves.
- **Feedback**: Screen shake on damage, Flash on critical (optional).

## Implementation Steps
1.  **Animation Controller**
    - Create a `useEffect` that listens to `gameState.currentMove` during `ANIMATING` phase.
    - Trigger GSAP timeline based on the move name.

2.  **Specific Move Animations**
    - **Tackle**: Tween character position forward and back rapidly.
    - **Thunderbolt**: Flash screen yellow, shake character, show "Bolt" emoji/shape overlay.
    - **Hyper Beam**: Large beam (div scaleX expansion) from attacker to victim.
    - **Heal**: Green floating particles/hearts up from character.
    - **Leer**: Eye icon appears, target dims or shrinks slightly.
    - **Splash**: Character bounces once, water drop emoji.

3.  **Damage Feedback**
    - `shakeScreen()`: GSAP logic to shake the main container.
    - `showDamageNumber()`: Floating text "-40" appearing over victim.

## Deliverables
- [ ] All 6 moves have distinct visual feedback.
- [ ] Animations sync with State Machine (state changes *after* anim completes).
- [ ] Screen shake effects implemented.
