<script setup lang="ts">
import { nextTick } from "vue";
import type { FamilyMember } from "~/types/family";

const props = defineProps<{
  show: boolean;
  member: FamilyMember | null;
  allMembers: FamilyMember[];
  activeBaniName?: string;
}>();

const emit = defineEmits(["close", "save"]);

const afterMemberId = ref(""); // Menyimpan ID saudara yang dipilih sebagai patokan
const formError = ref("");
const isInitializing = ref(false);

const form = ref<FamilyMember>({
  id: "",
  name: "",
  gender: "L",
  spouse: "",
  parentId: null,
  rootId: "",
  gen: 1,
  sortOrder: 1
});

const isEdit = computed(
  () => !!props.member?.id && !props.member.id.startsWith("new-")
);

// 1. DAFTAR CALON ORANG TUA
const parentOptions = computed(() => {
  if (!form.value.rootId) return [];
  return props.allMembers
    .filter((m) => m.rootId === form.value.rootId && m.id !== form.value.id)
    .sort((a, b) => a.gen - b.gen);
});

// 2. DAFTAR SAUDARA KANDUNG (Filter agar tidak menampilkan diri sendiri saat edit)
const siblingOptions = computed(() => {
  if (!form.value.parentId) return [];
  return props.allMembers
    .filter(
      (m) =>
        m.parentId === form.value.parentId &&
        m.rootId === form.value.rootId &&
        m.id !== form.value.id
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
});

// 3. LOGIKA DETEKSI POSISI SAAT BUKA MODAL
watch(
  () => props.show,
  async (isOpen) => {
    if (isOpen && props.member) {
      isInitializing.value = true;
      formError.value = "";

      // 1. Copy Data ke Form
      form.value = JSON.parse(JSON.stringify(props.member));

      // 2. Tunggu siklus reaktivitas selesai agar computed & child watcher selesai proses awal
      await nextTick();
      // Berikan sedikit delay fisik (optional, untuk UX loading yang mantap)
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isEdit.value) {
        // 3. Kalkulasi Ulang Posisi (Ambil data segar dari props langsung agar akurat)
        const currentSiblings = props.allMembers
          .filter(
            (m) =>
              m.parentId === form.value.parentId &&
              m.rootId === form.value.rootId
          )
          .sort((a, b) => a.sortOrder - b.sortOrder);

        const myIndex = currentSiblings.findIndex(
          (s) => s.id === form.value.id
        );

        if (myIndex === 0) {
          afterMemberId.value = "first_child";
        } else if (myIndex > 0) {
          afterMemberId.value =
            currentSiblings[myIndex - 1]?.id || "first_child";
        }
      } else {
        // Mode TAMBAH
        if (siblingOptions.value.length > 0) {
          afterMemberId.value =
            siblingOptions.value[siblingOptions.value.length - 1]?.id ||
            "first_child";
        } else {
          afterMemberId.value = "first_child";
        }
      }

      isInitializing.value = false;
    }
  }
);

watch(() => props.show, (isOpen) => {
  if (process.client) { // Pastikan hanya berjalan di sisi browser
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

// Bersihkan efek saat komponen di-unmount (misal pindah halaman)
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = '';
  }
});

// 4. LOGIKA AUTO-GEN GENERASI & RESET POSISI SAAT GANTI ORANG TUA
watch(
  () => form.value.parentId,
  (newParentId, oldParentId) => {
    // PROTEKSI: Jangan jalankan jika sedang inisialisasi atau modal tertutup
    if (!props.show || isInitializing.value) return;

    // Reset posisi hanya jika user benar-benar mengubah Orang Tua secara manual
    if (newParentId !== oldParentId) {
      afterMemberId.value = "first_child";
    }

    if (newParentId) {
      const parent = props.allMembers.find((m) => m.id === newParentId);
      if (parent) form.value.gen = parent.gen + 1;
    } else {
      form.value.gen = 1;
    }
  }
);

const handlePrepareSave = () => {
  if (!form.value.name) return (formError.value = "Nama wajib diisi!");
  if (!form.value.parentId && !isEdit.value)
    return (formError.value = "Wajib memilih Orang Tua!");

  // PENGHITUNGAN SORT ORDER BERDASARKAN AFTER_MEMBER_ID
  if (afterMemberId.value === "first_child") {
    // Jika jadi anak pertama, ambil sortOrder anak pertama yang ada sekarang lalu kurangi 0.5
    const currentFirst = siblingOptions.value[0];
    form.value.sortOrder = currentFirst ? currentFirst.sortOrder - 0.5 : 1;
  } else {
    // Cari member patokan
    const target = siblingOptions.value.find(
      (s) => s.id === afterMemberId.value
    );
    form.value.sortOrder = target ? target.sortOrder + 0.5 : 1;
  }

  emit("save", { ...form.value });
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
  >
    <div
      class="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
    >
      <div
        v-if="isInitializing"
        class="p-20 flex flex-col items-center justify-center space-y-4"
      >
        <div
          class="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"
        ></div>
        <p
          class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
        >
          Menyiapkan Data...
        </p>
      </div>
      <div v-else class="p-8 md:p-10">
        <div class="mb-8 border-b border-slate-100 pb-6">
          <h3
            class="text-2xl font-black text-slate-900 uppercase italic leading-none"
          >
            {{ isEdit ? "Ubah Data" : "Tambah Anggota" }}
          </h3>
          <p
            class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2"
          >
            Nasab Utama: {{ activeBaniName || "Memuat..." }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="label-style">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama..."
              class="input-style"
            />
          </div>

          <div>
            <label class="label-style">Gender</label>
            <select v-model="form.gender" class="input-style">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div>
            <label class="label-style">Generasi (Otomatis)</label>
            <div
              class="input-style bg-slate-100 text-slate-400 border-slate-200"
            >
              Tingkat {{ form.gen }}
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="label-style">Nama Istri / Suami (+)</label>
            <input
              v-model="form.spouse"
              type="text"
              placeholder="Kosongkan jika belum ada"
              class="input-style border-pink-100"
            />
          </div>

          <div class="md:col-span-2">
            <label class="label-style text-emerald-700 font-black"
              >Pilih Orang Tua (Wajib)</label
            >
            <select
              v-model="form.parentId"
              class="input-style border-emerald-200 bg-emerald-50/30"
            >
              <option :value="null" disabled>-- Pilih Orang Tua --</option>
              <option v-for="p in parentOptions" :key="p.id" :value="p.id">
                Gen {{ p.gen }} - {{ p.name }} {{ p.spouse ? `+ ${p.spouse}` : '' }}
              </option>
            </select>
          </div>

          <!-- POSISI URUTAN: Disederhanakan -->
          <div
            v-if="form.parentId"
            class="md:col-span-2 border-t border-slate-100 pt-6"
          >
            <label class="label-style">Urutan Posisi dalam Keluarga</label>

            <div
              v-if="siblingOptions.length === 0"
              class="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center"
            >
              <p class="text-[10px] font-bold text-slate-400 uppercase italic">
                Otomatis Terdaftar sebagai Anak Pertama
              </p>
            </div>

            <select
              v-else
              v-model="afterMemberId"
              class="input-style border-emerald-400 bg-emerald-50"
            >
              <option value="first_child">Anak Pertama (Paling Atas)</option>
              <option v-for="s in siblingOptions" :key="s.id" :value="s.id">
                Setelah {{ s.name }}
              </option>
            </select>
          </div>
        </div>

        <p
          v-if="formError"
          class="mt-6 text-center text-red-500 text-xs font-bold uppercase italic"
        >
          ⚠️ {{ formError }}
        </p>

        <div class="flex flex-col md:flex-row gap-3 mt-8">
          <button
            @click="emit('close')"
            class="order-2 md:order-1 flex-1 py-4 text-xs font-black uppercase text-slate-400"
          >
            Batal
          </button>
          <button
            @click="handlePrepareSave"
            class="order-1 md:order-2 flex-[2] py-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-slate-800 transition-all"
          >
            {{ isEdit ? "Simpan Perubahan" : "Tambahkan ke Silsilah" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label-style {
  @apply block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest;
}
.input-style {
  @apply w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all;
}
</style>
