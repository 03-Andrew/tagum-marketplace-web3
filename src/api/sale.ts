import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SaleData {
    id: number;
    customerName: string;
    employeeName: string;
    customerId: number;
    employeeId: number;
    date: Date;
}

export interface SaleDataCreateUpdate {
    customerId: number;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/sale",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const saleService = {
    getSales: async () => await api.get<SaleData[]>(""),
    getSale: async (id: number) => await api.get<SaleData>(`/${id}`),
    createSale: async (sale: SaleDataCreateUpdate) => await api.post("", sale),
    updateSale: async (id: number, sale: SaleDataCreateUpdate) => await api.put(`/${id}`, sale),
    deleteSale: async (id: number) => await api.delete<SaleDataCreateUpdate>(`/${id}`),
};