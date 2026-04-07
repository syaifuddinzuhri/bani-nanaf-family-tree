import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const useExport = () => {
    const exportHighRes = async (elementId: string, fileName: string, format: 'png' | 'pdf') => {
        const node = document.getElementById(elementId);
        if (!node) return;

        try {
            // 1. Dapatkan ukuran asli elemen shadow
            const width = node.scrollWidth;
            const height = node.scrollHeight;

            // 2. Foto elemen shadow tersebut
            const dataUrl = await toPng(node, {
                width: width,
                height: height,
                pixelRatio: 2, // Biar hasil sangat tajam
                backgroundColor: '#ffffff',
                skipFonts: false,
                cacheBust: true,
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