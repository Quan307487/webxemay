'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bike, Phone, Mail, MapPin, Facebook, Youtube, Instagram, ArrowUpRight, MessageCircle } from 'lucide-react';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { settingsApi } = await import('@/lib/api');
                const res = await settingsApi.get();
                setSettings(res.data);
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        };
        fetchSettings();
    }, []);

    const socialLinks = [
        { Icon: Facebook, href: settings?.facebook_url || 'https://www.facebook.com/share/1C6edfa7SN/', label: 'Facebook', color: '#1877F2' },
        { Icon: Youtube, href: settings?.youtube_url || 'https://youtube.com/@quanbui2507?si=4WSTdar01MDoCAyE', label: 'Youtube', color: '#FF0000' },
        { Icon: Instagram, href: settings?.instagram_url || 'https://www.instagram.com/direct/inbox/', label: 'Instagram', color: '#E1306C' },
        { Icon: MessageCircle, href: settings?.zalo_url || 'https://zalo.me/0339886769', label: 'Zalo', color: '#0068ff' },
    ];

    const contactInfo = [
        { Icon: Phone, text: settings?.phone || '0339886769', sub: 'Hỗ trợ khách hàng 24/7', color: '#4ade80' },
        { Icon: Mail, text: settings?.email || 'buiminhquan12082003@gmail.com', sub: 'Hợp tác & Phản hồi', color: '#60a5fa' },
        { Icon: MapPin, text: settings?.address || 'Thôn An Hòa, Xã Tam An, TP.Đà Nẵng', sub: 'Cửa hàng chính & Văn phòng', color: '#f87171' },
    ];

    return (
        <footer className="site-footer" style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/* Background decorative elements */}
            <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px 40px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '64px' }}>

                    {/* Brand & Mission */}
                    <div style={{ gridColumn: 'span 1.5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary), #991b1b)',
                                borderRadius: '16px',
                                padding: '12px',
                                display: 'flex',
                                boxShadow: '0 10px 30px rgba(230,57,70,0.4)',
                                transform: 'rotate(-5deg)'
                            }}>
                                <Bike size={24} color="white" />
                            </div>
                            <span className="brand-shimmer" style={{
                                fontWeight: 900,
                                fontSize: '28px',
                                fontFamily: 'Outfit, sans-serif',
                                letterSpacing: '-1px'
                            }}>
                                {settings?.site_name || 'MotoShop'}</span><span style={{ color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)', fontWeight: 900, fontSize: '28px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>.</span>
                        </div>

                        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '380px' }}>
                            Trải nghiệm hệ sinh thái xe máy điện và động cơ đốt trong hàng đầu Việt Nam. Tận hưởng đặc quyền mua sắm cao cấp với dịch vụ hậu mãi 5 sao.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                            {socialLinks.map(({ Icon, href, label, color }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: 'rgba(255,255,255,0.02)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = `${color}`;
                                        el.style.background = `${color}`;
                                        el.style.color = 'white';
                                        el.style.transform = 'translateY(-5px) scale(1.1)';
                                        el.style.boxShadow = `0 10px 20px ${color}40`;
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = 'rgba(255,255,255,0.08)';
                                        el.style.background = 'rgba(255,255,255,0.02)';
                                        el.style.color = '#94a3b8';
                                        el.style.transform = 'translateY(0) scale(1)';
                                        el.style.boxShadow = 'none';
                                    }}>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>

                        {/* Premium Trust Pillars */}
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {[
                                { t: '100%', s: 'Chính Hãng' },
                                { t: '24/7', s: 'Tận Tâm' },
                                { t: 'Free', s: 'Vận Chuyển' }
                            ].map((p, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'white', fontWeight: 800, fontSize: '16px', fontFamily: 'Outfit' }}>{p.t}</span>
                                    <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', gridColumn: 'span 1' }}>
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '13px', color: 'white', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Outfit' }}>Sản Phẩm</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    ['Xe Tay Ga Thời Thượng', '/products?kieu_xe=xe_ga'],
                                    ['Xe Số Bền Bỉ', '/products?kieu_xe=xe_so'],
                                    ['PKL & Thể Thao', '/products?kieu_xe=phan_khoi_lon'],
                                    ['Kỷ Nguyên Xe Điện', '/products?kieu_xe=xe_dien'],
                                    ['Phụ Kiện Chính Hãng', '/accessories'],
                                ].map(([label, href]) => (
                                    <li key={label}>
                                        <Link href={href} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0px', fontWeight: 500 }}
                                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.paddingLeft = '10px'; el.style.fontSize = '14.5px'; }}
                                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#94a3b8'; el.style.paddingLeft = '0'; el.style.fontSize = '14px'; }}>
                                            <span style={{ color: 'var(--primary)', marginRight: '8px', opacity: 0, transition: 'all 0.3s' }}>—</span>
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Newsletter */}
                    <div style={{ gridColumn: 'span 1.5' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '13px', color: 'white', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Outfit' }}>Kết Nối</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {contactInfo.map(({ Icon, text, sub, color }, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: color
                                    }}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '15px', color: 'white', fontWeight: 700 }}>{text}</p>
                                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div style={{
                    marginTop: '80px',
                    paddingTop: '32px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <p style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                            {settings?.footer_text || '© 2026 MotoShop Vietnam. All rights reserved.'}
                        </p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {['Chính sách', 'Bảo mật', 'Tuyển dụng'].map(l => (
                                <a key={l} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                                    {l}
                                </a>
                            ))}
                        </div>
                    </div>

                    <button onClick={scrollToTop}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '16px',
                            background: 'rgba(230,57,70,0.1)',
                            border: '1px solid rgba(230,57,70,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--primary)'; el.style.color = 'white'; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = '0 10px 20px rgba(230,57,70,0.3)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(230,57,70,0.1)'; el.style.color = 'var(--primary)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}>
                        <ArrowUpRight size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
