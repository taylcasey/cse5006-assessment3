import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const feeds = await prisma.feed.findMany();
    return NextResponse.json(feeds);
}

export async function POST(request: Request) {
    const body = await request.json();
    const feed = await prisma.feed.create({
        data: {
            title: body.title,
            description: body.description,
            url: body.url,
        },
    });
    return NextResponse.json(feed, { status: 201 });
}
