import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // WAJIB untuk mengirimkan/menerima cookie HTTP-Only dari backend
  timeout: 5000, // Timeout 5 detik
});
