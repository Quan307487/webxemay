'use client';
import { useState, useEffect } from 'react';
import { wishlistApi, cartApi } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductsGridSkeleton } from '@/components/Skeleton';

function formatPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }
function calcPrice(p: any) {
    if (!p.gia_tri_giam) return Number(p.gia);
    if (p.kieu_giam_gia === 'percentage') return Math.round(Number(p.gia) * (1 - Number(p.gia_tri_giam) / 100));
    return Math.round(Number(p.gia) - Number(p.gia_tri_giam));
}

export default function WishlistPage() {
    const { user, _hasHydrated } = useAuthStore();
    const setCart = useCartStore(s => s.setCart);
    const router = useRouter();
    const { add: toast } = useToast();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingMap, setAddingMap] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login'); return; }
        wishlistApi.getAll()
            .then(r => setItems(r.data || []))
            .catch(() => toast('Không thể tải danh sách yêu thích', 'error'))
            .finally(() => setLoading(false));
    }, [_hasHydrated]);

    const removeItem = async (id: number) => {
        try {
            await wishlistApi.remove(id);
            setItems(prev => prev.filter(i => i.ma_dsyeuthich !== id));
            toast('Đã xóa khỏi danh sách yêu thích', 'info');
        } catch { toast('Lỗi khi xóa', 'error'); }
    };

    const addToCart = async (item: any) => {
        const pid = item.sanpham?.ma_sanpham;
        setAddingMap(p => ({ ...p, [pid]: true }));
        try {
            const r = await cartApi.addItem({ ma_sanpham: pid, so_luong: 1 });
            setCart(r.data.chitietgiohang || []);
            toast(`Đã thêm ${item.sanpham?.ten_sanpham} vào giỏ!`);
        } catch (e: any) { toast(e.response?.data?.message || 'Lỗi thêm vào giỏ', 'error'); }
        finally { setAddingMap(p => ({ ...p, [pid]: false })); }
    };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px', minHeight: '70vh' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>❤️ Danh sách yêu thích</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{items.length} sản phẩm</p>

                {loading ? <ProductsGridSkeleton count={4} /> : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
                        <Heart size={64} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
                        <p style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Chưa có sản phẩm yêu thích</p>
                        <p style={{ fontSize: '14px', marginBottom: '24px' }}>Hãy thêm những mẫu xe bạn thích vào đây!</p>
                        <Link href="/products"><button className="btn-primary">🏍 Khám phá ngay</button></Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {items.map((item: any) => {
                            const p = item.sanpham;
                            if (!p) return null;
                            const salePrice = calcPrice(p);
                            const hasDiscount = Number(p.gia_tri_giam) > 0;
                            const mainImg = p.hinhanh?.find((h: any) => h.is_main) || p.hinhanh?.[0];
                            return (
                                <div key={item.ma_dsyeuthich} className="product-card" style={{ position: 'relative' }}>
                                    <button onClick={() => removeItem(item.ma_dsyeuthich)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444', zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                                        <Trash2 size={13} />
                                    </button>
                                    <Link href={`/products/${p.ma_sanpham}`} style={{ textDecoration: 'none' }}>
                                        <img src={mainImg ? `http://localhost:3001${mainImg.image_url}` : '/placeholder-bike.jpg'} alt={p.ten_sanpham} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                        <div className="product-card-body">
                                            {p.thuonghieu && <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>{p.thuonghieu.ten_thuonghieu}</p>}
                                            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--text)' }}>{p.ten_sanpham}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                                <Star size={13} fill="#eab308" color="#eab308" />
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{Number(p.diem_danh_gia).toFixed(1)}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span className="price-tag">{formatPrice(salePrice)}</span>
                                                    {hasDiscount && <p className="price-original">{formatPrice(Number(p.gia))}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div style={{ padding: '0 16px 16px' }}>
                                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
                                            onClick={() => addToCart(item)} disabled={addingMap[p.ma_sanpham]}>
                                            <ShoppingCart size={14} /> {addingMap[p.ma_sanpham] ? 'Đang thêm...' : 'Thêm vào giỏ'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
