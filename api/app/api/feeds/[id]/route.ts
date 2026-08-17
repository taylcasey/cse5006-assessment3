import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    const feed = await prisma.feed.findUnique({
        where: { id: Number(id) },
        include: { posts: true },
    });
    if (!feed) {
        await logRequest({ endpoint: `/api/feeds/${id}`, method: "GET", clientId, feedId: Number(id), status: 404 });
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await logRequest({ endpoint: `/api/feeds/${id}`, method: "GET", clientId, feedId: feed.id, status: 200 });
    return NextResponse.json(feed);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    const body = await request.json();
    const feed = await prisma.feed.update({
        where: { id: Number(id) },
        data: {
            title: body.title,
            description: body.description,
            url: body.url,
        },
    });
    await logRequest({ endpoint: `/api/feeds/${id}`, method: "PUT", clientId, feedId: feed.id, status: 200 });
    return NextResponse.json(feed);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const clientId = getClientId(request);
    const { id } = await params;
    await prisma.feed.delete({ where: { id: Number(id) } });
    await logRequest({ endpoint: `/api/feeds/${id}`, method: "DELETE", clientId, feedId: Number(id), status: 200 });
    return NextResponse.json({ deleted: true });
}