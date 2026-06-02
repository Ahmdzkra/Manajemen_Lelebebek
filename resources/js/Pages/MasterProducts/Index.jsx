import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Edit2, Trash2, Package, Filter, X, CheckCircle2 } from "lucide-react";
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

    const { data, setData, put, reset, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`/products/${editId}`, {
                name: data.name,
                // We don't send price, so the controller might need to be adjusted or we send the old price
                // Let's check ProductController@update... it requires price.
                // Wait, if ProductController@update requires price, we must send it.
                // Let's get the original price from the product.
                price: products.data.find(p => p.id === editId)?.price || 0,
            }, {
                onSuccess: () => {
                    reset();
                    setEditId(null);
                },
            });
        }
    };

    const handleSearch = (e) => {
        router.get('/master-products', { search: e.target.value, sort: filters.sort }, { preserveState: true, replace: true });
    };

    const handleSort = (e) => {
        router.get('/master-products', { search: filters.search, sort: e.target.value }, { preserveState: true, replace: true });
    };

    const editData = (item) => {
        setEditId(item.id);
        setData({
            name: item.name,
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
            <Head title="Master Produk" />

            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader
                    title="Produk"
                    subtitle="Kelola data induk produk tanpa informasi harga."
                    badge="Data Produk"
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
                    <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/10 animate-in slide-in-from-top-4">
                        <div className="flex items-center justify-between mb-6">
                            <Badge variant="primary" icon={Edit2}>Edit Produk: {data.name}</Badge>
                            <Button variant="ghost" onClick={() => { setEditId(null); reset(); }}>Batal</Button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nama Produk</label>
                                    <Input
                                        placeholder="Masukkan nama produk..."
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="py-4 shadow-xl w-full md:w-auto"
                                    icon={CheckCircle2}
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : null}

                <Card noPadding>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold w-16">No</th>
                                    <th className="px-3 sm:px-6 py-4 text-left font-semibold">Nama Produk</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Stok</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold hidden sm:table-cell">Dibuat Pada</th>
                                    <th className="px-3 sm:px-6 py-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {products.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-3 sm:px-6 py-4 text-center text-slate-400 dark:text-slate-500 font-medium">
                                            {(products.current_page - 1) * products.per_page + index + 1}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Package className="w-4 h-4" />
                                                </div>
                                                <span>{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center">
                                            <Badge variant={item.stock <= 5 ? 'danger' : 'success'}>
                                                {item.stock}
                                            </Badge>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:table-cell">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => editData(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteItem(item)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <Package className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-medium text-lg">Tidak ada data master produk</p>
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
