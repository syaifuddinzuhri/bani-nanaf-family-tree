<script setup lang="ts">
import type { FamilyMember } from "~/types/family";

defineProps<{
  rootMembers: FamilyMember[];
  activeTab: string;
  activeName?: string;
}>();

const emit = defineEmits(["update:activeTab"]);
const isMenuOpen = ref(false);

const select = (id: string) => {
  emit("update:activeTab", id);
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="max-w-full mx-auto px-6 md:px-12 lg:px-24 mb-12">
    <!-- Mobile Dropdown -->
    <div class="md:hidden relative">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl flex justify-between items-center shadow-sm"
      >
        <span
          class="font-black uppercase text-xs tracking-widest text-emerald-700"
          >Keluarga {{ activeName }}</span
        >
        <svg
          :class="isMenuOpen ? 'rotate-180' : ''"
          class="w-5 h-5 text-slate-400 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        v-if="isMenuOpen"
        class="absolute z-[60] w-full mt-2 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          v-for="root in rootMembers"
          :key="root.id"
          @click="select(root.id)"
          class="w-full p-4 text-left font-bold uppercase text-xs tracking-widest border-b last:border-0"
          :class="
            activeTab === root.id
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-slate-600'
          "
        >
          Keluarga {{ root.name }}
        </button>
      </div>
    </div>

    <!-- Desktop Tabs -->
    <div
      class="hidden md:flex flex-wrap justify-center gap-3 border-b-2 border-slate-200 pb-6"
    >
      <button
        v-for="root in rootMembers"
        :key="root.id"
        @click="$emit('update:activeTab', root.id)"
        class="px-6 py-3 border-b-4 font-black uppercase text-xs rounded-xl tracking-widest transition-all"
        :class="
          activeTab === root.id
            ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
            : 'border-transparent text-slate-400 hover:bg-slate-100'
        "
      >
        Keluarga {{ root.name }}
      </button>
    </div>
  </div>
</template>
