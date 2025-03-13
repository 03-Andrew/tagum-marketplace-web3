import axios from "axios";
import { API_BASE_URL } from "../config";

export interface RemarkData {
    Remarks_ID: number;
    Remarks: string;
}

export interface RemarkCreateUpdate {
    remark: string;
}

const api = axios.create({
    baseURL: API_BASE_URL+"/api/remark",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const remarkService = {
    getRemarks: async () => await api.get<RemarkData[]>(""),
    getRemark: async (id: number) => await api.get<RemarkData>(`/${id}`),
    createRemark: async (remark: RemarkCreateUpdate) => await api.post("", remark),
    updateRemark: async (id: number, remark: RemarkCreateUpdate) => await api.put(`/${id}`, remark),
    deleteRemark: async (id: number) => await api.delete<RemarkCreateUpdate>(`/${id}`),
};