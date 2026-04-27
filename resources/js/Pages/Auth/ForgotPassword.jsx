import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLayout from '@/Layouts/AuthLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Masukkan email untuk menerima link reset"
        >

            {/* STATUS */}
            {status && (
                <div className="mb-4 text-sm text-green-300 text-center">
                    {status}
                </div>
            )}

            {/* INFO */}
            <p className="text-sm text-gray-200 text-center mb-6">
                Kami akan mengirimkan link reset password ke email kamu.
            </p>

            <form onSubmit={submit}>

                {/* EMAIL */}
                <div>
                    <div className="relative">
                        <TextInput
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg bg-white/80 pl-10"
                            placeholder="Masukkan email"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute left-3 top-3 text-gray-500"
                        >
                            <Mail size={18} />
                        </motion.div>
                    </div>

                    <InputError message={errors.email} className="mt-2 text-red-300" />
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center bg-white text-indigo-600"
                        disabled={processing}
                    >
                        Kirim Link Reset
                    </PrimaryButton>
                </div>

            </form>

        </AuthLayout>
    );
}