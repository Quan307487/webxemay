import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ordersApi } from '../lib/api';
import toast from 'react-hot-toast';
import {
    Eye, X, Clock, MapPin, CreditCard, ShoppingBag, Truck,
    CheckCircle, RotateCcw, Sigma, User, Bike, Search
} from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Chờ xử lý', color: '#f59e0b', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: '#3b82f6', icon: CheckCircle },
    shipped: { label: 'Đang giao', color: '#8b5cf6', icon: Truck },
    delivered: { label: 'Đã giao', color: '#10b981', icon: CheckCircle },
    returned: { label: 'Trả hàng', color: '#f97316', icon: RotateCcw },
    cancelled: { label: 'Đã hủy', color: '#ef4444', icon: X },
};

function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const load = (filterVal = filter, searchVal = search) => {
        setLoading(true);
        const params: any = {};
        if (filterVal) params.trang_thai = filterVal;
        if (searchVal.trim()) params.search = searchVal.trim();
        ordersApi.getAll(Object.keys(params).length ? params : {})
            .then(r => {
                const res = r.data;
                setOrders(Array.isArray(res) ? res : (res.data || []));
            })
            .catch(() => toast.error('Lỗi tải danh sách đơn hàng'))
            .finally(() => setLoading(false));
    };

    // Reload khi filter thay đổi ngay lập tức
    useEffect(() => { load(filter, search); }, [filter]);

    // Debounce search text 400ms
    useEffect(() => {
        const timer = setTimeout(() => { load(filter, search); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const updateStatus = async (id: number, status: string) => {
        try {
            await ordersApi.updateStatus(id, status);
            toast.success('Cập nhật trạng thái thành công');
            load();
            if (selectedOrder?.ma_donhang === id) {
                const r = await ordersApi.getOne(id);
                setSelectedOrder(r.data);
            }
        } catch {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleRefund = async (id: number, code: string) => {
        if (!window.confirm(`Xác nhận hoàn tiền cho đơn hàng ${code}?\nĐơn hàng sẽ chuyển sang "Trả hàng" và trạng thái thanh toán sẽ là "Hoàn tiền".`)) return;
        await updateStatus(id, 'returned');
    };

    const viewDetails = async (id: number) => {
        try {
            const r = await ordersApi.getOne(id);
            setSelectedOrder(r.data);
            setIsModalOpen(true);
        } catch {
            toast.error('Không thể tải chi tiết đơn hàng');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Quản lý đơn hàng</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                        Theo dõi <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{orders.length}</span> đơn hàng và cập nhật tiến độ vận hành.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                            className="input-premium"
                            style={{ paddingLeft: '42px', height: '44px', width: '240px', fontWeight: 600 }}
                            placeholder="Tìm mã đơn, khách hàng..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Status Filter */}
                    <div style={{ position: 'relative' }}>
                        <select
                            className="input-premium"
                            style={{ paddingRight: '40px', fontWeight: 700, height: '44px' }}
                            value={filter}
                            onChange={e => { setFilter(e.target.value); }}
                        >
                            <option value="">Tất cả trạng thái</option>
                            {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                                <option key={v} value={v}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-premium" style={{ height: '44px', padding: '0 20px', whiteSpace: 'nowrap' }} onClick={() => load(filter, search)}>
                        Tìm kiếm
                    </button>
                </div>
            </header>

            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                            <th>Ngày đặt</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(230,57,70,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Không có đơn hàng nào được tìm thấy.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o: any) => (
                                <tr key={o.ma_donhang}>
                                    <td>
                                        <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '13px', letterSpacing: '0.5px' }}>
                                            #{o.donhang_code}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{o.user?.hovaten || o.user?.ten_user || 'Guest'}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{o.user?.email || 'No email'}</div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '15px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{Number(o.tong_tien).toLocaleString('vi-VN')}đ</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'inline-block' }}>
                                            {o.phuong_thuc_TT?.toUpperCase()}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {(() => {
                                            const s = STATUS_LABELS[o.trang_thai] || { label: o.trang_thai, color: '#94a3b8', icon: Clock };
                                            return (
                                                <div className="status-pill" style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}20` }}>
                                                    <div className="status-glow" style={{ color: s.color }} />
                                                    {s.label}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {new Date(o.ngay_dat).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button
                                                onClick={() => viewDetails(o.ma_donhang)}
                                                className="btn-premium"
                                                style={{ width: '38px', height: '38px', borderRadius: '12px', padding: 0, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {o.trang_thai === 'delivered' && (
                                                <button
                                                    onClick={() => handleRefund(o.ma_donhang, o.donhang_code)}
                                                    className="btn-premium"
                                                    style={{ height: '38px', padding: '0 16px', fontSize: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 15px rgba(245, 158, 11, 0.2)' }}
                                                >
                                                    <RotateCcw size={14} />
                                                    Hoàn tiền
                                                </button>
                                            )}

                                            <select
                                                className="input-premium"
                                                style={{
                                                    fontSize: '12px',
                                                    padding: '8px 12px',
                                                    height: '38px',
                                                    width: 'auto',
                                                    opacity: ['delivered', 'returned', 'cancelled'].includes(o.trang_thai) ? 0.6 : 1,
                                                    cursor: ['delivered', 'returned', 'cancelled'].includes(o.trang_thai) ? 'not-allowed' : 'pointer'
                                                }}
                                                value={o.trang_thai}
                                                onChange={e => updateStatus(o.ma_donhang, e.target.value)}
                                                disabled={['delivered', 'returned', 'cancelled'].includes(o.trang_thai)}
                                            >
                                                {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                                                    <option key={v} value={v}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedOrder && createPortal(
                <div className="hi-fidelity-overlay">
                    <div className="hi-fidelity-container">
                        {/* Shimmer Ambient Background */}
                        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '100%', height: '40%', background: 'radial-gradient(circle, rgba(230, 57, 70, 0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        {/* Header */}
                        <div className="hf-header" style={{ position: 'relative', zIndex: 1 }}>
                            <div className="hf-brand">
                                <div style={{
                                    background: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '56px', height: '56px', borderRadius: '18px',
                                    boxShadow: '0 8px 25px rgba(230, 57, 70, 0.3)'
                                }}>
                                    <Bike size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>MotoShop</h3>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Invoice Premium</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Hóa đơn điện tử</h2>
                                <p style={{ fontSize: '24px', fontWeight: 950, color: 'white', letterSpacing: '-1px', margin: 0, fontFamily: 'Outfit, sans-serif' }}>#{selectedOrder.donhang_code}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {(() => {
                                    const s = STATUS_LABELS[selectedOrder.trang_thai] || { label: selectedOrder.trang_thai, color: '#94a3b8' };
                                    return (
                                        <div className="status-pill" style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}25`, padding: '10px 20px' }}>
                                            <div className="status-glow" style={{ color: s.color }} />
                                            {s.label.toUpperCase()}
                                        </div>
                                    );
                                })()}
                                <button className="hf-close-btn" onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="order-modal-body" style={{ position: 'relative', zIndex: 1 }}>
                            {/* Visual Progress */}
                            <div className="hf-stepper">
                                {(() => {
                                    const currentStatus = selectedOrder.trang_thai;
                                    const isReturned = currentStatus === 'returned';
                                    const isCancelled = currentStatus === 'cancelled';

                                    // Normal flow vs return flow
                                    const steps = isReturned || isCancelled ? [
                                        { id: 'pending', label: 'KHỞI TẠO', color: '#f59e0b', Icon: Clock },
                                        { id: 'confirmed', label: 'XÁC NHẬN', color: '#3b82f6', Icon: CheckCircle },
                                        { id: 'shipped', label: 'VẬN CHUYỂN', color: '#8b5cf6', Icon: Truck },
                                        { id: 'delivered', label: 'HOÀN THÀNH', color: '#10b981', Icon: CheckCircle },
                                        {
                                            id: isReturned ? 'returned' : 'cancelled',
                                            label: isReturned ? 'TRẢ HÀNG' : 'ĐÃ HỦY',
                                            color: isReturned ? '#f97316' : '#ef4444',
                                            Icon: isReturned ? RotateCcw : X
                                        },
                                    ] : [
                                        { id: 'pending', label: 'KHỞI TẠO', color: '#f59e0b', Icon: Clock },
                                        { id: 'confirmed', label: 'XÁC NHẬN', color: '#3b82f6', Icon: CheckCircle },
                                        { id: 'shipped', label: 'VẬN CHUYỂN', color: '#8b5cf6', Icon: Truck },
                                        { id: 'delivered', label: 'HOÀN THÀNH', color: '#10b981', Icon: CheckCircle },
                                    ];

                                    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'];
                                    const currentIndex = statusOrder.indexOf(currentStatus);

                                    return (
                                        <>
                                            <div style={{ position: 'absolute', top: '24px', left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.03)', zIndex: 0 }} />
                                            {steps.map((step) => {
                                                const stepIdx = statusOrder.indexOf(step.id);
                                                const isDone = currentIndex > stepIdx;
                                                const isCurrent = step.id === currentStatus;
                                                const isActive = isDone || isCurrent;

                                                return (
                                                    <div key={step.id} className={`hf-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`} style={{ '--accent': step.color } as any}>
                                                        <div className="hf-step-icon-wrapper">
                                                            <step.Icon size={18} color="white" strokeWidth={2.5} />
                                                        </div>
                                                        <span style={{ fontSize: '10px', fontWeight: 900, color: isActive ? 'white' : 'var(--text-muted)', letterSpacing: '0.5px' }}>{step.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                                <div className="premium-card" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.01)' }}>
                                    <div style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} />
                                        <span style={{ fontSize: '11px', fontWeight: 900 }}>NGƯỜI NHẬN</span>
                                    </div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{selectedOrder.ten_nguoi_nhan || selectedOrder.user?.hovaten}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>{selectedOrder.sdt_nguoi_nhan || selectedOrder.user?.so_dien_thoai}</p>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                        <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span>{selectedOrder.dia_chi_giao}</span>
                                    </div>
                                </div>

                                <div className="premium-card" style={{ padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.01)' }}>
                                    <div style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CreditCard size={16} />
                                        <span style={{ fontSize: '11px', fontWeight: 900 }}>THANH TOÁN</span>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>PHƯƠNG THỨC</p>
                                        <p style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{selectedOrder.phuong_thuc_TT?.toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '6px' }}>TRẠNG THÁI</p>
                                        <div className="status-pill" style={{
                                            background: selectedOrder.trang_thai_TT === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: selectedOrder.trang_thai_TT === 'paid' ? '#10b981' : '#f59e0b',
                                            padding: '6px 14px', fontSize: '10px'
                                        }}>
                                            {selectedOrder.trang_thai_TT === 'paid' ? 'ĐÃ QUYẾT TOÁN' : 'ĐANG CHỜ'}
                                        </div>
                                    </div>
                                </div>

                                <div className="premium-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}>
                                    <div style={{ color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sigma size={16} />
                                        <span style={{ fontSize: '11px', fontWeight: 900 }}>TỔNG GIÁ TRỊ</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Tạm tính:</span>
                                            <span style={{ color: 'white', fontWeight: 700 }}>{Number(selectedOrder.tam_tinh || selectedOrder.tong_tien).toLocaleString()}đ</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Vận chuyển:</span>
                                            <span style={{ color: 'white', fontWeight: 700 }}>0đ</span>
                                        </div>
                                        <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                                            <span style={{ color: 'white', fontWeight: 900, fontSize: '12px' }}>TỔNG CỘNG</span>
                                            <span style={{ color: 'var(--primary)', fontWeight: 950, fontSize: '24px', fontFamily: 'Outfit, sans-serif' }}>{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product List */}
                            <div className="modern-table-container" style={{ background: 'rgba(2, 6, 23, 0.4)', borderRadius: '24px' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ShoppingBag size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: 'white', letterSpacing: '1px' }}>DANH MỤC SẢN PHẨM</span>
                                </div>
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th style={{ textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ textAlign: 'right' }}>Đơn giá</th>
                                            <th style={{ textAlign: 'right' }}>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.chitietdonhang?.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-deep)', flexShrink: 0 }}>
                                                            <img
                                                                src={item.sanpham?.hinhanh?.[0]?.image_url ? `http://localhost:3001${item.sanpham.hinhanh[0].image_url}` : 'https://via.placeholder.com/80'}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{item.ten_sanpham}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>#{item.sanpham_id} {item.mau_sac && ` | Color: ${item.mau_sac}`}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', fontWeight: 900, fontSize: '13px', color: 'white' }}>x{item.so_luong}</div>
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '13px' }}>{(item.don_gia).toLocaleString()}đ</td>
                                                <td style={{ textAlign: 'right', fontWeight: 900, color: 'white', fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>{(item.so_luong * item.don_gia).toLocaleString()}đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .modern-table tr:hover td { background: rgba(var(--primary-rgb), 0.03) !important; }
            `}</style>
        </div>
    );
}

export default OrdersPage;
