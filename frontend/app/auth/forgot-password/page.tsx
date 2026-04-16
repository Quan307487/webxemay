"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Lock, Bike, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const { add: addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            const msg = 'Mật khẩu xác nhận không khớp.';
            setError(msg);
            addToast(msg, 'error');
            return;
        }

        if (newPassword.length < 6) {
            const msg = 'Mật khẩu phải có ít nhất 6 ký tự.';
            setError(msg);
            addToast(msg, 'error');
            return;
        }

        setIsLoading(true);

        try {
            await authApi.directReset(email, newPassword);
            setIsSuccess(true);
            addToast('Cập nhật mật khẩu thành công!', 'success');
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMsg);
            addToast(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #fdf2f8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background shapes */}
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Card container */}
            <div style={{
                width: '100%',
                maxWidth: '960px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: '0 32px 80px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* LEFT PANEL - Brand Info */}
                <div style={{
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
                    padding: '64px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Orbs in left panel */}
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Logo */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
                            <div style={{ background: 'var(--primary)', borderRadius: '16px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(244,63,94,0.4)', transform: 'rotate(-5deg)' }}>
                                <Bike size={24} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '26px', color: 'white', letterSpacing: '-0.5px' }}>MotoShop</span>
                        </Link>

                        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.2 }}>
                            Khôi phục<br />
                            <span style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Tài khoản
                            </span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.7 }}>
                            Đặt lại mật khẩu của bạn chỉ trong vài bước đơn giản và quay lại trải nghiệm mua sắm ngay.
                        </p>
                    </div>

                    {/* Feature cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                        {[
                            { icon: <ShieldCheck size={18} />, title: 'Bảo mật cao', desc: 'Mã hóa dữ liệu end-to-end' },
                            { icon: <KeyRound size={18} />, title: 'Khôi phục nhanh', desc: 'Thiết lập mật khẩu mới ngay lập tức' },
                            { icon: <Lock size={18} />, title: 'Tài khoản an toàn', desc: 'Thông tin được bảo vệ tuyệt đối' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185', flexShrink: 0 }}>{item.icon}</div>
                                <div>
                                    <p style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{item.title}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL - Form */}
                <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="reset-form"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Header */}
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '8px 16px', marginBottom: '24px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Đặt lại mật khẩu</span>
                                    </div>
                                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', fontFamily: 'Outfit, sans-serif', marginBottom: '10px' }}>
                                        Tạo mật khẩu mới
                                    </h1>
                                    <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
                                        Nhập email và mật khẩu mới của bạn để khôi phục tài khoản.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* Email */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Địa chỉ Email
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px 14px 46px',
                                                    borderRadius: '14px',
                                                    border: '1.5px solid #e2e8f0',
                                                    background: '#f8fafc',
                                                    color: '#0f172a',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    transition: 'all 0.2s',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(244,63,94,0.08)'; e.target.style.background = 'white'; }}
                                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                            />
                                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Mật khẩu mới
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPwd ? 'text' : 'password'}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Tối thiểu 6 ký tự"
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 48px 14px 46px',
                                                    borderRadius: '14px',
                                                    border: '1.5px solid #e2e8f0',
                                                    background: '#f8fafc',
                                                    color: '#0f172a',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    transition: 'all 0.2s',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(244,63,94,0.08)'; e.target.style.background = 'white'; }}
                                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                            />
                                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Xác nhận mật khẩu
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showConfirmPwd ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Nhập lại mật khẩu mới"
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 48px 14px 46px',
                                                    borderRadius: '14px',
                                                    border: `1.5px solid ${confirmPassword && confirmPassword !== newPassword ? '#ef4444' : '#e2e8f0'}`,
                                                    background: '#f8fafc',
                                                    color: '#0f172a',
                                                    fontSize: '15px',
                                                    outline: 'none',
                                                    transition: 'all 0.2s',
                                                    boxSizing: 'border-box'
                                                }}
                                                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(244,63,94,0.08)'; e.target.style.background = 'white'; }}
                                                onBlur={e => { e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword ? '#ef4444' : '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                            />
                                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                                                {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {confirmPassword && confirmPassword !== newPassword && (
                                            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>Mật khẩu không khớp</p>
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '14px 18px', fontSize: '14px', color: '#e11d48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '6px', height: '6px', background: '#e11d48', borderRadius: '50%', flexShrink: 0 }} />
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                                            color: 'white',
                                            border: 'none',
                                            fontSize: '16px',
                                            fontWeight: 800,
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            boxShadow: isLoading ? 'none' : '0 8px 20px rgba(244,63,94,0.3)',
                                            transition: 'all 0.25s',
                                            letterSpacing: '0.3px',
                                            marginTop: '4px'
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTop: '2.5px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                Đang xử lý...
                                            </>
                                        ) : 'Cập nhật mật khẩu'}
                                    </button>
                                </form>

                                {/* Back to login */}
                                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                                    <Link href="/auth/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
                                        <ArrowLeft size={16} />
                                        Quay lại đăng nhập
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', padding: '20px 0' }}
                            >
                                <div style={{ width: '88px', height: '88px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 12px 30px rgba(34,197,94,0.2)' }}>
                                    <CheckCircle2 size={44} color="#16a34a" />
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>Thành công! 🎉</h1>
                                <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px', lineHeight: 1.7 }}>
                                    Mật khẩu của bạn đã được cập nhật thành công.<br />Hãy đăng nhập để tiếp tục mua sắm.
                                </p>
                                <Link
                                    href="/auth/login"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                                        color: 'white',
                                        textDecoration: 'none',
                                        fontWeight: 800,
                                        fontSize: '16px',
                                        textAlign: 'center',
                                        boxShadow: '0 8px 20px rgba(244,63,94,0.3)'
                                    }}
                                >
                                    Đăng nhập ngay →
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer note */}
                    <p style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '13px' }}>
                        © 2025 MotoShop Vietnam. Bản quyền thuộc về Team.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .forgot-grid { grid-template-columns: 1fr !important; }
                    .forgot-left { display: none !important; }
                }
            `}</style>
        </div>
    );
}
