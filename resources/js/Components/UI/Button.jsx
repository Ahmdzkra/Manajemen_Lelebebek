import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    className = '', 
    onClick, 
    disabled = false,
    loading = false,
    icon: Icon
}) {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30',
        secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
        info: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/30',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400',
    };

    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-lg focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
    
    const ringStyles = {
        primary: 'focus:ring-indigo-500',
        secondary: 'focus:ring-slate-400',
        danger: 'focus:ring-rose-500',
        warning: 'focus:ring-amber-400',
        success: 'focus:ring-emerald-500',
        info: 'focus:ring-cyan-500',
        ghost: 'focus:ring-slate-300',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${ringStyles[variant] || ringStyles.primary} ${className}`}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : Icon ? (
                <Icon className="w-5 h-5" />
            ) : null}
            {children}
        </button>
    );
}
