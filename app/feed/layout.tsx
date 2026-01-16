'use client';

import { Sidebar } from '@/components/Sidebar';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>

            {/* Right Sidebar (Optional placeholder for trending/ads) */}
            <aside className="w-80 hidden xl:block p-8 sticky top-0 h-screen overflow-y-auto border-l border-white/5">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/5 border border-primary/10">
                    <h3 className="font-bold text-white mb-2">👋 환영합니다!</h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                        마음톡은 여러분의 솔직한 이야기를 기다립니다.
                        익명으로 자유롭게 고민을 나누고 위로를 받아보세요.
                    </p>
                </div>
            </aside>
        </div>
    );
}
