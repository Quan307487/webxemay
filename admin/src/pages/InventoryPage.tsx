import { useEffect, useState } from 'react';
import { inventoryApi } from '../lib/api';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [editing, setEditing] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        inventoryApi.getAll()
            .then(r => setItems(r.data || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const update = async (ma_sanpham: number) => {
        const qty = editing[ma_sanpham];
        if (qty === undefined) return;
        try {
            await inventoryApi.update(ma_sanpham, qty);
            toast.success('Cập nhật tồn kho thành công');
            load();
        } catch {
            toast.error('Lỗi khi cập nhật tồn kho');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Kiểm soát tồn kho</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                        Quản lý <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> mẫu xe trong hệ thống và điều chỉnh lượng hàng.
                    </p>
                </div>
            </header>

            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Mã SP</th>
                            <th>Xác nhận sản phẩm</th>
                            <th>Dòng xe</th>
                            <th>Trạng thái tồn</th>
                            <th style={{ textAlign: 'center' }}>Điều chỉnh</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
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
                                    Hệ thống không tìm thấy dữ liệu tồn kho.
                                </td>
                            </tr>
                        ) : (
                            items.map((item: any) => (
                                <tr key={item.ma_tonkho}>
                                    <td>
                                        <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.5px' }}>
                                            #{item.ma_sanpham}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{item.sanpham?.ten_sanpham || '—'}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>ID Kho: {item.ma_tonkho}</div>
                                    </td>
                                    <td>
                                        <div style={{
                                            fontSize: '11px',
                                            color: 'var(--text-secondary)',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-light)',
                                            display: 'inline-block'
                                        }}>
                                            {item.sanpham?.kieu_xe?.replace('_', ' ') || 'STANDARD'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {(() => {
                                                const qty = item.soluong_tonkho;
                                                const isOut = qty <= 0;
                                                const isLow = qty > 0 && qty < 5;
                                                const color = isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981';
                                                return (
                                                    <div className="status-pill" style={{
                                                        background: `${color}15`,
                                                        color: color,
                                                        border: `1px solid ${color}25`,
                                                        padding: '8px 16px',
                                                        minWidth: '130px',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div className="status-glow" style={{ color: color }} />
                                                        {isOut ? 'HẾT HÀNG' : isLow ? 'SẮP HẾT' : 'CÒN HÀNG'}
                                                        {isLow && <AlertTriangle size={14} style={{ marginLeft: '4px' }} />}
                                                    </div>
                                                );
                                            })()}
                                            <span style={{ fontSize: '18px', fontWeight: 900, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{item.soluong_tonkho}</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-premium"
                                            defaultValue={item.soluong_tonkho}
                                            onChange={e => setEditing({ ...editing, [item.ma_sanpham]: Number(e.target.value) })}
                                            style={{ width: '100px', height: '40px', textAlign: 'center', fontWeight: 900, fontSize: '15px' }}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => update(item.ma_sanpham)}
                                            className="btn-premium"
                                            style={{ padding: '10px 24px', fontSize: '13px' }}
                                        >
                                            Cập nhật
                                        </button>
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
