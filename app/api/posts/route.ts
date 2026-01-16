
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const authorId = req.headers.get('X-User-ID');

        if (!authorId) {
            return NextResponse.json(
                { error: 'Unauthorized: X-User-ID header missing' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, content, category } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Validation Error: Title and Content are required' },
                { status: 400 }
            );
        }

        if (title.length > 50) {
            return NextResponse.json(
                { error: 'Validation Error: Title too long' },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                category: category || '기타',
                authorId,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Create Post Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const q = searchParams.get('q');
        const authorId = searchParams.get('authorId');
        const limit = 20;

        const whereClause: any = {};

        if (q) {
            whereClause.OR = [
                { title: { contains: q } }, // Case-insensitive not supported in SQLite by default for simple strings in Prisma w/o mode 'insensitive', but check provider. 
                // Prisma + SQLite 'contains' is usually case-insensitive depending on collation, but safe basic impl here.
                { content: { contains: q } }
            ];
        }

        if (authorId) {
            whereClause.authorId = authorId;
        }

        const posts = await prisma.post.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: parseInt(cursor) } : undefined,
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: { comments: true }
                }
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('List Posts Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
