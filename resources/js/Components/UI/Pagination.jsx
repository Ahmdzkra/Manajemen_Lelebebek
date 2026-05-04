import { router } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2 justify-center sm:justify-start">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => router.visit(link.url, { preserveScroll: true, preserveState: true })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        link.active 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                            : link.url 
                                ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm' 
                                : 'text-slate-400 bg-transparent cursor-not-allowed border border-transparent'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
