import Link from "next/link";

interface ApiPost {
    id: number;
    title: string;
    content: string;
    topic: string | null;
    imageUrl: string | null;
    link: string;
    publishedAt: string;
    feed: { id: number; title: string };
    author: { id: number; name: string };
}

async function getPost(id: string): Promise<ApiPost | null> {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/posts/${id}`, { cache: "no-store" });

    if (!res.ok) return null;
    return res.json();
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return (
            <main className="max-w-350 mx-auto space-y-6 p-4">
                <h1 className="text-3xl font-bold">Post Not Found</h1>
                <p className="text-muted mb-4">We couldn&apos;t find the post you were looking for. It may have been removed.</p>
                <Link href="/feeds" className="breadcrumb-link inline-block mt-2">← Back to Feeds</Link>
            </main>
        );
    }

    return (
        <main className="max-w-350 mx-auto space-y-12 p-4">
            <article className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <p className="text-sm text-muted mt-2">
                    {new Date(post.publishedAt).toLocaleDateString()} · {post.author.name}
                </p>
                <p className="mt-6">{post.content}</p>
                <Link href="/feeds" className="breadcrumb-link inline-block mt-4">← Back to Feeds</Link>
            </article>
        </main>
    );
}