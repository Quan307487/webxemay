import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    ma_user: number;
    ten_user: string;
    email: string;
    hovaten: string;
    quyen: string;
    status: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    _hasHydrated: boolean;
    accountStatusError: string | null;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    setAccountStatusError: (msg: string | null) => void;
    isLoggedIn: () => boolean;
    isAdmin: () => boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            _hasHydrated: false,
            accountStatusError: null,
            setAuth: (token, user) => set({ token, user, accountStatusError: null }),
            logout: () => set({ token: null, user: null, accountStatusError: null }),
            setAccountStatusError: (msg) => set({ accountStatusError: msg }),
            isLoggedIn: () => !!get().token,
            isAdmin: () => get().user?.quyen === 'admin',
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

interface CartItem {
    ma_CTGH: number;
    ma_sanpham: number;
    so_luong: number;
    gia_hien_tai: number;
    mau_chon?: string;
    sanpham?: { ten_sanpham: string; hinhanh?: any[] };
}

interface CartState {
    items: CartItem[];
    setCart: (items: CartItem[]) => void;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
    items: [],
    setCart: (items) => set({ items }),
    total: () => get().items.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0),
    count: () => get().items.reduce((s, i) => s + i.so_luong, 0),
}));
