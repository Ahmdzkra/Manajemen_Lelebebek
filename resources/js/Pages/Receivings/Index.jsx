import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { formatRupiah, formatDate, todayDate } from '@/utils/formatters';
import { Download, AlertCircle, ShoppingCart, Truck, Calendar, DollarSign, Package, CheckCircle2, Plus, Search, ChevronDown } from "lucide-react";
import Badge from '@/Components/UI/Badge';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Pagination from '@/Components/UI/Pagination';

export default function Index({
    auth,
    products = [],
    suppliers = [],
    receivings = [],
}) {
    const { data, setData, post, reset, errors } = useForm({
        supplier_id: '',
        product_id: '',
        product_name: '',
        qty: 1,
        cost_price: '',
        date: todayDate(),
    });

    const selectedProduct = products.find(
        (item) => item.id == data.product_id
    );

    const recentProducts = React.useMemo(() => {
        const unique = [];
        const map = new Map();
        const dataArray = receivings.data || receivings;
        for (const item of dataArray) {
            if (item.product && !map.has(item.product_id)) {
                map.set(item.product_id, true);
                unique.push(item.product);
            }
            if (unique.length >= 5) break;
        }
        return unique;
    }, [receivings]);

    const [productSearch, setProductSearch] = React.useState('');
    const [showProductDropdown, setShowProductDropdown] = React.useState(false);

    const filteredProducts = React.useMemo(() => {
        if (!productSearch) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    // Sync product_id when product_name changes (Defensive Check)
    useEffect(() => {
        if (!data.product_name || typeof data.product_name !== 'string') {
            if (data.product_id) setData('product_id', '');
            setProductSearch('');
            return;
        }

        const term = data.product_name.trim().toLowerCase();
        if (!term) {
            if (data.product_id) setData('product_id', '');
            setProductSearch('');
            return;
        }

        const match = (products || []).find(
            (p) => p?.name?.toLowerCase() === term
        );

        if (match) {
            if (data.product_id !== match.id) setData('product_id', match.id);
            setProductSearch(match.name);
        } else {
            if (data.product_id !== '') setData('product_id', '');
            setProductSearch(data.product_name);
        }
    }, [data.product_name, products]);

    const sellPrice = selectedProduct
        ? Number(selectedProduct.price)
        : 0;

    const costPrice = Number(data.cost_price || 0);

    const modalLebihBesar =
        data.product_id !== '' &&
        costPrice > sellPrice;

    const total = Number(data.qty || 0) * costPrice;

    const submit = (e) => {
        e.preventDefault();

        post('/receivings', {
            onSuccess: () => {
                reset({
                    supplier_id: '',
                    product_id: '',
                    product_name: '',
                    qty: 1,
                    cost_price: '',
                    date: todayDate(),
                });
                setProductSearch('');
            }
        });
    };

    const handleSelectProduct = (product) => {
        setData(prev => ({
            ...prev,
            product_id: product.id,
            product_name: product.name
        }));
        setProductSearch(product.name);
        setShowProductDropdown(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Penerimaan Barang" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">
                            <Download className="w-4 h-4" />
                            <span>Inbound Logistics</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Penerimaan Barang</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Catat stok masuk dari supplier ke inventaris gudang.</p>
                    </div>
                </div>

                {errors.cost_price && (
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <p className="font-semibold">{errors.cost_price}</p>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 transition-colors duration-300 mb-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Form Barang Masuk
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Supplier Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Supplier</label>
                            <Select
                                icon={Truck}
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                placeholder="Pilih Supplier..."
                                options={suppliers.map(s => ({ label: s.name, value: s.id }))}
                                error={errors.supplier_id}
                                required
                            />
                        </div>

                        {/* Searchable Product */}
                        <div className="relative space-y-2 lg:col-span-1">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Pilih Produk</label>
                            
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ketik nama produk..."
                                    value={productSearch}
                                    onFocus={() => setShowProductDropdown(true)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setProductSearch(val);
                                        setData('product_name', val);
                                        setShowProductDropdown(true);
                                    }}
                                    className="w-full pl-11 pr-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold placeholder:font-medium placeholder:text-slate-400"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showProductDropdown ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Floating Dropdown Menu */}
                            {showProductDropdown && (
                                <>
                                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 max-h-72 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-300 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                        <div className="p-2 space-y-1">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setData(prev => ({ ...prev, product_id: item.id, product_name: item.name }));
                                                            setProductSearch(item.name);
                                                            setShowProductDropdown(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                                                            data.product_id === item.id 
                                                            ? 'bg-indigo-600 text-white' 
                                                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{item.name}</span>
                                                            <span className={`text-[10px] ${data.product_id === item.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                                Stok: {item.stock} • {formatRupiah(item.price)}
                                                            </span>
                                                        </div>
                                                        {data.product_id === item.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center">
                                                    <p className="text-slate-400 text-sm font-medium mb-3">Produk tidak terdaftar</p>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowProductDropdown(false)}
                                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Gunakan sebagai Produk Baru
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowProductDropdown(false)} />
                                </>
                            )}
                            
                            {!data.product_id && data.product_name && (
                                <div className="mt-2 animate-in fade-in slide-in-from-left-2">
                                    <Badge variant="success" icon={Plus}>Produk Baru: {data.product_name}</Badge>
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Tanggal Masuk</label>
                            <Input
                                type="date"
                                icon={Calendar}
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                error={errors.date}
                                required
                            />
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Jumlah (Qty)</label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="0"
                                value={data.qty}
                                onChange={(e) => setData('qty', e.target.value)}
                                error={errors.qty}
                                required
                            />
                        </div>

                        {/* Cost Price */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Harga Modal (Beli)</label>
                            <Input
                                type="number"
                                icon={DollarSign}
                                placeholder="0"
                                value={data.cost_price}
                                onChange={(e) => setData('cost_price', e.target.value)}
                                className={modalLebihBesar ? 'border-rose-500 ring-rose-500/10' : ''}
                                error={errors.cost_price}
                                required
                            />
                            {modalLebihBesar && (
                                <p className="text-amber-600 dark:text-amber-400 text-[10px] mt-2 font-bold flex items-center gap-1 animate-pulse">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Info: Harga jual akan otomatis naik menyesuaikan modal baru.
                                </p>
                            )}
                        </div>

                        {/* Total & Submit */}
                        <div className="md:col-span-3 flex flex-col sm:flex-row gap-4 mt-2">
                            <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-6 py-4 flex items-center justify-between">
                                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Total Pembelian</span>
                                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(total)}</span>
                            </div>

                            <button
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-4 font-bold shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Simpan Barang Masuk
                            </button>
                        </div>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Riwayat Penerimaan
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Supplier</th>
                                    <th className="px-6 py-4 text-left font-semibold">Produk</th>
                                    <th className="px-6 py-4 text-center font-semibold">Qty</th>
                                    <th className="px-6 py-4 text-right font-semibold">Total</th>
                                    <th className="px-6 py-4 text-center font-semibold">Tanggal</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {(receivings.data || receivings).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200">
                                            {item.supplier?.name}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.product?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                                {item.qty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(item.total)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {formatDate(item.date, false)}
                                        </td>
                                    </tr>
                                ))}

                                {((receivings.data || receivings).length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <Download className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Belum ada data penerimaan</p>
                                                <p className="text-sm">Silakan catat barang masuk melalui form di atas.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {receivings.links && <Pagination links={receivings.links} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
