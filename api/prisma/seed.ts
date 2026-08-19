import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ENDPOINTS = ["/api/health", "/api/feeds", "/api/posts", "/api/authors"];

function randomPastDate(daysBack: number): Date {
    const now = Date.now();
    const past = now - Math.random() * daysBack * 24 * 60 * 60 * 1000;
    return new Date(past);
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log("Seeding simulated data...");

    const authorNames = ["Taylor Casey", "Jamie Smith", "Alex Chen"];
    const authors = [];
    for (const name of authorNames) {
        authors.push(await prisma.author.create({ data: { name } }));
    }

    const feedData = [
        { title: "Course Announcements", url: "https://example.com/announcements", status: "active" },
        { title: "Research Updates", url: "https://example.com/research", status: "active" },
        { title: "Legacy Newsletter", url: "https://example.com/legacy", status: "inactive" },
        { title: "Broken Feed Source", url: "https://example.com/broken", status: "error" },
    ];
    const feeds = [];
    for (const f of feedData) {
        feeds.push(await prisma.feed.create({ data: f }));
    }

    const topics = ["Academic Life", "Learning & Teaching", "Technology", "Student Wellbeing", "Research", "Campus News"];
    const posts = [];
    for (let i = 0; i < 15; i++) {
        const post = await prisma.post.create({
            data: {
                title: `Sample Post ${i + 1}`,
                content: `Simulated content for post ${i + 1}, generated to populate the dashboard with realistic data.`,
                topic: pickRandom(topics),
                link: `https://example.com/post-${i + 1}`,
                feedId: pickRandom(feeds).id,
                authorId: pickRandom(authors).id,
                publishedAt: randomPastDate(30),
            },
        });
        posts.push(post);
    }

    const clientIds = Array.from({ length: 12 }, (_, i) => `sim-client-${i + 1}`);

    const logs = [];
    for (let i = 0; i < 400; i++) {
        const endpoint = pickRandom(ENDPOINTS);
        const isPostSpecific = endpoint === "/api/posts" && Math.random() > 0.5;
        const relatedPost = isPostSpecific ? pickRandom(posts) : null;

        logs.push({
            endpoint: relatedPost ? `/api/posts/${relatedPost.id}` : endpoint,
            method: "GET",
            clientId: pickRandom(clientIds),
            feedId: relatedPost ? relatedPost.feedId : null,
            status: 200,
            timestamp: randomPastDate(14),
        });
    }
    await prisma.requestLog.createMany({ data: logs });

    console.log(`Seeded ${authors.length} authors, ${feeds.length} feeds, ${posts.length} posts, ${logs.length} logs.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });