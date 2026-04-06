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
import type { DeceasedMember } from "~/types/deceased";

export const useDeceasedService = () => {
    const { $db } = useNuxtApp();
    const colName = "deceased_members";

    const getDeceasedByRoot = async (rootId: string) => {
        const q = query(collection($db as any, colName), where("rootId", "==", rootId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() })) as DeceasedMember[];
    };

    const bulkCreate = async (names: string, rootId: string) => {
        const batch = writeBatch($db as any);
        const nameList = names.split('\n').filter(n => n.trim() !== '');

        nameList.forEach(name => {
            const newDocRef = doc(collection($db as any, colName));
            batch.set(newDocRef, {
                name: name.trim(),
                rootId,
                createdAt: serverTimestamp()
            });
        });
        return await batch.commit();
    };

    const updateDeceased = async (id: string, data: Partial<DeceasedMember>) => {
        return await updateDoc(doc($db as any, colName, id), data);
    };

    const deleteDeceased = async (id: string) => {
        return await deleteDoc(doc($db as any, colName, id));
    };

    return { getDeceasedByRoot, bulkCreate, updateDeceased, deleteDeceased };
};