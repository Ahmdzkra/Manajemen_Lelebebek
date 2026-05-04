import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { todayDate, formatDate } from "@/utils/formatters";
import { ClipboardCheck, PackageSearch, Calendar, FileText, CheckCircle2, TrendingDown, TrendingUp, ArrowRightLeft, Package } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ auth, products = [], opnames = [] }) {
    const { data, setData, post, reset, errors } = useForm({
        product_id: "",
        physical_stock: "",
        note: "",
        date: todayDate(),
    });

    const selectedProduct = products.find((item) => item.id == data.product_id);
    const systemStock = selectedProduct ? Number(selectedProduct.stock) : 0;
    const physicalStock = Number(data.physical_stock || 0);
    const difference = data.physical_stock !== "" ? physicalStock - systemStock : 0;

    const submit = (e) => {
        e.preventDefault();
        post("/stock-opnames", {
            onSuccess: () => reset({ product_id: "", physical_stock: "", note: "", date: todayDate() }),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Stok Opname" />

            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader 
                    title="Stok Opname" 
                    subtitle="Cocokkan jumlah stok tercatat pada sistem dengan kondisi fisik di gudang."
                    badge="Inventory Audit"
                    icon={ClipboardCheck}
                />

                <Card noPadding>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                        <Badge variant="info" icon={PackageSearch}>Form Audit Stok</Badge>
                    </div>

                    <form onSubmit={submit} className="p-6 grid md:grid-cols-2 gap-5">
                        <Select 
                            label="Produk"
                            icon={Package}
                            value={data.product_id}
                            onChange={(e) => setData("product_id", e.target.value)}
                            options={products.map(p => ({ 
                                label: `${p.name} (Jumlah: ${p.stock})`, 
                                value: p.id 
                            }))}
                            error={errors.product_id}
                            required
                        />

                        <Input 
                            label="Stok Fisik (Aktual)"
                            type="number"
                            min="0"
                            placeholder="Jumlah barang fisik"
                            value={data.physical_stock}
                            onChange={(e) => setData("physical_stock", e.target.value)}
                            error={errors.physical_stock}
                            required
                        />

                        <Input 
                            label="Tanggal Audit"
                            type="date"
                            icon={Calendar}
                            value={data.date}
                            onChange={(e) => setData("date", e.target.value)}
                            error={errors.date}
                            required
                        />

                        <div className="w-full">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                                Catatan
                            </label>
                            <div className="relative group">
                                <FileText className="absolute top-3.5 left-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <textarea
                                    rows="1"
                                    placeholder="Opsional: Keterangan selisih..."
                                    value={data.note}
                                    onChange={(e) => setData("note", e.target.value)}
                                    className="w-full pl-11 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {data.product_id && data.physical_stock !== "" && (
                            <div className="md:col-span-2 grid grid-cols-3 gap-4 mt-2">
                                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Stok Sistem</p>
                                    <h3 className="text-2xl font-extrabold text-slate-700 dark:text-slate-300">{systemStock}</h3>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ArrowRightLeft className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                </div>
                                <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-colors ${
                                    difference < 0 ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" : 
                                    difference > 0 ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : 
                                    "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20"
                                }`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                                        difference < 0 ? "text-rose-600 dark:text-rose-400" : difference > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
                                    }`}>Selisih</p>
                                    <div className={`flex items-center gap-1.5 text-2xl font-extrabold ${
                                        difference < 0 ? "text-rose-600 dark:text-rose-400" : difference > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
                                    }`}>
                                        {difference < 0 && <TrendingDown className="w-5 h-5" />}
                                        {difference > 0 && <TrendingUp className="w-5 h-5" />}
                                        {difference === 0 && <CheckCircle2 className="w-5 h-5" />}
                                        {difference > 0 ? `+${difference}` : difference}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button 
                            type="submit"
                            variant="info"
                            className="md:col-span-2 py-4 shadow-xl"
                            icon={ClipboardCheck}
                            disabled={!data.product_id || data.physical_stock === ""}
                        >
                            Simpan Hasil Opname
                        </Button>
                    </form>
                </Card>

                <Card noPadding>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Riwayat Opname Terakhir</h2>
                        <Badge variant="slate">{opnames.total || 0} data</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Produk</th>
                                    <th className="px-6 py-4 text-center font-semibold">Stok Sistem</th>
                                    <th className="px-6 py-4 text-center font-semibold">Stok Fisik</th>
                                    <th className="px-6 py-4 text-center font-semibold">Selisih</th>
                                    <th className="px-6 py-4 text-center font-semibold">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {(opnames.data || opnames).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-left font-medium text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                {item.product?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="slate">{item.system_stock}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="primary">{item.physical_stock}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={item.difference < 0 ? 'danger' : item.difference > 0 ? 'success' : 'slate'} icon={item.difference < 0 ? TrendingDown : item.difference > 0 ? TrendingUp : CheckCircle2}>
                                                {item.difference > 0 ? `+${item.difference}` : item.difference}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {formatDate(item.date, false)}
                                        </td>
                                    </tr>
                                ))}
                                {((opnames.data || opnames).length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <PackageSearch className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Belum ada data opname</p>
                                                <p className="text-sm">Lakukan audit stok untuk memastikan akurasi data.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {opnames.links && <Pagination links={opnames.links} />}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
