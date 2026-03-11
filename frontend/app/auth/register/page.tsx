'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Bike, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ ten_user: '', email: '', password: '', hovaten: '', SDT: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const res = await authApi.register(form);
            setAuth(res.data.access_token, res.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Animated Background Elements */}
            <div className="auth-orb" style={{ top: '-5%', right: '-5%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)' }}></div>
            <div className="auth-orb" style={{ bottom: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)' }}></div>

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 10 }}>
                <div className="auth-form-card shadow-premium">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            background: 'var(--primary)',
                            borderRadius: '20px',
                            padding: '14px',
                            display: 'inline-flex',
                            marginBottom: '20px',
                            boxShadow: '0 10px 25px rgba(var(--primary-rgb), 0.4)',
                            transform: 'rotate(5deg)'
                        }}><Bike size={32} color="white" /></div>
                        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', fontFamily: 'var(--font-outfit)' }}>Tham gia ngay</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px', fontSize: '16px', fontWeight: 500 }}>Bắt đầu hành trình của bạn tại MotoShop</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="auth-input-group" style={{ marginBottom: 0 }}>
                                <label>Tên đăng nhập *</label>
                                <input className="auth-input" placeholder="nguyenvan123" value={form.ten_user} onChange={e => setForm({ ...form, ten_user: e.target.value })} required />
                            </div>
                            <div className="auth-input-group" style={{ marginBottom: 0 }}>
                                <label>Số điện thoại</label>
                                <input className="auth-input" type="tel" placeholder="09xxxxxxxx" value={form.SDT} onChange={e => setForm({ ...form, SDT: e.target.value })} />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <label>Địa chỉ Email *</label>
                            <input className="auth-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>

                        <div className="auth-input-group">
                            <label>Họ và tên</label>
                            <input className="auth-input" placeholder="Nguyễn Văn A" value={form.hovaten} onChange={e => setForm({ ...form, hovaten: e.target.value })} />
                        </div>

                        <div className="auth-input-group">
                            <label>Mật khẩu *</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="auth-input"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="Ít nhất 6 ký tự"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
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
                        </div>

                        {error && (
                            <div style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                border: '1px solid rgba(244, 63, 94, 0.2)',
                                borderRadius: '16px',
                                padding: '14px 20px',
                                fontSize: '14px',
                                color: '#fb7185',
                                fontWeight: 600
                            }}>{error}</div>
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
                                marginTop: '10px'
                            }}
                        >
                            {loading ? (
                                <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1.s linear infinite' }}></div>
                            ) : '🏍 Đăng ký ngay'}
                        </button>
                    </form>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '15px' }}>
                            Đã có tài khoản?{' '}
                            <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                                Đăng nhập tại đây
                            </Link>
                        </p>
                        <div style={{ marginTop: '16px' }}>
                            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.3)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                ← Quay lại trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @media (max-width: 480px) {
                    .auth-form-card { padding: 32px 24px; }
                    div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
