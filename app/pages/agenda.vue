<script setup lang="ts">
import type { AgendaItem } from "~/types/agenda";
import type { FamilyMember } from "~/types/family";

const { user } = useAuth();
const { getAllMembers } = useFamilyService();
const { getAgendasByPeriod, deleteAgenda } = useAgendaService();

const members = ref<FamilyMember[]>([]);
const currentPeriod = ref(2);
const isLoading = ref(true);
const isProcessing = ref(false);
const searchQuery = ref(""); // State untuk pencarian

// Modal States
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<AgendaItem | null>(null);

const roots = ref<FamilyMember[]>([]);
const agendaList = ref<AgendaItem[]>([]);

// LOGIKA FILTER PENCARIAN
const filteredAgenda = computed(() => {
  if (!searchQuery.value) return agendaList.value;

  const query = searchQuery.value.toLowerCase();
  return agendaList.value.filter(
    (item) =>
      item.hostName.toLowerCase().includes(query) ||
      (item.location && item.location.toLowerCase().includes(query))
  );
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const [mRes, aRes] = await Promise.all([
      getAllMembers(),
      getAgendasByPeriod(currentPeriod.value)
    ]);
    members.value = mRes;
    agendaList.value = aRes;
  } catch (error: any) {
    console.error("Gagal memuat data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => loadData());
watch(currentPeriod, () => {
  searchQuery.value = ""; // Reset pencarian saat ganti periode
  loadData();
});

const triggerEdit = (item: any) => {
  selectedItem.value = item;
  showFormModal.value = true;
};

const triggerDelete = (item: any) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (selectedItem.value) {
    isProcessing.value = true;
    await deleteAgenda(selectedItem.value.id);
    await loadData();
    showDeleteModal.value = false;
    isProcessing.value = false;
  }
};

const formatDate = (dateStr: string) => {
  const options: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
    <LayoutLoadingOverlay v-if="isProcessing" />
    <LayoutNavbar />

    <header class="pt-16 pb-8 text-center px-6">
      <h1
        class="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        Pertemuan Keluarga
      </h1>
      <p
        class="text-emerald-600 font-bold uppercase text-[10px] tracking-[0.4em] mt-4 opacity-70"
      >
        Jadwal Silaturahmi Rutin Keluarga
      </p>
    </header>

    <div
      class="max-w-4xl mx-auto px-6 mb-12 flex flex-col md:flex-row gap-6 items-center justify-center"
    >
      <!-- Filter Dropdown Periode -->
      <div class="w-full md:w-64">
        <label
          class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 tracking-widest"
          >Pilih Periode:</label
        >
        <div class="relative group">
          <select
            v-model="currentPeriod"
            class="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl appearance-none font-black uppercase text-xs tracking-widest text-emerald-700 shadow-sm focus:border-emerald-500 outline-none transition-all cursor-pointer"
          >
            <option v-for="p in [1, 2, 3, 4, 5]" :key="p" :value="p">
              Periode Ke - {{ p }}
            </option>
          </select>
          <div
            class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Input Pencarian -->
      <div class="w-full md:flex-1 mt-auto">
        <label
          class="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 tracking-widest"
          >Cari Agenda:</label
        >
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama tuan rumah atau lokasi..."
            class="w-full bg-white border-2 border-slate-200 p-4 pl-12 rounded-2xl font-bold text-sm shadow-sm focus:border-emerald-500 outline-none transition-all"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <main class="max-w-4xl mx-auto px-6">
      <div v-if="user" class="flex justify-end mb-6">
        <button
          @click="
            selectedItem = null;
            showFormModal = true;
          "
          class="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
        >
          + Tambah Jadwal
        </button>
      </div>

      <div
        v-if="isLoading"
        class="py-20 text-center animate-pulse font-black text-slate-200 uppercase tracking-widest text-xs"
      >
        Menyinkronkan Agenda...
      </div>

      <div v-else class="space-y-4">
        <!-- Gunakan filteredAgenda sebagai pengganti agendaList -->
        <div
          v-for="(item, idx) in filteredAgenda"
          :key="item.id"
          class="group bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-emerald-200 animate-in fade-in zoom-in-95 duration-300"
        >
          <div
            class="flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
          >
            <!-- Date Circle -->
            <div
              class="w-20 h-20 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-white shadow-2xl rotate-3"
            >
              <span class="text-xs font-bold opacity-60 uppercase">{{
                new Date(item.date).toLocaleString("id-id", { month: "short" })
              }}</span>
              <span class="text-3xl font-black">{{
                new Date(item.date).getDate()
              }}</span>
            </div>

            <div>
              <p
                class="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-1"
              >
                {{ formatDate(item.date) }}
              </p>
              <h3
                class="text-xl font-black text-slate-900 uppercase italic leading-tight mb-2"
              >
                Tuan Rumah: {{ item.hostName }}
              </h3>
              <div class="flex items-center gap-2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-xs font-bold">{{
                  item.location ?? "-"
                }}</span>
              </div>
            </div>
          </div>

          <div v-if="user" class="flex gap-2">
            <button
              @click="triggerEdit(item)"
              class="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="triggerDelete(item)"
              class="p-4 bg-slate-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Tampilan Jika Hasil Pencarian Kosong -->
        <div
          v-if="filteredAgenda.length === 0"
          class="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 font-bold uppercase text-[10px] tracking-widest italic"
        >
          Data tidak ditemukan untuk periode ini
        </div>
      </div>
    </main>

    <!-- Modals -->
    <AgendaFormModal
      :show="showFormModal"
      :item="selectedItem"
      :members="members"
      :currentPeriod="currentPeriod"
      @close="showFormModal = false"
      @refresh="loadData"
    />
    <DeceasedDeleteModal
      :show="showDeleteModal"
      :name="
        'Pertemuan di ' +
        selectedItem?.hostName +
        ' - ' +
        selectedItem?.location
      "
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <LayoutFooter />
  </div>
</template>
