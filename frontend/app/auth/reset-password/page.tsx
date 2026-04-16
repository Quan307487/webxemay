'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Bike, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [showPw, setShowPw] = useState(false);
    const { add: addToast } = useToast();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Mã xác thực không hợp lệ hoặc đã hết hạn.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            const msg = 'Mật khẩu xác nhận không khớp.';
            setStatus('error');
            setMessage(msg);
            addToast(msg, 'error');
            return;
        }

        setStatus('loading');
        try {
            await authApi.resetPassword(token!, form.password);
            setStatus('success');
            addToast('Mật khẩu của bạn đã được cập nhật!', 'success');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
            setStatus('error');
            setMessage(errorMsg);
            addToast(errorMsg, 'error');
        }
    };

    if (!token && status !== 'success') {
        return (
            <div className="auth-page-wrapper">
                <div className="auth-form-card shadow-premium" style={{ maxWidth: '440px', textAlign: 'center' }}>
                    <AlertCircle size={48} color="#fb7185" style={{ marginBottom: '16px' }} />
                    <h2 style={{ color: '#ffffff', marginBottom: '12px' }}>Lỗi xác thực</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>{message}</p>
                    <Link href="/auth/login" className="btn-primary" style={{ padding: '14px 28px', borderRadius: '16px', textDecoration: 'none', fontWeight: 700 }}>
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-wrapper">
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
                        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', fontFamily: 'var(--font-outfit)' }}>Đặt lại mật khẩu</h1>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
                            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '24px',
                                padding: '32px',
                                marginBottom: '32px'
                            }}>
                                <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '16px' }} />
                                <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Thành công!</h3>
                                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                                    Mật khẩu của bạn đã được cập nhật.
                                </p>
                            </div>
                            <Link href="/auth/login" className="btn-primary" style={{ display: 'block', padding: '18px', borderRadius: '20px', textDecoration: 'none', fontWeight: 800, fontSize: '16px' }}>
                                Đăng nhập ngay
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="auth-input-group">
                                <label>Mật khẩu mới</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="auth-input"
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                        style={{ paddingLeft: '48px', paddingRight: '56px' }}
                                    />
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.3)' }} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                                    >
                                        {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label>Xác nhận mật khẩu</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="auth-input"
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.confirmPassword}
                                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                        required
                                        style={{ paddingLeft: '48px', paddingRight: '56px' }}
                                    />
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.3)' }} />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div style={{
                                    background: 'rgba(244, 63, 94, 0.1)',
                                    border: '1px solid rgba(244, 63, 94, 0.2)',
                                    borderRadius: '16px',
                                    padding: '14px 20px',
                                    fontSize: '14px',
                                    color: '#fb7185',
                                    fontWeight: 600
                                }}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    borderRadius: '20px',
                                    fontSize: '16px',
                                    fontWeight: 800,
                                    opacity: status === 'loading' ? 0.7 : 1
                                }}
                            >
                                {status === 'loading' ? (
                                    <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                ) : 'Cập nhật mật khẩu'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
