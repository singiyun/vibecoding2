'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PokemonSpriteProps {
    src: string;
    isPlayer?: boolean; // If true, back view (bottom left)
    className?: string;
    innerRef?: React.RefObject<HTMLDivElement | null>;
}

export function PokemonSprite({ src, isPlayer, className, innerRef }: PokemonSpriteProps) {
    const [error, setError] = useState(false);

    return (
        <div ref={innerRef} className={`relative w-48 h-48 sm:w-64 sm:h-64 ${className}`}>
            {/* Shadow: More realistic radial shadow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-8 bg-black/50 rounded-[100%] blur-md transition-all duration-300" />

            {!error ? (
                <div className="absolute inset-0 animate-float">
                    <Image
                        src={src}
                        alt="Pokemon"
                        fill
                        className={`object-contain pixel-art drop-shadow-xl ${isPlayer ? 'scale-x-[-1]' : ''}`} // Player looks right
                        onError={() => setError(true)}
                        priority
                    />
                </div>
            ) : (
                // Fallback: A cute round shape
                <div className="w-full h-full flex items-center justify-center">
                    <div className={`w-32 h-40 rounded-full border-4 border-black relative ${isPlayer ? 'bg-pink-100' : 'bg-yellow-100'}`}>
                        {/* Eyes */}
                        <div className="absolute top-10 left-6 w-4 h-4 bg-black rounded-full" />
                        <div className="absolute top-10 right-6 w-4 h-4 bg-black rounded-full" />
                        {/* Mouth */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-2 bg-red-400 rounded-b-full" />
                    </div>
                    <span className="absolute -top-8 text-xs font-bold bg-white/10 px-2 py-1 rounded">
                        {isPlayer ? 'P1 (Fallback)' : 'CPU (Fallback)'}
                    </span>
                </div>
            )}
        </div>
    );
}
