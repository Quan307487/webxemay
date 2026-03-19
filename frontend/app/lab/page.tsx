'use client';

import React, { useState } from 'react';
import ModernInput from '@/components/ui/ModernInput';
import ModernButton from '@/components/ui/ModernButton';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function UIComponentLab() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 md:p-24 font-inter">
            <div className="max-w-4xl mx-auto space-y-24">
                
                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff2d55]/10 border border-[#ff2d55]/20 rounded-full">
                        <Sparkles size={14} className="text-[#ff2d55]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff2d55]">Design System Lab</span>
                    </div>
                    <h1 className="text-5xl font-black font-outfit tracking-tight">MotoShop <span className="text-[#ff2d55]">UI Components</span></h1>
                    <p className="text-slate-400 max-w-xl text-lg font-medium">
                        Dưới đây là bộ thư viện UI thế hệ mới, được tối ưu cho tốc độ và trải nghiệm cao cấp.
                    </p>
                </div>

                {/* Input Fields Section */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 h-1 bg-[#ff2d55]"></div>
                        <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">Input Fields</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Normal State */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Normal & Floating Label</h3>
                            <ModernInput 
                                label="Địa chỉ Email" 
                                icon={<Mail size={20} />} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />
                            <ModernInput 
                                label="Họ và tên" 
                                icon={<User size={20} />} 
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        {/* Password & Error */}
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Password & Error State</h3>
                            <ModernInput 
                                label="Mật khẩu" 
                                type="password"
                                icon={<Lock size={20} />} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <ModernInput 
                                label="Số điện thoại" 
                                icon={<Phone size={20} />} 
                                error="Số điện thoại không hợp lệ!"
                                defaultValue="0123 456 78"
                            />
                        </div>
                    </div>
                </section>

                {/* Buttons Section */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 h-1 bg-[#ff2d55]"></div>
                        <h2 className="text-2xl font-bold font-outfit uppercase tracking-wider">Modern Buttons</h2>
                    </div>

                    <div className="space-y-12">
                        {/* Primary Buttons */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Primary Actions</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <ModernButton onClick={toggleLoading} loading={loading}>
                                    Đăng nhập ngay
                                </ModernButton>
                                <ModernButton size="lg" icon={<ArrowRight size={20} />}>
                                    Khám phá ngay
                                </ModernButton>
                                <ModernButton variant="secondary">
                                    Hủy bỏ
                                </ModernButton>
                            </div>
                        </div>

                        {/* Sizes & Variants */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Variants & Sizes</h3>
                            <div className="flex flex-wrap gap-6 items-end">
                                <ModernButton variant="outline" size="sm">Small Outline</ModernButton>
                                <ModernButton variant="ghost" size="md">Ghost Button</ModernButton>
                                <ModernButton variant="secondary" size="lg">Large Secondary</ModernButton>
                                <ModernButton size="xl">Extra Large</ModernButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Back Link */}
                <div className="pt-12 border-t border-white/5">
                    <Link href="/auth/login" className="text-[#ff2d55] font-black hover:underline flex items-center gap-2">
                        ← Trải nghiệm trên trang Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
