# Task 02: Game Logic and State Machine

## Context & Objectives
Implement the core mechanics of the game using a finite state machine. This ensures the flow (Init -> Turn -> Action -> Animation -> Result) is strictly followed and robust.

## Requirements from PRD
- **State Machine**: INIT, TURN_START, ACTION_PENDING, ANIMATING, CHECK_RESULT.
- **Data**: Moves (Tackle, Thunderbolt, Hyper Beam, etc.) with specific probabilities and data.
- **Logic**: Random selection (Metronome), Damage calculation.

## Implementation Steps
1.  **Define Game Types & Constants**
    - Define `GameState`, `Player`, `Move` interfaces.
    - Create a constant `MOVES` array with probabilities (accumulated weights for RNG) and effects.

2.  **Develop State Hook (`useGameState`)**
    - Implement `useReducer` or `useState` to manage the game phase.
    - **INIT**: Handle name input and mode selection.
    - **TURN_START**: Handle logic for switching turns. If CPU turn, trigger `setTimeout` for 1.5s delay.
    - **ACTION_PENDING**: Wait for user input (Touch/Enter).

3.  **Metronome Logic checks**
    - Implement `castMetronome()` function:
      - Roll 0-100.
      - Select move based on probability distribution.
      - Update State to `ANIMATING`.

4.  **Result Checking**
    - After animation completes, check HP <= 0.
    - Transition to `GAME_OVER` or loop back to `TURN_START`.

## Deliverables
- [ ] State Machine implemented (can log state transitions to console).
- [ ] Metronome RNG logic verified (probabilities match PRD).
- [ ] Turn switching logic works (including CPU delay).
