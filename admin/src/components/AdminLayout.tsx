import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bike, Tag, Award, ShoppingBag, Users, Star, Package, Ticket, CreditCard, LogOut, Search, User, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_HOST, ADMIN_UPDATED_EVENT, api } from '../lib/api';

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


export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<any>(null);

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
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/login');
    };

    const displayName = admin?.hovaten || admin?.ten_user || 'Quản trị viên';
    const initials = getInitials(displayName);
    const currentTab = navItems.find(n => n.path === location.pathname) || navItems[0];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
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
                    height: '90px',
                    padding: '0 60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border-light)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'white',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            color: 'var(--primary)'
                        }}>
                            <currentTab.icon size={22} />
                        </div>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Trang Quản Trị</span>
                            <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>{currentTab.label}</h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div style={{ position: 'relative', width: '320px' }}>
                            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhanh..."
                                className="input-premium"
                                style={{
                                    paddingLeft: '48px',
                                    height: '48px',
                                    background: 'white',
                                    border: '1px solid var(--border-light)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                        </div>

                        <Link
                            to="/profile"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '6px 16px',
                                paddingLeft: '32px',
                                borderLeft: '1.5px solid var(--border-light)',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                borderRadius: '12px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{displayName}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>Administrator</p>
                            </div>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: admin?.hinh_anh ? `url(${API_HOST}${admin.hinh_anh})` : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: 'white',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                fontSize: '16px',
                                boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.2)',
                                overflow: 'hidden'
                            }}>
                                {!admin?.hinh_anh && initials}
                            </div>
                        </Link>
                    </div>
                </header>

                <main style={{ padding: '48px 60px', maxWidth: '1600px', width: '100%', margin: '0' }}>
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
