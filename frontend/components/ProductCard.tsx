'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap, BadgeCheck, Eye } from 'lucide-react';
import { wishlistApi, cartApi, getImageUrl } from '@/lib/api';
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
    xe_so:         { label: 'Xe số',   color: '#b45309', bg: '#fffbeb' },
    xe_ga:         { label: 'Xe ga',   color: '#1d4ed8', bg: '#eff6ff' },
    xe_con_tay:    { label: 'Côn tay', color: '#7e22ce', bg: '#faf5ff' },
    xe_dien:       { label: '⚡ Điện', color: '#047857', bg: '#ecfdf5' },
    phan_khoi_lon: { label: '🔥 PKL',  color: '#be123c', bg: '#fff1f2' },
    xe_mo_to:      { label: 'Mô tô',   color: '#0369a1', bg: '#f0f9ff' },
};

export default function ProductCard({ product }: { product: Product }) {
    const mainImg = product.hinhanh?.find(h => h.is_main) || product.hinhanh?.[0];
    const salePrice = calcPrice(product);
    const hasDiscount = Number(product.gia_tri_giam) > 0;
    const discountPercent = product.kieu_giam_gia === 'percentage'
        ? Number(product.gia_tri_giam)
        : Math.round((Number(product.gia_tri_giam) / Number(product.gia)) * 100);
    const outOfStock = product.ton_kho === 0;

    const { user } = useAuthStore();
    const setCart = useCartStore(s => s.setCart);
    const { add: toast } = useToast();
    const [adding, setAdding] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    const kxCfg = kieuxeConfig[product.kieu_xe] || { label: product.kieu_xe, color: '#475569', bg: '#f1f5f9' };

    const handleAddCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        if (outOfStock) return;
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
            toast(wishlisted ? 'Đã xóa khỏi danh sách yêu thích' : '❤️ Đã thêm vào yêu thích', wishlisted ? 'info' : 'success');
        } catch { toast('Lỗi khi cập nhật yêu thích', 'error'); }
    };

    return (
        <Link href={`/products/${product.ma_sanpham}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="pc-root">
                {/* ── Image ── */}
                <div className="pc-img-wrap">
                    <img
                        src={getImageUrl(mainImg?.image_url)}
                        alt={product.ten_sanpham}
                        className="pc-img"
                    />
                    {/* Hover overlay — "Xem chi tiết" */}
                    <div className="pc-overlay">
                        <div className="pc-overlay-btn">
                            <Eye size={16} /> Xem chi tiết
                        </div>
                    </div>

                    {/* Discount badge */}
                    {hasDiscount && (
                        <div className="pc-badge-discount">-{discountPercent}%</div>
                    )}
                    {outOfStock && (
                        <div className="pc-badge-oos">Hết hàng</div>
                    )}

                    {/* Vehicle type pin */}
                    <div className="pc-type-pin" style={{ color: kxCfg.color, background: kxCfg.bg, border: `1px solid ${kxCfg.color}25` }}>
                        {kxCfg.label}
                    </div>

                    {/* Wishlist */}
                    <button onClick={handleWishlist} className={`pc-wish ${wishlisted ? 'pc-wish--active' : ''}`} aria-label="Yêu thích">
                        <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Electric badge */}
                    {product.loai_nhien_lieu === 'dien' && (
                        <div className="pc-eco">
                            <Zap size={13} /> ECO ĐIỆN
                        </div>
                    )}
                </div>

                {/* ── Content ── */}
                <div className="pc-body">
                    {/* Brand + Rating row */}
                    <div className="pc-meta">
                        <span className="pc-brand">{product.thuonghieu?.ten_thuonghieu}</span>
                        {Number(product.diem_danh_gia) > 0 ? (
                            <span className="pc-rating">
                                <Star size={11} fill="#f59e0b" color="#f59e0b" />
                                {Number(product.diem_danh_gia).toFixed(1)}
                            </span>
                        ) : (
                            <span className="pc-new">Mới</span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="pc-name">
                        {product.ten_sanpham.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                    </h3>

                    {/* Warranty */}
                    <div className="pc-warranty">
                        <BadgeCheck size={13} /> Bảo hành chính hãng
                    </div>

                    {/* Price + CTA */}
                    <div className="pc-footer">
                        <div className="pc-price-block">
                            <span className="pc-price">{formatPrice(salePrice)}</span>
                            {hasDiscount && (
                                <span className="pc-price-original">{formatPrice(Number(product.gia))}</span>
                            )}
                        </div>
                        <button
                            className={`pc-cart-btn ${adding ? 'pc-cart-btn--loading' : ''} ${outOfStock ? 'pc-cart-btn--oos' : ''}`}
                            onClick={handleAddCart}
                            disabled={adding || outOfStock}
                            aria-label="Thêm vào giỏ"
                        >
                            {adding
                                ? <div className="pc-spinner" />
                                : <ShoppingCart size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pc-root {
                    background: #fff;
                    border-radius: 24px;
                    border: 1.5px solid #e8edf2;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .pc-root:hover {
                    border-color: var(--primary);
                    transform: translateY(-8px);
                    box-shadow: 0 24px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(var(--primary-rgb), 0.15);
                }
                /* Image */
                .pc-img-wrap {
                    position: relative;
                    padding-top: 68%;
                    background: #f4f7fa;
                    overflow: hidden;
                }
                .pc-img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .pc-root:hover .pc-img { transform: scale(1.07); }

                /* Hover overlay */
                .pc-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(15,23,42,0.35);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 4;
                }
                .pc-root:hover .pc-overlay { opacity: 1; }
                .pc-overlay-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    color: #0f172a;
                    font-size: 13px;
                    font-weight: 800;
                    padding: 10px 20px;
                    border-radius: 14px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                    transform: translateY(8px);
                    transition: transform 0.3s ease;
                    letter-spacing: 0.3px;
                }
                .pc-root:hover .pc-overlay-btn { transform: translateY(0); }

                /* Badges */
                .pc-badge-discount {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background: var(--primary);
                    color: white;
                    padding: 5px 11px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 900;
                    z-index: 5;
                    box-shadow: 0 4px 10px rgba(var(--primary-rgb),0.35);
                }
                .pc-badge-oos {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background: #334155;
                    color: white;
                    padding: 5px 11px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 900;
                    z-index: 5;
                }
                .pc-type-pin {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    padding: 5px 12px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 900;
                    z-index: 5;
                }
                /* Wishlist */
                .pc-wish {
                    position: absolute;
                    bottom: 14px;
                    right: 14px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    color: #94a3b8;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    z-index: 6;
                    transition: all 0.25s;
                }
                .pc-wish:hover, .pc-wish--active { color: var(--primary); background: rgba(var(--primary-rgb),0.08); }

                /* Eco badge */
                .pc-eco {
                    position: absolute;
                    bottom: 14px;
                    left: 14px;
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(6px);
                    border-radius: 8px;
                    padding: 4px 10px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    font-weight: 900;
                    color: #047857;
                    border: 1px solid #d1fae5;
                    z-index: 5;
                }

                /* Body */
                .pc-body {
                    padding: 20px 20px 18px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .pc-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                .pc-brand {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--primary);
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                }
                .pc-rating {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-size: 11px;
                    font-weight: 800;
                    color: #78716c;
                    margin-left: auto;
                }
                .pc-new {
                    margin-left: auto;
                    font-size: 10px;
                    font-weight: 800;
                    color: #10b981;
                    background: #ecfdf5;
                    border: 1px solid #a7f3d0;
                    padding: 2px 8px;
                    border-radius: 8px;
                }
                .pc-name {
                    font-size: 16px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 10px;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-family: 'Outfit', sans-serif;
                    min-height: 42px;
                }
                .pc-warranty {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    margin-bottom: 16px;
                    flex: 1;
                }
                /* Footer — price + cart */
                .pc-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding-top: 14px;
                    border-top: 1px solid #f1f5f9;
                }
                .pc-price-block { display: flex; flex-direction: column; gap: 2px; }
                .pc-price {
                    font-family: 'Outfit', sans-serif;
                    font-size: 20px;
                    font-weight: 900;
                    color: var(--primary);
                    letter-spacing: -0.5px;
                    line-height: 1;
                }
                .pc-price-original {
                    font-size: 12px;
                    color: #94a3b8;
                    text-decoration: line-through;
                    font-weight: 600;
                }
                /* Cart button */
                .pc-cart-btn {
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    border-radius: 14px;
                    border: none;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s;
                    box-shadow: 0 6px 14px rgba(var(--primary-rgb),0.3);
                }
                .pc-cart-btn:hover:not(:disabled) {
                    transform: scale(1.1);
                    box-shadow: 0 8px 20px rgba(var(--primary-rgb),0.4);
                }
                .pc-cart-btn--loading { background: #94a3b8; box-shadow: none; cursor: wait; }
                .pc-cart-btn--oos    { background: #e2e8f0; box-shadow: none; cursor: not-allowed; color: #94a3b8; }
                /* Spinner */
                .pc-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: pc-spin 0.7s linear infinite;
                }
                @keyframes pc-spin { to { transform: rotate(360deg); } }
            `}</style>
        </Link>
    );
}
