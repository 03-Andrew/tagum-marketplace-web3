import axios from "axios";
import { API_BASE_URL } from "../config";

export interface StockOutSupplyData {
    StockOut_ID: number;
    SupplyDetail_ID: number;
    Employee_ID: number;
    Remarks_ID: number;
    StockOut_Date: string;
}
export interface StockOutSupplyCreateUpdate {
    supplyDetailId: number;
    remarksId: number;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/stockOut",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const stockOutSupplyService = {
    getStockOutSupplies: async () => await api.get<StockOutSupplyData[]>(""),
    getStockOutSupply: async (id: number) => await api.get<StockOutSupplyData>(`/${id}`),
    createStockOutSupply: async (data: StockOutSupplyCreateUpdate) => await api.post<StockOutSupplyData>("/", data),    
    updateStockOutSupply: async (id: number, data: StockOutSupplyCreateUpdate) => await api.put<StockOutSupplyData>(`/${id}`, data),
    deleteStockOutSupply: async (id: number) => await api.delete<StockOutSupplyData>(`/${id}`),
};
