'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap, ShieldCheck } from 'lucide-react';
import { wishlistApi, cartApi } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { useState } from 'react';

interface Product {
    ma_sanpham: number;
    ten_sanpham: string;
    gia: number;
    kieu_giam_gia: string;
    gia_tri_giam: number;
    diem_danh_gia: number;
    kieu_xe: string;
    loai_nhien_lieu: string;
    dung_tich_dong_co: string;
    ton_kho?: number;
    hinhanh?: { image_url: string; is_main: number }[];
    thuonghieu?: { ten_thuonghieu: string };
}

function calcPrice(p: Product) {
    if (!p.gia_tri_giam) return Number(p.gia);
    if (p.kieu_giam_gia === 'percentage') return Math.round(Number(p.gia) * (1 - Number(p.gia_tri_giam) / 100));
    return Math.round(Number(p.gia) - Number(p.gia_tri_giam));
}
function formatPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

const kieuxeConfig: Record<string, { label: string; color: string; bg: string }> = {
    xe_so: { label: 'Xe số', color: '#b45309', bg: '#fffbeb' },
    xe_ga: { label: 'Xe ga', color: '#1d4ed8', bg: '#eff6ff' },
    xe_con_tay: { label: 'Côn tay', color: '#7e22ce', bg: '#faf5ff' },
    xe_dien: { label: '⚡ Điện', color: '#047857', bg: '#ecfdf5' },
    phan_khoi_lon: { label: '🔥 PKL', color: '#be123c', bg: '#fff1f2' },
};

export default function ProductCard({ product }: { product: Product }) {
    const mainImg = product.hinhanh?.find(h => h.is_main) || product.hinhanh?.[0];
    const salePrice = calcPrice(product);
    const hasDiscount = Number(product.gia_tri_giam) > 0;
    const discountPercent = product.kieu_giam_gia === 'percentage'
        ? product.gia_tri_giam
        : Math.round((Number(product.gia_tri_giam) / Number(product.gia)) * 100);

    const { user } = useAuthStore();
    const setCart = useCartStore(s => s.setCart);
    const { add: toast } = useToast();
    const [adding, setAdding] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [hover, setHover] = useState(false);

    const kxCfg = kieuxeConfig[product.kieu_xe] || { label: product.kieu_xe, color: '#475569', bg: '#f1f5f9' };

    const handleAddCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        setAdding(true);
        try {
            const res = await cartApi.addItem({ ma_sanpham: product.ma_sanpham, so_luong: 1 });
            setCart(res.data.chitietgiohang || []);
            toast(`Đã thêm "${product.ten_sanpham}" vào giỏ hàng!`);
        } catch (err: any) {
            toast(err.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng', 'error');
        } finally { setAdding(false); }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        try {
            await wishlistApi.toggle(product.ma_sanpham);
            setWishlisted(w => !w);
            toast(wishlisted ? 'Đã xóa khỏi danh sách yêu thích' : '❤️ Đã thêm vào danh sách yêu thích', wishlisted ? 'info' : 'success');
        } catch { toast('Lỗi khi cập nhật danh sách yêu thích', 'error'); }
    };

    return (
        <Link href={`/products/${product.ma_sanpham}`} style={{ textDecoration: 'none' }}>
            <div
                className="premium-card glass-shine"
                style={{
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: '34px',
                    border: hover ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                    transform: hover ? 'translateY(-10px)' : 'none',
                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    background: 'white'
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {/* Image Section */}
                <div style={{ position: 'relative', paddingTop: '75%', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <img
                        src={mainImg ? `http://localhost:3001${mainImg.image_url}` : '/placeholder-bike.jpg'}
                        alt={product.ten_sanpham}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: hover ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.8s'
                        }}
                    />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 2 }}>
                        {hasDiscount && (
                            <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 900, boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)' }}>
                                -{discountPercent}%
                            </div>
                        )}
                        {product.ton_kho === 0 && (
                            <div style={{ background: '#0f172a', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 900 }}>
                                Hết hàng
                            </div>
                        )}
                    </div>

                    {/* Category Pin */}
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: kxCfg.bg, color: kxCfg.color, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 900, border: `1px solid ${kxCfg.color}20`, zIndex: 2 }}>
                        {kxCfg.label}
                    </div>

                    {/* Wishlist Button */}
                    <button onClick={handleWishlist}
                        style={{ position: 'absolute', bottom: '16px', right: '16px', width: '44px', height: '44px', background: wishlisted ? 'var(--primary)' : 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: wishlisted ? 'white' : 'var(--secondary)', boxShadow: 'var(--shadow-lg)', zIndex: 3, transition: 'all 0.3s' }}>
                        <Heart size={18} fill={wishlisted ? 'white' : 'none'} />
                    </button>

                    {/* Fuel Indicator */}
                    {product.loai_nhien_lieu === 'dien' && (
                        <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #ecfdf5' }}>
                            <Zap size={14} color="#10b981" />
                            <span style={{ fontSize: '11px', color: '#047857', fontWeight: 900 }}>ĐỘNG CƠ ĐIỆN ECO</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        {product.thuonghieu && (
                            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {product.thuonghieu.ten_thuonghieu}
                            </span>
                        )}
                        <span style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'var(--border)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--secondary)' }}>{product.diem_danh_gia || 5.0}</span>
                        </div>
                    </div>

                    <h3 style={{
                        fontSize: '19px',
                        fontWeight: 900,
                        color: 'var(--secondary)',
                        marginBottom: '12px',
                        lineHeight: 1.25,
                        height: '48px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        {product.ten_sanpham.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
                        <ShieldCheck size={14} /> Có bảo hành chính hãng
                    </div>

                    {/* Price & Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                        <div>
                            <div className="price-tag">
                                {formatPrice(salePrice)}
                            </div>
                            {hasDiscount && (
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>
                                    {formatPrice(Number(product.gia))}
                                </div>
                            )}
                        </div>

                        <button
                            className={`btn-premium ${adding ? 'btn-secondary' : 'btn-primary'}`}
                            style={{
                                width: '48px',
                                height: '48px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                opacity: product.ton_kho === 0 ? 0.5 : 1,
                                border: 'none'
                            }}
                            onClick={handleAddCart}
                            disabled={adding || product.ton_kho === 0}
                        >
                            {adding ? <div className="loader" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <ShoppingCart size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </Link>
    );
}
