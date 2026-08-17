"use client";

import { SiteContext } from "@/context/SiteContext";
import { useState, useEffect } from "react";

// reads blocking script in layout.tsx to determine React start state synchronisation
function getInitialTheme(): string {
    if (typeof document !== "undefined") {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
}

export default function SiteProvider({ children }: { children: React.ReactNode }) {
    
    // persistent site-wide state component to share theme and feed view in the app
    const [theme, setTheme] = useState(getInitialTheme);
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState("card");

    useEffect(() => {
        const savedView = localStorage.getItem("view");
        if (savedView) {
            setView(savedView);
        }
        setMounted(true);
    }, []);

    // If theme preference is dark, applies the dark class to <html> and saves the theme to localStorage
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        if (mounted) {
            localStorage.setItem("theme", theme);
        }
    }, [theme, mounted]);

    // View mode changes for RSS feed
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("view", view)
        }
    }, [view, mounted]);

    return (
        <SiteContext.Provider value={{theme, setTheme, view, setView, mounted, setMounted}}>
            {children}
        </SiteContext.Provider>
    )
}