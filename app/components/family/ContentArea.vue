<script setup lang="ts">
import type { FamilyMemberNode } from "~/types/family";

defineProps<{
  viewType: "chart" | "table";
  treeData: FamilyMemberNode[];
  maxGen: number;
  count: number;
  isAdmin: boolean;
  activeBaniName?: string; // Tambahkan prop ini
}>();

defineEmits(["edit", "delete"]);

// Mendapatkan tanggal hari ini untuk info di gambar
const currentDate = new Date().toLocaleDateString("id-ID", {
  year: "numeric",
  month: "long",
  day: "numeric"
});
</script>

<template>
  <!-- ID Wrapper Utama untuk Export -->
  <div
    id="capture-area"
    class="bg-[#F8FAFC] rounded-[3rem] overflow-hidden border border-slate-200 shadow-sm"
  >
    <div
      id="export-header"
      class="p-4 md:p-8 bg-white border-b-8 border-emerald-500 flex flex-col lg:flex-row justify-between items-center gap-10"
    >
      <!-- Sisi Kiri: Judul & Identitas -->
      <div class="text-center lg:text-left space-y-4">
        <div
          class="flex items-center justify-center lg:justify-start gap-4 mb-2"
        >
          <img
            src="/logo-web.webp"
            alt="Logo"
            class="w-12 h-12 object-contain"
          />
          <div class="h-8 w-px bg-slate-200 hidden lg:block"></div>
          <div class="flex flex-col md:flex-row gap-x-2">
            <p
              class="text-emerald-600 font-black uppercase text-[10px] tracking-[0.3em]"
            >
              Dokumen Digital
            </p>

            <p
              class="text-emerald-600 font-black uppercase text-[10px] tracking-[0.3em]"
            >
              Bani Nanaf
            </p>
          </div>
        </div>

        <h2
          class="text-2xl md:text-5xl font-black text-slate-900 uppercase italic leading-none tracking-tighter"
        >
          Silsilah Keluarga <br />
          {{ activeBaniName }}
        </h2>

        <div
          class="flex items-center justify-center lg:justify-start gap-3 text-slate-400 font-bold text-[7px] md:text-[10px] uppercase tracking-widest"
        >
          <span>Keluarga Besar Bani Nanaf</span>
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span>Update: {{ currentDate }}</span>
        </div>
      </div>

      <!-- Sisi Kanan: Statistik Ringkas -->
      <div
        class="flex items-center gap-10 bg-slate-50 px-10 py-4 rounded-[2.5rem] border border-slate-100 shadow-inner w-full lg:w-auto justify-center lg:justify-start"
      >
        <div class="text-center">
          <div class="text-3xl font-black text-emerald-600 leading-none">
            {{ count }}
          </div>
          <div
            class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mt-2"
          >
            Anggota
          </div>
        </div>
        <div class="h-10 w-px bg-slate-200"></div>
        <div class="text-center">
          <div class="text-3xl font-black text-emerald-600 leading-none">
            {{ maxGen }}
          </div>
          <div
            class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mt-2"
          >
            Generasi
          </div>
        </div>
      </div>
    </div>

    <div class="relative pt-6 p-4 md:p-6">

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
          :isAdmin="isAdmin"
          @edit="(val) => $emit('edit', val)"
          @delete="(val) => $emit('delete', val)"
        />
      </div>

      <!-- RENDER CHART -->
      <div
        v-else
        class="animate-in slide-in-from-right-8 duration-500 relative"
      >
        <div class="overflow-x-auto custom-scrollbar pb-12 rounded-[2.5rem]">
          <div class="min-w-max p-1 md:p-2">
            <!-- Header Generasi -->
            <div class="flex mb-14 border-b-2 border-slate-200 pb-8 ml-4">
              <div
                v-for="n in maxGen"
                :key="n"
                class="w-[280px] flex-shrink-0 relative"
              >
                <div class="pl-6 border-l-4 border-emerald-500">
                  <span
                    class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
                    >Generasi</span
                  >
                  <div class="text-5xl font-black text-slate-600">0{{ n }}</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col ml-4">
              <FamilyNode
                v-for="node in treeData"
                :key="node.id"
                :node="node"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Khusus Gambar -->
    <div
      class="px-6 py-8 md:px-8 md:py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase text-slate-300 tracking-[0.2em] md:tracking-[0.3em]"
    >
      <!-- Sisi Kiri / Atas (Mobile) -->
      <div class="flex items-center gap-2 text-center md:text-left">
        <div class="w-1 h-1 bg-emerald-300 rounded-full hidden md:block"></div>
        <span>Generated by Dokumen Digital Bani Nanaf</span>
      </div>

      <!-- Sisi Kanan / Bawah (Mobile) -->
      <span
        class="text-slate-400/60 lowercase tracking-normal md:uppercase md:tracking-[0.3em]"
      >
        baninanaf.syaifuddinzuhri.my.id
      </span>
    </div>
  </div>
</template>
