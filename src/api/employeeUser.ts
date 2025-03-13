import axios from "axios";
import { API_BASE_URL } from "../config";

export interface EmployeeUserData {
  Employee_ID: number,
  Employee_Name: string,
  Employee_DOB: Date,
  Employee_Gender: string,
  Employee_Address: string,
  Employee_ContactNo: string,
  Username: string,
  Role: string,
  User_DateReg: Date
}

export interface EmployeeUserCreateUpdate {
    employeeName: string;
    username: string;
    employeeGender: string;
    employeeDOB: Date;
    employeeAddress: string;
    employeeContactNo: string;
    password: string;
    role: string
}
const api = axios.create({
  baseURL: API_BASE_URL+"/api/employee",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeUserService = {
  getEmployeeUsers: async () => await api.get<EmployeeUserData[]>(""),
  getEmployeeUser: async (id: number) => await api.get<EmployeeUserData>(`/${id}`),
  createEmployeeUser: async (employeeUser: EmployeeUserCreateUpdate) =>
    await api.post("", employeeUser),
  updateEmployeeUser: async (id: number, employeeUser: EmployeeUserCreateUpdate) =>
    await api.put(`/${id}`, employeeUser),
  deleteEmployeeUser: async (id: number) => await api.delete(`/${id}`),
};
