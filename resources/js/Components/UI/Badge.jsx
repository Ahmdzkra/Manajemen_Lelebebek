import React from 'react';

export default function Badge({ 
    children, 
    variant = 'primary', 
    className = '',
    icon: Icon
}) {
    const variants = {
        primary: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
        danger: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
        success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
        info: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        slate: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${variants[variant] || variants.primary} ${className}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {children}
        </span>
    );
}
