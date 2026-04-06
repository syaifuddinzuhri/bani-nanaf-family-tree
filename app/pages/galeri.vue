<script setup lang="ts">
import VueEasyLightbox from "vue-easy-lightbox";

const { user } = useAuth();

// --- DATA DUMMY ---
// Menggunakan Unsplash untuk gambar berkualitas tinggi secara acak
const photos = ref([
  {
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200",
    title: "Makan Besar Keluarga",
    desc: "Momen hangat makan bersama saat Idul Fitri di kediaman utama."
  },
  {
    src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200",
    title: "Family Gathering 2023",
    desc: "Foto bersama seluruh keturunan Mbah Naimin di taman kota."
  },
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200",
    title: "Rekreasi ke Pegunungan",
    desc: "Liburan bersama cucu dan cicit untuk mempererat silaturahmi."
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
    title: "Rapat Persiapan Haul",
    desc: "Panitia keluarga sedang berdiskusi persiapan acara tahunan."
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200",
    title: "Canda Tawa Cucu",
    desc: "Momen ceria anak-anak bermain di halaman rumah kakek."
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200",
    title: "Makan Malam Formal",
    desc: "Perayaan ulang tahun pernikahan emas sesepuh keluarga."
  },
  {
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200",
    title: "Walimatul Ursy",
    desc: "Dokumentasi pernikahan salah satu anggota keluarga Bani Nanaf."
  },
  {
    src: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?q=80&w=1200",
    title: "Sarapan Bersama di Teras",
    desc: "Menikmati teh hangat dan camilan tradisional di pagi hari."
  },
  {
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200",
    title: "Kisah dari Sesepuh",
    desc: "Mendengarkan cerita sejarah keluarga dari generasi pertama."
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
    title: "Persiapan Masakan Dapur",
    desc: "Kekompakan ibu-ibu menyiapkan hidangan untuk acara pengajian."
  },
]);

// --- LIGHTBOX STATE ---
const visibleRef = ref(false);
const indexRef = ref(0);

const showImg = (index: number) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const onHide = () => {
  visibleRef.value = false;
};

// Map hanya URL untuk lightbox
const imgsRef = computed(() => photos.value.map((p) => p.src));
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
    <LayoutNavbar />

    <!-- Header Section -->
    <header class="pt-16 pb-12 text-center px-6">
      <h1
        class="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        Galeri Foto
      </h1>
      <p
        class="text-emerald-600 font-black uppercase text-[10px] tracking-[0.5em] mt-4 opacity-70"
      >
        Dokumentasi Momen Berharga Bani Nanaf
      </p>
    </header>

    <main class="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mt-10">
      <!-- Toolbar (Nanti bisa ditambah fitur Upload untuk Admin) -->
      <div v-if="user" class="flex justify-end mb-10">
        <button
          class="px-8 py-4 bg-slate-900 text-emerald-400 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          + Upload Foto Baru
        </button>
      </div>

      <!-- MASONRY GRID LAYOUT -->
      <div
        class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
      >
        <div
          v-for="(photo, idx) in photos"
          :key="idx"
          class="break-inside-avoid animate-in fade-in zoom-in duration-500"
        >
          <div
            @click="showImg(idx)"
            class="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            <!-- Image Area -->
            <div class="relative overflow-hidden aspect-auto">
              <img
                :src="photo.src"
                :alt="photo.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <!-- Overlay on Hover -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8"
              >
                <div
                  class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                >
                  <h3
                    class="text-white font-black uppercase italic text-lg leading-tight"
                  >
                    {{ photo.title }}
                  </h3>
                  <p
                    class="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-2"
                  >
                    {{ photo.desc }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Title Mobile (Visible if not hovered) -->
            <div class="p-5 md:hidden">
              <h3 class="font-black uppercase text-xs text-slate-800">
                {{ photo.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- LIGHTBOX COMPONENT -->
    <client-only>
      <VueEasyLightbox
        :visible="visibleRef"
        :imgs="imgsRef"
        :index="indexRef"
        @hide="onHide"
        maskClosable
        teleport="body"
      >
        <!-- Perbaikan Slot Toolbar: Destructuring langsung properti fungsinya -->
        <template #toolbar="{ zoomIn, zoomOut, rotateLeft, rotateRight }">
          <div
            class="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 p-4 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 z-[200]"
          >
            <button
              @click="zoomIn"
              class="text-white p-2 hover:text-emerald-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
            </button>
            <button
              @click="zoomOut"
              class="text-white p-2 hover:text-emerald-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6"
                />
              </svg>
            </button>
            <button
              @click="rotateLeft"
              class="text-white p-2 hover:text-emerald-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              @click="rotateRight"
              class="text-white p-2 hover:text-emerald-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                transform="scale(-1, 1)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </template>
      </VueEasyLightbox>
    </client-only>

    <LayoutFooter />
  </div>
</template>

<style>
/* Masonry Logic */
.break-inside-avoid {
  break-inside: avoid;
}

/* Lightbox Custom Styles */
.vel-modal {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(10px);
}

.vel-img {
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
