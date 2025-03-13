<script setup lang="ts">
import {
  BanknotesIcon,
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
        <banknotes-icon class="h-6" />
      </div>
      <div class="stat-title text-[#e3dddc]">Total Earnings</div>
      <div class="stat-value text-white text-[24px]">PHP {{ analyticsData.totalEarnings.TotalAmount ?? 0}}</div>
      <div class="stat-desc text-[#e3dddc]">
        {{ new Date(analyticsData.totalEarnings.StartDate).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }) }} 
        - {{ new Date(analyticsData.totalEarnings.EndDate).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }) }}</div>
    </div>
  </div>
</template>