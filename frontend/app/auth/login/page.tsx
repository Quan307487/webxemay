'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, ArrowLeft, User, Phone, Mail, Lock } from 'lucide-react';
import ModernInput from '@/components/ui/ModernInput';
import ModernButton from '@/components/ui/ModernButton';

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

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 font-inter">

            {/* ── MAIN CARD ── */}
            <div className="relative w-full max-w-[960px] h-[600px] rounded-[32px] overflow-hidden flex shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/[0.06]">

                {/* ──────────────────────────────────────────
                    LEFT: Brand Panel (slides from left side)
                ────────────────────────────────────────── */}
                <motion.div
                    animate={{ x: mode === 'login' ? '0%' : '-100%' }}
                    transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    className="absolute inset-y-0 left-0 w-1/2 z-20 overflow-hidden"
                >
                    {/* Red background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e00000] via-[#c00000] to-[#7a0000]" />

                    {/* Subtle texture circle */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-black/10" />

                    <div className="relative h-full flex flex-col items-center justify-center p-12 text-white text-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5 mb-12">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Bike size={22} color="white" />
                            </div>
                            <span className="text-2xl font-black tracking-tight">MotoShop</span>
                        </div>

                        <h1 className="text-4xl font-black leading-tight tracking-tighter mb-4">
                            Chào bạn<br/>mới đến!
                        </h1>
                        <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-[220px]">
                            Tạo tài khoản để khám phá thế giới xe phân khối lớn.
                        </p>

                        <button
                            onClick={() => switchMode('register')}
                            className="px-8 py-3 border-2 border-white/60 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#e00000] transition-all duration-300 active:scale-95"
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                </motion.div>

                {/* ──────────────────────────────────────────
                    RIGHT: Brand Panel (slides from right, for register mode)
                ────────────────────────────────────────── */}
                <motion.div
                    animate={{ x: mode === 'register' ? '0%' : '100%' }}
                    transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    className="absolute inset-y-0 right-0 w-1/2 z-20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#1a1a2e] via-[#16213e] to-[#0f1117]" />
                    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/[0.03]" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#e00000]/5" />

                    <div className="relative h-full flex flex-col items-center justify-center p-12 text-white text-center">
                        <div className="flex items-center gap-2.5 mb-12">
                            <div className="w-10 h-10 bg-[#e00000]/20 rounded-xl flex items-center justify-center border border-[#e00000]/30">
                                <Bike size={22} className="text-[#e00000]" />
                            </div>
                            <span className="text-2xl font-black tracking-tight">MotoShop</span>
                        </div>

                        <h1 className="text-4xl font-black leading-tight tracking-tighter mb-4">
                            Chào mừng<br/>trở lại!
                        </h1>
                        <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-[220px]">
                            Đăng nhập để tiếp tục niềm đam mê tốc độ của bạn.
                        </p>

                        <button
                            onClick={() => switchMode('login')}
                            className="px-8 py-3 bg-[#e00000] rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff2020] transition-all duration-300 active:scale-95"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </motion.div>

                {/* ──────────────────────────────────────────
                    FORMS AREA (always behind the panels)
                ────────────────────────────────────────── */}
                <div className="absolute inset-0 flex bg-[#0f0f12] z-10">

                    {/* Left Half: Register Form */}
                    <div className="w-1/2 h-full flex items-center justify-center p-10 border-r border-white/5">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-[320px]"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-black text-white tracking-tighter">Tạo tài khoản</h2>
                                        <p className="text-white/30 text-xs mt-2 font-medium">Bắt đầu hành trình tốc độ của bạn</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        <ModernInput
                                            label="Tên hiển thị"
                                            icon={<User size={16} />}
                                            value={form.ten_user}
                                            onChange={e => setForm({ ...form, ten_user: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                        <ModernInput
                                            label="Email"
                                            type="email"
                                            icon={<Mail size={16} />}
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                        <ModernInput
                                            label="Mật khẩu"
                                            type="password"
                                            icon={<Lock size={16} />}
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            placeholder="Tối thiểu 6 ký tự"
                                            required
                                        />

                                        <div className="mt-4">
                                            <ModernButton type="submit" loading={loading} fullWidth size="lg">
                                                Đăng ký
                                            </ModernButton>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Half: Login Form */}
                    <div className="w-1/2 h-full flex items-center justify-center p-10">
                        <AnimatePresence mode="wait">
                            {mode === 'login' && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-[320px]"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-black text-white tracking-tighter">Đăng nhập</h2>
                                        <p className="text-white/30 text-xs mt-2 font-medium">Chào mừng biker trở lại</p>
                                    </div>

                                    {error && (
                                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        <ModernInput
                                            label="Email"
                                            type="email"
                                            icon={<Mail size={16} />}
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                        <ModernInput
                                            label="Mật khẩu"
                                            type="password"
                                            icon={<Lock size={16} />}
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />

                                        <div className="flex justify-end">
                                            <button type="button" className="text-[10px] text-[#e00000] font-black hover:text-white transition-colors tracking-widest uppercase">
                                                Quên mật khẩu?
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <ModernButton type="submit" loading={loading} fullWidth size="lg">
                                                Vào cửa hàng
                                            </ModernButton>
                                        </div>
                                    </form>

                                    <div className="mt-10 text-center">
                                        <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em] mb-6 whitespace-nowrap">Đăng nhập nhanh</p>
                                        <div className="flex justify-center gap-4">
                                            {[Mail, User, Phone].map((Icon, i) => (
                                                <button key={i} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white hover:border-[#e00000]/40 hover:bg-[#e00000]/5 transition-all duration-500">
                                                    <Icon size={18} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom back link */}
            <div className="fixed bottom-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-white/20 hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Trang chủ
                </Link>
            </div>
        </div>
    );
}
