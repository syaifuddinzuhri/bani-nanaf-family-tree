<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";

const props = defineProps<{
  show: boolean;
  name: string;
}>();

const emit = defineEmits(["close", "confirm"]);

// Watcher untuk lock scroll saat modal terbuka
watch(
  () => props.show,
  (val) => {
    if (process.client) {
      document.body.style.overflow = val ? "hidden" : "auto";
    }
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
    >
      <div
        class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
      >
        <div class="p-8 md:p-10 text-center">
          <!-- Icon Peringatan -->
          <div
            class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100"
          >
            <AlertTriangle :size="40" stroke-width="2.5" />
          </div>

          <!-- Judul -->
          <h3
            class="text-xl font-black text-slate-900 uppercase italic mb-2 tracking-tight"
          >
            Hapus Data?
          </h3>

          <!-- Pesan -->
          <p class="text-slate-500 text-sm leading-relaxed mb-8">
            Anda akan menghapus <br />
            <span class="font-black text-slate-900 uppercase italic text-base"
              >"{{ name }}"</span
            >
            <br />
            <span
              class="text-red-500 font-bold italic text-[10px] uppercase tracking-widest mt-2 block"
            >
              ⚠️ Tindakan ini bersifat permanen.
            </span>
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-2">
            <button
              @click="emit('confirm')"
              class="w-full py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all"
            >
              Ya, Hapus
            </button>
            <button
              @click="emit('close')"
              class="w-full py-3 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
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
