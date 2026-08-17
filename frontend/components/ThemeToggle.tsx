"use client";

import { useContext } from "react";
import { SiteContext } from "@/context/SiteContext";

// Segmented control for switching between light/dark theme via SiteContext
export default function ThemeToggle() {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error("ThemeToggle must be used within a SiteProvider");
    }
    const { theme, setTheme, mounted } = context;
    
    if (!mounted) {
            return (
                <div className="flex gap-4 justify-center" role="group" aria-label="Theme selection">
                    <div className="toggle-button invisible" aria-hidden="true">Light</div>
                    <div className="toggle-button invisible" aria-hidden="true">Dark</div>
                </div>
            );
        }

    return (
        <div className="flex gap-4 justify-center" role="group" aria-label="Theme selection">
            <button 
                aria-pressed={theme === "light"}
                className={`toggle-button ${
                    theme === "light" ? "bg-accent text-accent-complementary" : "bg-transparent text-muted border border-border"
                }`}
                onClick={() => setTheme("light")} >
                    Light
            </button>
            <button 
                aria-pressed={theme === "dark"}
                className={`toggle-button ${
                    theme === "dark" ? "bg-accent text-accent-complementary" : "bg-transparent text-muted border border-border"
                }`}
                onClick={() => setTheme("dark")} >
                    Dark
            </button>
        </div>
    );
}