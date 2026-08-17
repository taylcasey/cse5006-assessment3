"use client";

import { useContext } from "react";
import { SiteContext } from "@/context/SiteContext";

// Segmented control for switching between card/list RSS view via SiteContext
export default function ViewToggle() {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error ("ViewToggle must be used within a SiteProvider");
    }
    const { view, setView } = context;

    return (
        <div className="flex gap-4 justify-center" role="group" aria-label="RSS View selection">
            <button 
                aria-pressed={view === "card"}
                className={`toggle-button ${
                        view === "card" ? "bg-accent text-accent-complementary" : "bg-transparent text-muted border border-border"
                }`}
                onClick={() => setView("card")} >
                    Card
            </button>
            <button
                aria-pressed={view === "list"} 
                className={`toggle-button ${
                        view === "list" ? "bg-accent text-accent-complementary" : "bg-transparent text-muted border border-border"
                }`}
                onClick={() => setView("list")} >
                    List
            </button>
        </div>
    );
}