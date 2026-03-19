import { useEffect, useState } from 'react';
import { brandsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, Award, Globe, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { SpinnerPage } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import ActionButtons from '../components/ui/ActionButtons';

export default function BrandsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '' });
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
            setForm({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '' });
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
                    <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ ten_thuonghieu: '', nuoc_san_xuat: '', mo_ta: '' }); }} className="btn-premium">
                        <Plus size={18} /> Thêm thương hiệu
                    </button>
                }
            />

            {showForm && (
                <div className="premium-card glass-panel" style={{ marginBottom: '40px', animation: 'slideUp 0.4s ease-out', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{editing ? 'Cập nhật thương hiệu' : 'Khởi tạo đối tác mới'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>TÊN THƯƠNG HIỆU</label>
                            <input className="input-premium" style={{ width: '100%', fontWeight: 700 }} placeholder="Nhập tên..." value={form.ten_thuonghieu} onChange={e => setForm({ ...form, ten_thuonghieu: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>QUỐC GIA</label>
                            <input className="input-premium" style={{ width: '100%', fontWeight: 700 }} placeholder="VD: Nhật Bản..." value={form.nuoc_san_xuat} onChange={e => setForm({ ...form, nuoc_san_xuat: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>MÔ TẢ ĐỐI TÁC</label>
                            <input className="input-premium" style={{ width: '100%', fontWeight: 600 }} placeholder="Mô tả ngắn..." value={form.mo_ta} onChange={e => setForm({ ...form, mo_ta: e.target.value })} />
                        </div>
                        <div style={{ alignSelf: 'flex-end', height: '48px' }}>
                            <button onClick={save} className="btn-premium" style={{ height: '48px', padding: '0 40px' }}>
                                {editing ? 'Cập nhật' : 'Lưu dữ liệu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center' }}><SpinnerPage /></div>
                ) : items.length === 0 ? (
                    <EmptyState message="Chưa có đối tác thương hiệu nào." icon={<Award size={48} />} />
                ) : items.map((item: any) => (
                    <div key={item.ma_thuonghieu} className="premium-card glass-panel" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                                <Award size={28} />
                            </div>
                            <ActionButtons
                                onEdit={() => { setForm({ ten_thuonghieu: item.ten_thuonghieu, nuoc_san_xuat: item.nuoc_san_xuat || '', mo_ta: item.mo_ta || '' }); setEditing(item.ma_thuonghieu); setShowForm(true); }}
                                onDelete={() => del(item.ma_thuonghieu)}
                            />
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{item.ten_thuonghieu}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>{item.nuoc_san_xuat || 'International'}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.6', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {item.mo_ta || 'Thương hiệu đối tác chiến lược hàng đầu.'}
                        </p>
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusBadge active={!!item.is_active} onClick={() => toggleActive(item)} />
                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px' }}>BRAND_ID #{item.ma_thuonghieu}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
