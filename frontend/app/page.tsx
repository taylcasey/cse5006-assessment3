import Link from "next/link"

// LANDING PAGE: project introduction, kept brief alongside card-style links as an additional navigation element
export default function Home () {
   return ( 
    <main className="text-center max-w-full mx-auto p-4">  
      <h1 className="text-7xl mb-5">RSS Web App</h1>
      <h2>Frontend design for LMS integration</h2>
      <p 
        className="border border-border p-4 rounded-lg max-w-3xl mx-auto mt-8 mb-8">
        This frontend is the first stage of a larger project that will result in a responsive, user-centred interface for navigating the RSS server within the LMS application. RSS content is currently placeholder and backend processing will be implemented at a later date. This frontend design applies React and usability principles, as well as responsive design practices.
        </p>

        <div className="items-center max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-accent-complementary">
          <Link href="/about" className="home-card">
              <h2 className="text-2xl font-semibold">About</h2>
              <p>Find out more about the project, and navigating the website.</p>
          </Link>
          <Link href="/feeds" className="home-card">
              <h2 className="text-2xl font-semibold">Feeds</h2>
              <p>Go straight to the RSS feeds to view posts.</p>
          </Link>
          <Link href="/settings" className="home-card">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <p>Set your theme and feed preferences.</p>
          </Link>

        </div>
    </main>
   )
}