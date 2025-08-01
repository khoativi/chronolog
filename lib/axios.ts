import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      toast.error('Không có kết nối mạng. Vui lòng kiểm tra Internet.', {
        id: 'offline-toast-axios'
      });
      return Promise.reject(new Error('Mất kết nối internet'));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Lỗi cấu hình'));
    }

    const errorMessage = error.response?.data?.message ?? 'Có lỗi xảy ra';

    return Promise.reject(new Error(errorMessage));
  }
);
