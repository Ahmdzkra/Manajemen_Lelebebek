import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { formatRupiah } from '@/utils/formatters';

export default function Print({ sale }) {
    useEffect(() => {
        // Auto open print dialog
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        
        return () => clearTimeout(timer);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', ' |');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-mono text-slate-900 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0">
            <Head title={`Nota-${sale.id}`} />
            
            {/* Control Panel (Hidden when printing) */}
            <div className="fixed top-6 flex justify-center gap-3 print:hidden z-50">
                <button 
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                    Cetak Ulang
                </button>
                <button 
                    onClick={() => window.close()}
                    className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-2xl font-bold transition-all"
                >
                    Tutup
                </button>
            </div>

            {/* Receipt Content */}
            <div className="w-full max-w-[350px] bg-white mt-16 p-8 shadow-2xl rounded-3xl print:shadow-none print:border-none print:mt-0 print:max-w-full print:w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">LeleBek</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                        Segar dari Alam
                    </p>
                    <div className="border-b-2 border-dashed border-slate-200 my-5"></div>
                    <p className="text-xs font-black uppercase text-slate-800">Nota Penjualan</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-widest uppercase">No. #{sale.id}</p>
                </div>

                {/* Info */}
                <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-tighter text-[9px]">Waktu</span>
                        <span className="font-bold text-slate-700">{formatDate(sale.created_at)}</span>
                    </div>
                    
                    <div className="border-b border-dashed border-slate-100 my-4"></div>

                    {/* Items */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-black text-slate-800 uppercase tracking-tight">{sale.product?.name}</span>
                                <span className="text-[10px] text-slate-400 font-bold">@ {formatRupiah(sale.price)}</span>
                            </div>
                            <span className="font-black text-slate-800">x{sale.qty}</span>
                        </div>
                        <div className="flex justify-end pt-1">
                            <span className="font-black text-slate-900 text-sm">{formatRupiah(sale.total)}</span>
                        </div>
                    </div>

                    <div className="border-b-2 border-dashed border-slate-200 my-6"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-xl print:bg-transparent print:px-0">
                        <span className="text-xs font-black uppercase tracking-widest">Total Bayar</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{formatRupiah(sale.total)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <div className="border-b border-dashed border-slate-100 mb-6"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Terima Kasih</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed px-4">
                        Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center">
                        <div className="w-12 h-1 bg-slate-100 rounded-full mb-2"></div>
                        <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.3em]">LeleBek Management System</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    body {
                        background: white !important;
                    }
                }
            ` }} />
        </div>
    );
}
