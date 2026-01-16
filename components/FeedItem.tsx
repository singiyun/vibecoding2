'use client';

import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    _count?: {
        comments: number;
        likes: number;
    };
}

export function FeedItem({ post }: { post: Post }) {
    // Simple formatting for date
    const date = new Date(post.createdAt).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
    });

    return (
        <Link
            href={`/feed/${post.id}`}
            className="block p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all group"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/10">
                    {post.category}
                </span>
                <span className="text-xs text-gray-500">{date}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {post.title}
            </h3>

            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                {post.content}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post._count?.likes || 0}
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post._count?.comments || 0}
                </div>
            </div>
        </Link>
    );
}
