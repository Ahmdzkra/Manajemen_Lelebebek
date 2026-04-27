import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLayout from '@/Layouts/AuthLayout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirm Password"
            subtitle="Masukkan password untuk melanjutkan"
        >

            <p className="text-sm text-gray-200 text-center mb-6">
                Area ini aman. Silakan konfirmasi password Anda.
            </p>

            <form onSubmit={submit}>

                {/* PASSWORD */}
                <div>
                    <InputLabel value="Password" className="text-white" />

                    <div className="relative">
                        <TextInput
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            className="mt-1 block w-full rounded-lg bg-white/80 pr-10"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </motion.button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-red-300" />
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center bg-white text-indigo-600"
                        disabled={processing}
                    >
                        Confirm
                    </PrimaryButton>
                </div>

            </form>

        </AuthLayout>
    );
}