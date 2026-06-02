/**
 * Fungsi simpel untuk menggabungkan class Tailwind
 * Tanpa butuh clsx atau tailwind-merge
 */
export function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
