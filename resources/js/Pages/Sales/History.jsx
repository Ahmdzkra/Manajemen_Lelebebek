import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatDate, formatRupiah } from "@/utils/formatters";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Calendar,
    FileText,
    Search,
    ShoppingCart,
    RefreshCcw,
    Printer,
    ExternalLink,
    Clock,
    User,
    ChevronRight,
    Package
} from "lucide-react";
import Pagination from '@/Components/UI/Pagination';

export default function History({ auth, transactions = {}, filters = {}, products = [] }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
        product_id: filters.product_id || "",
        payment_method: filters.payment_method || "all",
        search: filters.search || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get("/sales/history", {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        router.get("/sales/history", {}, {
            preserveScroll: true,
        });
    };

    const handlePrint = (id) => {
        window.open(`/sales/${id}/print`, '_blank');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Riwayat Penjualan" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 transition-colors duration-300">
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">
                                <ShoppingCart className="h-4 w-4" />
                                <span>Sales Logs</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                                Riwayat Penjualan
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                Pencatatan riwayat transaksi penjualan dan penerimaan pembayaran.
                            </p>
                        </div>

                        {/* Search & Filter Form */}
                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end w-full xl:max-w-4xl">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Cari No Invoice / Kasir
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={data.search}
                                        onChange={(e) => setData("search", e.target.value)}
                                        className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

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
                                        className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
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
                                        className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Barang
                                </label>
                                <select
                                    value={data.product_id}
                                    onChange={(e) => setData("product_id", e.target.value)}
                                    className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm h-[42px]"
                                >
                                    <option value="">Semua Barang</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Metode
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData("payment_method", e.target.value)}
                                    className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm h-[42px]"
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
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-4 py-2.5 font-bold shadow-lg shadow-indigo-600/25 transition-all text-sm h-[42px]"
                                >
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFilter}
                                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all h-[42px] flex items-center justify-center"
                                    title="Reset Filter"
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">No. Invoice</th>
                                    <th className="px-6 py-4 text-left font-semibold">Waktu</th>
                                    <th className="px-6 py-4 text-left font-semibold">Kasir</th>
                                    <th className="px-6 py-4 text-left font-semibold">Detail Barang</th>
                                    <th className="px-6 py-4 text-center font-semibold">Metode</th>
                                    <th className="px-6 py-4 text-right font-semibold">Total Tagihan</th>
                                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {transactions.data && transactions.data.length > 0 ? (
                                    transactions.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-200">
                                            {/* Invoice */}
                                            <td className="px-6 py-4 font-mono text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                                {item.invoice_no}
                                            </td>

                                            {/* Waktu */}
                                            <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </td>

                                            {/* Kasir */}
                                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-[10px] uppercase">
                                                        {item.user?.name?.charAt(0) || "K"}
                                                    </div>
                                                    {item.user?.name || "Kasir"}
                                                </div>
                                            </td>

                                            {/* Detail Barang */}
                                            <td className="px-6 py-4 max-w-[280px]">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.details && item.details.map((detail) => (
                                                        <span key={detail.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                            <Package className="w-3 h-3 text-slate-400" />
                                                            {detail.product?.name || "Produk"}
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">x{detail.qty}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Metode Pembayaran */}
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {item.payment_method === 'transfer' ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                            Transfer
                                                        </span>
                                                        {item.transfer_proof && (
                                                            <a
                                                                href={`/storage/${item.transfer_proof}`}
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

                                            {/* Total */}
                                            <td className="px-6 py-4 text-right font-black text-slate-800 dark:text-slate-100">
                                                {formatRupiah(item.total)}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handlePrint(item.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                                                    title="Cetak Nota"
                                                >
                                                    <Printer className="w-3.5 h-3.5" />
                                                    Cetak Struk
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ShoppingCart className="w-14 h-14 mb-3 opacity-15" />
                                                <p className="font-extrabold text-base">Tidak ada transaksi ditemukan</p>
                                                <p className="text-xs text-slate-400 mt-1">Gunakan kata kunci atau rentang tanggal lainnya.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.links && (
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/30 dark:bg-slate-900/10">
                            <Pagination links={transactions.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
