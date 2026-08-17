import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(request: Request) {
    const clientId = getClientId(request);
    const posts = await prisma.post.findMany({
        include: { feed: true, author: true },
        orderBy: { publishedAt: "desc" },
    });
    await logRequest({ endpoint: "/api/posts", method: "GET", clientId, status: 200 });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const clientId = getClientId(request);
    const body = await request.json();
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            topic: body.topic,
            imageUrl: body.imageUrl,
            link: body.link,
            feed: { connect: { id: Number(body.feedId) } },
            author: { connect: { id: Number(body.authorId) } },
        },
    });
    await logRequest({ endpoint: "/api/posts", method: "POST", clientId, feedId: post.feedId, status: 201 });
    return NextResponse.json(post, { status: 201 });
}