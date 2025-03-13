<script setup lang="ts">
import {
    ArchiveBoxIcon,
} from '@heroicons/vue/24/solid';
import {
  useAnalytics
} from '../../../../composable/useAnalytics';

const {
  analyticsData
} = useAnalytics();
</script>

<template>
    <div class="stats bg-[#744e4e] shadow-md flex-auto">
        <div class="stat">
          <div class="stat-figure text-[#fff0ed]">
            <archive-box-icon class="h-6" />
          </div>
          <div class="stat-title text-[#e3dddc]">Total Products</div>
          <div class="stat-value text-white text-[24px]">{{analyticsData.totalProducts}}</div>
        </div>
      </div>
</template>