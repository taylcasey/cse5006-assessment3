interface DashboardData {
    totalRequests: number;
    uniqueClientCount: number;
    requestsByEndpoint: { endpoint: string; count: number }[];
    requestsByClient: { clientId: string; count: number }[];
    requestsByFeed: { feedId: number; feedTitle: string; count: number }[];
    feedStatusSummary: { status: string; count: number }[];
    totalFeeds: number;
    totalPosts: number;
    totalAuthors: number;
}

async function getDashboardData(): Promise<DashboardData | null> {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    try {
        const res = await fetch(`${apiUrl}/api/dashboard`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function StatCard({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="border-2 border-border rounded-lg p-4 bg-background text-center">
            <p className="text-3xl font-bold text-accent">{value}</p>
            <p className="text-sm text-muted mt-1">{label}</p>
        </div>
    );
}

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
    const width = max > 0 ? Math.max((count / max) * 100, 4) : 0;
    return (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="text-muted">{count}</span>
            </div>
            <div className="w-full bg-border rounded h-3">
                <div className="bg-accent h-3 rounded" style={{ width: `${width}%` }} />
            </div>
        </div>
    );
}

// dashboard showing request totals, endpoint feed/client info, feed status - sourced from api
// RequestLog aggregation.
export default async function Dashboard() {
    const data = await getDashboardData();

    if (!data) {
        return (
            <main className="max-w-350 mx-auto space-y-6 p-4">
                <h1 className="text-center text-5xl">Dashboard</h1>
                <p className="text-center text-red-500">
                    Couldn&apos;t load dashboard data. Check API Server.
                </p>
            </main>
        );
    }

    const maxEndpointCount = Math.max(...data.requestsByEndpoint.map((e) => e.count), 1);
    const maxFeedCount = Math.max(...data.requestsByFeed.map((f) => f.count), 1);

    const noFeeds = data.totalFeeds === 0;
    const feedsWithNoPosts = data.totalFeeds > 0 && data.totalPosts === 0;
    const hasErrorFeeds = data.feedStatusSummary.some((s) => s.status === "error" && s.count > 0);

    return (
        <main className="max-w-350 mx-auto space-y-12 p-4">
            <h1 className="text-center text-5xl">Dashboard</h1>

            {noFeeds && (
                <div className="max-w-3xl mx-auto border-2 border-danger rounded-lg p-4 bg-background">
                    <p className="text-danger font-medium text-center">⚠ No feeds exist yet — the server has nothing to report on.</p>
                </div>
            )}
            {feedsWithNoPosts && (
                <div className="max-w-3xl mx-auto border-2 border-danger rounded-lg p-4 bg-background">
                    <p className="text-danger font-medium text-center">⚠ Feeds exist but no posts have been created yet.</p>
                </div>
            )}
            {hasErrorFeeds && (
                <div className="max-w-3xl mx-auto border-2 border-danger rounded-lg p-4 bg-background">
                    <p className="text-danger font-medium text-center">⚠ One or more feeds are reporting an error status and may not be fetching correctly.</p>
                </div>
            )}

            <section aria-labelledby="overview-heading" className="max-w-4xl mx-auto">
                <h2 id="overview-heading" className="text-center mb-4">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard label="Total Requests" value={data.totalRequests} />
                    <StatCard label="Unique Clients" value={data.uniqueClientCount} />
                    <StatCard label="Feeds" value={data.totalFeeds} />
                    <StatCard label="Posts" value={data.totalPosts} />
                    <StatCard label="Authors" value={data.totalAuthors} />
                </div>
            </section>

            <section aria-labelledby="endpoint-heading" className="max-w-3xl mx-auto border-2 border-border rounded-lg p-4 bg-background">
                <h2 id="endpoint-heading">Requests by Endpoint</h2>
                {data.requestsByEndpoint.length === 0 ? (
                    <p className="text-muted">No requests logged yet.</p>
                ) : (
                    data.requestsByEndpoint.map((e) => (
                        <Bar key={e.endpoint} label={e.endpoint} count={e.count} max={maxEndpointCount} />
                    ))
                )}
            </section>

            <section aria-labelledby="feed-heading" className="max-w-3xl mx-auto border-2 border-border rounded-lg p-4 bg-background">
                <h2 id="feed-heading">Requests by Feed</h2>
                {data.requestsByFeed.length === 0 ? (
                    <p className="text-muted">No feed-specific requests logged yet.</p>
                ) : (
                    data.requestsByFeed.map((f) => (
                        <Bar key={f.feedId} label={f.feedTitle} count={f.count} max={maxFeedCount} />
                    ))
                )}
            </section>

            <section aria-labelledby="client-heading" className="max-w-3xl mx-auto border-2 border-border rounded-lg p-4 bg-background">
                <h2 id="client-heading">Requests by Client</h2>
                {data.requestsByClient.length === 0 ? (
                    <p className="text-muted">No clients logged yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {data.requestsByClient.map((c) => (
                            <li key={c.clientId} className="flex justify-between text-sm border-b border-border pb-1">
                                <span className="font-mono truncate max-w-[70%]">{c.clientId}</span>
                                <span className="text-muted">{c.count} requests</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section aria-labelledby="status-heading" className="max-w-3xl mx-auto border-2 border-border rounded-lg p-4 bg-background">
                <h2 id="status-heading">Feed Status Summary</h2>
                {data.feedStatusSummary.length === 0 ? (
                    <p className="text-muted">No feeds to report status for.</p>
                ) : (
                    <div className="flex gap-4 flex-wrap">
                        {data.feedStatusSummary.map((s) => (
                            <div
                                key={s.status}
                                className={`px-4 py-2 rounded-lg border-2 ${
                                    s.status === "active"
                                        ? "border-accent text-accent"
                                        : s.status === "error"
                                        ? "border-danger text-danger"
                                        : "border-border text-muted"
                                }`}
                            >
                                {s.status}: {s.count}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}