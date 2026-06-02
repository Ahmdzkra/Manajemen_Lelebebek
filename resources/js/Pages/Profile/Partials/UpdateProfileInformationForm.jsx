import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
            _method: 'patch',
        });

    const [imageSrc, setImageSrc] = useState(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [confirmingAvatarDeletion, setConfirmingAvatarDeletion] = useState(false);

    const confirmAvatarDeletion = () => {
        setConfirmingAvatarDeletion(true);
    };

    const deleteAvatar = () => {
        router.delete(route('profile.avatar.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingAvatarDeletion(false);
                setAvatarPreview(null);
                setData('avatar', null);
            },
        });
    };
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            const touch = e.touches[0];
            setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        setOffset({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
        });
    };

    const cropImage = () => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');

            const viewSize = 256;
            const defaultWidth = viewSize;
            const defaultHeight = (img.height / img.width) * viewSize;
            
            const renderWidth = defaultWidth * zoom;
            const renderHeight = defaultHeight * zoom;
            
            const screenX = (viewSize - renderWidth) / 2 + offset.x;
            const screenY = (viewSize - renderHeight) / 2 + offset.y;
            
            const scaleFactor = 300 / viewSize;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 300, 300);
            
            ctx.drawImage(
                img,
                screenX * scaleFactor,
                screenY * scaleFactor,
                renderWidth * scaleFactor,
                renderHeight * scaleFactor
            );
            
            canvas.toBlob((blob) => {
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
                setData('avatar', file);
                setAvatarPreview(URL.createObjectURL(file));
                setCropModalOpen(false);
            }, 'image/jpeg', 0.9);
        };
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl font-extrabold text-slate-400 dark:text-slate-500">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="uppercase text-slate-500 dark:text-slate-300">
                                    {data.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        
                        <label 
                            htmlFor="avatar-input"
                            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-lg transition-all scale-95 hover:scale-105"
                            title="Unggah Foto Profil"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImageSrc(reader.result);
                                        setZoom(1);
                                        setOffset({ x: 0, y: 0 });
                                        setCropModalOpen(true);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                    
                    <div className="flex flex-col text-center sm:text-left gap-1">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Foto Profil</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Pilih foto profil yang menarik. Format JPG, PNG, atau WEBP maks 2MB.
                        </span>
                        {errors.avatar && (
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
                                {errors.avatar}
                            </span>
                        )}
                        {user.avatar && (
                            <button
                                type="button"
                                onClick={confirmAvatarDeletion}
                                className="mt-2 w-fit px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800/40 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1.5 transition-all self-center sm:self-start shadow-sm"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Hapus Foto Profil
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">
                            Alamat email Anda belum terverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-slate-600 dark:text-slate-400 underline hover:text-slate-900 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>

            {cropModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/60 w-full max-w-md overflow-hidden p-6 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                            Sesuaikan Foto Profil
                        </h3>
                        
                        {/* Circular Cropping Viewport */}
                        <div 
                            className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-indigo-500 shadow-inner bg-slate-950 select-none cursor-move flex items-center justify-center"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            {imageSrc && (
                                <img
                                    src={imageSrc}
                                    alt="Potong foto"
                                    className="max-w-none pointer-events-none select-none"
                                    style={{
                                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                        width: '256px',
                                        height: 'auto',
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                    }}
                                />
                            )}
                            
                            <div className="absolute inset-0 pointer-events-none border border-white/30 rounded-full"></div>
                        </div>
                        
                        {/* Zoom Slider */}
                        <div className="w-full mt-6 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                <span>Perkecil</span>
                                <span>Perbesar</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                        
                        {/* Controls */}
                        <div className="flex gap-3 w-full mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setCropModalOpen(false);
                                    setImageSrc(null);
                                }}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={cropImage}
                                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-sm shadow-lg shadow-indigo-600/25"
                            >
                                Potong & Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={confirmingAvatarDeletion} onClose={() => setConfirmingAvatarDeletion(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Hapus Foto Profil
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Apakah Anda yakin ingin menghapus foto profil Anda? Tindakan ini akan menghapus foto dari server secara permanen dan mengembalikan tampilan profil ke inisial nama Anda.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingAvatarDeletion(false)}>
                            Batal
                        </SecondaryButton>

                        <DangerButton onClick={deleteAvatar}>
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
