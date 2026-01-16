'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';

interface Post {
    id: number;
    title: string;
    category: string;
    createdAt: string;
    likes: number;
    authorId: string;
    _count?: {
        comments: number;
    };
}

export default function MyActivityPage() {
    const { identity, isLoading: isIdentityLoading } = useIdentity();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (identity) {
            fetchMyPosts();
        } else if (!isIdentityLoading) {
            setIsLoading(false);
        }
    }, [identity, isIdentityLoading]);

    const fetchMyPosts = async () => {
        try {
            const res = await fetch(`/api/posts?authorId=${identity}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch my posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString();
    };

    if (isIdentityLoading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/feed" className="text-gray-400 hover:text-white">← 목록</Link>
                    <h1 className="font-bold text-xl">내 활동</h1>
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-4">
                {!identity ? (
                    <div className="text-center py-20 text-gray-500">
                        식별 정보를 찾을 수 없습니다.
                    </div>
                ) : isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="mb-4">작성한 글이 없습니다.</p>
                        <Link href="/new" className="text-primary hover:underline">첫 글 작성하기</Link>
                    </div>
                ) : (
                    <div className="space-y-4 pb-20">
                        {posts.map((post) => (
                            <Link href={`/posts/${post.id}`} key={post.id} className="block">
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(post.createdAt)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold mb-3">{post.title}</h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            ❤️ {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {post._count?.comments || 0}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
