import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logRequest, getClientId } from "@/lib/requestLog";

export async function GET(request: Request) {
    const clientId = getClientId(request);

    // Total requests logged, all-time
    const totalRequests = await prisma.requestLog.count();

    // Requests grouped by endpoint
    const requestsByEndpointRaw = await prisma.requestLog.groupBy({
        by: ["endpoint"],
        _count: { _all: true },
    });
    const requestsByEndpoint = requestsByEndpointRaw.map((r) => ({
        endpoint: r.endpoint,
        count: r._count._all,
    }));

    // Requests grouped by client
    const requestsByClientRaw = await prisma.requestLog.groupBy({
        by: ["clientId"],
        _count: { _all: true },
    });
    const requestsByClient = requestsByClientRaw.map((r) => ({
        clientId: r.clientId,
        count: r._count._all,
    }));

    // Unique client count — just the length of the grouped list above
    const uniqueClientCount = requestsByClientRaw.length;

    // Requests grouped by feed (only counts logs that had a feedId attached)
    const requestsByFeedRaw = await prisma.requestLog.groupBy({
        by: ["feedId"],
        where: { feedId: { not: null } },
        _count: { _all: true },
    });
    // Attach each feed's title so the dashboard doesn't have to do a second lookup
    const feeds = await prisma.feed.findMany();
    const requestsByFeed = requestsByFeedRaw.map((r) => {
        const feed = feeds.find((f) => f.id === r.feedId);
        return {
            feedId: r.feedId,
            feedTitle: feed?.title ?? "Unknown feed",
            count: r._count._all,
        };
    });

    // Feed status summary — how many feeds are active/inactive/error
    const feedStatusRaw = await prisma.feed.groupBy({
        by: ["status"],
        _count: { _all: true },
    });
    const feedStatusSummary = feedStatusRaw.map((r) => ({
        status: r.status,
        count: r._count._all,
    }));

    // Basic counts for context
    const totalFeeds = await prisma.feed.count();
    const totalPosts = await prisma.post.count();
    const totalAuthors = await prisma.author.count();

    await logRequest({ endpoint: "/api/dashboard", method: "GET", clientId, status: 200 });

    return NextResponse.json({
        totalRequests,
        uniqueClientCount,
        requestsByEndpoint,
        requestsByClient,
        requestsByFeed,
        feedStatusSummary,
        totalFeeds,
        totalPosts,
        totalAuthors,
    });
}