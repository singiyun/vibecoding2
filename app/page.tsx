'use client';

import Link from "next/link";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShopModal } from '@/components/game/ShopModal';
import { DeckModal } from '@/components/game/DeckModal';
import { ProbabilityModal } from '@/components/game/ProbabilityModal';
import { UpgradeModal } from '@/components/game/UpgradeModal';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function Home() {
  const { progress } = useUserProgress();
  const [showShop, setShowShop] = useState(false);
  const [showDeck, setShowDeck] = useState(false);
  const [showProbability, setShowProbability] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const addLog = (text: string) => {
    // Simple notification for Landing Page
    setNotification(text);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-black to-zinc-900 items-center justify-center relative overflow-hidden">
      {/* Decorative Background Elements - B&W Style */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[128px] mix-blend-overlay animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-500 rounded-full blur-[150px] mix-blend-overlay animate-pulse-slow delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay for texture */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03]"></div>

      {/* Top Bar for Shop/Deck */}
      <div className="absolute top-4 left-4 z-50 flex gap-4 animate-fade-in-down">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-500/50 flex items-center gap-2 text-white font-bold shadow-lg">
          <span>🪙</span>
          <span>{progress.coins}</span>
        </div>
        <button
          onClick={() => setShowShop(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="상점"
        >
          🏪
        </button>
        <button
          onClick={() => setShowDeck(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="가방"
        >
          🎒
        </button>
        <button
          onClick={() => setShowProbability(true)}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="확률표"
        >
          📊
        </button>
        <button
          onClick={() => setShowUpgrade(true)}
          className="bg-yellow-600 hover:bg-yellow-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="기술 강화"
        >
          ⚡
        </button>
      </div>

      {/* Simple Notification Toast */}
      <AnimatePresence>
        {notification && (
          <div className="absolute top-20 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg border border-gray-600 animate-fade-in">
            {notification}
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showShop && <ShopModal onClose={() => setShowShop(false)} addLog={addLog} />}
        {showDeck && <DeckModal onClose={() => setShowDeck(false)} />}
        {showProbability && <ProbabilityModal onClose={() => setShowProbability(false)} />}
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </AnimatePresence>

      <main className="z-10 flex flex-col items-center text-center px-4 space-y-16">
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500">
              손가락 흔들기<br />대전
            </span>
          </h1>

        </div>

        <div className="group relative">
          <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-gray-100 to-gray-600 opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <button
            onClick={() => {
              if (progress.deck.length !== 6) {
                addLog('기술을 6개 배치해야 대전을 시작할 수 있습니다!');
              } else {
                window.location.href = '/game';
              }
            }}
            className="relative inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-black transition-all bg-white rounded-none hover:scale-105 active:scale-95 shadow-2xl border border-gray-200 hover:border-white tracking-wider cursor-pointer"
          >
            <span className="relative z-10">GAME START</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        <div className="max-w-md w-full text-center space-y-2 text-gray-500 text-sm font-mono border-t border-white/10 pt-8 mt-8">
          <p>운명을 건 한 판 승부</p>
          <p>랜덤한 기술이 당신의 승패를 결정합니다.</p>
        </div>
      </main>

      <footer className="absolute bottom-6 text-xs text-gray-600 font-mono tracking-widest">
        © 2026 METRONOME BATTLE. CHANCE IS EVERYTHING.
      </footer>
    </div>
  );
}
