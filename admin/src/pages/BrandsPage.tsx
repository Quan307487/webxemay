import { useEffect, useState } from 'react';
import { brandsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, Award, Globe, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { PageHeader, SpinnerPage } from '../components/ui';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import ActionButtons from '../components/ui/ActionButtons';

export default function BrandsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '', logo_url: '' });
    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        brandsApi.getAll()
            .then(r => setItems(r.data))
            .catch(() => toast.error('Lỗi tải danh sách thương hiệu'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!form.ten_thuonghieu) return toast.error('Vui lòng nhập tên thương hiệu');
        try {
            if (editing) {
                await brandsApi.update(editing, form);
                toast.success('Đã cập nhật thương hiệu thành công');
            } else {
                await brandsApi.create(form);
                toast.success('Đã thêm thương hiệu mới');
            }
            setForm({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '', logo_url: '' });
            setEditing(null);
            setShowForm(false);
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi lưu dữ liệu');
        }
    };

    const del = async (id: number) => {
        if (!confirm('Xóa thương hiệu này? Sản phẩm thuộc thương hiệu này có thể bị ảnh hưởng.')) return;
        try {
            await brandsApi.delete(id);
            toast.success('Đã xóa thương hiệu');
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi xóa thương hiệu');
        }
    };

    const toggleActive = async (item: any) => {
        try {
            await brandsApi.update(item.ma_thuonghieu, { is_active: item.is_active ? 0 : 1 });
            toast.success(item.is_active ? 'Đã ẩn thương hiệu' : 'Đã hiển thị thương hiệu');
            load();
        } catch {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Quản lý thương hiệu"
                description={<>Quản lý các đối tác chiến lược với <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> thương hiệu uy tín.</>}
                action={
                    <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '', logo_url: '' }); }} className="btn-premium">
                        <Plus size={18} /> Thêm thương hiệu
                    </button>
                }
            />

            {showForm && (
                <div className="premium-card glass-panel" style={{ marginBottom: '40px', animation: 'slideUp 0.4s ease-out', border: '1px solid rgba(var(--primary-rgb), 0.2)', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{editing ? 'Cập nhật đối tác' : 'Khởi tạo đối tác mới'}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Cung cấp thông tin đầy đủ để tối ưu hóa quản lý hệ thống.</p>
                        </div>
                        <button onClick={() => setShowForm(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                        {/* Preview Area */}
                        <div style={{ width: '160px', flexShrink: 0 }}>
                            <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px', display: 'block' }}>LOGO PREVIEW</label>
                            <div style={{ width: '160px', height: '160px', borderRadius: '24px', background: 'white', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '16px', boxShadow: '0 12px 24px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                                {form.logo_url ? (
                                    <img src={form.logo_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.src = 'https://via.placeholder.com/160x160?text=Invalid+Link'; }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                                        <ImageIcon size={48} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                                        <div style={{ fontSize: '11px', fontWeight: 800 }}>DÁN LINK VÀO</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>TÊN THƯƠNG HIỆU <span style={{ color: '#ef4444' }}>*</span></label>
                                <input className="input-premium" style={{ width: '100%', height: '48px', fontWeight: 700 }} placeholder="VD: Honda, Yamaha..." value={form.ten_thuonghieu} onChange={e => setForm({ ...form, ten_thuonghieu: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>QUỐC GIA</label>
                                <input className="input-premium" style={{ width: '100%', height: '48px', fontWeight: 700 }} placeholder="VD: Nhật Bản, Ý..." value={form.nuoc_san_xuat} onChange={e => setForm({ ...form, nuoc_san_xuat: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>LINK LOGO (URL) <LinkIcon size={12} style={{ marginLeft: '4px' }} /></label>
                                <input className="input-premium" style={{ width: '100%', height: '48px', fontWeight: 600, color: '#3b82f6' }} placeholder="https://example.com/images/logo.png" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '1px' }}>MÔ TẢ THƯƠNG HIỆU</label>
                                <textarea className="input-premium" style={{ width: '100%', minHeight: '100px', fontWeight: 500, padding: '16px', lineHeight: '1.6' }} placeholder="Nhập tóm tắt mô tả thương hiệu..." value={form.mo_ta} onChange={e => setForm({ ...form, mo_ta: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
                                <button onClick={save} className="btn-premium" style={{ width: '100%', height: '52px', fontSize: '15px', fontWeight: 800 }}>
                                    {editing ? 'Cập nhật thương hiệu' : 'Khởi tạo ngay'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center' }}><SpinnerPage /></div>
                ) : items.length === 0 ? (
                    <EmptyState message="Chưa có đối tác thương hiệu nào." icon={<Award size={48} />} />
                ) : items.map((item: any) => (
                    <div key={item.ma_thuonghieu} className="premium-card glass-panel card-hover" style={{ padding: '36px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9', overflow: 'hidden', padding: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
                                {item.logo_url ? (
                                    <img src={item.logo_url} alt={item.ten_thuonghieu} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e: any) => { e.target.src = 'https://via.placeholder.com/80x80?text=Logo'; }} />
                                ) : (
                                    <Award size={36} color="#3b82f6" strokeWidth={1.5} />
                                )}
                            </div>
                            <ActionButtons
                                onEdit={() => { setForm({ ten_thuonghieu: item.ten_thuonghieu, nuoc_san_xuat: item.nuoc_san_xuat || '', mo_ta: item.mo_ta || '', logo_url: item.logo_url || '' }); setEditing(item.ma_thuonghieu); setShowForm(true); }}
                                onDelete={() => del(item.ma_thuonghieu)}
                            />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{item.ten_thuonghieu}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '8px', letterSpacing: '0.5px' }}>{item.nuoc_san_xuat?.toUpperCase() || 'INTERNATIONAL'}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.7', height: '48px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {item.mo_ta || 'Thương hiệu hàng đầu với chất lượng đã được khẳng định trên toàn thế giới.'}
                        </p>
                        <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusBadge active={!!item.is_active} onClick={() => toggleActive(item)} />
                            <span style={{ fontSize: '11px', fontWeight: 900, color: '#cbd5e1', letterSpacing: '1px' }}>ID #{item.ma_thuonghieu}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
