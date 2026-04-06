<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";

const props = defineProps<{
  rootNode: FamilyMemberNode;
  maxGen: number; // Tambahkan prop ini
}>();

const { generateGrid } = useTableGrid();
// Kirim props.maxGen ke helper grid
const gridData = computed(() => generateGrid(props.rootNode, props.maxGen));
</script>

<template>
  <div class="overflow-x-auto border-2 border-slate-300 shadow-sm rounded-xl">
    <table class="w-full border-collapse bg-white">
      <thead>
        <tr class="bg-slate-50 border-b-2 border-slate-300">
          <!-- Loop header berdasarkan maxGen -->
          <th
            v-for="n in maxGen"
            :key="n"
            class="p-3 border-r border-slate-300 text-left text-[10px] font-black uppercase text-slate-500 tracking-widest w-[220px]"
          >
            Generasi {{ n }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in gridData"
          :key="rowIndex"
          class="h-16 border-b border-slate-100 transition hover:bg-slate-50/50"
        >
          <td
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="p-3 border-r border-slate-100 min-w-[220px] align-top"
          >
            <div v-if="cell" class="animate-in fade-in zoom-in-95 duration-500">
              <div
                class="font-black text-slate-900 text-xs leading-tight uppercase tracking-tight"
              >
                {{ cell.name }}
              </div>
              <div
                v-if="cell.spouse"
                class="text-[10px] text-emerald-600 italic mt-1 font-bold"
              >
                + {{ cell.spouse }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
