<script setup lang="ts">
import type { FamilyMember } from "~/types/family";

// Inisialisasi Service
const { user } = useAuth();
const { listToTree } = useFamilyData();
const service = useFamilyService();
const isExporting = ref(false);
const showExportMenu = ref(false);
const { exportHighRes } = useExport();

const handleExport = async (format: "png" | "pdf") => {
  isExporting.value = true;
  showExportMenu.value = false;

  // Berikan sedikit waktu agar DOM shadow merender data terbaru
  await nextTick();

  const baniName = activeRootData.value?.name || "Keluarga";
  try {
    await exportHighRes("shadow-export-area", `Silsilah-${baniName}`, format);
  } catch (error) {
    console.log(error);
  }

  isExporting.value = false;
};

// State Utama
const viewType = ref<"chart" | "table">("chart");
const rawData = ref<FamilyMember[]>([]);
const activeTab = ref<string>("");
const isLoading = ref(true);
const isProcessing = ref(false); // BARU: Untuk overlay saat simpan/hapus

// State Modal
const showDeleteModal = ref(false);
const memberToDelete = ref<FamilyMember | null>(null);
const showEditModal = ref(false);
const selectedMember = ref<FamilyMember | null>(null);

// 1. FUNGSI LOAD DATA (Get All)
const loadData = async (isSilent: boolean = false) => {
  if (!isSilent) isLoading.value = true;
  try {
    const data = await service.getAllMembers();
    rawData.value = data;

    if (rootMembers.value.length > 0 && !activeTab.value) {
      activeTab.value = rootMembers.value[0]?.id || "";
    }
  } catch (error) {
    console.error("Gagal memuat data:", error);
  } finally {
    isLoading.value = false;
  }
};

// 2. FUNGSI SEEDER (Hanya jika kosong)
const handleInitialSeed = async () => {
  if (!confirm("Inisialisasi 6 Nasab utama ke database?")) return;

  isLoading.value = true;
  try {
    await service.seedRootMembers();
    await loadData(); // Reload setelah seed
    alert("Berhasil menginisialisasi database.");
  } catch (error) {
    alert("Gagal melakukan seeding.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Computed Properties
const rootMembers = computed(() =>
  rawData.value.filter((m) => m.parentId === null)
);
const activeRootData = computed(() =>
  rawData.value.find((r) => r.id === activeTab.value)
);
const getFamilyData = (rootId: string | undefined) =>
  rootId ? rawData.value.filter((m) => m.rootId === rootId) : [];
const activeMaxGen = computed(() => {
  const data = getFamilyData(activeTab.value);
  return data.length ? Math.max(...data.map((m) => m.gen)) : 0;
});
const getTreeData = (rootId: string | undefined) =>
  rootId ? listToTree(getFamilyData(rootId), null) : [];

// Handler UI
const onAdd = () => {
  selectedMember.value = {
    id: "",
    name: "",
    gender: "L",
    spouse: "",
    parentId: null,
    rootId: activeTab.value,
    gen: 1,
    sortOrder: 1
  };
  showEditModal.value = true;
};

const onEdit = (member: FamilyMember) => {
  selectedMember.value = { ...member };
  showEditModal.value = true;
};

const onDelete = (member: FamilyMember) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

// 3. HANDLER SIMPAN (Firebase Create/Update)
const onSave = async (formData: FamilyMember) => {
  isProcessing.value = true;
  try {
    // 1. Simpan data (Create/Update)
    if (formData.id && !formData.id.startsWith("new-")) {
      await service.updateMember(formData.id, formData);
    } else {
      const { id, ...payload } = formData;
      await service.createMember(payload);
    }

    // 2. Ambil data terbaru dari Firebase
    const updatedRawData = await service.getAllMembers();

    // 3. LOGIKA NORMALISASI URUTAN (Agar sortOrder tidak berantakan 1.5, 2.5, dll)
    // Kita kumpulkan semua anak dari parent yang sama, sort, lalu update urutannya
    const siblings = updatedRawData
      .filter(
        (m) => m.parentId === formData.parentId && m.rootId === formData.rootId
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Perbaikan: Gunakan loop for-of atau entries untuk menghindari akses indeks undefined
    let index = 0;
    for (const sibling of siblings) {
      const newOrder = index + 1;
      // Pastikan id ada dan cek jika order berubah
      if (sibling.id && sibling.sortOrder !== newOrder) {
        await service.updateMember(sibling.id, { sortOrder: newOrder });
      }
      index++;
    }

    await loadData(true);
    showEditModal.value = false;
  } catch (e) {
    alert("Gagal memperbarui urutan silsilah.");
  } finally {
    isProcessing.value = false;
  }
};

// 4. HANDLER HAPUS (Firebase Recursive Delete)
const confirmDelete = async () => {
  if (!memberToDelete.value?.id) return;

  isProcessing.value = true; // Munculkan overlay
  try {
    await service.deleteMemberRecursive(memberToDelete.value.id);
    await loadData();
    showDeleteModal.value = false;
    memberToDelete.value = null;
  } catch (e) {
    alert("Gagal menghapus data.");
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
    <LayoutLoadingOverlay v-if="isProcessing || isExporting" />
    <LayoutNavbar />
    <FamilyHero />

    <!-- LOADING STATE -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center h-64 gap-4"
    >
      <div
        class="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"
      ></div>
      <p
        class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
      >
        Sinkronisasi Data...
      </p>
    </div>

    <template v-else>
      <!-- KONDISI JIKA DATABASE KOSONG -->
      <div
        v-if="rawData.length === 0"
        class="max-w-xl mx-auto px-6 py-20 text-center space-y-6"
      >
        <div
          class="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800 uppercase italic">
          Database Kosong
        </h2>
        <p class="text-slate-400 text-sm">
          Klik tombol di bawah untuk mengisi 6 Nasab utama Mbah Naimin & Nafsiah
          secara otomatis.
        </p>
        <button
          @click="handleInitialSeed"
          class="px-8 py-4 bg-slate-900 text-emerald-400 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all"
        >
          Inisialisasi Data Nasab
        </button>
      </div>

      <!-- TAMPILAN SILSILAH -->
      <div v-else>
        <div class="space-y-10 mb-12">
          <div
            class="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <!-- Toggle View -->
            <FamilyViewToggle v-model="viewType" />
          </div>

          <FamilyBaniSelector
            v-model:activeTab="activeTab"
            :rootMembers="rootMembers"
            :activeName="activeRootData?.name"
          />
        </div>

        <div class="max-w-full mx-auto px-6 md:px-12 lg:px-24">
          <div v-if="activeRootData" class="animate-in fade-in duration-700">
            <div
              class="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden mb-20"
            >
              <div class="p-6 md:p-8">
                <!-- <FamilyStatsCard
                  :name="activeRootData.name"
                  :count="getFamilyData(activeTab).length"
                  :gen="activeMaxGen"
                /> -->

                <div
                  class="flex flex-col md:flex-row justify-end mb-6 gap-3"
                  v-if="user"
                >
                  <div class="relative">
                    <button
                      @click="showExportMenu = !showExportMenu"
                      class="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase shadow-sm hover:border-emerald-500 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="3"
                      >
                        <path
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Simpan Dokumen
                    </button>
                    <!-- Dropdown Menu Export -->
                    <div
                      v-if="showExportMenu"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in zoom-in-95"
                    >
                      <button
                        @click="handleExport('png')"
                        class="w-full text-left px-5 py-4 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 border-b flex justify-between"
                      >
                        Format Gambar <span>HD</span>
                      </button>
                      <button
                        @click="handleExport('pdf')"
                        class="w-full text-left px-5 py-4 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 flex justify-between"
                      >
                        Format PDF <span>A4</span>
                      </button>
                    </div>
                  </div>
                  <button
                    @click="onAdd"
                    class="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tambah Anggota
                  </button>
                </div>

                <FamilyContentArea
                  :viewType="viewType"
                  :treeData="getTreeData(activeTab)"
                  :maxGen="activeMaxGen"
                  :count="getFamilyData(activeTab).length"
                  :isAdmin="!!user"
                  :activeBaniName="activeRootData?.name"
                  @edit="onEdit"
                  @delete="onDelete"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="fixed left-[-9999px] top-[-9999px] overflow-visible">
      <div id="shadow-export-area">
        <FamilyExportTemplate
          v-if="activeRootData"
          :treeData="getTreeData(activeTab)"
          :maxGen="activeMaxGen"
          :count="getFamilyData(activeTab).length"
          :activeBaniName="activeRootData.name"
          :viewType="viewType"
        />
      </div>
    </div>

    <!-- Modal Modals -->
    <FamilyDeleteModal
      :show="showDeleteModal"
      :name="memberToDelete?.name || ''"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
    <FamilyMemberModal
      :show="showEditModal"
      :member="selectedMember"
      :allMembers="rawData"
      :activeBaniName="activeRootData?.name"
      @close="showEditModal = false"
      @save="onSave"
    />
    <LayoutFooter />
  </div>
</template>
