import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Edit2, Trash2, Truck, X, Mail } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import ConfirmModal from '@/Components/UI/ConfirmModal';

export default function Index({ auth, suppliers, filters }) {
    const [editId, setEditId] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const { data, setData, post, reset, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`/suppliers/${editId}`, data, {
                onSuccess: () => {
                    reset();
                    setEditId(null);
                },
            });
        } else {
            post('/suppliers', {
                onSuccess: () => reset(),
            });
        }
    };

    const editData = (item) => {
        setEditId(item.id);
        setData({
            name: item.name,
            phone: item.phone || '',
            email: item.email || '',
            address: item.address || '',
        });
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        router.delete(`/suppliers/${deleteItem.id}`, {
            onSuccess: () => setDeleteItem(null),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Supplier" />

            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader 
                    title="Daftar Supplier" 
                    subtitle="Kelola data mitra pemasok barang Anda."
                    badge="Manajemen Mitra"
                    icon={Truck}
                >
                    <Input 
                        icon={Search} 
                        placeholder="Cari supplier..." 
                        defaultValue={filters.search} 
                        onChange={(e) => router.get('/suppliers', { search: e.target.value }, { preserveState: true, replace: true })}
                        className="sm:w-64"
                    />
                </PageHeader>

                <Card>
                    <div className="flex items-center gap-2 mb-6">
                        <Badge variant={editId ? 'warning' : 'success'} icon={editId ? Edit2 : Plus}>
                            {editId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
                        </Badge>
                    </div>

                    <form onSubmit={submit} className="grid md:grid-cols-4 gap-4">
                        <Input 
                            label="Nama Supplier"
                            placeholder="Contoh: PT. Lele Jaya"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />
                        <Input 
                            label="Kontak / HP"
                            placeholder="0812..."
                            type="tel"
                            value={data.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setData('phone', val);
                            }}
                            error={errors.phone}
                        />
                        <Input 
                            label="Email (Opsional)"
                            type="email"
                            icon={Mail}
                            placeholder="supplier@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                        />
                        <Input 
                            label="Alamat"
                            placeholder="Alamat lengkap..."
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            error={errors.address}
                        />
                        <div className="flex items-end gap-2">
                            <Button 
                                type="submit" 
                                variant={editId ? 'warning' : 'success'} 
                                className="flex-1"
                                icon={editId ? Edit2 : Plus}
                            >
                                {editId ? 'Update' : 'Tambah'}
                            </Button>
                            {editId && (
                                <Button variant="secondary" onClick={() => { setEditId(null); reset(); }}>
                                    <X className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card noPadding>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 text-center font-semibold w-16">No</th>
                                    <th className="px-6 py-4 text-left font-semibold">Nama Supplier</th>
                                    <th className="px-6 py-4 text-left font-semibold">Kontak</th>
                                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Alamat</th>
                                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {suppliers.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-center text-slate-400 font-medium">
                                            {(suppliers.current_page - 1) * suppliers.per_page + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <Truck className="w-4 h-4" />
                                                </div>
                                                {item.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-left font-medium">{item.phone || '-'}</td>
                                        <td className="px-6 py-4 text-left text-slate-500 text-xs">{item.email || '-'}</td>
                                        <td className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 italic text-xs">{item.address || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => editData(item)} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteItem(item)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {suppliers.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            Belum ada data supplier.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <ConfirmModal 
                show={!!deleteItem} 
                onClose={() => setDeleteItem(null)} 
                onConfirm={handleDelete}
                message={deleteItem ? `Supplier ${deleteItem.name} akan dihapus.` : ''}
            />
        </AuthenticatedLayout>
    );
}
