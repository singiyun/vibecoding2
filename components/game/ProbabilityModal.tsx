'use client';

import { motion } from 'framer-motion';
import { MOVES } from '@/lib/gameAssets';

interface ProbabilityModalProps {
    onClose: () => void;
}

export function ProbabilityModal({ onClose }: ProbabilityModalProps) {
    // Calculate total weight just in case (though we know it's 1.0)
    const totalWeight = MOVES.reduce((acc, move) => acc + move.accuracy, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border-4 border-green-500 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-300 via-green-500 to-green-300 animate-pulse" />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        📊 획득 확률표
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 text-sm">
                                <th className="p-2">기술명</th>
                                <th className="p-2">타입</th>
                                <th className="p-2 text-right">확률</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOVES.map((move) => {
                                const probability = (move.accuracy / totalWeight) * 100;
                                return (
                                    <tr key={move.name} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-bold text-white">{move.name}</td>
                                        <td className="p-3 text-sm text-gray-400">
                                            {move.type === 'NORMAL' && '노말'}
                                            {move.type === 'ELECTRIC' && '전기'}
                                            {(move.type === 'WATER' || move.type === 'water') && '물'}
                                            {move.type === 'poison' && '독'}
                                            {move.type === 'GHOST' && '고스트'}
                                            {move.type === 'psychic' && '에스퍼'}
                                        </td>
                                        <td className="p-3 text-right font-mono text-green-400">
                                            {Math.round(probability)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500 text-center">
                    * 모든 기술의 확률 가중치가 기존 대비 2배 적용된 상태입니다.
                </div>
            </motion.div>
        </div>
    );
}
