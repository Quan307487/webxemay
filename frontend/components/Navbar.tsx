'use client';
import { ShoppingCart, Heart, Search, Bike, User, Package, LogOut, Menu, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { productsApi, getImageUrl } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function Navbar() {
    const { add: toast } = useToast();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
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
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!search.trim()) { setResults([]); setShowResults(false); return; }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const r = await productsApi.getAll({ search, limit: 5, active: '1' });
                setResults(r.data.data || []);
                setShowResults(true);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { 
        logout(); 
        setUserDropdown(false); 
        toast('Đăng xuất thành công!', 'success');
        router.push('/'); 
    };

    return (
        <>
            <nav className={`navbar flex-col items-stretch p-0 ${scrolled ? 'navbar-scrolled' : ''}`}
                style={{
                    height: 'auto',
                    gap: 0,
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border)',
                    boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000
                }}>
                {/* --- TOP TIER --- */}
                <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32 py-5">

                    {/* Logo */}
                    <Link href="/" className="group" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="logo-animate" style={{
                            background: 'var(--primary)',
                            borderRadius: '18px',
                            padding: '11px',
                            display: 'flex',
                            boxShadow: '0 10px 24px rgba(var(--primary-rgb), 0.25)',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}>
                            <Bike size={26} color="white" />
                        </div>
                        <span className="brand-shimmer" style={{
                            fontWeight: 900,
                            fontSize: '28px',
                            letterSpacing: '-1.8px',
                            fontFamily: 'Outfit, sans-serif',
                            transition: 'all 0.3s'
                        }}>MotoShop</span><span className="gradient-text gradient-move" style={{ fontWeight: 900, fontSize: '28px', letterSpacing: '-1.8px', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(to right, var(--primary), #3b82f6, var(--primary))', backgroundSize: '200% auto' }}>.</span>
                    </Link>

                    {/* Search (Desktop) */}
                    <div ref={searchRef} style={{ flex: 1, maxWidth: '520px', margin: '0 56px', position: 'relative' }} className="hidden lg:block">
                        <form onSubmit={handleSearch}>
                            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                                <Search size={18} />
                            </div>
                            <input
                                className="input-field"
                                placeholder="Tìm kiếm xe, thương hiệu..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => results.length > 0 && setShowResults(true)}
                                style={{
                                    paddingLeft: '56px',
                                    paddingRight: '56px',
                                    height: '54px',
                                    borderRadius: '20px',
                                    background: scrolled ? 'var(--bg-elevated)' : 'rgba(0,0,0,0.04)',
                                    border: '1.5px solid var(--border)',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    transition: 'all 0.3s'
                                }}
                            />
                            <button type="submit" style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', border: 'none', borderRadius: '15px', width: '40px', height: '40px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 6px 15px rgba(var(--primary-rgb), 0.3)' }}>
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div className="glass-panel" style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0, padding: '12px', zIndex: 2000, maxHeight: '450px', overflowY: 'auto', animation: 'fadeInDown 0.3s cubic-bezier(0.2, 1, 0.2, 1)' }}>
                                {loading ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Đang tìm kiếm...</div>
                                ) : results.length > 0 ? (
                                    <>
                                        <p style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Sản phẩm gợi ý</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {results.map((p: any) => (
                                                <Link key={p.ma_sanpham} href={`/products/${p.ma_sanpham}`} onClick={() => setShowResults(false)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '14px', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                                                    className="nav-item-hover">
                                                    <img src={getImageUrl(p.hinhanh?.[0]?.image_url)} alt="" style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '8px', background: 'var(--bg-card)' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 800, fontSize: '14px', color: 'var(--secondary)', marginBottom: '2px' }}>{p.ten_sanpham}</p>
                                                        <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{Number(p.gia).toLocaleString('vi-VN')}đ</p>
                                                    </div>
                                                    <ArrowRight size={14} style={{ opacity: 0.3 }} />
                                                </Link>
                                            ))}
                                        </div>
                                        <Link href={`/products?search=${encodeURIComponent(search)}`} onClick={() => setShowResults(false)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', marginTop: '8px', borderTop: '1px solid var(--border)', textDecoration: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 800 }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(var(--primary-rgb), 0.05)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                            Xem tất cả kết quả <ArrowRight size={14} />
                                        </Link>
                                    </>
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Không tìm thấy xe nào khớp với "{search}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Right (User Actions) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', color: 'var(--text-secondary)', transition: 'all 0.2s', border: '1px solid var(--border)', background: 'white' }}>
                            <Heart size={20} />
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', color: 'var(--text-secondary)', transition: 'all 0.2s', border: '1px solid var(--border)', background: 'white' }}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--primary)', color: 'white', borderRadius: '10px', minWidth: '22px', height: '22px', fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.4)', border: '2px solid white', padding: '0 6px' }}>{cartCount > 99 ? '99+' : cartCount}</span>
                            )}
                        </Link>

                        {/* User */}
                        {user ? (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button onClick={() => setUserDropdown(!userDropdown)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', border: `1px solid var(--border)`, borderRadius: '18px', padding: '7px 14px', cursor: 'pointer', color: 'var(--secondary)', transition: 'all 0.3s', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: 'white', flexShrink: 0 }}>
                                        {(user.hovaten || user.ten_user || 'U')[0].toUpperCase()}
                                    </div>
                                    <span className="hidden lg:block" style={{ fontSize: '14px', fontWeight: 800 }}>{user.hovaten || user.ten_user}</span>
                                    <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: userDropdown ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-muted)' }} />
                                </button>

                                {userDropdown && (
                                    <div className="glass-panel" style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, padding: '12px', minWidth: '260px', zIndex: 2000 }}>
                                        <div style={{ padding: '12px 16px', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                                            <p style={{ fontWeight: 900, fontSize: '16px', color: 'var(--secondary)' }}>{user.hovaten || user.ten_user}</p>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{user.email}</p>
                                        </div>
                                        {[
                                            { icon: <User size={16} />, label: 'Cài đặt tài khoản', href: '/profile' },
                                            { icon: <Package size={16} />, label: 'Đơn hàng của tôi', href: '/orders' },
                                            { icon: <Heart size={16} />, label: 'Danh sách yêu thích', href: '/wishlist' },
                                        ].map(item => (
                                            <Link key={item.label} href={item.href} onClick={() => setUserDropdown(false)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '14px', transition: 'all 0.2s', fontWeight: 700 }}
                                                className="nav-item-hover">
                                                <span style={{ color: 'var(--primary)' }}>{item.icon}</span>{item.label}
                                            </Link>
                                        ))}
                                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                                            <button onClick={handleLogout}
                                                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', width: '100%', transition: 'all 0.2s', fontWeight: 800 }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.05)'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <LogOut size={16} /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link href="/auth/login">
                                    <button className="btn-premium btn-secondary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '16px' }}>Đăng nhập</button>
                                </Link>
                                <Link href="/auth/register" className="hidden md:block">
                                    <button className="btn-premium btn-primary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '16px' }}>Đăng ký</button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex items-center justify-center"
                            style={{
                                background: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                width: '48px',
                                height: '48px',
                                cursor: 'pointer',
                                color: 'var(--secondary)',
                                transition: 'all 0.2s'
                            }}>
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM TIER (Navigation Menu) --- */}
                <div className="hidden lg:flex items-center justify-center w-full py-4"
                    style={{ borderTop: scrolled ? 'none' : '1.5px solid var(--border)' }}>
                    <div className="flex items-center gap-14">
                        <Link href="/products" className="nav-link" style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2.5px', color: 'var(--secondary)' }}>SẢN PHẨM</Link>
                        <Link href="/#khuyen-mai" className="nav-link" style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2.5px', color: 'var(--secondary)' }}>ƯU ĐÃI</Link>
                        <Link href="/about" className="nav-link" style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2.5px', color: 'var(--secondary)' }}>GIỚI THIỆU</Link>
                        <Link href="/contact" className="nav-link" style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2.5px', color: 'var(--secondary)' }}>LIÊN HỆ</Link>
                    </div>
                </div>
            </nav>


            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{ position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', zIndex: 900, backdropFilter: 'blur(12px)' }} onClick={() => setMobileOpen(false)}>
                    <div className="glass-panel" style={{
                        margin: '16px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        animation: 'fadeInDown 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        maxHeight: 'calc(100vh - 120px)',
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '20px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="input-field" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', border: '1px solid var(--border)' }} />
                        </form>
                        {[
                            ['SẢN PHẨM', '/products'],
                            ['ƯU ĐÃI', '/#khuyen-mai'],
                            ['GIỚI THIỆU', '/about'],
                            ['LIÊN HỆ', '/contact'],
                            ['❤️ Yêu thích', '/wishlist'],
                            ['🛒 Giỏ hàng', '/cart'],
                            ['📦 Đơn hàng', '/orders'],
                            ['👤 Hồ sơ', '/profile']
                        ].map(([label, href]) => (
                            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                                style={{ display: 'block', padding: '16px 20px', borderRadius: '16px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 800, transition: 'all 0.2s' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bg-elevated)'; el.style.color = 'var(--primary)'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; }}>
                                {label}
                            </Link>
                        ))}
                        {!user && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <Link href="/auth/login" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
                                    <button className="btn-premium btn-secondary" style={{ width: '100%', padding: '16px' }}>Đăng nhập</button>
                                </Link>
                                <Link href="/auth/register" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
                                    <button className="btn-premium btn-primary" style={{ width: '100%', padding: '16px' }}>Đăng ký</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
