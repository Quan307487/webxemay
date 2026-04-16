'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Bike, User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/Toast';
import Image from 'next/image';

export default function AuthPage({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const { add: addToast } = useToast();
    const [isSignUpMode, setIsSignUpMode] = useState(initialMode === 'register');
    const [form, setForm] = useState({ email: '', password: '', ten_user: '', hovaten: '', SDT: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            if (!isSignUpMode) {
                const res = await authApi.login({ email: form.email, password: form.password });
                if (res.data.user.quyen === 'admin') {
                    // localStorage không chia sẻ giữa các origin khác port
                    // → truyền token qua URL query param để admin app lưu lại
                    addToast('Đăng nhập admin thành công! Đang chuyển hướng... 🛡️', 'success');
                    setSuccess('Đang chuyển hướng đến trang quản trị...');
                    const params = new URLSearchParams({
                        admin_token: res.data.access_token,
                        admin_user: JSON.stringify(res.data.user),
                    });
                    setTimeout(() => {
                        window.location.href = `http://localhost:5173/?${params.toString()}`;
                    }, 1000);
                } else {
                    setAuth(res.data.access_token, res.data.user);
                    addToast('Đăng nhập thành công! Chào mừng trở lại 👋', 'success');
                    setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                    setTimeout(() => { router.push('/'); }, 800);
                }
            } else {
                const res = await authApi.register(form);
                setAuth(res.data.access_token, res.data.user);
                addToast('Đăng ký tài khoản thành công! 🎉', 'success');
                setSuccess('Đăng ký thành công! Đang về trang chủ...');
                setTimeout(() => { router.push('/'); }, 800);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || (!isSignUpMode ? 'Đăng nhập thất bại' : 'Đăng ký thất bại');
            setError(errorMsg);
            addToast(errorMsg, 'error');
        } finally { setLoading(false); }
    };

    const toggle = () => {
        setIsSignUpMode(p => !p);
        setError(''); setSuccess('');
        setForm({ email: '', password: '', ten_user: '', hovaten: '', SDT: '' });
        setShowPwd(false);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .auth-wrap {
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    background: white;
                    overflow: hidden;
                }

                /* ============================================================
                   THE GIANT ROLLING CIRCLE (::before pseudo-element technique)
                   - Width/Height huge so it covers half the screen visually
                   - Positioned on the LEFT during sign-in, moves RIGHT on sign-up
                ============================================================ */
                .auth-wrap::before {
                    content: '';
                    position: absolute;
                    width: 2000px;
                    height: 2000px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%);
                    top: -10%;
                    right: 48%;
                    z-index: 6;
                    transform: translateY(-50%);
                    transition: all 1.8s cubic-bezier(0.65, 0, 0.35, 1);
                }
                /* Sign-up mode: circle rolls to the right */
                .auth-wrap.signup-mode::before {
                    transform: translateY(-50%) translateX(100%);
                    right: 52%;
                }

                /* ============================================================
                   FORM CONTAINER - slides left/right with the circle
                ============================================================ */
                .forms-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0; left: 0;
                }
                .signin-signup {
                    position: absolute;
                    top: 50%;
                    left: 75%;
                    transform: translate(-50%, -50%);
                    width: 50%;
                    display: grid;
                    grid-template-columns: 1fr;
                    z-index: 5;
                    transition: left 0.8s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.3s;
                }
                .auth-wrap.signup-mode .signin-signup {
                    left: 25%;
                }

                /* Individual form panels stack in same grid cell */
                .sign-in-form,
                .sign-up-form {
                    grid-column: 1;
                    grid-row: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 40px;
                    transition: opacity 0.15s ease 0.7s;
                }
                .sign-in-form { z-index: 2; opacity: 1; }
                .sign-up-form { z-index: 1; opacity: 0; }
                .auth-wrap.signup-mode .sign-in-form { opacity: 0; z-index: 1; }
                .auth-wrap.signup-mode .sign-up-form { opacity: 1; z-index: 2; }

                .form-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: -0.04em;
                    margin-bottom: 8px;
                    text-align: center;
                }
                .form-subtitle {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    font-weight: 600;
                    margin-bottom: 28px;
                    text-align: center;
                    letter-spacing: 0.02em;
                }

                .input-field {
                    position: relative;
                    margin-bottom: 14px;
                    width: 100%;
                }
                .input-field label {
                    display: block;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 6px;
                }
                .input-field .icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #cbd5e1;
                    display: flex;
                    align-items: center;
                    pointer-events: none;
                    margin-top: 10px;
                }
                .input-field .eye-btn {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #cbd5e1;
                    display: flex;
                    align-items: center;
                    padding: 0;
                    margin-top: 10px;
                    transition: color 0.2s;
                }
                .input-field .eye-btn:hover { color: #94a3b8; }
                .input-field input {
                    width: 100%;
                    padding: 12px 42px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 0.88rem;
                    color: #0f172a;
                    background: #f8fafc;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
                .input-field input::placeholder { color: #cbd5e1; }
                .input-field input:focus {
                    border-color: #f43f5e;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(244,63,94,0.08);
                }

                .forgot-link {
                    align-self: flex-end;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #f43f5e;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    text-decoration: none;
                    margin-bottom: 6px;
                    transition: color 0.2s;
                }
                .forgot-link:hover { color: #e11d48; }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.92rem;
                    font-weight: 800;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.25s;
                    box-shadow: 0 6px 18px rgba(244,63,94,0.28);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 4px;
                }
                .submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
                    box-shadow: 0 8px 24px rgba(244,63,94,0.38);
                    transform: translateY(-1px);
                }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .alert-box {
                    width: 100%;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    margin-bottom: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .alert-error  { background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; }
                .alert-success{ background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }

                /* ============================================================
                   PANELS - Left and Right info sections with images
                ============================================================ */
                .panels-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0; left: 0;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                }
                .panel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    z-index: 6;
                    padding: 40px;
                    gap: 30px;
                }
                .panel.right-panel {
                    align-items: center;
                    padding: 40px;
                }

                .panel-content {
                    color: white;
                    transition: transform 0.9s ease-in-out 0.4s, opacity 0.5s ease 0.4s;
                }
                .panel.left-panel .panel-content {
                    transform: translateX(0);
                    opacity: 1;
                }
                .auth-wrap.signup-mode .panel.left-panel .panel-content {
                    transform: translateX(-800px);
                    opacity: 0;
                }
                .panel.right-panel .panel-content {
                    transform: translateX(800px);
                    opacity: 0;
                }
                .auth-wrap.signup-mode .panel.right-panel .panel-content {
                    transform: translateX(0);
                    opacity: 1;
                }

                .panel-img {
                    width: 100%;
                    max-width: 300px;
                    transition: transform 1.1s ease-in-out 0.4s, opacity 0.5s ease 0.4s;
                    filter: drop-shadow(0 12px 24px rgba(0,0,0,0.2));
                }
                .panel.left-panel .panel-img {
                    transform: translateX(0);
                    opacity: 1;
                }
                .auth-wrap.signup-mode .panel.left-panel .panel-img {
                    transform: translateX(-800px);
                    opacity: 0;
                }
                .panel.right-panel .panel-img {
                    transform: translateX(800px);
                    opacity: 0;
                }
                .auth-wrap.signup-mode .panel.right-panel .panel-img {
                    transform: translateX(0);
                    opacity: 1;
                }

                .panel h3 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 2.8rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 20px;
                    line-height: 1.1;
                    letter-spacing: -0.04em;
                }
                .panel p {
                    font-size: 1.1rem;
                    color: rgba(255,255,255,0.85);
                    line-height: 1.6;
                    margin-bottom: 40px;
                    max-width: 380px;
                }
                .panel-btn {
                    padding: 16px 48px;
                    border: 2px solid rgba(255,255,255,0.8);
                    border-radius: 50px;
                    background: transparent;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 900;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.25s;
                }
                .panel-btn:hover {
                    background: rgba(255,255,255,0.18);
                    border-color: white;
                    transform: translateY(-2px);
                }

                /* Logo brand */
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 36px;
                    color: white;
                    text-decoration: none;
                }
                .brand-icon {
                    width: 40px; height: 40px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.2);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .brand-name {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.4rem;
                    font-weight: 900;
                    letter-spacing: -0.02em;
                }

                /* Spinner */
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner {
                    width: 18px; height: 18px; border-radius: 50%;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    animation: spin 0.7s linear infinite;
                }

                /* Back home link */
                .back-home {
                    position: fixed;
                    bottom: 24px; left: 24px;
                    display: flex; align-items: center; gap: 8px;
                    font-size: 0.7rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.12em;
                    color: rgba(255,255,255,0.5);
                    text-decoration: none;
                    transition: color 0.2s;
                    z-index: 20;
                }
                .back-home:hover { color: white; }
                .back-home svg { transition: transform 0.2s; }
                .back-home:hover svg { transform: translateX(-3px); }
            `}</style>

            <div className={`auth-wrap${isSignUpMode ? ' signup-mode' : ''}`}>

                {/* ── FORMS CONTAINER ──*/}
                <div className="forms-container">
                    <div className="signin-signup">
                        {/* Sign In Form */}
                        <form className="sign-in-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">Đăng nhập</h2>
                            <p className="form-subtitle">Chào mừng biker trở lại! 👋</p>

                            {error && !isSignUpMode && <div className="alert-box alert-error"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', flexShrink: 0, display: 'inline-block' }} />{error}</div>}
                            {success && !isSignUpMode && <div className="alert-box alert-success"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', flexShrink: 0, display: 'inline-block' }} />{success}</div>}

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Email</label>
                                <span className="icon"><Mail size={15} /></span>
                                <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </div>

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Mật khẩu</label>
                                <span className="icon"><Lock size={15} /></span>
                                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '42px' }} />
                                <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)} style={{ top: 'calc(50% + 10px)' }}>
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            <Link href="/auth/forgot-password" className="forgot-link" style={{ display: 'block', textAlign: 'right', width: '100%', maxWidth: '340px', marginBottom: '16px' }}>
                                Quên mật khẩu?
                            </Link>

                            <button type="submit" className="submit-btn" disabled={loading} style={{ maxWidth: '340px', width: '100%' }}>
                                {loading ? <span className="spinner" /> : 'Vào cửa hàng →'}
                            </button>
                        </form>

                        {/* Sign Up Form */}
                        <form className="sign-up-form" onSubmit={handleSubmit}>
                            <h2 className="form-title">Tạo tài khoản</h2>
                            <p className="form-subtitle">Bắt đầu hành trình tốc độ của bạn 🏍</p>

                            {error && isSignUpMode && <div className="alert-box alert-error"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', flexShrink: 0, display: 'inline-block' }} />{error}</div>}
                            {success && isSignUpMode && <div className="alert-box alert-success"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', flexShrink: 0, display: 'inline-block' }} />{success}</div>}

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Tên hiển thị</label>
                                <span className="icon"><User size={15} /></span>
                                <input type="text" placeholder="Nguyễn Văn A" value={form.ten_user} onChange={e => setForm({ ...form, ten_user: e.target.value })} required />
                            </div>

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Email</label>
                                <span className="icon"><Mail size={15} /></span>
                                <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </div>

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Số điện thoại</label>
                                <span className="icon"><Phone size={15} /></span>
                                <input type="tel" placeholder="0xxxxxxxxx" value={form.SDT} onChange={e => setForm({ ...form, SDT: e.target.value })} />
                            </div>

                            <div className="input-field" style={{ width: '100%', maxWidth: '340px' }}>
                                <label>Mật khẩu</label>
                                <span className="icon"><Lock size={15} /></span>
                                <input type={showPwd ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '42px' }} />
                                <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)} style={{ top: 'calc(50% + 10px)' }}>
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading} style={{ maxWidth: '340px', width: '100%' }}>
                                {loading ? <span className="spinner" /> : 'Tạo tài khoản'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── PANELS (Info + Image + Switch Button) ── */}
                <div className="panels-container">
                    {/* Left Panel: shown during Sign In, asks to Sign Up */}
                    <div className="panel left-panel" style={{ pointerEvents: isSignUpMode ? 'none' : 'auto' }}>
                        <div className="panel-content">
                            <Link href="/" className="brand">
                                <div className="brand-icon"><Bike size={22} color="white" /></div>
                                <span className="brand-name">MotoShop</span>
                            </Link>
                            <h3>Chưa có<br />tài khoản?</h3>
                            <p>Đăng ký miễn phí để khám phá hàng trăm mẫu xe và nhận ưu đãi độc quyền.</p>
                            <button className="panel-btn" onClick={toggle}>Đăng ký ngay</button>
                        </div>
                    </div>

                    {/* Right Panel: shown during Sign Up, asks to Sign In */}
                    <div className="panel right-panel" style={{ pointerEvents: isSignUpMode ? 'auto' : 'none' }}>
                        <div className="panel-content" style={{ transform: isSignUpMode ? 'translateX(0)' : 'translateX(800px)', opacity: isSignUpMode ? 1 : 0 }}>
                            <Link href="/" className="brand">
                                <div className="brand-icon" style={{ background: 'rgba(244,63,94,0.2)', borderColor: 'rgba(244,63,94,0.35)' }}>
                                    <Bike size={22} color="#f43f5e" />
                                </div>
                                <span className="brand-name">MotoShop</span>
                            </Link>
                            <h3>Đã có<br />tài khoản?</h3>
                            <p>Đăng nhập để tiếp tục niềm đam mê tốc độ và theo dõi đơn hàng của bạn.</p>
                            <button className="panel-btn" onClick={toggle}>Đăng nhập</button>
                        </div>
                    </div>
                </div>

                {/* Back home link */}
                <Link href="/" className="back-home">
                    <ArrowLeft size={13} />
                    Về trang chủ
                </Link>
            </div>
        </>
    );
}
