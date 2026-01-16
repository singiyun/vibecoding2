
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const authorId = req.headers.get('X-User-ID');
        if (!authorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { postId, content } = await req.json();

        if (!postId || !content) {
            return NextResponse.json({ error: 'Validation Error' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                authorId,
                postId: parseInt(postId),
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Create Comment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
