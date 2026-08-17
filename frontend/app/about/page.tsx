// ABOUT PAGE: brief project roadmap, author details, and embedded video instruction on
// how to navigate the app
export default function About() {
    return (
        <main className="max-w-3xl mx-auto p-4">
            <h1 className="text-5xl text-center">About the Project</h1>
            <section aria-labelledby="video-heading">
                <h2 id="video-heading">How to Navigate the Site</h2>
                <video 
                    controls
                    className="aspect-video w-full max-w-3xl mx-auto"
                    aria-label="Walkthrough of how to navigate the website">
                    <source src="/videos/about-page-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </section>
            <div className="grid grid-cols-2 gap-6 mt-5">
                <section aria-labelledby="roadmap-heading">
                    <h2 id="roadmap-heading">Project Roadmap</h2>
                    <ul>
                        <li>RSS Data</li>
                        <li>Back-end Feed Processing</li>
                    </ul>
                </section>
                <section aria-labelledby="developer-heading" className="text-right">
                    <h2 id="developer-heading">Developed By</h2>
                    <p>Taylor C. - 23012738</p>
                    <p>LaTrobe University</p>
                </section>
            </div>
        </main>
    );
}