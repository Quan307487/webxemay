'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Bike, ArrowLeft, User, Mail, Lock } from 'lucide-react';

export default function AuthPage({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [form, setForm] = useState({ email: '', password: '', ten_user: '', hovaten: '', SDT: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                const res = await authApi.login({ email: form.email, password: form.password });
                if (res.data.user.quyen === 'admin') {
                    window.location.href = 'http://localhost:5173';
                } else {
                    setAuth(res.data.access_token, res.data.user);
                    router.push('/');
                }
            } else {
                const res = await authApi.register(form);
                setAuth(res.data.access_token, res.data.user);
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || (mode === 'login' ? 'Đăng nhập thất bại' : 'Đăng ký thất bại'));
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode: 'login' | 'register') => {
        if (newMode !== mode) {
            setMode(newMode);
            setError('');
            setForm({ email: '', password: '', ten_user: '', hovaten: '', SDT: '' });
        }
    };

    const isLogin = mode === 'login';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                * { box-sizing: border-box; }

                .auth-root {
                    min-height: 100vh;
                    background: #0a0a0b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    font-family: 'Inter', sans-serif;
                }

                /* ─── MAIN CARD ─── */
                .auth-card {
                    position: relative;
                    width: 100%;
                    max-width: 900px;
                    height: 580px;
                    border-radius: 28px;
                    overflow: hidden;
                    display: flex;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.06);
                    background: #111115;
                }

                /* ─── FORM HALVES ─── */
                .form-half {
                    width: 50%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 40px;
                    transition: opacity 0.4s ease 0.15s;
                    position: relative;
                }
                .form-half.register-half { border-right: 1px solid rgba(255,255,255,0.04); }
                .form-half.active   { opacity: 1; pointer-events: all; }
                .form-half.inactive { opacity: 0; pointer-events: none; }

                .form-box { width: 100%; max-width: 300px; }

                .form-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -0.04em;
                    margin: 0 0 4px;
                    line-height: 1.1;
                }

                .form-subtitle {
                    font-size: 0.65rem;
                    color: rgba(255,255,255,0.28);
                    font-weight: 600;
                    margin: 0 0 26px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .field-group { display: flex; flex-direction: column; gap: 14px; }

                .field-label {
                    font-size: 0.62rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.22);
                    text-transform: uppercase;
                    letter-spacing: 0.16em;
                    margin-bottom: 6px;
                }

                .field-wrap { position: relative; }

                .field-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.18);
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                }

                .field-input {
                    width: 100%;
                    padding: 12px 14px 12px 40px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 0.85rem;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .field-input::placeholder { color: rgba(255,255,255,0.14); }
                .field-input:focus {
                    border-color: rgba(224,0,0,0.5);
                    background: rgba(224,0,0,0.04);
                }

                .forgot-btn {
                    background: none; border: none; cursor: pointer;
                    font-size: 0.63rem; font-weight: 800;
                    color: #e00000; text-transform: uppercase; letter-spacing: 0.14em;
                    padding: 0; align-self: flex-end; transition: color 0.2s;
                    font-family: 'Inter', sans-serif;
                }
                .forgot-btn:hover { color: #fff; }

                .submit-btn {
                    width: 100%; padding: 14px; margin-top: 6px;
                    background: #e00000; border: none; border-radius: 12px;
                    color: #fff; font-size: 0.88rem; font-weight: 800;
                    letter-spacing: 0.03em; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.2s, transform 0.15s;
                }
                .submit-btn:hover:not(:disabled) { background: #ff1a1a; }
                .submit-btn:active:not(:disabled) { transform: scale(0.98); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .social-wrap { margin-top: 26px; text-align: center; }
                .social-label {
                    font-size: 0.58rem; color: rgba(255,255,255,0.1);
                    font-weight: 700; text-transform: uppercase; letter-spacing: 0.32em; margin-bottom: 14px;
                }
                .social-row { display: flex; justify-content: center; gap: 12px; }
                .social-btn {
                    width: 42px; height: 42px; border-radius: 12px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
                    color: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.3s;
                }
                .social-btn:hover {
                    color: #fff; border-color: rgba(224,0,0,0.4); background: rgba(224,0,0,0.05);
                }

                .error-box {
                    background: rgba(224,0,0,0.08); border: 1px solid rgba(224,0,0,0.2);
                    border-radius: 10px; color: #ff6b6b; font-size: 0.75rem; font-weight: 500;
                    padding: 10px 14px; margin-bottom: 16px;
                }

                /* ─── SLIDING OVERLAY PANEL ─── */
                .overlay {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 50%;
                    z-index: 10;
                    border-radius: 28px;
                    overflow: hidden;
                    transition: left 0.65s cubic-bezier(0.65, 0, 0.35, 1);
                }
                /* Login mode: panel on LEFT */
                .overlay.is-login { left: 0; }
                /* Register mode: panel on RIGHT */
                .overlay.is-register { left: 50%; }

                .overlay-bg-login {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(140deg, #e80000 0%, #b50000 55%, #7a0000 100%);
                    transition: opacity 0.3s ease;
                }
                .overlay-bg-register {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(140deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%);
                    transition: opacity 0.3s ease;
                }

                .overlay-circle-1 {
                    position: absolute; top: -80px; right: -80px;
                    width: 260px; height: 260px; border-radius: 50%;
                    background: rgba(255,255,255,0.06);
                }
                .overlay-circle-2 {
                    position: absolute; bottom: -60px; left: -60px;
                    width: 180px; height: 180px; border-radius: 50%;
                    background: rgba(0,0,0,0.14);
                }

                .overlay-inner {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 44px 36px;
                    text-align: center;
                    color: #fff;
                    z-index: 2;
                }

                .brand-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
                .brand-logo-icon {
                    width: 38px; height: 38px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.1);
                }
                .brand-logo-icon.dark {
                    background: rgba(224,0,0,0.15); border-color: rgba(224,0,0,0.25);
                }
                .brand-name { font-size: 1.35rem; font-weight: 900; letter-spacing: -0.02em; }

                .brand-heading {
                    font-size: 2.3rem; font-weight: 900;
                    line-height: 1.1; letter-spacing: -0.04em;
                    margin: 0 0 12px;
                }

                .brand-desc {
                    font-size: 0.78rem; color: rgba(255,255,255,0.6);
                    line-height: 1.65; max-width: 190px; margin: 0 0 34px;
                }

                .brand-switch-btn {
                    padding: 10px 30px;
                    border: 2px solid rgba(255,255,255,0.55);
                    border-radius: 40px; background: transparent; color: #fff;
                    font-size: 0.68rem; font-weight: 900; letter-spacing: 0.2em;
                    text-transform: uppercase; cursor: pointer;
                    font-family: 'Inter', sans-serif; transition: all 0.25s;
                }
                .brand-switch-btn:hover { background: #fff; color: #e00000; }
                .brand-switch-btn.filled {
                    background: #e00000; border-color: #e00000;
                }
                .brand-switch-btn.filled:hover { background: #ff1a1a; border-color: #ff1a1a; }

                /* Back link */
                .back-link {
                    position: fixed; bottom: 28px; left: 28px;
                    display: flex; align-items: center; gap: 8px;
                    color: rgba(255,255,255,0.2); font-size: 0.68rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none;
                    transition: color 0.2s;
                }
                .back-link:hover { color: rgba(255,255,255,0.6); }
                .back-link svg { transition: transform 0.2s; }
                .back-link:hover svg { transform: translateX(-3px); }

                /* Spinner */
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner {
                    width: 16px; height: 16px; display: inline-block;
                    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
                    border-radius: 50%; animation: spin 0.7s linear infinite;
                    vertical-align: middle;
                }
            `}</style>

            <div className="auth-root">
                <div className="auth-card">

                    {/* ── FORMS CONTAINER ── */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>

                        {/* Left Half: REGISTER form */}
                        <div className={`form-half register-half ${!isLogin ? 'active' : 'inactive'}`}>
                            <div className="form-box">
                                <h2 className="form-title">Tạo tài khoản</h2>
                                <p className="form-subtitle">Bắt đầu hành trình tốc độ của bạn</p>
                                {error && !isLogin && <div className="error-box">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="field-group">
                                        <div>
                                            <div className="field-label">Tên hiển thị</div>
                                            <div className="field-wrap">
                                                <span className="field-icon"><User size={15} /></span>
                                                <input className="field-input" type="text" placeholder="John Doe"
                                                    value={form.ten_user} onChange={e => setForm({ ...form, ten_user: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="field-label">Email</div>
                                            <div className="field-wrap">
                                                <span className="field-icon"><Mail size={15} /></span>
                                                <input className="field-input" type="email" placeholder="email@example.com"
                                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="field-label">Mật khẩu</div>
                                            <div className="field-wrap">
                                                <span className="field-icon"><Lock size={15} /></span>
                                                <input className="field-input" type="password" placeholder="Tối thiểu 6 ký tự"
                                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                            </div>
                                        </div>
                                        <button type="submit" className="submit-btn" disabled={loading}>
                                            {loading ? <span className="spinner" /> : 'Đăng ký'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Half: LOGIN form */}
                        <div className={`form-half login-half ${isLogin ? 'active' : 'inactive'}`}>
                            <div className="form-box">
                                <h2 className="form-title">Đăng nhập</h2>
                                <p className="form-subtitle">Chào mừng biker trở lại</p>
                                {error && isLogin && <div className="error-box">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="field-group">
                                        <div>
                                            <div className="field-label">Email</div>
                                            <div className="field-wrap">
                                                <span className="field-icon"><Mail size={15} /></span>
                                                <input className="field-input" type="email" placeholder="email@example.com"
                                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="field-label">Mật khẩu</div>
                                            <div className="field-wrap">
                                                <span className="field-icon"><Lock size={15} /></span>
                                                <input className="field-input" type="password" placeholder="••••••••"
                                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                            </div>
                                        </div>
                                        <button type="button" className="forgot-btn"
                                            onClick={() => router.push('/auth/forgot-password')}>
                                            Quên mật khẩu?
                                        </button>
                                        <button type="submit" className="submit-btn" disabled={loading}>
                                            {loading ? <span className="spinner" /> : 'Vào cửa hàng'}
                                        </button>
                                    </div>
                                </form>

                                <div className="social-wrap">
                                    <p className="social-label">Đăng nhập nhanh</p>
                                    <div className="social-row">
                                        <button className="social-btn"><Mail size={16} /></button>
                                        <button className="social-btn"><User size={16} /></button>
                                        <button className="social-btn">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.63 4.36 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.02-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SLIDING OVERLAY PANEL ── */}
                    <div className={`overlay ${isLogin ? 'is-login' : 'is-register'}`}>
                        {/* Login brand content (red) */}
                        <div style={{ position: 'absolute', inset: 0, opacity: isLogin ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: isLogin ? 'all' : 'none' }}>
                            <div className="overlay-bg-login" />
                            <div className="overlay-circle-1" />
                            <div className="overlay-circle-2" />
                            <div className="overlay-inner">
                                <div className="brand-logo">
                                    <div className="brand-logo-icon">
                                        <Bike size={19} color="white" />
                                    </div>
                                    <span className="brand-name brand-shimmer">MotoShop</span>
                                </div>
                                <h1 className="brand-heading">Chào bạn<br />mới đến!</h1>
                                <p className="brand-desc">Tạo tài khoản để khám phá thế giới xe phân khối lớn.</p>
                                <button className="brand-switch-btn" onClick={() => switchMode('register')}>
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>

                        {/* Register brand content (dark navy) */}
                        <div style={{ position: 'absolute', inset: 0, opacity: !isLogin ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: !isLogin ? 'all' : 'none' }}>
                            <div className="overlay-bg-register" />
                            <div className="overlay-circle-1" style={{ background: 'rgba(255,255,255,0.03)' }} />
                            <div className="overlay-circle-2" style={{ background: 'rgba(224,0,0,0.05)' }} />
                            <div className="overlay-inner">
                                <div className="brand-logo">
                                    <div className="brand-logo-icon dark">
                                        <Bike size={19} color="#e00000" />
                                    </div>
                                    <span className="brand-name">MotoShop</span>
                                </div>
                                <h1 className="brand-heading">Chào mừng<br />trở lại!</h1>
                                <p className="brand-desc">Đăng nhập để tiếp tục niềm đam mê tốc độ của bạn.</p>
                                <button className="brand-switch-btn filled" onClick={() => switchMode('login')}>
                                    Đăng nhập
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Back link */}
                <Link href="/" className="back-link">
                    <ArrowLeft size={13} />
                    Trang chủ
                </Link>
            </div>
        </>
    );
}
