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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#020617',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Masterpiece Background Architecture */}
            <div className="mesh-gradient-bg" />
            <div className="grain-overlay" />

            {/* Star Particles */}
            <div style={{ position: 'absolute', top: '15%', left: '10%', width: '2px', height: '2px', background: 'white', opacity: 0.3, borderRadius: '50%', boxShadow: '0 0 10px white' }} />
            <div style={{ position: 'absolute', bottom: '25%', right: '15%', width: '3px', height: '3px', background: 'white', opacity: 0.2, borderRadius: '50%', boxShadow: '0 0 15px white' }} />
            <div style={{ position: 'absolute', top: '40%', right: '20%', width: '1px', height: '1px', background: 'white', opacity: 0.4, borderRadius: '50%' }} />

            <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10, padding: '24px' }}>
                <div className="animate-slide-up" style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(40px)',
                    borderRadius: '40px',
                    padding: '56px 48px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    position: 'relative'
                }}>
                    {/* Layered border glow */}
                    <div style={{ position: 'absolute', inset: '-1px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', pointerEvents: 'none' }} />

                    <div className="stagger-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary), #e11d48)',
                            borderRadius: '24px',
                            padding: '16px',
                            display: 'inline-flex',
                            marginBottom: '24px',
                            boxShadow: '0 15px 35px rgba(244, 63, 94, 0.5)',
                            transform: 'rotate(-6deg)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}><Bike size={36} color="white" /></div>
                        <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.05em', fontFamily: "'Outfit', sans-serif" }}>Trang Quản Trị</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '10px', fontSize: '16px', fontWeight: 600 }}>Quản lý hệ thống MotoShop</p>
                    </div>

                    <form onSubmit={handleSubmit} className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div style={{ animationDelay: '0.1s' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Địa chỉ Email</label>
                            <input
                                className="input-breath outline-none"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1.5px solid rgba(255, 255, 255, 0.08)',
                                    color: '#ffffff',
                                    padding: '16px 24px',
                                    borderRadius: '20px',
                                    width: '100%',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    boxSizing: 'border-box',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                type="email"
                                placeholder="admin@motoshop.vn"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ animationDelay: '0.2s' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mật khẩu</label>
                            <input
                                className="input-breath outline-none"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1.5px solid rgba(255, 255, 255, 0.08)',
                                    color: '#ffffff',
                                    padding: '16px 24px',
                                    borderRadius: '20px',
                                    width: '100%',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    boxSizing: 'border-box',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-shimmer"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary), #fb7185)',
                                color: 'white',
                                padding: '20px',
                                borderRadius: '22px',
                                cursor: 'pointer',
                                fontWeight: 900,
                                fontSize: '16px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '14px',
                                boxShadow: '0 20px 40px -10px rgba(244, 63, 94, 0.5)',
                                border: 'none',
                                animationDelay: '0.3s',
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? (
                                <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>🔐 Đăng nhập hệ thống</>
                            )}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '14px', fontWeight: 600, animationDelay: '0.5s' }} className="animate-fade-in">
                    &copy; 2025 MotoShop Mastery. Bảo lưu mọi quyền.
                </p>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .btn-shimmer:hover {
                    transform: translateY(-3px) scale(1.02);
                    filter: brightness(1.1);
                    box-shadow: 0 25px 50px -10px rgba(244, 63, 94, 0.6);
                }
                .btn-shimmer:active { transform: translateY(-1px); }
            `}</style>
        </div>
    );
}
