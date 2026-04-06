<script setup lang="ts">
import type { FamilyMember } from "~/types/family";

const props = defineProps<{
  show: boolean;
  member: FamilyMember | null;
  allMembers: FamilyMember[];
}>();

const emit = defineEmits(["close", "save"]);
const form = ref<Partial<FamilyMember>>({});

// Filter: Hanya anggota yang berasal dari Bani (rootId) yang sama
const parentOptions = computed(() => {
  if (!form.value.rootId) return [];
  return props.allMembers
    .filter((m) => m.rootId === form.value.rootId && m.id !== form.value.id)
    .sort((a, b) => a.gen - b.gen);
});

// Update form saat modal dibuka
watch(
  () => props.show,
  (isOpen) => {
    if (isOpen && props.member) {
      form.value = JSON.parse(JSON.stringify(props.member));
    }
  }
);

// Auto-Gen: Saat parentId berubah, Gen otomatis menyesuaikan
watch(
  () => form.value.parentId,
  (newParentId) => {
    if (newParentId) {
      const parent = props.allMembers.find((m) => m.id === newParentId);
      if (parent) form.value.gen = parent.gen + 1;
    } else {
      form.value.gen = 1;
    }
  }
);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
  >
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
    >
      <div class="p-10">
        <div class="flex justify-between items-center mb-8 border-b pb-6">
          <h3 class="text-2xl font-black text-slate-900 uppercase italic">
            Edit Anggota
          </h3>
          <span
            class="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 tracking-widest uppercase"
            >ID: {{ form.id }}</span
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
              >Nama Lengkap</label
            >
            <input
              v-model="form.name"
              type="text"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
              >Jenis Kelamin</label
            >
            <select
              v-model="form.gender"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
              >Generasi (Auto)</label
            >
            <input
              :value="form.gen"
              disabled
              class="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
              >Pasangan (+)</label
            >
            <input
              v-model="form.spouse"
              type="text"
              placeholder="Kosongkan jika tidak ada"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
            />
          </div>

          <div class="md:col-span-2">
            <label
              class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1"
              >Pindah Orang Tua (Satu Bani)</label
            >
            <select
              v-model="form.parentId"
              class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none"
            >
              <option :value="null">-- Sebagai Leluhur Utama --</option>
              <option v-for="p in parentOptions" :key="p.id" :value="p.id">
                Gen {{ p.gen }} - {{ p.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-4 mt-10">
          <button
            @click="emit('close')"
            class="flex-1 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition"
          >
            Batal
          </button>
          <button
            @click="emit('save', form)"
            class="flex-[2] py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
