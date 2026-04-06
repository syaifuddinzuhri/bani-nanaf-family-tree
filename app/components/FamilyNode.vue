<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";
defineProps<{ node: FamilyMemberNode }>();
</script>

<template>
  <div class="flex items-center">
    <!-- AREA NODE (Total Lebar: 192px + 48px = 240px) -->
    <div class="relative flex items-center my-4">
      <!-- Box Member (w-48 = 192px) -->
      <div
        class="w-48 bg-slate-600 text-white p-4 rounded-lg shadow-xl border border-slate-700 z-10 hover:bg-slate-700 transition-colors"
      >
        <div
          class="text-[12px] font-black uppercase border-b border-slate-500 pb-2 mb-2 truncate"
        >
          {{ node.name }}
        </div>
        <div
          v-if="node.spouse"
          class="text-[10px] text-slate-100 italic font-medium truncate"
        >
          + {{ node.spouse }}
        </div>
      </div>

      <!-- Garis Panah ke Kanan (w-12 = 48px) -->
      <div
        v-if="node.children && node.children.length > 0"
        class="w-12 h-[2px] bg-slate-400 relative"
      >
        <div
          class="absolute right-0 -top-[4px] border-y-[5px] border-y-transparent border-l-[8px] border-l-slate-400"
        ></div>
      </div>

      <!-- Spacer jika tidak ada anak agar kolom tetap 240px -->
      <div v-else class="w-12"></div>
    </div>

    <!-- AREA ANAK (Padding Kiri: pl-10 = 40px) -->
    <!-- TOTAL KOLOM: 240px + 40px = 280px (Pas dengan Header) -->
    <div
      v-if="node.children && node.children.length > 0"
      class="flex flex-col relative pl-10"
    >
      <!-- Garis Vertikal Utama dengan Dot Circle -->
      <!-- top & bottom 28px agar pas di tengah box (box 56px + margin) -->
      <div
        class="absolute left-0 top-[28px] bottom-[28px] w-[2px] bg-slate-300"
      >
        <div
          class="absolute -left-[3px] -top-1 w-2 h-2 rounded-full bg-slate-400 border border-white shadow-sm"
        ></div>
        <div
          class="absolute -left-[3px] -bottom-1 w-2 h-2 rounded-full bg-slate-400 border border-white shadow-sm"
        ></div>
      </div>

      <!-- Loop Anak -->
      <div
        v-for="child in node.children"
        :key="child.id"
        class="relative flex items-center"
      >
        <!-- Garis Horizontal Penghubung (Lebar 40px sesuai pl-10) -->
        <div class="absolute -left-10 w-10 h-[2px] bg-slate-300"></div>
        <FamilyNode :node="child" />
      </div>
    </div>
  </div>
</template>
