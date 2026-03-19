'use client';
import { useState, useEffect } from 'react';
import { cartApi, ordersApi, couponsApi } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { Trash2, ShoppingBag, Tag, ChevronRight, CheckCircle } from 'lucide-react';
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
    const [checkout, setCheckout] = useState(false);
    const [form, setForm] = useState({ dia_chi_giao: '', ten_nguoi_nhan: '', sdt_nguoi_nhan: '', phuong_thuc_TT: 'cod', ghi_chu: '' });
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
    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const r = await ordersApi.checkout({ ...form, ma_giamgia: coupon || undefined });
            console.log("Checkout Response:", r.data);
            setCart([]);
            
            if (r.data.paymentUrl) {
                toast('🎉 Đang chuyển hướng đến VNPay...');
                window.location.href = r.data.paymentUrl;
                return;
            }

            toast('🎉 Đặt hàng thành công!');
            router.push(`/orders/${r.data.ma_donhang}`);
        } catch (e: any) {
            console.error("Checkout Error:", e);
            toast(e.response?.data?.message || 'Lỗi đặt hàng', 'error');
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
            if (colorImg) return `http://localhost:3001${colorImg.image_url}`;
        }

        // Fallback to main image or first image
        const mainImg = product.hinhanh.find((img: any) => img.is_main === 1) || product.hinhanh[0];
        return `http://localhost:3001${mainImg.image_url}`;
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
                                <button className="btn-primary" onClick={() => setCheckout(true)} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
                                    Đặt hàng <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout Modal */}
                {checkout && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '40px', maxHeight: '95vh', overflow: 'auto', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                            <h2 style={{ fontWeight: 900, fontSize: '24px', marginBottom: '28px', color: '#fff', letterSpacing: '-0.5px' }}>📦 Thông tin đặt hàng</h2>
                            <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[['Người nhận *', 'ten_nguoi_nhan', 'text', 'Họ và tên'], ['SĐT người nhận *', 'sdt_nguoi_nhan', 'tel', '0912...'], ['Địa chỉ giao hàng *', 'dia_chi_giao', 'text', 'Số nhà, đường, phường, quận...']].map(([l, k, t, ph]) => (
                                    <div key={k}>
                                        <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</label>
                                        <input className="input-field" required type={t} placeholder={ph} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phương thức thanh toán</label>
                                    <select className="input-field" value={form.phuong_thuc_TT} onChange={e => setForm({ ...form, phuong_thuc_TT: e.target.value })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                                        <option value="cod" style={{ background: '#0f172a' }}>💵 Thanh toán khi nhận hàng (COD)</option>
                                        <option value="bank_transfer" style={{ background: '#0f172a' }}>🏦 Chuyển khoản ngân hàng</option>
                                        <option value="momo" style={{ background: '#0f172a' }}>📱 MoMo</option>
                                        <option value="vnpay" style={{ background: '#0f172a' }}>💳 Cổng thanh toán VNPay (QR, Thẻ ATM, Quốc tế)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ghi chú</label>
                                    <input className="input-field" placeholder="Ghi chú thêm..." value={form.ghi_chu} onChange={e => setForm({ ...form, ghi_chu: e.target.value })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                </div>
                                <div style={{ background: 'rgba(230,57,70,0.05)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Tổng thanh toán:</span>
                                    <span className="price-tag" style={{ fontSize: '24px', fontWeight: 900 }}>{formatPrice(tongSauGiam)}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '16px', borderRadius: '14px', fontSize: '15px' }}>✅ Xác nhận đặt hàng</button>
                                    <button type="button" className="btn-secondary" onClick={() => setCheckout(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', fontSize: '15px', color: '#fff', background: 'rgba(255,255,255,0.05)' }}>Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
