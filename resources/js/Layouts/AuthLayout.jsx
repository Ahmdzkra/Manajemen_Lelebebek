import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

            <Head title={title} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
            >
                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-gray-200 text-center text-sm mb-6">
                        {subtitle}
                    </p>
                )}

                {children}
            </motion.div>
        </div>
    );
}