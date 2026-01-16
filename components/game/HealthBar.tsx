'use client';

import { MAX_HP } from "@/hooks/useGameState";

export function HealthBar({ current, max = MAX_HP, label }: { current: number, max?: number, label: string }) {
    const percent = Math.max(0, Math.min(100, (current / max) * 100));

    // Color logic: Green > 50% > Yellow > 20% > Red
    let colorClass = 'bg-green-500';
    if (percent <= 20) colorClass = 'bg-red-500 animate-pulse';
    else if (percent <= 50) colorClass = 'bg-yellow-500';

    return (
        <div className="w-48 sm:w-64 bg-black/60 backdrop-blur rounded-lg p-3 border-2 border-white/20 shadow-lg">
            <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-white text-lg tracking-wider">{label}</span>
                <span className="text-sm font-mono text-gray-300">{current}/{max}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                <div
                    className={`h-full transition-all duration-500 ease-out ${colorClass}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
