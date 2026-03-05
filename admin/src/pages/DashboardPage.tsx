import { useEffect, useState } from 'react';
import { reportsApi, ordersApi } from '../lib/api';
import { ShoppingBag, Users, AlertTriangle, Trophy, Bike, DollarSign, Activity, ArrowUpRight, Clock, CheckCircle, Truck, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    pending: { label: 'Chờ xử lý', color: '#f59e0b', icon: Clock, bg: 'rgba(245, 158, 11, 0.1)' },
    confirmed: { label: 'Đã xác nhận', color: '#3b82f6', icon: CheckCircle, bg: 'rgba(59, 130, 246, 0.1)' },
    shipped: { label: 'Đang giao', color: '#8b5cf6', icon: Truck, bg: 'rgba(139, 92, 246, 0.1)' },
    delivered: { label: 'Đã giao', color: '#10b981', icon: CheckCircle, bg: 'rgba(16, 185, 129, 0.1)' },
    returned: { label: 'Trả hàng', color: '#f97316', icon: RotateCcw, bg: 'rgba(249, 115, 22, 0.1)' },
    cancelled: { label: 'Đã hủy', color: '#ef4444', icon: XCircle, bg: 'rgba(239, 68, 68, 0.1)' },
};

function StatCard({ icon: Icon, label, value, sub, color, trend }: any) {
    return (
        <div className="premium-card animate-slide-up" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'rgba(30, 41, 59, 0.3)'
        }}>
            <div style={{
                background: `${color}15`,
                borderRadius: '18px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${color}20`,
                boxShadow: `0 0 30px ${color}10`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
                }} />
                <Icon size={28} color={color} style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <p style={{ fontSize: '32px', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>{value}</p>
                    {trend != null && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            color: trend >= 0 ? '#10b981' : '#ef4444',
                            background: trend >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800
                        }}>
                            <ArrowUpRight size={14} style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
                {sub && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>{sub}</p>}
            </div>
        </div>
    );
}

function QuickAction({ to, icon: Icon, label, desc, color }: any) {
    return (
        <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
            <div
                className="premium-card"
                style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    border: '1px solid var(--border-light)'
                }}
            >
                <div style={{
                    width: '54px', height: '54px',
                    borderRadius: '16px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${color}20`,
                    boxShadow: `0 8px 15px ${color}10`
                }}>
                    <Icon size={24} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '16px', color: 'white', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{label}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{desc}</p>
                </div>
                <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <ChevronRight size={18} color="var(--text-muted)" />
                </div>
            </div>
        </Link>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        reportsApi.getDashboard().then(r => setData(r.data)).catch(() => { });
        ordersApi.getAll({ limit: 5 }).then(r => {
            const raw = r.data;
            setRecentOrders(Array.isArray(raw) ? raw.slice(0, 5) : (raw.data || []).slice(0, 5));
        }).catch(() => { });
    }, []);

    const formatVN = (n: number) => n ? Number(n).toLocaleString('vi-VN') + 'đ' : '0đ';

    if (!data) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '24px' }}>
            <div style={{ width: '64px', height: '64px', border: '5px solid rgba(230,57,70,0.1)', borderTopColor: '#e63946', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite', boxShadow: '0 0 30px rgba(230,57,70,0.2)' }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '13px' }}>Đang đồng bộ dữ liệu...</p>
        </div>
    );

    const quickActions = [
        { to: '/products', icon: Bike, label: 'Thêm sản phẩm', desc: 'Tạo mẫu xe mới', color: '#e63946' },
        { to: '/orders', icon: ShoppingBag, label: 'Xử lý đơn hàng', desc: 'Duyệt & gửi vận chuyển', color: '#3b82f6' },
        { to: '/inventory', icon: Activity, label: 'Kiểm kê kho', desc: 'Số lượng tồn kho', color: '#10b981' },
        { to: '/coupons', icon: Trophy, label: 'Khuyến mãi', desc: 'Chiến dịch mới', color: '#f59e0b' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', animation: 'fadeIn 0.6s ease' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Tổng quan hệ thống</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>Cập nhật tình hình kinh doanh và quản lý vận hành theo thời gian thực.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-premium" style={{ background: 'rgba(255,255,255,0.03)', color: 'white' }}>Tải báo cáo</button>
                    <button className="btn-premium">Tạo đơn hàng</button>
                </div>
            </div>

            {/* Main Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <StatCard icon={DollarSign} label="Doanh thu tháng" value={formatVN(data.doanh_thu_thang)} color="#e63946" trend={12.5} />
                <StatCard icon={ShoppingBag} label="Tổng đơn hàng" value={data.tong_don} sub={`Hôm nay: +${data.don_hom_nay}`} color="#3b82f6" trend={8.2} />
                <StatCard icon={Users} label="Khách hàng mới" value={124} sub="Khách hàng trung thành" color="#8b5cf6" trend={15} />
                <StatCard icon={AlertTriangle} label="Thông báo kho" value={data.sp_het_hang} sub="Sản phẩm sắp hết hàng" color="#f59e0b" />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px' }}>
                {/* Visual Analytics - Revenue AreaChart */}
                <div className="premium-card" style={{ padding: '40px', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>Biến động doanh thu</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Thống kê thực thu và hoàn tiền theo thời gian</p>
                        </div>
                    </div>

                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.doanh_thu_theo_thang}>
                                <defs>
                                    <linearGradient id="colorThucThu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRefund" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis
                                    dataKey="thang"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                                    dy={20}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                                    tickFormatter={v => `${(v / 1000000).toFixed(0)}tr`}
                                />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: 'white', fontWeight: 800, fontSize: '14px' }}
                                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}
                                    formatter={(v: any) => [formatVN(v), '']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="thuc_thu" name="Doanh thu thực" stroke="#10b981" fillOpacity={1} fill="url(#colorThucThu)" strokeWidth={3} />
                                <Area type="monotone" dataKey="refund" name="Hoàn tiền" stroke="#ef4444" fillOpacity={1} fill="url(#colorRefund)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution PieChart */}
                <div className="premium-card" style={{ padding: '40px', background: 'rgba(15, 23, 42, 0.4)', minHeight: '430px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>Trạng thái đơn hàng</h2>
                    <div style={{ height: '350px', width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%" debounce={1}>
                            <PieChart>
                                <Pie
                                    data={data.status_distribution}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    animationBegin={0}
                                    animationDuration={400}
                                >
                                    {data.status_distribution?.map((entry: any, index: number) => {
                                        const config = STATUS_LABELS[entry.status] || { color: '#94a3b8' };
                                        return <Cell key={`cell-${index}`} fill={config.color} stroke="none" />;
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                    itemStyle={{ color: 'white', fontWeight: 800 }}
                                    formatter={(value: any, name: any) => [value, (STATUS_LABELS[name]?.label || name)]}
                                />
                                <Legend
                                    formatter={(value: any) => STATUS_LABELS[value]?.label || value}
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Activity and Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                {/* Left Column: Quick Actions & Products */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Phục vụ nhanh</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {quickActions.map(qa => <QuickAction key={qa.to} {...qa} />)}
                        </div>
                    </div>

                    {/* Products Rank */}
                    <div className="premium-card" style={{ padding: '40px', background: 'rgba(15, 23, 42, 0.4)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>Sản phẩm nổi bật</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.top_ban_chay?.slice(0, 5).map((item: any, i: number) => {
                                const colors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#8b5cf6'];
                                return (
                                    <div key={item.ma_sanpham} className="row-item-hover" style={{
                                        display: 'flex', alignItems: 'center', gap: '20px', padding: '16px',
                                        background: 'rgba(2, 6, 23, 0.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)',
                                        transition: '0.3s'
                                    }}>
                                        <div style={{ width: '48px', height: '48px', background: `${colors[i]}15`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: `1px solid ${colors[i]}30`, boxShadow: `0 0 20px ${colors[i]}10` }}>
                                            {['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '15px', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.ten_sanpham}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '4px' }}>{item.da_ban} xe đã bán</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '15px', fontWeight: 900, color: '#e63946', fontFamily: 'Outfit, sans-serif' }}>{formatVN(item.gia)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="modern-table-container">
                    <div style={{ padding: '32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Đơn hàng mới nhất</h3>
                        <Link to="/orders" className="btn-premium" style={{
                            fontSize: '12px', padding: '8px 16px', textDecoration: 'none', background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            XEM TẤT CẢ <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th style={{ textAlign: 'right' }}>Giá trị</th>
                                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(o => {
                                    const s = STATUS_LABELS[o.trang_thai] || { label: o.trang_thai, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
                                    return (
                                        <tr key={o.ma_donhang} style={{ cursor: 'pointer' }}>
                                            <td style={{ fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.5px' }}>#{o.donhang_code}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                                        {(o.user?.hovaten || 'G')[0]}
                                                    </div>
                                                    <span style={{ fontWeight: 700 }}>{o.user?.hovaten || o.user?.ten_user || 'Khách vãng lai'}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 900, color: 'white', textAlign: 'right', fontFamily: 'Outfit, sans-serif' }}>{formatVN(o.tong_tien)}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="status-pill" style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}20` }}>
                                                    <div className="status-glow" style={{ color: s.color }} />
                                                    {s.label}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .row-item-hover:hover {
                    background: rgba(230, 57, 70, 0.05) !important;
                    border-color: rgba(230, 57, 70, 0.2) !important;
                    transform: translateX(10px);
                }
            `}</style>
        </div>
    );
}
