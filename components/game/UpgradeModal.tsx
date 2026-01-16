'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserProgress } from '@/hooks/useUserProgress';
import { MOVES } from '@/lib/gameAssets';

interface UpgradeModalProps {
    onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
    const { progress, upgradeMove } = useUserProgress();
    const [selectedMove, setSelectedMove] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Calculate move counts from inventory
    const moveCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        progress.inventory.forEach(name => {
            counts[name] = (counts[name] || 0) + 1;
        });
        return counts;
    }, [progress.inventory]);

    const handleUpgrade = (moveName: string) => {
        const success = upgradeMove(moveName);
        if (success) {
            setNotification(`${moveName} 강화 성공! (v${(progress.upgrades?.[moveName] || 0) + 1})`);
            setTimeout(() => setNotification(null), 2000);
        } else {
            setNotification('강화 실패 (재료 부족 또는 최대 레벨)');
            setTimeout(() => setNotification(null), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border-4 border-purple-500 rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 animate-pulse" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        ⚡ 기술 강화 <span className="text-sm font-normal text-gray-400">(중복 기술 5개 소모)</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">✕</button>
                </div>

                {notification && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg z-50 animate-fade-in-up">
                        {notification}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden flex-1">
                    {/* List */}
                    <div className="bg-black/50 rounded-xl border border-gray-700 overflow-y-auto custom-scrollbar p-2">
                        <div className="grid grid-cols-1 gap-2">
                            {MOVES.map(move => {
                                const count = moveCounts[move.name] || 0;
                                const level = progress.upgrades?.[move.name] || 0;
                                const isOwned = count > 0 || level > 0;

                                return (
                                    <div
                                        key={move.name}
                                        onClick={() => isOwned && setSelectedMove(move.name)}
                                        className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition-all ${selectedMove === move.name
                                            ? 'bg-purple-900/40 border-purple-500'
                                            : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700'
                                            } ${!isOwned ? 'opacity-50 grayscale' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{isOwned ? '📜' : '🔒'}</div>
                                            <div>
                                                <div className="font-bold text-gray-200">
                                                    {move.name}
                                                    {level > 0 && <span className="text-yellow-400 ml-1">v{level}</span>}
                                                </div>
                                                <div className="text-xs text-gray-400">보유량: {count}개</div>
                                            </div>
                                        </div>
                                        {level >= 5 ? (
                                            <span className="text-yellow-500 font-bold text-xs border border-yellow-500 px-2 py-1 rounded">MAX</span>
                                        ) : count >= 5 ? (
                                            <span className="text-green-400 font-bold text-xs border border-green-500 px-2 py-1 rounded animate-pulse">강화 가능</span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">{count}/5</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail & Action */}
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex flex-col items-center justify-center text-center">
                        {selectedMove ? (
                            <>
                                <h3 className="text-3xl font-bold text-white mb-2">{selectedMove}</h3>
                                <div className="text-purple-400 font-bold text-xl mb-6">
                                    Current: v{progress.upgrades?.[selectedMove] || 0}
                                </div>

                                <div className="space-y-2 mb-8 text-gray-300">
                                    <p>현재 위력: <span className="text-white font-bold">{progress.upgrades?.[selectedMove] ? `+${(progress.upgrades[selectedMove] || 0) * 10}%` : '0%'}</span></p>
                                    <p className="text-sm">⬇️ 강화 시 ⬇️</p>
                                    <p>다음 위력: <span className="text-green-400 font-bold">+{((progress.upgrades?.[selectedMove] || 0) + 1) * 10}%</span></p>
                                </div>

                                <div className="mb-8">
                                    <div className="text-sm text-gray-400 mb-1">강화 재료 (동일 기술)</div>
                                    <div className="text-2xl font-mono">
                                        <span className={(moveCounts[selectedMove] || 0) >= 5 ? 'text-green-400' : 'text-red-400'}>
                                            {moveCounts[selectedMove] || 0}
                                        </span>
                                        <span className="text-gray-500"> / 5</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpgrade(selectedMove)}
                                    disabled={(moveCounts[selectedMove] || 0) < 5 || (progress.upgrades?.[selectedMove] || 0) >= 5}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
                                >
                                    {(progress.upgrades?.[selectedMove] || 0) >= 5 ? '최대 레벨 도달' : '강화하기 (5개 소모)'}
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-500">
                                <span className="text-6xl block mb-4">⚡</span>
                                <p>강화할 기술을 목록에서 선택하세요.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
