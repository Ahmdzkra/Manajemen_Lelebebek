import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout 
            title="Verifikasi Email" 
            subtitle="Cek email kamu untuk melanjutkan"
        >

            {/* INFO */}
            <p className="text-sm text-gray-200 text-center mb-6">
                Kami telah mengirim link verifikasi ke email kamu. 
                Silakan cek inbox (atau spam) dan klik link tersebut.
            </p>

            {/* STATUS */}
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm text-green-300 text-center">
                    Link verifikasi baru sudah dikirim ✔️
                </div>
            )}

            <form onSubmit={submit}>

                {/* BUTTON */}
                <div className="mt-4">
                    <PrimaryButton
                        className="w-full justify-center bg-white text-indigo-600"
                        disabled={processing}
                    >
                        Kirim Ulang Email Verifikasi
                    </PrimaryButton>
                </div>

                {/* LOGOUT */}
                <div className="mt-4 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-white underline hover:text-gray-200"
                    >
                        Log Out
                    </Link>
                </div>

            </form>

        </AuthLayout>
    );
}