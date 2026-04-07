import { toJpeg, toSvg } from 'html-to-image'; // Ganti toPng ke toJpeg
import { jsPDF } from 'jspdf';

export const useExport = () => {
    const exportHighRes = async (elementId: string, fileName: string, format: 'png' | 'pdf') => {
        const node = document.getElementById(elementId);
        if (!node) return;

        try {
            // 1. Tambahkan pengecekan apakah semua gambar di dalam node sudah ter-load
            const images = node.getElementsByTagName('img');
            const imagePromises = Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
            });

            await Promise.all(imagePromises);

            await toSvg(node)
            
            // 2. Berikan delay tambahan khusus untuk WebKit (iOS)
            await new Promise(resolve => setTimeout(resolve, 1000));


            const width = node.scrollWidth;
            const height = node.scrollHeight;

            // 2. Gunakan toJpeg (bukan PNG) karena jauh lebih ringan
            const dataUrl = await toJpeg(node, {
                width: width,
                height: height,
                pixelRatio: 1.5, // 1.5x sudah sangat cukup untuk cetak A3 sekalipun
                quality: 0.85,    // Kompresi 85% (kualitas tetap sangat bagus, ukuran file anjlok)
                backgroundColor: '#ffffff',
                cacheBust: true,
            });

            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `${fileName}.jpg`; // Gunakan .jpg
                link.href = dataUrl;
                link.click();
            } else {
                // 3. Tambahkan kompresi internal pada jsPDF
                const pdf = new jsPDF({
                    orientation: width > height ? 'l' : 'p',
                    unit: 'px',
                    format: [width, height],
                    compress: true // Aktifkan kompresi internal PDF
                });

                // 'FAST' adalah metode kompresi jsPDF
                pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height, undefined, 'FAST');
                pdf.save(`${fileName}.pdf`);
            }
        } catch (err) {
            console.error('Export Error:', err);
        }
    };

    return { exportHighRes };
};