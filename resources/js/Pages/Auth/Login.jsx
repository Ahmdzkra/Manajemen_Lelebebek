import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Password Strength
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
        <AuthLayout title="Login" subtitle="Masuk ke sistem">

            {status && (
                <div className="mb-4 text-sm text-green-300 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>

                {/* EMAIL */}
                <div>
                    <InputLabel value="Email" className="text-white" />

                    <div className="relative">
                        <TextInput
                            type="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-lg bg-white/80 border-none focus:ring-2 focus:ring-indigo-400 pl-10"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-y-0 left-3 flex items-center text-gray-500"
                        >
                            <Mail size={18} />
                        </motion.div>
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
                            className="mt-1 block w-full rounded-lg bg-white/80 border-none focus:ring-2 focus:ring-indigo-400 pr-10"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.85 }}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </motion.button>
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

                {/* REMEMBER */}
                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center text-sm text-white">
                        <Checkbox
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-white underline"
                        >
                            Forgot Password?
                        </Link>
                    )}
                </div>

                {/* BUTTON */}
                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center bg-white text-indigo-600"
                        disabled={processing}
                    >
                        Log In
                    </PrimaryButton>
                </div>

                {/* REGISTER */}
                <p className="text-center text-sm text-white mt-4">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="underline">
                        Register
                    </Link>
                </p>

            </form>

        </AuthLayout>
    );
}