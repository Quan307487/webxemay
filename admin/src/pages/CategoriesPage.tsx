import { useEffect, useState } from 'react';
import { categoriesApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, Tag, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { SpinnerPage } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/ui/StatusBadge';
import ActionButtons from '../components/ui/ActionButtons';

export default function CategoriesPage() {
    const [items, setItems] = useState<any[]>([]);
    const [form, setForm] = useState({ ten_danhmuc: '', mo_ta: '' });
    const [editing, setEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        categoriesApi.getAll()
            .then(r => setItems(r.data))
            .catch(() => toast.error('Lỗi tải danh mục'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        if (!form.ten_danhmuc) return toast.error('Vui lòng nhập tên danh mục');
        try {
            if (editing) {
                await categoriesApi.update(editing, form);
                toast.success('Đã cập nhật danh mục thành công');
            } else {
                await categoriesApi.create(form);
                toast.success('Đã thêm danh mục mới');
            }
            setForm({ ten_danhmuc: '', mo_ta: '' });
            setEditing(null);
            setShowForm(false);
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi lưu dữ liệu');
        }
    };

    const del = async (id: number) => {
        if (!confirm('Xóa danh mục này? Hàng loạt sản phẩm thuộc danh mục này có thể bị ảnh hưởng.')) return;
        try {
            await categoriesApi.delete(id);
            toast.success('Đã xóa danh mục');
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi xóa danh mục');
        }
    };

    const toggleActive = async (item: any) => {
        try {
            await categoriesApi.update(item.ma_danhmuc, { is_active: item.is_active ? 0 : 1 });
            toast.success(item.is_active ? 'Đã ẩn danh mục' : 'Đã hiển thị danh mục');
            load();
        } catch {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Quản lý danh mục"
                description={<>Phân loại sản phẩm thông minh với <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> danh mục hiện hành.</>}
                action={
                    <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ ten_danhmuc: '', mo_ta: '' }); }} className="btn-premium">
                        <Plus size={18} /> Thêm danh mục
                    </button>
                }
            />

            {showForm && (
                <div className="premium-card glass-panel" style={{ marginBottom: '40px', animation: 'slideUp 0.4s ease-out', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{editing ? 'Cập nhật danh mục' : 'Khởi tạo danh mục mới'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>TÊN DANH MỤC</label>
                            <input className="input-premium" style={{ width: '100%', fontWeight: 700 }} placeholder="Nhập tên..." value={form.ten_danhmuc} onChange={e => setForm({ ...form, ten_danhmuc: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>MÔ TẢ CHI TIẾT</label>
                            <input className="input-premium" style={{ width: '100%', fontWeight: 600 }} placeholder="Mô tả ngắn về danh mục..." value={form.mo_ta} onChange={e => setForm({ ...form, mo_ta: e.target.value })} />
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
                    <EmptyState message="Hệ thống chưa ghi nhận danh mục nào." icon={<Tag size={48} />} />
                ) : items.map((item: any) => (
                    <div key={item.ma_danhmuc} className="premium-card glass-panel" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid rgba(var(--primary-rgb), 0.15)' }}>
                                <Tag size={28} />
                            </div>
                            <ActionButtons
                                onEdit={() => { setForm({ ten_danhmuc: item.ten_danhmuc, mo_ta: item.mo_ta || '' }); setEditing(item.ma_danhmuc); setShowForm(true); }}
                                onDelete={() => del(item.ma_danhmuc)}
                            />
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.ten_danhmuc}</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: '1.6', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {item.mo_ta || 'Danh mục sản phẩm chất lượng cao từ MotoShop.'}
                        </p>
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusBadge active={!!item.is_active} onClick={() => toggleActive(item)} />
                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '1px' }}>CAT_ID #{item.ma_danhmuc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
