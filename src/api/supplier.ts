import axios from "axios";
import { API_BASE_URL } from "../config";

export interface SupplierData {
    Supplier_ID: number;
    Supplier_Name: string;
    Supplier_Email: string;
    Supplier_Address: string;
    Supplier_ContactNo: string;
}

export interface SupplierCreateUpdate {
    name: string;
    address: string;
    email: string;
    contactno: string;
}
const api = axios.create({
    baseURL: API_BASE_URL+"/api/supplier",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const supplierService = {
    getSuppliers: async () => await api.get<SupplierData[]>(""),
    getSupplier: async (id: number) => await api.get<SupplierData>(`/${id}`),
    createSupplier: async (supplier: SupplierCreateUpdate) => await api.post("", supplier),
    updateSupplier: async (id: number, supplier: SupplierCreateUpdate) => await api.put(`/${id}`, supplier),
    deleteSupplier: async (id: number) => await api.delete(`/${id}`),

}
