import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { formatDate, formatRupiah } from "@/utils/formatters";

function formatNumber(value) {
    return Number(value || 0).toLocaleString("id-ID");
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between gap-4 py-2">
            <span className="text-slate-500 font-bold uppercase tracking-tight text-[10px]">
                {label}
            </span>
            <span className="font-black text-slate-800 text-right">
                {value}
            </span>
        </div>
    );
}

function MiniTable({ title, columns, rows, emptyText }) {
    return (
        <div className="mt-6">
            <div className="border-b-2 border-dashed border-slate-200 mb-3"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-3">
                {title}
            </h2>
            <table className="w-full text-[10px]">
                <thead>
                    <tr className="text-slate-400 uppercase tracking-tight border-b border-dashed border-slate-200">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`py-2 font-black ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, index) => (
                            <tr key={row.key || index} className="border-b border-dashed border-slate-100">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`py-2 align-top font-bold text-slate-700 ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}`}
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-6 text-center text-slate-400 font-bold">
                                {emptyText}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function Print({
    filters = {},
    summary = {},
    topProducts = [],
    supplierPurchases = [],
    returnsByProduct = [],
    stockProducts = [],
    latestSales = [],
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const periodLabel = `${formatDate(filters.start_date, false)} - ${formatDate(filters.end_date, false)}`;

    const topProductsList = Array.isArray(topProducts) ? topProducts : (topProducts?.data || []);
    const productRows = topProductsList.map((item) => ({
        key: item.product_id,
        product: item.product_name,
        qty: formatNumber(item.total_qty),
        total: formatRupiah(item.total_sales),
    }));

    const salesList = Array.isArray(latestSales) ? latestSales : (latestSales?.data || []);
    const saleRows = salesList.map((item) => ({
        key: item.id,
        date: formatDate(item.created_at),
        product: item.product?.name || "-",
        qty: formatNumber(item.qty),
        total: formatRupiah(item.total),
    }));

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-mono text-slate-900 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0">
            <Head title={`Laporan-${filters.start_date}-${filters.end_date}`} />

            <div className="fixed top-6 flex justify-center gap-3 print:hidden z-50">
                <button
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all"
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

            <div className="w-full max-w-[760px] bg-white mt-16 p-8 shadow-2xl rounded-3xl print:shadow-none print:rounded-none print:mt-0 print:max-w-full print:w-full">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
                        LeleBek
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                        Manajemen Stok & Penjualan
                    </p>
                    <div className="border-b-2 border-dashed border-slate-200 my-5"></div>
                    <p className="text-xs font-black uppercase text-slate-800">
                        Laporan Periode
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-widest uppercase">
                        {periodLabel}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 text-xs">
                    <SummaryRow label="Penjualan" value={`${formatNumber(summary.sales_qty)} unit (${formatNumber(summary.sales_count)} transaksi)`} />
                    <SummaryRow label="Omset" value={formatRupiah(summary.sales_total)} />
                    <SummaryRow label="Keuntungan" value={formatRupiah(summary.profit)} />
                </div>

                <MiniTable
                    title="Produk Terlaris"
                    columns={[
                        { key: "product", label: "Produk" },
                        { key: "qty", label: "Qty", align: "center" },
                        { key: "total", label: "Total", align: "right" },
                    ]}
                    rows={productRows}
                    emptyText="Belum ada penjualan pada periode ini"
                />

                <MiniTable
                    title="Penjualan Terbaru"
                    columns={[
                        { key: "date", label: "Tanggal" },
                        { key: "product", label: "Produk" },
                        { key: "qty", label: "Qty", align: "center" },
                        { key: "total", label: "Total", align: "right" },
                    ]}
                    rows={saleRows}
                    emptyText="Belum ada penjualan pada periode ini"
                />

                <div className="text-center mt-12">
                    <div className="border-b border-dashed border-slate-100 mb-6"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                        Dicetak dari LeleBek
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                        Laporan ini dibuat otomatis berdasarkan data transaksi pada periode terpilih.
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center">
                        <div className="w-12 h-1 bg-slate-100 rounded-full mb-2"></div>
                        <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                            LeleBek Segar Dari Alam
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        margin: 10mm;
                        size: A4 portrait;
                    }
                    body {
                        background: white !important;
                    }
                }
            ` }} />
        </div>
    );
}
