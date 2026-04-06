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
          <div class="p-8 md:p-14">
            <FamilyStatsCard
              :name="activeRootData.name"
              :count="getFamilyData(activeTab).length"
              :gen="activeMaxGen"
            />

            <FamilyContentArea
              :viewType="viewType"
              :treeData="getTreeData(activeTab)"
              :maxGen="activeMaxGen"
            />
          </div>
        </div>
      </div>
    </div>

    <LayoutFooter />
  </div>
</template>
