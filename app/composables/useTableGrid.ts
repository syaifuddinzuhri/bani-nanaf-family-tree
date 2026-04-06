import type { FamilyMemberNode } from '~/types/family'

export const useTableGrid = () => {
    const generateGrid = (rootNode: FamilyMemberNode, maxGen: number) => {
        const grid: (FamilyMemberNode | null)[][] = []

        const fillGrid = (node: FamilyMemberNode, col: number, row: number): number => {
            if (!grid[row]) {
                // Gunakan maxGen sebagai jumlah kolom
                grid[row] = Array(maxGen).fill(null)
            }

            const currentRowRef = grid[row]
            if (currentRowRef) {
                currentRowRef[col] = node
            }

            if (!node.children || node.children.length === 0) {
                return 1
            }

            let totalRowsUsed = 0
            node.children.forEach((child) => {
                const childUsedRows = fillGrid(child, col + 1, row + totalRowsUsed)
                totalRowsUsed += childUsedRows
            })

            return Math.max(1, totalRowsUsed)
        }

        fillGrid(rootNode, 0, 0)
        return grid.filter(row => row && row.some(cell => cell !== null))
    }

    return { generateGrid }
}