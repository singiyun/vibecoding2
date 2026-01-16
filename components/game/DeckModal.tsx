'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserProgress } from '@/hooks/useUserProgress';
import { ALL_POSSIBLE_MOVES } from '@/lib/gameAssets';

interface DeckModalProps {
    onClose: () => void;
}

export function DeckModal({ onClose }: DeckModalProps) {
    const { progress, updateDeck } = useUserProgress();
    const [selectedMoves, setSelectedMoves] = useState<string[]>([...progress.deck]);

    // Sync state with progress when it loads/changes
    useEffect(() => {
        setSelectedMoves([...progress.deck]);
    }, [progress.deck]);

    const handleToggleMove = (moveName: string) => {
        if (selectedMoves.includes(moveName)) {
            // Cannot remove Splash if it's the only one? Or just enforce 'Splash' presence on save.
            setSelectedMoves(prev => prev.filter(m => m !== moveName));
        } else {
            if (selectedMoves.length >= 6) return; // Max 6
            setSelectedMoves(prev => [...prev, moveName]);
        }
    };

    const handleSave = () => {
        if (!selectedMoves.includes('튀어오르기')) {
            alert('튀어오르기(Splash)는 필수입니다!');
            return;
        }
        if (selectedMoves.length !== 6) {
            alert('기술은 반드시 6개를 선택해야 합니다!');
            return;
        }
        updateDeck(selectedMoves);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gray-800 border-4 border-blue-500 rounded-3xl p-6 max-w-2xl w-full shadow-2xl h-[80vh] flex flex-col"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">🎒 기술 배치 ({selectedMoves.length}/6)</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Array.from(new Set([...progress.inventory, ...Object.keys(progress.upgrades || {})])).map((moveName) => {
                            const isSelected = selectedMoves.includes(moveName);
                            const level = progress.upgrades?.[moveName] || 0;
                            const levelSuffix = level > 0 ? ` v${level}` : '';

                            // Filter out moves that are not in inventory AND level is 0 (should be covered by Set logic, but safety check)
                            // Actually, if it's in inventory OR upgrades, it's owned.

                            return (
                                <button
                                    key={moveName}
                                    onClick={() => handleToggleMove(moveName)}
                                    className={`p-4 rounded-xl border-2 transition-all relative ${isSelected
                                        ? 'bg-blue-600/50 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                        : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="font-bold">{moveName}{levelSuffix}</span>
                                    {moveName === '튀어오르기' && <span className="absolute top-1 right-1 text-xs text-yellow-400">★</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gray-700 text-white font-bold hover:bg-gray-600">
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 shadow-lg hover:scale-105 transition-transform"
                    >
                        저장하기
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
