import type { FamilyMember, FamilyMemberNode } from '~/types/family'

export const useFamilyData = () => {
    const generateData = (): FamilyMember[] => {
        const data: FamilyMember[] = [
            // ==========================================
            // ROOT 1: MBOK SITIN
            // ==========================================
            { id: 'r1', name: 'Mbok Sitin', gender: 'P', spouse: 'Saluwi', parentId: null, gen: 1, rootId: 'r1' },
            // Anak Mbok Sitin
            { id: 'r1-a', name: 'Ratno', gender: 'L', spouse: 'Rumani', parentId: 'r1', gen: 2, rootId: 'r1' },
            { id: 'r1-b', name: 'Atima', gender: 'P', spouse: 'Dayat', parentId: 'r1', gen: 2, rootId: 'r1' },
            { id: 'r1-c', name: 'Kusnan', gender: 'L', spouse: 'Umiyah', parentId: 'r1', gen: 2, rootId: 'r1' },
            { id: 'r1-d', name: 'Karsono', gender: 'L', spouse: 'Sumarli', parentId: 'r1', gen: 2, rootId: 'r1' },
            // Cucu (Anak Ratno)
            { id: 'r1-a1', name: 'Aminah', gender: 'P', spouse: 'Mat Ali', parentId: 'r1-a', gen: 3, rootId: 'r1' },
            { id: 'r1-a2', name: 'Karliyah', gender: 'P', spouse: 'Punawi', parentId: 'r1-a', gen: 3, rootId: 'r1' },
            { id: 'r1-a3', name: 'Ti', gender: 'P', spouse: 'Shoheh', parentId: 'r1-a', gen: 3, rootId: 'r1' },
            // Cucu (Anak Atima)
            { id: 'r1-b1', name: 'Jidah', gender: 'P', spouse: 'Ali', parentId: 'r1-b', gen: 3, rootId: 'r1' },
            { id: 'r1-b2', name: 'Carni', gender: 'P', spouse: null, parentId: 'r1-b', gen: 3, rootId: 'r1' },
            { id: 'r1-b3', name: 'Sudarmi', gender: 'P', spouse: 'Lasidi', parentId: 'r1-b', gen: 3, rootId: 'r1' },
            // Cucu (Anak Kusnan)
            { id: 'r1-c1', name: 'Muslimin', gender: 'L', spouse: 'Mulyati', parentId: 'r1-c', gen: 3, rootId: 'r1' },
            { id: 'r1-c2', name: 'Zubaidah', gender: 'P', spouse: 'Supri', parentId: 'r1-c', gen: 3, rootId: 'r1' },
            { id: 'r1-c3', name: 'Agus', gender: 'L', spouse: 'Mahmudah', parentId: 'r1-c', gen: 3, rootId: 'r1' },

            // ==========================================
            // ROOT 2: SARIM
            // ==========================================
            { id: 'r2', name: 'Sarim', gender: 'L', spouse: 'Mantra', parentId: null, gen: 1, rootId: 'r2' },
            { id: 'r2-a', name: 'Lipah', gender: 'P', spouse: 'Samudi', parentId: 'r2', gen: 2, rootId: 'r2' },
            { id: 'r2-b', name: 'Darsono', gender: 'L', spouse: null, parentId: 'r2', gen: 2, rootId: 'r2' },
            { id: 'r2-c', name: 'Salimah', gender: 'P', spouse: 'Mukhtadi', parentId: 'r2', gen: 2, rootId: 'r2' },
            // Cucu (Anak Lipah)
            { id: 'r2-a1', name: 'Hj. Lilik', gender: 'P', spouse: 'H. Yazid', parentId: 'r2-a', gen: 3, rootId: 'r2' },
            { id: 'r2-a2', name: 'Edi S.', gender: 'L', spouse: 'Malikhah', parentId: 'r2-a', gen: 3, rootId: 'r2' },
            { id: 'r2-a3', name: 'Srinanik', gender: 'P', spouse: 'Qosim', parentId: 'r2-a', gen: 3, rootId: 'r2' },

            // ==========================================
            // ROOT 3: LASEMUN
            // ==========================================
            { id: 'r3', name: 'Lasemun', gender: 'L', spouse: 'Mak Sup', parentId: null, gen: 1, rootId: 'r3' },
            { id: 'r3-a', name: 'Ali Maksum', gender: 'L', spouse: null, parentId: 'r3', gen: 2, rootId: 'r3' },
            { id: 'r3-b', name: 'Khuzaimi', gender: 'L', spouse: 'Tiara', parentId: 'r3', gen: 2, rootId: 'r3' },
            { id: 'r3-c', name: 'Khodijah', gender: 'P', spouse: null, parentId: 'r3', gen: 2, rootId: 'r3' },
            { id: 'r3-d', name: 'Habibah', gender: 'P', spouse: 'Rasuki', parentId: 'r3', gen: 2, rootId: 'r3' },
            // Cucu (Anak Ali Maksum)
            { id: 'r3-a1', name: 'Ulfa', gender: 'P', spouse: 'Sarifuddin', parentId: 'r3-a', gen: 3, rootId: 'r3' },
            { id: 'r3-a2', name: 'Nining', gender: 'P', spouse: null, parentId: 'r3-a', gen: 3, rootId: 'r3' },

            // ==========================================
            // ROOT 4: NASIAH
            // ==========================================
            { id: 'r4', name: 'Nasiah', gender: 'P', spouse: 'Kalil', parentId: null, gen: 1, rootId: 'r4' },
            { id: 'r4-a', name: 'Duriyati', gender: 'P', spouse: 'Muslikh', parentId: 'r4', gen: 2, rootId: 'r4' },
            { id: 'r4-b', name: 'Paini', gender: 'P', spouse: 'Aruman', parentId: 'r4', gen: 2, rootId: 'r4' },
            { id: 'r4-c', name: 'M. Ilyas', gender: 'L', spouse: 'Kholis', parentId: 'r4', gen: 2, rootId: 'r4' },
            // Cucu (Anak Duriyati)
            { id: 'r4-a1', name: 'Nurul', gender: 'P', spouse: 'Supardi', parentId: 'r4-a', gen: 3, rootId: 'r4' },
            { id: 'r4-a2', name: 'Fatkhiyah', gender: 'P', spouse: 'Junaidi', parentId: 'r4-a', gen: 3, rootId: 'r4' },

            // --- BARU: Cicit (Anak Fatkhiyah) ---
            { id: 'r4-a2-1', name: 'Zidan', gender: 'L', spouse: null, parentId: 'r4-a2', gen: 4, rootId: 'r4' },
            // Cucu (Anak Ilyas)
            { id: 'r4-c1', name: 'Lia', gender: 'P', spouse: 'Mahmud', parentId: 'r4-c', gen: 3, rootId: 'r4' },

            // ==========================================
            // ROOT 5: MISTAR (Dengan Supeni)
            // ==========================================
            { id: 'r5', name: 'Mistar', gender: 'L', spouse: 'Supeni', parentId: null, gen: 1, rootId: 'r5' },
            { id: 'r5-a', name: 'Siyama', gender: 'P', spouse: 'Lasidi', parentId: 'r5', gen: 2, rootId: 'r5' },
            { id: 'r5-b', name: 'Rumana', gender: 'P', spouse: 'Mulyadi', parentId: 'r5', gen: 2, rootId: 'r5' },
            { id: 'r5-c', name: 'Ponadi', gender: 'L', spouse: 'Sri', parentId: 'r5', gen: 2, rootId: 'r5' },
            { id: 'r5-d', name: 'Widianto', gender: 'L', spouse: 'Sulis', parentId: 'r5', gen: 2, rootId: 'r5' },
            { id: 'r5-e', name: 'Isnawati', gender: 'P', spouse: 'Wawan', parentId: 'r5', gen: 2, rootId: 'r5' },
            // Cucu (Anak Siyama)
            { id: 'r5-a1', name: 'Slamet', gender: 'L', spouse: 'Neni', parentId: 'r5-a', gen: 3, rootId: 'r5' },
            { id: 'r5-a2', name: 'Henik', gender: 'P', spouse: 'Dedik', parentId: 'r5-a', gen: 3, rootId: 'r5' },
            // Cucu (Anak Ponadi)
            { id: 'r5-c1', name: 'Hendro', gender: 'L', spouse: 'Firoh', parentId: 'r5-c', gen: 3, rootId: 'r5' },
            { id: 'r5-c2', name: 'Kiki', gender: 'P', spouse: null, parentId: 'r5-c', gen: 3, rootId: 'r5' },

            // ==========================================
            // ROOT 6: MISTAR (Dengan Ginayah)
            // ==========================================
            { id: 'r6', name: 'Mistar ', gender: 'L', spouse: 'Ginayah', parentId: null, gen: 1, rootId: 'r6' },
            { id: 'r6-a', name: 'Nurida', gender: 'P', spouse: 'Tani', parentId: 'r6', gen: 2, rootId: 'r6' },
            { id: 'r6-b', name: 'Hj. Kusmiati', gender: 'P', spouse: null, parentId: 'r6', gen: 2, rootId: 'r6' },
            { id: 'r6-c', name: 'Supriyadi', gender: 'L', spouse: 'Tanti', parentId: 'r6', gen: 2, rootId: 'r6' },
            { id: 'r6-d', name: 'Bashori', gender: 'L', spouse: 'Tukini', parentId: 'r6', gen: 2, rootId: 'r6' },
            // Cucu (Anak Nurida)
            { id: 'r6-a1', name: 'Puji', gender: 'P', spouse: 'Dul', parentId: 'r6-a', gen: 3, rootId: 'r6' },
            { id: 'r6-a2', name: 'Udin', gender: 'L', spouse: null, parentId: 'r6-a', gen: 3, rootId: 'r6' },
            { id: 'r6-a3', name: 'Saiful', gender: 'L', spouse: null, parentId: 'r6-a', gen: 3, rootId: 'r6' },
        ];
        return data
    }

    const listToTree = (list: FamilyMember[], parentId: string | null = null): FamilyMemberNode[] => {
        return list
            .filter((item) => item.parentId === parentId)
            .map((item) => ({
                ...item,
                children: listToTree(list, item.id),
            }))
    }

    return { generateData, listToTree }
}