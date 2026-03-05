'use client';
import { ShoppingCart, Heart, Search, Bike, User, Package, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuthStore();
    const cartCount = useCartStore(s => s.count());
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) { router.push(`/products?search=${encodeURIComponent(search)}`); setMobileOpen(false); }
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setUserDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); setUserDropdown(false); router.push('/'); };

    return (
        <>
            <nav className={`navbar flex-col items-stretch p-0 ${scrolled ? 'navbar-scrolled' : ''}`}
                style={{ height: scrolled ? 'auto' : 'auto', gap: 0 }}>
                {/* --- TOP TIER --- */}
                <div className="flex items-center justify-between w-full px-4 md:px-8 py-3"
                    style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>

                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'linear-gradient(135deg, var(--primary), #7f1d1d)', borderRadius: '12px', padding: '8px', display: 'flex', boxShadow: scrolled ? '0 4px 20px rgba(230,57,70,0.3)' : 'none', transition: 'box-shadow 0.3s' }}>
                            <Bike size={22} color="white" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MotoShop</span>
                    </Link>

                    {/* Search (Desktop) */}
                    <form onSubmit={handleSearch} className="hidden md:flex" style={{ flex: 1, maxWidth: '500px', margin: '0 32px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                            <Search size={16} />
                        </div>
                        <input
                            className="input-field"
                            placeholder="Tìm xe máy, thương hiệu..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '42px', paddingRight: '48px', height: '42px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)' }}
                        />
                        <button type="submit" style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', border: 'none', borderRadius: '10px', width: '34px', height: '34px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            <Search size={14} />
                        </button>
                    </form>

                    {/* Desktop Right (User Actions) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: 'var(--text-muted)', transition: 'all 0.2s', background: 'transparent' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#f87171'; el.style.background = 'rgba(248,113,113,0.08)'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.background = 'transparent'; }}>
                            <Heart size={20} />
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: 'var(--text-muted)', transition: 'all 0.2s', background: 'transparent' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'white'; el.style.background = 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.background = 'transparent'; }}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '17px', height: '17px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(230,57,70,0.5)', border: '2px solid var(--bg)' }}>{cartCount > 9 ? '9+' : cartCount}</span>
                            )}
                        </Link>

                        {/* User */}
                        {user ? (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button onClick={() => setUserDropdown(!userDropdown)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: userDropdown ? 'rgba(230,57,70,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${userDropdown ? 'rgba(230,57,70,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '7px 12px', cursor: 'pointer', color: 'var(--text)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                                        {(user.hovaten || user.ten_user || 'U')[0].toUpperCase()}
                                    </div>
                                    <span className="hidden md:block" style={{ fontSize: '13px', fontWeight: 700, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.hovaten || user.ten_user}</span>
                                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: userDropdown ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-muted)' }} />
                                </button>

                                {userDropdown && (
                                    <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '8px', minWidth: '220px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 2000, backdropFilter: 'blur(24px)', animation: 'fadeInDown 0.2s ease' }}>
                                        <div style={{ padding: '12px 14px', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: 'white', marginBottom: '10px' }}>
                                                {(user.hovaten || user.ten_user || 'U')[0].toUpperCase()}
                                            </div>
                                            <p style={{ fontWeight: 800, fontSize: '15px', color: 'white' }}>{user.hovaten || user.ten_user}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</p>
                                        </div>
                                        {[
                                            { icon: <User size={15} />, label: 'Hồ sơ cá nhân', href: '/profile' },
                                            { icon: <Package size={15} />, label: 'Đơn hàng của tôi', href: '/orders' },
                                            { icon: <Heart size={15} />, label: 'Danh sách yêu thích', href: '/wishlist' },
                                        ].map(item => (
                                            <Link key={item.label} href={item.href} onClick={() => setUserDropdown(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', transition: 'all 0.2s', fontWeight: 600 }}
                                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(230,57,70,0.08)'; el.style.color = 'white'; }}
                                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>{item.label}
                                            </Link>
                                        ))}
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '6px', paddingTop: '6px' }}>
                                            <button onClick={handleLogout}
                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '14px', width: '100%', transition: 'background 0.2s', fontFamily: 'inherit', fontWeight: 600 }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <LogOut size={15} /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link href="/auth/login">
                                    <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '12px' }}>Đăng nhập</button>
                                </Link>
                                <Link href="/auth/register" className="hidden md:block">
                                    <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '12px' }}>Đăng ký</button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)', transition: 'all 0.2s' }}>
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM TIER (Navigation Menu) --- */}
                <div className="hidden md:flex items-center justify-center w-full py-2"
                    style={{ borderTop: scrolled ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-8">
                        <Link href="/products" className="nav-link" style={{ fontSize: '13px', letterSpacing: '1px' }}>SẢN PHẨM</Link>
                        <Link href="/#khuyen-mai" className="nav-link" style={{ fontSize: '13px', letterSpacing: '1px' }}>KHUYẾN MÃI</Link>
                        <Link href="/#gioi-thieu" className="nav-link" style={{ fontSize: '13px', letterSpacing: '1px' }}>GIỚI THIỆU</Link>
                        <Link href="/#lien-he" className="nav-link" style={{ fontSize: '13px', letterSpacing: '1px' }}>LIÊN HỆ</Link>
                    </div>
                </div>
            </nav>


            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, bottom: 0, background: 'rgba(2,6,18,0.85)', zIndex: 900, backdropFilter: 'blur(12px)' }} onClick={() => setMobileOpen(false)}>
                    <div style={{ background: 'rgba(13,21,38,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fadeInDown 0.25s ease', backdropFilter: 'blur(24px)' }} onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                            <input className="input-field" placeholder="Tìm xe máy..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', height: '48px' }} />
                        </form>
                        {[
                            ['SẢN PHẨM', '/products'],
                            ['KHUYẾN MÃI', '/#khuyen-mai'],
                            ['GIỚI THIỆU', '/#gioi-thieu'],
                            ['LIÊN HỆ', '/#lien-he'],
                            ['❤️ Yêu thích', '/wishlist'],
                            ['🛒 Giỏ hàng', '/cart'],
                            ['📦 Đơn hàng', '/orders'],
                            ['👤 Hồ sơ', '/profile']
                        ].map(([label, href]) => (
                            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                                style={{ display: 'block', padding: '14px 18px', borderRadius: '14px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600, transition: 'all 0.2s' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'white'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
                                {label}
                            </Link>
                        ))}
                        {!user && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <Link href="/auth/login" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
                                    <button className="btn-secondary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>Đăng nhập</button>
                                </Link>
                                <Link href="/auth/register" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
                                    <button className="btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>Đăng ký</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
