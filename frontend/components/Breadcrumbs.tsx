"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

// BREADCRUMBS: tracks user's current location in the site hierarchy
// hidden entirely on the home page to avoid crowding navigation unneccessarily
// just shows as a "back" link to parent page when on small screens or mobile
export default function Breadcrumbs () {
    const pathname = usePathname(); 
        if (pathname === "/") {
            return <div className="h-10" aria-hidden="true" />;
        }

  
    // splits the path into segments (e.g. "/feeds/2" into ["feeds", "2"])
    // by removing the empty string produced by leading "/"    
    const segments = pathname.split("/").filter((segment) => segment !== "")
    // path one level up from current page to enable mobile "back" link
    const parentHref = "/" + segments.slice(0,-1).join("/");  
    

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 max-w-max text-xs p-2 mt-3 ml-2">
            <div className="hidden md:flex items-center gap-1">
                <Link className="breadcrumb-link" href="/">home</Link>
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    return (
                        <span key ={href} className="flex items-center gap-1">
                            <span aria-hidden="true">›</span>
                            <Link 
                                aria-current={isLast ? "page" : undefined}
                                className="breadcrumb-link" 
                                href={href}>{segment}</Link>
                        </span>           
                );
            })}
            </div>
            <div className="flex md:hidden">
                    <Link className="breadcrumb-link" href={parentHref}>
                    <span aria-hidden="true">←</span> Back</Link>          
            </div>
        </nav>
    )
}