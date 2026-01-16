# Task 01: Project Setup and Infrastructure

## Context & Objectives
Initialize the "Togepi Metronome Master" game environment within the existing Next.js project. The goal is to set up the page structure, install necessary animation libraries, and prepare asset fallback mechanisms.

## Requirements from PRD
- **Tech Stack**: Next.js, Tailwind CSS, GSAP.
- **Assets**: Fallback to shapes/emojis if images are missing.
- **Layout**: 1200x800 base, responsive for mobile.

## Implementation Steps
1.  **Install Dependencies**
    - Run `npm install gsap` to enable high-performance animations.

2.  **Page Structure Setup**
    - Create `app/game/page.tsx` as the main entry point.
    - Create `components/game/` directory for game-specific components.
    - Set up a container with `max-w-[1200px]` and `aspect-[3/2]` logic, centering it on screen.

3.  **Asset Management System**
    - Create a utility `lib/gameAssets.ts` or similar.
    - Define a mapping for images (background, togepi, effects).
    - Implement a `FallbackImage` component that renders a colored `div` with an emoji or label if the image fails to load or is missing.

4.  **Basic Styling (Tailwind)**
    - Config background colors for the game arena.
    - Ensure P1 and P2 positioning classes are ready (Flex/Grid placeholders).

## Deliverables
- [ ] `npm install gsap` completed.
- [ ] `/game` page accessible and renders a blank arena.
- [ ] `FallbackImage` component working (displays placeholder when no image).
