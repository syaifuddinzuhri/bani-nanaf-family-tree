<script setup lang="ts">
import type { FamilyMember } from "~/types/family";

const { generateData, listToTree } = useFamilyData();
const viewType = ref<"chart" | "table">("chart");
const rawData = ref<FamilyMember[]>([]);
const activeTab = ref<string>("");

onMounted(() => {
  rawData.value = generateData();

  // Perbaikan: Gunakan ?. dan || ""
  const firstId = rootMembers.value[0]?.id || "";
  activeTab.value = firstId;
});

const rootMembers = computed(() =>
  rawData.value.filter((m) => m.parentId === null)
);
const activeRootData = computed(() =>
  rootMembers.value.find((r) => r.id === activeTab.value)
);
const getFamilyData = (rootId: string | undefined) =>
  rootId ? rawData.value.filter((m) => m.rootId === rootId) : [];
const activeMaxGen = computed(() => {
  const data = getFamilyData(activeTab.value);
  return data.length ? Math.max(...data.map((m) => m.gen)) : 0;
});
const getTreeData = (rootId: string | undefined) =>
  rootId ? listToTree(getFamilyData(rootId), null) : [];

const showDeleteModal = ref(false);
const memberToDelete = ref<FamilyMember | null>(null);
const showEditModal = ref(false);
const selectedMember = ref<FamilyMember | null>(null);

const onAdd = () => {
  // Inisialisasi data kosong untuk anggota baru
  selectedMember.value = {
    id: "", // Kosong karena akan di-generate saat simpan
    name: "",
    gender: "L",
    spouse: "",
    parentId: null,
    rootId: activeTab.value, // Otomatis masuk ke Bani yang sedang dibuka
    gen: 1
  };
  showEditModal.value = true;
};

// Handler Edit
const onEdit = (member: FamilyMember) => {
  selectedMember.value = member;
  showEditModal.value = true;
};

// Handler Hapus (Cascade Delete Confirmation)
const onDelete = (member: FamilyMember) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

// Handler Simpan
const onSave = (formData: FamilyMember) => {
  if (formData.id) {
    // MODE EDIT
    const index = rawData.value.findIndex((m) => m.id === formData.id);
    if (index !== -1) rawData.value[index] = formData;
  } else {
    // MODE TAMBAH
    const newMember = {
      ...formData,
      id: `new-${Date.now()}` // Generate ID unik sementara
    };
    rawData.value.push(newMember);
  }
  showEditModal.value = false;
};

const getDescendantIds = (parentId: string): string[] => {
  let ids: string[] = [];
  const children = rawData.value.filter((m) => m.parentId === parentId);

  children.forEach((child) => {
    ids.push(child.id);
    ids = [...ids, ...getDescendantIds(child.id)]; // Ambil anak dari anak (rekursif)
  });

  return ids;
};

// 3. Eksekusi Hapus Permanen
const confirmDelete = () => {
  if (!memberToDelete.value) return;

  const targetId = memberToDelete.value.id;
  const descendantIds = getDescendantIds(targetId);
  const allIdsToDelete = [targetId, ...descendantIds];

  // Filter rawData: Buang semua ID yang masuk daftar hapus
  rawData.value = rawData.value.filter((m) => !allIdsToDelete.includes(m.id));

  // Tutup Modal
  showDeleteModal.value = false;
  memberToDelete.value = null;
};
</script>
<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
    <LayoutNavbar />
    <FamilyHero />

    <!-- Toggle & Selector -->
    <div class="space-y-10 mb-12">
      <div class="flex justify-center">
        <FamilyViewToggle v-model="viewType" />
      </div>
      <FamilyBaniSelector
        v-model:activeTab="activeTab"
        :rootMembers="rootMembers"
        :activeName="activeRootData?.name"
      />
    </div>

    <!-- Content -->
    <div class="max-w-full mx-auto px-6 md:px-12 lg:px-24">
      <div v-if="activeRootData" class="animate-in fade-in duration-700">
        <div
          class="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden"
        >
          <div class="p-4 md:p-14">
            <FamilyStatsCard
              :name="activeRootData.name"
              :count="getFamilyData(activeTab).length"
              :gen="activeMaxGen"
            />

            <div v-if="viewType === 'table'" class="flex justify-end mb-6">
              <button
                @click="onAdd"
                class="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
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
              @edit="onEdit"
              @delete="onDelete"
            />
          </div>
        </div>
      </div>
    </div>

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
      @close="showEditModal = false"
      @save="onSave"
    />

    <LayoutFooter />
  </div>
</template>
