'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGameState } from '@/hooks/useGameState';
import { HealthBar } from '@/components/game/HealthBar';
import { LogWindow } from '@/components/game/LogWindow';
import { PokemonSprite } from '@/components/game/PokemonSprite';
import { ShopModal } from '@/components/game/ShopModal';
import { DeckModal } from '@/components/game/DeckModal';
import { useUserProgress } from '@/hooks/useUserProgress';
import { MOVES, ASSETS, DIFFICULTY_SETTINGS, Difficulty } from '@/lib/gameAssets';

export default function GamePage() {
    const { gameState, turn, playerHP, cpuHP, playerDefense, cpuDefense, logs, currentMove, executeMove, floatingText, handleCoinGuess, addLog, winner, startGame, toxicCount, difficulty, setDifficulty } = useGameState();
    const { progress, addCoins } = useUserProgress();
    const [showShop, setShowShop] = useState(false);
    const [showDeck, setShowDeck] = useState(false);

    const router = useRouter();

    // Reward Effect
    const rewardGiven = useRef(false);
    useEffect(() => {
        if (gameState === 'GAME_OVER' && !rewardGiven.current) {
            rewardGiven.current = true;
            if (winner === 'PLAYER') {
                addCoins(DIFFICULTY_SETTINGS[difficulty].reward);
            } else if (winner === 'CPU') {
                addCoins(10);
            }
            // Delay redirect
            setTimeout(() => {
                // Optional: Show Game Over Modal instead of redirect? 
                // User didn't specify. Redirecting to start seems fine or just stay.
                // Existing code redirected.
                //    router.push('/'); // Let's keep specific redirect or stay?
                // Let's refresh/reload? Or just go to INIT? 
                // Hard reload to reset state is easiest for now.
                router.push('/');
            }, 3000);
        }
    }, [gameState, winner, addCoins]);



    // Refs for Animation
    const playerRef = useRef<HTMLDivElement>(null);
    const cpuRef = useRef<HTMLDivElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    // Auto-redirect on Game Over and Rewards
    useEffect(() => {
        if (gameState === 'GAME_OVER') {
            // Reward Logic
            // Since this effect might run multiple times on re-render, we need to be careful.
            // But GameState 'GAME_OVER' is stable.
            // However, React strict mode runs twice.
            // Safer to trigger reward in the State transition or use a flag.
            // For now, let's just assume UserProgress handles dedup or we do it once.
            // Actually, best place is when winner is SET.
        }
    }, [gameState]);

    // Better: Effect watching Winner
    useEffect(() => {
        if (!gameState.includes('GAME_OVER')) return;

        // This is a bit hacky to put side effects here that interact with another hook's local storage
        // but it's the integration point.
        // We should prevent double counting.
        // Let's just do it in the render logic? No.
        // We will make a ref to track if reward given for this session.
    }, [gameState]);

    // Actually, let's simplify.
    // When GameState changes to GAME_OVER.
    const rewardRef = useRef(false);
    useEffect(() => {
        if (gameState === 'GAME_OVER' && !rewardRef.current) {
            rewardRef.current = true;
            if (logs.some(l => l.text.includes('승리'))) { // Check log is safer than passing winner state if decoupled
                // Wait, we have access to useUserProgress.
                // But we need to call it.
            }
        }
        if (gameState === 'INIT') rewardRef.current = false;
    }, [gameState, logs]);

    // Animation Logic
    useEffect(() => {
        if (gameState === 'ANIMATING' && currentMove) {
            const attacker = turn === 'PLAYER' ? playerRef.current : cpuRef.current;
            const victim = turn === 'PLAYER' ? cpuRef.current : playerRef.current;

            const tl = gsap.timeline();

            // Reset
            gsap.set([attacker, victim], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });

            // Move Name Display 
            // (This could be a separate UI element, but for now relies on Logs)

            // 1. Attack Animation
            switch (currentMove.name) {
                case '몸통박치기':
                    const direction = turn === 'PLAYER' ? 100 : -100;
                    tl.to(attacker, { x: direction, duration: 0.2, ease: "power1.in" })
                        .to(attacker, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
                    break;
                case '10만볼트':
                    tl.to(attacker, { y: -20, duration: 0.2, yoyo: true, repeat: 3 })
                        .to(screenRef.current, { backgroundColor: 'white', duration: 0.1, yoyo: true, repeat: 5, clearProps: 'backgroundColor' }, "<");
                    break;
                case '파괴광선':
                    // Charge up
                    tl.to(attacker, { scale: 1.2, duration: 0.5, ease: "power2.in" })
                        // Shoot (Simulated by screen shake heavily)
                        .to(screenRef.current, { x: 10, duration: 0.05, yoyo: true, repeat: 10 })
                        .to(attacker, { scale: 1, duration: 0.2 });
                    break;
                case 'HP회복':
                    tl.to(attacker, { y: -10, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 })
                        .to(attacker, { filter: 'brightness(2) sepia(1) hue-rotate(90deg)', duration: 0.2, yoyo: true, repeat: 1, clearProps: 'filter' }, "<");
                    break;
                case '튀어오르기':
                    tl.to(attacker, { y: -100, duration: 0.5, ease: "power1.out", yoyo: true, repeat: 1 });
                    break;
                case '째려보기':
                    tl.to(attacker, { scale: 1.1, duration: 0.2 })
                        .to(victim, { opacity: 0.5, duration: 0.2, yoyo: true, repeat: 3, clearProps: 'opacity' });
                    break;
                default:
                    // Default tackle
                    tl.to(attacker, { x: turn === 'PLAYER' ? 50 : -50, duration: 0.2, yoyo: true, repeat: 1 });
            }

            // 2. Hit React (If damage)
            if (currentMove.damage) {
                tl.to(victim, { x: 5, duration: 0.05, yoyo: true, repeat: 5, delay: 0.1 }, "-=0.2");
                if (flashRef.current) {
                    tl.set(flashRef.current, { opacity: 0.3, backgroundColor: 'red' }, "<")
                        .to(flashRef.current, { opacity: 0, duration: 0.3 });
                }
            }

        }
    }, [gameState, currentMove, turn]);

    const handleFingerWag = () => {
        if (gameState === 'ACTION_PENDING' && turn === 'PLAYER') {
            // Use Player's Deck
            const deckMoveNames = progress.deck;
            const availableMoves = MOVES.filter(m => deckMoveNames.includes(m.name));

            // Strict Mode: ABSOLUTELY NO other skills than the 6 written ones.
            if (availableMoves.length === 0) {
                addLog('오류: 사용할 수 있는 기술이 없습니다! (덱을 확인해주세요)');
                return;
            }

            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            executeMove(randomMove, 'PLAYER');
        }
    };

    return (
        <div ref={screenRef} className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Top Bar: Coin & Menu */}
            <div className="absolute top-4 left-4 z-[60] flex gap-4">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/50 flex items-center gap-2 text-yellow-400 font-bold shadow-lg">
                    <span>🪙</span>
                    <span>{progress.coins}</span>
                </div>

                {gameState === 'INIT' && (
                    <>
                        {/* Shop and Deck moved to Title Screen */}
                    </>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showShop && <ShopModal onClose={() => setShowShop(false)} addLog={addLog} />}
                {showDeck && <DeckModal onClose={() => setShowDeck(false)} />}
            </AnimatePresence>

            {/* Background Layer with Darkening Overlay */}
            {/* Background Layer (Clean, no dark overlays) */}
            {/* Background Layer with Darkening Overlay */}
            {/* Background Layer (Clean, no dark overlays) */}
            <div
                className="absolute inset-0 bg-[url('/assets/bg-stadium.png')] bg-cover bg-center transition-all duration-1000"
                style={{ filter: DIFFICULTY_SETTINGS[difficulty]?.filter || 'none' }}
            />
            {/* Flash Overlay */}
            <div ref={flashRef} className="absolute inset-0 pointer-events-none z-50 opacity-0" />

            {/* Start Screen Overlay */}
            {gameState === 'INIT' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center animate-fade-in text-center p-8">
                        <h2 className="text-4xl font-black text-white mb-4 tracking-widest uppercase text-shadow-lg glitch-text">
                            BATTLE READY?
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg">상점과 가방을 정비하고 시작하세요!</p>

                        <p className="text-gray-300 mb-8 text-lg">상점과 가방을 정비하고 시작하세요!</p>

                        {/* Difficulty Selection */}
                        <div className="flex gap-4 mb-8 bg-black/40 p-2 rounded-xl border border-gray-700">
                            {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`px-6 py-2 rounded-lg font-bold transition-all ${difficulty === level
                                        ? 'bg-red-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                        }`}
                                >
                                    {DIFFICULTY_SETTINGS[level].label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={startGame}
                            className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 border-b-4 border-red-800 animate-pulse-slow"
                        >
                            BATTLE START
                        </button>

                        <Link href="/" className="mt-4 text-gray-400 hover:text-white underline text-sm transition-colors">
                            타이틀 화면으로 돌아가기
                        </Link>
                    </div>
                </div>
            )}

            {/* Coin Toss Overlay */}
            {gameState === 'COIN_TOSS' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center animate-fade-in text-center">
                        <span className="text-6xl mb-6 animate-bounce">🪙</span>
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-widest uppercase text-shadow-lg">동전 뒤집기</h2>
                        <p className="text-gray-300 mb-8 text-lg">앞면일까요, 뒷면일까요?</p>

                        <div className="flex gap-6">
                            <button
                                onClick={() => handleCoinGuess('HEADS')}
                                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl rounded-xl shadow-lg hover:scale-105 transition-all active:scale-95"
                            >
                                앞면 (Heads)
                            </button>
                            <button
                                onClick={() => handleCoinGuess('TAILS')}
                                className="px-8 py-4 bg-gray-600 hover:bg-gray-500 text-white font-bold text-xl rounded-xl shadow-lg hover:scale-105 transition-all active:scale-95"
                            >
                                뒷면 (Tails)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Container */}
            <div className="w-full max-w-5xl aspect-[4/3] sm:aspect-video relative rounded-3xl overflow-hidden shadow-2xl border-4 border-black/30 bg-black/20 backdrop-blur-sm game-container">

                {/* HUD: CPU */}
                <div className="absolute top-8 left-8 z-20">
                    <HealthBar current={cpuHP} max={DIFFICULTY_SETTINGS[difficulty].hp} label={`상대 (CPU)${toxicCount.CPU > 0 ? ' [독]' : ''}`} />
                </div>

                {/* HUD: Player */}
                <div className="absolute bottom-32 right-8 z-20">
                    <HealthBar current={playerHP} max={200} label={`나 (Player)${toxicCount.PLAYER > 0 ? ' [독]' : ''}`} />
                </div>

                {/* Sprites Area */}
                <div className="absolute inset-0 flex items-end justify-between px-16 pb-32 sm:pb-40">
                    {/* Player Sprite (Left Bottom) */}
                    <div className="relative z-10 translate-y-10">
                        <PokemonSprite
                            src={ASSETS.TOGEPI_BACK}
                            isPlayer={true}
                            innerRef={playerRef}
                        />
                        {playerDefense < 0 && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
                                <span className="text-2xl filter drop-shadow-md">🛡️⬇️</span>
                                <span className="text-red-500 font-bold text-sm bg-black/50 px-2 py-1 rounded ml-1">
                                    {playerDefense}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CPU Sprite (Right Top) */}
                    <div className="relative z-0 -translate-y-20">
                        <PokemonSprite
                            src={ASSETS.TOGEPI_FRONT}
                            isPlayer={false}
                            innerRef={cpuRef}
                        />
                        {cpuDefense < 0 && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
                                <span className="text-2xl filter drop-shadow-md">🛡️⬇️</span>
                                <span className="text-red-500 font-bold text-sm bg-black/50 px-2 py-1 rounded ml-1">
                                    {cpuDefense}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Damage/Heal Text */}
                {floatingText && (
                    <div
                        className="absolute z-50 animate-float-up font-bold text-4xl stroke-black stroke-2 drop-shadow-lg"
                        style={{
                            left: `${floatingText.x}%`,
                            top: `${floatingText.y}%`,
                            color: floatingText.color,
                            textShadow: '2px 2px 0 #000'
                        }}
                    >
                        {floatingText.text}
                    </div>
                )}

                {/* Log Window & Control */}
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col sm:flex-row gap-4 items-end z-30">
                    <div className="flex-1 w-full">
                        <LogWindow logs={logs} />
                    </div>

                    <div className="w-full sm:w-auto">
                        <button
                            onClick={handleFingerWag}
                            disabled={gameState !== 'ACTION_PENDING' || turn !== 'PLAYER'}
                            className={`w-full min-w-[200px] py-6 rounded-xl font-bold text-xl shadow-lg transition-all border-b-4 ${gameState === 'ACTION_PENDING' && turn === 'PLAYER'
                                ? 'bg-pink-500 hover:bg-pink-400 text-white border-pink-700 active:border-b-0 active:translate-y-1 animate-pulse'
                                : 'bg-gray-600 text-gray-400 border-gray-800 cursor-not-allowed'
                                }`}
                        >
                            {gameState === 'ACTION_PENDING' ? '👆 손가락흔들기!' : (gameState === 'GAME_OVER' ? '게임 종료' : '대기중...')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
