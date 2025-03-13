import axios from "axios";
import { API_BASE_URL } from "../config";
export interface AnalyticsData {
    totalEarnings: TotalAmountFromSales;
    totalProducts: number;
    totalCustomers: number;
    totalSales: number;
}

interface TotalAmountFromSales {
    "TotalAmount": number,
    "StartDate": Date,
    "EndDate": Date
}

export interface MonthlySalesData {
    "Sales_Year": number;
    "Sales_Month": number;
    "Total_Sales": number;
}
export interface YearlySalesData {
    "Sales_Year": number;
    "Total_Sales": number;
}
export interface WeeklySalesData {
    "Sales_Year": number;
    "Sales_Week": number;
    "Total_Sales": number;
}
const api = axios.create({
    baseURL: API_BASE_URL+"/api/analytics",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const analyticsService = {
getAnalytics: async () => await api.get<AnalyticsData>(""),
getMonthlySales: async () => await api.get<MonthlySalesData[]>("/monthly"),
getWeeklySales: async () => await api.get<WeeklySalesData[]>("/weekly"),
getYearlySales: async () => await api.get<YearlySalesData[]>("/yearly"),
}