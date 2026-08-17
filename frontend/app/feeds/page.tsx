"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { SiteContext } from "@/context/SiteContext";

interface ApiPost {
    id: number;
    title: string;
    content: string;
    topic: string | null;
    imageUrl: string | null;
    link: string;
    publishedAt: string;
    feedId: number;
    authorId: number;
    feed: { id: number; title: string };
    author: { id: number; name: string };
}

interface Feed { id: number; title: string; }
interface Author { id: number; name: string; }

interface PostFormData {
    title: string;
    content: string;
    topic: string;
    imageUrl: string;
    link: string;
    feedId: string;
}

const emptyForm: PostFormData = {
    title: "", content: "", topic: "", imageUrl: "", link: "", feedId: "",
};

const TOPIC_OPTIONS = [
    "Academic Life",
    "Learning & Teaching",
    "Technology",
    "Student Wellbeing",
    "Research",
    "Campus News",
];

function getPreview(content: string, maxLength = 160): string {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "…";
}

export default function Feeds() {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error("Feeds must be used within a SiteProvider");
    }
    const { view } = context;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

    const [posts, setPosts] = useState<ApiPost[]>([]);
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showNewForm, setShowNewForm] = useState(false);
    const [newPost, setNewPost] = useState<PostFormData>(emptyForm);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<PostFormData>(emptyForm);

    // no login system defined, whoever is first in Authors table for now is the default poster.
    // This logic will be altered if/when user authentification is implemented.
    const defaultAuthor = authors[0];

    async function loadAll() {
        try {
            const [postsRes, feedsRes, authorsRes] = await Promise.all([
                fetch(`${apiUrl}/api/posts`),
                fetch(`${apiUrl}/api/feeds`),
                fetch(`${apiUrl}/api/authors`),
            ]);
            if (!postsRes.ok) throw new Error(`Posts API responded with ${postsRes.status}`);
            setPosts(await postsRes.json());
            setFeeds(await feedsRes.json());
            setAuthors(await authorsRes.json());
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!defaultAuthor) {
            alert("No author exists in the database yet — add one via Prisma Studio first.");
            return;
        }
        const res = await fetch(`${apiUrl}/api/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newPost.title,
                content: newPost.content,
                topic: newPost.topic || null,
                imageUrl: newPost.imageUrl || null,
                link: newPost.link || null,
                feedId: Number(newPost.feedId),
                authorId: defaultAuthor.id,
            }),
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error("Create failed:", res.status, errText);
            alert(`Failed to create post (status ${res.status}). Check the browser console for details.`);
            return;
        }
        setNewPost(emptyForm);
        setShowNewForm(false);
        loadAll();
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Delete this post? This can't be undone.");
        if (!confirmed) return;
        await fetch(`${apiUrl}/api/posts/${id}`, { method: "DELETE" });
        loadAll();
    }

    function startEdit(post: ApiPost) {
        setEditingId(post.id);
        setEditForm({
            title: post.title,
            content: post.content,
            topic: post.topic ?? "",
            imageUrl: post.imageUrl ?? "",
            link: post.link ?? "",
            feedId: String(post.feedId),
        });
    }

    async function handleUpdate(e: React.FormEvent, id: number) {
        e.preventDefault();
        const res = await fetch(`${apiUrl}/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: editForm.title,
                content: editForm.content,
                topic: editForm.topic || null,
                imageUrl: editForm.imageUrl || null,
                link: editForm.link || null,
            }),
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error("Update failed:", res.status, errText);
            alert(`Failed to update post (status ${res.status}). Check the browser console for details.`);
            return;
        }
        setEditingId(null);
        loadAll();
    }

    return (
        <main className="max-w-350 mx-auto space-y-12 p-4">
            <h1 className="text-center text-5xl">Feeds</h1>

            <div className="max-w-3xl mx-auto grid grid-cols-1 justify-center">
                <button
                    onClick={() => setShowNewForm((s) => !s)}
                    className=" max-w-m cursor-pointer border-2 border-border rounded-lg px-4 py-2 bg-background hover:bg-accent hover:text-white transition-colors"
                >
                    {showNewForm ? "Cancel" : "+ New Post"}
                </button>
                
                {showNewForm && (
                    <form onSubmit={handleCreate} className="mt-4 space-y-3 border-2 border-border rounded-lg p-4">
                        {defaultAuthor && (
                            <p className="text-sm text-muted">Posting as: {defaultAuthor.name}</p>
                        )}
                        <input required placeholder="Title" value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            className="w-full border rounded p-2" />
                        <textarea required placeholder="Content" value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            className="w-full border rounded p-2" rows={4} />
                        <select value={newPost.topic}
                            onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
                            className="w-full border rounded p-2 cursor-pointer">
                            <option value="">Select a topic (optional)…</option>
                            {TOPIC_OPTIONS.map((t) => <option className="text-black" key={t} value={t}>{t}</option>)}
                        </select>
                        <input placeholder="Image URL (optional)" value={newPost.imageUrl}
                            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                            className="w-full border rounded p-2" />
                        <input placeholder="Link (optional)" value={newPost.link}
                            onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                            className="w-full border rounded p-2" />
                        <select required value={newPost.feedId}
                            onChange={(e) => setNewPost({ ...newPost, feedId: e.target.value })}
                            className="w-full border rounded p-2 cursor-pointer">
                            <option value="">Select a feed…</option>
                            {feeds.map((f) => <option className="text-black" key={f.id} value={f.id}>{f.title}</option>)}
                        </select>
                        <button type="submit" className="cursor-pointer border-2 border-accent text-accent rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-colors">
                            Create Post
                        </button>
                    </form>
                )}
            </div>

            {loading && <p className="text-center text-muted">Loading feeds...</p>}
            {error && <p className="text-center text-red-500">Couldn&apos;t load feeds: {error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p className="text-center text-muted">No posts yet.</p>
            )}

            <div className={`grid text-left ${view === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-6`}>
                {posts.map((post) => {
                    if (editingId === post.id) {
                        return (
                            <form key={post.id} onSubmit={(e) => handleUpdate(e, post.id)}
                                className="border-2 border-border shadow-sm rounded-lg p-4 bg-background space-y-3">
                                <input required value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full border rounded p-2" />
                                <textarea required value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    className="w-full border rounded p-2" rows={4} />
                                <select value={editForm.topic}
                                    onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                                    className="w-full border rounded p-2 cursor-pointer">
                                    <option value="">Select a topic (optional)…</option>
                                    {TOPIC_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input placeholder="Image URL" value={editForm.imageUrl}
                                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                    className="w-full border rounded p-2" />
                                <input placeholder="Link (optional)" value={editForm.link}
                                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                                    className="w-full border rounded p-2" />
                                <div className="flex gap-2">
                                    <button type="submit" className="cursor-pointer border-2 border-accent text-accent rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-colors">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setEditingId(null)} className="cursor-pointer border-2 border-accent text-accent rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        );
                    }

                    const preview = getPreview(post.content);
                    return (
                        <article key={post.id} className="border-2 border-border shadow-sm rounded-lg p-4 bg-background">
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-sm text-muted">
                                {new Date(post.publishedAt).toLocaleDateString()} · {post.author.name}
                            </p>
                            <p>{preview}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <Link
                                    className="inline-flex items-center gap-1 text-accent font-medium hover:gap-4 hover:text-foreground focus-visible:text-foreground transition-all"
                                    href={`/feeds/${post.id}`}
                                >
                                    Read more <span aria-hidden="true">→</span>
                                    <span className="sr-only">about {post.title}</span>
                                </Link>
                                <button onClick={() => startEdit(post)} className="cursor-pointer text-sm underline text-accent hover:text-foreground transition-colors">Edit</button>
                                <button onClick={() => handleDelete(post.id)} className="cursor-pointer text-sm underline text-red-500">Delete</button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </main>
    );
}