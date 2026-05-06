import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Truck,
    Download,
    RotateCcw,
    ClipboardList,
    FileText,
    User,
    LogOut,
    Sun,
    Moon,
    Sparkles,
    Bell,
    Menu,
    X,
    ChevronDown
} from "lucide-react";

export default function AuthenticatedLayout({ user, children }) {
    const { url } = usePage();
    const role = user?.role ?? null;

    // Responsive Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Profile Dropdown State
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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

    // Close sidebar on route change on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [url]);

    // Guard jika user belum tersedia
    if (!user) return null;

    const MenuItem = ({ href, icon: Icon, children }) => {
        const isActive = url === href || url.startsWith(href + "/") || url.startsWith(href + "?");
        return (
            <Link
                href={href}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold ${isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-100/50 dark:shadow-none ring-1 ring-indigo-200/50 dark:ring-indigo-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm"
                    }`}
            >
                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-0.5'}`}>
                    {isActive && (
                        <div className="absolute inset-0 bg-indigo-400 dark:bg-indigo-500 blur-md opacity-20 rounded-full"></div>
                    )}
                    <Icon
                        className={`w-5 h-5 relative z-10 transition-colors duration-300 ${isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                            }`}
                    />
                </div>
                <span>{children}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                )}
            </Link>
        );
    };

    return (
        <div className="h-screen w-full bg-slate-50/50 dark:bg-slate-950 flex overflow-hidden transition-all duration-500 ease-in-out font-sans selection:bg-indigo-500/30">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                {/* Close Button for Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-6 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="h-20 px-8 flex items-center border-b border-slate-100 dark:border-slate-800/50 shrink-0">
                    <div className="relative group/logo cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur-md opacity-40 group-hover/logo:opacity-70 transition-opacity duration-500"></div>
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/30 transition-transform duration-500 group-hover/logo:scale-105 group-hover/logo:-rotate-3">
                            <Sparkles className="w-4 h-4 absolute opacity-40 -top-1 -right-1 group-hover/logo:animate-pulse" />
                            <span className="text-lg">L</span>
                        </div>
                    </div>

                    <div className="ml-4">
                        <h1 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                            LeleBek
                        </h1>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Manajemen Stok & Penjualan
                        </p>
                    </div>
                </div>

                {/* Menu */}
                <div className="p-5 flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {/* ADMIN */}
                    {role === "admin" && (
                        <>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase tracking-wider">
                                    Overview
                                </p>
                                <div className="space-y-1.5">
                                    <MenuItem href="/dashboard" icon={LayoutDashboard}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem href="/products" icon={Package}>
                                        Produk
                                    </MenuItem>
                                    <MenuItem href="/users" icon={Users}>
                                        Team
                                    </MenuItem>
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase tracking-wider">
                                    Business Flow
                                </p>
                                <div className="space-y-1.5">
                                    <MenuItem href="/sales" icon={ShoppingCart}>
                                        Penjualan
                                    </MenuItem>
                                    <MenuItem href="/suppliers" icon={Truck}>
                                        Supplier
                                    </MenuItem>
                                    <MenuItem href="/receivings" icon={Download}>
                                        Restock
                                    </MenuItem>
                                    <MenuItem href="/returns" icon={RotateCcw}>
                                        Refund & Retur
                                    </MenuItem>
                                    <MenuItem href="/stock-opnames" icon={ClipboardList}>
                                        Opname
                                    </MenuItem>
                                    <MenuItem href="/report" icon={FileText}>
                                        Laporan
                                    </MenuItem>
                                </div>
                            </div>
                        </>
                    )}

                    {/* CASHIER */}
                    {role === "cashier" && (
                        <>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase tracking-wider">
                                    Kasir Area
                                </p>
                                <div className="space-y-1.5">
                                    <MenuItem href="/dashboard" icon={LayoutDashboard}>
                                        Dashboard
                                    </MenuItem>
                                    <MenuItem href="/sales" icon={ShoppingCart}>
                                        Terminal POS
                                    </MenuItem>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Akun */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase tracking-wider">
                            Settings
                        </p>
                        <div className="space-y-1.5">
                            <MenuItem href="/profile" icon={User}>
                                Profil Saya
                            </MenuItem>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800/50 shrink-0">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full group flex items-center justify-center gap-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20"
                    >
                        <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                        <span>Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                {/* Decorative background blur for content area */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Topbar */}
                <header className="sticky top-0 z-20 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-8 flex items-center justify-between shrink-0 transition-all duration-500 ease-in-out">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            <span>Sistem</span>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <span className="text-indigo-600 dark:text-indigo-400">Workspace</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Notification Bell */}
                            <button className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden sm:block">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-slate-100 dark:border-slate-800"></span>
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                        {/* Store Status Indicator */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="hidden lg:inline">Toko Buka</span>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <div
                                className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 cursor-pointer group"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {user?.name || "User"}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                        {role === "admin" ? "Admin" : "Kasir"}
                                    </span>
                                </div>
                                <div className="relative flex items-center gap-1.5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                                            {user?.name?.charAt(0) || "U"}
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700/60 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2 sm:hidden">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{role === "admin" ? "Administrator" : "Kasir"}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Profil Saya
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {children}
                </main>
            </div>
        </div>
    );
}
