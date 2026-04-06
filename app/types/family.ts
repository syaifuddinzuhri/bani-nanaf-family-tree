export interface FamilyMember {
    id: string;
    name: string;
    spouse?: string | null;
    parentId: string | null; // null jika orang pertama (generasi 1)
    rootId: string;          // ID Leluhur pertama untuk memisahkan 4 chart
    gen: number;             // 1, 2, 3, 4, 5
    gender: 'L' | 'P'; 
    bio?: string;
}

// Tipe khusus untuk tampilan Chart (Hirarki/Nested)
export interface FamilyMemberNode extends FamilyMember {
    children?: FamilyMemberNode[];
}