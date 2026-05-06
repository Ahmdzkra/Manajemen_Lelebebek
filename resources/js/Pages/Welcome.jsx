import { Head, Link } from '@inertiajs/react';
import { Leaf, Play, Fish, Egg, ShieldCheck, ArrowRight, LogIn, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
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
        <>
            <Head title="Welcome" />

            <div className="h-screen overflow-hidden bg-[#FDFBF7] dark:bg-slate-950 text-[#1B2A22] dark:text-slate-100 font-sans selection:bg-[#789454] selection:text-white relative flex flex-col transition-all duration-500 ease-in-out">

                {/* Abstract Background Blobs */}
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[#85A059] opacity-10 dark:opacity-20 rounded-bl-full pointer-events-none -z-10 blur-3xl translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#85A059] opacity-10 dark:opacity-20 rounded-tr-full pointer-events-none -z-10 blur-3xl -translate-x-1/4 translate-y-1/4"></div>

                {/* Top right solid shape from image */}
                <svg className="absolute top-0 right-0 w-[30rem] lg:w-[45rem] text-[#85A059] pointer-events-none -z-10 opacity-80 dark:opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M47.7,-57.2C59.4,-45.5,64.8,-27.1,68.2,-8.1C71.6,10.9,73,30.5,64.4,45C55.8,59.5,37.2,68.9,16.7,73.5C-3.8,78.1,-26.3,77.9,-42.6,67.3C-58.9,56.7,-69,35.8,-73.2,13.7C-77.4,-8.4,-75.7,-31.6,-64.1,-43.5C-52.5,-55.4,-31.1,-55.9,-12.3,-58.5C6.5,-61.1,25,-65.8,47.7,-57.2Z" transform="translate(150 50) scale(1.5)" />
                </svg>

                {/* Navbar */}
                <nav className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 py-8 flex items-center justify-between relative z-50 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Logo Icon */}
                        <div className="w-11 h-11 rounded-xl bg-[#85A059] flex items-center justify-center text-white shadow-lg shadow-[#85A059]/30">
                            <Fish className="w-7 h-7" />
                        </div>
                        <span className="text-[1.75rem] font-black tracking-tight text-[#1E2922] dark:text-white">
                            LeleBek
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 font-bold text-base text-[#4A554E] dark:text-slate-300">
                        <span className="text-[#85A059] relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-1 after:bg-[#85A059] after:rounded-full cursor-pointer">Beranda</span>
                        <span className="hover:text-[#85A059] transition-colors cursor-pointer">Produk</span>
                        <span className="hover:text-[#85A059] transition-colors cursor-pointer">Keunggulan</span>
                        <span className="hover:text-[#85A059] transition-colors cursor-pointer">Kontak</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[#4A554E] dark:text-slate-300 hover:text-[#85A059] transition-all hover:scale-110 shadow-sm"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            className="px-7 py-3 rounded-xl bg-[#85A059] text-white font-bold hover:bg-[#6e8549] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#85A059]/30 text-sm"
                        >
                            {auth.user ? 'Dashboard' : 'Masuk'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </nav>

                {/* Main Hero Section */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full max-w-[1800px] mx-auto px-6 lg:px-10 relative z-10 py-4 lg:py-0 overflow-hidden">

                    {/* Left Content */}
                    <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">
                        <div className="space-y-3 lg:space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#85A059]/10 border border-[#85A059]/20 text-[#85A059] font-bold text-xs lg:text-sm animate-fade-in uppercase tracking-wider">
                                <Leaf className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                <span>Distributor Lele & Telur Bebek</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-[5rem] font-black text-[#1E2922] dark:text-white leading-[1.0] tracking-tighter animate-fade-in-up">
                                Kualitas <span className="text-[#85A059]">Segar</span> <br />
                                Setiap Hari.
                            </h1>
                            <p className="text-base lg:text-xl text-[#738079] dark:text-slate-400 font-bold max-w-lg leading-relaxed animate-fade-in-up delay-100">
                                LeleBek menyajikan hasil ternak terbaik langsung ke dapur Anda.
                                Segar, higienis, dan penuh nutrisi untuk keluarga Indonesia.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 animate-fade-in-up delay-200 w-full sm:w-auto">
                            <Link
                                href={route('login')}
                                className="group relative px-8 py-4 lg:px-10 lg:py-5 bg-[#85A059] text-white rounded-xl font-black text-base lg:text-lg shadow-xl shadow-[#85A059]/30 hover:shadow-[#85A059]/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                <LogIn className="w-5 h-5" />
                                <span>Mulai Sekarang</span>
                            </Link>

                            <Link
                                href={route('register')}
                                className="px-8 py-4 lg:px-10 lg:py-5 bg-white dark:bg-slate-900 text-[#1E2922] dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-xl font-black text-base lg:text-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
                            >
                                <span>Daftar Akun</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Features Badges */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10 pt-2 animate-fade-in-up delay-300">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-md text-[#85A059] border border-slate-50 dark:border-slate-800">
                                    <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <div className="text-left">
                                    <p className="text-lg lg:text-xl font-black text-[#1E2922] dark:text-white">100%</p>
                                    <p className="text-xs lg:text-sm text-[#738079] dark:text-slate-400 font-bold">Higenis & Sehat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-md text-[#E5B55C] border border-slate-50 dark:border-slate-800">
                                    <Egg className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <div className="text-left">
                                    <p className="text-lg lg:text-xl font-black text-[#1E2922] dark:text-white">Pilihan</p>
                                    <p className="text-xs lg:text-sm text-[#738079] dark:text-slate-400 font-bold">Grade Terbaik</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="w-full lg:w-[50%] flex items-center justify-end relative mt-8 lg:mt-0 lg:pr-10 lg:translate-x-[-150px]">
                        <div className="relative w-full max-w-[650px] aspect-square animate-fade-in flex items-center justify-end">

                            {/* Massive glow for impact */}
                            <div className="absolute inset-0 bg-white/20 dark:bg-[#85A059]/10 blur-[100px] rounded-full pointer-events-none"></div>

                            <img
                                src="/images/lele_bebek_hero.png"
                                alt="Lele dan Telur Bebek"
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-[1.02] transition-transform duration-1000"
                                style={{ animation: 'float 6s ease-in-out infinite' }}
                            />
                        </div>
                    </div>
                </main>

                <footer className="w-full text-center py-6 text-[#738079] dark:text-slate-500 font-bold text-xs z-10 shrink-0 border-t border-slate-100 dark:border-slate-900/50">
                    &copy; {new Date().getFullYear()} Manajemen Lele Telur Bebek. Segar dari Alam.
                </footer>

                <style jsx>{`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-30px) rotate(2deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    .animate-fade-in { animation: fadeIn 1s ease-out; }
                    .animate-fade-in-up { animation: fadeInUp 1s ease-out; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
            </div>
        </>
    );
}

//test