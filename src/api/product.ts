import axios from "axios";
import { API_BASE_URL } from "../config";

export interface ProductData {
    Product_ID: number;
    Product_Name: string;
    Brand_ID: number;
    Brand_Name: string;
}

export interface ProductCreateUpdate {
    name: string;
    brandId: number;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/product",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const productService = {
    getProducts: async () => await api.get<ProductData[]>(""),
    getProduct: async (id: number) => await api.get<ProductData>(`/${id}`),
    createProduct: async (product: ProductCreateUpdate) => await api.post("", product),
    updateProduct: async (id: number, product: ProductCreateUpdate) => await api.put(`/${id}`, product),
    deleteProduct: async (id: number) => await api.delete(`/${id}`),
}
