import { NextResponse } from "next/server";

let requestCount = 0;

export async function GET() {
    requestCount += 1;
    return NextResponse.json({ totalRequests: requestCount });
}