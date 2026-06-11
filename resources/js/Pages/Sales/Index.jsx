import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { formatRupiah } from '@/utils/formatters';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    X,
    CheckCircle2,
    Package,
    ChevronRight,
    SearchX,
    Upload,
    ImageIcon,
    FileCheck2
} from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import Modal from '@/Components/Modal';

export default function Index({ auth, products = [], recentTransactions = [], filters = {}, flash = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('pos_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
            return [];
        }
    });
    const [showCheckout, setShowCheckout] = useState(false);
    const [payAmount, setPayAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [transferProof, setTransferProof] = useState(null);
    const [transferProofPreview, setTransferProofPreview] = useState(null);

    useEffect(() => {
        if (flash?.print_id) {
            window.open(`/sales/${flash.print_id}/print`, '_blank');
        }
    }, [flash?.print_id]);

    useEffect(() => {
        localStorage.setItem('pos_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get('/sales', { search }, { preserveState: true, preserveScroll: true, only: ['products'] });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const filteredProducts = products; // Frontend filter removed in favor of backend search

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.qty >= product.stock) return prev;
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.qty + delta;
                if (newQty < 1) return item;
                if (newQty > item.stock) return item;
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const setQty = (id, val) => {
        const num = parseInt(val);
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                if (isNaN(num) || num < 1) return { ...item, qty: '' };
                const product = products.find(p => p.id === id);
                let newQty = num;
                if (product && newQty > product.stock) newQty = product.stock;
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
    const tax = subtotal * 0.1; // Contoh PPN 10%
    const total = subtotal + tax;
    const change = payAmount ? Math.max(0, payAmount - total) : 0;

    const handleTransferProofChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format file tidak didukung. Hanya file JPG, JPEG, dan PNG yang diperbolehkan.');
            e.target.value = '';
            return;
        }

        setTransferProof(file);
        const reader = new FileReader();
        reader.onloadend = () => setTransferProofPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const isCashless = paymentMethod === 'transfer';

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!isCashless && payAmount < total) return;
        if (isCashless && !transferProof) return;

        const formData = new FormData();
        formData.append('items', JSON.stringify(cart.map(item => ({ product_id: item.id, qty: item.qty, price: item.price }))));
        formData.append('subtotal', subtotal);
        formData.append('tax', tax);
        formData.append('total', total);
        formData.append('payment_method', paymentMethod);
        if (!isCashless) {
            formData.append('pay_amount', payAmount);
            formData.append('change_amount', change);
        } else {
            formData.append('pay_amount', total);
            formData.append('change_amount', 0);
            if (transferProof) formData.append('transfer_proof', transferProof);
        }

        router.post('/sales', formData, {
            forceFormData: true,
            onSuccess: () => {
                setCart([]);
                localStorage.removeItem('pos_cart');
                setShowCheckout(false);
                setPayAmount('');
                setTransferProof(null);
                setTransferProofPreview(null);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kasir POS" />

            <div className="max-w-[1600px] mx-auto h-auto lg:h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6 overflow-visible lg:overflow-hidden">
                {/* Left Side: Product Selection */}
                <div className="flex-1 flex flex-col min-w-0 space-y-6">
                    <PageHeader
                        title="Kasir Pintar"
                        subtitle="Pilih produk untuk memulai transaksi."
                        badge="Point of Sale"
                        icon={ShoppingCart}
                    >
                        <Input
                            icon={Search}
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="sm:w-96"
                        />
                    </PageHeader>

                    <div className="flex-1 overflow-y-auto pr-0 lg:pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="group relative bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <Badge variant="slate" className="mb-2">
                                                {product.category?.name || 'Umum'}
                                            </Badge>
                                            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                                <Package className="w-3 h-3" /> Stok: {product.stock}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center">
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                {formatRupiah(product.price)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                                <SearchX className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-bold">Produk Tidak Ditemukan</h3>
                                <p>Coba kata kunci lain.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart Sidebar */}
                <div className="w-full lg:w-[400px] flex flex-col min-h-0 lg:max-h-full max-h-[60vh]">
                    <Card noPadding className="flex-1 flex flex-col overflow-hidden border-indigo-100 dark:border-indigo-900/30">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6 text-indigo-600" />
                                Keranjang
                            </h2>
                            <Badge variant="primary">{cart.length} Item</Badge>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length > 0 ? (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold text-indigo-600">{formatRupiah(item.price)}</span>
                                                <span className="text-[10px] text-slate-400">x {item.qty}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-inner">
                                                <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all active:scale-90">
                                                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => setQty(item.id, e.target.value)}
                                                    onBlur={() => {
                                                        if (item.qty === '') setQty(item.id, 1);
                                                    }}
                                                    className="w-10 text-center text-xs font-black bg-transparent border-none focus:ring-0 p-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all active:scale-90">
                                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center">
                                    <ShoppingCart className="w-12 h-12 mb-3 opacity-10" />
                                    <p className="text-sm font-medium">Keranjang masih kosong</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Pajak (10%)</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">{formatRupiah(tax)}</span>
                            </div>
                            <div className="flex justify-between text-xl pt-3 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-slate-800 dark:text-slate-100 font-black">Total</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-black">{formatRupiah(total)}</span>
                            </div>
                            <Button
                                disabled={cart.length === 0}
                                onClick={() => setShowCheckout(true)}
                                className="w-full py-4 mt-4 text-lg shadow-xl shadow-indigo-600/20"
                                icon={CreditCard}
                            >
                                Bayar Sekarang
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Checkout Modal */}
            <Modal show={showCheckout} onClose={() => setShowCheckout(false)} maxWidth="md">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Pembayaran</h2>
                        <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-indigo-600 dark:bg-indigo-500 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/30 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Total Tagihan</p>
                            <h3 className="text-4xl font-black relative z-10">{formatRupiah(total)}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { setPaymentMethod('cash'); setTransferProof(null); setTransferProofPreview(null); }}
                                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-300 font-bold ${paymentMethod === 'cash'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-600/10'
                                    : 'border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <div className={`p-3 rounded-2xl transition-colors ${paymentMethod === 'cash' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <span className="text-sm">Tunai / Cash</span>
                            </button>
                            <button
                                onClick={() => { setPaymentMethod('transfer'); setPayAmount(''); }}
                                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-300 font-bold ${paymentMethod === 'transfer'
                                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-4 ring-violet-600/10'
                                    : 'border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:border-violet-200 dark:hover:border-violet-500/30 hover:bg-white dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <div className={`p-3 rounded-2xl transition-colors ${paymentMethod === 'transfer' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <span className="text-sm">Transfer Bank</span>
                            </button>
                        </div>

                        {/* --- CASH: Input Nominal --- */}
                        {!isCashless && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nominal Pembayaran</label>
                                <Input
                                    type="number"
                                    placeholder="Masukkan Nominal Pembayaran..."
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    className="text-xl font-bold py-5 text-center tracking-tight"
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* --- CASH: Uang Kembalian --- */}
                        {!isCashless && payAmount >= total && (
                            <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] border border-emerald-200 dark:border-emerald-500/20 flex justify-between items-center animate-in fade-in slide-in-from-top-2 group">
                                <div>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm block">Uang Kembalian</span>
                                    <span className="text-emerald-800 dark:text-emerald-300 text-2xl font-black tracking-tight">{formatRupiah(change)}</span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                            </div>
                        )}

                        {/* --- CASHLESS: Upload Bukti Pembayaran --- */}
                        {isCashless && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <label className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Upload className="w-3.5 h-3.5" />
                                    Bukti Pembayaran Transfer
                                </label>

                                {/* Preview area */}
                                {transferProofPreview ? (
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10">
                                        <img
                                            src={transferProofPreview}
                                            alt="Bukti Transfer"
                                            className="w-full max-h-48 object-contain"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <button
                                                type="button"
                                                onClick={() => { setTransferProof(null); setTransferProofPreview(null); }}
                                                className="bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="p-3 bg-violet-600/10 dark:bg-violet-900/40 flex items-center gap-2">
                                            <FileCheck2 className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                                            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 truncate">{transferProof?.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="transfer-proof-input"
                                        className="flex flex-col items-center justify-center gap-3 w-full p-6 rounded-2xl border-2 border-dashed border-violet-300 dark:border-violet-600/50 bg-violet-50/50 dark:bg-violet-900/10 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-300 cursor-pointer group"
                                    >
                                        <div className="p-4 rounded-2xl bg-violet-100 dark:bg-violet-800/30 text-violet-500 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                            <ImageIcon className="w-7 h-7" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-violet-600 dark:text-violet-400">Klik untuk upload foto / file</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Format yang didukung: JPG, JPEG, PNG</p>
                                        </div>
                                        <input
                                            id="transfer-proof-input"
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={handleTransferProofChange}
                                        />
                                    </label>
                                )}
                            </div>
                        )}

                        <Button
                            onClick={handleCheckout}
                            disabled={isCashless ? !transferProof : payAmount < total}
                            className={`w-full py-5 text-xl font-black rounded-[1.5rem] shadow-2xl ${
                                isCashless
                                    ? 'shadow-violet-600/40 bg-violet-600 hover:bg-violet-700'
                                    : 'shadow-indigo-600/40'
                            }`}
                            icon={CheckCircle2}
                        >
                            Konfirmasi Transaksi
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
