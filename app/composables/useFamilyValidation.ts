import type { FamilyMember } from "~/types/family";

export const useFamilyValidation = () => {
    const errors = ref<Record<string, string>>({});

    const validateForm = (data: Partial<FamilyMember>) => {
        errors.value = {};

        if (!data.name || data.name.trim().length < 3) {
            errors.value.name = "Nama minimal 3 karakter";
        }

        if (!data.gender) {
            errors.value.gender = "Jenis kelamin wajib dipilih";
        }

        if (!data.rootId) {
            errors.value.rootId = "Bani (Root) tidak terdeteksi";
        }

        // Validasi Logika Hirarki: Mencegah Loop (Anak jadi bapak)
        if (data.id && data.parentId === data.id) {
            errors.value.parentId = "Seseorang tidak bisa menjadi orang tua bagi dirinya sendiri";
        }

        return {
            isValid: Object.keys(errors.value).length === 0,
            errors: errors.value
        };
    };

    return { validateForm, errors };
};