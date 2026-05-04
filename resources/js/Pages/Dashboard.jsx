import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { formatRupiah } from "@/utils/formatters";
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
    Bell
} from "lucide-react";
import CardUI from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                <h2 className={`text-3xl font-extrabold tracking-tight ${color} drop-shadow-sm`}>
                    {value}
                </h2>
            </div>
        </div>
    );
}

function SalesTable({ latestSales = [], formatRupiah }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        Penjualan Terbaru
                    </h2>
                </div>
                <Link href="/sales" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 group">
                    Lihat Semua <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-5 text-left font-semibold">Transaksi / Produk</th>
                            <th className="px-6 py-5 text-left font-semibold">Qty</th>
                            <th className="px-6 py-5 text-left font-semibold">Total</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {latestSales.length > 0 ? (
                            latestSales.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {item.id.startsWith('T') ? <ShoppingCart className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                            </div>
                                            {item.name}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {item.qty}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(item.total)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center">
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
        </div>
    );
}

export default function Dashboard({
    stats = {},
    latestSales = [],
    chartData = [],
    currentPeriod = '7days',
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) {
        return <div className="p-10 dark:text-slate-200 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    const role = user?.role ?? "cashier";

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 dark:from-indigo-900 dark:via-blue-900 dark:to-sky-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500/30 blur-2xl group-hover:bg-indigo-400/40 transition-all duration-700"></div>
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-sky-300/20 blur-xl animate-pulse"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium text-blue-50">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>{role === "admin" ? "Admin Area" : "Kasir Area"}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                            {role === "admin"
                                ? "Dashboard Admin"
                                : "Dashboard Kasir"}
                        </h1>

                        <p className="text-blue-100 dark:text-blue-200 text-lg font-medium opacity-90 max-w-xl">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card
                                title="Total Produk"
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
                                title="User Aktif"
                                value={stats.users || 0}
                                icon={Users}
                                gradient="from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-900/40"
                                color="text-sky-600 dark:text-sky-400"
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

                            <Card
                                title="Status Bisnis"
                                value="Stabil"
                                icon={Activity}
                                gradient="from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-900/40"
                                color="text-teal-600 dark:text-teal-400"
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
                                    <select
                                        value={currentPeriod}
                                        onChange={(e) => router.get('/dashboard', { period: e.target.value }, { preserveState: true, preserveScroll: true })}
                                        className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
                                    >
                                        <optgroup label="Harian">
                                            <option value="7days">7 Hari Terakhir</option>
                                            <option value="14days">14 Hari Terakhir</option>
                                            <option value="30days">30 Hari Terakhir</option>
                                        </optgroup>
                                        <optgroup label="Periode">
                                            <option value="weekly">Per Minggu (8 Minggu)</option>
                                            <option value="monthly">Per Bulan (12 Bulan)</option>
                                            <option value="yearly">Per Tahun (5 Tahun)</option>
                                        </optgroup>
                                        <optgroup label="Hari Tertentu">
                                            <option value="day_0">Setiap Senin</option>
                                            <option value="day_1">Setiap Selasa</option>
                                            <option value="day_2">Setiap Rabu</option>
                                            <option value="day_3">Setiap Kamis</option>
                                            <option value="day_4">Setiap Jumat</option>
                                            <option value="day_5">Setiap Sabtu</option>
                                            <option value="day_6">Setiap Minggu</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="flex-1 w-full min-h-[350px]">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                                dy={10}
                                                interval={chartData.length > 15 ? Math.floor(chartData.length / 8) : 0}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                width={100}
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                                                tickFormatter={(value) => formatRupiah(value)}
                                            />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value) => [formatRupiah(value), 'Penjualan']}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="sales" 
                                                stroke="#4f46e5" 
                                                strokeWidth={4}
                                                fillOpacity={1} 
                                                fill="url(#colorSales)" 
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
