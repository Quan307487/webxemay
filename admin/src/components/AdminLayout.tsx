import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bike, Tag, Award, ShoppingBag, Users, Star, Package, Ticket, CreditCard, LogOut, Menu, X, UserCircle, Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

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
];

function getInitials(name: string) {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Chào buổi sáng';
    if (h < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
}

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        try {
            const raw = localStorage.getItem('admin_user');
            if (raw) setAdmin(JSON.parse(raw));
        } catch { /* ignore */ }
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/login');
    };

    const displayName = admin?.hovaten || admin?.ten_user || 'Admin';
    const initials = getInitials(displayName);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden' }}>
            {/* Background Blobs for WOW Factor */}
            <div style={{
                position: 'fixed',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(230, 57, 70, 0.1) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none',
                animation: 'float 20s infinite alternate'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '10%',
                left: '20%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                zIndex: 0,
                pointerEvents: 'none',
                animation: 'float 25s infinite alternate-reverse'
            }} />

            {/* Sidebar */}
            <aside
                className="glass-panel"
                style={{
                    width: sidebarOpen ? '280px' : '88px',
                    borderRight: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'fixed',
                    top: 0, bottom: 0, left: 0,
                    zIndex: 1000,
                    background: 'rgba(15, 23, 42, 0.7)',
                }}
            >
                {/* Logo Section */}
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #e63946, #c1121f)',
                        padding: '10px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(230, 57, 70, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Bike size={24} color="white" />
                    </div>
                    {sidebarOpen && (
                        <div style={{ animation: 'fadeIn 0.4s ease' }}>
                            <h2 className="brand-text" style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', color: 'white', margin: 0 }}>MotoAdmin</h2>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>PREMIUM v3.0</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const active = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`nav-link ${active ? 'active' : ''}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '14px 20px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: active ? 'white' : 'var(--text-secondary)',
                                    background: active ? 'linear-gradient(90deg, rgba(230, 57, 70, 0.15) 0%, transparent 100%)' : 'transparent',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: active ? '1px solid rgba(230, 57, 70, 0.3)' : '1px solid transparent',
                                    position: 'relative',
                                    boxShadow: active ? '0 4px 15px rgba(230, 57, 70, 0.1)' : 'none'
                                }}
                            >
                                <Icon size={20} color={active ? 'var(--primary)' : 'currentColor'} strokeWidth={active ? 2.5 : 2} />
                                {sidebarOpen && <span style={{ fontWeight: active ? 800 : 600, fontSize: '14px', letterSpacing: '0.3px' }}>{label}</span>}
                                {active && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '0',
                                        width: '4px',
                                        height: '20px',
                                        borderRadius: '0 4px 4px 0',
                                        background: 'var(--primary)',
                                        boxShadow: '0 0 15px var(--primary)'
                                    }} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    {sidebarOpen ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{
                                width: '42px', height: '42px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, color: 'white', fontSize: '15px',
                                boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)'
                            }}>
                                {initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</p>
                                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Master Admin</p>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: '0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="premium-card"
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '18px',
                                padding: 0,
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Menu size={20} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginLeft: sidebarOpen ? '280px' : '88px',
                    transition: 'margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Glass Topbar */}
                <header
                    style={{
                        height: '90px',
                        padding: '0 48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        background: scrolled ? 'rgba(2, 6, 23, 0.7)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(24px)' : 'none',
                        borderBottom: scrolled ? '1px solid var(--border-light)' : '1px solid transparent',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0' }}>{getGreeting()}</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>{displayName} <span style={{ color: 'var(--primary)' }}>.</span></h2>
                        </div>

                        {/* Search Bar */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '20px', zIndex: 1 }} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông minh..."
                                className="input-premium"
                                style={{
                                    paddingLeft: '56px',
                                    width: '340px',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                                onFocus={(e) => e.currentTarget.style.width = '440px'}
                                onBlur={(e) => e.currentTarget.style.width = '340px'}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button style={{
                            width: '44px', height: '44px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: '0.3s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                        >
                            <Bell size={20} />
                            <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg-deep)', boxShadow: '0 0 10px var(--primary)' }} />
                        </button>

                        <div style={{ width: '1px', height: '32px', background: 'var(--border-light)' }} />

                        <div
                            onClick={handleLogout}
                            className="btn-premium"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '14px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <LogOut size={16} />
                            <span>Đăng xuất</span>
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, padding: '48px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                    <div className="animate-slide-up">
                        <Outlet />
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes float {
                    from { transform: translate(0, 0) rotate(0deg); }
                    to { transform: translate(50px, 50px) rotate(10deg); }
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                .nav-link:hover {
                    color: white !important;
                    background: rgba(255,255,255,0.05) !important;
                    transform: translateX(5px);
                }
                .nav-link.active:hover {
                    background: linear-gradient(90deg, rgba(230, 57, 70, 0.2) 0%, transparent 100%) !important;
                }
            `}</style>
        </div>
    );
}
