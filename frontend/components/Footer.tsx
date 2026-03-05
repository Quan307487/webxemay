'use client';
import Link from 'next/link';
import { Bike, Phone, Mail, MapPin, Facebook, Youtube, Instagram, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="site-footer">
            {/* Top gradient */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.4), rgba(244,162,97,0.3), transparent)' }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '56px' }}>
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary), #7f1d1d)', borderRadius: '14px', padding: '10px', display: 'flex', boxShadow: '0 8px 24px rgba(230,57,70,0.3)' }}>
                            <Bike size={22} color="white" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '24px', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MotoShop</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.9, marginBottom: '24px' }}>
                        Hệ thống phân phối xe máy chính hãng hàng đầu Việt Nam. Hơn 200+ mẫu xe, giao hàng toàn quốc.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
                        {[
                            { Icon: Facebook, href: '#', label: 'Facebook', color: '#3b82f6' },
                            { Icon: Youtube, href: '#', label: 'Youtube', color: '#ef4444' },
                            { Icon: Instagram, href: '#', label: 'Instagram', color: '#ec4899' },
                        ].map(({ Icon, href, label, color }) => (
                            <a key={label} href={href} aria-label={label}
                                style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.3s', background: 'rgba(255,255,255,0.03)' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${color}40`; el.style.background = `${color}15`; el.style.color = color; el.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.03)'; el.style.color = 'var(--text-muted)'; el.style.transform = 'translateY(0)'; }}>
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['✅ Chính hãng', '🔒 Bảo mật', '⭐ 4.9★'].map(badge => (
                            <span key={badge} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{badge}</span>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: '14px', color: 'white', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>Sản phẩm</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            ['🏍 Xe số', '/products?kieu_xe=xe_so'],
                            ['🛵 Xe ga', '/products?kieu_xe=xe_ga'],
                            ['🏁 Xe côn tay', '/products?kieu_xe=xe_con_tay'],
                            ['⚡ Xe điện', '/products?kieu_xe=xe_dien'],
                            ['🔥 Phân khối lớn', '/products?kieu_xe=phan_khoi_lon'],
                        ].map(([label, href]) => (
                            <li key={label}>
                                <Link href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}
                                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.paddingLeft = '6px'; }}
                                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.paddingLeft = '0'; }}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: '14px', color: 'white', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>Hỗ trợ</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            ['Đơn hàng của tôi', '/orders'],
                            ['Danh sách yêu thích', '/wishlist'],
                            ['Hồ sơ cá nhân', '/profile'],
                            ['Đăng nhập', '/auth/login'],
                            ['Đăng ký tài khoản', '/auth/register'],
                        ].map(([label, href]) => (
                            <li key={label}>
                                <Link href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s', fontWeight: 500 }}
                                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--primary)'; }}
                                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; }}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: '14px', color: 'white', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>Liên hệ</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { Icon: Phone, text: '1900-xxxx', sub: 'Hotline 24/7 miễn phí', color: '#4ade80' },
                            { Icon: Mail, text: 'support@motoshop.vn', sub: 'Phản hồi trong 2 giờ', color: '#60a5fa' },
                            { Icon: MapPin, text: '123 Đường ABC, TP.HCM', sub: 'Showroom chính + Bảo hành', color: '#f87171' },
                        ].map(({ Icon, text, sub, color }, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>{text}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', maxWidth: '1280px', margin: '0 auto' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    © 2026 MotoShop. Tất cả quyền được bảo lưu. 🏍
                </p>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {[['Chính sách bảo mật', '#'], ['Điều khoản sử dụng', '#'], ['DMCA', '#']].map(([l, h]) => (
                        <a key={l} href={h} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                            {l}
                        </a>
                    ))}
                    <button onClick={scrollToTop}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(230,57,70,0.2)'; el.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(230,57,70,0.1)'; el.style.transform = 'translateY(0)'; }}>
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
