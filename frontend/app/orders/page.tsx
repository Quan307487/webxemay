'use client';
import { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight } from 'lucide-react';

const STATUS: Record<string, { label: string; color: string; emoji: string }> = {
    pending: { label: 'Chờ xử lý', color: '#eab308', emoji: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: '#3b82f6', emoji: '✅' },
    shipped: { label: 'Đang giao', color: '#a855f7', emoji: '🚚' },
    delivered: { label: 'Đã giao', color: '#22c55e', emoji: '📦' },
    cancelled: { label: 'Đã hủy', color: '#ef4444', emoji: '❌' },
};

export default function MyOrdersPage() {
    const { user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login'); return; }
        ordersApi.getMyOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, [_hasHydrated]);

    if (loading) return <><Navbar /><div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div></>;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '900px', margin: '0 auto', padding: '80px 24px 60px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>📦 Đơn hàng của tôi</h1>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                        <Package size={64} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>Bạn chưa có đơn hàng nào</p>
                        <Link href="/products"><button className="btn-primary">🏍 Mua xe ngay</button></Link>
                    </div>
                ) : orders.map((order: any) => (
                    <div key={order.ma_donhang} className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                                <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>{order.donhang_code}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <span style={{ background: `${STATUS[order.trang_thai]?.color}20`, color: STATUS[order.trang_thai]?.color, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                                {STATUS[order.trang_thai]?.emoji} {STATUS[order.trang_thai]?.label || order.trang_thai}
                            </span>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            {order.chitietdonhang?.slice(0, 3).map((item: any) => (
                                <div key={item.ma_CTDH} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{item.ten_sanpham} × {item.so_luong}</span>
                                    <span>{Number(item.thanh_tien).toLocaleString('vi-VN')}đ</span>
                                </div>
                            ))}
                            {order.chitietdonhang?.length > 3 && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>+{order.chitietdonhang.length - 3} sản phẩm khác</p>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                            <p style={{ fontWeight: 800, fontSize: '16px' }}>Tổng: <span className="price-tag">{Number(order.tong_tien).toLocaleString('vi-VN')}đ</span></p>
                            <Link href={`/orders/${order.ma_donhang}`} style={{ textDecoration: 'none' }}>
                                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>Chi tiết <ChevronRight size={14} /></button>
                            </Link>
                        </div>
                    </div>
                ))}
            </main>
            <Footer />
        </>
    );
}
