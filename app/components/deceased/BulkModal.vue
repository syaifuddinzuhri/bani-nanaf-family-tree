<script setup lang="ts">
const props = defineProps<{ show: boolean; rootId: string; roots: any[] }>();
const emit = defineEmits(["close", "refresh"]);
const { bulkCreate } = useDeceasedService();

const namesText = ref("");
const selectedRoot = ref(props.rootId);
const isSubmitting = ref(false);

watch(
  () => props.rootId,
  (newId) => (selectedRoot.value = newId)
);

const { formatName } = useFormatName();

const handleSave = async () => {
  if (!namesText.value || !selectedRoot.value) return;
  isSubmitting.value = true;
  try {
    await bulkCreate(namesText.value, selectedRoot.value);
    namesText.value = "";
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
    <div
      class="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300"
    >
      <h3 class="text-2xl font-black text-slate-900 uppercase italic mb-6">
        Bulk Insert Ahli Kubur
      </h3>

      <div class="space-y-6">
        <div>
          <label
            class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
            >Pilih Keluarga</label
          >
          <select
            v-model="selectedRoot"
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500"
          >
            <option v-for="r in roots" :key="r.id" :value="r.id">
              Keluarga {{ formatName(r.name) }} {{ r.spouse ? `+ ${formatName(r.spouse)}` : '' }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
            >Daftar Nama (Pisahkan per baris)</label
          >
          <textarea
            v-model="namesText"
            rows="8"
            placeholder="Contoh:&#10;Mbah Fulan&#10;Nyai Fulanah"
            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:border-emerald-500 outline-none transition-all"
          ></textarea>
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
          class="flex-[2] py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          {{ isSubmitting ? "Proses..." : "Simpan Ahli Kubur" }}
        </button>
      </div>
    </div>
  </div>
</template>
