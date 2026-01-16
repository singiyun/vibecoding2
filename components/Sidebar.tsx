'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
    { name: '전체 고민', path: '/feed', icon: '🌍' },
    { name: '인기 고민', path: '/feed/popular', icon: '🔥' },
    { name: '내 활동', path: '/feed/me', icon: '👤' },
];

const CATEGORIES = [
    '연애', '진로', '인간관계', '학업', '기타'
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/5 bg-background/50 backdrop-blur-xl p-6">
            <Link href="/" className="text-2xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                MaumTalk
            </Link>

            <nav className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">메뉴</p>
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                        ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-green-500/10'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-2 pt-6 border-t border-white/5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">카테고리</p>
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat}
                            href={`/feed?category=${cat}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <span>{cat}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="mt-auto">
                <Link
                    href="/new"
                    className="flex items-center justify-center w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                    <span className="mr-2">✏️</span> 고민 나누기
                </Link>
            </div>
        </aside>
    );
}
