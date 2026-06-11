import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from 'react';
import { Head, useForm, router } from "@inertiajs/react";
import { todayDate, formatDate } from "@/utils/formatters";
import { RotateCcw, AlertCircle, FileText, Truck, Package, AlertTriangle, MessageSquare, CheckCircle2, Calendar } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import Pagination from '@/Components/UI/Pagination';

export default function Index({
    auth,
    products = [],
    suppliers = [],
    returns = [],
    filters = {},
}) {
    const { data, setData, post, reset, errors } = useForm({
        supplier_id: "",
        product_id: "",
        qty: 1,
        reason: "",
        date: todayDate(),
    });

    const [startDate, setStartDate] = React.useState(filters?.start_date || '');
    const [endDate, setEndDate] = React.useState(filters?.end_date || '');

    const applyFilter = (start, end) => {
        router.get(
            '/returns',
            { start_date: start, end_date: end },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleStartDateChange = (e) => {
        const val = e.target.value;
        setStartDate(val);
        applyFilter(val, endDate);
    };

    const handleEndDateChange = (e) => {
        const val = e.target.value;
        setEndDate(val);
        applyFilter(startDate, val);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        applyFilter('', '');
    };

    const selectedProduct = products.find(
        (item) => item.id == data.product_id
    );

    const stock = selectedProduct
        ? Number(selectedProduct.stock)
        : 0;

    const qty = Number(data.qty || 0);

    const stokKurang =
        data.product_id !== "" &&
        qty > stock;

    const submit = (e) => {
        e.preventDefault();

        if (stokKurang) return;

        post("/returns", {
            onSuccess: () =>
                reset({
                    supplier_id: "",
                    product_id: "",
                    qty: 1,
                    reason: "",
                    date: todayDate(),
                }),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Retur / Refund" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-semibold mb-3">
                            <RotateCcw className="w-4 h-4" />
                            <span>Outbound Logistics</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Retur / Refund</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Kelola barang rusak, retur ke supplier, dan koreksi stok gudang.</p>
                    </div>
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 flex items-center gap-5 transition-colors duration-300 group hover:border-indigo-500/30">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Data Retur</p>
                            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{returns.total || 0}</h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 flex items-center gap-5 transition-colors duration-300 group hover:border-rose-500/30">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <RotateCcw className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Qty Retur (Halaman ini)</p>
                            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                                {(returns.data || returns).reduce((sum, item) => sum + Number(item.qty), 0)}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 flex items-center gap-5 transition-colors duration-300 group hover:border-amber-500/30">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Produk Dipilih</p>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                                {selectedProduct ? selectedProduct.name : "-"}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {errors.qty && (
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <p className="font-semibold">{errors.qty}</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 transition-colors duration-300 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Form Retur Barang
                        </h2>
                    </div>

                    <form
                        onSubmit={submit}
                        className="p-6 grid md:grid-cols-2 gap-5"
                    >
                        <Select 
                            label="Supplier"
                            icon={Truck}
                            value={data.supplier_id}
                            onChange={(e) => setData("supplier_id", e.target.value)}
                            options={suppliers.map(s => ({ label: s.name, value: s.id }))}
                            error={errors.supplier_id}
                            required
                        />

                        <Select 
                            label="Produk"
                            icon={Package}
                            value={data.product_id}
                            onChange={(e) => setData("product_id", e.target.value)}
                            options={products.map(p => ({ label: `${p.name} (Stok: ${p.stock})`, value: p.id }))}
                            error={errors.product_id}
                            required
                        />

                        <Input
                            label="Qty Retur"
                            type="number"
                            min="1"
                            value={data.qty}
                            onChange={(e) => setData("qty", e.target.value)}
                            error={stokKurang ? `Stok hanya ${stock}` : errors.qty}
                            required
                        />

                        <Input
                            label="Tanggal"
                            type="date"
                            icon={Calendar}
                            value={data.date}
                            onChange={(e) => setData("date", e.target.value)}
                            error={errors.date}
                            required
                        />

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Alasan Retur
                            </label>
                            <div className="relative group">
                                <div className="absolute top-3.5 left-3 flex items-start pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <textarea
                                    rows="3"
                                    value={data.reason}
                                    onChange={(e) => setData("reason", e.target.value)}
                                    placeholder="Contoh: Barang rusak, pecah, kualitas buruk"
                                    className="w-full pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <button
                            disabled={stokKurang}
                            className={`md:col-span-2 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-all duration-300 ${
                                stokKurang
                                    ? "bg-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-rose-600 hover:bg-rose-700 hover:-translate-y-0.5 shadow-rose-600/30"
                            }`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Simpan Retur
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
                    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Riwayat Retur
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                                {returns.total || 0} data
                            </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-wider">
                                    Filter Tanggal:
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="px-3 py-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-xs font-semibold"
                                />
                                <span className="text-slate-400 text-xs">s/d</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    className="px-3 py-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-xs font-semibold"
                                />
                            </div>
                            {(startDate || endDate) && (
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300 table-responsive-cards">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Supplier</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Produk</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Qty</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Alasan</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Tanggal</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {(returns.data || returns).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-3 sm:px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200" data-label="Supplier">
                                            {item.supplier?.name}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200" data-label="Produk">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                {item.product?.name}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center" data-label="Qty">
                                            <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold">
                                                {item.qty}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left" data-label="Alasan">
                                            <div className="text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                                {item.reason}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap" data-label="Tanggal">
                                            {formatDate(item.date, false)}
                                        </td>
                                    </tr>
                                ))}

                                {((returns.data || returns).length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <RotateCcw className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Belum ada data retur</p>
                                                <p className="text-sm">Tidak ada barang yang diretur sejauh ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {returns.links && <Pagination links={returns.links} />}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
