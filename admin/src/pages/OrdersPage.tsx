import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ordersApi, settingsApi } from '../lib/api';
import toast from 'react-hot-toast';
import {
    Clock, Truck,
    CheckCircle, RotateCcw, Search, X, CreditCard, ChevronDown, Printer, User, MapPin
} from 'lucide-react';
import { PageHeader, Spinner } from '../components/ui';

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
    const [confirmingPayment, setConfirmingPayment] = useState(false);
    const [pendingConfirmPayment, setPendingConfirmPayment] = useState(false);

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
            <PageHeader
                title="Quản lý Đơn hàng"
                description={<>Theo dõi <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{orders.length}</span> đơn hàng và cập nhật tiến độ vận hành.</>}
                action={
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
                }
            />

            <div className="modern-table-container" style={{ overflowX: 'auto' }}>
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
                                    <Spinner />
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
                                                {(o.trang_thai === 'delivered' || (o.trang_thai === 'cancelled' && o.phuong_thuc_TT?.toLowerCase().includes('vnpay'))) && (
                                                    <button onClick={() => handleRefund(o.ma_donhang, o.donhang_code)} className="action-icon-btn" style={{ color: o.trang_thai === 'cancelled' ? '#3b82f6' : '#f59e0b' }} title={o.trang_thai === 'cancelled' ? "Hoàn tiền VNPay" : "Hoàn tiền"}>
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

            {/* Modal Redesign */}
            {isModalOpen && selectedOrder && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '1200px', 
                        maxHeight: '92vh', 
                        background: '#f8fafc', 
                        borderRadius: '24px', 
                        overflowY: 'auto', 
                        boxShadow: '0 40px 100px rgba(0,0,0,0.25)', 
                        border: '1.5px solid rgba(255,255,255,0.3)', 
                        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Modal Top Bar */}
                        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', padding: '20px 32px', borderBottom: '1.5px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                                        #{selectedOrder.donhang_code}
                                    </h2>
                                    <button 
                                        onClick={handlePrint}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                    >
                                        <Printer size={16} /> In hóa đơn
                                    </button>
                                </div>
                                <div style={{ width: '1.5px', height: '24px', background: 'rgba(0,0,0,0.1)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <select 
                                            className="input-premium" 
                                            style={{ height: '44px', minWidth: '160px', paddingRight: '40px', fontWeight: 700, fontSize: '14px', background: '#fff' }}
                                            value={selectedOrder.trang_thai}
                                            onChange={(e) => updateStatus(selectedOrder.ma_donhang, e.target.value)}
                                        >
                                            {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                                                <option key={v} value={v}>{label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.06)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content Grid */}
                        <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                            
                            {/* LEFT COLUMN: Products Table */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid rgba(0,0,0,0.12)' }}>
                                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 850, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SẢN PHẨM</th>
                                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 850, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>BIẾN THỂ</th>
                                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 850, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>SL</th>
                                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 850, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>ĐƠN GIÁ</th>
                                                <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: 850, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>THÀNH TIỀN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.chitietdonhang?.map((item: any) => (
                                                <tr key={item.ma_CTDH} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            <div style={{ width: '64px', height: '52px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: '#f1f5f9' }}>
                                                                <img src={item.sanpham?.hinhanh?.[0]?.image_url ? `http://localhost:3001${item.sanpham.hinhanh[0].image_url}` : 'https://via.placeholder.com/80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.ten_sanpham}</div>
                                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>#{item.sanpham_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        {item.mau_xe ? (
                                                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>{item.mau_xe}</span>
                                                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>}
                                                    </td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>{item.so_luong}</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>{Number(item.don_gia).toLocaleString()}đ</td>
                                                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 900, color: 'var(--primary)', fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>{(item.so_luong * item.don_gia).toLocaleString()}đ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {selectedOrder.ghi_chu && (
                                    <div style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '18px', border: '1.5px dashed rgba(59, 130, 246, 0.2)' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ghi chú từ khách hàng</p>
                                        <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600, fontStyle: 'italic', margin: 0, lineHeight: '1.6' }}>"{selectedOrder.ghi_chu}"</p>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Info Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Customer Card */}
                                <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1.5px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <User size={18} color="var(--primary)" />
                                        <h3 style={{ fontSize: '13px', fontWeight: 850, margin: 0, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Khách hàng</h3>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '18px' }}>
                                                {(selectedOrder.ten_nguoi_nhan || 'G')[0]}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{selectedOrder.ten_nguoi_nhan || selectedOrder.user?.hovaten || 'Khách vãng lai'}</h4>
                                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{selectedOrder.sdt_nguoi_nhan || selectedOrder.user?.so_dien_thoai}</p>
                                            </div>
                                        </div>
                                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '16px 0' }} />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{selectedOrder.dia_chi_giao}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Card */}
                                <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                    <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1.5px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <CreditCard size={18} color="var(--primary)" />
                                        <h3 style={{ fontSize: '13px', fontWeight: 850, margin: 0, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Thanh toán</h3>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                <span>Tạm tính</span>
                                                <span style={{ fontWeight: 700 }}>{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10b981' }}>
                                                <span>Phí vận chuyển</span>
                                                <span style={{ fontWeight: 800 }}>Miễn phí</span>
                                            </div>
                                            <div style={{ height: '1.5px', background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 850, fontSize: '15px' }}>TỔNG CỘNG</span>
                                                <span style={{ fontWeight: 950, fontSize: '26px', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                            </div>
                                        </div>

                                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Trạng thái</p>
                                                <div className="status-pill" style={{ background: selectedOrder.trang_thai_TT === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: selectedOrder.trang_thai_TT === 'paid' ? '#10b981' : '#f59e0b', fontSize: '11px', fontWeight: 800, padding: '4px 12px' }}>
                                                    {selectedOrder.trang_thai_TT === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Phương thức</p>
                                                <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{selectedOrder.phuong_thuc_TT?.toUpperCase()}</p>
                                            </div>
                                        </div>


                                        {selectedOrder.trang_thai_TT !== 'paid' && selectedOrder.trang_thai !== 'cancelled' && (
                                            <div style={{ marginTop: '20px' }}>
                                                {pendingConfirmPayment ? (
                                                    <div style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid #10b981', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#065f46', textAlign: 'center' }}>
                                                            Xác nhận đã thu <strong>{Number(selectedOrder.tong_tien).toLocaleString()}đ</strong> từ khách?
                                                        </p>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                style={{ flex: 1, height: '40px', borderRadius: '10px', border: '1.5px solid #d1d5db', background: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#6b7280' }}
                                                                onClick={() => setPendingConfirmPayment(false)}
                                                            >
                                                                Huỷ
                                                            </button>
                                                            <button
                                                                id="btn-confirm-payment-final"
                                                                style={{ flex: 2, height: '40px', borderRadius: '10px', background: confirmingPayment ? '#6ee7b7' : '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '13px', cursor: confirmingPayment ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                                                disabled={confirmingPayment}
                                                                onClick={async () => {
                                                                    try {
                                                                        setConfirmingPayment(true);
                                                                        const res = await ordersApi.confirmPayment(selectedOrder.ma_donhang);
                                                                        const updated = res.data;
                                                                        setSelectedOrder(updated);
                                                                        setOrders(prev => prev.map(o => o.ma_donhang === updated.ma_donhang ? { ...o, trang_thai_TT: updated.trang_thai_TT } : o));
                                                                        setPendingConfirmPayment(false);
                                                                        toast.success('✅ Xác nhận thu tiền thành công!');
                                                                    } catch (err: any) {
                                                                        toast.error(err?.response?.data?.message || 'Không thể xác nhận thu tiền');
                                                                    } finally {
                                                                        setConfirmingPayment(false);
                                                                    }
                                                                }}
                                                            >
                                                                {confirmingPayment
                                                                    ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Đang xử lý...</>
                                                                    : <><CheckCircle size={15} /> Chắc chắn rồi</>
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        id="btn-confirm-payment"
                                                        style={{ width: '100%', height: '48px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', background: '#10b981', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', gap: '8px' }}
                                                        onClick={() => setPendingConfirmPayment(true)}
                                                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                                                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                                    >
                                                        <CheckCircle size={18} /> Xác nhận thu tiền
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {selectedOrder.trang_thai === 'delivered' && (
                                            <button 
                                                style={{ width: '100%', marginTop: '12px', height: '48px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', background: '#f97316', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                onClick={() => handleRefund(selectedOrder.ma_donhang, selectedOrder.donhang_code)}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                            >
                                                <RotateCcw size={18} style={{ marginRight: '8px' }} /> Trả hàng / Hoàn tiền
                                            </button>
                                        )}

                                        {selectedOrder.trang_thai === 'cancelled' && selectedOrder.phuong_thuc_TT?.toLowerCase().includes('vnpay') && (
                                            <button 
                                                style={{ width: '100%', marginTop: '12px', height: '48px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', background: 'linear-gradient(135deg, #0062cc, #0891b2)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', gap: '8px' }}
                                                onClick={() => {
                                                    if (window.confirm(`Xác nhận hoàn tiền VNPay cho đơn #${selectedOrder.donhang_code}?\nSố tiền: ${Number(selectedOrder.tong_tien).toLocaleString()}đ`)) {
                                                        toast.success('Yêu cầu hoàn tiền VNPay đã được gửi!');
                                                    }
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                            >
                                                <RotateCcw size={18} /> Hoàn tiền VNPay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                .modern-table tr:hover td { background: rgba(var(--primary-rgb), 0.03) !important; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
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
