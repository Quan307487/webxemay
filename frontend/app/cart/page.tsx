'use client';
import { useState, useEffect } from 'react';
import { cartApi, couponsApi, getImageUrl } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { Trash2, ShoppingBag, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

export default function CartPage() {
    const { add: toast } = useToast();
    const { user, _hasHydrated } = useAuthStore();
    const { items, setCart } = useCartStore();
    const [loading, setLoading] = useState(true);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState<any>(null);
    const [couponErr, setCouponErr] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login'); return; }
        cartApi.get().then(r => { setCart(r.data.chitietgiohang || []); setLoading(false); }).catch(() => setLoading(false));
    }, [_hasHydrated]);

    const updateQty = async (id: number, qty: number) => {
        const r = await cartApi.updateItem(id, qty); setCart(r.data.chitietgiohang || []);
    };
    const remove = async (id: number) => {
        const r = await cartApi.removeItem(id); setCart(r.data.chitietgiohang || []);
    };
    const applyCode = async () => {
        setCouponErr('');
        const tong = items.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0);
        try {
            const r = await couponsApi.validate(coupon, tong);
            setDiscount(r.data);
            toast(`✅ Áp dụng mã thành công! Giảm ${Number(r.data.so_tien_giam).toLocaleString('vi-VN')}đ`);
        } catch (e: any) {
            setCouponErr(e.response?.data?.message || 'Mã không hợp lệ');
            setDiscount(null);
            toast(e.response?.data?.message || 'Mã giảm giá không hợp lệ', 'error');
        }
    };

    const tong = items.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0);
    const tongSauGiam = discount ? tong - Number(discount.so_tien_giam) : tong;

    const getProductImage = (item: any) => {
        const product = item.sanpham;
        if (!product || !product.hinhanh || product.hinhanh.length === 0) return '/placeholder-bike.jpg';
        if (item.mau_chon) {
            const colorImg = product.hinhanh.find((img: any) =>
                img.mau_sac && img.mau_sac.toLowerCase().trim() === item.mau_chon.toLowerCase().trim()
            );
            if (colorImg) return getImageUrl(colorImg.image_url);
        }
        const mainImg = product.hinhanh.find((img: any) => img.is_main === 1) || product.hinhanh[0];
        return getImageUrl(mainImg.image_url);
    };

    const handleGoCheckout = () => {
        if (coupon) sessionStorage.setItem('checkout_coupon', coupon);
        else sessionStorage.removeItem('checkout_coupon');
        router.push('/checkout');
    };

    if (loading) return <><Navbar /><div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div></>;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 60px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>🛒 Giỏ hàng của bạn ({items.length} sản phẩm)</h1>
                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                        <ShoppingBag size={64} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>Giỏ hàng trống!</p>
                        <Link href="/products"><button className="btn-primary">🏍 Mua xe ngay</button></Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
                        <div>
                            {items.map((item: any) => (
                                <div key={item.ma_CTGH} className="glass-card" style={{ padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <img src={getProductImage(item)} alt="" style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, marginBottom: '4px' }}>{item.sanpham?.ten_sanpham}</p>
                                        {item.mau_chon && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Màu: {item.mau_chon}</p>}
                                        <p className="price-tag">{formatPrice(Number(item.gia_hien_tai))}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                                        <button onClick={() => updateQty(item.ma_CTGH, item.so_luong - 1)} style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '16px' }}>−</button>
                                        <span style={{ padding: '8px 12px', fontWeight: 700, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{item.so_luong}</span>
                                        <button onClick={() => updateQty(item.ma_CTGH, item.so_luong + 1)} style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '16px' }}>+</button>
                                    </div>
                                    <p style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '100px', textAlign: 'right' }}>{formatPrice(Number(item.gia_hien_tai) * item.so_luong)}</p>
                                    <button onClick={() => remove(item.ma_CTGH)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
                                <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>🏷️ Mã khuyến mãi</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input className="input-field" placeholder="Nhập mã giảm giá" value={coupon} onChange={e => setCoupon(e.target.value)} />
                                    <button className="btn-primary" onClick={applyCode} style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><Tag size={16} /></button>
                                </div>
                                {couponErr && <p style={{ color: 'var(--primary)', fontSize: '13px', marginTop: '8px' }}>{couponErr}</p>}
                                {discount && <p style={{ color: '#22c55e', fontSize: '13px', marginTop: '8px' }}>✅ Giảm {formatPrice(discount.so_tien_giam)}</p>}
                            </div>
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Tạm tính</span>
                                    <span>{formatPrice(tong)}</span>
                                </div>
                                {discount && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#22c55e' }}>
                                    <span>Giảm giá</span><span>-{formatPrice(discount.so_tien_giam)}</span>
                                </div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                    <span>Tổng cộng</span>
                                    <span className="price-tag">{formatPrice(tongSauGiam)}</span>
                                </div>
                                <button
                                    className="btn-primary"
                                    onClick={handleGoCheckout}
                                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
                                >
                                    Tiến hành thanh toán <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
