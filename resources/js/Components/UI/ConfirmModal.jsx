import React from 'react';
import Modal from '@/Components/Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = 'Apakah Anda yakin?', 
    message = 'Tindakan ini tidak dapat dibatalkan.', 
    confirmText = 'Ya, Hapus',
    variant = 'danger'
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${
                        variant === 'danger' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 
                        variant === 'warning' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                        'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    }`}>
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 py-3.5"
                    >
                        Batal
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        className="flex-1 py-3.5 shadow-lg"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
