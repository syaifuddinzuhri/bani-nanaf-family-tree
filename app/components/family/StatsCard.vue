<script setup lang="ts">
defineProps<{
  name: string;
  count: number;
  gen: number;
}>();
</script>

<template>
  <div
    class="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 gap-6 md:gap-0"
  >
    <div class="text-center md:text-left w-full md:w-auto">
      <div
        class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-2"
      >
        Data Silsilah
      </div>
      <h2
        class="text-2xl md:text-3xl font-black text-slate-900 uppercase italic leading-tight"
      >
        Keluarga {{ name }}
      </h2>
    </div>

    <div
      class="grid grid-cols-2 md:flex gap-4 md:gap-10 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-slate-200"
    >
      <div class="text-center px-4">
        <div
          class="text-2xl md:text-3xl font-black text-emerald-600 leading-none mb-1"
        >
          {{ count }}
        </div>
        <div
          class="text-[10px] font-black uppercase text-slate-400 tracking-widest"
        >
          Anggota
        </div>
      </div>
      <div class="text-center border-l border-slate-200 pl-4 md:pl-10">
        <div
          class="text-2xl md:text-3xl font-black text-emerald-600 leading-none mb-1"
        >
          {{ gen }}
        </div>
        <div
          class="text-[10px] font-black uppercase text-slate-400 tracking-widest"
        >
          Generasi
        </div>
      </div>
    </div>
  </div>
</template>
