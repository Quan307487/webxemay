import { useEffect, useState } from 'react';
import { reportsApi, ordersApi } from '../lib/api';
import { ShoppingBag, Users, Activity, Clock, CheckCircle, Truck, XCircle, RotateCcw, Wallet } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { PageHeader, SpinnerPage, Badge } from '../components/ui';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    pending: { label: 'Chờ XN', color: '#f59e0b', icon: Clock, bg: 'rgba(245, 158, 11, 0.1)' },
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
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                    background: `${color}15`,
                    padding: '12px',
                    borderRadius: '16px',
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        color: 'var(--success)',
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '4px 10px',
                        borderRadius: '50px'
                    }}>
                        ↑ {trend}
                    </div>
                )}
            </div>
            <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
                <p style={{ fontSize: '28px', fontWeight: 950, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</p>
                {sub && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>{sub}</p>}
            </div>
            <div style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-10px',
                width: '60px',
                height: '60px',
                background: color,
                opacity: 0.03,
                borderRadius: '30px'
            }} />
        </div>
    );
}

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        reportsApi.getDashboard().then(r => setData(r.data)).catch(() => { });
        ordersApi.getAll({ limit: 10 }).then(r => {
            const raw = r.data;
            setRecentOrders(Array.isArray(raw) ? raw.slice(0, 10) : (raw.data || []).slice(0, 10));
        }).catch(() => { });
    }, []);

    const formatVN = (n: number) => n ? Number(n).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

    if (!data) return <SpinnerPage />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
            <PageHeader
                title="Tổng quan hệ thống"
                description={<>Chào mừng trở lại! Hôm nay hệ thống có <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{data.tong_don}</span> đơn hàng mới đang chờ xử lý.</>}
            />

            {/* Top Bar Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <StatCard icon={Wallet} label="Doanh thu thực" value={formatVN(data.doanh_thu_thang)} sub="Thu nhập ròng trong tháng" color="var(--primary)" trend="12.5%" />
                <StatCard icon={ShoppingBag} label="Đơn hàng mới" value={data.tong_don} sub={`${data.don_da_huy} đơn đã hủy/trả`} color="var(--accent)" trend="8.2%" />
                <StatCard icon={Users} label="Khách hàng mới" value={data.tong_khach || 0} sub="Tài khoản đăng ký mới" color="#8b5cf6" trend="5.1%" />
                <StatCard icon={Activity} label="Tồn kho" value={data.tong_san_pham} sub={`${data.sp_het_hang} sản phẩm hết hàng`} color="#f97316" />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div className="premium-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>Phân tích doanh thu</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Thống kê 7 ngày gần nhất</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>DOANH THU</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)' }}>HOÀN TIỀN</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.doanh_thu_7_ngay}>
                                <defs>
                                    <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                <XAxis
                                    dataKey="thang"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text-muted)' }}
                                    tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--border-light)', strokeWidth: 2 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: 'var(--shadow-lg)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}
                                    formatter={(v: any) => formatVN(v)}
                                />
                                <Area type="monotone" dataKey="thuc_thu" stroke="var(--primary)" strokeWidth={4} fill="url(#premiumGradient)" dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }} />
                                <Area type="monotone" dataKey="refund" stroke="var(--accent)" strokeWidth={3} fill="none" strokeDasharray="6 6" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>Trạng thái đơn hàng</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '32px' }}>Tỷ lệ đơn hàng theo trạng thái</p>
                    <div style={{ height: '300px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.status_distribution || []}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%" cy="50%"
                                    innerRadius={80}
                                    outerRadius={105}
                                    paddingAngle={8}
                                >
                                    {(data.status_distribution || []).map((entry: any, index: number) => (
                                        <Cell key={index} fill={STATUS_LABELS[entry.status]?.color || '#cbd5e1'} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <p style={{ fontSize: '32px', fontWeight: 950, margin: 0, color: 'var(--text-primary)' }}>{data.tong_don}</p>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>ĐƠN HÀNG</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                        {(data.status_distribution || []).slice(0, 4).map((entry: any) => (
                            <div key={entry.status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_LABELS[entry.status]?.color }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{STATUS_LABELS[entry.status]?.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div className="modern-table-container">
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 950, color: 'var(--text-primary)' }}>Giao dịch gần đây</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Thông tin chi tiết các đơn hàng mới nhất</p>
                        </div>
                        <Link to="/orders" className="btn-premium" style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)', padding: '10px 20px' }}>
                            TẤT CẢ GIAO DỊCH
                        </Link>
                    </div>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>MÃ ĐƠN</th>
                                <th>KHÁCH HÀNG</th>
                                <th>SỐ TIỀN</th>
                                <th style={{ textAlign: 'center' }}>PHƯƠNG THỨC</th>
                                <th style={{ textAlign: 'center' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'right' }}>THỜI GIAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(o => {
                                const s = STATUS_LABELS[o.trang_thai] || { label: o.trang_thai, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
                                return (
                                    <tr key={o.ma_donhang}>
                                        <td style={{ color: 'var(--primary)', fontWeight: 900 }}>#{o.donhang_code}</td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{o.user?.hovaten || 'Khách lẻ'}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{o.user?.so_dien_thoai || '--'}</div>
                                        </td>
                                        <td style={{ fontWeight: 900, color: 'var(--text-primary)' }}>{Number(o.tong_tien).toLocaleString()} ₫</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>{o.phuong_thuc_TT}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Badge label={s.label} color={s.color} />
                                        </td>
                                        <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {new Date(o.ngay_dat).toLocaleDateString('vi-VN')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="premium-card">
                        <h3 style={{ fontSize: '16px', fontWeight: 950, marginBottom: '24px', color: 'var(--text-primary)' }}>Top sản phẩm bán chạy</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {data.top_ban_chay?.slice(0, 5).map((item: any, idx: number) => (
                                <div key={item.ma_sanpham} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'var(--bg-deep)', overflow: 'hidden' }}>
                                            <img
                                                src={item.image_url ? `http://localhost:3001${item.image_url}` : 'https://via.placeholder.com/50'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt=""
                                            />
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            width: '20px',
                                            height: '20px',
                                            background: idx < 3 ? 'var(--primary)' : 'var(--text-muted)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: 900,
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.ten_sanpham}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Đã bán {item.da_ban} sản phẩm</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '14px' }}>{(item.gia / 1000000).toFixed(1)}M</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card" style={{ border: '1px solid var(--primary-light)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 950, marginBottom: '24px', color: 'var(--primary)' }}>Cảnh báo tồn kho</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.canh_bao_kho?.slice(0, 4).map((item: any) => (
                                <div key={item.ma_sanpham} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--primary-light)',
                                    padding: '14px 20px',
                                    borderRadius: '16px',
                                    borderLeft: '4px solid var(--primary)'
                                }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-dark)' }}>{item.ten_sanpham}</div>
                                    <div style={{
                                        fontSize: '11px',
                                        fontWeight: 950,
                                        color: 'white',
                                        background: 'var(--primary)',
                                        padding: '4px 10px',
                                        borderRadius: '8px'
                                    }}>
                                        CÒN: {item.ton_kho}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .modern-table tr:hover td { background: rgba(var(--primary-rgb), 0.03) !important; }
            `}</style>
        </div>
    );
}
