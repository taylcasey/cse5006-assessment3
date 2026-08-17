This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# RSS Server for LMS — Frontend (Assessment 1)

CSE5006 — Assessment 1: a frontend-only interface for an RSS Server feeding into a Learning Management System (LMS).

This assessment focuses exclusively on the **user interface** — layout, navigation, visual design, usability, and accessibility. RSS content is currently represented with static, placeholder data standing in for real feed content. Backend integration and live RSS processing are out of scope for this assessment and will be introduced in Assessment 2.

## Overview

The application provides four main pages — Home, About, Feeds, and Settings — plus a dynamic post detail page per feed item. It demonstrates a component-based React architecture, shared state management via Context, responsive design, a light/dark theme with persistence, and a full accessibility pass (semantic HTML, ARIA attributes, keyboard navigation, verified colour contrast).

## Tech Stack

- **Framework:** Next.js (App Router), React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (utility-first, with a custom CSS variable–based design token system for theming)
- **Fonts:** Spectral (headings), Inter (body) — loaded via `next/font/google`
- **State management:** React Context API (`SiteContext` / `SiteProvider`)
- **Version control:** Git, with feature-branch workflow

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/taylcasey/cse5006-assessment1.git
   cd cse5006-assessment1
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Requires Node.js v22 (LTS) or later.

## Project Structure

```
src/
├── app/                  # Routes (Next.js App Router)
│   ├── page.tsx           # Home
│   ├── about/              # About page (includes embedded walkthrough video)
│   ├── feeds/               # Feeds list + dynamic [id] post detail route
│   ├── settings/             # Theme and view mode preferences
│   ├── layout.tsx           # Root layout — shared Header/NavBar/Breadcrumbs/Footer
│   └── globals.css           # Design tokens, base styles, custom utility classes
├── components/            # Reusable UI components (Header, Footer, NavBar, Breadcrumbs, ThemeToggle, ViewToggle)
├── context/                # Shared app-wide state (SiteContext, SiteProvider)
└── data/                    # Static placeholder post data (stand-in for RSS content)
```

## Features

- **Responsive navigation** — horizontal nav bar on desktop, collapsing into an overlay hamburger menu on mobile, with sticky positioning
- **Breadcrumb navigation** — full trail on desktop, a single "Back" link on mobile, hidden on the homepage
- **Light/dark theme** — user-controlled, persisted via `localStorage`, applied through a shared Context provider
- **Card/list view toggle** for the Feeds page, also persisted via Context
- **Dynamic routing** — individual post pages generated from static data via Next.js's `[id]` dynamic segments
- **Accessibility** — semantic HTML throughout, ARIA attributes (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-labelledby`, etc.), a sitewide keyboard-visible focus system, a skip-to-content link, and WCAG AA–verified colour contrast across both themes
- **Embedded walkthrough video** on the About page, explaining the project and site navigation

## Known Limitations / Future Work

- RSS content is static placeholder data; real RSS feed parsing and backend integration are planned for Assessment 2
- A brief, unavoidable visual "flash" can occur on a genuine full page reload while the saved theme is read from `localStorage` (a documented hydration trade-off — does not occur during normal in-app navigation)
- Full design and architectural reasoning, including bugs encountered and trade-offs made, is documented in `DECISIONS.md`

## Author

Taylor C. — Student No. 23012738
LaTrobe University — CSE5006

## References

React. (n.d.). *React documentation*. https://react.dev/

Tailwind Labs. (n.d.). *Tailwind CSS documentation*. https://tailwindcss.com/docs

TypeScript. (n.d.). *TypeScript documentation*. https://www.typescriptlang.org/docs/

World Wide Web Consortium (W3C). (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

OpenJS Foundation. (n.d.). *Node.js documentation*. https://nodejs.org/docs/latest/api/