<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";

defineProps<{
  show: boolean;
  name: string;
}>();

const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 text-center">
          <!-- Icon Peringatan -->
          <div
            class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100"
          >
            <AlertTriangle :size="40" stroke-width="2.5" />
          </div>

          <h3 class="text-xl font-black text-slate-900 uppercase italic mb-2">
            Hapus Anggota?
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed mb-6">
            Anda akan menghapus
            <span class="font-bold text-slate-900">"{{ name }}"</span>.
            <br />
            <span
              class="text-red-500 font-bold italic text-xs uppercase tracking-tight"
            >
              ⚠️ Seluruh data keturunan di bawahnya juga akan ikut terhapus
              secara permanen.
            </span>
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-2">
            <button
              @click="emit('confirm')"
              class="w-full py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all"
            >
              Ya, Hapus Permanen
            </button>
            <button
              @click="emit('close')"
              class="w-full py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition"
            >
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
