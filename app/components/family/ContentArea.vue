<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";

defineProps<{
  viewType: "chart" | "table";
  treeData: FamilyMemberNode[];
  maxGen: number;
}>();

defineEmits(["edit", "delete"]);
</script>

<template>
  <!-- Wrapper Utama dengan Padding Top untuk Hint -->
  <div class="relative pt-14">
    <!-- HINT UNIFIKASI: Muncul di Table maupun Chart -->
    <div
      class="absolute top-0 left-0 md:left-4 z-40 flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white shadow-xl rounded-2xl border border-slate-700 whitespace-nowrap animate-bounce pointer-events-none origin-left"
    >
      <div
        class="flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-lg shadow-sm shadow-emerald-500/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5 text-slate-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
      <span class="text-[9px] font-black uppercase tracking-[0.2em]">
        Geser ke kiri untuk melihat lebih banyak
      </span>
    </div>

    <!-- RENDER TABLE -->
    <div
      v-if="viewType === 'table'"
      class="animate-in zoom-in-95 duration-500 pb-10"
    >
      <FamilyTable
        v-for="node in treeData"
        :key="node.id"
        :rootNode="node"
        :maxGen="maxGen"
        @edit="(val) => $emit('edit', val)"
        @delete="(val) => $emit('delete', val)"
      />
    </div>

    <!-- RENDER CHART -->
    <div v-else class="animate-in slide-in-from-right-8 duration-500 relative">
      <!-- Container Scroll Chart -->
      <div
        class="overflow-x-auto pb-12 custom-scrollbar rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-inner"
      >
        <div class="min-w-max p-8 md:p-12">
          <!-- Header Generasi Chart -->
          <div class="flex mb-14 border-b-2 border-slate-200 pb-8 ml-4">
            <div
              v-for="n in maxGen"
              :key="n"
              class="w-[280px] flex-shrink-0 relative group"
            >
              <div class="pl-6 border-l-4 border-emerald-500">
                <span
                  class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
                  >Generasi</span
                >
                <div
                  class="text-5xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors tracking-tighter"
                >
                  0{{ n }}
                </div>
              </div>
            </div>
          </div>

          <!-- Bagan Silsilah -->
          <div class="flex flex-col ml-4">
            <FamilyNode v-for="node in treeData" :key="node.id" :node="node" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
