import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SupplyDetailData {
    SupplyDetail_ID: number;
    Supply_ID: number;
    Quantity: number;
    Bar_Code: string;
    Unit_Price: number;
    Expiry: Date;
    Subtotal: number;
}

export interface SupplyDetailCreate {
  barCode: string;
  supplyId: number;
  quantity: number;
  unitPrice: number;
  expiry: string;
}


export interface SupplyDetailUpdate {
  quantity: number;
  unitPrice: number;
  expiry: string;
}

const api = axios.create({
  baseURL: API_BASE_URL+"/api/supplyDetail",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const supplyDetailService = {
  getSupplyDetails: async () => await api.get<SupplyDetailData[]>(""),
  getSupplyDetail: async (id: number) => await api.get<SupplyDetailData>(`/${id}`),
  createSupplyDetail: async (product: SupplyDetailCreate) => await api.post("", product),
  updateSupplyDetail: async (id: number, supply: SupplyDetailUpdate) => await api.put(`/${id}`, supply),
  deleteSupplyDetail: async (id: number) => await api.delete(`/${id}`),
};