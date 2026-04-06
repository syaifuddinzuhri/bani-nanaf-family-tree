<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";

const props = defineProps<{
  node: FamilyMemberNode;
  depth: number;
}>();

// Menghitung berapa banyak baris yang dibutuhkan (untuk sel kosong di kiri)
const emptyCells = Array.from({ length: props.node.gen - 1 });
const remainingCells = Array.from({ length: 5 - props.node.gen });
</script>

<template>
  <!-- Baris untuk Member saat ini -->
  <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
    <!-- Sel Kosong sebelum (Identasi) -->
    <td
      v-for="(_, i) in emptyCells"
      :key="'empty-pre-' + i"
      class="border-r border-gray-200 p-2 bg-gray-50/30"
    ></td>

    <!-- Sel Data Member -->
    <td class="border-r border-gray-200 p-3 align-top min-w-[200px] bg-white">
      <div class="font-bold text-slate-800 text-sm">{{ node.name }}</div>
      <div
        v-if="node.spouse"
        class="text-[11px] text-pink-500 italic mt-1 font-medium leading-none"
      >
        + {{ node.spouse }}
      </div>
    </td>

    <!-- Sel Kosong sesudah -->
    <td
      v-for="(_, i) in remainingCells"
      :key="'empty-post-' + i"
      class="border-r border-gray-200 p-2"
    ></td>
  </tr>

  <!-- Render Anak-anaknya langsung di baris bawahnya -->
  <template v-if="node.children && node.children.length > 0">
    <FamilyTableRow
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :depth="depth + 1"
    />
  </template>
</template>
