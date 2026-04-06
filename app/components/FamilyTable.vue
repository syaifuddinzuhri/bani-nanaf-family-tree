<script setup lang="ts">
import { Edit2, Trash2, User } from "lucide-vue-next";
import type { FamilyMember, FamilyMemberNode } from "~/types/family";

const props = defineProps<{
  rootNode: FamilyMemberNode;
  maxGen: number;
}>();

const emit = defineEmits(["edit", "delete"]);
const { generateGrid } = useTableGrid();
const gridData = computed(() => generateGrid(props.rootNode, props.maxGen));
</script>

<template>
  <div
    class="overflow-x-auto border-2 border-slate-200 shadow-sm rounded-2xl bg-white"
  >
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-slate-50 border-b-2 border-slate-200">
          <th
            v-for="n in maxGen"
            :key="n"
            class="p-4 border-r border-slate-200 text-left text-[10px] font-black uppercase text-slate-500 tracking-widest min-w-[220px]"
          >
            Generasi {{ n }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in gridData"
          :key="rowIndex"
          class="group h-20 border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
        >
          <td
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="p-4 border-r border-slate-100 align-top relative"
          >
            <div
              v-if="cell"
              class="flex justify-between items-center animate-in fade-in zoom-in-95"
            >
              <div class="flex gap-3">
                <!-- Gender Indicator -->
                <div
                  :class="
                    cell.gender === 'L'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : 'bg-pink-50 text-pink-600 border-pink-100'
                  "
                  class="w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-[10px] font-black">{{ cell.gender }}</span>
                </div>
                <div>
                  <div
                    class="font-black text-slate-900 text-sm uppercase leading-tight tracking-tight"
                  >
                    {{ cell.name }}
                  </div>
                  <div
                    v-if="cell.spouse"
                    class="text-[10px] text-emerald-600 italic mt-1 font-bold"
                  >
                    + {{ cell.spouse }}
                  </div>
                  <div v-else class="text-[10px] text-gray-400 italic mt-1">
                    Belum ada pasangan
                  </div>
                </div>
              </div>

              <!-- Action Buttons (Muncul saat Hover) -->
              <div
                class="flex gap-1 transition-opacity ml-2"
              >
                <button
                  @click="emit('edit', cell)"
                  class="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 :size="14" />
                </button>
                <button
                  @click="emit('delete', cell)"
                  class="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                  title="Hapus"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
