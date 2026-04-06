import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { AgendaItem } from "~/types/agenda";

export const useAgendaService = () => {
    const { $db } = useNuxtApp();
    const colName = "agendas";

    const getAgendasByPeriod = async (period: number) => {
        const q = query(
            collection($db as any, colName),
            where("period", "==", period),
            orderBy("date", "asc")
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AgendaItem[];
    };

    const createAgenda = async (data: Omit<AgendaItem, 'id'>) => {
        return await addDoc(collection($db as any, colName), {
            ...data,
            createdAt: serverTimestamp()
        });
    };

    const updateAgenda = async (id: string, data: Partial<AgendaItem>) => {
        return await updateDoc(doc($db as any, colName, id), { ...data, updatedAt: serverTimestamp() });
    };

    const deleteAgenda = async (id: string) => {
        return await deleteDoc(doc($db as any, colName, id));
    };

    return { getAgendasByPeriod, createAgenda, updateAgenda, deleteAgenda };
};