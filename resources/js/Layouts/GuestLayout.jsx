import { Link } from '@inertiajs/react';
import { Store, Sun, Moon, ArrowLeft, Fish } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children, title, subtitle }) {
    // Dark mode state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark" ||
                   (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="h-screen overflow-hidden bg-[#FDFBF7] dark:bg-slate-950 text-[#1B2A22] dark:text-slate-100 selection:bg-[#789454] selection:text-white font-sans flex flex-col items-center justify-center px-4 py-2 relative transition-all duration-500 ease-in-out">
            
            {/* Top Navigation Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 max-w-[1400px] mx-auto">
                {/* Back Button */}
                <Link 
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white dark:border-slate-800 text-[#4A554E] dark:text-slate-300 hover:text-[#85A059] dark:hover:text-[#85A059] hover:-translate-x-1 transition-all shadow-sm font-semibold text-xs sm:text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Kembali ke Beranda</span>
                    <span className="sm:hidden">Kembali</span>
                </Link>

                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white dark:border-slate-800 text-[#4A554E] dark:text-slate-300 hover:text-[#85A059] dark:hover:text-[#85A059] transition-all hover:scale-110 shadow-sm"
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
            </div>

            {/* Background Effects (Matching Landing Page) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#85A059] opacity-10 dark:opacity-20 rounded-bl-full pointer-events-none -z-10 blur-3xl translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#85A059] opacity-10 dark:opacity-20 rounded-tr-full pointer-events-none -z-10 blur-3xl -translate-x-1/4 translate-y-1/4"></div>
                
                <svg className="absolute top-0 left-0 w-48 md:w-80 text-[#85A059] pointer-events-none -z-10 opacity-60 dark:opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M47.7,-57.2C59.4,-45.5,64.8,-27.1,68.2,-8.1C71.6,10.9,73,30.5,64.4,45C55.8,59.5,37.2,68.9,16.7,73.5C-3.8,78.1,-26.3,77.9,-42.6,67.3C-58.9,56.7,-69,35.8,-73.2,13.7C-77.4,-8.4,-75.7,-31.6,-64.1,-43.5C-52.5,-55.4,-31.1,-55.9,-12.3,-58.5C6.5,-61.1,25,-65.8,47.7,-57.2Z" transform="translate(50 50) scale(1.5)" />
                </svg>
            </div>

            {/* Content Container to manage height without scrolling */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center mt-6">
                {/* Logo */}
                <Link href="/" className="flex flex-col items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-[#85A059] flex items-center justify-center text-white shadow-xl shadow-[#85A059]/30 group-hover:scale-105 group-hover:-rotate-6 transition-all duration-500">
                        <Fish className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-[#1E2922] dark:text-white transition-colors duration-300">
                        LeleBek
                    </span>
                </Link>

                {/* Card */}
                <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-800 px-6 py-6 sm:px-8 sm:py-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl rounded-[2rem] transition-all duration-500 ease-in-out">
                    {title && (
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-black text-[#1B2A22] dark:text-white mb-1 tracking-tight">{title}</h2>
                            {subtitle && <p className="text-[#738079] dark:text-slate-400 font-medium text-sm">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
