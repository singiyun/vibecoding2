
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const postId = parseInt(id);

        if (isNaN(postId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                comments: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Get Post Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authorId = req.headers.get('X-User-ID');
        if (!authorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;
        const postId = parseInt(id);

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (post.authorId !== authorId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Post Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
