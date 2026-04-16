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
        { value: 'xe_mo_to', label: '🏍 Xe mô tô' },
        { value: 'xe_dien', label: '⚡ Xe điện' },
        { value: 'phan_khoi_lon', label: '🔥 PKL' },
    ];

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
                {/* --- PREMIUM HERO BANNER (REIMAGINED BRIGHT) --- */}
                <div style={{ position: 'relative', height: '400px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', background: '#e2e8f0' }}>
                    {/* Background with lighter cinematic image */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <img
                            src="/products_banner_cinematic.png"
                            alt="Bikes Banner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7) contrast(1.1) saturate(1.2)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), #f8fafc)' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 24px', textAlign: 'center' }}>
                        <div className="animate-fadeInUp">
                            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, marginBottom: '20px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-2px', color: '#0f172a', lineHeight: 1 }}>
                                Khám phá <span className="gradient-text">Bộ sưu tập Xe máy</span>
                            </h1>
                            <p style={{ color: '#475569', fontSize: '18px', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                                Từ những dòng xe số bền bỉ đến các siêu phẩm phân khối lớn – Tìm kiếm người bạn đồng hành hoàn hảo cho mọi hành trình tại MotoShop.
                            </p>
                        </div>
                    </div>

                    {/* Breadcrumb at bottom-left of banner */}
                    <div style={{ position: 'absolute', bottom: '24px', left: '0', width: '100%', zIndex: 2 }}>
                        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', fontSize: '14px', color: '#64748b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link>
                                <ChevronRight size={14} />
                                <span style={{ color: '#0f172a', fontWeight: 800 }}>Cửa hàng xe máy</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
                    {/* Filter Toggle & Stats Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'white', padding: '10px', borderRadius: '12px', color: 'var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <SlidersHorizontal size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Bộ lọc tìm kiếm</h2>
                                <p style={{ color: '#64748b', fontSize: '14px' }}>Hiển thị <strong>{total}</strong> mẫu xe đang có sẵn</p>
                            </div>
                        </div>

                        <button
                            className={`btn-secondary ${showFilters ? 'btn-active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                padding: '12px 24px',
                                gap: '10px',
                                borderRadius: '16px',
                                border: showFilters ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                                background: showFilters ? 'rgba(var(--primary-rgb), 0.05)' : 'white',
                                color: '#0f172a',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                fontWeight: 700
                            }}
                        >
                            {showFilters ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}
                        </button>
                    </div>

                    {/* --- BRIGHTER FILTERS --- */}
                    {showFilters && (
                        <div className="animate-fadeIn" style={{ padding: '32px', marginBottom: '40px', borderRadius: '24px', border: '2px solid #cbd5e1', background: '#f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', alignItems: 'flex-end' }}>
                                {/* Search */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Từ khóa</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="input-field" placeholder="Tên xe, nhãn hiệu..." value={filters.search}
                                            onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                                            style={{ paddingLeft: '44px', background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', fontSize: '15px' }}
                                        />
                                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Danh mục</label>
                                    <select className="input-field" value={filters.ma_danhmuc} onChange={e => { setFilters({ ...filters, ma_danhmuc: e.target.value }); setPage(1); }} style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', cursor: 'pointer' }}>
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map((c: any) => <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>)}
                                    </select>
                                </div>

                                {/* Brand */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Thương hiệu</label>
                                    <select className="input-field" value={filters.ma_thuonghieu} onChange={e => { setFilters({ ...filters, ma_thuonghieu: e.target.value }); setPage(1); }} style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', cursor: 'pointer' }}>
                                        <option value="">Tất cả thương hiệu</option>
                                        {brands.map((b: any) => <option key={b.ma_thuonghieu} value={b.ma_thuonghieu}>{b.ten_thuonghieu}</option>)}
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loại xe</label>
                                    <select className="input-field" value={filters.kieu_xe} onChange={e => { setFilters({ ...filters, kieu_xe: e.target.value }); setPage(1); }} style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', cursor: 'pointer' }}>
                                        {kieuxeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>

                                {/* Fuel */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nhiên liệu</label>
                                    <select className="input-field" value={filters.loai_nhien_lieu} onChange={e => { setFilters({ ...filters, loai_nhien_lieu: e.target.value }); setPage(1); }} style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', cursor: 'pointer' }}>
                                        <option value="">Tất cả</option>
                                        <option value="xang">Máy xăng</option>
                                        <option value="dien">Xe điện ⚡</option>
                                        <option value="hybrid">Động cơ Hybrid</option>
                                    </select>
                                </div>

                                {/* Price Min */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Giá từ (triệu)</label>
                                    <input className="input-field" type="number" min="0" placeholder="VD: 20" value={filters.gia_min ? Number(filters.gia_min) / 1000000 : ''}
                                        onChange={e => { setFilters({ ...filters, gia_min: e.target.value ? String(Number(e.target.value) * 1000000) : '' }); setPage(1); }}
                                        style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px' }}
                                    />
                                </div>

                                {/* Price Max */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Giá đến (triệu)</label>
                                    <input className="input-field" type="number" min="0" placeholder="VD: 100" value={filters.gia_max ? Number(filters.gia_max) / 1000000 : ''}
                                        onChange={e => { setFilters({ ...filters, gia_max: e.target.value ? String(Number(e.target.value) * 1000000) : '' }); setPage(1); }}
                                        style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px' }}
                                    />
                                </div>

                                {/* Sorting */}
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sắp xếp theo</label>
                                    <select className="input-field" value={filters.sort} onChange={e => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }} style={{ background: 'white', color: '#0f172a', borderColor: '#e2e8f0', height: '52px', cursor: 'pointer' }}>
                                        <option value="ngay_lap">Sản phẩm mới nhất</option>
                                        <option value="gia">Giá: Thấp đến Cao</option>
                                        <option value="gia_desc">Giá: Cao đến Thấp</option>
                                        <option value="diem_danh_gia">Đánh giá tốt nhất</option>
                                    </select>
                                </div>

                                {/* Reset */}
                                <div style={{ display: 'flex' }}>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => { setFilters({ search: '', ma_danhmuc: '', ma_thuonghieu: '', kieu_xe: '', loai_nhien_lieu: '', gia_min: '', gia_max: '', sort: 'ngay_lap' }); setPage(1); }}
                                        style={{ width: '100%', height: '52px', color: '#f43f5e', border: '1.5px dashed rgba(244,63,94,0.3)', borderRadius: '16px', fontSize: '14px', fontWeight: 700, background: 'rgba(244,63,94,0.02)' }}
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
