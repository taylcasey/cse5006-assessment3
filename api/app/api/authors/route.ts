import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(request: Request) {
    const clientId = getClientId(request);
    const authors = await prisma.author.findMany();
    await logRequest({ endpoint: "/api/authors", method: "GET", clientId, status: 200 });
    return NextResponse.json(authors);
}

export async function POST(request: Request) {
    const clientId = getClientId(request);
    const body = await request.json();
    const author = await prisma.author.create({
        data: { name: body.name, email: body.email },
    });
    await logRequest({ endpoint: "/api/authors", method: "POST", clientId, status: 201 });
    return NextResponse.json(author, { status: 201 });
}