import { useEffect, useState } from 'react';
import { reviewsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Trash2, Star, Calendar, MessageSquare } from 'lucide-react';
import { PageHeader, SpinnerPage, EmptyState } from '../components/ui';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        reviewsApi.getAll({ trang_thai: filter })
            .then(r => {
                const res = r.data;
                setReviews(Array.isArray(res) ? res : (res.data || []));
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [filter]);

    const approve = async (id: number) => {
        try {
            await reviewsApi.approve(id);
            toast.success('Đã duyệt đánh giá');
            load();
        } catch {
            toast.error('Lỗi khi duyệt');
        }
    };

    const reject = async (id: number) => {
        try {
            await reviewsApi.reject(id);
            toast.success('Đã từ chối đánh giá');
            load();
        } catch {
            toast.error('Lỗi khi từ chối');
        }
    };

    const del = async (id: number) => {
        try {
            await reviewsApi.delete(id);
            toast.success('Đã xóa đánh giá');
            load();
        } catch {
            toast.error('Lỗi khi xóa');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Đánh giá dịch vụ"
                description="Lắng nghe phản hồi từ khách hàng để tối ưu trải nghiệm và quản lý nội dung."
                action={
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-light)', backdropFilter: 'blur(10px)' }}>
                        {['pending', 'approved', 'rejected'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: filter === s ? 'var(--primary)' : 'transparent',
                                    color: filter === s ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    boxShadow: filter === s ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
                                }}
                            >
                                {s === 'pending' ? 'Chờ duyệt' : s === 'approved' ? 'Công khai' : 'Từ chối'}
                            </button>
                        ))}
                    </div>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {loading ? (
                    <SpinnerPage />
                ) : reviews.length === 0 ? (
                    <EmptyState message="Không có phản hồi nào trong danh sách này." icon={<MessageSquare size={48} />} />
                ) : (
                    reviews.map((r: any) => (
                        <div key={r.ma_danhgia} className="premium-card glass-panel" style={{ padding: '32px', display: 'flex', gap: '32px', justifyContent: 'space-between', alignItems: 'flex-start', border: '1px solid var(--border-light)' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '14px',
                                        background: 'rgba(var(--primary-rgb), 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '20px', fontWeight: 950, color: 'var(--primary)',
                                        border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                        textShadow: '0 0 10px rgba(var(--primary-rgb), 0.3)'
                                    }}>
                                        {(r.user?.hovaten || r.user?.ten_user || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 900, color: 'white', fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>{r.user?.hovaten || r.user?.ten_user}</div>
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < r.diem_danhgia ? '#f59e0b' : 'transparent'}
                                                    color={i < r.diem_danhgia ? '#f59e0b' : '#334155'}
                                                    style={{ filter: i < r.diem_danhgia ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' : 'none' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {r.sanpham && (
                                        <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Sản phẩm</span>
                                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>{r.sanpham.ten_sanpham}</div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                                    {r.tieu_de && <h4 style={{ fontWeight: 900, color: 'white', marginBottom: '12px', fontSize: '18px', letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif' }}>{r.tieu_de}</h4>}
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, fontWeight: 500, margin: 0 }}>{r.viet_danhgia}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        {new Date(r.ngay_lap).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' })}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0, width: '200px' }}>
                                {filter === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => approve(r.ma_danhgia)}
                                            className="btn-premium"
                                            style={{ width: '100%', height: '48px', padding: 0, justifyContent: 'center', background: '#10b981', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                                        >
                                            <CheckCircle size={18} /> Chấp thuận
                                        </button>
                                        <button
                                            onClick={() => reject(r.ma_danhgia)}
                                            style={{ width: '100%', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}
                                            className="hover-amber"
                                        >
                                            <XCircle size={18} /> Từ chối
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => del(r.ma_danhgia)}
                                    style={{ width: '100%', height: '48px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}
                                    className="hover-red"
                                >
                                    <Trash2 size={18} /> Xóa vĩnh viễn
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .glass-panel:hover { transform: translateY(-4px); border-color: rgba(var(--primary-rgb), 0.3) !important; }
                .hover-amber:hover { background: #f59e0b !important; color: white !important; }
                .hover-red:hover { background: #ef4444 !important; color: white !important; }
            `}</style>
        </div>
    );
}
