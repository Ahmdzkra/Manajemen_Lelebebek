/**
 * Format angka menjadi format Rupiah Indonesia.
 * Contoh: 1000000 → "Rp 1.000.000"
 *         20000   → "Rp 20.000"
 *         500     → "Rp 500"
 *
 * @param {number|string} value
 * @returns {string}
 */
export function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID', {
        maximumFractionDigits: 0,
    });
}

/**
 * Mengembalikan tanggal hari ini dalam format YYYY-MM-DD
 * (format yang dibutuhkan input type="date").
 *
 * @returns {string}
 */
export function todayDate() {
    return new Date().toLocaleDateString('en-CA'); // en-CA menghasilkan format YYYY-MM-DD
}

/**
 * Format tanggal/datetime menjadi format konsisten DD-MM-YYYY | HH.MM WIB.
 * Selalu menggunakan timezone Asia/Jakarta (WIB).
 * Contoh: "2026-04-30T08:31:24Z" → "30-04-2026 | 15.31 WIB"
 *         "2026-04-30"           → "30-04-2026"
 *
 * @param {string|Date} value
 * @param {boolean} withTime - tampilkan jam.menit untuk tipe datetime (default true)
 * @returns {string}
 */
export function formatDate(value, withTime = true) {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d)) return value;

    // Konversi ke WIB (Asia/Jakarta, UTC+7)
    const wib = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

    const dd   = String(wib.getDate()).padStart(2, '0');
    const mm   = String(wib.getMonth() + 1).padStart(2, '0');
    const yyyy = wib.getFullYear();

    // Jika value mengandung T atau spasi (datetime), tampilkan jam juga
    const hasTime = String(value).includes('T') || String(value).includes(' ');
    if (withTime && hasTime) {
        const hh  = String(wib.getHours()).padStart(2, '0');
        const min = String(wib.getMinutes()).padStart(2, '0');
        return `${dd}-${mm}-${yyyy} | ${hh}.${min} WIB`;
    }

    return `${dd}-${mm}-${yyyy}`;
}
