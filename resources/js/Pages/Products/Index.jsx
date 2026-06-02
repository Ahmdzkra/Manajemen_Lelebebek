import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatRupiah, formatDate } from '@/utils/formatters';
import { Search, Plus, Edit2, Trash2, Package, Filter, X, CheckCircle2, AlertCircle, TrendingDown } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ auth, products, filters }) {
    const [editId, setEditId] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [profitPercent, setProfitPercent] = useState(20);

    const { data, setData, post, reset, errors } = useForm({
        name: '',
        stock: '',
        price: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`/products/${editId}`, {
                name: data.name,
                price: data.price,
            }, {
                onSuccess: () => {
                    reset();
                    setEditId(null);
                },
            });
        }
    };

    const handleSearch = (e) => {
        router.get('/products', { search: e.target.value, sort: filters.sort }, { preserveState: true, replace: true });
    };

    const handleSort = (e) => {
        router.get('/products', { search: filters.search, sort: e.target.value }, { preserveState: true, replace: true });
    };

    const editData = (item) => {
        setEditId(item.id);
        setData({
            name: item.name,
            stock: Number(item.stock),
            price: Math.round(Number(item.price)),
        });
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        router.delete(`/products/${deleteItem.id}`, {
            onSuccess: () => setDeleteItem(null),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Produk" />

            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader
                    title="Data Produk"
                    subtitle="Kelola inventaris dan harga produk toko Anda."
                    badge="Manajemen Produk"
                    icon={Package}
                >
                    <Input
                        icon={Search}
                        placeholder="Cari produk..."
                        defaultValue={filters.search}
                        onChange={handleSearch}
                        containerClassName="sm:w-64"
                    />
                    <Select
                        icon={Filter}
                        defaultValue={filters.sort || 'latest'}
                        onChange={handleSort}
                        containerClassName="sm:w-48"
                        placeholder={null}
                        options={[
                            { label: 'Terbaru', value: 'latest' },
                            { label: 'Terlama', value: 'oldest' },
                            { label: 'Harga Termurah', value: 'price_asc' },
                            { label: 'Harga Termahal', value: 'price_desc' },
                        ]}
                    />
                        <Link
                            href="/products/create"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 border border-transparent rounded-xl font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Tambah Produk
                        </Link>
                </PageHeader>

                {editId ? (
                    <Card className="border-amber-100 dark:border-amber-900/30 bg-amber-50/10 animate-in slide-in-from-top-4">
                        {(() => {
                            const currentProduct = products.data.find(p => p.id === editId);
                            const currentCostPrice = Number(currentProduct?.cost_price) || Number(currentProduct?.latest_receiving?.cost_price) || 0;
                            const isBelowCost = Number(data.price) > 0 && Number(data.price) <= currentCostPrice;
                            const recommendedByPercent = currentCostPrice > 0 ? Math.round(currentCostPrice * (1 + profitPercent / 100)) : 0;
                            const actualProfit = currentCostPrice > 0 && Number(data.price) > 0
                                ? Math.round(((Number(data.price) - currentCostPrice) / currentCostPrice) * 100)
                                : null;

                            return (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <Badge variant="warning" icon={Edit2}>Atur Harga Jual: {data.name}</Badge>
                                        <Button variant="ghost" onClick={() => { setEditId(null); reset(); setProfitPercent(20); }}>Batal</Button>
                                    </div>

                                    <form onSubmit={submit} className="space-y-6">
                                        {/* Row 1: Info Harga Modal */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Harga Modal Terakhir</label>
                                                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl px-4 py-3 font-mono font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    {formatRupiah(currentCostPrice)}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Rekomendasi ({profitPercent}% Keuntungan)</label>
                                                <div className={`rounded-xl px-4 py-3 font-mono font-bold border ${currentCostPrice > 0 ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                                    {currentCostPrice > 0 ? formatRupiah(recommendedByPercent) : 'Belum ada modal'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Slider Keuntungan */}
                                        {currentCostPrice > 0 && (
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
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
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            setProfitPercent(val);
                                                            if (currentCostPrice > 0) {
                                                                setData('price', Math.round(currentCostPrice * (1 + val / 100)));
                                                            }
                                                        }}
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
                                                            onClick={() => {
                                                                setProfitPercent(pct);
                                                                if (currentCostPrice > 0) {
                                                                    setData('price', Math.round(currentCostPrice * (1 + pct / 100)));
                                                                }
                                                            }}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${profitPercent === pct
                                                                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105'
                                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                                }`}
                                                        >
                                                            {pct}%
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Tombol Rekomendasi Cepat (20%) - Fitur Lama */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfitPercent(20);
                                                        setData('price', Math.round(currentCostPrice * 1.2));
                                                    }}
                                                    className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-3 rounded-2xl border-2 border-indigo-100 dark:border-indigo-500/20 w-full text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 uppercase tracking-wider"
                                                >
                                                    Rekomendasi Jual (Profit 20%): {formatRupiah(Math.round(currentCostPrice * 1.2))}
                                                </button>
                                            </div>
                                        )}

                                        {/* Row 3: Input Harga + Alert + Tombol Simpan */}
                                        <div className="grid md:grid-cols-3 gap-4 items-end">
                                            <div className="md:col-span-2 space-y-2">
                                                {isBelowCost && (
                                                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                        <div className="relative overflow-hidden bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/50 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-rose-500/10">
                                                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
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
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Harga Jual Baru</label>
                                                    {actualProfit !== null && !isBelowCost && currentCostPrice > 0 && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${actualProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'}`}>
                                                            Profit: {actualProfit}%
                                                        </span>
                                                    )}
                                                </div>

                                                <Input
                                                    placeholder="Masukkan harga jual..."
                                                    value={data.price}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setData('price', e.target.value);
                                                        if (currentCostPrice > 0 && val > 0) {
                                                            const pct = Math.round(((val - currentCostPrice) / currentCostPrice) * 100);
                                                            if (pct >= 1 && pct <= 50) setProfitPercent(pct);
                                                        }
                                                    }}
                                                    error={errors.price}
                                                    className={isBelowCost ? 'border-rose-500 ring-rose-500/10 shadow-lg shadow-rose-500/5' : ''}
                                                    required
                                                    autoFocus
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                variant={isBelowCost ? 'secondary' : 'warning'}
                                                className="py-4 shadow-xl"
                                                icon={CheckCircle2}
                                            >
                                                Simpan Harga
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            );
                        })()}
                    </Card>
                ) : null}

                <Card noPadding>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300 table-responsive-cards">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold w-16">No</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Nama Produk</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Stok</th>
                                    <th className="px-3 sm:px-6 py-4 text-right font-semibold hidden md:table-cell">Harga Modal</th>
                                    <th className="px-3 sm:px-6 py-4 text-right font-semibold hidden md:table-cell">Rekomendasi</th>
                                    <th className="px-3 sm:px-6 py-4 text-right font-semibold">Harga Jual</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold hidden lg:table-cell">Dibuat</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {products.data.map((item, index) => {
                                    const costPrice = Number(item.cost_price) || Number(item.latest_receiving?.cost_price) || 0;
                                    const sellPrice = Number(item.price) || 0;
                                    const recommendedPrice = costPrice > 0 ? Math.ceil(costPrice * 1.2 / 100) * 100 : 0;
                                    const isBelowCost = costPrice > 0 && sellPrice <= costPrice;

                                    return (
                                        <tr key={item.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group ${isBelowCost ? 'bg-rose-50/40 dark:bg-rose-500/5' : ''}`}>
                                            <td className="px-3 sm:px-6 py-4 text-center text-slate-400 dark:text-slate-500 font-medium" data-label="No">
                                                {(products.current_page - 1) * products.per_page + index + 1}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200" data-label="Produk">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span>{item.name}</span>
                                                        {isBelowCost && (
                                                            <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                                                                <TrendingDown className="w-3 h-3" />
                                                                Harga jual di bawah modal!
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-center" data-label="Stok">
                                                <Badge variant={item.stock <= 5 ? 'danger' : 'success'}>
                                                    {item.stock}
                                                </Badge>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-right font-mono text-sm hidden md:table-cell" data-label="Modal">
                                                {costPrice > 0 ? (
                                                    <span className="text-slate-600 dark:text-slate-400 font-bold">
                                                        {formatRupiah(costPrice)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-600 text-xs italic">Belum ada</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-right font-mono text-sm hidden md:table-cell" data-label="Rekomendasi">
                                                {recommendedPrice > 0 ? (
                                                    <span className={`font-bold ${sellPrice < recommendedPrice ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                        {formatRupiah(recommendedPrice)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-600 text-xs italic">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-right" data-label="Harga Jual">
                                                <span className={`font-bold ${isBelowCost ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {formatRupiah(item.price)}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:table-cell" data-label="Dibuat">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-center" data-label="">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => editData(item)} className="flex items-center gap-2 px-3 py-1.5 text-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-lg transition-all font-bold text-xs hover:scale-105">
                                                        <Edit2 className="w-3 h-3" /> Set Harga
                                                    </button>
                                                    <button onClick={() => setDeleteItem(item)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {products.data.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <Package className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Tidak ada data produk</p>
                                                <p className="text-sm">Silakan tambah produk baru terlebih dahulu.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {products.links && <Pagination links={products.links} />}
                </Card>
            </div>

            <ConfirmModal
                show={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleDelete}
                message={deleteItem ? `Produk ${deleteItem.name} akan dihapus secara permanen.` : ''}
            />
        </AuthenticatedLayout>
    );
}
