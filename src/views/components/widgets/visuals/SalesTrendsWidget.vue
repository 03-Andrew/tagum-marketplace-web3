<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    CalendarDateRangeIcon
} from '@heroicons/vue/24/solid';
import { useAnalytics } from '../../../../composable/useAnalytics';

const { weeklySalesData, monthlySalesData, yearlySalesData } = useAnalytics();
const selectedFilter = ref<'weekly' | 'monthly' | 'yearly'>('weekly');

const updateFilter = (filter: 'weekly' | 'monthly' | 'yearly') => {
    selectedFilter.value = filter;
};

const getWeekName = (week: number) => {
    if (week >= 11 && week <= 13) return `${week}th Week`;
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const mod10 = week % 10;
    const suffix = suffixes[(mod10 < 4 ? mod10 : 0)];
    return `${week}${suffix} Week`;
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const chartData = computed(() => {
    if (selectedFilter.value === 'weekly') {
        return {
            labels: weeklySalesData.value.map((item: any) => getWeekName(item.Sales_Week)),
            seriesData: weeklySalesData.value.map((item: any) => item.Total_Sales)
        };
    } else if (selectedFilter.value === 'monthly') {
        return {
            labels: monthlySalesData.value.map((item: any) => monthNames[item.Sales_Month - 1] || `Month ${item.Sales_Month}`),
            seriesData: monthlySalesData.value.map((item: any) => item.Total_Sales)
        };
    } else {
        return {
            labels: yearlySalesData.value.map((item: any) => `Year ${item.Sales_Year}`),
            seriesData: yearlySalesData.value.map((item: any) => item.Total_Sales)
        };
    }
});

const rainbowColors = [
    '#fa7070',
    '#FF7F00',
    '#e3e371',
    '#59d959',
    '#5a5ae0',
    '#7e49a6',
    '#9c4fbd'
];
const chartOptions = computed(() => ({
    chart: {
        foreColor: '#FFFFFF',
        toolbar: { show: false }
    },
    xaxis: {
        labels: {
            show: true,
            style: {
                fontFamily: 'Roboto',
                fontWeight: '500'
            }
        },
        categories: chartData.value.labels
    },
    theme: {
        monochrome: {
            enabled: true,
            color: '#ff673d'
        }
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                fontFamily: 'Roboto',
                fontWeight: '500'
            }
        }
    },
    dataLabels: {
        style: {
            fontFamily: 'Roboto',
            fontSize: '13px',
            fontWeight: '500',
            fill: '#ffffff'
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '10%',
            borderRadius: 5,
        }
    },
    tooltip: {
        enabled: true,
    }
}));

const series = computed(() => [{
    name: 'Total Sales',
    data: chartData.value.seriesData.map((value, index) => ({
        x: chartData.value.labels[index],
        y: value,
        fillColor: rainbowColors[index % rainbowColors.length]
    }))
}]);

watch(selectedFilter, () => {
    console.log(`Switched to ${selectedFilter.value} sales data`);
});

</script>

<template>
    <div class="tg-widget shadow-md">
        <div class="tg-widget-h">
            <div>Sales Trends</div>
            <div class="flex">

                <div class="dropdown dropdown-end tooltip tooltip-left" data-tip="Date Range">
                    <div tabindex="0" role="button" class="tg-widget-btn bg-transparent">
                        <calendar-date-range-icon class="tg-widget-btn-icon" />
                    </div>
                    <ul tabindex="0"
                        class="dropdown-content menu bg-[#1f1619] mt-[3px] rounded-box z-[1] w-30 shadow-lg">
                        <li><a @click="updateFilter('weekly')">Weekly</a></li>
                        <li><a @click="updateFilter('monthly')">Monthly</a></li>
                        <li><a @click="updateFilter('yearly')">Yearly</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="tg-widget-c">
            <apexchart type="bar" width="100%" height="200px" :options="chartOptions" :series="series" />
        </div>
    </div>
</template>
<style>
.apexcharts-tooltip {
    background: #000000;
    color: rgb(0, 0, 0);
}
</style>