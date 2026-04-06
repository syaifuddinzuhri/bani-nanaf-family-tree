<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
body {
  /* Mencegah pergeseran layout saat scrollbar disembunyikan */
  padding-right: var(--removed-body-scroll-bar-size, 0px);
}
</style>
