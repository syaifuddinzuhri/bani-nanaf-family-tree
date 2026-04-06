<script setup lang="ts">
defineProps<{
  modelValue: "chart" | "table";
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    class="inline-flex bg-white p-1.5 rounded-2xl border-2 border-slate-200 shadow-sm"
  >
    <button
      @click="$emit('update:modelValue', 'chart')"
      :class="
        modelValue === 'chart'
          ? 'bg-slate-900 text-emerald-400 shadow-lg'
          : 'text-slate-500'
      "
      class="flex items-center gap-3 px-6 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all duration-300"
    >
      Bagan Silsilah
    </button>
    <button
      @click="$emit('update:modelValue', 'table')"
      :class="
        modelValue === 'table'
          ? 'bg-slate-900 text-emerald-400 shadow-lg'
          : 'text-slate-500'
      "
      class="flex items-center gap-3 px-6 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all duration-300"
    >
      Tabel Generasi
    </button>
  </div>
</template>
