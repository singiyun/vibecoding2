export const ASSETS = {
    BACKGROUND: '/assets/bg-stadium.png', // Fallback to green gradient
    TOGEPI_BACK: '/assets/togepi-back.png', // Player (P1)
    TOGEPI_FRONT: '/assets/togepi-front.png', // CPU (P2)
};

export type MoveType = 'NORMAL' | 'ELECTRIC' | 'psychic' | 'water' | 'WATER' | 'poison' | 'GHOST';

export interface Move {
    name: string;
    type: MoveType;
    damage?: number;
    heal?: number;
    effect?: string; // e.g., 'defense_down'
    accuracy: number; // Used as Weight for probability
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export const DIFFICULTY_SETTINGS = {
    EASY: { hp: 180, damageMultiplier: 1.0, filter: 'none', label: '초급', reward: 100 },
    MEDIUM: { hp: 300, damageMultiplier: 1.2, filter: 'sepia(0.5) hue-rotate(-30deg) contrast(1.2) brightness(0.9)', label: '중급', reward: 150 }, // Sunsetish
    HARD: { hp: 400, damageMultiplier: 1.5, filter: 'brightness(0.4) contrast(1.3) hue-rotate(240deg) saturate(1.2)', label: '고급', reward: 200 } // Night/Dark
};


export const MOVES: Move[] = [
    { name: '몸통박치기', type: 'NORMAL', damage: 40, accuracy: 40 },
    { name: '10만볼트', type: 'ELECTRIC', damage: 70, accuracy: 30 },
    { name: '파괴광선', type: 'NORMAL', damage: 120, accuracy: 20 },
    { name: 'HP회복', type: 'NORMAL', heal: 60, accuracy: 40 },
    { name: '째려보기', type: 'NORMAL', effect: 'defense_down', accuracy: 40 },
    { name: '튀어오르기', type: 'water', damage: 0, accuracy: 60 },
    { name: '하이드로펌프', type: 'WATER', damage: 100, accuracy: 16 },
    { name: '방어', type: 'NORMAL', effect: 'protect', accuracy: 40 },
    { name: '맹독', type: 'poison', effect: 'toxic', accuracy: 20 },
    { name: '섀도볼', type: 'GHOST', damage: 70, accuracy: 40 },
    { name: '리프레쉬', type: 'NORMAL', effect: 'cure_status', accuracy: 20 },
];

export const ALL_POSSIBLE_MOVES = [
    '몸통박치기', '10만볼트', '파괴광선', 'HP회복', '째려보기', '튀어오르기',
    '하이드로펌프', '방어', '맹독', '섀도볼', '리프레쉬'
];

export function getRandomMove(): Move {
    const totalWeight = MOVES.reduce((sum, move) => sum + move.accuracy, 0);
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const move of MOVES) {
        cumulativeWeight += move.accuracy;
        if (random <= cumulativeWeight) {
            return move;
        }
    }

    // Fallback
    return MOVES[0];
}
