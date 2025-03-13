import { ref, onMounted } from "vue";
import { AnalyticsData, MonthlySalesData, WeeklySalesData, YearlySalesData,analyticsService } from "../api/analytics";

export function useAnalytics() {
    const analyticsData = ref<AnalyticsData>({
        totalEarnings: {
            "TotalAmount": 0,
            "StartDate": new Date(),
            "EndDate": new Date()
        },
        totalProducts: 0,
        totalCustomers: 0,
        totalSales: 0
    });

    const weeklySalesData = ref<WeeklySalesData[]>([]);

    const monthlySalesData = ref<MonthlySalesData[]>([]);

    const yearlySalesData = ref<YearlySalesData[]>([]);
    const loadAnalytics = async () => {
        try {
            const response = await analyticsService.getAnalytics();
            analyticsData.value = response.data;
        } catch (err) {
            console.error("Error loading analytics:", err);
        }
    }

    const loadWeeklySales = async () => {
        try {
            const response = await analyticsService.getWeeklySales();
            weeklySalesData.value = response.data;
        } catch (err) {
            console.error("Error loading weekly sales:", err);
        }
    }

    const loadMonthlySales = async () => {
        try {
            const response = await analyticsService.getMonthlySales();
            monthlySalesData.value = response.data;
        } catch (err) {
            console.error("Error loading monthly sales:", err);
        }
    }

    const loadYearlySales = async () => {
        try {
            const response = await analyticsService.getYearlySales();
            yearlySalesData.value = response.data;
        } catch (err) {
            console.error("Error loading yearly sales:", err);
        }
    }
    onMounted(() => {
        loadAnalytics();
        loadWeeklySales();
        loadMonthlySales();
        loadYearlySales();
    });
    return { analyticsData, weeklySalesData, monthlySalesData, yearlySalesData };
}