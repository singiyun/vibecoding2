'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIdentity } from '@/hooks/useIdentity';
import { Button } from '@/components/ui/button';

interface Comment {
    id: number;
    content: string;
    authorId: string;
    createdAt: string;
    likes: number;
}

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    likes: number;
    authorId: string;
    comments: Comment[];
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { identity } = useIdentity();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [id, setId] = useState<string>('');

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            fetchPost(p.id);
        });
    }, [params]);

    const fetchPost = async (postId: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}`);
            if (res.ok) {
                setPost(await res.json());
            } else {
                alert('게시글을 찾을 수 없습니다.');
                router.push('/feed');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (targetId: number, targetType: 'POST' | 'COMMENT') => {
        if (!identity) return;
        // Optimistic UI update could be added here
        try {
            await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': identity,
                },
                body: JSON.stringify({ targetId, targetType }),
            });
            // create simple reload for now
            fetchPost(id);
        } catch (e) {
            console.error(e);
        }
    };

    const verifyIdentity = () => {
        if (!identity) {
            alert('식별 정보를 확인할 수 없습니다.');
            return false;
        }
        return true;
    }

    const handleDelete = async () => {
        if (!post || !verifyIdentity()) return;
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
                headers: { 'X-User-ID': identity! }
            });
            if (res.ok) {
                router.push('/feed');
            } else {
                alert('삭제 실패 (권한이 없거나 오류 발생)');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim() || !verifyIdentity()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': identity!,
                },
                body: JSON.stringify({ postId: post?.id, content: commentContent }),
            });

            if (res.ok) {
                setCommentContent('');
                fetchPost(id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!post) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="px-4 py-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md">
                <Link href="/feed" className="text-gray-400 hover:text-white">← 목록</Link>
                <div className="font-bold text-lg truncate px-4">{post.title}</div>
                <div className="w-10">
                    {identity === post.authorId && (
                        <button onClick={handleDelete} className="text-red-400 text-sm hover:text-red-300">삭제</button>
                    )}
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Post Content */}
                <article className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-lg leading-relaxed">{post.content}</div>

                    <div className="flex gap-4 py-4 border-b border-white/5">
                        <button
                            onClick={() => handleLike(post.id, 'POST')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            ❤️ <span className="font-bold">{post.likes}</span>
                        </button>
                    </div>
                </article>

                {/* Comment List */}
                <section className="space-y-4">
                    <h3 className="font-bold text-gray-400">댓글 {post.comments.length}개</h3>
                    <div className="space-y-3">
                        {post.comments.map(comment => (
                            <div key={comment.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-start">
                                <div className="min-w-0 flex-1 mr-4">
                                    <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
                                    <div className="text-xs text-gray-500 mt-2">
                                        {new Date(comment.createdAt).toLocaleString()}
                                        {identity === comment.authorId && <span className="ml-2 text-primary">내 댓글</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleLike(comment.id, 'COMMENT')}
                                    className="flex flex-col items-center text-xs text-gray-500 hover:text-red-400"
                                >
                                    ❤️ {comment.likes}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="fixed bottom-0 left-0 right-0 bg-background border-t border-white/5 p-4">
                    <div className="max-w-2xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="따뜻한 조언이나 위로를 남겨주세요."
                            className="flex-1 bg-white/5 rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button type="submit" disabled={isSubmitting || !commentContent}>전송</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
