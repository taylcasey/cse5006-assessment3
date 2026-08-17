import { NextResponse } from "next/server";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(request: Request) {
    const clientId = getClientId(request);
    await logRequest({ endpoint: "/api/health", method: "GET", clientId, status:200 });
    
    return NextResponse.json({
        status: "ok",
        service: "rss-api",
        timestamp: new Date().toISOString(),
    });
}