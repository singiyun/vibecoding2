'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIdentity } from '@/hooks/useIdentity';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
    '연애', '진로', '인간관계', '학업', '기타'
];

export default function NewPostPage() {
    const router = useRouter();
    const { identity, isLoading } = useIdentity();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(CATEGORIES[4]); // Default to 기타
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        if (!identity) {
            alert('식별 정보를 불러오지 못했습니다.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': identity,
                },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            router.push('/feed');
        } catch (error) {
            console.error(error);
            alert('게시글 작성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="px-4 py-4 border-b border-white/5 flex items-center justify-between">
                <Link href="/" className="text-gray-400 hover:text-white">
                    ← 뒤로가기
                </Link>
                <h1 className="text-lg font-bold">고민 나누기</h1>
                <div className="w-16" /> {/* Spacer */}
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">카테고리</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="고민의 핵심을 적어주세요 (최대 50자)"
                            maxLength={50}
                            className="w-full bg-transparent text-2xl font-bold placeholder-gray-600 border-none focus:ring-0 px-0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="마음속 이야기를 털어놓으세요..."
                            className="w-full h-64 bg-white/5 rounded-xl p-4 text-base leading-relaxed placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            required
                        />
                        <div className="text-right text-xs text-gray-500">
                            {content.length}/1000
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitting || !title || !content}
                    >
                        {isSubmitting ? '게시 중...' : '익명으로 게시하기'}
                    </Button>

                    <p className="text-center text-xs text-gray-500">
                        작성된 글은 익명으로 게시되며, 브라우저 식별자를 통해<br />
                        내가 쓴 글 목록에서 다시 확인할 수 있습니다.
                    </p>
                </form>
            </main>
        </div>
    );
}
