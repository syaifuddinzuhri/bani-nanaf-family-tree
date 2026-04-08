<script setup lang="ts">
const { user } = useAuth();
const { getAllMembers } = useFamilyService();
const { getDeceasedByRoot, deleteDeceased } = useDeceasedService();

const roots = ref<any[]>([]);
const activeTab = ref("");
const deceasedList = ref<any[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);

// Modals State
const showBulkModal = ref(false);
const showEditModal = ref(false);
const selectedItem = ref(null);

const loadInitial = async () => {
  const all = await getAllMembers();
  roots.value = all.filter((m) => m.parentId === null);
  if (roots.value.length > 0) activeTab.value = roots.value[0]?.id || "";
};

const loadDeceased = async () => {
  if (!activeTab.value) return;
  isLoading.value = true;
  try {
    deceasedList.value = await getDeceasedByRoot(activeTab.value);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadInitial();
  await loadDeceased();
});

watch(activeTab, () => loadDeceased());

const filteredList = computed(() => {
  return deceasedList.value.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleEdit = (item: any) => {
  selectedItem.value = item;
  showEditModal.value = true;
};

const showDeleteModal = ref(false);
const itemToDelete = ref<any>(null);
const isProcessing = ref(false);

// Handler untuk memicu modal
const triggerDelete = (item: any) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

// Fungsi eksekusi hapus ke Firebase
const confirmDelete = async () => {
  if (!itemToDelete.value?.id) return;
  isProcessing.value = true;
  try {
    await deleteDeceased(itemToDelete.value.id);
    await loadDeceased(); // Refresh list
    showDeleteModal.value = false;
    itemToDelete.value = null;
  } catch (error) {
    alert("Gagal menghapus data");
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24 font-sans text-slate-900">
    <LayoutLoadingOverlay v-if="isProcessing" />
    <LayoutNavbar />

    <!-- Header Section -->
    <header class="pt-16 pb-12 text-center px-6">
      <h1
        class="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        Ahli Kubur
      </h1>
      <p
        class="text-emerald-600 font-black uppercase text-[10px] tracking-[0.5em] mt-4 opacity-70"
      >
        Daftar Keluarga Yang Telah Mendahului
      </p>
    </header>

    <!-- Filter Tab Bani -->
    <FamilyBaniSelector
      v-model:activeTab="activeTab"
      :rootMembers="roots"
      :activeName="roots.find((r) => r.id === activeTab)?.name"
    />

    <!-- Main Content -->
    <main class="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mt-10">
      <div
        class="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
      >
        <div class="p-8 md:p-12 lg:p-16">
          <!-- Tool Bar: Search & Add -->
          <div
            class="flex flex-col lg:flex-row gap-6 mb-12 justify-between items-center"
          >
            <div class="relative w-full lg:max-w-md">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama..."
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-14 text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
              />
              <svg
                class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              v-if="user"
              @click="showBulkModal = true"
              class="w-full lg:w-auto px-10 py-4 bg-slate-900 text-emerald-400 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all"
            >
              + Bulk Insert Nama
            </button>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="py-32 flex flex-col items-center justify-center space-y-4"
          >
            <div
              class="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"
            ></div>
            <p
              class="text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Menyinkronkan Database...
            </p>
          </div>

          <!-- GRID VIEW -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            <div
              v-for="(item, idx) in filteredList"
              :key="item.id"
              class="group relative flex items-center justify-between p-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <div class="flex items-center gap-4 overflow-hidden">
                <!-- Index Number -->
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
                >
                  <span class="text-[12px] font-black text-slate-600">{{
                    idx + 1
                  }}</span>
                </div>

                <!-- Name -->
                <span
                  class="text-sm font-black text-slate-800 uppercase tracking-tight truncate leading-none"
                >
                  {{ item.name }}
                </span>
              </div>

              <!-- Admin Actions -->
              <div v-if="user" class="flex ml-2">
                <button
                  @click="handleEdit(item)"
                  class="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Edit Nama"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="triggerDelete(item)"
                  class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="filteredList.length === 0"
              class="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]"
            >
              <div class="mb-4 flex justify-center">
                <div
                  class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <p
                class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]"
              >
                Data tidak ditemukan
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <DeceasedBulkModal
      :show="showBulkModal"
      :rootId="activeTab"
      :roots="roots"
      @close="showBulkModal = false"
      @refresh="loadDeceased"
    />
    <DeceasedEditModal
      :show="showEditModal"
      :item="selectedItem"
      @close="showEditModal = false"
      @refresh="loadDeceased"
    />

    <DeceasedDeleteModal
      :show="showDeleteModal"
      :name="itemToDelete?.name || ''"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <LayoutFooter />
  </div>
</template>
