<template>
  <div class="flex flex-col items-center space-y-4 pt-8">
    <div
      class="relative w-40 h-40 flex items-center justify-center transition-transform duration-300 hover:scale-110"
    >
      <img
        src="/logo-web.webp"
        alt="Logo Bani Nanaf"
        class="w-full h-full object-contain filter drop-shadow-sm"
      />
    </div>
    <header class="pb-8 px-6 text-center space-y-2 overflow-visible">
      <!-- Subtitle -->
      <p
        class="text-emerald-600 font-black uppercase text-[10px] md:text-xs tracking-[0.5em] animate-fade-up"
      >
        Silsilah Keluarga Besar
      </p>

      <p
        class="text-slate-600 font-black uppercase text-xl md:text-lg tracking-[0.2em] animate-fade-up delay-100"
      >
        Mbah Naimin & Nafsiah
      </p>

      <!-- JUDUL UTAMA -->
      <div class="relative inline-block group">
        <!-- Kita gunakan satu class khusus 'hero-title' untuk menggabung animasi -->
        <h1
          class="hero-title text-6xl md:text-[120px] font-black tracking-tighter uppercase leading-normal py-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-500 via-emerald-400 via-emerald-500 to-slate-900 bg-[length:200%_auto] cursor-default"
        >
          BANI NANAF
        </h1>

        <!-- Aksen Garis Dekoratif -->
        <div class="flex justify-center gap-1 mt-2">
          <div
            class="h-1.5 w-24 bg-emerald-500 rounded-full animate-line-expand"
          ></div>
          <div
            class="h-1.5 w-4 bg-slate-900 rounded-full animate-line-expand-delayed"
          ></div>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* 1. Gabungkan Animasi pada Satu Class */
.hero-title {
  /* Memanggil 2 animasi sekaligus dipisahkan koma */
  /* reveal (sekali jalan), gradient (berulang) */
  animation: titleReveal 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    gradientFlow 6s linear infinite;

  display: block;
  -webkit-background-clip: text;
  background-clip: text;
  will-change: transform, opacity, background-position;
}

/* 2. Keyframes Gradient Berjalan */
@keyframes gradientFlow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* 3. Keyframes Reveal (Muncul dari bawah) */
@keyframes titleReveal {
  0% {
    opacity: 0;
    transform: translateY(50px) rotate(-3deg);
    filter: blur(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0);
    filter: blur(0);
  }
}

/* 4. Animasi Garis */
@keyframes lineExpand {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

.animate-line-expand {
  animation: lineExpand 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.8s forwards;
  width: 0;
  opacity: 0;
}

.animate-line-expand-delayed {
  animation: lineExpand 1s cubic-bezier(0.65, 0, 0.35, 1) 1.1s forwards;
  width: 0;
  opacity: 0;
}

/* 5. Animasi Fade Up Subtitle */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 0.2s;
}
</style>
