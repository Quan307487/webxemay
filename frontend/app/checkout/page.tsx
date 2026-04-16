'use client';
import { useState, useEffect } from 'react';
import { cartApi, ordersApi, couponsApi, getImageUrl } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import Footer from '@/components/Footer';
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    Tag,
    Wallet,
    Building2,
    Package,
    ArrowRight,
    CheckCircle2,
    User,
    Phone,
    MapPin,
    MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatPrice(n: number) {
    return n.toLocaleString('vi-VN') + 'đ';
}

const PAYMENT_METHODS = [
    { id: 'cod', name: 'Thanh toán COD', desc: 'Thanh toán trực tiếp khi nhận hàng', icon: Truck, color: '#f43f5e' },
    { id: 'vnpay', name: 'VNPay', desc: 'Thẻ ATM, QR Code, Thẻ quốc tế', icon: CreditCard, color: '#2563eb' },
];

export default function CheckoutPage() {
    const { add: toast } = useToast();
    const { user, _hasHydrated } = useAuthStore();
    const { items, setCart } = useCartStore();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState<any>(null);
    const [couponErr, setCouponErr] = useState('');
    const [form, setForm] = useState({
        dia_chi_giao: '',
        ten_nguoi_nhan: '',
        sdt_nguoi_nhan: '',
        phuong_thuc_TT: 'cod',
        ghi_chu: '',
    });
    const router = useRouter();

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login?redirect=/checkout'); return; }

        cartApi.get().then(r => {
            const cartItems = r.data.chitietgiohang || [];
            setCart(cartItems);
            if (cartItems.length === 0) { router.push('/cart'); }
            setLoading(false);
        }).catch(() => setLoading(false));

        setForm(prev => ({
            ...prev,
            ten_nguoi_nhan: (user as any).username || (user as any).ho_ten || '',
            sdt_nguoi_nhan: (user as any).phone || (user as any).sdt || '',
        }));

        // Đọc coupon được lưu từ trang giỏ hàng
        const saved = sessionStorage.getItem('checkout_coupon');
        if (saved) setCoupon(saved);
    }, [_hasHydrated]);

    const applyCode = async () => {
        if (!coupon.trim()) return;
        setCouponErr('');
        const tong = items.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0);
        try {
            const r = await couponsApi.validate(coupon, tong);
            setDiscount(r.data);
            toast(`✅ Áp dụng thành công! Giảm ${Number(r.data.so_tien_giam).toLocaleString('vi-VN')}đ`);
        } catch (e: any) {
            setCouponErr(e.response?.data?.message || 'Mã không hợp lệ');
            setDiscount(null);
        }
    };

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        try {
            const r = await ordersApi.checkout({ ...form, ma_giamgia: coupon || undefined });
            setCart([]);
            sessionStorage.removeItem('checkout_coupon');
            if (r.data.paymentUrl) {
                toast('🎉 Đang chuyển đến cổng thanh toán...');
                window.location.href = r.data.paymentUrl;
                return;
            }
            toast('🎉 Đặt hàng thành công!');
            router.push(`/orders/${r.data.ma_donhang}`);
        } catch (e: any) {
            toast(e.response?.data?.message || 'Lỗi đặt hàng, vui lòng thử lại', 'error');
            setSubmitting(false);
        }
    };

    const tong = items.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0);
    const tongSauGiam = discount ? tong - Number(discount.so_tien_giam) : tong;

    const getProductImage = (item: any) => {
        const product = item.sanpham;
        if (!product?.hinhanh?.length) return '/placeholder-bike.jpg';
        if (item.mau_chon) {
            const found = product.hinhanh.find((img: any) =>
                img.mau_sac?.toLowerCase().trim() === item.mau_chon.toLowerCase().trim()
            );
            if (found) return getImageUrl(found.image_url);
        }
        const main = product.hinhanh.find((i: any) => i.is_main === 1) || product.hinhanh[0];
        return getImageUrl(main.image_url);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid rgba(var(--primary-rgb),0.2)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Đang tải trang thanh toán...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-elevated)', color: 'var(--text)' }}>
            {/* ─── HEADER ─── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                    {/* Nút quay lại */}
                    <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                        <ChevronLeft size={18} />
                        Giỏ hàng
                    </Link>
                    {/* Logo / Tiêu đề */}
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px', textDecoration: 'none', background: 'linear-gradient(135deg, var(--primary), #e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            MOTOSHOP
                        </Link>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '2px' }}>Thanh toán</p>
                    </div>
                    {/* Badge bảo mật */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: '#10b981' }}>
                        <ShieldCheck size={16} />
                        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>Bảo mật SSL</span>
                    </div>
                </div>
                {/* Thanh progress */}
                <div style={{ height: '3px', background: 'rgba(0,0,0,0.04)' }}>
                    <div style={{ height: '100%', width: '66%', background: 'linear-gradient(90deg, var(--primary), #e11d48)', borderRadius: '0 4px 4px 0', transition: 'width 0.5s ease' }} />
                </div>
            </header>

            {/* ─── MAIN CONTENT ─── */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
                {/* Tiêu đề trang */}
                <div style={{ marginBottom: '36px' }}>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '28px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
                        Xác nhận đơn hàng
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Vui lòng kiểm tra thông tin và hoàn tất thanh toán
                    </p>
                </div>

                <form onSubmit={handleOrder}>
                    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>
                        {/* ═══════════ CỘT TRÁI ═══════════ */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Card: Thông tin giao hàng */}
                            <div className="checkout-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 28px', background: 'rgba(var(--primary-rgb), 0.12)', borderBottom: '2px solid rgba(var(--primary-rgb), 0.25)' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(var(--primary-rgb),0.15)', boxShadow: '0 2px 8px rgba(var(--primary-rgb),0.05)' }}>
                                        <Truck size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <h2 style={{ fontWeight: 800, fontSize: '16px', margin: 0, color: 'var(--text)' }}>Thông tin giao hàng</h2>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Điền đầy đủ để đảm bảo giao hàng chính xác</p>
                                    </div>
                                </div>

                                <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    {/* Tên người nhận */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                            <User size={12} /> Người nhận <span style={{ color: 'var(--primary)' }}>*</span>
                                        </label>
                                        <input
                                            required
                                            className="input-field checkout-input"
                                            placeholder="Họ và tên"
                                            value={form.ten_nguoi_nhan}
                                            onChange={e => setForm({ ...form, ten_nguoi_nhan: e.target.value })}
                                            style={{ color: 'var(--text)', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '14px', padding: '14px 16px', transition: 'all 0.2s' }}
                                        />
                                    </div>

                                    {/* Số điện thoại */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                            <Phone size={12} /> Số điện thoại <span style={{ color: 'var(--primary)' }}>*</span>
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="input-field checkout-input"
                                            placeholder="0 xxx xxx xxx"
                                            value={form.sdt_nguoi_nhan}
                                            onChange={e => setForm({ ...form, sdt_nguoi_nhan: e.target.value })}
                                            style={{ color: 'var(--text)', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '14px', padding: '14px 16px', transition: 'all 0.2s' }}
                                        />
                                    </div>

                                    {/* Địa chỉ - full width */}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                            <MapPin size={12} /> Địa chỉ giao hàng <span style={{ color: 'var(--primary)' }}>*</span>
                                        </label>
                                        <input
                                            required
                                            className="input-field checkout-input"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                            value={form.dia_chi_giao}
                                            onChange={e => setForm({ ...form, dia_chi_giao: e.target.value })}
                                            style={{ color: 'var(--text)', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '14px', padding: '14px 16px', transition: 'all 0.2s' }}
                                        />
                                    </div>

                                    {/* Ghi chú - full width */}
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                            <MessageSquare size={12} /> Ghi chú <span style={{ color: 'var(--text-muted)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(Tùy chọn)</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            className="input-field checkout-input"
                                            placeholder="Lời nhắn cho cửa hàng hoặc shipper..."
                                            value={form.ghi_chu}
                                            onChange={e => setForm({ ...form, ghi_chu: e.target.value })}
                                            style={{ color: 'var(--text)', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '14px', padding: '14px 16px', resize: 'none', transition: 'all 0.2s' }}
                                        />
                                    </div>
                                </div>
                            </div>

                             {/* Card: Phương thức thanh toán */}
                            <div className="checkout-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 28px', background: 'rgba(37, 99, 235, 0.12)', borderBottom: '2px solid rgba(37, 99, 235, 0.25)' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(37, 99, 235, 0.15)', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)' }}>
                                        <CreditCard size={18} color="#2563eb" />
                                    </div>
                                    <div>
                                        <h2 style={{ fontWeight: 800, fontSize: '16px', margin: 0, color: 'var(--text)' }}>Phương thức thanh toán</h2>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Chọn hình thức thanh toán phù hợp</p>
                                    </div>
                                </div>

                                <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    {PAYMENT_METHODS.map(p => {
                                        const isSelected = form.phuong_thuc_TT === p.id;
                                        const Icon = p.icon;
                                        return (
                                            <label key={p.id} className="payment-method-item" style={{
                                                display: 'flex', alignItems: 'center', gap: '14px', padding: '18px',
                                                borderRadius: '12px', border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.15)'}`,
                                                background: isSelected ? 'rgba(var(--primary-rgb), 0.04)' : '#f8fafc',
                                                cursor: 'pointer', transition: 'all 0.3s ease',
                                                boxShadow: isSelected ? '0 8px 16px rgba(var(--primary-rgb),0.08)' : 'none',
                                            }}>
                                                <input type="radio" name="payment" value={p.id} checked={isSelected} onChange={() => setForm({ ...form, phuong_thuc_TT: p.id })} style={{ display: 'none' }} />
                                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: isSelected ? p.color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
                                                    <Icon size={22} color={isSelected ? '#fff' : 'var(--text-muted)'} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 800, fontSize: '14px', margin: 0, color: isSelected ? 'var(--primary)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 500 }}>{p.desc}</p>
                                                </div>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s', background: '#fff' }}>
                                                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', animation: 'scaleIn 0.2s ease-out' }} />}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ═══════════ CỘT PHẢI ═══════════ */}
                        <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Card: Đơn hàng */}
                            <div className="checkout-card" style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}>
                                {/* Header card */}
                                <div style={{ background: 'rgba(var(--primary-rgb), 0.12)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid rgba(var(--primary-rgb), 0.25)' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(var(--primary-rgb),0.15)', boxShadow: '0 2px 6px rgba(var(--primary-rgb),0.05)' }}>
                                        <Package size={18} color="var(--primary)" />
                                    </div>
                                    <h3 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '16px', margin: 0 }}>
                                        Đơn hàng ({items.length} món)
                                    </h3>
                                </div>

                                {/* Danh sách SP */}
                                <div className="checkout-product-list" style={{ maxHeight: '300px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {items.map((item: any) => (
                                        <div key={item.ma_CTGH} className="checkout-item" style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '8px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <img src={getProductImage(item)} alt={item.sanpham?.ten_sanpham} 
                                                    style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.12)' }}
                                                />
                                                <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(var(--primary-rgb),0.2)' }}>
                                                    {item.so_luong}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 700, fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>{item.sanpham?.ten_sanpham}</p>
                                                {item.mau_chon && (
                                                    <span style={{ display: 'inline-block', marginTop: '6px', background: '#f1f5f9', color: '#64748b', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        {item.mau_chon}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)', flexShrink: 0 }}>
                                                {formatPrice(Number(item.gia_hien_tai) * item.so_luong)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Separator */}
                                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 24px' }} />

                                {/* Mã giảm giá */}
                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <Tag size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: coupon ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.3s' }} />
                                            <input
                                                className="input-field checkout-input"
                                                placeholder="Nhập mã giảm giá"
                                                value={coupon}
                                                onChange={e => { setCoupon(e.target.value); setCouponErr(''); }}
                                                style={{ width: '100%', padding: '12px 16px 12px 44px', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)' }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={applyCode}
                                            disabled={!coupon.trim()}
                                            style={{
                                                padding: '10px 16px', borderRadius: '12px', border: '1.5px solid var(--primary)',
                                                background: coupon.trim() ? 'var(--primary)' : 'transparent',
                                                color: coupon.trim() ? '#fff' : 'var(--primary)',
                                                fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                                                transition: 'all 0.2s', whiteSpace: 'nowrap',
                                                opacity: !coupon.trim() ? 0.5 : 1,
                                            }}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {couponErr && <p style={{ fontSize: '12px', color: 'var(--primary)', margin: 0 }}>⚠️ {couponErr}</p>}
                                    {discount && (
                                        <p style={{ fontSize: '12px', color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CheckCircle2 size={13} /> Giảm {formatPrice(Number(discount.so_tien_giam))} đã được áp dụng
                                        </p>
                                    )}
                                </div>

                                {/* Tổng tiền */}
                                <div style={{ padding: '0 20px 20px' }}>
                                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <span>Tạm tính ({items.length} món)</span>
                                            <span style={{ fontWeight: 600 }}>{formatPrice(tong)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10b981' }}>
                                            <span>Phí vận chuyển</span>
                                            <span style={{ fontWeight: 700 }}>Miễn phí</span>
                                        </div>
                                        {discount && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10b981' }}>
                                                <span>Giảm giá</span>
                                                <span style={{ fontWeight: 700 }}>-{formatPrice(Number(discount.so_tien_giam))}</span>
                                            </div>
                                        )}
                                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)', margin: '4px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800, fontSize: '15px' }}>Tổng cộng</span>
                                            <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--primary)' }}>{formatPrice(tongSauGiam)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '0 20px 20px' }}>
                                    <button
                                        type="submit"
                                        disabled={submitting || items.length === 0}
                                        className="order-submit-btn"
                                        style={{
                                            width: '100%', padding: '18px', borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, #e11d48 100%)',
                                            color: '#fff', border: 'none', fontWeight: 900, fontSize: '16px',
                                            fontFamily: "'Outfit', sans-serif", letterSpacing: '0.8px',
                                            cursor: submitting ? 'wait' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                            boxShadow: '0 10px 30px rgba(var(--primary-rgb), 0.35)',
                                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                            opacity: (submitting || items.length === 0) ? 0.7 : 1,
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                Đang đặt hàng...
                                            </>
                                        ) : (
                                            <>
                                                XÁC NHẬN ĐẶT HÀNG
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { icon: ShieldCheck, text: 'Bảo mật SSL 256-bit', color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)' },
                                    { icon: Truck, text: 'Giao hàng 1-3 ngày', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.05)' },
                                ].map(({ icon: Icon, text, color, bg }) => (
                                    <div key={text} className="trust-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: bg, borderRadius: '12px', border: `1px solid ${color}20`, transition: 'all 0.3s' }}>
                                        <Icon size={16} color={color} />
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text}</span>
                                    </div>
                                ))}
                            </div>

                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.7', padding: '0 12px' }}>
                                Bằng cách đặt hàng, bạn đồng ý với{' '}
                                <Link href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Điều khoản dịch vụ</Link>
                                {' '}và{' '}
                                <Link href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Chính sách bảo mật</Link>
                                {' '}của MotoShop.
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .checkout-grid {
                    transition: all 0.3s ease;
                }

                @media (max-width: 1024px) {
                    .checkout-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .checkout-grid > div:last-child {
                        position: static !important;
                    }
                }

                .checkout-card {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .checkout-card:hover {
                    border-color: rgba(var(--primary-rgb), 0.3) !important;
                    box-shadow: 0 20px 48px rgba(0,0,0,0.08) !important;
                    transform: translateY(-4px);
                }
                
                .checkout-input:focus {
                    background: #fff !important;
                    border-color: var(--primary) !important;
                    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.12) !important;
                }
                
                .payment-method-item {
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .payment-method-item:hover:not(:has(input:checked)) {
                    border-color: rgba(0,0,0,0.2) !important;
                    background: #fff !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.04);
                }
                
                .checkout-item {
                    transition: background 0.2s;
                }
                .checkout-item:hover {
                    background: #f8fafc;
                }
                
                .trust-badge {
                    transition: all 0.3s;
                }
                .trust-badge:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
                }

                .order-submit-btn {
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
                }

                .order-submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 40px rgba(var(--primary-rgb), 0.4) !important;
                    filter: brightness(1.1);
                }

                .order-submit-btn:active:not(:disabled) {
                    transform: translateY(0) scale(0.98);
                }

                /* Scrollbar cho danh sách sản phẩm */
                .checkout-product-list::-webkit-scrollbar {
                    width: 5px;
                }
                .checkout-product-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .checkout-product-list::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 10px;
                }
                .checkout-product-list::-webkit-scrollbar-thumb:hover {
                    background: #ccc;
                }
            `}</style>
        </div>
    );
}
