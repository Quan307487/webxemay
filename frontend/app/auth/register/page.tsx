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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '24px' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: 'var(--primary)', borderRadius: '12px', padding: '12px', display: 'inline-flex', marginBottom: '16px' }}><Bike size={32} color="white" /></div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Tạo tài khoản</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tham gia MotoShop ngay hôm nay</p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                        { label: 'Tên đăng nhập *', key: 'ten_user', type: 'text', ph: 'VD: nguyenvan123' },
                        { label: 'Email *', key: 'email', type: 'email', ph: 'email@example.com' },
                        { label: 'Họ và tên', key: 'hovaten', type: 'text', ph: 'Nguyễn Văn A' },
                        { label: 'Số điện thoại', key: 'SDT', type: 'tel', ph: '0912345678' },
                    ].map(({ label, key, type, ph }) => (
                        <div key={key}>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>{label}</label>
                            <input className="input-field" type={type} placeholder={ph} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key === 'ten_user' || key === 'email'} />
                        </div>
                    ))}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Mật khẩu *</label>
                        <div style={{ position: 'relative' }}>
                            <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Ít nhất 6 ký tự" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} style={{ paddingRight: '44px' }} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && <div style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px', padding: '12px', fontSize: '14px', color: 'var(--primary)' }}>{error}</div>}
                    <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', opacity: loading ? 0.7 : 1, marginTop: '4px' }}>
                        {loading ? 'Đang tạo tài khoản...' : '🏍 Đăng ký ngay'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Đã có tài khoản? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
