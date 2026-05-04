import React from 'react';

export default function Input({ 
    label, 
    error, 
    icon: Icon, 
    className = '', 
    containerClassName = '',
    ...props 
}) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-300 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 ${Icon ? 'pl-11' : ''} ${error ? 'border-rose-500 ring-rose-500/20 focus:border-rose-500 focus:ring-rose-500/50' : ''} ${className}`}
                />
            </div>
            {error && (
                <div className="mt-2 group/error animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 backdrop-blur-sm rounded-xl shadow-lg shadow-rose-500/5 animate-shake">
                        <div className="flex-shrink-0 w-5 h-5 bg-rose-500 rounded-lg flex items-center justify-center shadow-md shadow-rose-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        </div>
                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-tight leading-none">
                            {error}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
