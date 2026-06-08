import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { formatRupiah, formatDate } from "@/utils/formatters";
import {
    Package,
    Truck,
    Users,
    AlertTriangle,
    TrendingUp,
    ArrowDownToLine,
    RotateCcw,
    Activity,
    Clock,
    ShoppingCart,
    ChevronRight,
    Sparkles,
    AlertCircle,
    Bell,
    Calendar
} from "lucide-react";
import CardUI from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function Card({ title, value, icon: Icon, color = "text-slate-800 dark:text-slate-100", gradient = "from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80" }) {
    return (
        <div className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl shadow-sm hover:shadow-xl border border-white/60 dark:border-slate-700/50 transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02]`}>
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-white/40 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</p>
                    {Icon && (
                        <div className={`p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-md border border-white/40 dark:border-slate-600/40 ${color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${color} drop-shadow-sm break-all`}>
                    {value}
                </h2>
            </div>
        </div>
    );
}

function CustomYearSelect({ value, onChange, options, className }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); setOpen(!open); }}
                className="w-full h-full text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-2 text-left flex justify-between items-center"
            >
                <span>{value}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-[60] top-full mt-1 right-0 w-full min-w-[4.5rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-[12.5rem] overflow-y-auto">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${value == opt ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Palet warna unik per nama produk
const PRODUCT_COLOR_PALETTE = [
    { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
    { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-700 dark:text-sky-300' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
    { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
    { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
    { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40', text: 'text-fuchsia-700 dark:text-fuchsia-300' },
    { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300' },
    { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300' },
    { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300' },
    { bg: 'bg-lime-100 dark:bg-lime-900/40', text: 'text-lime-700 dark:text-lime-300' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
];

function getProductColor(name, colorMap) {
    if (!colorMap[name]) {
        const idx = Object.keys(colorMap).length % PRODUCT_COLOR_PALETTE.length;
        colorMap[name] = PRODUCT_COLOR_PALETTE[idx];
    }
    return colorMap[name];
}

const PAGE_SIZE = 10;

function SalesTable({ latestSales = [], formatRupiah }) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(latestSales.length / PAGE_SIZE);
    const colorMap = {};

    const paginated = latestSales.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Data Penjualan</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{latestSales.length} total transaksi</p>
                    </div>
                </div>
                <Link href="/sales" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group">
                    Lihat Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-700 dark:text-slate-300 table-responsive-cards">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="px-5 py-4 text-center font-semibold w-12">No</th>
                            <th className="px-5 py-4 text-left font-semibold">Waktu</th>
                            <th className="px-5 py-4 text-left font-semibold">Nama Produk</th>
                            <th className="px-5 py-4 text-center font-semibold">Quantity</th>
                            <th className="px-5 py-4 text-right font-semibold">Total</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {paginated.length > 0 ? (
                            paginated.map((item, idx) => {
                                const globalIdx = page * PAGE_SIZE + idx;
                                const color = getProductColor(item.product_name, colorMap);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-200 group">
                                        {/* Nomor urut global */}
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {globalIdx + 1}
                                            </span>
                                        </td>

                                        {/* Waktu */}
                                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {formatDate(item.created_at)}
                                        </td>

                                        {/* Nama Produk — warna unik per nama */}
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
                                                <Package className="w-3 h-3" />
                                                {item.product_name}
                                            </span>
                                        </td>

                                        {/* Qty */}
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {item.qty}
                                            </span>
                                        </td>

                                        {/* Total */}
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(item.total)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                        <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="font-medium">Belum ada data penjualan</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Menampilkan {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, latestSales.length)} dari {latestSales.length} data
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ← Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${i === page
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Dashboard({
    stats = {},
    latestSales = [],
    chartData = [],
    currentPeriod = '7days',
    currentStart = '',
    currentEnd = '',
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);
    const months = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const [showFilter, setShowFilter] = useState(false);

    const initStartMonth = currentStart ? currentStart.split('-')[1] : "01";
    const initStartYear = currentStart ? currentStart.split('-')[0] : currentYear.toString();
    const initEndMonth = currentEnd ? currentEnd.split('-')[1] : "12";
    const initEndYear = currentEnd ? currentEnd.split('-')[0] : currentYear.toString();

    const [startMonth, setStartMonth] = useState(initStartMonth);
    const [startYear, setStartYear] = useState(initStartYear);
    const [endMonth, setEndMonth] = useState(initEndMonth);
    const [endYear, setEndYear] = useState(initEndYear);

    const applyCustomFilter = () => {
        const customStart = `${startYear}-${startMonth}`;
        const customEnd = `${endYear}-${endMonth}`;
        router.get('/dashboard', { period: 'custom_month', start: customStart, end: customEnd }, { preserveState: true, preserveScroll: true });
        setShowFilter(false);
    }

    if (!user) {
        return <div className="p-10 dark:text-slate-200 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    const role = user?.role ?? "cashier";

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 dark:from-indigo-900 dark:via-blue-900 dark:to-sky-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500/30 blur-2xl group-hover:bg-indigo-400/40 transition-all duration-700"></div>
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-sky-300/20 blur-xl animate-pulse"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium text-blue-50">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>{role === "admin" ? "Admin Area" : "Kasir Area"}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
                            {role === "admin"
                                ? "Dashboard Admin"
                                : "Dashboard Kasir"}
                        </h1>

                        <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-lg font-medium opacity-90 max-w-xl">
                            Selamat datang kembali, <span className="font-bold text-white">{user?.name || "User"}</span>! Pantau terus performa bisnismu hari ini.
                        </p>
                    </div>
                </div>

                {/* Compact Low Stock Alerts */}
                {stats.low_stock_products?.length > 0 && (
                    <div className="bg-white dark:bg-slate-800/50 border border-rose-100 dark:border-rose-900/20 p-3 rounded-3xl flex flex-col sm:flex-row items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                            <div className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30 animate-pulse shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Peringatan Stok!</h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                    {stats.low_stock} produk menipis: {stats.low_stock_products.map(p => p.name).join(', ')}
                                </p>
                            </div>
                        </div>
                        {role === "admin" && (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Link
                                    href="/receivings"
                                    className="flex-1 sm:flex-none text-center text-xs font-black bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-2xl hover:scale-105 transition-all active:scale-95"
                                >
                                    Detail
                                </Link>
                                <Link
                                    href="/receivings"
                                    className="flex-1 sm:flex-none text-center text-xs font-black bg-rose-600 text-white px-5 py-2.5 rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95"
                                >
                                    Restock
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ================= ADMIN ================= */}
                {role === "admin" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card
                                title="Total Stok Produk"
                                value={stats.products || 0}
                                icon={Package}
                                gradient="from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40"
                                color="text-indigo-600 dark:text-indigo-400"
                            />

                            <Card
                                title="Supplier"
                                value={stats.suppliers || 0}
                                icon={Truck}
                                gradient="from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-900/40"
                                color="text-purple-600 dark:text-purple-400"
                            />

                            <Card
                                title="Stok Menipis"
                                value={stats.low_stock || 0}
                                icon={AlertTriangle}
                                gradient="from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-900/40"
                                color="text-red-600 dark:text-red-400"
                            />

                            <Card
                                title="Penjualan Hari Ini"
                                value={formatRupiah(stats.sales_today)}
                                icon={TrendingUp}
                                gradient="from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/40"
                                color="text-emerald-600 dark:text-emerald-400"
                            />

                            <Card
                                title="Barang Masuk"
                                value={formatRupiah(stats.receiving_today)}
                                icon={ArrowDownToLine}
                                gradient="from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-900/40"
                                color="text-amber-600 dark:text-amber-400"
                            />

                            <Card
                                title="Total Retur"
                                value={stats.returns || 0}
                                icon={RotateCcw}
                                gradient="from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-900/40"
                                color="text-rose-600 dark:text-rose-400"
                            />

                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-6 my-6">
                            <CardUI className="h-auto flex flex-col min-h-[450px]">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Performa Penjualan</h2>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowFilter(!showFilter)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            Filter Periode
                                        </button>

                                        {showFilter && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}></div>
                                                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 p-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-4">
                                                        {/* Harian */}
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Harian</p>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <button onClick={() => { router.get('/dashboard', { period: '7days' }, { preserveState: true, preserveScroll: true }); setShowFilter(false); }} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${currentPeriod === '7days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>7 Hari</button>
                                                                <button onClick={() => { router.get('/dashboard', { period: '14days' }, { preserveState: true, preserveScroll: true }); setShowFilter(false); }} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${currentPeriod === '14days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>14 Hari</button>
                                                                <button onClick={() => { router.get('/dashboard', { period: '30days' }, { preserveState: true, preserveScroll: true }); setShowFilter(false); }} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${currentPeriod === '30days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>30 Hari</button>
                                                            </div>
                                                        </div>

                                                        <hr className="border-slate-100 dark:border-slate-700" />

                                                        {/* Hari Tertentu */}
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Hari Tertentu</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    { val: 'day_0', label: 'Senin' },
                                                                    { val: 'day_1', label: 'Selasa' },
                                                                    { val: 'day_2', label: 'Rabu' },
                                                                    { val: 'day_3', label: 'Kamis' },
                                                                    { val: 'day_4', label: 'Jumat' },
                                                                    { val: 'day_5', label: 'Sabtu' },
                                                                    { val: 'day_6', label: 'Minggu' }
                                                                ].map((day) => (
                                                                    <button
                                                                        key={day.val}
                                                                        onClick={() => { router.get('/dashboard', { period: day.val }, { preserveState: true, preserveScroll: true }); setShowFilter(false); }}
                                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPeriod === day.val ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                                    >
                                                                        {day.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <hr className="border-slate-100 dark:border-slate-700" />

                                                        {/* Bulan */}
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Bulan</p>
                                                            <div className="space-y-3">
                                                                <div className="flex flex-col gap-2">
                                                                    {/* Start Date */}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-slate-500 font-medium w-8 shrink-0">Dari:</span>
                                                                        <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="w-full min-w-0 text-xs rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:ring-indigo-500 focus:border-indigo-500 py-2 pr-8">
                                                                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                                                        </select>
                                                                        <CustomYearSelect value={startYear} onChange={setStartYear} options={years} className="w-[5.5rem] shrink-0" />
                                                                    </div>
                                                                    {/* End Date */}
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-slate-500 font-medium w-8 shrink-0">s/d:</span>
                                                                        <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="w-full min-w-0 text-xs rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 focus:ring-indigo-500 focus:border-indigo-500 py-2 pr-8">
                                                                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                                                        </select>
                                                                        <CustomYearSelect value={endYear} onChange={setEndYear} options={years} className="w-[5.5rem] shrink-0" />
                                                                    </div>
                                                                </div>
                                                                <button onClick={applyCustomFilter} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm hover:shadow-indigo-600/20 transition-all">
                                                                    Terapkan
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-h-[380px]">
                                    {/* Chart Summary Stats */}
                                    {chartData.length > 0 && (() => {
                                        const total = chartData.reduce((s, d) => s + (d.sales || 0), 0);
                                        const daysWithSales = chartData.filter(d => (d.sales || 0) > 0).length;
                                        const avg = daysWithSales > 0 ? Math.round(total / daysWithSales) : 0;
                                        const peak = Math.max(...chartData.map(d => d.sales || 0));
                                        const peakDay = chartData.find(d => d.sales === peak);
                                        return (
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/30 rounded-2xl p-4 border border-indigo-100/80 dark:border-indigo-800/30">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-1">Total</p>
                                                    <p className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">{formatRupiah(total)}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-900/30 rounded-2xl p-4 border border-violet-100/80 dark:border-violet-800/30">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 dark:text-violet-500 mb-1">Rata-rata</p>
                                                    <p className="text-base font-extrabold text-violet-700 dark:text-violet-300 leading-tight">{formatRupiah(avg)}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/30 rounded-2xl p-4 border border-emerald-100/80 dark:border-emerald-800/30">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 dark:text-emerald-500 mb-1">Tertinggi</p>
                                                    <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{formatRupiah(peak)}</p>
                                                    {peakDay && <p className="text-[10px] text-emerald-500 dark:text-emerald-500 mt-0.5 font-semibold">{peakDay.date}</p>}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <ResponsiveContainer width="100%" height={320}>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradSalesTop" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                                                    <stop offset="50%" stopColor="#818cf8" stopOpacity={0.2} />
                                                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gradSalesStroke" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#818cf8" />
                                                    <stop offset="50%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#4f46e5" />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="4 4"
                                                vertical={false}
                                                stroke="currentColor"
                                                className="text-slate-100 dark:text-slate-700/50"
                                                strokeOpacity={0.8}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                                dy={10}
                                                interval={chartData.length > 15 ? Math.floor(chartData.length / 8) : 0}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                width={100}
                                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                                tickFormatter={(value) => formatRupiah(value)}
                                            />
                                            {/* Average Reference Line */}
                                            {chartData.length > 1 && (() => {
                                                const refTotal = chartData.reduce((s, d) => s + (d.sales || 0), 0);
                                                const refDaysWithSales = chartData.filter(d => (d.sales || 0) > 0).length;
                                                const refAvg = refDaysWithSales > 0 ? Math.round(refTotal / refDaysWithSales) : 0;
                                                return (
                                                    <ReferenceLine
                                                        y={refAvg}
                                                        stroke="#a5b4fc"
                                                        strokeDasharray="5 4"
                                                        strokeWidth={1.5}
                                                        label={{ value: 'Rata-rata', fill: '#a5b4fc', fontSize: 10, fontWeight: 700, position: 'insideTopRight' }}
                                                    />
                                                );
                                            })()}
                                            <Tooltip
                                                cursor={{ stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 3' }}
                                                content={({ active, payload, label }) => {
                                                    if (!active || !payload?.length) return null;
                                                    return (
                                                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-900/60 px-4 py-3 min-w-[160px]" style={{ boxShadow: '0 20px 40px -8px rgba(99,102,241,0.25)' }}>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 dark:text-indigo-500 mb-2">{label}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Penjualan</p>
                                                                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{formatRupiah(payload[0].value)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <Area
                                                type="monotoneX"
                                                dataKey="sales"
                                                stroke="url(#gradSalesStroke)"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#gradSalesTop)"
                                                dot={false}
                                                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2.5, filter: 'url(#glow)' }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardUI>
                        </div>

                        <SalesTable
                            latestSales={latestSales}
                            formatRupiah={formatRupiah}
                        />
                    </>
                )}

                {/* ================= CASHIER ================= */}
                {role === "cashier" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card
                                title="Penjualan Hari Ini"
                                value={formatRupiah(stats.sales_today)}
                                icon={TrendingUp}
                                gradient="from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/40"
                                color="text-emerald-600 dark:text-emerald-400"
                            />

                            <Card
                                title="Stok Menipis"
                                value={stats.low_stock || 0}
                                icon={AlertTriangle}
                                gradient="from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-900/40"
                                color="text-red-600 dark:text-red-400"
                            />

                            <Card
                                title="Status Shift"
                                value="Aktif"
                                icon={Clock}
                                gradient="from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40"
                                color="text-indigo-600 dark:text-indigo-400"
                            />
                        </div>

                        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold mb-2 text-slate-800 dark:text-slate-100">
                                        Mulai Transaksi Baru
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Buka kasir sekarang untuk melayani pelanggan.
                                    </p>
                                </div>

                                <Link
                                    href="/sales"
                                    className="group/btn inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-transform" />
                                    Buka Kasir Sekarang
                                </Link>
                            </div>
                        </div>

                        <SalesTable
                            latestSales={latestSales}
                            formatRupiah={formatRupiah}
                        />
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
