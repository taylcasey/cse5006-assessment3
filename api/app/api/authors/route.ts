import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const authors = await prisma.author.findMany();
    return NextResponse.json(authors);
}

export async function POST(request: Request) {
    const body = await request.json();
    const author = await prisma.author.create({
        data: { name: body.name, email: body.email },
    });
    return NextResponse.json(author, { status: 201 });
}