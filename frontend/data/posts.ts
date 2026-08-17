interface Post {
    id: number;
    title: string;
    author: string;
    date: string;
    summary: string;
    content: string;
}

// Placeholder data for RSS blog posts
const posts: Post[] = [
    {
        id: 1,
        title: "Example Blog Post 1",
        author: "Taylor C.",
        date: "2026-07-01",
        summary: "Examining the nuances around harnessing AI to achieve work-life balance in academia.",
        content: "Academic staff are increasingly turning to AI tools to manage marking, correspondence, and literature reviews, freeing up hours previously lost to administrative overhead. This post explores where these tools genuinely reduce workload versus where they simply shift the burden elsewhere, and offers a framework for academics to evaluate whether a given tool is actually protecting their time or quietly eroding it.",
    },
    
    {
        id: 2,
        title: "Example Blog Post 2",
        author: "Jamie S.",
        date: "2026-07-08",
        summary: "A look at whether dynamic, feed-style content delivery improves student engagement over traditional slide decks.",
        content: "Traditional lecture slides present information in a fixed, linear order, regardless of what a student already knows or wants to explore further. This post examines early trials of feed-based content delivery in LMS platforms, where students can scroll through modular content blocks, react, and dive deeper into specific topics on demand, and asks whether this genuinely improves retention or simply repackages the same content in a more distracting format.",
    },

    {
        id: 3,
        title: "Example Blog Post 3",
        author: "Nico Y.",
        date: "2026-07-16",
        summary: "RSS feeds are seeing a resurgence in higher education as institutions look for lightweight, ad-free ways to distribute course content.",
        content: "While RSS fell out of mainstream consumer use over a decade ago, it never disappeared from technical and academic circles. This post traces why universities are reconsidering RSS as a backbone for LMS content distribution: no algorithmic gatekeeping, no advertising, and a simple, well-understood standard that plays nicely with accessibility tools and screen readers alike.",
    },

    {
        id: 4,
        title: "Example Blog Post 4",
        author: "Gregorio M.",
        date: "2026-07-21",
        summary: "What a decade of LMS usability studies tells us about student trust, navigation clarity, and the cost of clutter.",
        content: "Students consistently rank navigation clarity and predictability above visual polish when asked what makes an LMS feel trustworthy. This post walks through several published usability studies on campus LMS redesigns, highlighting recurring pain points, such as inconsistent breadcrumb behaviour and buried settings menus, and what current best practice suggests instead.",
    },
];

export default posts;