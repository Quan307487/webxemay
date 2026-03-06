import { useEffect, useState } from 'react';
import { productsApi, categoriesApi, brandsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Trash2, Search, Bike, Plus, Pencil, X, Save, Image, ChevronDown, Zap, Gauge, Box, DollarSign } from 'lucide-react';

const INITIAL_FORM = {
    ten_sanpham: '', sanpham_code: '',
    ma_danhmuc: '', ma_thuonghieu: '',
    gia: '', gia_tri_giam: '0', kieu_giam_gia: 'percentage',
    ton_kho: '0',
    kieu_xe: 'xe_ga', loai_nhien_lieu: 'xang', hop_so: 'tu_dong',
    he_thong_phanhang: 'trong', he_thong_khoi_dong: 'ca_hai',
    dung_tich_dong_co: '', loai_dong_co: '', muc_tieu_thu: '',
    cong_suat_toi_da: '', momen_xoan_toi_da: '',
    trong_luong_kho: '', kich_thuoc: '', chieu_cao_yen: '',
    dung_tich_binh_xang: '',
    cong_suat_pin: '', pham_vi_hanh_trinh: '',
    kich_co_lop_truoc: '', kich_co_lop_sau: '',
    nam_san_xuat: '', mau_sac: '', xuat_xu: '',
    mo_ta: '', is_active: 1,
};

const TABS = [
    { id: 'basic', label: 'Cơ bản', icon: Box },
    { id: 'price', label: 'Giá & Kho', icon: DollarSign },
    { id: 'specs', label: 'Thông số', icon: Gauge },
    { id: 'frame', label: 'Khung/Lốp', icon: Zap },
    { id: 'images', label: 'Hình ảnh', icon: Image },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<any>(null);
    const [form, setForm] = useState<any>({ ...INITIAL_FORM });
    const [saving, setSaving] = useState(false);
    const [pendingImages, setPendingImages] = useState<File[]>([]);
    const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        categoriesApi.getAll().then(r => setCategories(r.data || []));
        brandsApi.getAll().then(r => setBrands(r.data || []));
        load();
    }, []);

    const load = (searchTerm = search) => {
        setLoading(true);
        productsApi.getAll(searchTerm.trim() ? { search: searchTerm.trim() } : { limit: 100 })
            .then(r => {
                const raw = r.data;
                const list = Array.isArray(raw) ? raw : (raw.data || []);
                setProducts(list);
                setTotal(list.length);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(() => load(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const openCreate = () => {
        setEditProduct(null);
        setForm({ ...INITIAL_FORM });
        setPendingImages([]);
        setPendingPreviews([]);
        setActiveTab('basic');
        setModalOpen(true);
    };

    const openEdit = (p: any) => {
        setEditProduct(p);
        setForm({
            ten_sanpham: p.ten_sanpham || '', sanpham_code: p.sanpham_code || '',
            ma_danhmuc: p.ma_danhmuc || '', ma_thuonghieu: p.ma_thuonghieu || '',
            gia: p.gia || '', gia_tri_giam: p.gia_tri_giam || '0',
            kieu_giam_gia: p.kieu_giam_gia || 'percentage',
            ton_kho: p.ton_kho ?? 0,
            kieu_xe: p.kieu_xe || 'xe_ga', loai_nhien_lieu: p.loai_nhien_lieu || 'xang',
            hop_so: p.hop_so || 'tu_dong', he_thong_phanhang: p.he_thong_phanhang || 'trong',
            he_thong_khoi_dong: p.he_thong_khoi_dong || 'ca_hai',
            dung_tich_dong_co: p.dung_tich_dong_co || '', loai_dong_co: p.loai_dong_co || '',
            muc_tieu_thu: p.muc_tieu_thu || '', cong_suat_toi_da: p.cong_suat_toi_da || '',
            momen_xoan_toi_da: p.momen_xoan_toi_da || '', trong_luong_kho: p.trong_luong_kho || '',
            kich_thuoc: p.kich_thuoc || '', chieu_cao_yen: p.chieu_cao_yen || '',
            dung_tich_binh_xang: p.dung_tich_binh_xang || '',
            cong_suat_pin: p.cong_suat_pin || '', pham_vi_hanh_trinh: p.pham_vi_hanh_trinh || '',
            kich_co_lop_truoc: p.kich_co_lop_truoc || '', kich_co_lop_sau: p.kich_co_lop_sau || '',
            nam_san_xuat: p.nam_san_xuat || '', mau_sac: p.mau_sac || '',
            xuat_xu: p.xuat_xu || '', mo_ta: p.mo_ta || '', is_active: p.is_active ?? 1,
        });
        setActiveTab('basic');
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.ten_sanpham || !form.ma_danhmuc || !form.ma_thuonghieu || !form.gia) {
            toast.error('Vui lòng điền đầy đủ: Tên, Danh mục, Thương hiệu, Giá');
            setActiveTab('basic');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                gia: Number(form.gia), gia_tri_giam: Number(form.gia_tri_giam),
                ton_kho: Number(form.ton_kho),
                ma_danhmuc: Number(form.ma_danhmuc), ma_thuonghieu: Number(form.ma_thuonghieu),
                trong_luong_kho: form.trong_luong_kho ? Number(form.trong_luong_kho) : null,
                chieu_cao_yen: form.chieu_cao_yen ? Number(form.chieu_cao_yen) : null,
                dung_tich_binh_xang: form.dung_tich_binh_xang ? Number(form.dung_tich_binh_xang) : null,
                nam_san_xuat: form.nam_san_xuat ? Number(form.nam_san_xuat) : null,
            };
            if (editProduct) {
                await productsApi.update(editProduct.ma_sanpham, payload);
                for (const file of pendingImages) {
                    const fd = new FormData(); fd.append('file', file); fd.append('is_main', 'false');
                    await productsApi.uploadImage(editProduct.ma_sanpham, fd);
                }
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                const res = await productsApi.create(payload);
                const newId = res.data?.ma_sanpham;
                if (newId && pendingImages.length > 0) {
                    for (let i = 0; i < pendingImages.length; i++) {
                        const fd = new FormData();
                        fd.append('file', pendingImages[i]);
                        fd.append('is_main', i === 0 ? 'true' : 'false');
                        await productsApi.uploadImage(newId, fd);
                    }
                }
                toast.success('Tạo sản phẩm thành công!');
            }
            setModalOpen(false);
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi lưu sản phẩm');
        } finally { setSaving(false); }
    };

    const toggleActive = async (p: any) => {
        try {
            await productsApi.update(p.ma_sanpham, { is_active: p.is_active ? 0 : 1 });
            toast.success(p.is_active ? 'Đã ẩn sản phẩm' : 'Đã hiển thị sản phẩm');
            load();
        } catch { toast.error('Lỗi cập nhật trạng thái'); }
    };

    const del = async (id: number) => {
        if (!confirm('Xóa sản phẩm này?')) return;
        try {
            await productsApi.delete(id);
            toast.success('Đã xóa sản phẩm vĩnh viễn');
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi xóa sản phẩm');
        }
    };

    const f = (k: string) => (v: any) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

    return (
        <div className="animate-slide-up" style={{ paddingBottom: '40px' }}>
            {/* Page Header & Stats */}
            <header style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 950, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px', marginBottom: '8px' }}>Kho Sản Phẩm</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>Quản lý danh sách xe, cấu hình thông số và giá bán</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '48px', height: '48px', width: '100%' }}
                                placeholder="Tìm kiếm xe..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn-premium" onClick={openCreate} style={{ height: '48px', padding: '0 24px' }}>
                            <Plus size={20} /> Thêm sản phẩm
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    <div className="premium-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bike size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Tổng số xe</p>
                            <p style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{total}</p>
                        </div>
                    </div>
                    <div className="premium-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Có sẵn</p>
                            <p style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', margin: 0 }}>{products.filter(p => p.ton_kho > 5).length}</p>
                        </div>
                    </div>
                    <div className="premium-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Sắp hết</p>
                            <p style={{ fontSize: '20px', fontWeight: 900, color: '#f59e0b', margin: 0 }}>{products.filter(p => p.ton_kho > 0 && p.ton_kho <= 5).length}</p>
                        </div>
                    </div>
                    <div className="premium-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Hết hàng</p>
                            <p style={{ fontSize: '20px', fontWeight: 900, color: '#ef4444', margin: 0 }}>{products.filter(p => p.ton_kho === 0).length}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Table Container */}
            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>MÃ</th>
                            <th>SẢN PHẨM</th>
                            <th>DANH MỤC / HÃNG</th>
                            <th>GIÁ BÁN</th>
                            <th style={{ textAlign: 'center' }}>KHO HÀNG</th>
                            <th style={{ textAlign: 'center' }}>TRẠNG THÁI</th>
                            <th style={{ textAlign: 'right' }}>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--bg-deep)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            </td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>Không tìm thấy sản phẩm nào.</td></tr>
                        ) : products.map((p: any) => {
                            const lowStock = p.ton_kho <= 5;
                            const outOfStock = p.ton_kho === 0;
                            return (
                                <tr key={p.ma_sanpham}>
                                    <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '13px' }}>#{p.ma_sanpham}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '16px',
                                                background: 'var(--bg-deep)',
                                                border: '1px solid var(--border-light)',
                                                padding: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={p.hinhanh?.[0]?.image_url ? `http://localhost:3001${p.hinhanh[0].image_url}` : 'https://via.placeholder.com/64'}
                                                    alt=""
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.ten_sanpham}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>{p.sanpham_code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.danhmuc?.ten_danhmuc}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>{p.thuonghieu?.ten_thuonghieu}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '16px', fontWeight: 950, color: 'var(--primary)' }}>{Number(p.gia).toLocaleString()}đ</div>
                                        {Number(p.gia_tri_giam) > 0 && (
                                            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, marginTop: '2px' }}>
                                                -{p.kieu_giam_gia === 'percentage' ? `${p.gia_tri_giam}%` : `${p.gia_tri_giam.toLocaleString()}đ`}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: 900,
                                                color: outOfStock ? '#ef4444' : lowStock ? '#f59e0b' : 'var(--text-primary)'
                                            }}>
                                                {p.ton_kho} <small style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>XE</small>
                                            </span>
                                            <div style={{ width: '60px', height: '6px', background: 'var(--bg-deep)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${Math.min(100, (p.ton_kho / 40) * 100)}%`,
                                                    height: '100%',
                                                    background: outOfStock ? '#ef4444' : lowStock ? '#f59e0b' : 'var(--primary)',
                                                    borderRadius: '10px'
                                                }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => toggleActive(p)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <div className="status-pill" style={{
                                                background: p.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: p.is_active ? '#10b981' : '#ef4444'
                                            }}>
                                                <div className="status-glow" />
                                                {p.is_active ? 'Đang bán' : 'Tạm ẩn'}
                                            </div>
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openEdit(p)} className="action-icon-btn">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => del(p.ma_sanpham)} className="action-icon-btn danger">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* === PREMIUM MODAL === */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', backdropFilter: 'blur(8px)' }}
                    onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
                    <div style={{
                        width: '760px', maxWidth: '100vw', height: '100vh',
                        background: 'var(--bg-main)',
                        borderLeft: '1px solid var(--border-subtle)',
                        overflowY: 'auto', display: 'flex', flexDirection: 'column',
                        animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
                        boxShadow: '-20px 0 60px rgba(0,0,0,0.05)',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '28px 32px 0', borderBottom: '1px solid var(--border-subtle)',
                            position: 'sticky', top: 0, background: 'var(--bg-main)',
                            backdropFilter: 'blur(20px)', zIndex: 10,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(var(--primary-rgb), 0.2)' }}>
                                        {editProduct ? <Pencil size={20} color="white" /> : <Plus size={22} color="white" />}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '22px', fontWeight: 950, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                            {editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm xe mới'}
                                        </h2>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                                            {editProduct ? `ID #${editProduct.ma_sanpham} · ${editProduct.ten_sanpham}` : 'Điền thông tin xe máy mới vào hệ thống'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setModalOpen(false)}
                                    style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'var(--text-secondary)', transition: '0.2s', lineHeight: 0 }}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '-1px' }}>
                                {TABS.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '12px 20px', background: 'none', border: 'none',
                                            borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                                            color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                            fontWeight: isActive ? 800 : 600, fontSize: '13px',
                                            cursor: 'pointer', transition: '0.2s', letterSpacing: '0.3px',
                                            fontFamily: 'Outfit, sans-serif',
                                        }}>
                                            <Icon size={15} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: '32px', flex: 1 }}>

                            {/* TAB: Cơ bản */}
                            {activeTab === 'basic' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <PF label="Tên sản phẩm *">
                                        <input className="input-premium" style={{ width: '100%', height: '50px', fontSize: '15px', fontWeight: 700 }}
                                            placeholder="VD: Honda Wave Alpha 110" value={form.ten_sanpham} onChange={f('ten_sanpham')} />
                                    </PF>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Mã sản phẩm (SKU)">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: HD-WAVE-110" value={form.sanpham_code} onChange={f('sanpham_code')} />
                                        </PF>
                                        <PF label="Năm sản xuất">
                                            <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 2025" value={form.nam_san_xuat} onChange={f('nam_san_xuat')} />
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Danh mục *">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.ma_danhmuc} onChange={f('ma_danhmuc')}>
                                                    <option value="">-- Chọn danh mục --</option>
                                                    {categories.map((c: any) => <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>)}
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                        <PF label="Thương hiệu *">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.ma_thuonghieu} onChange={f('ma_thuonghieu')}>
                                                    <option value="">-- Chọn thương hiệu --</option>
                                                    {brands.map((b: any) => <option key={b.ma_thuonghieu} value={b.ma_thuonghieu}>{b.ten_thuonghieu}</option>)}
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Màu sắc">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: Đỏ, Đen, Trắng Ngọc Trai" value={form.mau_sac} onChange={f('mau_sac')} />
                                        </PF>
                                        <PF label="Xuất xứ">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: Lắp ráp tại Việt Nam" value={form.xuat_xu} onChange={f('xuat_xu')} />
                                        </PF>
                                    </div>
                                    <PF label="Mô tả sản phẩm">
                                        <textarea className="input-premium" placeholder="Mô tả ngắn về tính năng nổi bật của xe..." value={form.mo_ta} onChange={f('mo_ta')}
                                            style={{ width: '100%', minHeight: '120px', resize: 'vertical', paddingTop: '14px', lineHeight: 1.6 }} />
                                    </PF>
                                    <PF label="Trạng thái hiển thị">
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {[{ v: 1, label: '✅ Đang bán', color: '#10b981' }, { v: 0, label: '🔴 Ẩn sản phẩm', color: '#ef4444' }].map(opt => (
                                                <label key={opt.v} style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', borderRadius: '14px', cursor: 'pointer', flex: 1, transition: '0.2s', fontWeight: 700, fontSize: '14px',
                                                    background: form.is_active === opt.v ? `rgba(${opt.v ? '16,185,129' : '239,68,68'},0.1)` : 'rgba(255,255,255,0.02)',
                                                    border: form.is_active === opt.v ? `2px solid ${opt.color}40` : '2px solid transparent',
                                                    color: form.is_active === opt.v ? opt.color : 'var(--text-muted)'
                                                }}>
                                                    <input type="radio" value={opt.v} checked={form.is_active === opt.v} onChange={() => setForm((p: any) => ({ ...p, is_active: opt.v }))} style={{ display: 'none' }} />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </PF>
                                </div>
                            )}

                            {/* TAB: Giá & Kho */}
                            {activeTab === 'price' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Giá bán (VNĐ) *">
                                            <input className="input-premium" style={{ width: '100%', fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}
                                                type="number" placeholder="29000000" value={form.gia} onChange={f('gia')} />
                                            {form.gia && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                                                = {Number(form.gia).toLocaleString('vi-VN')} đồng
                                            </p>}
                                        </PF>
                                        <PF label="Số lượng tồn kho (xe)">
                                            <input className="input-premium" style={{ width: '100%', fontSize: '18px', fontWeight: 800 }}
                                                type="number" placeholder="0" value={form.ton_kho} onChange={f('ton_kho')} />
                                        </PF>
                                    </div>
                                    <div style={{ padding: '20px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '16px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>⚡ Cấu hình giảm giá</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <PF label="Kiểu giảm giá">
                                                <div style={{ position: 'relative' }}>
                                                    <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.kieu_giam_gia} onChange={f('kieu_giam_gia')}>
                                                        <option value="percentage">Phần trăm (%)</option>
                                                        <option value="fixed_amount">Số tiền cố định (đ)</option>
                                                    </select>
                                                    <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                                </div>
                                            </PF>
                                            <PF label={`Giá trị giảm ${form.kieu_giam_gia === 'percentage' ? '(%)' : '(đ)'}`}>
                                                <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="0" value={form.gia_tri_giam} onChange={f('gia_tri_giam')} />
                                            </PF>
                                        </div>
                                        {Number(form.gia) > 0 && Number(form.gia_tri_giam) > 0 && (
                                            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
                                                <p style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
                                                    💰 Giá sau giảm: {form.kieu_giam_gia === 'percentage'
                                                        ? (Number(form.gia) * (1 - Number(form.gia_tri_giam) / 100)).toLocaleString('vi-VN')
                                                        : (Number(form.gia) - Number(form.gia_tri_giam)).toLocaleString('vi-VN')} đồng
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB: Thông số kỹ thuật */}
                            {activeTab === 'specs' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Kiểu xe">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.kieu_xe} onChange={f('kieu_xe')}>
                                                    <option value="xe_so">Xe số</option>
                                                    <option value="xe_ga">Xe ga</option>
                                                    <option value="xe_con_tay">Xe côn tay</option>
                                                    <option value="xe_dien">Xe điện</option>
                                                    <option value="phan_khoi_lon">Phân khối lớn</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                        <PF label="Loại nhiên liệu">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.loai_nhien_lieu} onChange={f('loai_nhien_lieu')}>
                                                    <option value="xang">Xăng</option>
                                                    <option value="dien">Điện</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Dung tích động cơ">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 110cc" value={form.dung_tich_dong_co} onChange={f('dung_tich_dong_co')} />
                                        </PF>
                                        <PF label="Loại động cơ">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 4 kỳ, SOHC, 2 van" value={form.loai_dong_co} onChange={f('loai_dong_co')} />
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Hộp số">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.hop_so} onChange={f('hop_so')}>
                                                    <option value="tu_dong">Tự động</option>
                                                    <option value="so_tay">Số tay (4 cấp)</option>
                                                    <option value="ban_tu_dong">Bán tự động</option>
                                                    <option value="khong_hop_so">Không hộp số</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                        <PF label="Hệ thống phanh">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.he_thong_phanhang} onChange={f('he_thong_phanhang')}>
                                                    <option value="trong">Phanh trống cả 2 bánh</option>
                                                    <option value="dia">Phanh đĩa cả 2 bánh</option>
                                                    <option value="trong_truoc_dia_sau">Đĩa trước - Trống sau</option>
                                                    <option value="abs">Phanh ABS</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Công suất tối đa">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 6.3kW / 7500rpm" value={form.cong_suat_toi_da} onChange={f('cong_suat_toi_da')} />
                                        </PF>
                                        <PF label="Mô men xoắn tối đa">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 8.5Nm / 6000rpm" value={form.momen_xoan_toi_da} onChange={f('momen_xoan_toi_da')} />
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Mức tiêu thụ nhiên liệu">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 1.8L/100km" value={form.muc_tieu_thu} onChange={f('muc_tieu_thu')} />
                                        </PF>
                                        <PF label="Hệ thống khởi động">
                                            <div style={{ position: 'relative' }}>
                                                <select className="input-premium" style={{ width: '100%', appearance: 'none', paddingRight: '36px' }} value={form.he_thong_khoi_dong} onChange={f('he_thong_khoi_dong')}>
                                                    <option value="de_chan">Đề chân</option>
                                                    <option value="de_dien">Đề điện</option>
                                                    <option value="ca_hai">Cả hai (Đề điện + Đề chân)</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                            </div>
                                        </PF>
                                    </div>
                                    {form.loai_nhien_lieu === 'dien' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '16px' }}>
                                            <PF label="⚡ Công suất pin (kWh)">
                                                <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 3.0kWh" value={form.cong_suat_pin} onChange={f('cong_suat_pin')} />
                                            </PF>
                                            <PF label="⚡ Phạm vi hành trình (km)">
                                                <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 150km" value={form.pham_vi_hanh_trinh} onChange={f('pham_vi_hanh_trinh')} />
                                            </PF>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: Khung/Lốp */}
                            {activeTab === 'frame' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Cỡ lốp trước">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 80/90-14 M/C 40P" value={form.kich_co_lop_truoc} onChange={f('kich_co_lop_truoc')} />
                                        </PF>
                                        <PF label="Cỡ lốp sau">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 90/90-14 M/C 46P" value={form.kich_co_lop_sau} onChange={f('kich_co_lop_sau')} />
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Trọng lượng khô (kg)">
                                            <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 95" value={form.trong_luong_kho} onChange={f('trong_luong_kho')} />
                                        </PF>
                                        <PF label="Chiều cao yên (mm)">
                                            <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 760" value={form.chieu_cao_yen} onChange={f('chieu_cao_yen')} />
                                        </PF>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <PF label="Kích thước (DxRxC - mm)">
                                            <input className="input-premium" style={{ width: '100%' }} placeholder="VD: 1900x680x1075" value={form.kich_thuoc} onChange={f('kich_thuoc')} />
                                        </PF>
                                        <PF label="Dung tích bình xăng (L)">
                                            <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 4.2" value={form.dung_tich_binh_xang} onChange={f('dung_tich_binh_xang')} />
                                        </PF>
                                    </div>
                                </div>
                            )}

                            {/* TAB: Hình ảnh */}
                            {activeTab === 'images' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {editProduct && editProduct.hinhanh?.length > 0 && (
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Ảnh hiện tại</p>
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                {editProduct.hinhanh.map((img: any) => (
                                                    <div key={img.ma_anh} style={{ position: 'relative', width: '100px', height: '90px', borderRadius: '14px', overflow: 'hidden', border: img.is_main ? '2px solid var(--primary)' : '1px solid var(--border-light)' }}>
                                                        <img src={`http://localhost:3001${img.image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        {img.is_main && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(230,57,70,0.85)', fontSize: '9px', textAlign: 'center', color: 'white', padding: '3px', fontWeight: 800 }}>CHÍNH</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {pendingPreviews.length > 0 && (
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Ảnh chờ tải lên</p>
                                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                {pendingPreviews.map((src, i) => (
                                                    <div key={i} style={{ position: 'relative', width: '100px', height: '90px', borderRadius: '14px', overflow: 'hidden', border: i === 0 && !editProduct ? '2px solid var(--primary)' : '1px solid var(--border-light)', opacity: 0.8 }}>
                                                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <button onClick={() => { setPendingImages(prev => prev.filter((_, j) => j !== i)); setPendingPreviews(prev => prev.filter((_, j) => j !== i)); }}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '48px 24px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '20px', cursor: 'pointer', transition: '0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb),0.4)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                                        <div style={{ width: '56px', height: '56px', background: 'rgba(var(--primary-rgb),0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image size={24} color="var(--primary)" />
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>Chọn ảnh để tải lên</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Có thể chọn nhiều ảnh cùng lúc · PNG, JPG, WEBP</p>
                                        </div>
                                        <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                            onChange={e => {
                                                const files = Array.from(e.target.files || []);
                                                setPendingImages(prev => [...prev, ...files]);
                                                const previews = files.map(f => URL.createObjectURL(f));
                                                setPendingPreviews(prev => [...prev, ...previews]);
                                                e.target.value = '';
                                            }} />
                                    </label>
                                    {editProduct && <UploadImage productId={editProduct.ma_sanpham} onUploaded={load} />}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', position: 'sticky', bottom: 0, zIndex: 10 }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {TABS.map((tab) => (
                                    <div key={tab.id} style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-deep)', transition: '0.2s', cursor: 'pointer' }} onClick={() => setActiveTab(tab.id)} title={tab.label} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0 24px', height: '48px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }} onClick={() => setModalOpen(false)}>Hủy</button>
                                <button className="btn-premium" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1, height: '48px', padding: '0 32px', gap: '10px', fontSize: '15px', fontWeight: 800 }}>
                                    {saving ? <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Save size={18} />}
                                    {saving ? 'Đang lưu...' : editProduct ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .action-icon-btn { padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; cursor: pointer; color: var(--text-muted); transition: all 0.2s; line-height: 0; }
                .action-icon-btn:hover { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: #3b82f6; }
                .action-icon-btn.danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }
            `}</style>
        </div>
    );
}

// Sub components
function PF({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
            {children}
        </div>
    );
}

function UploadImage({ productId, onUploaded }: { productId: number; onUploaded: () => void }) {
    const [uploading, setUploading] = useState(false);
    const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file); fd.append('is_main', 'false');
            await productsApi.uploadImage(productId, fd);
            toast.success('Đã tải ảnh lên thành công');
            onUploaded();
        } catch { toast.error('Lỗi khi tải ảnh lên'); }
        finally { setUploading(false); e.target.value = ''; }
    };
    return (
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '14px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
            <Image size={18} />
            <span>{uploading ? 'Đang đồng bộ...' : 'Tải thêm ảnh mới'}</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} disabled={uploading} />
        </label>
    );
}
