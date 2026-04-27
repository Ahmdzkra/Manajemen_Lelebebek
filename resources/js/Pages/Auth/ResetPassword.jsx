import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import AuthLayout from '@/Layouts/AuthLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // 🔐 Strength
    const strength = useMemo(() => {
        const p = data.password || '';
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;

        const map = [
            { label: 'Weak', color: 'bg-red-400', width: '25%' },
            { label: 'Fair', color: 'bg-yellow-400', width: '50%' },
            { label: 'Good', color: 'bg-blue-400', width: '75%' },
            { label: 'Strong', color: 'bg-green-400', width: '100%' },
        ];

        return map[score - 1] || { label: '', color: 'bg-gray-300', width: '0%' };
    }, [data.password]);

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Buat password baru"
        >

            <form onSubmit={submit}>

                {/* EMAIL */}
                <div>
                    <InputLabel value="Email" className="text-white" />

                    <div className="relative">
                        <TextInput
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg bg-white/80 pl-10"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                    </div>

                    <InputError message={errors.email} className="mt-2 text-red-300" />
                </div>

                {/* PASSWORD */}
                <div className="mt-4">
                    <InputLabel value="Password" className="text-white" />

                    <div className="relative">
                        <TextInput
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            className="mt-1 block w-full rounded-lg bg-white/80 pr-10"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-red-300" />

                    {/* STRENGTH */}
                    {data.password && (
                        <div className="mt-2">
                            <div className="w-full h-2 bg-gray-300 rounded">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: strength.width }}
                                    className={`h-2 rounded ${strength.color}`}
                                />
                            </div>
                            <p className="text-xs text-white mt-1">
                                Strength: {strength.label}
                            </p>
                        </div>
                    )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mt-4">
                    <InputLabel value="Confirm Password" className="text-white" />

                    <div className="relative">
                        <TextInput
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-lg bg-white/80 pr-10"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-300"
                    />

                    {/* MATCH */}
                    {data.password_confirmation && (
                        <p className={`text-sm mt-1 ${
                            data.password === data.password_confirmation
                                ? 'text-green-300'
                                : 'text-red-300'
                        }`}>
                            {data.password === data.password_confirmation
                                ? 'Password cocok ✔️'
                                : 'Password tidak sama ❌'}
                        </p>
                    )}
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center bg-white text-indigo-600"
                        disabled={processing}
                    >
                        Reset Password
                    </PrimaryButton>
                </div>

            </form>

        </AuthLayout>
    );
}