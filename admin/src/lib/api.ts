import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/login'; }
        return Promise.reject(err);
    }
);

export const authApi = { login: (d: any) => api.post('/auth/login', d) };
export const productsApi = {
    getAll: (p?: any) => api.get('/products', { params: p }),
    create: (d: any) => api.post('/products', d),
    update: (id: number, d: any) => api.put(`/products/${id}`, d),
    delete: (id: number) => api.delete(`/products/${id}`),
    uploadImage: (id: number, fd: FormData) => api.post(`/products/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
export const categoriesApi = { getAll: () => api.get('/categories'), create: (d: any) => api.post('/categories', d), update: (id: number, d: any) => api.put(`/categories/${id}`, d), delete: (id: number) => api.delete(`/categories/${id}`) };
export const brandsApi = { getAll: () => api.get('/brands'), create: (d: any) => api.post('/brands', d), update: (id: number, d: any) => api.put(`/brands/${id}`, d), delete: (id: number) => api.delete(`/brands/${id}`) };
export const ordersApi = { getAll: (p?: any) => api.get('/orders', { params: p }), getOne: (id: number) => api.get(`/orders/${id}`), updateStatus: (id: number, tt: string) => api.put(`/orders/${id}/status`, { trang_thai: tt }) };
export const usersApi = {
    getAll: (p?: any) => api.get('/users', { params: p }),
    getOne: (id: number) => api.get(`/users/${id}`),
    update: (id: number, d: any) => api.put(`/users/${id}`, d),
    updateStatus: (id: number, st: string) => api.put(`/users/${id}/status`, { status: st }),
    delete: (id: number) => api.delete(`/users/${id}`),
};
export const reviewsApi = { getAll: (p?: any) => api.get('/reviews', { params: p }), approve: (id: number) => api.put(`/reviews/${id}/approve`), reject: (id: number) => api.put(`/reviews/${id}/reject`), delete: (id: number) => api.delete(`/reviews/admin/${id}`) };
export const reportsApi = { getDashboard: () => api.get('/reports/dashboard') };
export const inventoryApi = { getAll: () => api.get('/inventory'), update: (sp: number, qty: number) => api.put('/inventory', { ma_sanpham: sp, soluong_tonkho: qty }) };
export const couponsApi = { getAll: () => api.get('/coupons'), create: (d: any) => api.post('/coupons', d), update: (id: number, d: any) => api.put(`/coupons/${id}`, d) };
export const paymentsApi = { getAll: (p?: any) => api.get('/payments', { params: p }), updateStatus: (id: number, tt: string) => api.put(`/payments/${id}/status`, { trang_thai: tt }) };
export const settingsApi = { get: () => api.get('/settings'), update: (d: any) => api.patch('/settings', d) };
