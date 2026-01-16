'use client';

import { Suspense } from 'react';
import { FeedItem } from '@/components/FeedItem';

// Mock data for initial display (since backend logic might be incomplete or empty)
const MOCK_POSTS = [
    {
        id: '1',
        title: '취업 준비가 너무 힘들어요',
        content: '매일 원서를 쓰고 떨어지고 반복하다 보니 자존감이 많이 낮아지네요.. 다른 분들은 어떻게 멘탈 관리 하시나요?',
        category: '진로',
        createdAt: new Date().toISOString(),
        _count: { likes: 12, comments: 5 }
    },
    {
        id: '2',
        title: '짝사랑 3년차, 고백해야 할까요?',
        content: '친구로 지낸지 벌써 3년.. 이제는 관계가 깨질까봐 두려워서 아무 말도 못하고 있어요.',
        category: '연애',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        _count: { likes: 45, comments: 23 }
    },
    {
        id: '3',
        title: '회사 인간관계 스트레스',
        content: '상사분이 너무 감정적이셔서 하루하루 눈치보느라 진이 다 빠집니다 ㅠㅠ',
        category: '인간관계',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        _count: { likes: 8, comments: 12 }
    }
];

export default function FeedPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">최신 고민</h1>
                <p className="text-gray-400">다른 사람들의 고민을 들어주고 공감해주세요.</p>
            </header>

            <div className="space-y-4">
                <Suspense fallback={<div>Loading...</div>}>
                    {MOCK_POSTS.map((post) => (
                        <FeedItem key={post.id} post={post} />
                    ))}
                    {/* 
                      TODO: Replace with actual data fetching:
                      const posts = await fetch('/api/posts').then(res => res.json()); 
                    */}
                </Suspense>
            </div>

            <div className="pt-8 text-center">
                <button className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors">
                    더 보기
                </button>
            </div>
        </div>
    );
}
