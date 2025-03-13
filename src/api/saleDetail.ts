import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SaleDetailData {
    saleId: number;
    barCode: string;
    unitPrice: number;
    quantity: number;
    subTotal: number;
}



export interface SaleDetailCreate {
    barCode: string;
    unitPrice: number;
    quantity: number;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/saleDetail",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const saleDetailService = {
    getSaleDetails: async () => await api.get<SaleDetailData[]>(""),
    getSaleDetailsById: async (id: number) => await api.get<SaleDetailData>(`/${id}`),
    createSaleDetail: async (id: number, saleDetail: SaleDetailCreate[]) => await api.post(`/${id}`, saleDetail),
    deleteSaleDetail: async (id: number, barCode: string) => await api.delete(`/${id}/${barCode}`),
};