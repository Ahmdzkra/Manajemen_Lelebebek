import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Package, ArrowLeft, CheckCircle2, Calendar } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

export default function Create({ auth }) {
    const d = new Date();
    const localToday = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        created_at: localToday,
    });

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
