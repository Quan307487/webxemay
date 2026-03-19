import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn token vào header - Tối ưu hiệu suất
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            try {
                // Parse một lần và kiểm tra
                const state = JSON.parse(authData)?.state;
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            } catch (e) { /* ignore parse error */ }
        }
    }
    return config;
});

// Xử lý lỗi global & Tự động thông báo
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (typeof window === 'undefined') return Promise.reject(err);

        const status = err.response?.status;
        const message = err.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại';

        if (status === 401) {
            const authData = localStorage.getItem('auth-storage');
            if (authData && JSON.parse(authData)?.state?.token) {
                localStorage.removeItem('auth-storage');
                window.location.href = '/auth/login';
            }
        } else if (err.config?.skipToast !== true) {
            // Tự động hiển thị toast nếu không yêu cầu bỏ qua
            toast.error(message);
        }

        return Promise.reject(err);
    }
);

// Auth
export const authApi = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, newPass: string) => api.post('/auth/reset-password', { token, newPass }),
    directReset: (email: string, newPass: string) => api.post('/auth/direct-reset', { email, newPass }),
};

// Products
export const productsApi = {
    getAll: (params?: any) => api.get('/products', { params }),
    getOne: (id: number) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: number, data: any) => api.put(`/products/${id}`, data),
    delete: (id: number) => api.delete(`/products/${id}`),
    uploadImage: (id: number, formData: FormData) => api.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteImage: (ma_anh: number) => api.delete(`/products/images/${ma_anh}`),
    updateImage: (ma_anh: number, data: any) => api.put(`/products/images/${ma_anh}`, data),
};

// Categories
export const categoriesApi = {
    getAll: (active?: boolean) => api.get('/categories', { params: active ? { active: '1' } : {} }),
};

// Brands
export const brandsApi = {
    getAll: (active?: boolean) => api.get('/brands', { params: active ? { active: '1' } : {} }),
};

// Cart
export const cartApi = {
    get: () => api.get('/cart'),
    addItem: (data: { ma_sanpham: number; so_luong: number; mau_chon?: string }) => api.post('/cart/items', data),
    updateItem: (id: number, so_luong: number) => api.put(`/cart/items/${id}`, { so_luong }),
    removeItem: (id: number) => api.delete(`/cart/items/${id}`),
    clear: () => api.delete('/cart'),
};

// Orders
export const ordersApi = {
    checkout: (data: any) => api.post('/orders/checkout', data),
    getMyOrders: () => api.get('/orders/my'),
    getMyOrder: (id: number) => api.get(`/orders/my/${id}`),
    getAll: (params?: any) => api.get('/orders', { params }),
    updateStatus: (id: number, trang_thai: string) => api.put(`/orders/${id}/status`, { trang_thai }),
};

// Reviews
export const reviewsApi = {
    getByProduct: (id: number) => api.get(`/reviews/product/${id}`),
    getMyReviews: () => api.get('/reviews/my'),
    create: (data: any) => api.post('/reviews', data),
    update: (id: number, data: any) => api.put(`/reviews/${id}`, data),
    delete: (id: number) => api.delete(`/reviews/${id}`),
    getAll: (params?: any) => api.get('/reviews', { params }),
    approve: (id: number) => api.put(`/reviews/${id}/approve`),
    reject: (id: number) => api.put(`/reviews/${id}/reject`),
};

// Wishlist
export const wishlistApi = {
    getAll: () => api.get('/wishlist'),
    toggle: (ma_sanpham: number) => api.post('/wishlist/toggle', { ma_sanpham }),
    remove: (id: number) => api.delete(`/wishlist/${id}`),
};

// Users (admin)
export const usersApi = {
    getMe: () => api.get('/users/me'),
    updateMe: (data: any) => api.put('/users/me', data),
    changePassword: (data: any) => api.put('/users/me/password', data),
    getAll: (params?: any) => api.get('/users', { params }),
    updateStatus: (id: number, status: string) => api.put(`/users/${id}/status`, { status }),
};

// Reports
export const reportsApi = {
    getDashboard: () => api.get('/reports/dashboard'),
};

// Inventory
export const inventoryApi = {
    getAll: () => api.get('/inventory'),
    update: (ma_sanpham: number, soluong_tonkho: number) => api.put('/inventory', { ma_sanpham, soluong_tonkho }),
};

// Payments
export const paymentsApi = {
    getAll: (params?: any) => api.get('/payments', { params }),
    updateStatus: (id: number, trang_thai: string) => api.put(`/payments/${id}/status`, { trang_thai }),
};

// Coupons
export const couponsApi = {
    validate: (ma_giamgia: string, tong_tien: number) => api.post('/coupons/validate', { ma_giamgia, tong_tien }),
    getAll: () => api.get('/coupons'),
    create: (data: any) => api.post('/coupons', data),
    update: (id: number, data: any) => api.put(`/coupons/${id}`, data),
};
export const settingsApi = {
    get: () => api.get('/settings'),
};
