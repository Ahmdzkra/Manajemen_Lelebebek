import React from 'react';
import FlashMessage from '@/Components/FlashMessage';

export default function PageHeader({ 
    title, 
    subtitle, 
    badge, 
    icon: Icon,
    children // For search/sort or other actions
}) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-colors duration-300">
            <div className="flex-1">
                {badge && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-3">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{badge}</span>
                    </div>
                )}
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
                {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>}
            </div>

            <FlashMessage />

            {children && (
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {children}
                </div>
            )}
        </div>
    );
}
