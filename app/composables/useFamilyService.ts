import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    orderBy,
    writeBatch
} from "firebase/firestore";
import type { FamilyMember } from "~/types/family";

export const useFamilyService = () => {
    const { $db } = useNuxtApp();
    const nuxtApp = useNuxtApp();

    const { generateData } = useFamilyData();

    const getColRef = () => {
        const db = nuxtApp.$db as any;
        if (!db) {
            throw new Error("Firestore instance not found. Make sure this runs on client side.");
        }
        return collection(db, "members");
    };

    const getAllMembers = async () => {
        const colRef = getColRef();

        // Query sederhana: Hanya ambil semua data
        // Kita tetap pakai orderBy("gen") agar beban sort di JS tidak terlalu berat
        const q = query(colRef, orderBy("gen", "asc"));
        const snapshot = await getDocs(q);

        // 1. Ambil data mentah dari Firestore
        const members = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as FamilyMember[];

        // 2. Mapping Manual / Sorting Lokal
        // Logic: Urutkan berdasarkan 'gen' dulu, jika 'gen' sama, urutkan berdasarkan 'sortOrder'
        return members.sort((a, b) => {
            // Jika generasi berbeda, urutkan berdasarkan gen (1, 2, 3...)
            if (a.gen !== b.gen) {
                return a.gen - b.gen;
            }

            // Jika generasi sama, urutkan berdasarkan sortOrder (1, 2, 3...)
            // Kita gunakan (val || 0) untuk antisipasi jika ada data lama yang belum punya sortOrder
            const orderA = a.sortOrder || 0;
            const orderB = b.sortOrder || 0;

            return orderA - orderB;
        });
    };

    const seedRootMembers = async () => {
        const colRef = getColRef();
        const batch = writeBatch($db);
        const members = generateData(); // Mengambil template data (id r1 dll akan dibuang)

        try {
            members.forEach((member, index) => {
                // 1. Buat referensi dokumen baru tanpa ID (Firestore akan generate ID acak)
                const newDocRef = doc(colRef);
                const autoId = newDocRef.id;

                // 2. Siapkan data: 
                // - Buang id lama (r1, r2, dll)
                // - Set rootId sama dengan autoId karena mereka adalah Leluhur Utama
                const { id, ...payload } = member;

                batch.set(newDocRef, {
                    ...payload,
                    sortOrder: index + 1,
                    rootId: autoId, // WAJIB SAMA dengan ID Dokumen agar filter tab jalan
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            });

            await batch.commit();
            console.log("✅ Berhasil inisialisasi Root Utama dengan Auto ID");
            return { success: true };
        } catch (error) {
            console.error("❌ Gagal seeding:", error);
            throw error;
        }
    };

    // 2. Tambah Anggota
    const createMember = async (data: Omit<FamilyMember, 'id'>) => {
        const colRef = getColRef();
        return await addDoc(colRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    };

    // 3. Update Anggota
    const updateMember = async (id: string, data: Partial<FamilyMember>) => {
        const docRef = doc($db, "members", id);
        return await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    };

    // 4. Hapus Rekursif (Hapus orang ini + semua keturunannya)
    const deleteMemberRecursive = async (memberId: string) => {
        const colRef = getColRef();
        const batch = writeBatch($db);

        const findAndAccumulate = async (id: string) => {
            // Tambahkan diri sendiri ke daftar hapus
            batch.delete(doc($db, "members", id));

            // Cari anak-anaknya
            const q = query(colRef, where("parentId", "==", id));
            const snapshot = await getDocs(q);

            for (const childDoc of snapshot.docs) {
                await findAndAccumulate(childDoc.id);
            }
        };

        await findAndAccumulate(memberId);
        return await batch.commit();
    };

    return { getAllMembers, createMember, updateMember, deleteMemberRecursive, seedRootMembers };
};