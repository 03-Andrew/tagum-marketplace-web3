<script setup lang="ts">

</script>

<template>
  <main class="flex text-nowrap flex-col gap-[16px] p-[26px]">
    <div class="font-med text-[18px] text-white tracking-tighter">Product</div>
    <div class="flex flex-wrap justify-start gap-[20px]">
      <product-variant-widget/>
      <product-widget/>
      <brand-widget/>
    </div>
  </main>
</template>

<style scoped>
</style>