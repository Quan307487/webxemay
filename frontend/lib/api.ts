import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn token vào header
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
            try {
                const token = JSON.parse(authData).state?.token;
                if (token) config.headers.Authorization = `Bearer ${token}`;
            } catch (e) { console.error('Error parsing auth-storage', e); }
        }
    }
    return config;
});

// Xử lý lỗi global
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            // Chỉ logout nếu token đã được gửi (token thực sự bị từ chối/hết hạn)
            // Không logout nếu request không có token
            const authData = localStorage.getItem('auth-storage');
            const hasToken = authData && JSON.parse(authData)?.state?.token;
            if (hasToken) {
                localStorage.removeItem('auth-storage');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(err);
    }
);

// Auth
export const authApi = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
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
