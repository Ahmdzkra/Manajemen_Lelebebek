import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatDate, formatRupiah } from "@/utils/formatters";
import { Head, router, useForm } from "@inertiajs/react";
import {
    AlertTriangle,
    ArrowDownToLine,
    Calendar,
    FileText,
    Package,
    Printer,
    RefreshCcw,
    RotateCcw,
    Search,
    ShoppingCart,
    TrendingUp,
    Wallet,
    ExternalLink,
} from "lucide-react";
import Pagination from '@/Components/UI/Pagination';

function formatNumber(value) {
    return Number(value || 0).toLocaleString("id-ID");
}

function SummaryCard({ title, value, subtitle, icon: Icon, tone = "indigo" }) {
    const tones = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
        sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
        slate: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 transition-colors duration-300">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {title}
                    </p>
                    <h2 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 break-all">
                        {value}
                    </h2>
                    {subtitle && (
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, colSpan = 3 }) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
                    <Icon className="mb-3 h-12 w-12 opacity-20" />
                    <p className="font-semibold">{title}</p>
                </div>
            </td>
        </tr>
    );
}

function Section({ title, icon: Icon, children, badge }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                    {title}
                </h2>
                {badge && (
                    <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                        {badge}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

export default function Index({
    auth,
    filters = {},
    summary = {},
    topProducts = [],
    supplierPurchases = [],
    returnsByProduct = [],
    stockProducts = [],
    latestSales = [],
    products = [],
}) {
    const { data, setData, get, processing, errors } = useForm({
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
        product_id: filters.product_id || "",
        payment_method: filters.payment_method || "all",
    });

    const submit = (e) => {
        e.preventDefault();

        get("/report", {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        router.get("/report", {}, {
            preserveScroll: true,
        });
    };

    const periodLabel = `${formatDate(filters.start_date, false)} - ${formatDate(filters.end_date, false)}`;
    const printParams = new URLSearchParams();

    if (data.start_date) {
        printParams.set("start_date", data.start_date);
    }
    if (data.end_date) {
        printParams.set("end_date", data.end_date);
    }
    if (data.product_id) {
        printParams.set("product_id", data.product_id);
    }
    if (data.payment_method && data.payment_method !== "all") {
        printParams.set("payment_method", data.payment_method);
    }

    const printUrl = `/report/print${printParams.toString() ? `?${printParams.toString()}` : ""}`;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Laporan" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 transition-colors duration-300 print:border-0 print:shadow-none">
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">
                                <FileText className="h-4 w-4" />
                                <span>Business Report</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                                Laporan
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                Periode {periodLabel}
                            </p>
                        </div>

                        <form onSubmit={submit} className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Dari Tanggal
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Sampai Tanggal
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Barang yang Dibeli
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) => setData("product_id", e.target.value)}
                                    className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm h-[48px]"
                                >
                                    <option value="">Semua Barang</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Metode Pembayaran
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData("payment_method", e.target.value)}
                                    className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm h-[48px]"
                                >
                                    <option value="all">Semua Metode</option>
                                    <option value="cash">Tunai / Cash</option>
                                    <option value="transfer">Transfer / Cashless</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white py-3 font-bold shadow-lg shadow-indigo-600/25 transition-all text-sm h-[48px]"
                                >
                                    <Search className="h-4 w-4" />
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFilter}
                                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all h-[48px] flex items-center justify-center"
                                    title="Reset Filter"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </button>

                                <a
                                    href={printUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all h-[48px] flex items-center justify-center"
                                    title="Cetak Laporan"
                                >
                                    <Printer className="h-4 w-4" />
                                </a>
                            </div>
                        </form>
                    </div>

                    {errors.end_date && (
                        <div className="print:hidden mt-5 rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700 dark:text-rose-400">
                            {errors.end_date}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard
                        title="Penjualan"
                        value={`${formatNumber(summary.sales_qty)} Unit`}
                        subtitle={`${formatNumber(summary.sales_count)} Transaksi`}
                        icon={ShoppingCart}
                        tone="indigo"
                    />
                    <SummaryCard
                        title="Omset"
                        value={formatRupiah(summary.sales_total)}
                        subtitle="Total pendapatan kotor"
                        icon={TrendingUp}
                        tone="emerald"
                    />
                    <SummaryCard
                        title="Keuntungan"
                        value={formatRupiah(summary.profit)}
                        subtitle="Total keuntungan bersih"
                        icon={Wallet}
                        tone="sky"
                    />
                </div>

                <div className="grid xl:grid-cols-2 gap-6">
                    <Section
                        title="Produk Terlaris"
                        icon={ShoppingCart}
                        badge={`${topProducts.length} produk`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Produk</th>
                                        <th className="px-6 py-4 text-center font-semibold">Qty</th>
                                        <th className="px-6 py-4 text-right font-semibold">Penjualan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {topProducts.map((item) => (
                                        <tr key={item.product_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-880 dark:text-slate-200">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                                    {formatNumber(item.total_qty)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(item.total_sales)}
                                            </td>
                                        </tr>
                                    ))}
                                    {topProducts.length === 0 && (
                                        <EmptyState icon={ShoppingCart} title="Belum ada penjualan pada periode ini" />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section
                        title="Log Penjualan"
                        icon={FileText}
                        badge={`${latestSales.total || 0} data`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold">Invoice No</th>
                                        <th className="px-6 py-4 text-left font-semibold">Produk</th>
                                        <th className="px-6 py-4 text-center font-semibold">Qty</th>
                                        <th className="px-6 py-4 text-right font-semibold">Harga</th>
                                        <th className="px-6 py-4 text-center font-semibold">Metode</th>
                                        <th className="px-6 py-4 text-right font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {(latestSales.data || latestSales).map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                                {item.invoice_no}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                                    {formatNumber(item.qty)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold">
                                                {formatRupiah(item.price)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.payment_method === 'transfer' ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                            Transfer
                                                        </span>
                                                        {item.transfer_proof && (
                                                            <a
                                                                href={item.transfer_proof}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black hover:underline flex items-center gap-0.5 justify-center"
                                                            >
                                                                Bukti <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                        Tunai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                    {((latestSales.data || latestSales).length === 0) && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
                                                    <FileText className="mb-3 h-12 w-12 opacity-20" />
                                                    <p className="font-semibold">Belum ada penjualan pada periode ini</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {latestSales.links && <Pagination links={latestSales.links} />}
                    </Section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
