import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SupplyData {
  Supply_ID: number;
  Supplier_id: number;
  Employee_id: number;
  Supply_date: string;
  Supplier_Name: string;
  Employee_Name: string;
}

export interface SupplyCreateUpdate {
    supplierId: number;
    supplyDate: string;
}
const api = axios.create({
  baseURL: API_BASE_URL+"/api/supply",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const supplyService = {
  getSupplies: async () => await api.get<SupplyData[]>(""),
  getSupply: async (id: number) => await api.get<SupplyData>(`/${id}`),
  createSupply: async (product: SupplyCreateUpdate) =>
    await api.post("", product),
  updateSupply: async (id: number, supply: SupplyCreateUpdate) =>
    await api.put(`/${id}`, supply),
  deleteSupply: async (id: number) => await api.delete(`/${id}`),
};
