import { toPng } from 'html-to-image';

export const useExport = () => {
    const exportToImage = async (elementId: string, fileName: string) => {
        const el = document.getElementById(elementId);
        if (!el) return;

        try {
            // 1. Tambahkan loading state jika perlu
            const dataUrl = await toPng(el, {
                cacheBust: true,
                backgroundColor: '#F8FAFC', // Samakan dengan bg silsilah agar tidak transparan
                quality: 1,
                pixelRatio: 2, // Meningkatkan ketajaman gambar (Retina Ready)
            });

            // 2. Buat link download otomatis
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Gagal export gambar:', err);
            alert('Maaf, terjadi kesalahan saat mengekspor gambar.');
        }
    };

    return { exportToImage };
};