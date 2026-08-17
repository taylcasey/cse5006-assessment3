import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const feed = await prisma.feed.findUnique({
        where: { id: Number(id) },
        include: { posts: true },
    });
    if (!feed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(feed);
    }

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json(feed);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await prisma.feed.delete({ where: { id: Number(id) } });
    return NextResponse.json({ deleted: true });
}