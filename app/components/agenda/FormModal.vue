<script setup lang="ts">
import type { FamilyMember } from "~/types/family";
import type { AgendaItem } from "~/types/agenda";

const props = defineProps<{
  show: boolean;
  item: AgendaItem | null;
  members: FamilyMember[];
  currentPeriod: number;
}>();
const emit = defineEmits(["close", "refresh"]);
const { createAgenda, updateAgenda } = useAgendaService();

const form = ref<Partial<AgendaItem>>({
  date: "",
  location: "",
  hostId: "",
  hostName: "",
  period: props.currentPeriod,
  note: ""
});

const isEdit = computed(() => !!props.item?.id);
const isSubmitting = ref(false);

watch(
  () => props.item,
  (val) => {
    if (val) form.value = { ...val };
    else
      form.value = {
        date: "",
        location: "",
        hostId: "",
        hostName: "",
        period: props.currentPeriod,
        note: ""
      };
  },
  { immediate: true }
);

// Fungsi untuk mencari nama leluhur berdasarkan rootId
const getRootName = (rootId: string) => {
  // Cari anggota yang id-nya sama dengan rootId (Leluhur Utama)
  const rootMember = props.members.find((m) => m.id === rootId);
  return rootMember ? rootMember.name : rootId;
};

// Opsional: Urutkan daftar member berdasarkan Nasab lalu Nama agar rapi di dropdown
const sortedMembers = computed(() => {
  return [...props.members].sort((a, b) => {
    const nameA = getRootName(a.rootId) + a.name;
    const nameB = getRootName(b.rootId) + b.name;
    return nameA.localeCompare(nameB);
  });
});

const handleSave = async () => {
  if (!form.value.date || !form.value.hostId) return;
  const selectedHost = props.members.find((m) => m.id === form.value.hostId);
  form.value.hostName = selectedHost?.name || "";

  isSubmitting.value = true;
  try {
    if (isEdit.value && props.item?.id) {
      await updateAgenda(props.item.id, form.value);
    } else {
      await createAgenda(form.value as any);
    }
    emit("refresh");
    emit("close");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
  >
    <LayoutLoadingOverlay v-if="isSubmitting" />
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95"
    >
      <h3 class="text-2xl font-black text-slate-900 uppercase italic mb-6">
        {{ isEdit ? "Ubah Agenda" : "Tambah Agenda Baru" }}
      </h3>

      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest"
              >Tanggal Acara</label
            >
            <input
              v-model="form.date"
              type="date"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <div>
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest"
              >Pilih Periode</label
            >
            <select
              v-model.number="form.period"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option v-for="p in [1, 2, 3, 4, 5]" :key="p" :value="p">
                Periode {{ p }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black uppercase text-slate-400 ml-1"
            >Tuan Rumah (Dari Data Member)</label
          >
          <select
            v-model="form.hostId"
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500"
          >
            <option value="" disabled>Pilih Anggota Keluarga</option>
            <option v-for="m in members" :key="m.id" :value="m.id">
              Keluarga {{ getRootName(m.rootId) }} — ({{ m.name
              }}{{ m.spouse ? "+" + m.spouse : "" }})
            </option>
          </select>
        </div>

        <div>
          <label
            class="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
            >Lokasi Pertemuan</label
          >
          <input
            v-model="form.location"
            type="text"
            placeholder="Contoh: Rumah Kediaman Bpk. X"
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
          />
        </div>
      </div>

      <div class="flex gap-4 mt-10">
        <button
          @click="emit('close')"
          class="flex-1 text-xs font-black uppercase text-slate-400"
        >
          Batal
        </button>
        <button
          @click="handleSave"
          :disabled="isSubmitting"
          class="flex-[2] py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"
        >
          {{ isSubmitting ? "Memproses..." : "Simpan Agenda" }}
        </button>
      </div>
    </div>
  </div>
</template>
