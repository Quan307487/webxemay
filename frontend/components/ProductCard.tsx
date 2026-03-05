'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
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
    xe_so: { label: 'Xe số', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
    xe_ga: { label: 'Xe ga', color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
    xe_con_tay: { label: 'Côn tay', color: '#c084fc', bg: 'rgba(168,85,247,0.15)' },
    xe_dien: { label: '⚡ Điện', color: '#4ade80', bg: 'rgba(16,185,129,0.15)' },
    phan_khoi_lon: { label: '🔥 PKL', color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
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
    const [imgHover, setImgHover] = useState(false);

    const kxCfg = kieuxeConfig[product.kieu_xe] || { label: product.kieu_xe, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };

    const handleAddCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        setAdding(true);
        try {
            const res = await cartApi.addItem({ ma_sanpham: product.ma_sanpham, so_luong: 1 });
            setCart(res.data.chitietgiohang || []);
            toast(`Đã thêm "${product.ten_sanpham}" vào giỏ hàng!`);
        } catch (err: any) {
            toast(err.response?.data?.message || 'Lỗi thêm vào giỏ', 'error');
        } finally { setAdding(false); }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        try {
            await wishlistApi.toggle(product.ma_sanpham);
            setWishlisted(w => !w);
            toast(wishlisted ? 'Đã xóa khỏi yêu thích' : '❤️ Đã thêm vào danh sách yêu thích', wishlisted ? 'info' : 'success');
        } catch { toast('Lỗi cập nhật wishlist', 'error'); }
    };

    return (
        <Link href={`/products/${product.ma_sanpham}`} style={{ textDecoration: 'none' }}>
            <div className="product-card animate-fadeInUp" style={{ position: 'relative' }}>
                {/* Image */}
                <div className="product-card-img-wrapper">
                    <img
                        src={mainImg ? `http://localhost:3001${mainImg.image_url}` : '/placeholder-bike.jpg'}
                        alt={product.ten_sanpham}
                        onMouseEnter={() => setImgHover(true)}
                        onMouseLeave={() => setImgHover(false)}
                        style={{ transform: imgHover ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                    />

                    {/* Top badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {hasDiscount && (
                            <span className="discount-badge">-{discountPercent}%</span>
                        )}
                        {product.ton_kho === 0 && (
                            <span style={{ background: 'rgba(0,0,0,0.75)', color: '#f87171', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* Kiểu xe badge */}
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: kxCfg.bg, color: kxCfg.color, padding: '5px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, backdropFilter: 'blur(8px)', border: `1px solid ${kxCfg.color}25` }}>
                        {kxCfg.label}
                    </span>

                    {/* Wishlist */}
                    <button onClick={handleWishlist}
                        style={{ position: 'absolute', bottom: '12px', right: '12px', background: wishlisted ? 'rgba(230,57,70,0.9)' : 'rgba(0,0,0,0.65)', border: wishlisted ? '1px solid rgba(230,57,70,0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', transition: 'all 0.25s', backdropFilter: 'blur(8px)' }}>
                        <Heart size={15} fill={wishlisted ? 'white' : 'none'} />
                    </button>

                    {/* Electric indicator */}
                    {product.loai_nhien_lieu === 'dien' && (
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)' }}>
                            <Zap size={11} color="#4ade80" />
                            <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700 }}>ELECTRIC</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, rgba(6,11,24,0.6))' }} />
                </div>

                {/* Body */}
                <div className="product-card-body">
                    {product.thuonghieu && (
                        <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            {product.thuonghieu.ten_thuonghieu}
                        </p>
                    )}
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'white', marginBottom: '10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
                        {product.ten_sanpham}
                    </h3>

                    {product.dung_tich_dong_co && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>
                            🔧 {product.dung_tich_dong_co}
                        </p>
                    )}

                    {/* Rating */}
                    {product.diem_danh_gia > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={11} fill={i < Math.round(product.diem_danh_gia) ? '#f59e0b' : 'none'} color={i < Math.round(product.diem_danh_gia) ? '#f59e0b' : '#334155'} />
                                ))}
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {Number(product.diem_danh_gia).toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Price + CTA */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                            <div className="price-tag">{formatPrice(salePrice)}</div>
                            {hasDiscount && <div className="price-original">{formatPrice(Number(product.gia))}</div>}
                        </div>
                        <button
                            className="btn-primary"
                            style={{ padding: '10px 16px', fontSize: '12px', borderRadius: '12px', flexShrink: 0, gap: '6px', opacity: (adding || product.ton_kho === 0) ? 0.6 : 1 }}
                            onClick={handleAddCart}
                            disabled={adding || product.ton_kho === 0}
                        >
                            <ShoppingCart size={13} />
                            {adding ? '...' : product.ton_kho === 0 ? 'Hết' : 'Thêm'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
