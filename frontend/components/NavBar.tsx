"use client";

import Link from "next/link";
import { useState } from "react";

// SITE NAVIGATION: full horizontal links on desktop/larger screens, collapsing into a hamburger menu
// on recognition of smaller screen space or mobile. Menu then becomes a drop-down that overlays page.
export default function NavBar() {
    // tracks if the mobile dropdown menu is currently open or not
    const [navOpen, setNavOpen] = useState(false);
    return (
        <nav className="flex gap-4 w-full p-4 sticky top-0 z-10 text-2xl font-bold bg-accent text-accent-complementary">
            <button
                className="focus-ring-on-accent md:hidden"
                onClick={() => setNavOpen(!navOpen)}
                aria-expanded={navOpen}
                aria-label="Toggle navigation menu"
                aria-controls="nav-menu"
            >
                ☰
            </button>
            <ul id="nav-menu" className={`${navOpen ? "flex" : "hidden"} flex-col absolute top-full left-0 w-full gap-4 p-4 bg-accent md:static md:flex md:flex-row md:w-auto md:p-0 md:bg-transparent`}>
                <li><Link href="/" className="focus-ring-on-accent" onClick={() => setNavOpen(false)}>Home</Link></li>
                <li><Link href="/about" className="focus-ring-on-accent" onClick={() => setNavOpen(false)}>About</Link></li>
                <li><Link href="/feeds" className="focus-ring-on-accent" onClick={() => setNavOpen(false)}>Feeds</Link></li>
                <li><Link href="/settings" className="focus-ring-on-accent" onClick={() => setNavOpen(false)}>Settings</Link></li>
            </ul>
        </nav>
    );
}