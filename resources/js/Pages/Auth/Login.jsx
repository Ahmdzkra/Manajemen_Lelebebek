import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState, useMemo } from 'react';

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
        <GuestLayout title="Selamat Datang Kembali" subtitle="Silahkan login untuk melanjutkan">
            <Head title="Log in" />

            {status && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-600 dark:text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Alamat Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 outline-none backdrop-blur-md"
                            placeholder="hello@gmail.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 outline-none backdrop-blur-md"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="peer appearance-none w-5 h-5 border border-slate-300 dark:border-white/20 rounded bg-white dark:bg-white/5 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
                            />
                            <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                            Ingat Saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {processing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Belum Punya Akun? </span>
                    <Link href={route('register')} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                        Buat Akun
                    </Link>
                </div>

                {/* REGISTER */}
                <p className="text-center text-sm text-white mt-4">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="underline">
                        Register
                    </Link>
                </p>

            </form>

        </GuestLayout>
    );
}