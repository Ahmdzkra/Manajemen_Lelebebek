import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ 
    label, 
    error, 
    icon: Icon, 
    options = [], 
    className = '', 
    containerClassName = '',
    placeholder = '-- Pilih --',
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
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <select
                    {...props}
                    className={`w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none bg-none cursor-pointer ${Icon ? 'pl-11' : ''} ${error ? 'border-rose-500 ring-rose-500/20' : ''} ${className}`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-xs font-medium text-rose-500 ml-1">
                    {error}
                </p>
            )}
        </div>
    );
}
