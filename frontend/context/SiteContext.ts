import { createContext } from "react";

interface SiteContextType {
    theme: string;
    setTheme: (value: string) => void;
    view: string;
    setView: (value: string) => void;
    mounted: boolean;
    setMounted: (value: boolean) => void;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);