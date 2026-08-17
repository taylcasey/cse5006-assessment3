import { prisma } from "./prisma";

interface LogParams {
    endpoint: string;
    method: string;
    clientId: string;
    feedId?: number;
    status: number;
}

// writes a row to requestLog. try/catch wrap to ensure failure does not affect API
export async function logRequest({ endpoint, method, clientId, feedId, status }: LogParams) {
    try {
        await prisma.requestLog.create({
            data: { endpoint, method, clientId, feedId, status },
        });
    } catch (err) {
        console.error("Failed to write request log:", err);
    }
}

// reads client identifier sent by frontend. "unknown" falback for requests that don't send one
export function getClientId(request: Request): string {
    return request.headers.get("x-client-id") ?? "unknown";
}