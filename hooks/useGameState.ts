'use client';

import { useState, useEffect, useRef } from 'react';
import { MOVES, Move, MoveType, getRandomMove, Difficulty, DIFFICULTY_SETTINGS } from '@/lib/gameAssets';
import { useUserProgress } from '@/hooks/useUserProgress';

type GameState = 'INIT' | 'COIN_TOSS' | 'TURN_START' | 'ACTION_PENDING' | 'ANIMATING' | 'CHECK_RESULT' | 'GAME_OVER';
type Turn = 'PLAYER' | 'CPU';

interface Log {
    id: string;
    text: string;
}

export const MAX_HP = 200;


export function useGameState() {
    const { progress } = useUserProgress();
    const [gameState, setGameState] = useState<GameState>('INIT');
    const [turn, setTurn] = useState<Turn>('PLAYER');
    const [playerHP, setPlayerHP] = useState(MAX_HP);
    const [cpuHP, setCpuHP] = useState(MAX_HP);
    const [playerDefense, setPlayerDefense] = useState(0);
    const [cpuDefense, setCpuDefense] = useState(0);
    const [toxicCount, setToxicCount] = useState({ PLAYER: 0, CPU: 0 }); // Track toxic turns
    const [protectActive, setProtectActive] = useState<{ PLAYER: boolean, CPU: boolean }>({ PLAYER: false, CPU: false });
    const [lastMoveName, setLastMoveName] = useState<{ PLAYER: string | null, CPU: string | null }>({ PLAYER: null, CPU: null });
    const [logs, setLogs] = useState<Log[]>([]);
    const [currentMove, setCurrentMove] = useState<Move | null>(null);
    const [lastDamage, setLastDamage] = useState<number | null>(null);
    const [winner, setWinner] = useState<'PLAYER' | 'CPU' | null>(null);
    const [floatingText, setFloatingText] = useState<{ id: string; text: string; x: number; y: number; color: string } | null>(null);
    const [rechargePending, setRechargePending] = useState<Turn | null>(null);
    const [currentLogId, setCurrentLogId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');

    const addLog = (text: string, customId?: string) => {
        const id = customId || Math.random().toString();
        setLogs((prev) => [...prev, { id, text }]);
    };

    const appendLog = (id: string, suffix: string) => {
        setLogs((prev) => prev.map(log => log.id === id ? { ...log, text: log.text + suffix } : log));
    };

    const executeMove = (move: Move, attacker: Turn) => {
        setCurrentMove(move);
        const logId = Math.random().toString();
        setCurrentLogId(logId);
        setCurrentLogId(logId);
        setGameState('ANIMATING');

        const upgradeLevel = (attacker === 'PLAYER' && progress.upgrades?.[move.name]) || 0;
        const nameSuffix = upgradeLevel > 0 ? ` v${upgradeLevel}` : '';

        addLog(`${attacker === 'PLAYER' ? '플레이어' : '상대'}의 ${move.name}${nameSuffix}!`, logId);

        // Logic is handled in the effect after animation time
    };

    const handleCoinGuess = (userChoice: 'HEADS' | 'TAILS') => {
        // Random coin result
        const coinSide = Math.random() < 0.5 ? 'HEADS' : 'TAILS';

        // Determine winner
        let winner: Turn = 'CPU';
        if (userChoice === coinSide) {
            winner = 'PLAYER';
        }

        addLog(`선택: ${userChoice === 'HEADS' ? '앞면' : '뒷면'}, 결과: ${coinSide === 'HEADS' ? '앞면' : '뒷면'}`);
        addLog(`${winner === 'PLAYER' ? '맞췄습니다! 플레이어' : '틀렸습니다... 상대'} 선공!`);

        setTurn(winner);

        // Delay to show result before starting turn
        setTimeout(() => {
            setGameState('TURN_START');
        }, 2000);
    };

    const startGame = () => {
        addLog(`난이도: ${DIFFICULTY_SETTINGS[difficulty].label} - 배틀 시작!`);
        setPlayerHP(MAX_HP);
        setCpuHP(DIFFICULTY_SETTINGS[difficulty].hp);
        setGameState('COIN_TOSS');
    };

    // State Machine Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === 'INIT') {
            // Wait for user to start
        } else if (gameState === 'COIN_TOSS') {
            // Wait for user interaction (handleCoinGuess)
        } else if (gameState === 'TURN_START') {
            // Check for recharge penalty
            if (rechargePending === turn) {
                timer = setTimeout(() => {
                    addLog(`${turn === 'PLAYER' ? '플레이어' : '상대'}는 움직일 수 없다! (반동)`);
                    setRechargePending(null); // Clear penalty
                    // Skip turn (simulate turn end)
                    setGameState('CHECK_RESULT');
                }, 1000);
            } else {
                // Reset Protect for the current turn player (their shield expires as they act)
                if (protectActive[turn]) {
                    setProtectActive(prev => ({ ...prev, [turn]: false }));
                }

                if (turn === 'CPU') {
                    timer = setTimeout(() => {
                        // CPU AI: Pick weighted random move
                        const randomMove = getRandomMove();
                        executeMove(randomMove, 'CPU');
                    }, 1000);
                } else {
                    setGameState('ACTION_PENDING');
                    addLog('당신의 차례입니다. 손가락흔들기를 사용하세요!');
                }
            }
        } else if (gameState === 'ANIMATING') {
            // Wait for animation (simulated here, but sync with GSAP in components ideally)
            timer = setTimeout(() => {
                if (currentMove) {
                    // Apply Effects
                    // Apply Effects
                    let finalDamage = 0;

                    if (currentMove.damage && currentMove.damage > 0) {
                        // Calculate Damage with Defense
                        const targetDefense = turn === 'PLAYER' ? cpuDefense : playerDefense;
                        let baseDamage = currentMove.damage;

                        // Apply Difficulty Multiplier for CPU
                        if (turn === 'CPU') {
                            baseDamage = Math.round(baseDamage * DIFFICULTY_SETTINGS[difficulty].damageMultiplier);
                        } else {
                            // Apply Upgrade Multiplier for Player
                            const level = progress.upgrades?.[currentMove.name] || 0;
                            if (level > 0) {
                                // +10% damage per level
                                baseDamage = Math.round(baseDamage * (1 + level * 0.1));
                            }
                        }

                        finalDamage = Math.max(1, baseDamage - targetDefense);

                        if (currentMove.name === '섀도볼') {
                            finalDamage = 0;
                            addLog('효과가 없다... (토게피는 노말 타입이다!)');
                        }

                        // Protect Logic
                        const target = turn === 'PLAYER' ? 'CPU' : 'PLAYER';
                        if (protectActive[target]) {
                            finalDamage = 0;
                            addLog('공격을 막아냈습니다!');
                        }
                        if (currentMove.name === '파괴광선') {
                            addLog('효과가 굉장했다!');
                            setRechargePending(turn); // Set penalty for next turn
                        }

                        if (finalDamage > 0) {
                            if (currentLogId) appendLog(currentLogId, ` (-${finalDamage})`);

                            if (turn === 'PLAYER') {
                                setCpuHP(prev => Math.max(0, prev - finalDamage));
                                setFloatingText({ id: Math.random().toString(), text: `-${finalDamage}`, x: 70, y: 20, color: 'red' });
                            } else {
                                setPlayerHP(prev => Math.max(0, prev - finalDamage));
                                setFloatingText({ id: Math.random().toString(), text: `-${finalDamage}`, x: 30, y: 60, color: 'red' });
                            }
                            setLastDamage(finalDamage);
                        }
                    } else if (currentMove.damage === 0) {
                        // Splash (No damage)
                        setLastDamage(0);
                        if (currentMove.name === '튀어오르기') {
                            addLog('효과가 전혀 없다...');
                        }
                    }

                    if (currentMove.heal) {
                        const heal = currentMove.heal;
                        if (currentLogId) appendLog(currentLogId, ` (+${heal})`);

                        if (turn === 'PLAYER') {
                            setPlayerHP(prev => Math.min(MAX_HP, prev + heal));
                            setFloatingText({ id: Math.random().toString(), text: `+${heal}`, x: 30, y: 60, color: 'green' });
                        } else {
                            const cpuMaxHP = DIFFICULTY_SETTINGS[difficulty].hp;
                            setCpuHP(prev => Math.min(cpuMaxHP, prev + heal));
                            setFloatingText({ id: Math.random().toString(), text: `+${heal}`, x: 70, y: 20, color: 'green' });
                        }
                    }

                    if (currentMove.effect === 'defense_down') {
                        if (turn === 'PLAYER') {
                            setCpuDefense(prev => prev - 10);
                            addLog('상대의 방어력이 떨어졌습니다!');
                        } else {
                            setPlayerDefense(prev => prev - 10);
                            addLog('플레이어의 방어력이 떨어졌습니다!');
                        }
                    }

                    if (currentMove.effect === 'toxic') {
                        if (turn === 'PLAYER') {
                            if (toxicCount.CPU > 0) {
                                addLog('상대는 이미 맹독에 걸려있습니다!');
                            } else {
                                setToxicCount(prev => ({ ...prev, CPU: prev.CPU + 1 }));
                                addLog('상대에게 맹독을 걸었습니다!');
                            }
                        } else {
                            if (toxicCount.PLAYER > 0) {
                                addLog('플레이어는 이미 맹독에 걸려있습니다!');
                            } else {
                                setToxicCount(prev => ({ ...prev, PLAYER: prev.PLAYER + 1 }));
                                addLog('플레이어가 맹독에 걸렸습니다!');
                            }
                        }
                    }

                    if (currentMove.effect === 'protect') {
                        // Consecutive Protect Check
                        // Upgrade: +10% chance per level to allow consecutive use
                        const level = (turn === 'PLAYER' && progress.upgrades?.['방어']) || 0;
                        const reuseChance = level * 0.1;
                        const canReuse = Math.random() < reuseChance;

                        if (lastMoveName[turn] === '방어' && !canReuse) {
                            addLog('그러나 실패했다! (연속 사용 불가)');
                            if (level > 0) addLog(`(연속 방어 실패: ${Math.round(reuseChance * 100)}% 확률)`);
                        } else {
                            setProtectActive(prev => ({ ...prev, [turn]: true }));
                            addLog(`${turn === 'PLAYER' ? '플레이어' : '상대'}는 방어태세를 갖췄다!`);
                            if (lastMoveName[turn] === '방어') {
                                addLog(`연속 방어 성공! (v${level})`);
                            }
                        }
                    }

                    if (currentMove.effect === 'cure_status') {
                        // Upgrade: Heal +10 HP per level
                        const level = (turn === 'PLAYER' && progress.upgrades?.['리프레쉬']) || 0;
                        const bonusHeal = level * 10;

                        if (turn === 'PLAYER') {
                            let healed = false;
                            if (toxicCount.PLAYER > 0) {
                                setToxicCount(prev => ({ ...prev, PLAYER: 0 }));
                                addLog('플레이어의 상태 이상이 회복되었습니다!');
                                healed = true;
                            }

                            if (bonusHeal > 0) {
                                setPlayerHP(prev => Math.min(MAX_HP, prev + bonusHeal));
                                setFloatingText({ id: Math.random().toString(), text: `+${bonusHeal}`, x: 30, y: 60, color: 'green' });
                                addLog(`리프레쉬 회복 효과! (+${bonusHeal})`);
                                healed = true;
                            }

                            if (!healed) addLog('그러나 아무 일도 일어나지 않았다...');
                        } else {
                            // CPU logic (assuming no upgrades for CPU currently)
                            if (toxicCount.CPU > 0) {
                                setToxicCount(prev => ({ ...prev, CPU: 0 }));
                                addLog('상대의 상태 이상이 회복되었습니다!');
                            } else {
                                addLog('그러나 아무 일도 일어나지 않았다...');
                            }
                        }
                    }
                }
                setGameState('CHECK_RESULT');
            }, 1500); // 1.5s for Animation
        } else if (gameState === 'CHECK_RESULT') {
            if (playerHP <= 0) {
                setWinner('CPU');
                setGameState('GAME_OVER');
                addLog('대전에서 패배했다... 눈앞이 깜깜해졌다. (코인 10개 획득.)');
            } else if (cpuHP <= 0) {
                setWinner('PLAYER');
                setGameState('GAME_OVER');
                addLog(`대전에서 이겼다!! 코인 ${DIFFICULTY_SETTINGS[difficulty].reward}개 획득!`);
            } else {
                // End of turn effects (Toxic)
                let toxicLog = '';
                let newPlayerHP = playerHP;
                let newCpuHP = cpuHP;

                if (toxicCount.PLAYER > 0) {
                    const dmg = 20;
                    newPlayerHP = Math.max(0, newPlayerHP - dmg);
                    toxicLog += `플레이어는 맹독으로 고통받고 있다! (-${dmg}) `;
                    setFloatingText({ id: Math.random().toString(), text: `-${dmg}`, x: 30, y: 60, color: 'purple' });
                }
                if (toxicCount.CPU > 0) {
                    const dmg = 20;
                    newCpuHP = Math.max(0, newCpuHP - dmg);
                    toxicLog += `상대는 맹독으로 고통받고 있다! (-${dmg}) `;
                    if (toxicCount.PLAYER === 0) {
                        setFloatingText({ id: Math.random().toString(), text: `-${dmg}`, x: 70, y: 20, color: 'purple' });
                    }
                }

                if (newPlayerHP !== playerHP) setPlayerHP(newPlayerHP);
                if (newCpuHP !== cpuHP) setCpuHP(newCpuHP);
                if (toxicLog) addLog(toxicLog);

                timer = setTimeout(() => {
                    // Check death from Toxic
                    if (newPlayerHP <= 0) {
                        setWinner('CPU');
                        setGameState('GAME_OVER');
                        addLog('플레이어가 맹독으로 쓰러졌습니다!');
                    } else if (newCpuHP <= 0) {
                        setWinner('PLAYER');
                        setGameState('GAME_OVER');
                        addLog('상대가 맹독으로 쓰러졌습니다!');
                    } else {
                        // Proceed to next turn
                        setLastMoveName(prev => ({ ...prev, [turn]: currentMove?.name || null }));
                        setTurn(prev => prev === 'PLAYER' ? 'CPU' : 'PLAYER');
                        setGameState('TURN_START');
                        setCurrentMove(null);
                        setLastDamage(null);
                        setFloatingText(null);
                    }
                }, 1000);
            }
        }

        return () => clearTimeout(timer);
    }, [gameState, turn, currentMove, playerDefense, cpuDefense, rechargePending, difficulty]);

    return {
        gameState,
        turn,
        playerHP,
        cpuHP,
        playerDefense,
        cpuDefense,
        logs,
        currentMove,
        lastDamage,
        winner,
        executeMove,
        floatingText,
        handleCoinGuess,
        addLog,
        startGame,
        toxicCount,
        difficulty,
        setDifficulty
    };
}
