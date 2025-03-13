import axios from "axios";
import { API_BASE_URL } from "../config";
export interface BrandData {
    Brand_ID: number;
    Brand_Name: string;
}

export interface BrandCreateUpdate {
    name: string
}
const api = axios.create({
    baseURL: API_BASE_URL+"/api/brand",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const brandService = {
    getBrands: async () => await api.get<BrandData[]>(""),
    getBrand: async (id: number) => await api.get<BrandData>(`/${id}`),
    createBrand: async (brand: BrandCreateUpdate) => await api.post("", brand),
    updateBrand: async (id: number, brand: BrandCreateUpdate) => await api.put(`/${id}`, brand),
    deleteBrand: async (id: number) => await api.delete(`/${id}`),

}