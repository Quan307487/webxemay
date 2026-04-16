'use client';
import { use, useState, useEffect } from 'react';
import { ordersApi, getImageUrl } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Printer, Clock, MapPin, Phone, User, CreditCard, ReceiptText, CheckCircle2, Truck, Box, Package, ShieldCheck } from 'lucide-react';

function formatPrice(n: number) { return n?.toLocaleString('vi-VN') + 'đ'; }

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Chờ xử lý', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)' },
    confirmed: { label: 'Đã xác nhận', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    shipped: { label: 'Đang giao', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
    delivered: { label: 'Đã giao', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    cancelled: { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
    returned: { label: 'Đã trả hàng', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
    refunded: { label: 'Đã hoàn tiền', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
};

const PAYMENT_LABEL: Record<string, string> = {
    cod: 'Thanh toán COD',
    vnpay: 'VNPay',
    bank_transfer: 'Chuyển khoản',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: ma_donhang } = use(params);
    const { user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const { add: toast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login'); return; }
        if (!ma_donhang) return;
        ordersApi.getMyOrder(Number(ma_donhang))
            .then(r => { setOrder(r.data); setLoading(false); })
            .catch(() => {
                setLoading(false);
                toast('Không tìm thấy đơn hàng', 'error');
                router.push('/orders');
            });
    }, [ma_donhang, user, _hasHydrated]);

    const getProductImage = (item: any) => {
        const product = item.sanpham;
        if (!product || !product.hinhanh || product.hinhanh.length === 0) return '/placeholder-bike.jpg';
        if (item.mau_xe) {
            const colorImg = product.hinhanh.find((img: any) => img.mau_sac && img.mau_sac.toLowerCase().trim() === item.mau_xe.toLowerCase().trim());
            if (colorImg) return getImageUrl(colorImg.image_url);
        }
        const mainImg = product.hinhanh.find((img: any) => img.is_main === 1) || product.hinhanh[0];
        return getImageUrl(mainImg.image_url);
    };

    if (loading) return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ paddingTop: '150px', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e1e5ea', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Đang tải thông tin đơn hàng...</p>
            </div>
            <style>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
        </div>
    );

    if (!order) return null;

    const currentStatus = STATUS[order.trang_thai] || STATUS.pending;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
            <Navbar />
            
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
                {/* Breadcrumb & Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>TRANG CHỦ</Link>
                            <span>/</span>
                            <Link href="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>ĐƠN HÀNG</Link>
                            <span>/</span>
                            <span style={{ color: 'var(--primary)' }}>CHI TIẾT</span>
                        </div>
                    </div>
                    <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                        <ChevronLeft size={18} /> Quay lại danh sách
                    </Link>
                </div>

                {/* Main Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: 900, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
                            #{order.donhang_code}
                        </h1>
                        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}>
                            <Printer size={16} /> In hóa đơn
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right', display: 'none' /* Tablet/Desktop only */ }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>TRẠNG THÁI ĐƠN HÀNG</p>
                        </div>
                        <div style={{ background: currentStatus.bg, color: currentStatus.color, padding: '10px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', border: `1.5px solid ${currentStatus.color}30`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentStatus.color }}></span>
                            {currentStatus.label.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* 2-Column Grid */}
                <div className="order-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: Items Table */}
                    <div className="order-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1.5px solid rgba(0,0,0,0.15)' }}>
                                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SẢN PHẨM</th>
                                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>BIẾN THỂ</th>
                                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>SL</th>
                                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>ĐƠN GIÁ</th>
                                        <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>THÀNH TIỀN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.chitietdonhang?.map((item: any) => (
                                        <tr key={item.ma_CTDH} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', transition: 'background 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <img src={getProductImage(item)} alt="" style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }} />
                                                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{item.ten_sanpham}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                {item.mau_xe ? (
                                                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                                                        {item.mau_xe}
                                                    </span>
                                                ) : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '20px 24px', textAlign: 'center', fontWeight: 700 }}>{item.so_luong}</td>
                                            <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>{formatPrice(Number(item.don_gia))}</td>
                                            <td style={{ padding: '20px 24px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '16px' }}>{formatPrice(Number(item.thanh_tien))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {order.ghi_chu && (
                            <div style={{ padding: '24px', background: 'rgba(var(--primary-rgb), 0.03)', borderTop: '1.5px solid rgba(0,0,0,0.1)' }}>
                                <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 8px' }}>Ghi chú đơn hàng</p>
                                <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, lineHeight: '1.6' }}>{order.ghi_chu}</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Customer Info Card */}
                        <div className="order-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '16px 20px', borderBottom: '1.5px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={18} color="var(--primary)" />
                                <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text)' }}>KHÁCH HÀNG</h3>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 2px', color: 'var(--text)' }}>{order.ten_nguoi_nhan}</p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Phone size={13} /> {order.sdt_nguoi_nhan}
                                    </p>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 6px' }}>Địa chỉ giao hàng</p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                        <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> {order.dia_chi_giao}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info Card */}
                        <div className="order-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '16px 20px', borderBottom: '1.5px solid rgba(var(--primary-rgb), 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CreditCard size={18} color="var(--primary)" />
                                <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: 'var(--text)' }}>THANH TOÁN</h3>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        <span>Tạm tính</span>
                                        <span style={{ fontWeight: 600 }}>{formatPrice(Number(order.tong_tien))}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10b981' }}>
                                        <span>Phí vận chuyển</span>
                                        <span style={{ fontWeight: 700 }}>Miễn phí</span>
                                    </div>
                                    {/* Placeholder for discount if backend supports it */}
                                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '6px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, fontSize: '15px' }}>Tổng cộng</span>
                                        <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--primary)', fontFamily: "'Outfit', sans-serif" }}>{formatPrice(Number(order.tong_tien))}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div>
                                        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 2px' }}>TRẠNG THÁI</p>
                                        <p style={{ fontSize: '13px', fontWeight: 800, color: order.trang_thai_TT === 'paid' ? '#10b981' : '#eab308', margin: 0 }}>
                                            {order.trang_thai_TT === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 2px' }}>PHƯƠNG THỨC</p>
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                                            {PAYMENT_LABEL[order.phuong_thuc_TT] || order.phuong_thuc_TT}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', padding: '12px' }}>
                            <ShieldCheck size={18} />
                            <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Hệ thống bảo mật MotoShop</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
                .order-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .order-card:hover {
                    border-color: rgba(var(--primary-rgb), 0.3) !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.06) !important;
                }
                .table-row-hover:hover {
                    background: rgba(var(--primary-rgb), 0.02);
                }
                @media (max-width: 1024px) {
                    .order-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
