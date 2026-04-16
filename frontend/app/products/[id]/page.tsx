'use client';
import { use, useState, useEffect } from 'react';
import { productsApi, reviewsApi, cartApi, wishlistApi, getImageUrl } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/components/Toast';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

function formatPrice(n: number) { return n?.toLocaleString('vi-VN') + 'đ'; }

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: ma_sanpham } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [related, setRelated] = useState<any[]>([]);
    const [imgIdx, setImgIdx] = useState(0);
    const [adding, setAdding] = useState(false);
    const [qty, setQty] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('specs');
    const [reviewForm, setReviewForm] = useState({ diem_danhgia: 5, tieu_de: '', viet_danhgia: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const { user } = useAuthStore();
    const setCart = useCartStore(s => s.setCart);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const { add: toast } = useToast();

    useEffect(() => {
        if (!ma_sanpham) return;
        productsApi.getOne(Number(ma_sanpham)).then(r => {
            setProduct(r.data);
            // Load related products
            const p = r.data;
            productsApi.getAll({ ma_danhmuc: p.ma_danhmuc, limit: 4, active: '1' })
                .then(res => setRelated((res.data.data || []).filter((x: any) => x.ma_sanpham !== Number(ma_sanpham))));
        });
        reviewsApi.getByProduct(Number(ma_sanpham)).then(r => setReviews(r.data));
    }, [ma_sanpham]);

    if (!product) return (
        <>
            <Navbar />
            <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ width: '50px', height: '50px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                Đang tải...
            </div>
        </>
    );

    // Sắp xếp để is_main=1 luôn đứng đầu
    const imgs = [...(product.hinhanh || [])].sort((a: any, b: any) => b.is_main - a.is_main);
    const mainImg = imgs[imgIdx]?.image_url || imgs.find((h: any) => h.is_main)?.image_url;
    const salePrice = product.gia_tri_giam > 0
        ? (product.kieu_giam_gia === 'percentage' ? Math.round(Number(product.gia) * (1 - Number(product.gia_tri_giam) / 100)) : Math.round(Number(product.gia) - Number(product.gia_tri_giam)))
        : Number(product.gia);

    const handleCart = async () => {
        if (!user) { window.location.href = '/auth/login'; return; }
        if (product.mau_sac && !selectedColor) { toast('Vui lòng chọn màu sắc', 'warning'); return; }
        setAdding(true);
        try {
            const r = await cartApi.addItem({ ma_sanpham: product.ma_sanpham, so_luong: qty, mau_chon: selectedColor || undefined });
            setCart(r.data.chitietgiohang || []);
            toast(`✅ Đã thêm ${qty} xe vào giỏ hàng!`);
        } catch (e: any) { toast(e.response?.data?.message || 'Lỗi thêm vào giỏ', 'error'); }
        finally { setAdding(false); }
    };

    const handleWishlist = async () => {
        if (!user) { window.location.href = '/auth/login'; return; }
        await wishlistApi.toggle(product.ma_sanpham);
        setInWishlist(!inWishlist);
        toast(inWishlist ? 'Đã xóa khỏi yêu thích' : '❤️ Đã thêm vào danh sách yêu thích', inWishlist ? 'info' : 'success');
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewForm.viet_danhgia.trim()) { toast('Vui lòng nhập nội dung đánh giá', 'warning'); return; }
        setSubmittingReview(true);
        try {
            await reviewsApi.create({ ma_sanpham: product.ma_sanpham, ...reviewForm });
            toast('Đánh giá của bạn đang chờ duyệt!', 'success');
            setReviewForm({ diem_danhgia: 5, tieu_de: '', viet_danhgia: '' });
            const r = await reviewsApi.getByProduct(Number(ma_sanpham));
            setReviews(r.data);
        } catch (e: any) { toast(e.response?.data?.message || 'Lỗi gửi đánh giá', 'error'); }
        finally { setSubmittingReview(false); }
    };

    const specs = [
        ['Loại xe', ({ xe_so: 'Xe số', xe_ga: 'Xe ga', xe_con_tay: 'Côn tay', xe_mo_to: 'Xe mô tô', xe_dien: 'Xe điện', phan_khoi_lon: 'PKL' } as Record<string, string>)[product.kieu_xe] || product.kieu_xe],
        ['Dung tích động cơ', product.dung_tich_dong_co],
        ['Nhiên liệu', ({ xang: 'Xăng', dien: '⚡ Điện', hybrid: 'Hybrid' } as Record<string, string>)[product.loai_nhien_lieu]],
        ['Hộp số', ({ so_tay: 'Số tay (4 cấp)', so_tay_6: 'Số tay (6 cấp)', con_tay: 'Côn tay', tu_dong: 'Tự động', vo_cap: 'Vô cấp (CVT)', ban_tu_dong: 'Bán tự động', khong_hop_so: 'Không hộp số' } as Record<string, string>)[product.hop_so]],
        ['Công suất tối đa', product.cong_suat_toi_da],
        ['Mô men xoắn', product.momen_xoan_toi_da],
        ['Hệ thống phanh', ({ trong: 'Phanh trống', dia: 'Phanh đĩa', trong_truoc_dia_sau: 'Trống trước - Đĩa sau', abs: 'ABS' } as Record<string, string>)[product.he_thong_phanhang]],
        ['Trọng lượng khô', product.trong_luong_kho ? `${product.trong_luong_kho} kg` : null],
        ['Dung tích bình xăng', product.dung_tich_binh_xang ? `${product.dung_tich_binh_xang} L` : null],
        ['Cỡ lốp trước', product.kich_co_lop_truoc],
        ['Cỡ lốp sau', product.kich_co_lop_sau],
        ['Năm sản xuất', product.nam_san_xuat],
        ['Xuất xứ', product.xuat_xu],
        ['Màu sắc', product.mau_sac],
    ].filter(([, v]) => v);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trang chủ</Link>
                    <span>/</span>
                    <Link href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Xe máy</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--text)' }}>{product.ten_sanpham}</span>
                </div>

                {/* Main product area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
                    {/* Images */}
                    <div>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', position: 'relative', aspectRatio: '4/3' }}>
                            <img src={getImageUrl(mainImg)} alt={product.ten_sanpham} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                            {imgs.length > 1 && (
                                <>
                                    <button onClick={() => setImgIdx(Math.max(0, imgIdx - 1))} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}><ChevronLeft size={18} /></button>
                                    <button onClick={() => setImgIdx(Math.min(imgs.length - 1, imgIdx + 1))} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}><ChevronRight size={18} /></button>
                                    <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                                        {imgs.map((_: any, i: number) => (
                                            <button key={i} onClick={() => setImgIdx(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: i === imgIdx ? 'var(--primary)' : 'rgba(255,255,255,0.4)', padding: 0, transition: 'all 0.2s' }} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {imgs.length > 1 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {imgs.map((img: any, i: number) => (
                                    <div key={img.ma_anh} style={{ position: 'relative' }}>
                                        <img src={getImageUrl(img.image_url)} alt="" 
                                            onClick={() => {
                                                setImgIdx(i);
                                                if (img.mau_sac) setSelectedColor(img.mau_sac);
                                            }}
                                            style={{ width: '72px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: `2px solid ${i === imgIdx ? 'var(--primary)' : 'var(--border)'}`, opacity: i === imgIdx ? 1 : 0.6, transition: 'all 0.2s' }} />
                                        {img.mau_sac && <span style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '8px', textAlign: 'center', borderRadius: '4px', padding: '2px', fontWeight: 700, pointerEvents: 'none' }}>{img.mau_sac}</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        {product.thuonghieu && <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>{product.thuonghieu.ten_thuonghieu}</p>}
                        <h1 style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>{product.ten_sanpham}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex' }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(Number(product.diem_danh_gia)) ? '#eab308' : 'transparent'} color="#eab308" />)}</div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{Number(product.diem_danh_gia).toFixed(1)} ({reviews.length} đánh giá)</span>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <span className="price-tag" style={{ fontSize: '32px' }}>{formatPrice(salePrice)}</span>
                            {product.gia_tri_giam > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                    <p className="price-original" style={{ fontSize: '18px' }}>{formatPrice(Number(product.gia))}</p>
                                    <span className="discount-badge">{product.kieu_giam_gia === 'percentage' ? `-${product.gia_tri_giam}%` : `Giảm ${formatPrice(Number(product.gia_tri_giam))}`}</span>
                                </div>
                            )}
                        </div>

                        {/* Color Selection */}
                        {product.mau_sac && (
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>Chọn màu sắc</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {product.mau_sac.split(',').map((c: string) => {
                                        const color = c.trim();
                                        const isSelected = selectedColor === color;
                                        return (
                                            <button key={color} 
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    // Tìm ảnh đầu tiên có màu này
                                                    const firstImgIdx = imgs.findIndex((img: any) => img.mau_sac && img.mau_sac.toLowerCase().includes(color.toLowerCase()));
                                                    if (firstImgIdx !== -1) setImgIdx(firstImgIdx);
                                                }}
                                                style={{ 
                                                    padding: '10px 18px', borderRadius: '12px', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                                    background: isSelected ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-card)',
                                                    color: isSelected ? 'var(--primary)' : 'var(--text)',
                                                    fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                                }}>
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock */}
                        <div style={{ background: product.ton_kho > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${product.ton_kho > 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tình trạng</span>
                            <span style={{ fontWeight: 700, color: product.ton_kho > 0 ? '#22c55e' : '#ef4444' }}>{product.ton_kho > 0 ? `✅ Còn ${product.ton_kho} xe` : '❌ Hết hàng'}</span>
                        </div>

                        {/* Qty */}
                        {product.ton_kho > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Số lượng:</span>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '18px' }}>−</button>
                                    <span style={{ padding: '10px 20px', fontWeight: 700, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{qty}</span>
                                    <button onClick={() => setQty(Math.min(product.ton_kho, qty + 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '18px' }}>+</button>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-primary" onClick={handleCart} disabled={adding || product.ton_kho === 0}
                                    style={{ flex: 1.5, justifyContent: 'center', padding: '16px', fontSize: '15px', opacity: adding || product.ton_kho === 0 ? 0.6 : 1, borderRadius: '14px' }}>
                                    <ShoppingCart size={18} /> {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
                                </button>
                                <button onClick={handleWishlist} style={{ background: inWishlist ? 'rgba(230,57,70,0.15)' : 'var(--bg-card)', border: `1px solid ${inWishlist ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '14px', width: '56px', height: '56px', cursor: 'pointer', color: inWishlist ? 'var(--primary)' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                                    <Heart size={20} fill={inWishlist ? 'var(--primary)' : 'none'} />
                                </button>
                            </div>
                        </div>

                        {/* Quick specs */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                            {[product.kieu_xe && ['🏍', (({ xe_so: 'Xe số', xe_ga: 'Xe ga', xe_con_tay: 'Côn tay', xe_mo_to: 'Xe mô tô', xe_dien: 'Xe điện', phan_khoi_lon: 'PKL' } as Record<string, string>)[product.kieu_xe])], product.dung_tich_dong_co && ['🔧', product.dung_tich_dong_co], product.xuat_xu && ['🌏', product.xuat_xu]].filter(Boolean).map((item: any, i) => (
                                <span key={i} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '12px', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{item[0]} {item[1]}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs section */}
                <div style={{ marginTop: '48px' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '32px', overflowX: 'auto' }}>
                        {([['desc', '📄 Mô tả'], ['specs', '🔧 Thông số'], ['reviews', `⭐ Đánh giá (${reviews.length})`]] as const).map(([key, label]) => (
                            <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
                        ))}
                    </div>

                    {activeTab === 'desc' && (
                        <div className="glass-card" style={{ padding: '32px' }}>
                            {product.mo_ta ? (
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '15px', whiteSpace: 'pre-line' }}>{product.mo_ta}</p>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>Chưa có mô tả cho sản phẩm này.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div className="glass-card" style={{ padding: '32px' }}>
                            {specs.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0 40px' }}>
                                    {specs.map(([k, v]) => (
                                        <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{k}</span>
                                            <span style={{ fontWeight: 600, fontSize: '14px', textAlign: 'right', maxWidth: '55%' }}>{v as string}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p style={{ color: 'var(--text-muted)' }}>Chưa có thông số kỹ thuật.</p>}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {/* Review form */}
                            {user ? (
                                <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>✍️ Viết đánh giá</h3>
                                    <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Điểm đánh giá</label>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, diem_danhgia: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                                                        <Star size={28} fill={n <= reviewForm.diem_danhgia ? '#eab308' : 'transparent'} color="#eab308" />
                                                    </button>
                                                ))}
                                                <span style={{ marginLeft: '8px', fontSize: '14px', color: 'var(--text-muted)', alignSelf: 'center' }}>{reviewForm.diem_danhgia}/5</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Tiêu đề</label>
                                            <input className="input-field" placeholder="Tóm tắt đánh giá..." value={reviewForm.tieu_de} onChange={e => setReviewForm(f => ({ ...f, tieu_de: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nội dung *</label>
                                            <textarea className="input-field" placeholder="Chia sẻ trải nghiệm của bạn về xe này..." rows={4} value={reviewForm.viet_danhgia} onChange={e => setReviewForm(f => ({ ...f, viet_danhgia: e.target.value }))} style={{ resize: 'vertical' }} required />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }} disabled={submittingReview}>
                                            {submittingReview ? '⏳ Đang gửi...' : '📤 Gửi đánh giá'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Đăng nhập để viết đánh giá</p>
                                    <Link href="/auth/login"><button className="btn-primary" style={{ padding: '10px 20px' }}>Đăng nhập</button></Link>
                                </div>
                            )}

                            {/* Review list */}
                            {reviews.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                            ) : reviews.map((r: any) => (
                                <div key={r.ma_danhgia} className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: 'white', flexShrink: 0 }}>
                                            {(r.user?.hovaten || r.user?.ten_user || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <p style={{ fontWeight: 700, fontSize: '14px' }}>{r.user?.hovaten || r.user?.ten_user}</p>
                                                <span style={{ fontSize: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Sparkles size={10} /> Đã mua hàng
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.diem_danhgia ? '#eab308' : 'transparent'} color="#eab308" />)}</div>
                                        </div>
                                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(r.ngay_lap).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    {r.tieu_de && <p style={{ fontWeight: 600, marginBottom: '6px', fontSize: '15px' }}>{r.tieu_de}</p>}
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{r.viet_danhgia}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div style={{ marginTop: '64px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>🏍 Xe cùng danh mục</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Có thể bạn cũng thích</p>
                        <div className="products-grid">
                            {related.slice(0, 4).map(p => <ProductCard key={p.ma_sanpham} product={p} />)}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
