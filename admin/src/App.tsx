import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import ReviewsPage from './pages/ReviewsPage';
import InventoryPage from './pages/InventoryPage';
import CouponsPage from './pages/CouponsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';


// Nhận token từ URL param (do user login page gửi sang qua redirect)
function extractTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('admin_token');
  const user = params.get('admin_user');
  if (token && user) {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', user);
    // Xóa params khỏi URL để URL sạch hơn
    window.history.replaceState({}, '', '/');
  }
}
extractTokenFromUrl();

// Redirect to shared user login page if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = 'http://localhost:3000/auth/login';
    return null;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />
      <Routes>
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
