<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";

defineProps<{
  viewType: "chart" | "table";
  treeData: FamilyMemberNode[];
  maxGen: number;
}>();
</script>

<template>
  <div class="relative">
    <!-- RENDER TABLE -->
    <div v-if="viewType === 'table'" class="animate-in zoom-in-95 duration-500">
      <FamilyTable
        v-for="node in treeData"
        :key="node.id"
        :rootNode="node"
        :maxGen="maxGen"
      />
    </div>

    <!-- RENDER CHART -->
    <div v-else class="animate-in slide-in-from-right-8 duration-500">
      <div
        class="overflow-x-auto pb-12 custom-scrollbar rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-inner"
      >
        <div class="min-w-max p-12">
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

      <!-- Hint Mobile -->
      <div
        class="hidden md:flex absolute -bottom-6 left-1/2 -translate-x-1/2 items-center gap-3 px-8 py-3 bg-slate-900 text-white shadow-2xl rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce"
      >
        Geser ke kanan untuk melihat keturunan
      </div>
    </div>
  </div>
</template>
