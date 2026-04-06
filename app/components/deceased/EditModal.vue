<script setup lang="ts">
const props = defineProps<{ show: boolean; item: any }>();
const emit = defineEmits(["close", "refresh"]);
const { updateDeceased } = useDeceasedService();

const name = ref("");
const isSubmitting = ref(false);

watch(
  () => props.item,
  (val) => {
    if (val) name.value = val.name;
  },
  { immediate: true }
);

const handleUpdate = async () => {
  if (!name.value) return;
  isSubmitting.value = true;
  try {
    await updateDeceased(props.item.id, { name: name.value });
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
      class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95"
    >
      <h3 class="text-xl font-black text-slate-900 uppercase italic mb-6">
        Ubah Nama
      </h3>
      <input
        v-model="name"
        type="text"
        class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-emerald-500 outline-none"
      />
      <div class="flex gap-3 mt-8">
        <button
          @click="emit('close')"
          class="flex-1 text-xs font-black uppercase text-slate-400"
        >
          Batal
        </button>
        <button
          @click="handleUpdate"
          :disabled="isSubmitting"
          class="flex-1 py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>
