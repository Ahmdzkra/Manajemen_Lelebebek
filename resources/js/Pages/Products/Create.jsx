import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Package, ArrowLeft, CheckCircle2, AlertCircle, DollarSign, Calendar } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import { formatRupiah } from '@/utils/formatters';

export default function Create({ auth }) {
    const [profitPercent, setProfitPercent] = useState(20);

    const d = new Date();
    const localToday = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        stock: '',
        price: '',
        cost_price: '',
        created_at: localToday,
    });

    useEffect(() => {
        const cost = Number(data.cost_price);
        if (cost > 0) {
            setData('price', Math.round(cost * (1 + profitPercent / 100)));
        }
    }, [data.cost_price, profitPercent]);

    const isBelowCost = Number(data.price) > 0 && Number(data.cost_price) > 0 && Number(data.price) <= Number(data.cost_price);
    const actualProfit = Number(data.cost_price) > 0 && Number(data.price) > 0
        ? Math.round(((Number(data.price) - Number(data.cost_price)) / Number(data.cost_price)) * 100)
        : null;

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Produk" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 flex flex-col gap-4 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Link href={route('products.index')} className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-2">
                                <Package className="w-4 h-4" />
                                <span>Manajemen Produk</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Tambah Produk Baru</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Masukkan data produk baru ke dalam sistem.</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                                    <Input
                                        type="text"
                                        placeholder="Masukkan nama produk..."
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Tanggal Buat</label>
                                    <Input
                                        type="date"
                                        icon={Calendar}
                                        value={data.created_at}
                                        onChange={(e) => setData('created_at', e.target.value)}
                                        error={errors.created_at}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Stok Awal</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        error={errors.stock}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Harga Modal</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        icon={DollarSign}
                                        placeholder="0"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        error={errors.cost_price}
                                        required
                                    />
                                </div>
                            </div>

                            {Number(data.cost_price) > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Atur % Keuntungan</label>
                                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                            {profitPercent}%
                                        </span>
                                    </div>

                                    {/* Slider */}
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            step="1"
                                            value={profitPercent}
                                            onChange={(e) => setProfitPercent(Number(e.target.value))}
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                            style={{
                                                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(profitPercent - 1) / 49 * 100}%, #e2e8f0 ${(profitPercent - 1) / 49 * 100}%, #e2e8f0 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                                            <span>1%</span>
                                            <span>25%</span>
                                            <span>50%</span>
                                        </div>
                                    </div>

                                    {/* Preset Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                                            <button
                                                key={pct}
                                                type="button"
                                                onClick={() => setProfitPercent(pct)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${profitPercent === pct
                                                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105'
                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                    }`}
                                            >
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {isBelowCost && (
                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 mb-2">
                                        <div className="relative overflow-hidden bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-rose-500/10">
                                            <div className="flex items-start gap-3 relative z-10">
                                                <div className="mt-0.5 p-2 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/40">
                                                    <AlertCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-tighter">Peringatan Kerugian!</span>
                                                    <span className="text-[10px] font-bold text-rose-500/80 leading-tight">Harga jual lebih rendah dari modal.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Harga Jual</label>
                                    {actualProfit !== null && !isBelowCost && Number(data.cost_price) > 0 && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${actualProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'}`}>
                                            Profit: {actualProfit}%
                                        </span>
                                    )}
                                </div>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={data.price}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setData('price', e.target.value);
                                        const cost = Number(data.cost_price);
                                        if (cost > 0 && val > 0) {
                                            const pct = Math.round(((val - cost) / cost) * 100);
                                            if (pct >= 1 && pct <= 50) setProfitPercent(pct);
                                        }
                                    }}
                                    className={isBelowCost ? 'border-rose-500 ring-rose-500/10 shadow-lg shadow-rose-500/5' : ''}
                                    error={errors.price}
                                    required
                                />
                                <p className="text-xs font-medium text-slate-400 ml-1">
                                    Harga jual dapat diubah di menu Data Produk nantinya.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-6 border-t border-slate-100 dark:border-slate-700/60">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 w-full sm:w-auto"
                                icon={CheckCircle2}
                            >
                                Simpan Produk
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
