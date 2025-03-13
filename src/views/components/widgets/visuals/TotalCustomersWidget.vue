<script setup lang="ts">
import {
  UserGroupIcon,
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
        <user-group-icon class="h-6" />
      </div>
      <div class="stat-title text-[#e3dddc]">Total Customers</div>
      <div class="stat-value text-white text-[24px]">{{ analyticsData.totalCustomers }} Customers</div>
    </div>
  </div>
</template>