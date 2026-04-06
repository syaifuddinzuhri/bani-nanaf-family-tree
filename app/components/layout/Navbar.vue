<script setup lang="ts">
const isMenuOpen = ref(false);
const { user, logout } = useAuth();
const showLoginModal = ref(false);

const closeMenu = () => {
  isMenuOpen.value = false;
};

// FIX: Tambahkan Scroll Lock agar halaman belakang tidak bisa di-scroll saat menu buka
watch(isMenuOpen, (val) => {
  if (process.client) {
    document.body.style.overflow = val ? "hidden" : "auto";
  }
});
</script>

<template>
  <nav
    class="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200"
  >
    <div
      class="max-w-full mx-auto px-6 lg:px-20 h-20 flex justify-between items-center"
    >
      <!-- LOGO & BRAND -->
      <NuxtLink to="/" class="flex items-center gap-3 group" @click="closeMenu">
        <!-- Kotak Logo BN -->
        <!-- <div
          class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500 font-black italic transition-transform group-hover:rotate-12 shadow-lg shadow-emerald-500/10"
        >
          BN
        </div> -->
        <div
          class="relative w-11 h-11 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        >
          <img
            src="/logo-green.webp"
            alt="Logo Bani Nanaf"
            class="w-full h-full object-contain filter drop-shadow-sm"
          />
        </div>

        <!-- Nama Brand & Badge -->
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <span
            class="font-black text-emerald-900 tracking-tighter uppercase italic leading-none"
          >
            Bani Nanaf
          </span>

          <!-- Badge Belum Final -->
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600"
          >
            <!-- Dot Animasi Pulse -->
            <span
              class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"
            ></span>
            <span
              class="text-[9px] font-black uppercase tracking-widest leading-none"
            >
              Data Masih Belum FIX
            </span>
          </span>
        </div>
      </NuxtLink>

      <!-- MENU DESKTOP -->
      <div class="hidden md:flex gap-10 items-center">
        <NuxtLink to="/" class="nav-link" exact-active-class="nav-link-active"
          >Nasab</NuxtLink
        >
        <NuxtLink
          to="/ahli-kubur"
          class="nav-link"
          exact-active-class="nav-link-active"
          >Ahli Kubur</NuxtLink
        >
        <NuxtLink
          to="/agenda"
          class="nav-link"
          exact-active-class="nav-link-active"
          >Agenda</NuxtLink
        >
        <!-- Tombol Logout jika user login -->
        <button
          v-if="user"
          @click="logout"
          class="nav-link !text-red-500 hover:!text-red-700"
        >
          Keluar
        </button>

        <!-- Tombol Login jika belum login -->
        <button
          v-else
          @click="showLoginModal = true"
          class="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-all"
        >
          Login Admin
        </button>
      </div>

      <!-- TOMBOL HAMBURGER -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden p-2 text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- MOBILE DROPDOWN MENU -->
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="md:hidden fixed top-0 inset-x-0 bg-white border-b border-slate-200 shadow-2xl z-[90] overflow-y-auto"
      >
        <div
          class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center"
        >
          <!-- LOGO & BRAND -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 group"
            @click="closeMenu"
          >
            <div
              class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500 font-black italic transition-transform group-hover:rotate-12"
            >
              BN
            </div>
            <span
              class="font-black text-slate-900 tracking-tighter uppercase italic"
              >Bani Nanaf</span
            >
          </NuxtLink>

          <!-- TOMBOL HAMBURGER -->
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-col p-6 gap-4 bg-slate-50/50 h-full">
          <NuxtLink
            to="/"
            class="mobile-nav-link"
            exact-active-class="nav-link-active"
            @click="closeMenu"
          >
            <span class="text-xs text-slate-400">01</span> Nasab Keluarga
          </NuxtLink>
          <NuxtLink to="/ahli-kubur" class="mobile-nav-link" @click="closeMenu">
            <span class="text-xs text-slate-400">02</span> Ahli Kubur
          </NuxtLink>
          <NuxtLink to="/agenda" class="mobile-nav-link" @click="closeMenu">
            <span class="text-xs text-slate-400">03</span> Agenda
          </NuxtLink>
          <!-- Tombol Logout jika user login -->
          <button
            v-if="user"
            @click="logout"
            class="mobile-nav-link justify-center !text-red-500 hover:!bg-red-200"
          >
            Keluar
          </button>

          <!-- Tombol Login jika belum login -->
          <button
            v-else
            @click="showLoginModal = true"
            class="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-all"
          >
            Login Admin
          </button>
        </div>
      </div>
    </transition>

    <!-- FULL HEIGHT OVERLAY -->
    <div
      v-if="isMenuOpen"
      @click="closeMenu"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] md:hidden h-screen w-screen"
    ></div>
  </nav>
  <AuthLoginModal :show="showLoginModal" @close="showLoginModal = false" />
</template>

<style scoped>
/* Style Desktop tetap sama */
.nav-link {
  @apply text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors relative pb-1;
}
.nav-link-active {
  @apply text-emerald-600 border-b-2 border-emerald-500;
}

/* Style Mobile tetap sama */
.mobile-nav-link {
  @apply flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-900 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all;
}

/* Animasi Slide (Diperbaiki agar lebih smooth) */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
