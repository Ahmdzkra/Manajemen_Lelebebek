import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useRef } from 'react';
import { Head, router } from "@inertiajs/react";
import { formatDate } from "@/utils/formatters";
import { Activity, Package, ArrowUpRight, ArrowDownRight, FileText, Search } from "lucide-react";
import Pagination from '@/Components/UI/Pagination';
import Badge from '@/Components/UI/Badge';

export default function Index({ auth, movements, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const searchTimeout = useRef(null);

    const applyFilters = (currentSearch, start, end) => {
        router.get(
            '/stock-movements',
            { search: currentSearch, start_date: start, end_date: end },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            applyFilters(value, startDate, endDate);
        }, 300);
    };

    const handleStartDateChange = (e) => {
        const val = e.target.value;
        setStartDate(val);
        applyFilters(search, val, endDate);
    };

    const handleEndDateChange = (e) => {
        const val = e.target.value;
        setEndDate(val);
        applyFilters(search, startDate, val);
    };

    const handleReset = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        applyFilters('', '', '');
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'sale':
                return <Badge variant="danger" icon={ArrowDownRight}>Penjualan</Badge>;
            case 'receiving':
                return <Badge variant="success" icon={ArrowUpRight}>Barang Masuk</Badge>;
            case 'return':
                return <Badge variant="warning" icon={ArrowDownRight}>Retur Keluar</Badge>;
            case 'stock_opname':
                return <Badge variant="info" icon={Activity}>Stock Opname</Badge>;
            default:
                return <Badge variant="secondary">{type}</Badge>;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Aktifitas Stok" />

            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">
                            <Activity className="w-4 h-4" />
                            <span>Logistics Log</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Aktifitas Barang Bergerak</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Log semua pergerakan barang (Masuk, Keluar, Retur, dll).</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
                    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Riwayat Pergerakan
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold whitespace-nowrap">
                                {movements.total || 0} aktifitas
                            </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
                            {/* Date Filters */}
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-wider">
                                    Filter Tanggal:
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="px-3 py-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs font-semibold"
                                />
                                <span className="text-slate-400 text-xs">s/d</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="px-3 py-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-xs font-semibold"
                                />
                            </div>

                            {/* Search and Reset */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                <div className="relative group flex-1 sm:w-60">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari produk / keterangan..."
                                        value={search}
                                        onChange={onSearchChange}
                                        className="block w-full pl-10 pr-4 py-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-xs placeholder:text-slate-400 font-semibold"
                                    />
                                </div>
                                
                                {(search || startDate || endDate) && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Tanggal</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Produk</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold hidden md:table-cell">Jenis Aktifitas</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">Masuk</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold text-rose-600 dark:text-rose-400">Keluar</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Sisa Stok</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold hidden lg:table-cell">Keterangan</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold hidden lg:table-cell">User</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {(movements.data || movements).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-3 sm:px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                            {formatDate(item.created_at, true)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                {item.product?.name || 'Produk Dihapus'}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left hidden md:table-cell">
                                            {getTypeBadge(item.type)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                                            {item.qty_in > 0 ? `+${item.qty_in}` : '-'}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center font-bold text-rose-600 dark:text-rose-400">
                                            {item.qty_out > 0 ? `-${item.qty_out}` : '-'}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                                {item.stock_after}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left hidden lg:table-cell">
                                            <div className="text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                                {item.note || '-'}
                                            </div>
                                            {(item.type === 'receiving' || item.type === 'return') && item.reference?.supplier && (
                                                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1">
                                                    <span>Supplier:</span>
                                                    <span className="font-bold">{item.reference.supplier.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:table-cell">
                                            {item.user?.name || '-'}
                                        </td>
                                    </tr>
                                ))}

                                {((movements.data || movements).length === 0) && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Belum ada aktifitas</p>
                                                <p className="text-sm">Log pergerakan barang masih kosong.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {movements.links && <Pagination links={movements.links} />}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
