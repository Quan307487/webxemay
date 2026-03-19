import { useEffect, useState } from 'react';
import { couponsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, X, Calendar, Ticket } from 'lucide-react';
import { PageHeader, SpinnerPage, EmptyState, StatusBadge } from '../components/ui';

export default function CouponsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ ma_giamgia: '', kieu_giamgia: 'percentage', giatrigiam: '', don_toithieu: '', solandung: '', ngay_batdau: '', ngay_ketthuc: '', is_active: 1 });

    const load = () => {
        setLoading(true);
        couponsApi.getAll()
            .then(r => setItems(r.data || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        try {
            await couponsApi.create(form);
            toast.success('Đã tạo mã khuyến mãi thành công');
            setShowForm(false);
            load();
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi khi tạo mã');
        }
    };

    const toggleActive = async (item: any) => {
        try {
            await couponsApi.update(item.ma_khuyenmai, { is_active: item.is_active ? 0 : 1 });
            toast.success(item.is_active ? 'Đã tắt mã khuyến mãi' : 'Đã kích hoạt mã khuyến mãi');
            load();
        } catch {
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Chương trình khuyến mãi"
                description={<>Chiến dịch kích cầu hiệu quả với <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> mã giảm giá đang vận hành.</>}
                action={
                    <button onClick={() => setShowForm(!showForm)} className="btn-premium">
                        <Plus size={18} /> Tạo mã mới
                    </button>
                }
            />

            {showForm && (
                <div className="premium-card glass-panel" style={{ marginBottom: '40px', animation: 'slideUp 0.4s ease-out', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Thiết lập mã giảm giá mới</h3>
                        <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', transition: '0.3s' }} className="hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            ['Mã Code Giảm Giá *', 'ma_giamgia', 'text', 'VD: SUMMER2026'],
                            ['Giá Trị Giảm *', 'giatrigiam', 'number', '10'],
                            ['Đơn To tối thiểu', 'don_toithieu', 'number', '0'],
                            ['Tổng Lượt Sử Dụng', 'solandung', 'number', '100'],
                            ['Ngày Bắt Đầu *', 'ngay_batdau', 'datetime-local', ''],
                            ['Ngày Kết Thúc *', 'ngay_ketthuc', 'datetime-local', '']
                        ].map(([label, key, type, ph]) => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>{label}</label>
                                <input
                                    type={type as any}
                                    className="input-premium"
                                    placeholder={ph}
                                    style={{ width: '100%', fontWeight: 700 }}
                                    value={(form as any)[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                />
                            </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>LOẠI KHUYẾN MÃI</label>
                            <select
                                className="input-premium"
                                style={{ width: '100%', fontWeight: 700, appearance: 'none' }}
                                value={form.kieu_giamgia}
                                onChange={e => setForm({ ...form, kieu_giamgia: e.target.value })}
                            >
                                <option value="percentage" style={{ background: '#0f172a' }}>Phần trăm (%)</option>
                                <option value="fixed_amount" style={{ background: '#0f172a' }}>Số tiền cố định (đ)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        <button onClick={save} className="btn-premium" style={{ height: '52px', padding: '0 48px' }}>Kích hoạt chương trình</button>
                        <button onClick={() => setShowForm(false)} style={{ height: '52px', padding: '0 32px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }} className="hover:bg-white hover:text-black">Hủy bỏ</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {loading ? (
                    <SpinnerPage />
                ) : items.length === 0 ? (
                    <EmptyState message="Hệ thống chưa có mã khuyến mãi nào được tạo." icon={<Ticket size={48} />} />
                ) : (
                    items.map((item: any) => (
                        <div key={item.ma_khuyenmai} className="premium-card glass-panel" style={{ padding: '32px', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                                <div style={{
                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                    color: 'var(--primary)',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                    boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.05)'
                                }}>
                                    <code style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px', fontFamily: 'monospace' }}>{item.ma_giamgia}</code>
                                </div>
                                <StatusBadge active={!!item.is_active} onClick={() => toggleActive(item)} activeLabel="ACTIVE" inactiveLabel="DISABLED" />
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                                <h3 style={{ color: 'white', fontWeight: 900, fontSize: '32px', margin: 0, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                    {item.kieu_giamgia === 'percentage' ? `${item.giatrigiam}%` : `${Number(item.giatrigiam).toLocaleString('vi-VN')}đ`}
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>OFF</span>
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Tối thiểu:</span>
                                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 800 }}>{Number(item.don_toithieu).toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Đã sử dụng:</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 900 }}>{item.solan_hientai}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700 }}> / {item.solandung || '∞'}</span>
                                    </div>
                                </div>
                                <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Calendar size={16} style={{ color: 'var(--primary)' }} />
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700 }}>
                                        {new Date(item.ngay_batdau).toLocaleDateString('vi-VN')} — {new Date(item.ngay_ketthuc).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .glass-panel:hover { border-color: rgba(var(--primary-rgb), 0.3) !important; transform: translateY(-4px); }
            `}</style>
        </div>
    );
}
