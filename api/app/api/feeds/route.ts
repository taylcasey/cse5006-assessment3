import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(request: Request) {
    const clientId = getClientId(request);
    const feeds = await prisma.feed.findMany();
    await logRequest({ endpoint: "/api/feeds", method: "GET", clientId, status: 200 });
    return NextResponse.json(feeds);
}

export async function POST(request: Request) {
    const clientId = getClientId(request);
    const body = await request.json();
    const feed = await prisma.feed.create({
        data: {
            title: body.title,
            description: body.description,
            url: body.url,
        },
    });
    await logRequest({ endpoint: "/api/feeds", method: "POST", clientId, feedId: feed.id, status: 201 });
    return NextResponse.json(feed, { status: 201 });
}