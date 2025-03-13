import axios from "axios";
import { API_BASE_URL } from "../config";
export interface CustomerData {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface CustomerDataCreateUpdate {
    name: string;
    phone: string;
    address: string;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/customer",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const customerService = {
    getCustomers: async () => await api.get<CustomerData[]>(""),
    getCustomer: async (id: number) => await api.get<CustomerData>(`/${id}`),
    createCustomer: async (customer: CustomerDataCreateUpdate) => await api.post("", customer),
    updateCustomer: async (id: number, customer: CustomerDataCreateUpdate) => await api.put(`/${id}`, customer),
    deleteCustomer: async (id: number) => await api.delete<CustomerData>(`/${id}`),
};