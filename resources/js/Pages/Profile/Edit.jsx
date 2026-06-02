import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                    Profil
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 p-4 shadow-sm shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:p-8 border border-slate-100 dark:border-slate-700/60">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 shadow-sm shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:p-8 border border-slate-100 dark:border-slate-700/60">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 shadow-sm shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:p-8 border border-slate-100 dark:border-slate-700/60">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
