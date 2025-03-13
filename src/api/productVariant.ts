import axios from "axios";
import { API_BASE_URL } from "../config";

export interface ProductVariantData {
    Product_Name: string;
    Bar_Code: string;
    Product_ID: number;
    Unit_Weight: number;
    Unit_Size: string;
    Unit_Price: number;
    Inventory_Quantity: number;
}

export interface ProductVariantCreateUpdate {
    newBarCode: string;
    productId: number;
    unitWeight: number;
    unitSize: string;
    unitPrice: number;
}
const api = axios.create({
    baseURL: API_BASE_URL+"/api/productVariant"
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const productVariantService = {
    getProductVariants: async () => await api.get<ProductVariantData[]>("/"),
    getProductVariant: async (barCode: string) => await api.get<ProductVariantData>(`/${barCode}`),
    createProductVariant: async (data: ProductVariantCreateUpdate) => await api.post("/", data),
    updateProductVariant: async (barCode: string, data: ProductVariantCreateUpdate) => await api.put(`/${barCode}`, data),
    deleteProductVariant: async (barCode: string) => await api.delete(`/${barCode}`),
}