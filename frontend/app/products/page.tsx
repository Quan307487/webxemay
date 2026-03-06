'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsApi, categoriesApi, brandsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Search, Bike, Zap } from 'lucide-react';
import { ProductsGridSkeleton } from '@/components/Skeleton';
import Link from 'next/link';

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        ma_danhmuc: searchParams.get('ma_danhmuc') || '',
        ma_thuonghieu: searchParams.get('ma_thuonghieu') || '',
        kieu_xe: searchParams.get('kieu_xe') || '',
        loai_nhien_lieu: searchParams.get('loai_nhien_lieu') || '',
        gia_min: searchParams.get('gia_min') || '',
        gia_max: searchParams.get('gia_max') || '',
        sort: searchParams.get('sort') || 'ngay_lap',
    });
    const [page, setPage] = useState(1);
    const LIMIT = 12;

    useEffect(() => {
        categoriesApi.getAll(true).then(r => setCategories(r.data));
        brandsApi.getAll(true).then(r => setBrands(r.data));
    }, []);

    useEffect(() => {
        const search = searchParams.get('search') || '';
        const ma_danhmuc = searchParams.get('ma_danhmuc') || '';
        const ma_thuonghieu = searchParams.get('ma_thuonghieu') || '';
        const kieu_xe = searchParams.get('kieu_xe') || '';

        setFilters(prev => ({
            ...prev,
            search,
            ma_danhmuc,
            ma_thuonghieu,
            kieu_xe
        }));
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        // Remove empty fields
        const params: any = {};
        Object.entries(filters).forEach(([k, v]) => { if (v !== '') params[k] = v; });
        params.limit = LIMIT;
        params.offset = (page - 1) * LIMIT;
        productsApi.getAll(params)
            .then(r => { setProducts(r.data.data || []); setTotal(r.data.total || 0); })
            .finally(() => setLoading(false));
    }, [filters, page]);

    const kieuxeOptions = [
        { value: '', label: 'Tất cả loại' },
        { value: 'xe_so', label: '🏍 Xe số' },
        { value: 'xe_ga', label: '🛵 Xe ga' },
        { value: 'xe_con_tay', label: '🏁 Côn tay' },
        { value: 'xe_dien', label: '⚡ Xe điện' },
        { value: 'phan_khoi_lon', label: '🔥 PKL' },
    ];

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
                {/* --- PREMIUM HERO BANNER --- */}
                <div style={{ position: 'relative', height: '320px', overflow: 'hidden', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    {/* Background with cinematic image */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <img
                            src="/products_banner_cinematic.png"
                            alt="Bikes Banner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,11,24,0.4), var(--bg))' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent, rgba(6,11,24,0.8))' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Trang chủ</Link>
                            <ChevronRight size={12} />
                            <span style={{ color: 'white', fontWeight: 600 }}>Cửa hàng xe máy</span>
                        </div>

                        <div className="animate-fadeInLeft">
                            <h1 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '12px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1.5px', color: 'white', lineHeight: 1 }}>
                                Khám phá <span className="gradient-text">Bộ sưu tập Xe máy</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '600px', lineHeight: 1.6 }}>
                                Từ những dòng xe số bền bỉ đến các siêu phẩm phân khối lớn – Tìm kiếm người bạn đồng hành hoàn hảo cho mọi hành trình tại MotoShop.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
                    {/* Filter Toggle & Stats Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                                <SlidersHorizontal size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>Bộ lọc tìm kiếm</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Hiển thị <strong>{total}</strong> mẫu xe đang có sẵn</p>
                            </div>
                        </div>

                        <button
                            className={`btn-secondary ${showFilters ? 'btn-active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                padding: '10px 20px',
                                gap: '10px',
                                borderRadius: '14px',
                                border: showFilters ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: showFilters ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.03)'
                            }}
                        >
                            {showFilters ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}
                        </button>
                    </div>

                    {/* --- REIMAGINED GLASS FILTERS --- */}
                    {showFilters && (
                        <div className="glass-card animate-fadeIn" style={{ padding: '24px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,21,38,0.4)', backdropFilter: 'blur(20px)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
                                {/* Search */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Từ khóa</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="input-field" placeholder="Tên xe, nhãn hiệu..." value={filters.search}
                                            onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                                            style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.02)' }}
                                        />
                                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh mục</label>
                                    <select className="input-field" value={filters.ma_danhmuc} onChange={e => { setFilters({ ...filters, ma_danhmuc: e.target.value }); setPage(1); }} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <option value="">Tất cả</option>
                                        {categories.map((c: any) => <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>)}
                                    </select>
                                </div>

                                {/* Brand */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Thương hiệu</label>
                                    <select className="input-field" value={filters.ma_thuonghieu} onChange={e => { setFilters({ ...filters, ma_thuonghieu: e.target.value }); setPage(1); }} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <option value="">Tất cả</option>
                                        {brands.map((b: any) => <option key={b.ma_thuonghieu} value={b.ma_thuonghieu}>{b.ten_thuonghieu}</option>)}
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Loại xe</label>
                                    <select className="input-field" value={filters.kieu_xe} onChange={e => { setFilters({ ...filters, kieu_xe: e.target.value }); setPage(1); }} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        {kieuxeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>

                                {/* Fuel */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nhiên liệu</label>
                                    <select className="input-field" value={filters.loai_nhien_lieu} onChange={e => { setFilters({ ...filters, loai_nhien_lieu: e.target.value }); setPage(1); }} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <option value="">Tất cả</option>
                                        <option value="xang">Xăng</option>
                                        <option value="dien">Điện ⚡</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>

                                {/* Price Min */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giá từ (triệu)</label>
                                    <input className="input-field" type="number" min="0" placeholder="VD: 20" value={filters.gia_min ? Number(filters.gia_min) / 1000000 : ''}
                                        onChange={e => { setFilters({ ...filters, gia_min: e.target.value ? String(Number(e.target.value) * 1000000) : '' }); setPage(1); }}
                                        style={{ background: 'rgba(255,255,255,0.02)' }}
                                    />
                                </div>

                                {/* Price Max */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giá đến (triệu)</label>
                                    <input className="input-field" type="number" min="0" placeholder="VD: 100" value={filters.gia_max ? Number(filters.gia_max) / 1000000 : ''}
                                        onChange={e => { setFilters({ ...filters, gia_max: e.target.value ? String(Number(e.target.value) * 1000000) : '' }); setPage(1); }}
                                        style={{ background: 'rgba(255,255,255,0.02)' }}
                                    />
                                </div>

                                {/* Sorting */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sắp xếp</label>
                                    <select className="input-field" value={filters.sort} onChange={e => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }} style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <option value="ngay_lap">Mới nhất</option>
                                        <option value="gia">Giá tăng dần</option>
                                        <option value="gia_desc">Giá giảm dần</option>
                                        <option value="diem_danh_gia">Đánh giá cao</option>
                                    </select>
                                </div>

                                {/* Reset */}
                                <div style={{ display: 'flex' }}>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => { setFilters({ search: '', ma_danhmuc: '', ma_thuonghieu: '', kieu_xe: '', loai_nhien_lieu: '', gia_min: '', gia_max: '', sort: 'ngay_lap' }); setPage(1); }}
                                        style={{ width: '100%', padding: '12px', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '14px', fontSize: '14px' }}
                                    >
                                        Đặt lại bộ lọc
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? <ProductsGridSkeleton count={LIMIT} /> : products.length === 0 ? (
                        <div className="glass-card animate-fadeIn" style={{ textAlign: 'center', padding: '100px 40px', background: 'rgba(13,21,38,0.3)', borderStyle: 'dashed' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <Search size={40} color="var(--primary)" />
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>Không tìm thấy kết quả</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                Rất tiếc, chúng tôi không tìm thấy mẫu xe nào phù hợp với các tiêu chí lọc hiện tại của bạn.
                            </p>
                            <button className="btn-primary" onClick={() => setFilters({ search: '', ma_danhmuc: '', ma_thuonghieu: '', kieu_xe: '', loai_nhien_lieu: '', gia_min: '', gia_max: '', sort: 'ngay_lap' })}>
                                Xem tất cả xe
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {products.map(p => <ProductCard key={p.ma_sanpham} product={p} />)}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: page === 1 ? 'var(--text-muted)' : 'var(--text)', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                                        .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                                            if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                                            acc.push(n);
                                            return acc;
                                        }, [])
                                        .map((n, i) => n === '...' ? (
                                            <span key={`e${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                                        ) : (
                                            <button key={n} onClick={() => setPage(n as number)} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid', borderColor: page === n ? 'var(--primary)' : 'var(--border)', background: page === n ? 'var(--primary)' : 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>{n}</button>
                                        ))}
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: page === totalPages ? 'var(--text-muted)' : 'var(--text)', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default function ProductsPage() {
    return <Suspense fallback={<><Navbar /><div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div></>}><ProductsContent /></Suspense>;
}
