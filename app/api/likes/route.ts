
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('X-User-ID');
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { targetId, targetType } = await req.json();
        if (!targetId || !['POST', 'COMMENT'].includes(targetType)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_targetId_targetType: {
                    userId,
                    targetId,
                    targetType,
                },
            },
        });

        let liked = false;

        if (existingLike) {
            // Unlike
            await prisma.$transaction([
                prisma.like.delete({
                    where: { id: existingLike.id },
                }),
                targetType === 'POST'
                    ? prisma.post.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } })
                    : prisma.comment.update({ where: { id: targetId }, data: { likes: { decrement: 1 } } })
            ]);
        } else {
            // Like
            await prisma.$transaction([
                prisma.like.create({
                    data: { userId, targetId, targetType },
                }),
                targetType === 'POST'
                    ? prisma.post.update({ where: { id: targetId }, data: { likes: { increment: 1 } } })
                    : prisma.comment.update({ where: { id: targetId }, data: { likes: { increment: 1 } } })
            ]);
            liked = true;
        }

        return NextResponse.json({ liked });
    } catch (error) {
        console.error('Like toggle error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
