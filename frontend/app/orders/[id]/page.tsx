'use client';
import { use, useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Clock, MapPin, Phone, User, CreditCard, ReceiptText, CheckCircle, Truck, Box } from 'lucide-react';

function formatPrice(n: number) { return n?.toLocaleString('vi-VN') + 'đ'; }

const STATUS: Record<string, { label: string; color: string; emoji: string }> = {
    pending: { label: 'Chờ xử lý', color: '#eab308', emoji: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: '#3b82f6', emoji: '✅' },
    shipped: { label: 'Đang giao', color: '#a855f7', emoji: '🚚' },
    delivered: { label: 'Đã giao', color: '#22c55e', emoji: '📦' },
    cancelled: { label: 'Đã hủy', color: '#ef4444', emoji: '❌' },
};

const PAYMENT_LABEL: Record<string, string> = {
    cod: '💵 Thanh toán khi nhận hàng',
    bank_transfer: '🏦 Chuyển khoản ngân hàng',
    momo: '📱 MoMo',
    vnpay: '💳 VNPay',
};

const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: ma_donhang } = use(params);
    const { user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const { add: toast } = useToast();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!_hasHydrated) return; // Chờ Zustand đọc xong localStorage
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

    if (loading) return (
        <>
            <Navbar />
            <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Đang tải đơn hàng...
            </div>
        </>
    );
    if (!order) return null;

    const currentStepIdx = statusSteps.indexOf(order.trang_thai);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px' }}>
                <Link href="/orders" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                    <ChevronLeft size={16} /> Quay lại đơn hàng
                </Link>

                {/* Header */}
                <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>#{order.donhang_code}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={13} /> Đặt lúc {new Date(order.ngay_dat).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <span style={{ background: `${STATUS[order.trang_thai]?.color}20`, color: STATUS[order.trang_thai]?.color, padding: '8px 18px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, border: `1px solid ${STATUS[order.trang_thai]?.color}40` }}>
                            {STATUS[order.trang_thai]?.emoji} {STATUS[order.trang_thai]?.label}
                        </span>
                    </div>

                    {/* Order Timeline (only for non-cancelled) */}
                    {order.trang_thai !== 'cancelled' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {statusSteps.map((step, i) => {
                                const done = i <= currentStepIdx;
                                const icons = [Package, CheckCircle, Truck, Box];
                                const Icon = icons[i];
                                const labels = ['Chờ xử lý', 'Xác nhận', 'Đang giao', 'Đã giao'];
                                return (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '80px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: done ? 'var(--primary)' : 'var(--bg-card)', border: `2px solid ${done ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: done ? 'white' : 'var(--text-muted)', transition: 'all 0.3s', flexShrink: 0 }}>
                                                <Icon size={16} />
                                            </div>
                                            <span style={{ fontSize: '11px', color: done ? 'var(--primary)' : 'var(--text-muted)', marginTop: '6px', fontWeight: done ? 600 : 400, whiteSpace: 'nowrap' }}>{labels[i]}</span>
                                        </div>
                                        {i < statusSteps.length - 1 && (
                                            <div style={{ height: '2px', flex: 1, background: i < currentStepIdx ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s', minWidth: '20px' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <MapPin size={15} /> THÔNG TIN GIAO HÀNG
                        </h3>
                        <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><User size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} /> {order.ten_nguoi_nhan}</p>
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><Phone size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} /> {order.sdt_nguoi_nhan}</p>
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><MapPin size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} /> {order.dia_chi_giao}</p>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                            <ReceiptText size={15} /> THANH TOÁN
                        </h3>
                        <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p>{PAYMENT_LABEL[order.phuong_thuc_TT] || order.phuong_thuc_TT}</p>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: order.trang_thai_TT === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)', color: order.trang_thai_TT === 'paid' ? '#22c55e' : '#eab308', border: `1px solid ${order.trang_thai_TT === 'paid' ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`, width: 'fit-content' }}>
                                <CreditCard size={12} /> {order.trang_thai_TT === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>📦 Sản phẩm</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {order.chitietdonhang?.map((item: any) => (
                            <div key={item.ma_CTDH} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{item.ten_sanpham}</p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Số lượng: {item.so_luong} × {formatPrice(Number(item.don_gia))}</p>
                                </div>
                                <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '15px', flexShrink: 0 }}>{formatPrice(Number(item.thanh_tien))}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '80px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            <span>Tạm tính</span><span style={{ color: 'var(--text)' }}>{formatPrice(Number(order.tong_tien))}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '80px', fontSize: '20px', fontWeight: 800 }}>
                            <span>Tổng cộng</span><span className="price-tag">{formatPrice(Number(order.tong_tien))}</span>
                        </div>
                    </div>
                </div>

                {order.ghi_chu && (
                    <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>GHI CHÚ</p>
                        <p style={{ fontSize: '14px' }}>{order.ghi_chu}</p>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
