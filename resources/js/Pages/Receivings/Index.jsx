import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { formatRupiah, formatDate, todayDate } from '@/utils/formatters';
import { Download, AlertCircle, ShoppingCart, Truck, Calendar, DollarSign, Package, CheckCircle2, Plus, Search, ChevronDown, X } from "lucide-react";
import Badge from '@/Components/UI/Badge';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Pagination from '@/Components/UI/Pagination';

export default function Index({
    auth,
    products = [],
    suppliers = [],
    receivings = [],
    filters = {},
}) {
    const { data, setData, post, reset, errors } = useForm({
        supplier_id: '',
        date: todayDate(),
        items: [
            {
                product_id: '',
                product_name: '',
                qty: 1,
                cost_price: '',
            }
        ]
    });

    const [startDate, setStartDate] = React.useState(filters.start_date || '');
    const [endDate, setEndDate] = React.useState(filters.end_date || '');

    const applyFilter = (start, end) => {
        router.get(
            '/receivings',
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

    const [searches, setSearches] = React.useState(['']);
    const [dropdowns, setDropdowns] = React.useState([false]);

    const addItem = () => {
        if (data.items.length >= 2) return;
        setData('items', [
            ...data.items,
            { product_id: '', product_name: '', qty: 1, cost_price: '' }
        ]);
        setSearches([...searches, '']);
        setDropdowns([...dropdowns, false]);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
        setSearches(searches.filter((_, i) => i !== index));
        setDropdowns(dropdowns.filter((_, i) => i !== index));
    };

    const updateItem = (index, key, value) => {
        const updated = [...data.items];
        updated[index][key] = value;
        setData('items', updated);
    };

    const handleSelectProduct = (index, product) => {
        const isSelectedElsewhere = data.items.some((item, i) => i !== index && item.product_id === product.id);
        if (isSelectedElsewhere) return;

        const updated = [...data.items];
        updated[index].product_id = product.id;
        updated[index].product_name = product.name;
        setData('items', updated);

        const newSearches = [...searches];
        newSearches[index] = product.name;
        setSearches(newSearches);

        const newDropdowns = [...dropdowns];
        newDropdowns[index] = false;
        setDropdowns(newDropdowns);
    };

    // Auto-fill product_id when matching product name is typed
    React.useEffect(() => {
        const updated = data.items.map((item, index) => {
            const term = (item.product_name || '').trim().toLowerCase();
            if (!term) {
                return { ...item, product_id: '' };
            }
            const match = products.find(p => p.name.toLowerCase() === term);
            const isSelectedElsewhere = match ? data.items.some((otherItem, i) => i !== index && otherItem.product_id === match.id) : false;

            if (match && !isSelectedElsewhere && item.product_id !== match.id) {
                return { ...item, product_id: match.id };
            } else if ((!match || isSelectedElsewhere) && item.product_id !== '') {
                return { ...item, product_id: '' };
            }
            return item;
        });

        // Deep equal check to avoid infinite rendering loop
        const changed = updated.some((item, i) => item.product_id !== data.items[i].product_id);
        if (changed) {
            setData('items', updated);
        }
    }, [data.items, products]);

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

    const groupedReceivings = React.useMemo(() => {
        const rawList = Array.isArray(receivings) ? receivings : (receivings?.data || []);
        const groups = {};
        
        rawList.forEach((item) => {
            const key = item.invoice_no;
            if (!groups[key]) {
                groups[key] = {
                    id: item.id,
                    invoice_no: item.invoice_no,
                    supplier: item.supplier,
                    date: item.date,
                    total: 0,
                    items: []
                };
            }
            groups[key].total += Number(item.total || 0);
            groups[key].items.push({
                product: item.product,
                qty: item.qty,
                cost_price: item.cost_price
            });
        });
        
        return Object.values(groups);
    }, [receivings]);

    const total = data.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.cost_price || 0)), 0);

    const submit = (e) => {
        e.preventDefault();

        post('/receivings', {
            onSuccess: () => {
                reset({
                    supplier_id: '',
                    date: todayDate(),
                    items: [
                        {
                            product_id: '',
                            product_name: '',
                            qty: 1,
                            cost_price: '',
                        }
                    ]
                });
                setSearches(['']);
                setDropdowns([false]);
            }
        });
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Penerimaan Barang</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Catat stok masuk dari supplier ke inventaris gudang.</p>
                    </div>
                </div>

                {errors.items && (
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 px-6 py-4 rounded-2xl flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <p className="font-semibold">{errors.items}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700/60">
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
                    </div>

                    {/* Section: Items Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 text-xs font-extrabold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                                {data.items.length}/2
                            </span>
                            <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Daftar Item Penerimaan
                            </span>
                        </div>
                        {data.items.length < 2 && (
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-3.5 py-2 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Tambah Item Kedua
                            </button>
                        )}
                    </div>

                    {/* Section: Items Fields */}
                    <div className="space-y-6">
                        {data.items.map((item, index) => {
                            const selectedProduct = products.find(p => p.id == item.product_id);
                            const sellPrice = selectedProduct ? Number(selectedProduct.price) : 0;
                            const costPrice = Number(item.cost_price || 0);
                            const lastCostPrice = selectedProduct?.latest_receiving?.cost_price;
                            const modalLebihBesar = item.product_id !== '' && costPrice > sellPrice;

                            return (
                                <div 
                                    key={index}
                                    className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10 relative group"
                                >
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
                                        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                            Item #{index + 1}
                                        </span>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                title="Hapus Item"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                        {/* Searchable Product */}
                                        <div className="relative space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Pilih Produk</label>
                                            
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                    <Search className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Ketik nama produk..."
                                                    value={searches[index] || ''}
                                                    onFocus={() => {
                                                        const newDropdowns = [...dropdowns];
                                                        newDropdowns[index] = true;
                                                        setDropdowns(newDropdowns);
                                                    }}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const newSearches = [...searches];
                                                        newSearches[index] = val;
                                                        setSearches(newSearches);

                                                        updateItem(index, 'product_name', val);

                                                        const newDropdowns = [...dropdowns];
                                                        newDropdowns[index] = true;
                                                        setDropdowns(newDropdowns);
                                                    }}
                                                    className={`w-full pl-11 ${searches[index] ? 'pr-16' : 'pr-10'} border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold placeholder:font-medium placeholder:text-slate-400 text-sm`}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-1 text-slate-400">
                                                    {searches[index] && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newSearches = [...searches];
                                                                newSearches[index] = '';
                                                                setSearches(newSearches);
                                                                updateItem(index, 'product_name', '');
                                                            }}
                                                            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-colors pointer-events-auto focus:outline-none"
                                                            title="Batalkan pilihan"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <ChevronDown className={`w-4 h-4 pointer-events-none transition-transform duration-300 ${dropdowns[index] ? 'rotate-180' : ''}`} />
                                                </div>
                                            </div>

                                            {/* Floating Dropdown Menu */}
                                            {dropdowns[index] && (
                                                <>
                                                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 max-h-56 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-300 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                                        <div className="p-2 space-y-1">
                                                            {products.filter(p => !searches[index] || p.name.toLowerCase().includes(searches[index].toLowerCase())).length > 0 ? (
                                                                products
                                                                    .filter(p => !searches[index] || p.name.toLowerCase().includes(searches[index].toLowerCase()))
                                                                    .map((pItem) => {
                                                                        const isSelectedElsewhere = data.items.some((otherItem, i) => i !== index && otherItem.product_id === pItem.id);
                                                                        return (
                                                                        <button
                                                                            key={pItem.id}
                                                                            type="button"
                                                                            onClick={() => handleSelectProduct(index, pItem)}
                                                                            disabled={isSelectedElsewhere}
                                                                            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                                                                                item.product_id === pItem.id 
                                                                                ? 'bg-indigo-600 text-white' 
                                                                                : isSelectedElsewhere
                                                                                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900/20'
                                                                                : 'hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200'
                                                                            }`}
                                                                        >
                                                                            <div className="flex flex-col">
                                                                                <span className={`font-bold text-sm ${isSelectedElsewhere ? 'text-slate-400 dark:text-slate-500' : ''}`}>{pItem.name}</span>
                                                                                <span className={`text-[10px] ${item.product_id === pItem.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                                                    {isSelectedElsewhere ? 'Sudah dipilih di baris lain' : `Stok: ${pItem.stock} • ${formatRupiah(pItem.price)}`}
                                                                                </span>
                                                                            </div>
                                                                            {item.product_id === pItem.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                                        </button>
                                                                    )})
                                                            ) : (
                                                                <div className="p-4 text-center">
                                                                    <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">Tambah sebagai produk baru</p>
                                                                    <p className="text-slate-400 text-xs mt-1">Lanjutkan mengisi Qty & Harga. Produk "{searches[index]}" akan otomatis dibuat.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => {
                                                        const newDropdowns = [...dropdowns];
                                                        newDropdowns[index] = false;
                                                        setDropdowns(newDropdowns);
                                                    }} />
                                                </>
                                            )}
                                            

                                            {errors[`items.${index}.product_id`] && (
                                                <p className="text-rose-500 text-xs font-bold mt-1">{errors[`items.${index}.product_id`]}</p>
                                            )}
                                            {errors[`items.${index}.product_name`] && (
                                                <p className="text-rose-500 text-xs font-bold mt-1">{errors[`items.${index}.product_name`]}</p>
                                            )}
                                        </div>

                                        {/* Quantity */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Jumlah (Qty)</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                placeholder="0"
                                                value={item.qty}
                                                onChange={(e) => updateItem(index, 'qty', e.target.value)}
                                                error={errors[`items.${index}.qty`]}
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
                                                value={item.cost_price}
                                                onChange={(e) => updateItem(index, 'cost_price', e.target.value)}
                                                className={modalLebihBesar ? 'border-rose-500 ring-rose-500/10' : ''}
                                                error={errors[`items.${index}.cost_price`]}
                                                required
                                            />
                                            {lastCostPrice && (
                                                <p className="text-indigo-600 dark:text-indigo-400 text-[10px] mt-1 font-bold flex items-center gap-1">
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                    Harga modal terakhir: {formatRupiah(lastCostPrice)}
                                                </p>
                                            )}
                                            {modalLebihBesar && (
                                                <p className="text-amber-600 dark:text-amber-400 text-[10px] mt-2 font-bold flex items-center gap-1 animate-pulse">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    Info: Harga jual akan otomatis naik menyesuaikan modal baru.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total & Submit */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
                        <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-6 py-4 flex items-center justify-between">
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Total Pembelian</span>
                            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(total)}</span>
                        </div>

                        <button
                            type="submit"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-4 font-bold shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Simpan Barang Masuk
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-colors duration-300">
                    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Riwayat Penerimaan
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                                    <th className="px-3 sm:px-6 py-4 text-right font-semibold">Total</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Tanggal</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {groupedReceivings.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-3 sm:px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200" data-label="Supplier">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.supplier?.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">{item.invoice_no}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left" data-label="Produk">
                                            <div className="space-y-1.5">
                                                {item.items.map((sub, sIdx) => (
                                                    <div key={sIdx} className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                                            <Package className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                                            {sub.product?.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            ({formatRupiah(sub.cost_price)})
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center" data-label="Qty">
                                            <div className="space-y-1.5">
                                                {item.items.map((sub, sIdx) => (
                                                    <div key={sIdx}>
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                                                            {sub.qty} Pcs
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400" data-label="Total">
                                            {formatRupiah(item.total)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap" data-label="Tanggal">
                                            {formatDate(item.date, false)}
                                        </td>
                                    </tr>
                                ))}

                                {(groupedReceivings.length === 0) && (
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
