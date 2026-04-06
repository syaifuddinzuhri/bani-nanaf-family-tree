import type { FamilyMember, FamilyMemberNode } from '~/types/family'

export const useFamilyData = () => {
    const generateData = (): FamilyMember[] => {
        const data: FamilyMember[] = [
            // ==========================================
            // ROOT 1: MBOK SITIN
            // ==========================================
            { id: 'r1', name: 'Mbok Sitin', gender: 'P', spouse: 'Saluwi', parentId: null, gen: 1, rootId: 'r1', sortOrder: 0 },

            // ==========================================
            // ROOT 2: SARIM
            // ==========================================
            { id: 'r2', name: 'Sarim', gender: 'L', spouse: 'Mantra', parentId: null, gen: 1, rootId: 'r2', sortOrder: 0 },

            // ==========================================
            // ROOT 3: LASEMUN
            // ==========================================
            { id: 'r3', name: 'Lasemun', gender: 'L', spouse: 'Mak Sup', parentId: null, gen: 1, rootId: 'r3', sortOrder: 0 },

            // ==========================================
            // ROOT 4: NASIAH
            // ==========================================
            { id: 'r4', name: 'Nasiah', gender: 'P', spouse: 'Kalil', parentId: null, gen: 1, rootId: 'r4', sortOrder: 0 },

            // ==========================================
            // ROOT 5: MISTAR (Dengan Supeni)
            // ==========================================
            { id: 'r5', name: 'Mistar', gender: 'L', spouse: 'Supeni', parentId: null, gen: 1, rootId: 'r5', sortOrder: 0 },

            // ==========================================
            // ROOT 6: MISTAR (Dengan Ginayah)
            // ==========================================
            { id: 'r6', name: 'Mistir ', gender: 'L', spouse: 'Ginayah', parentId: null, gen: 1, rootId: 'r6', sortOrder: 0 },
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