import { useEffect, useState } from 'react';
import { paymentsApi } from '../lib/api';

const STATUS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Đang chờ', color: '#eab308' },
    success: { label: 'Thành công', color: '#10b981' },
    failed: { label: 'Thất bại', color: '#ef4444' },
    refunded: { label: 'Đã hoàn tiền', color: '#a855f7' }
};

export default function PaymentsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        paymentsApi.getAll(filter ? { trang_thai: filter } : {})
            .then(r => {
                const res = r.data;
                setItems(Array.isArray(res) ? res : (res.data || []));
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [filter]);

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Lịch sử thanh toán</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                        Theo dõi và đối soát các giao dịch tài chính với <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> lệnh thanh toán.
                    </p>
                </div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-light)', backdropFilter: 'blur(10px)' }}>
                    {['', 'pending', 'success', 'failed', 'refunded'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                border: 'none',
                                background: filter === s ? 'var(--primary)' : 'transparent',
                                color: filter === s ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 800,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: filter === s ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
                            }}
                        >
                            {s === '' ? 'Tất cả' : STATUS[s]?.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Định danh đơn</th>
                            <th>Giá trị giao dịch</th>
                            <th>Cổng thanh toán</th>
                            <th>Mã hệ thống</th>
                            <th>Thời gian</th>
                            <th style={{ textAlign: 'right' }}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '100px', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(230,57,70,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Không tìm thấy dữ liệu giao dịch nào.
                                </td>
                            </tr>
                        ) : (
                            items.map((item: any) => (
                                <tr key={item.ma_thanhtoan}>
                                    <td>
                                        <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                            {item.donhang?.donhang_code || `#ORD-${item.ma_donhang}`}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>TRX_ID: {item.ma_thanhtoan}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '16px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                                            {Number(item.thanh_tien).toLocaleString('vi-VN')}
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>VNĐ</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px',
                                                background: item.PT_thanhtoan === 'vnpay' ? 'rgba(0, 91, 170, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: `1px solid ${item.PT_thanhtoan === 'vnpay' ? '#005baa' : '#f59e0b'}25`
                                            }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.PT_thanhtoan === 'vnpay' ? '#005baa' : '#f59e0b', boxShadow: `0 0 10px ${item.PT_thanhtoan === 'vnpay' ? '#005baa' : '#f59e0b'}` }} />
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>{item.PT_thanhtoan}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{
                                            padding: '6px 12px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            display: 'inline-block'
                                        }}>
                                            <code style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, fontFamily: 'monospace' }}>
                                                {item.ma_giao_dich || '—'}
                                            </code>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                                            {new Date(item.ngay_thanhtoan).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(item.ngay_thanhtoan).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="status-pill" style={{
                                            background: `${STATUS[item.trang_thai]?.color}15`,
                                            color: STATUS[item.trang_thai]?.color,
                                            border: `1px solid ${STATUS[item.trang_thai]?.color}25`,
                                            display: 'inline-flex'
                                        }}>
                                            <div className="status-glow" style={{ color: STATUS[item.trang_thai]?.color }} />
                                            {STATUS[item.trang_thai]?.label || item.trang_thai}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .modern-table tr:hover td { background: rgba(59, 130, 246, 0.03) !important; }
            `}</style>
        </div>
    );
}
