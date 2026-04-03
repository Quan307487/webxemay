import { useEffect, useState } from 'react';
import { productsApi, categoriesApi, brandsApi, API_HOST } from '../lib/api';
import toast from 'react-hot-toast';
import { Trash2, Search, Bike, Plus, Pencil, X, Save, Image, Box, Zap, DollarSign, Gauge, PackageSearch } from 'lucide-react';
import { FormField, SelectField, PageHeader, Spinner, SpinnerPage, EmptyState } from '../components/ui';
import Badge from '../components/ui/Badge';


const INITIAL_FORM = {
    ten_sanpham: '', sanpham_code: '',
    ma_danhmuc: '', ma_thuonghieu: '',
    gia: '', gia_tri_giam: '0', kieu_giam_gia: 'percentage',
    ton_kho: '0',
    kieu_xe: 'xe_ga', loai_nhien_lieu: 'xang', hop_so: 'tu_dong',
    he_thong_phanhang: 'trong', he_thong_khoi_dong: 'ca_hai',
    dung_tich_dong_co: '', loai_dong_co: '', muc_tieu_thu: '',
    cong_suat_toi_da: '', momen_xoan_toi_da: '',
    trong_luong_kho: '', kich_thuoc: '', chieu_cao_yen: '', dung_tich_binh_xang: '',
    cong_suat_pin: '', pham_vi_hanh_trinh: '',
    kich_co_lop_truoc: '', kich_co_lop_sau: '',
    nam_san_xuat: '', mau_sac: '', xuat_xu: '', mo_ta: '', is_active: 1,
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
    const [activeTab, setActiveTab] = useState('basic');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        categoriesApi.getAll().then(r => setCategories(r.data || []));
        brandsApi.getAll().then(r => setBrands(r.data || []));
        load();
    }, []);

    const load = (searchTerm = search) => {
        setLoading(true);
        productsApi.getAll({ active: 'false', limit: 500, ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}) })
            .then(r => {
                const raw = r.data;
                const list = Array.isArray(raw) ? raw : (raw.data || []);
                setProducts(list);
                setTotal(list.length);
                setEditProduct((prev: any) => {
                    if (!prev) return null;
                    return list.find((p: any) => p.ma_sanpham === prev.ma_sanpham) || prev;
                });
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
        setActiveTab('basic');
        setModalOpen(true);
    };

    const openEdit = (p: any) => {
        setEditProduct(p);
        setForm({
            ten_sanpham: p.ten_sanpham || '', sanpham_code: p.sanpham_code || '',
            ma_danhmuc: p.ma_danhmuc || '', ma_thuonghieu: p.ma_thuonghieu || '',
            gia: p.gia || '', gia_tri_giam: p.gia_tri_giam || '0',
            kieu_giam_gia: p.kieu_giam_gia || 'percentage', ton_kho: p.ton_kho ?? 0,
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
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await productsApi.create(payload);
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
        } catch (e: any) { toast.error(e.response?.data?.message || 'Lỗi khi xóa sản phẩm'); }
    };

    const f = (k: string) => (v: any) => setForm((prev: any) => ({ ...prev, [k]: v.target.value }));

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = [
        { label: 'Tổng số xe', value: total, icon: <Bike size={20} />, color: 'var(--primary)', bg: 'var(--primary-light)' },
        { label: 'Có sẵn (>5)', value: products.filter(p => p.ton_kho > 5).length, icon: <Box size={20} />, color: '#10b981', bg: '#d1fae5' },
        { label: 'Sắp hết (≤5)', value: products.filter(p => p.ton_kho > 0 && p.ton_kho <= 5).length, icon: <Zap size={20} />, color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Hết hàng', value: products.filter(p => p.ton_kho === 0).length, icon: <Trash2 size={20} />, color: '#ef4444', bg: '#fee2e2' },
    ];

    return (
        <div className="animate-slide-up" style={{ paddingBottom: '40px' }}>
            <PageHeader
                title="Kho Sản Phẩm"
                description={<>Quản lý danh sách xe, cấu hình thông số và giá bán. Hiện có <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{total}</span> mẫu xe.</>}
                action={
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="input-premium" style={{ paddingLeft: '44px', height: '44px', width: '260px' }} placeholder="Tìm kiếm xe..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn-premium btn-primary" onClick={openCreate} style={{ height: '44px', padding: '0 20px', gap: '8px' }}>
                            <Plus size={18} /> Thêm sản phẩm
                        </button>
                    </div>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '40px' }}>
                {stats.map(s => (
                    <div key={s.label} className="premium-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>{s.label}</p>
                            <p style={{ fontSize: '22px', fontWeight: 900, color: s.color, margin: 0, lineHeight: 1.2 }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Table ── */}
            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th style={{ width: '70px' }}>MÃ</th>
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
                            <tr><td colSpan={7}><SpinnerPage /></td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '80px' }}><EmptyState message="Không tìm thấy sản phẩm nào phù hợp." icon={<PackageSearch size={48} />} /></td></tr>
                        ) : products.map((p: any) => {
                            const outOfStock = p.ton_kho === 0;
                            const lowStock = !outOfStock && p.ton_kho <= 5;
                            const stockColor = outOfStock ? '#ef4444' : lowStock ? '#f59e0b' : 'var(--text-primary)';
                            return (
                                <tr key={p.ma_sanpham}>
                                    <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '13px' }}>#{p.ma_sanpham}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--bg-deep)', border: '1px solid var(--border-light)', overflow: 'hidden', flexShrink: 0 }}>
                                                {(() => {
                                                    const mainImg = p.hinhanh?.find((h: any) => h.is_main === 1) || p.hinhanh?.[0];
                                                    return (
                                                        <img src={mainImg?.image_url ? `${API_HOST}${mainImg.image_url}` : 'https://placehold.co/56x56/f1f5f9/94a3b8?text=?'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.ten_sanpham}</div>
                                                {p.sanpham_code && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>{p.sanpham_code}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{p.danhmuc?.ten_danhmuc || '—'}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>{p.thuonghieu?.ten_thuonghieu || '—'}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--primary)' }}>{Number(p.gia).toLocaleString('vi-VN')}đ</div>
                                        {Number(p.gia_tri_giam) > 0 && (
                                            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>
                                                -{p.kieu_giam_gia === 'percentage' ? `${p.gia_tri_giam}%` : `${Number(p.gia_tri_giam).toLocaleString()}đ`}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 900, color: stockColor }}>{p.ton_kho} <small style={{ fontSize: '10px', color: 'var(--text-muted)' }}>XE</small></span>
                                            <div style={{ width: '52px', height: '5px', background: 'var(--bg-deep)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(100, (p.ton_kho / 40) * 100)}%`, height: '100%', background: stockColor, borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => toggleActive(p)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Badge label={p.is_active ? 'Đang bán' : 'Tạm ẩn'} color={p.is_active ? '#10b981' : '#ef4444'} />
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openEdit(p)} className="action-icon-btn" title="Chỉnh sửa"><Pencil size={16} /></button>
                                            <button onClick={() => del(p.ma_sanpham)} className="action-icon-btn danger" title="Xóa"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Slide-in Panel ── */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', backdropFilter: 'blur(8px)' }}
                    onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
                    <div style={{ width: '760px', maxWidth: '100vw', height: '100vh', background: 'var(--bg-main)', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
                        {/* Panel Header */}
                        <div style={{ padding: '24px 28px 0', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 10, backdropFilter: 'blur(20px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '44px', height: '44px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(var(--primary-rgb),0.2)' }}>
                                        {editProduct ? <Pencil size={18} color="white" /> : <Plus size={20} color="white" />}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                                            {editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm xe mới'}
                                        </h2>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 600 }}>
                                            {editProduct ? `ID #${editProduct.ma_sanpham} · ${editProduct.ten_sanpham}` : 'Điền thông tin xe máy mới vào hệ thống'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setModalOpen(false)} style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)', lineHeight: 0 }}>
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Tab nav */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {TABS.map(tab => {
                                    const Icon = tab.icon;
                                    const active = activeTab === tab.id;
                                    return (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                            display: 'flex', alignItems: 'center', gap: '7px',
                                            padding: '11px 18px', background: 'none', border: 'none',
                                            borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                                            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                                            fontWeight: active ? 800 : 600, fontSize: '13px',
                                            cursor: 'pointer', transition: '0.15s', fontFamily: 'Outfit, sans-serif',
                                        }}>
                                            <Icon size={14} />{tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                            <TabBasic form={form} f={f} categories={categories} brands={brands} setForm={setForm} />
                            <TabPrice form={form} f={f} setForm={setForm} activeTab={activeTab} />
                            <TabSpecs form={form} f={f} setForm={setForm} activeTab={activeTab} />
                            <TabFrame form={form} f={f} activeTab={activeTab} />
                            <TabImages
                                activeTab={activeTab}
                                editProduct={editProduct}
                                form={form}
                                setEditProduct={setEditProduct}
                                uploading={uploading}
                                setUploading={setUploading}
                                load={load}
                                setActiveTab={setActiveTab}
                            />
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {TABS.map(t => (
                                    <div key={t.id} onClick={() => setActiveTab(t.id)} title={t.label} style={{ width: '7px', height: '7px', borderRadius: '50%', background: activeTab === t.id ? 'var(--primary)' : 'var(--bg-deep)', cursor: 'pointer', transition: '0.2s' }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0 22px', height: '44px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }} onClick={() => setModalOpen(false)}>Hủy</button>
                                <button className="btn-premium btn-primary" onClick={handleSave} disabled={saving} style={{ height: '44px', padding: '0 28px', gap: '8px', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? <Spinner size={16} color="white" /> : <Save size={16} />}
                                    {saving ? 'Đang lưu...' : editProduct ? 'Cập nhật' : 'Tạo sản phẩm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes spin { to { transform: rotate(360deg); } }
                .action-icon-btn { padding: 8px; background: rgba(0,0,0,0.03); border: 1px solid var(--border-subtle); border-radius: 10px; cursor: pointer; color: var(--text-muted); transition: all 0.2s; line-height: 0; }
                .action-icon-btn:hover { background: rgba(59,130,246,0.08); border-color: rgba(59,130,246,0.25); color: #3b82f6; }
                .action-icon-btn.danger:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #ef4444; }
            `}</style>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function TabBasic({ form, f, categories, brands, setForm, }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <FormField label="Tên sản phẩm *">
                <input className="input-premium" style={{ width: '100%', height: '50px', fontSize: '15px', fontWeight: 700 }} placeholder="VD: Honda Wave Alpha 110" value={form.ten_sanpham} onChange={f('ten_sanpham')} />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Mã sản phẩm (SKU)">
                    <input className="input-premium" style={{ width: '100%' }} placeholder="VD: HD-WAVE-110" value={form.sanpham_code} onChange={f('sanpham_code')} />
                </FormField>
                <FormField label="Năm sản xuất">
                    <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 2025" value={form.nam_san_xuat} onChange={f('nam_san_xuat')} />
                </FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <SelectField label="Danh mục *" value={form.ma_danhmuc} onChange={v => setForm((p: any) => ({ ...p, ma_danhmuc: v }))}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c: any) => <option key={c.ma_danhmuc} value={c.ma_danhmuc}>{c.ten_danhmuc}</option>)}
                </SelectField>
                <SelectField label="Thương hiệu *" value={form.ma_thuonghieu} onChange={v => setForm((p: any) => ({ ...p, ma_thuonghieu: v }))}>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b: any) => <option key={b.ma_thuonghieu} value={b.ma_thuonghieu}>{b.ten_thuonghieu}</option>)}
                </SelectField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Màu sắc (các màu cách nhau bởi dấu phẩy)">
                    <input className="input-premium" style={{ width: '100%' }} placeholder="VD: Đỏ, Đen, Trắng Ngọc Trai" value={form.mau_sac} onChange={f('mau_sac')} />
                </FormField>
                <FormField label="Xuất xứ">
                    <input className="input-premium" style={{ width: '100%' }} placeholder="VD: Lắp ráp tại Việt Nam" value={form.xuat_xu} onChange={f('xuat_xu')} />
                </FormField>
            </div>
            <FormField label="Mô tả sản phẩm">
                <textarea className="input-premium" placeholder="Mô tả ngắn về tính năng nổi bật của xe..." value={form.mo_ta} onChange={f('mo_ta')} style={{ width: '100%', minHeight: '110px', resize: 'vertical', paddingTop: '14px', lineHeight: 1.6 }} />
            </FormField>
            <FormField label="Trạng thái hiển thị">
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[{ v: 1, label: '✅ Đang bán', color: '#10b981', rgb: '16,185,129' }, { v: 0, label: '🔴 Ẩn sản phẩm', color: '#ef4444', rgb: '239,68,68' }].map(opt => (
                        <label key={opt.v} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', flex: 1, fontWeight: 700, fontSize: '14px',
                            background: form.is_active === opt.v ? `rgba(${opt.rgb},0.08)` : 'transparent',
                            border: `2px solid ${form.is_active === opt.v ? opt.color + '40' : 'var(--border-subtle)'}`,
                            color: form.is_active === opt.v ? opt.color : 'var(--text-muted)', transition: '0.2s',
                        }}>
                            <input type="radio" value={opt.v} checked={form.is_active === opt.v} onChange={() => setForm((p: any) => ({ ...p, is_active: opt.v }))} style={{ display: 'none' }} />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </FormField>
        </div>
    );
}

function TabPrice({ form, f, setForm, activeTab }: any) {
    if (activeTab !== 'price') return null;
    const discount = form.kieu_giam_gia === 'percentage'
        ? Number(form.gia) * (1 - Number(form.gia_tri_giam) / 100)
        : Number(form.gia) - Number(form.gia_tri_giam);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Giá bán (VNĐ) *">
                    <input className="input-premium" style={{ width: '100%', fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }} type="number" placeholder="29000000" value={form.gia} onChange={f('gia')} />
                    {form.gia && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600 }}>= {Number(form.gia).toLocaleString('vi-VN')} đồng</p>}
                </FormField>
                <FormField label="Số lượng tồn kho (xe)">
                    <input className="input-premium" style={{ width: '100%', fontSize: '16px', fontWeight: 800 }} type="number" placeholder="0" value={form.ton_kho} onChange={f('ton_kho')} />
                </FormField>
            </div>
            <div style={{ padding: '18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '14px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>⚡ Cấu hình giảm giá</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <SelectField label="Kiểu giảm giá" value={form.kieu_giam_gia} onChange={v => setForm((p: any) => ({ ...p, kieu_giam_gia: v }))}>
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed_amount">Số tiền cố định (đ)</option>
                    </SelectField>
                    <FormField label={`Giá trị giảm ${form.kieu_giam_gia === 'percentage' ? '(%)' : '(đ)'}`}>
                        <input className="input-premium" style={{ width: '100%' }} type="number" placeholder="0" value={form.gia_tri_giam} onChange={f('gia_tri_giam')} />
                    </FormField>
                </div>
                {Number(form.gia) > 0 && Number(form.gia_tri_giam) > 0 && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', margin: 0 }}>💰 Giá sau giảm: {discount.toLocaleString('vi-VN')} đồng</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabSpecs({ form, f, setForm, activeTab }: any) {
    if (activeTab !== 'specs') return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <SelectField label="Kiểu xe" value={form.kieu_xe} onChange={v => setForm((p: any) => ({ ...p, kieu_xe: v }))}>
                    {[['xe_so','Xe số'],['xe_ga','Xe ga'],['xe_con_tay','Xe côn tay'],['xe_mo_to','Xe mô tô'],['xe_dien','Xe điện'],['phan_khoi_lon','Phân khối lớn'],['naked_bike','Naked-bike']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </SelectField>
                <SelectField label="Loại nhiên liệu" value={form.loai_nhien_lieu} onChange={v => setForm((p: any) => ({ ...p, loai_nhien_lieu: v }))}>
                    <option value="xang">Xăng</option><option value="dien">Điện</option><option value="hybrid">Hybrid</option>
                </SelectField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Dung tích động cơ"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 110cc" value={form.dung_tich_dong_co} onChange={f('dung_tich_dong_co')} /></FormField>
                <FormField label="Loại động cơ"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 4 kỳ, SOHC, 2 van" value={form.loai_dong_co} onChange={f('loai_dong_co')} /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <SelectField label="Hộp số" value={form.hop_so} onChange={v => setForm((p: any) => ({ ...p, hop_so: v }))}>
                    {[['tu_dong','Tự động'],['vo_cap','Vô cấp (CVT)'],['so_tay','Số tay (4 cấp)'],['so_tay_6','Số tay (6 cấp)'],['con_tay','Côn tay'],['ban_tu_dong','Bán tự động'],['khong_hop_so','Không hộp số']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </SelectField>
                <SelectField label="Hệ thống phanh" value={form.he_thong_phanhang} onChange={v => setForm((p: any) => ({ ...p, he_thong_phanhang: v }))}>
                    {[['trong','Phanh trống cả 2 bánh'],['dia','Phanh đĩa cả 2 bánh'],['trong_truoc_dia_sau','Đĩa trước - Trống sau'],['abs_truoc_dia_sau','Phanh đĩa trước (có ABS) - Phanh đĩa sau'],['trong_truoc_trong_sau','Phanh tang trống (Đùm) trước - Phanh tang trống sau'],['abs_3_kenh_asr','3 đĩa (2 trước - 1 sau) ABS 3 kênh & Kiểm soát lực kéo ASR'],['dia_don_thuy_luc','Phanh đĩa đơn thuỷ lực'],['abs','Phanh ABS'],['brembo_kibs','Đĩa đôi 330mm (Brembo M50) - KIBS']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </SelectField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Công suất tối đa"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 6.3kW / 7500rpm" value={form.cong_suat_toi_da} onChange={f('cong_suat_toi_da')} /></FormField>
                <FormField label="Mô men xoắn tối đa"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 8.5Nm / 6000rpm" value={form.momen_xoan_toi_da} onChange={f('momen_xoan_toi_da')} /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Mức tiêu thụ nhiên liệu"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 1.8L/100km" value={form.muc_tieu_thu} onChange={f('muc_tieu_thu')} /></FormField>
                <SelectField label="Hệ thống khởi động" value={form.he_thong_khoi_dong} onChange={v => setForm((p: any) => ({ ...p, he_thong_khoi_dong: v }))}>
                    <option value="de_chan">Đề chân</option><option value="de_dien">Đề điện</option><option value="ca_hai">Cả hai (Đề điện + Đề chân)</option><option value="nut_bam_app">Khởi động bằng nút bấm hoặc App</option>
                </SelectField>
            </div>
            {form.loai_nhien_lieu === 'dien' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', padding: '16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '14px' }}>
                    <FormField label="⚡ Công suất pin (kWh)"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 3.0kWh" value={form.cong_suat_pin} onChange={f('cong_suat_pin')} /></FormField>
                    <FormField label="⚡ Phạm vi hành trình (km)"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 150km" value={form.pham_vi_hanh_trinh} onChange={f('pham_vi_hanh_trinh')} /></FormField>
                </div>
            )}
        </div>
    );
}

function TabFrame({ form, f, activeTab }: any) {
    if (activeTab !== 'frame') return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Cỡ lốp trước"><input className="input-premium" style={{ width: '100%' }} placeholder="80/90-14 M/C 40P" value={form.kich_co_lop_truoc} onChange={f('kich_co_lop_truoc')} /></FormField>
                <FormField label="Cỡ lốp sau"><input className="input-premium" style={{ width: '100%' }} placeholder="90/90-14 M/C 46P" value={form.kich_co_lop_sau} onChange={f('kich_co_lop_sau')} /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Trọng lượng khô (kg)"><input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 95" value={form.trong_luong_kho} onChange={f('trong_luong_kho')} /></FormField>
                <FormField label="Chiều cao yên (mm)"><input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 760" value={form.chieu_cao_yen} onChange={f('chieu_cao_yen')} /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <FormField label="Kích thước (DxRxC mm)"><input className="input-premium" style={{ width: '100%' }} placeholder="VD: 1900x680x1075" value={form.kich_thuoc} onChange={f('kich_thuoc')} /></FormField>
                <FormField label="Dung tích bình xăng (L)"><input className="input-premium" style={{ width: '100%' }} type="number" placeholder="VD: 4.2" value={form.dung_tich_binh_xang} onChange={f('dung_tich_binh_xang')} /></FormField>
            </div>
        </div>
    );
}

function TabImages({ activeTab, editProduct, form, setEditProduct, uploading, setUploading, load, setActiveTab }: any) {
    if (activeTab !== 'images') return null;
    const colors = form.mau_sac ? form.mau_sac.split(',').map((c: string) => c.trim()).filter(Boolean) : [];

    const onFileChange = async (e: any) => {
        const files = Array.from(e.target.files || []) as File[];
        if (!files.length) return;

        let currentId = editProduct?.ma_sanpham;

        // Nếu đang tạo mới (chưa có ID), phải tạo sản phẩm trước
        if (!currentId) {
            // Kiểm tra các trường bắt buộc để tạo sản phẩm
            if (!form.ten_sanpham || !form.ma_danhmuc || !form.ma_thuonghieu || !form.gia) {
                toast.error('Vui lòng nhập Tên, Danh mục, Thương hiệu và Giá trước khi tải ảnh');
                setActiveTab('basic');
                return;
            }

            setUploading(true);
            try {
                const payload = {
                    ...form,
                    gia: Number(form.gia),
                    ma_danhmuc: Number(form.ma_danhmuc),
                    ma_thuonghieu: Number(form.ma_thuonghieu)
                };
                const res = await productsApi.create(payload);
                currentId = res.data?.ma_sanpham;
                setEditProduct(res.data);
                toast.success('Đã tự động khởi tạo sản phẩm dự thảo');
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Không thể tạo sản phẩm để tải ảnh');
                setUploading(false);
                return;
            }
        }

        setUploading(true);
        let successCount = 0;
        try {
            for (const file of files) {
                const fd = new FormData();
                fd.append('file', file);
                // Nếu sản phẩm chưa có ảnh nào thì đặt tấm đầu tiên là ảnh chính
                const isFirst = !editProduct || !editProduct.hinhanh || editProduct.hinhanh.length === 0;
                fd.append('is_main', (isFirst && successCount === 0) ? 'true' : 'false');
                
                await productsApi.uploadImage(currentId, fd);
                successCount++;
            }
            if (successCount > 0) {
                toast.success(`Đã tải lên thành công ${successCount} ảnh`);
                load(); // Tải lại danh sách để cập nhật ảnh
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải một số ảnh');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Ảnh hiện tại */}
            {editProduct?.hinhanh?.length > 0 && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                            Ảnh sản phẩm ({editProduct.hinhanh.length})
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>
                            💡 Click vào ảnh để đặt làm ảnh đại diện
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        {editProduct.hinhanh.map((img: any) => (
                            <div key={img.ma_anh} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px' }}>
                                {/* Image card — click to set main */}
                                <div
                                    onClick={async () => {
                                        if (img.is_main) return;
                                        try {
                                            await productsApi.setMain(editProduct.ma_sanpham, img.ma_anh);
                                            toast.success('✅ Đã đặt ảnh đại diện');
                                            load();
                                        } catch { toast.error('Lỗi khi đổi ảnh đại diện'); }
                                    }}
                                    style={{
                                        position: 'relative', width: '120px', height: '95px',
                                        borderRadius: '14px', overflow: 'hidden',
                                        border: img.is_main ? '2.5px solid var(--primary)' : '1.5px solid var(--border-light)',
                                        background: 'var(--bg-deep)',
                                        cursor: img.is_main ? 'default' : 'pointer',
                                        boxShadow: img.is_main ? '0 0 0 3px rgba(var(--primary-rgb),0.15)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { if (!img.is_main) e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb),0.5)'; }}
                                    onMouseLeave={e => { if (!img.is_main) e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                                >
                                    <img src={`${API_HOST}${img.image_url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                    {/* Main badge */}
                                    {img.is_main && (
                                        <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--primary)', borderRadius: '6px', padding: '2px 8px', fontSize: '9px', fontWeight: 900, color: 'white', letterSpacing: '0.5px' }}>
                                            ⭐ CHÍNH
                                        </div>
                                    )}

                                    {/* Hover overlay khi chưa là ảnh chính */}
                                    {!img.is_main && (
                                        <div className="img-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                                            <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '4px 10px', fontSize: '10px', fontWeight: 800, color: 'white', opacity: 0, transition: '0.2s' }} className="img-overlay-label">
                                                Đặt làm đại diện
                                            </div>
                                        </div>
                                    )}

                                    {/* Delete button */}
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!confirm('Xóa ảnh này?')) return;
                                            try { await productsApi.deleteImage(img.ma_anh); load(); }
                                            catch { toast.error('Lỗi khi xóa ảnh'); }
                                        }}
                                        style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                    >
                                        <X size={11} />
                                    </button>
                                </div>

                                {/* Dropdown màu sắc — lấy từ ô màu ở tab Cơ bản */}
                                <select
                                    className="input-premium"
                                    value={img.mau_sac || ''}
                                    style={{ width: '100%', fontSize: '12px', padding: '6px 8px', height: 'auto', textAlign: 'center', cursor: 'pointer' }}
                                    onChange={async (e) => {
                                        const newVal = e.target.value;
                                        try {
                                            await productsApi.updateImage(img.ma_anh, { mau_sac: newVal });
                                            toast.success(newVal ? `🎨 Màu: ${newVal}` : 'Đã xóa màu');
                                            load();
                                        } catch { toast.error('Lỗi cập nhật màu'); }
                                    }}
                                >
                                    <option value="">-- Chọn màu --</option>
                                    {colors.length > 0
                                        ? colors.map((c: string) => <option key={c} value={c}>{c}</option>)
                                        : <option disabled>⚠ Chưa có màu (điền ở tab Cơ bản)</option>
                                    }
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload area */}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 24px', background: 'rgba(0,0,0,0.02)', border: '2px dashed var(--border-light)', borderRadius: '18px', cursor: uploading ? 'default' : 'pointer', transition: '0.2s', opacity: uploading ? 0.6 : 1 }}
                onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb),0.3)')}
                onMouseLeave={e => !uploading && (e.currentTarget.style.borderColor = 'var(--border-light)')}>
                <div style={{ width: '52px', height: '52px', background: 'var(--primary-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploading ? <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} /> : <Image size={22} color="var(--primary)" />}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '14px', margin: 0 }}>{uploading ? 'Đang tải ảnh lên...' : 'Chọn hoặc thả ảnh vào đây'}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Ảnh sẽ được lưu trực tiếp vào hệ thống</p>
                </div>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} disabled={uploading} onChange={onFileChange} />
            </label>
        </div>
    );
}
