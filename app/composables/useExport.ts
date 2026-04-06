import { toPng } from 'html-to-image';

export const useExport = () => {
    const exportToImage = async (elementId: string, fileName: string) => {
        const originalNode = document.getElementById(elementId);
        if (!originalNode) return;

        // 1. Buat Container Tersembunyi (Off-screen)
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        // PAKSA LEBAR DESKTOP (Misal min 1600px atau sesuai scrollWidth)
        const exportWidth = Math.max(originalNode.scrollWidth, 1400);
        container.style.width = `${exportWidth}px`;
        document.body.appendChild(container);

        // 2. Clone elemen silsilah ke dalam container tersembunyi
        const clone = originalNode.cloneNode(true) as HTMLElement;

        // 3. Bersihkan elemen yang tidak diinginkan di foto (seperti scrollbar/hint)
        const scrollbar = clone.querySelector('.custom-scrollbar');
        if (scrollbar) {
            (scrollbar as HTMLElement).style.overflow = 'visible';
            (scrollbar as HTMLElement).style.height = 'auto';
        }

        container.appendChild(clone);

        try {
            // 4. Potret kloningan yang sudah lebar (Desktop Mode)
            const dataUrl = await toPng(clone, {
                backgroundColor: '#F8FAFC',
                skipFonts: false,
                cacheBust: true,
                quality: 1,
                pixelRatio: 2, // Hasil 2x lebih tajam
                width: exportWidth,
                height: clone.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    borderRadius: '0',
                    // Paksa semua elemen flex-col di mobile kembali ke flex-row
                    // Kita override style header agar selalu landscape
                }
            });

            // 5. Download
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();

        } catch (err) {
            console.error('Export Gagal:', err);
        } finally {
            // 6. Hapus container sampah dari memori
            document.body.removeChild(container);
        }
    };

    return { exportToImage };
};