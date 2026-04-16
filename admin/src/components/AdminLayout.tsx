import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bike, Tag, Award, ShoppingBag, Users, Star, Package, Ticket, CreditCard, LogOut, Search, User, Settings, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_HOST, API_BASE, ADMIN_UPDATED_EVENT, api } from '../lib/api';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Bike, label: 'Sản phẩm' },
    { path: '/categories', icon: Tag, label: 'Danh mục' },
    { path: '/brands', icon: Award, label: 'Thương hiệu' },
    { path: '/orders', icon: ShoppingBag, label: 'Đơn hàng' },
    { path: '/payments', icon: CreditCard, label: 'Thanh toán' },
    { path: '/reviews', icon: Star, label: 'Đánh giá' },
    { path: '/inventory', icon: Package, label: 'Tồn kho' },
    { path: '/coupons', icon: Ticket, label: 'Khuyến mãi' },
    { path: '/users', icon: Users, label: 'Người dùng' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
    { path: '/profile', icon: User, label: 'Hồ sơ', hidden: true },
];

function getInitials(name: string) {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
}


// ── Global Search Component ──
function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: any[]; orders: any[]; users: any[] }>({ products: [], orders: [], users: [] });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<any>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard shortcut Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const doSearch = useCallback(async (q: string) => {
        if (!q.trim() || q.length < 2) { setResults({ products: [], orders: [], users: [] }); setOpen(false); return; }
        setLoading(true);
        setOpen(true);
        try {
            const [pRes, oRes, uRes] = await Promise.allSettled([
                api.get('/products', { params: { search: q, limit: 4 } }),
                api.get('/orders', { params: { search: q, limit: 4 } }),
                api.get('/users', { params: { search: q, limit: 4 } }),
            ]);
            setResults({
                products: pRes.status === 'fulfilled' ? (pRes.value.data.data || pRes.value.data || []).slice(0, 4) : [],
                orders:   oRes.status === 'fulfilled' ? (oRes.value.data.data || oRes.value.data || []).slice(0, 4) : [],
                users:    uRes.status === 'fulfilled' ? (uRes.value.data.data || uRes.value.data || []).slice(0, 4) : [],
            });
        } catch { /* ignore */ } finally { setLoading(false); }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setQuery(v);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => doSearch(v), 300);
    };

    const go = (path: string) => { setOpen(false); setQuery(''); navigate(path); };

    const totalResults = results.products.length + results.orders.length + results.users.length;

    return (
        <div ref={ref} style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => { if (query.length >= 2) setOpen(true); }}
                placeholder="Tìm kiếm... (Ctrl+K)"
                className="input-premium"
                style={{ paddingLeft: '42px', paddingRight: query ? '36px' : '14px', height: '44px', background: 'white', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', fontSize: '14px', width: '100%' }}
            />
            {query && (
                <button onClick={() => { setQuery(''); setOpen(false); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '2px' }}>
                    <X size={15} />
                </button>
            )}

            {open && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', zIndex: 9999, overflow: 'hidden', minWidth: '320px' }}>
                    {loading ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Đang tìm kiếm...</div>
                    ) : totalResults === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                            Không tìm thấy kết quả cho <strong style={{ color: '#0f172a' }}>"{query}"</strong>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                            {results.products.length > 0 && (
                                <>
                                    <div style={{ padding: '10px 16px 6px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Sản phẩm</div>
                                    {results.products.map((p: any) => {
                                        const img = p.hinhanh?.find((h: any) => h.is_main) || p.hinhanh?.[0];
                                        return (
                                            <div key={p.ma_sanpham} onClick={() => go('/products')} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                                <div style={{ width: '40px', height: '36px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                                    {img && <img src={`${API_BASE}${img.image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.ten_sanpham}</p>
                                                    <p style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 700, margin: 0 }}>{Number(p.gia).toLocaleString('vi-VN')}đ</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                            {results.orders.length > 0 && (
                                <>
                                    <div style={{ padding: '10px 16px 6px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', borderTop: results.products.length > 0 ? '1px solid #f1f5f9' : 'none' }}>Đơn hàng</div>
                                    {results.orders.map((o: any) => (
                                        <div key={o.ma_donhang} onClick={() => go('/orders')} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                            <div style={{ width: '40px', height: '36px', borderRadius: '8px', background: 'rgba(244,63,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <ShoppingBag size={18} color="#f43f5e" />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 800, color: '#f43f5e', margin: 0 }}>#{o.ma_donhang}</p>
                                                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{o.user?.hovaten || o.user?.ten_user || 'Khách hàng'}</p>
                                            </div>
                                            <div style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{Number(o.tong_tien).toLocaleString('vi-VN')}đ</div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {results.users.length > 0 && (
                                <>
                                    <div style={{ padding: '10px 16px 6px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', borderTop: (results.products.length + results.orders.length) > 0 ? '1px solid #f1f5f9' : 'none' }}>Người dùng</div>
                                    {results.users.map((u: any) => (
                                        <div key={u.ma_user} onClick={() => go('/users')} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                            <div style={{ width: '40px', height: '36px', borderRadius: '8px', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Users size={18} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{u.hovaten || u.ten_user}</p>
                                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{u.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{totalResults} kết quả</span>
                        <span style={{ fontSize: '11px', color: '#cbd5e1' }}>•</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>ESC để đóng</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminLayout() {
    const location = useLocation();
    const [admin, setAdmin] = useState<any>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const loadAdmin = () => {
            try {
                const raw = localStorage.getItem('admin_user');
                if (raw) setAdmin(JSON.parse(raw));
            } catch { /* ignore */ }
        };

        loadAdmin(); // Initial load from localStorage

        // Fetch fresh data from API so hinh_anh is always up-to-date
        api.get('/users/me').then(res => {
            const fresh = res.data;
            const raw = localStorage.getItem('admin_user');
            const existing = raw ? JSON.parse(raw) : {};
            const merged = { ...existing, ...fresh };
            localStorage.setItem('admin_user', JSON.stringify(merged));
            setAdmin(merged);
        }).catch(() => { /* fail silently */ });

        window.addEventListener(ADMIN_UPDATED_EVENT, loadAdmin);
        window.addEventListener('storage', loadAdmin);

        return () => {
            window.removeEventListener(ADMIN_UPDATED_EVENT, loadAdmin);
            window.removeEventListener('storage', loadAdmin);
        };
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = 'http://localhost:3000/auth/login';
    };

    const displayName = admin?.hovaten || admin?.ten_user || 'Quản trị viên';
    const initials = getInitials(displayName);
    const currentTab = navItems.find(n => n.path === location.pathname) || navItems[0];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>

            {/* ── LOGOUT CONFIRMATION MODAL ── */}
            {showLogoutModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(2, 6, 23, 0.7)',
                    backdropFilter: 'blur(8px)',
                    animation: 'modalFadeIn 0.2s ease',
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '28px',
                        padding: '44px 48px',
                        width: '100%',
                        maxWidth: '420px',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                        animation: 'modalSlideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
                        textAlign: 'center',
                    }}>
                        {/* Warning icon */}
                        <div style={{
                            width: '72px', height: '72px',
                            borderRadius: '50%',
                            background: 'rgba(244,63,94,0.12)',
                            border: '1.5px solid rgba(244,63,94,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 28px',
                            boxShadow: '0 0 30px rgba(244,63,94,0.15)',
                        }}>
                            <LogOut size={30} color='#f43f5e' />
                        </div>

                        <h2 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '22px', fontWeight: 900,
                            color: '#f1f5f9', marginBottom: '12px',
                            letterSpacing: '-0.03em',
                        }}>Xác nhận đăng xuất</h2>

                        <p style={{
                            fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.6, marginBottom: '36px', fontWeight: 500,
                        }}>
                            Bạn có chắc muốn đăng xuất khỏi hệ thống quản trị?<br />
                            Mọi phiên làm việc hiện tại sẽ kết thúc.
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {/* Cancel */}
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px', cursor: 'pointer',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '14px', fontWeight: 700,
                                    fontFamily: "'Inter', sans-serif",
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                }}
                            >Ở lại</button>

                            {/* Confirm logout */}
                            <button
                                onClick={confirmLogout}
                                style={{
                                    flex: 1, padding: '14px',
                                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                                    border: 'none', borderRadius: '14px',
                                    cursor: 'pointer', color: 'white',
                                    fontSize: '14px', fontWeight: 800,
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 6px 20px rgba(244,63,94,0.35)',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(244,63,94,0.5)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,94,0.35)';
                                }}
                            >
                                <LogOut size={15} />
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes modalFadeIn { from{opacity:0} to{opacity:1} }
                        @keyframes modalSlideUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                    `}</style>
                </div>
            )}
            {/* Premium Sidebar */}
            <aside style={{
                width: '280px',
                height: 'calc(100vh - 40px)',
                position: 'fixed',
                left: '20px',
                top: '20px',
                background: 'var(--bg-sidebar)',
                borderRadius: '24px',
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                color: 'var(--text-on-dark)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', paddingLeft: '8px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        padding: '12px',
                        borderRadius: '16px',
                        display: 'flex',
                        boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.3)'
                    }}>
                        <Bike size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif", letterSpacing: '-1px' }}>
                            MotoShop
                        </h2>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Admin Central
                        </span>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                    {navItems.filter(i => !i.hidden).map(({ path, icon: Icon, label }) => {
                        const active = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 18px',
                                    borderRadius: '14px',
                                    color: active ? 'white' : 'rgba(255,255,255,0.6)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '15px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {active && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        bottom: '20%',
                                        width: '4px',
                                        background: 'var(--primary)',
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: '0 0 5px var(--primary)'
                                    }} />
                                )}
                                <Icon size={20} style={{ color: active ? 'var(--primary)' : 'inherit' }} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <button
                        onClick={handleLogout}
                        className="btn-premium"
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '14px',
                            borderRadius: '14px',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Workspace */}
            <div style={{ flex: 1, marginLeft: '320px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Advanced Glass Navbar */}
                <header style={{
                    minHeight: '76px',
                    padding: '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    background: 'rgba(248, 250, 252, 0.92)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border-light)',
                    gap: '16px',
                    flexWrap: 'nowrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            background: 'white',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            color: 'var(--primary)',
                            flexShrink: 0,
                        }}>
                            <currentTab.icon size={20} />
                        </div>
                        <div style={{ whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Trang Quản Trị</span>
                            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{currentTab.label}</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                        <GlobalSearch />

                        <Link
                            to="/profile"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '6px 8px 6px 20px',
                                borderLeft: '1.5px solid var(--border-light)',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                borderRadius: '12px',
                                flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <p style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{displayName}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>Administrator</p>
                            </div>
                            <div style={{
                                width: '46px',
                                height: '46px',
                                background: admin?.hinh_anh ? `url(${API_HOST}${admin.hinh_anh})` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: 'white',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: '15px',
                                boxShadow: '0 6px 14px rgba(var(--primary-rgb), 0.2)',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}>
                                {!admin?.hinh_anh && initials}
                            </div>
                        </Link>
                    </div>
                </header>

                <main style={{ padding: '40px 40px', maxWidth: '1600px', width: '100%', margin: '0' }}>
                    <div className="animate-slide-up">
                        <Outlet />
                    </div>
                </main>
            </div>

            <style>{`
                aside::-webkit-scrollbar { width: 0; }
                .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
