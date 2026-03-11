"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Lock, ShieldCheck, KeyRound, AlertCircle, Bike } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setIsLoading(true);

        try {
            await authApi.directReset(email, newPassword);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Animated Background Elements (Sync with Login) */}
            <div className="auth-orb" style={{ top: '-10%', left: '-5%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.2) 0%, transparent 70%)' }}></div>
            <div className="auth-orb" style={{ bottom: '-15%', right: '-5%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', animationDelay: '-5s' }}></div>

            <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
                <div className="auth-form-card shadow-premium">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="reset-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
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
                                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', fontFamily: 'var(--font-outfit)' }}>Khôi phục</h1>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px', fontSize: '16px', fontWeight: 500 }}>Thiết lập mật khẩu mới cho tài khoản</p>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div className="auth-input-group">
                                        <label>Địa chỉ Email</label>
                                        <input
                                            className="auth-input"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div className="auth-input-group">
                                        <label>Mật khẩu mới</label>
                                        <input
                                            className="auth-input"
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="auth-input-group">
                                        <label>Xác nhận mật khẩu</label>
                                        <input
                                            className="auth-input"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
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
                                        disabled={isLoading}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            padding: '18px',
                                            borderRadius: '20px',
                                            fontSize: '16px',
                                            fontWeight: 800,
                                            marginTop: '12px',
                                            opacity: isLoading ? 0.7 : 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {isLoading ? (
                                            <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        ) : 'Cập nhật mật khẩu'}
                                    </button>
                                </form>

                                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                    <Link href="/auth/login" style={{ color: 'rgba(255, 255, 255, 0.3)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                        <span>← Quay lại đăng nhập</span>
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
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 32px'
                                }}>
                                    <CheckCircle2 size={40} color="#22c55e" />
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>Thành công!</h1>
                                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px', marginBottom: '40px', lineHeight: '1.6' }}>
                                    Mật khẩu của bạn đã được cập nhật thành công. Hãy đăng nhập để tiếp tục mua sắm.
                                </p>
                                <Link
                                    href="/auth/login"
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                        fontWeight: 800,
                                        display: 'block',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Đăng nhập ngay
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
