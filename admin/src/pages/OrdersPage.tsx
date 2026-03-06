import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ordersApi } from '../lib/api';
import toast from 'react-hot-toast';
import {
    Eye, Clock, Truck,
    CheckCircle, RotateCcw, Search, X, MapPin, CreditCard, ShoppingBag, Sigma, User, Bike, ChevronDown
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

    useEffect(() => { load(filter, search); }, [filter]);

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
        <div className="animate-slide-up" style={{ paddingBottom: '40px' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Quản lý Đơn hàng</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
                        Theo dõi <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{orders.length}</span> đơn hàng và cập nhật tiến độ vận hành.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '280px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input-premium"
                            style={{ paddingLeft: '48px', height: '48px', width: '100%' }}
                            placeholder="Mã đơn, khách hàng..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="input-premium"
                            style={{ paddingRight: '40px', fontWeight: 700, height: '48px', appearance: 'none', minWidth: '180px' }}
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                                <option key={v} value={v}>{label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>
                </div>
            </header>

            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th style={{ width: '140px' }}>MÃ ĐƠN</th>
                            <th>KHÁCH HÀNG</th>
                            <th style={{ textAlign: 'right' }}>TỔNG TIỀN</th>
                            <th>THANH TOÁN</th>
                            <th style={{ textAlign: 'center' }}>TRẠNG THÁI</th>
                            <th>NGÀY ĐẶT</th>
                            <th style={{ textAlign: 'right' }}>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--bg-deep)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o: any) => {
                                const s = STATUS_LABELS[o.trang_thai] || { label: o.trang_thai, color: '#94a3b8', icon: Clock };
                                return (
                                    <tr key={o.ma_donhang}>
                                        <td>
                                            <div style={{
                                                display: 'inline-flex',
                                                padding: '6px 12px',
                                                borderRadius: '10px',
                                                background: 'var(--bg-deep)',
                                                fontWeight: 900,
                                                fontSize: '13px',
                                                color: 'var(--primary)',
                                                border: '1px solid var(--border-light)',
                                                letterSpacing: '0.5px'
                                            }}>
                                                #{o.donhang_code}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{o.user?.hovaten || o.user?.ten_user || 'Guest'}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{o.user?.email || 'Khách vãng lai'}</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: 950, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                                                {Number(o.tong_tien).toLocaleString()}đ
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                color: 'var(--text-secondary)',
                                                background: 'var(--bg-deep)',
                                                padding: '6px 12px',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-subtle)'
                                            }}>
                                                <CreditCard size={12} />
                                                {o.phuong_thuc_TT?.toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="status-pill" style={{
                                                color: s.color,
                                                background: `${s.color}15`,
                                                border: `1px solid ${s.color}25`
                                            }}>
                                                <div className="status-glow" />
                                                {s.label}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                {new Date(o.ngay_dat).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                {o.trang_thai === 'delivered' && (
                                                    <button onClick={() => handleRefund(o.ma_donhang, o.donhang_code)} className="action-icon-btn" style={{ color: '#f59e0b' }} title="Hoàn tiền">
                                                        <RotateCcw size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => viewDetails(o.ma_donhang)} className="action-icon-btn" title="Xem chi tiết">
                                                    <Eye size={18} />
                                                </button>
                                                <div style={{ position: 'relative' }}>
                                                    <select
                                                        className="input-premium"
                                                        style={{ fontSize: '12px', padding: '0 32px 0 12px', height: '38px', width: '130px', fontWeight: 700, background: 'var(--bg-deep)', appearance: 'none', opacity: ['delivered', 'returned', 'cancelled'].includes(o.trang_thai) ? 0.6 : 1, cursor: ['delivered', 'returned', 'cancelled'].includes(o.trang_thai) ? 'not-allowed' : 'pointer' }}
                                                        value={o.trang_thai}
                                                        onChange={e => updateStatus(o.ma_donhang, e.target.value)}
                                                        disabled={['delivered', 'returned', 'cancelled'].includes(o.trang_thai)}
                                                    >
                                                        {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                                                            <option key={v} value={v}>{label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={12} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedOrder && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-main)', borderRadius: '24px', overflowY: 'auto', boxShadow: '0 32px 64px rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', padding: '32px' }}>
                        <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--bg-deep)', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>

                        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'var(--primary)', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(var(--primary-rgb), 0.3)' }}>
                                    <Bike size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>MotoShop</h3>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hóa đơn điện tử</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '24px', fontWeight: 950, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', margin: 0 }}>#{selectedOrder.donhang_code}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <div className="status-pill" style={{ color: STATUS_LABELS[selectedOrder.trang_thai]?.color, background: `${STATUS_LABELS[selectedOrder.trang_thai]?.color}15`, border: '1px solid currentColor', padding: '4px 12px', fontSize: '11px', fontWeight: 800 }}>
                                        {STATUS_LABELS[selectedOrder.trang_thai]?.label.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                            <div className="premium-card" style={{ padding: '24px', background: 'var(--bg-deep)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '16px' }}>NGƯỜI NHẬN</p>
                                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedOrder.ten_nguoi_nhan || selectedOrder.user?.hovaten}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>{selectedOrder.sdt_nguoi_nhan || selectedOrder.user?.so_dien_thoai}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{selectedOrder.dia_chi_giao}</p>
                            </div>
                            <div className="premium-card" style={{ padding: '24px', background: 'var(--bg-deep)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '16px' }}>THANH TOÁN</p>
                                <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedOrder.phuong_thuc_TT?.toUpperCase()}</p>
                                <div className="status-pill" style={{ background: selectedOrder.trang_thai_TT === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: selectedOrder.trang_thai_TT === 'paid' ? '#10b981' : '#f59e0b', fontSize: '10px' }}>
                                    {selectedOrder.trang_thai_TT === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                </div>
                            </div>
                            <div className="premium-card" style={{ padding: '24px', background: 'var(--bg-deep)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '16px' }}>TỔNG CỘNG</p>
                                <span style={{ color: 'var(--primary)', fontWeight: 950, fontSize: '28px', fontFamily: 'Outfit, sans-serif' }}>{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Đã bao gồm VAT & Phí vận chuyển</p>
                            </div>
                        </div>

                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>SẢN PHẨM</th>
                                        <th style={{ textAlign: 'center' }}>SL</th>
                                        <th style={{ textAlign: 'right' }}>ĐƠN GIÁ</th>
                                        <th style={{ textAlign: 'right' }}>THÀNH TIỀN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.chitietdonhang?.map((item: any, i: number) => (
                                        <tr key={i}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-main)' }}>
                                                        <img src={item.sanpham?.hinhanh?.[0]?.image_url ? `http://localhost:3001${item.sanpham.hinhanh[0].image_url}` : 'https://via.placeholder.com/80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.ten_sanpham}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>#{item.sanpham_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 900 }}>x{item.so_luong}</td>
                                            <td style={{ textAlign: 'right' }}>{item.don_gia.toLocaleString()}đ</td>
                                            <td style={{ textAlign: 'right', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{(item.so_luong * item.don_gia).toLocaleString()}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
