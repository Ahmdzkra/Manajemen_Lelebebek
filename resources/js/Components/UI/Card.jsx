import React from 'react';

export default function Card({ children, className = '', noPadding = false }) {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden transition-all duration-300 ${className}`}>
            <div className={noPadding ? '' : 'p-6 sm:p-8'}>
                {children}
            </div>
        </div>
    );
}
