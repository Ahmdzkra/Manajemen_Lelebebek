import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { formatRupiah } from '@/utils/formatters';

export default function Print({ transaction, sale }) {
    // Standardize to a single unified receipt data structure
    const receiptData = transaction || (sale ? {
        id: sale.id,
        invoice_no: `INV-${sale.id}`,
        created_at: sale.created_at,
        user: { name: 'Kasir' },
        details: [{
            id: 1,
            product: sale.product || { name: 'Produk Tanpa Nama' },
            qty: sale.qty,
            selling_price: sale.price,
            subtotal: sale.total
        }],
        subtotal: sale.total,
        discount: 0,
        tax: 0,
        total: sale.total,
        pay_amount: sale.total,
        change_amount: 0,
        payment_method: 'cash'
    } : null);

    useEffect(() => {
        // Auto open print dialog
        const timer = setTimeout(() => {
            window.print();
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (!receiptData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-500 font-mono">
                Memuat data nota...
            </div>
        );
    }

    const formatDateOnly = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const formatTimeOnly = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };

    const getReceiptId = (dateString) => {
        const date = dateString ? new Date(dateString) : new Date();
        const yyyymmdd = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
        const hhmmss = date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0') +
            date.getSeconds().toString().padStart(2, '0');
        return `164135${yyyymmdd}${hhmmss}`;
    };

    const totalQty = receiptData.details?.reduce((acc, detail) => acc + Number(detail.qty), 0) || 0;

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen font-mono text-slate-900 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0 print:text-black">
            <Head title={`Nota-${receiptData.invoice_no || ''}`} />

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
            <div className="w-full max-w-[360px] bg-white mt-16 p-6 shadow-2xl rounded-2xl print:shadow-none print:border-none print:mt-0 print:p-4 print:max-w-full print:w-full text-black">

                {/* Store Header Icon */}
                <div className="text-center flex flex-col items-center">
                    <svg className="w-14 h-14 text-black mb-2" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16H60V22H4V16Z" fill="currentColor" />
                        <path d="M8 22H56V56H8V22Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M16 34H28V56H16V34Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M36 34H48V46H36V34Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                        <path d="M6 10H58V16H6V10Z" fill="currentColor" />
                        <path d="M12 6H52V10H12V6Z" fill="currentColor" />
                        <path d="M22 42V48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    <h1 className="text-lg font-bold tracking-tight mt-1">LeleBek</h1>
                    <p className="text-[10px] leading-tight mt-1 text-center font-semibold">
                        Jl. Karimata 69, Jember<br />
                    </p>
                    <p className="text-[10px] mt-0.5 font-semibold">No. Telp 0812345678</p>
                    {/* <p className="text-[10px] mt-0.5 tracking-wider font-semibold">{getReceiptId(receiptData.created_at)}</p> */}
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-black/80 my-3"></div>

                {/* Metadata Info */}
                <div className="flex justify-between text-[11px] leading-normal font-semibold">
                    <div className="text-left space-y-0.5">
                        <div>{formatDateOnly(receiptData.created_at)}</div>
                        <div>{formatTimeOnly(receiptData.created_at)}</div>
                        <div className="pt-2">No. {(receiptData.invoice_no || '').replace('INV-', '')}</div>
                    </div>
                    <div className="text-right space-y-0.5">
                        <div className="lowercase">{receiptData.user?.name || 'karis'}</div>
                        <div className="text-[10px] leading-tight text-right">Jl. Karimata 69, Jember</div>
                    </div>
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-black/80 my-3"></div>

                {/* Items List */}
                <div className="space-y-3 font-semibold">
                    {receiptData.details?.map((detail, index) => (
                        <div key={detail.id} className="text-[11px]">
                            <div className="font-bold">{index + 1}. {detail.product?.name}</div>
                            <div className="flex justify-between pl-3 mt-0.5">
                                <span>{detail.qty} x {Number(detail.selling_price).toLocaleString('id-ID')}</span>
                                <span>{formatRupiah(detail.subtotal)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashed Separator */}
                <div className="border-t border-dashed border-black/80 my-3"></div>

                {/* Totals & Calculations */}
                <div className="text-[11px] space-y-1 font-semibold">
                    <div>Total QTY : {totalQty}</div>

                    <div className="border-t border-dashed border-black/80 my-2"></div>

                    <div className="flex justify-between">
                        <span>Sub Total</span>
                        <span>{formatRupiah(receiptData.subtotal)}</span>
                    </div>

                    {receiptData.discount > 0 && (
                        <div className="flex justify-between text-black">
                            <span>Diskon</span>
                            <span>-{formatRupiah(receiptData.discount)}</span>
                        </div>
                    )}

                    {receiptData.tax > 0 && (
                        <div className="flex justify-between">
                            <span>Pajak (10%)</span>
                            <span>{formatRupiah(receiptData.tax)}</span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-[12px] pt-0.5">
                        <span>Total</span>
                        <span>{formatRupiah(receiptData.total)}</span>
                    </div>

                    <div className="flex justify-between pt-0.5">
                        <span>Bayar (Cash)</span>
                        <span>{formatRupiah(receiptData.pay_amount)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Kembali</span>
                        <span>{formatRupiah(receiptData.change_amount)}</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="text-center mt-6 flex flex-col items-center">
                    <div className="border-t border-dashed border-black/80 w-full mb-3"></div>

                    {/* Centered Box like the highlighted one in the screenshot */}
                    <div className="border border-black px-4 py-1.5 font-bold my-1 text-xs tracking-wide">
                        Terimakasih Telah Berbelanja
                    </div>

                    {/* Critique & Suggestion Link */}
                    <div className="text-[10px] mt-3 space-y-0.5 font-semibold text-black/90">
                        <div>Link Kritik dan Saran:</div>
                        <div className="tracking-wide lowercase">lelebek.com/Saran</div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .print\\:text-black {
                        color: black !important;
                    }
                    .print\\:border-black {
                        border-color: black !important;
                    }
                }
            ` }} />
        </div>
    );
}
