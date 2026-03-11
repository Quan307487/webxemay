'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Bike, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const res = await authApi.login(form);
            if (res.data.user.quyen === 'admin') {
                // Đừng gọi setAuth() cho admin — sẽ ghi đè token của user đang đăng nhập!
                // Admin chỉ cần điều hướng sang trang admin, không lưu vào frontend store.
                window.location.href = 'http://localhost:5173';
            } else {
                setAuth(res.data.access_token, res.data.user);
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Animated Background Elements */}
            <div className="auth-orb" style={{ top: '-10%', left: '-5%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.2) 0%, transparent 70%)' }}></div>
            <div className="auth-orb" style={{ bottom: '-15%', right: '-5%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', animationDelay: '-5s' }}></div>

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
                <div className="auth-form-card shadow-premium">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            background: 'var(--primary)',
                            borderRadius: '20px',
                            padding: '14px',
                            display: 'inline-flex',
                            marginBottom: '20px',
                            boxShadow: '0 10px 25px rgba(var(--primary-rgb), 0.4)',
                            transform: 'rotate(-5deg)'
                        }}><Bike size={32} color="white" /></div>
                        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', fontFamily: 'var(--font-outfit)' }}>Đăng nhập</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px', fontSize: '16px', fontWeight: 500 }}>Chào mừng bạn quay lại MotoShop</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="auth-input-group">
                            <label>Địa chỉ Email</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <label>Mật khẩu</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="auth-input"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    style={{ paddingRight: '56px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.3)',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        display: 'flex'
                                    }}
                                >
                                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '12px' }}>
                                <Link
                                    href="/auth/forgot-password"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--rose-500)'}
                                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid rgba(244, 63, 94, 0.2)',
                                borderRadius: '16px',
                                padding: '14px 20px',
                                fontSize: '14px',
                                color: '#fb7185',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{ width: '6px', height: '6px', background: '#fb7185', borderRadius: '50%' }}></div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: '20px',
                                fontSize: '16px',
                                fontWeight: 800,
                                marginTop: '12px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1.s linear infinite' }}></div>
                            ) : 'Đăng nhập ngay'}
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '15px' }}>
                            Chưa có tài khoản?{' '}
                            <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                                Đăng ký miễn phí
                            </Link>
                        </p>
                        <div style={{ marginTop: '24px' }}>
                            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.3)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <span>← Quay lại trang chủ</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: '32px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
                    &copy; 2025 MotoShop Vietnam. Bản quyền thuộc về Team.
                </p>
            </div>

            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
