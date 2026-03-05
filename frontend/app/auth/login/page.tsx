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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '24px' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: 'var(--primary)', borderRadius: '12px', padding: '12px', display: 'inline-flex', marginBottom: '16px' }}><Bike size={32} color="white" /></div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Đăng nhập</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Chào mừng trở lại MotoShop</p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Email</label>
                        <input className="input-field" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Mật khẩu</label>
                        <div style={{ position: 'relative' }}>
                            <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '44px' }} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && <div style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', padding: '12px', fontSize: '14px', color: 'var(--primary)' }}>{error}</div>}
                    <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Chưa có tài khoản? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký ngay</Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)' }}>← Về trang chủ</Link>
                </p>
            </div>
        </div>
    );
}
