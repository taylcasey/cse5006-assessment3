import { NextResponse } from "next/server";
import { logRequest, getClientId } from "@/lib/requestLog";

let requestCount = 0;

export async function GET(request: Request) {
    requestCount += 1;
    const clientId = getClientId(request);
    await logRequest({ endpoint: "/api/count", method: "GET", clientId, status: 200 });

    return NextResponse.json({ totalRequests: requestCount });
}