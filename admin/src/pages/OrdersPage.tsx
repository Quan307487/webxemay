import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ordersApi } from '../lib/api';
import toast from 'react-hot-toast';
import {
    Clock, Truck,
    CheckCircle, XCircle, RotateCcw, Search, X, CreditCard, Bike, ChevronDown, Printer, Settings
} from 'lucide-react';
import { settingsApi } from '../lib/api';

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
    const [storeSettings, setStoreSettings] = useState<any>(null);

    useEffect(() => {
        settingsApi.get().then(res => setStoreSettings(res.data)).catch(() => { });
    }, []);

    const handlePrint = () => {
        window.print();
    };

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
                                                <button
                                                    onClick={() => viewDetails(o.ma_donhang)}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        background: '#3b82f6',
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    title="Xem chi tiết"
                                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <img src="/realistic_eye.png" alt="view" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
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
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handlePrint}
                                style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="In hóa đơn"
                            >
                                <Printer size={18} />
                            </button>
                            <button style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

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

                        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                                {/* Background Line */}
                                <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', background: 'rgba(var(--primary-rgb), 0.05)', zIndex: 0 }} />

                                {/* Progress Filling */}
                                {(() => {
                                    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
                                    const currentIndex = steps.indexOf(selectedOrder.trang_thai);
                                    const progressWidth = currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 100;

                                    return (
                                        <div style={{
                                            position: 'absolute',
                                            top: '24px',
                                            left: '40px',
                                            width: currentIndex === -1 ? '0' : `calc(${progressWidth}% - 80px)`,
                                            height: '2px',
                                            background: 'var(--primary)',
                                            zIndex: 1,
                                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                            boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.5)'
                                        }} />
                                    );
                                })()}

                                {/* Steps */}
                                {['pending', 'confirmed', 'shipped', 'delivered'].map((step, idx) => {
                                    const config = STATUS_LABELS[step];
                                    const Icon = config.icon;
                                    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
                                    const currentIndex = steps.indexOf(selectedOrder.trang_thai);
                                    const isCompleted = currentIndex >= idx;
                                    const isActive = currentIndex === idx;

                                    return (
                                        <div key={step} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: isCompleted ? 'var(--primary)' : 'var(--bg-deep)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isCompleted ? 'white' : 'var(--text-muted)',
                                                border: isActive ? '4px solid rgba(var(--primary-rgb), 0.2)' : '2px solid transparent',
                                                transition: 'all 0.4s ease',
                                                boxShadow: isCompleted ? '0 8px 16px rgba(var(--primary-rgb), 0.2)' : 'none',
                                                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                                                position: 'relative'
                                            }}>
                                                <Icon size={20} />
                                                {isActive && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: '-4px',
                                                        borderRadius: '50%',
                                                        border: '2px solid var(--primary)',
                                                        animation: 'pulse 2s infinite'
                                                    }} />
                                                )}
                                            </div>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: isCompleted ? 900 : 600,
                                                color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                                                transition: 'all 0.4s ease'
                                            }}>
                                                {config.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Handling special states like Cancelled/Returned */}
                            {['cancelled', 'returned'].includes(selectedOrder.trang_thai) && (
                                <div style={{
                                    marginTop: '24px',
                                    padding: '12px 20px',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#ef4444',
                                    animation: 'fadeIn 0.5s ease'
                                }}>
                                    <XCircle size={18} />
                                    <span style={{ fontSize: '14px', fontWeight: 800 }}>
                                        {selectedOrder.trang_thai === 'cancelled' ? 'Đơn hàng này đã bị hủy' : 'Đơn hàng đã được trả về'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <style>{`
                            @keyframes pulse {
                                0% { transform: scale(1); opacity: 1; }
                                50% { transform: scale(1.1); opacity: 0.5; }
                                100% { transform: scale(1); opacity: 1; }
                            }
                        `}</style>

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

                        {selectedOrder.ghi_chu && (
                            <div style={{ marginBottom: '32px', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '18px', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>GHI CHÚ TỪ KHÁCH HÀNG</p>
                                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, fontStyle: 'italic', margin: 0 }}>"{selectedOrder.ghi_chu}"</p>
                            </div>
                        )}

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

            {/* Print Layout */}
            {selectedOrder && (
                <div id="print-area" className="print-only" style={{ padding: '40px', color: 'black', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid black', paddingBottom: '20px' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{storeSettings?.site_name || 'MotoShop'}</h1>
                            <p style={{ margin: '4px 0' }}>{storeSettings?.address || 'TP. Đà Nẵng'}</p>
                            <p style={{ margin: '4px 0' }}>Hotline: {storeSettings?.phone || '0339886769'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0, fontSize: '24px' }}>HÓA ĐƠN BÁN HÀNG</h2>
                            <p style={{ margin: '4px 0', fontWeight: 'bold' }}>#{selectedOrder.donhang_code}</p>
                            <p style={{ margin: '4px 0' }}>Ngày: {new Date(selectedOrder.ngay_dat).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                        <div>
                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '12px', fontSize: '16px' }}>THÔNG TIN KHÁCH HÀNG</h3>
                            <p style={{ margin: '4px 0' }}><strong>Họ tên:</strong> {selectedOrder.ten_nguoi_nhan || selectedOrder.user?.hovaten}</p>
                            <p style={{ margin: '4px 0' }}><strong>Số điện thoại:</strong> {selectedOrder.sdt_nguoi_nhan || selectedOrder.user?.so_dien_thoai}</p>
                            <p style={{ margin: '4px 0' }}><strong>Địa chỉ:</strong> {selectedOrder.dia_chi_giao}</p>
                        </div>
                        <div>
                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '12px', fontSize: '16px' }}>THANH TOÁN</h3>
                            <p style={{ margin: '4px 0' }}><strong>Phương thức:</strong> {selectedOrder.phuong_thuc_TT?.toUpperCase()}</p>
                            <p style={{ margin: '4px 0' }}><strong>Trạng thái:</strong> {selectedOrder.trang_thai_TT === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Sản phẩm</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center', width: '80px' }}>SL</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right', width: '150px' }}>Đơn giá</th>
                                <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right', width: '150px' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.chitietdonhang?.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td style={{ border: '1px solid #dee2e6', padding: '12px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.ten_sanpham}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>Màu: {item.mau_xe || 'Mặc định'}</div>
                                    </td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>{item.so_luong}</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}>{item.don_gia.toLocaleString()}đ</td>
                                    <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{(item.so_luong * item.don_gia).toLocaleString()}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>TỔNG CỘNG</td>
                                <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#e63946' }}>{Number(selectedOrder.tong_tien).toLocaleString()}đ</td>
                            </tr>
                        </tfoot>
                    </table>

                    {selectedOrder.ghi_chu && (
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Ghi chú:</h3>
                            <p style={{ margin: 0, fontStyle: 'italic' }}>{selectedOrder.ghi_chu}</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <p style={{ marginBottom: '80px' }}>Người mua hàng</p>
                            <p>(Ký, họ tên)</p>
                        </div>
                        <div style={{ textAlign: 'center', width: '200px' }}>
                            <p style={{ marginBottom: '80px' }}>Người lập hóa đơn</p>
                            <p>(Ký, họ tên)</p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .modern-table tr:hover td { background: rgba(var(--primary-rgb), 0.03) !important; }
                
                .print-only { display: none; }
                @media print {
                    body * { visibility: hidden; }
                    #print-area, #print-area * { visibility: visible; }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: block !important;
                    }
                    @page { margin: 1cm; }
                }
            `}</style>
        </div>
    );
}

export default OrdersPage;
