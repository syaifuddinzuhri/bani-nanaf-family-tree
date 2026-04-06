<template>
  <div
    class="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md"
  >
    <div class="relative flex items-center justify-center">
      <!-- Outer Ring -->
      <div
        class="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"
      ></div>
      <!-- Inner Logo/Icon -->
      <div
        class="absolute flex items-center justify-center bg-white rounded-2xl w-10 h-10 shadow-xl"
      >
        <div class="w-6 h-6 bg-emerald-500 rounded-lg animate-pulse"></div>
      </div>
    </div>
    <div class="mt-8 text-center">
      <h3
        class="text-white font-black uppercase italic tracking-[0.3em] text-sm animate-pulse"
      >
        Memproses Data
      </h3>
      <p
        class="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest mt-2"
      >
        Mohon tunggu sebentar...
      </p>
    </div>
  </div>
</template>
