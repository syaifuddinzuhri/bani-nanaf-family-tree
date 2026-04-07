import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const useExport = () => {
    const exportHighRes = async (elementId: string, fileName: string, format: 'png' | 'pdf') => {
        const node = document.getElementById(elementId);
        if (!node) return;

        try {
            // 1. Tambahkan delay kecil agar gambar Base64 benar-benar ter-render oleh browser
            await new Promise(resolve => setTimeout(resolve, 500));

            const width = node.scrollWidth;
            const height = node.scrollHeight;

            // 2. Gunakan toPng dengan opsi yang lebih ketat
            const dataUrl = await toPng(node, {
                width: width,
                height: height,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                skipFonts: false,
                cacheBust: true, // Membersihkan cache agar gambar terbaru diambil
                style: {
                    visibility: 'visible',
                }
            });

            if (format === 'png') {
                const link = document.createElement('a');
                link.download = `${fileName}.png`;
                link.href = dataUrl;
                link.click();
            } else {
                const pdf = new jsPDF({
                    orientation: width > height ? 'l' : 'p',
                    unit: 'px',
                    format: [width, height]
                });
                pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
                pdf.save(`${fileName}.pdf`);
            }
        } catch (err) {
            console.error('Export Error:', err);
        }
    };

    return { exportHighRes };
};