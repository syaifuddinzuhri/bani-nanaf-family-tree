import { toJpeg } from 'html-to-image'; // Ganti toPng ke toJpeg
import { jsPDF } from 'jspdf';

export const useExport = () => {
    const exportHighRes = async (elementId: string, fileName: string, format: 'png' | 'pdf') => {
        const node = document.getElementById(elementId);
        if (!node) return;

        try {
            // 1. Berikan delay untuk rendering
            await new Promise(resolve => setTimeout(resolve, 800));

            const width = node.scrollWidth;
            const height = node.scrollHeight;

            // 2. Gunakan toJpeg (bukan PNG) karena jauh lebih ringan
            const dataUrl = await toJpeg(node, {
                width: width,
                height: height,
                pixelRatio: 3, // 1.5x sudah sangat cukup untuk cetak A3 sekalipun
                quality: 0.95,    // Kompresi 85% (kualitas tetap sangat bagus, ukuran file anjlok)
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