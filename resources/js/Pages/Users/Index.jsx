import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';
import { Search, Plus, Edit2, Trash2, Users, X, Shield, Mail, User } from "lucide-react";
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

import Badge from '@/Components/UI/Badge';
import PageHeader from '@/Components/UI/PageHeader';
import ConfirmModal from '@/Components/UI/ConfirmModal';

export default function Index({ auth, users, filters }) {
    const [editId, setEditId] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const { data, setData, post, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            router.put(`/users/${editId}`, data, {
                onSuccess: () => {
                    reset();
                    setEditId(null);
                },
            });
        } else {
            post('/users', {
                onSuccess: () => reset(),
            });
        }
    };

    const editData = (item) => {
        setEditId(item.id);
        setData({
            name: item.name,
            email: item.email,
            password: '',
        });
    };

    const handleDelete = () => {
        if (!deleteItem) return;
        router.delete(`/users/${deleteItem.id}`, {
            onSuccess: () => setDeleteItem(null),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen User" />

            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeader 
                    title="Manajemen User" 
                    subtitle="Kelola akun pengguna sistem."
                    badge="Pengaturan Sistem"
                    icon={Users}
                >
                    <Input 
                        icon={Search} 
                        placeholder="Cari user..." 
                        defaultValue={filters.search} 
                        onChange={(e) => router.get('/users', { search: e.target.value }, { preserveState: true, replace: true })}
                        className="sm:w-64"
                    />
                </PageHeader>

                <Card>
                    <div className="flex items-center gap-2 mb-6">
                        <Badge variant={editId ? 'warning' : 'primary'} icon={editId ? Edit2 : Plus}>
                            {editId ? 'Edit User' : 'Tambah User Baru'}
                        </Badge>
                    </div>

                    <form onSubmit={submit} className="grid md:grid-cols-4 gap-4">
                        <Input 
                            label="Nama Lengkap"
                            icon={User}
                            placeholder="Nama..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                        <Input 
                            label="Email"
                            type="email"
                            icon={Mail}
                            placeholder="email@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                        />
                        <Input 
                            label={editId ? "Password (Kosongkan jika tetap)" : "Password"}
                            type="password"
                            placeholder="********"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required={!editId}
                        />

                        <div className="flex items-end gap-2">
                            <Button 
                                type="submit" 
                                variant={editId ? 'warning' : 'primary'} 
                                className="flex-1"
                                icon={editId ? Edit2 : Plus}
                            >
                                {editId ? 'Update' : 'Simpan'}
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
                                    <th className="px-6 py-4 text-left font-semibold">User</th>

                                    <th className="px-6 py-4 text-center font-semibold">Role</th>
                                    <th className="px-6 py-4 text-center font-semibold">Terdaftar</th>
                                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                {users.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-center text-slate-400 font-medium">
                                            {(users.current_page - 1) * users.per_page + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-left font-bold text-slate-800 dark:text-slate-200">
                                            <div className="flex flex-col">
                                                <span>{item.name}</span>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {item.email}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={item.role === 'admin' ? 'info' : 'slate'} icon={Shield}>
                                                {item.role === 'admin' ? 'Administrator' : 'Kasir'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => editData(item)} title="Edit User" className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                {item.id !== auth.user.id && (
                                                    <button onClick={() => setDeleteItem(item)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <ConfirmModal 
                show={!!deleteItem} 
                onClose={() => setDeleteItem(null)} 
                onConfirm={handleDelete}
                message={deleteItem ? `User ${deleteItem.name} akan dihapus secara permanen.` : ''}
            />
        </AuthenticatedLayout>
    );
}
