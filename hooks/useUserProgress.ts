'use client';

import { useState, useEffect } from 'react';
import { MOVES, Move } from '@/lib/gameAssets';

const STORAGE_KEY = 'vibecoding-game-progress-v1';

export interface UserProgress {
    coins: number;
    inventory: string[]; // List of move names owned (allows duplicates)
    deck: string[]; // List of move names currently equipped
    upgrades: Record<string, number>; // Move Name -> Level (0-5)
}

const DEFAULT_DECK = ['몸통박치기', '10만볼트', '파괴광선', 'HP회복', '째려보기', '튀어오르기'];
const DEFAULT_PROGRESS: UserProgress = {
    coins: 300,
    inventory: [...DEFAULT_DECK],
    deck: [...DEFAULT_DECK],
    upgrades: {}
};

export function useUserProgress() {
    const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Initial Load
        const load = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    // Sanitize Deck: Ensure all deck moves are actually owned
                    // This fixes the bug where 'Hydro Pump' or others stick around after reset/bugs
                    // Allow moves that are in inventory OR have an upgrade level > 0
                    if (parsed.deck && parsed.inventory) {
                        parsed.deck = parsed.deck.filter((m: string) =>
                            parsed.inventory.includes(m) || (parsed.upgrades && parsed.upgrades[m] > 0)
                        );
                    }

                    setProgress({ ...DEFAULT_PROGRESS, ...parsed });
                } catch (e) {
                    console.error('Failed to load progress', e);
                }
            }
        };
        load();
        setLoaded(true);

        // Listen for external changes (other tabs or same tab updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) load();
        };

        const handleCustomEvent = () => load();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('vibecoding-progress-update', handleCustomEvent); // Custom event for same-tab updates

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('vibecoding-progress-update', handleCustomEvent);
        };
    }, []);

    const saveProgress = (newProgress: UserProgress) => {
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
        window.dispatchEvent(new Event('vibecoding-progress-update'));
    };

    const getLatestProgress = (): UserProgress => {
        if (typeof window === 'undefined') return progress;
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : progress;
    };

    const addCoins = (amount: number) => {
        const current = getLatestProgress();
        saveProgress({ ...current, coins: current.coins + amount });
    };

    const spendCoins = (amount: number) => {
        const current = getLatestProgress();
        if (current.coins >= amount) {
            saveProgress({ ...current, coins: current.coins - amount });
            return true;
        }
        return false;
    };

    const addMoveToInventory = (moveName: string) => {
        const current = getLatestProgress();
        // Allow duplicates for upgrade system
        saveProgress({ ...current, inventory: [...current.inventory, moveName] });
        return true;
    };

    const addMovesToInventory = (moveNames: string[]) => {
        const current = getLatestProgress();
        // Allow duplicates
        if (moveNames.length > 0) {
            saveProgress({ ...current, inventory: [...current.inventory, ...moveNames] });
            return moveNames;
        }
        return [];
    };

    const upgradeMove = (moveName: string) => {
        const current = getLatestProgress();
        const currentLevel = current.upgrades?.[moveName] || 0;

        if (currentLevel >= 5) return false;

        // Count copies in inventory
        const copies = current.inventory.filter(name => name === moveName).length;
        if (copies < 5) return false;

        // Remove 5 copies
        let removedCount = 0;
        const newInventory = current.inventory.filter(name => {
            if (name === moveName && removedCount < 5) {
                removedCount++;
                return false;
            }
            return true;
        });

        const newUpgrades = { ...current.upgrades, [moveName]: currentLevel + 1 };

        saveProgress({
            ...current,
            inventory: newInventory,
            upgrades: newUpgrades
        });
        return true;
    };

    const updateDeck = (newDeck: string[]) => {
        const current = getLatestProgress();
        if (newDeck.length > 6) return false;
        if (!newDeck.includes('튀어오르기')) return false;

        saveProgress({ ...current, deck: newDeck });
        return true;
    };

    return {
        progress,
        loaded,
        addCoins,
        spendCoins,
        addMoveToInventory,
        addMovesToInventory,
        updateDeck,
        upgradeMove
    };
}

