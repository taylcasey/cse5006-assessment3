import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { feed: true, author: true },
    });
    if (!post) {
        await logRequest({ endpoint: `/api/posts/${id}`, method: "GET", clientId, status: 404 });
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await logRequest({ endpoint: `/api/posts/${id}`, method: "GET", clientId, feedId: post.feedId, status: 200 });
    return NextResponse.json(post);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    const body = await request.json();
    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
            title: body.title,
            content: body.content,
            topic: body.topic,
            imageUrl: body.imageUrl,
            link: body.link,
        },
    });
    await logRequest({ endpoint: `/api/posts/${id}`, method: "PUT", clientId, feedId: post.feedId, status: 200 });
    return NextResponse.json(post);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    await prisma.post.delete({ where: { id: Number(id) } });
    await logRequest({ endpoint: `/api/posts/${id}`, method: "DELETE", clientId, status: 200 });
    return NextResponse.json({ deleted: true });
}