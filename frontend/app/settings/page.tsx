import ThemeToggle from "@/components/ThemeToggle";
import ViewToggle from "@/components/ViewToggle";

// SETTINGS PAGE: Theme and RSS view preference controls, via ThemeToggle/ViewToggle
export default function Settings() {
    return (
        <main className="text-center max-w-2xl mx-auto space-y-12 p-4">
            <h1 className="text-5xl">Settings</h1>
            <section aria-labelledby="theme-heading" className="border border-border rounded-lg p-6">
                <h2 id="theme-heading">Theme</h2>
                <p className="text-muted mb-6">Choose between light or dark mode for the theme.</p>
                <ThemeToggle />
            </section>
            <section aria-labelledby="view-heading" className="border border-border rounded-lg p-6">
                <h2 id="view-heading">View</h2>
                <p className="text-muted mb-6">Choose between card or list view for the RSS feed.</p>
                <ViewToggle />
            </section>
        </main>
    );
}