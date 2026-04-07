import { toJpeg, toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const useExport = () => {
    const exportHighRes = async (elementId: string, fileName: string, format: 'png' | 'pdf') => {
        const node = document.getElementById(elementId);
        if (!node) {
            console.error("Element not found");
            return;
        }

        try {
            // 1. Tunggu semua gambar selesai dimuat (termasuk Base64)
            const images = node.getElementsByTagName('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve; // Tetap lanjukan jika error agar tidak stuck
                });
            });
            await Promise.all(imagePromises);

            // 2. Trik Khusus iOS: Trigger render mesin WebKit menggunakan toSvg
            await toSvg(node);

            // Berikan jeda waktu setelah trigger render agar browser tenang
            await new Promise(resolve => setTimeout(resolve, 800));

            // 3. Ambil dimensi asli konten
            const width = node.scrollWidth;
            const height = node.scrollHeight;

            // 4. Konfigurasi Dasar html-to-image
            const options = {
                width: width,
                height: height,
                pixelRatio: 1.5, // Keseimbangan antara ketajaman dan ukuran file
                backgroundColor: '#ffffff',
                cacheBust: true,
                skipFonts: false,
            };

            if (format === 'png') {
                // --- EXPORT SEBAGAI PNG (Lossless/High Quality) ---
                const dataUrl = await toPng(node, options);
                const link = document.createElement('a');
                link.download = `${fileName}.png`;
                link.href = dataUrl;
                link.click();
            } else {
                // --- EXPORT SEBAGAI PDF (Compressed) ---
                // Kita gunakan JPEG untuk PDF agar ukuran file tidak membengkak (20MB -> 2MB)
                const dataUrl = await toJpeg(node, { ...options, quality: 0.85 });

                const pdf = new jsPDF({
                    orientation: width > height ? 'l' : 'p',
                    unit: 'px',
                    format: [width, height],
                    compress: true // Kompresi internal PDF
                });

                // Gunakan kompresi 'FAST' atau 'MEDIUM' agar PDF ringan
                pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height, undefined, 'FAST');
                pdf.save(`${fileName}.pdf`);
            }
        } catch (err) {
            console.error('Export Error:', err);
            alert('Maaf, terjadi kendala saat mengekspor dokumen. Silakan coba lagi.');
        }
    };

    return { exportHighRes };
};