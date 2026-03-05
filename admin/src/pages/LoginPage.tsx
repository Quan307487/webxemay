import { useState } from 'react';
import { authApi } from '../lib/api';
import { Bike } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        try {
            const res = await authApi.login(form);
            if (res.data.user.quyen !== 'admin') {
                toast.error('Chỉ tài khoản admin mới được truy cập');
                setLoading(false);
                return;
            }
            localStorage.setItem('admin_token', res.data.access_token);
            localStorage.setItem('admin_user', JSON.stringify(res.data.user));
            toast.success('Đăng nhập thành công!');
            window.location.href = '/'; // Force re-render để ProtectedRoute đọc token mới
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
            <div style={{ width: '100%', maxWidth: '380px', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: '#e63946', borderRadius: '12px', padding: '12px', display: 'inline-flex', marginBottom: '16px' }}><Bike size={32} color="white" /></div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9' }}>Admin Panel</h1>
                    <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '14px' }}>MotoShop Management</p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Email admin</label>
                        <input style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', padding: '12px 16px', borderRadius: '8px', width: '100%', fontSize: '14px', boxSizing: 'border-box' }} type="email" placeholder="admin@motoshop.vn" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Mật khẩu</label>
                        <input style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', padding: '12px 16px', borderRadius: '8px', width: '100%', fontSize: '14px', boxSizing: 'border-box' }} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
                        {loading ? 'Đang đăng nhập...' : '🔐 Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
