import { useEffect, useRef, useState } from 'react';
import { inventoryApi } from '../lib/api';
import toast from 'react-hot-toast';
import { PackageSearch, RefreshCw, Trash2 } from 'lucide-react';
import { PageHeader, Spinner } from '../components/ui';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [editing, setEditing] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

    const load = () => {
        setLoading(true);
        inventoryApi.getAll()
            .then(r => {
                const data = r.data || [];
                setItems(data);
                // Khởi tạo editing với giá trị hiện tại
                const init: Record<number, number> = {};
                data.forEach((item: any) => {
                    init[item.ma_sanpham] = Number(item.soluong_tonkho) || 0;
                });
                setEditing(init);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const deleteAll = async () => {
        if (!window.confirm('CẢNH BÁO: Xóa TOÀN BỘ dữ liệu tồn kho? Không thể hoàn tác!')) return;
        try {
            await inventoryApi.deleteAll();
            toast.success('Đã xóa sạch dữ liệu tồn kho');
            load();
        } catch {
            // handled by interceptor
        }
    };

    const update = async (ma_sanpham: number) => {
        const qty = editing[ma_sanpham];
        if (qty === undefined) { toast.error('Vui lòng nhập số lượng'); return; }
        setUpdating(ma_sanpham);
        try {
            await inventoryApi.update(ma_sanpham, qty);
            toast.success('✅ Cập nhật tồn kho thành công');
            load();
        } catch {
            toast.error('Lỗi khi cập nhật tồn kho');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusInfo = (qty: number) => {
        if (qty <= 0) return { label: 'Hết hàng', color: '#ef4444', bg: '#fef2f2' };
        if (qty < 5) return { label: 'Sắp hết', color: '#f59e0b', bg: '#fffbeb' };
        return { label: 'Còn hàng', color: '#10b981', bg: '#f0fdf4' };
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Kiểm soát tồn kho"
                description={<>Quản lý <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{items.length}</span> mẫu xe trong hệ thống và điều chỉnh lượng hàng.</>}
                action={
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={load} className="btn-premium" style={{
                            background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
                            border: '1px solid rgba(59,130,246,0.2)', height: '48px',
                            padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <RefreshCw size={16} /> Làm mới
                        </button>
                        <button onClick={deleteAll} className="btn-premium" style={{
                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.2)', height: '48px',
                            padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <Trash2 size={16} /> Xóa tất cả
                        </button>
                    </div>
                }
            />

            <div className="modern-table-container" style={{ overflowX: 'auto' }}>
                <table className="modern-table" style={{ width: '100%', minWidth: '800px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Mã SP</th>
                            <th>Tên sản phẩm</th>
                            <th style={{ width: '120px' }}>Dòng xe</th>
                            <th style={{ width: '140px', textAlign: 'center' }}>Tồn kho hiện tại</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '100px', textAlign: 'center' }}><Spinner /></td></tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '80px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', opacity: 0.5 }}>
                                        <PackageSearch size={48} />
                                        <p style={{ fontWeight: 700 }}>Không có dữ liệu tồn kho</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item: any) => {
                                const qty = Number(item.soluong_tonkho) || 0;
                                const status = getStatusInfo(qty);
                                const currentEdit = editing[item.ma_sanpham] ?? qty;
                                const isUpdating = updating === item.ma_sanpham;

                                return (
                                    <tr key={item.ma_sanpham}>
                                        {/* Mã SP */}
                                        <td>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                                                #{item.ma_sanpham}
                                            </span>
                                        </td>

                                        {/* Tên sản phẩm */}
                                        <td>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                                                {item.ten_sanpham || '—'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                                                {item.ma_tonkho ? `ID Kho: ${item.ma_tonkho}` : '—'}
                                            </div>
                                        </td>

                                        {/* Dòng xe */}
                                        <td>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                                color: '#6b7280', background: '#f3f4f6', padding: '3px 8px',
                                                borderRadius: '6px', display: 'inline-block'
                                            }}>
                                                {(item.kieu_xe || 'standard').replace(/_/g, ' ')}
                                            </span>
                                        </td>

                                        {/* Tồn kho hiện tại (Interactive) */}
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <input
                                                    ref={el => { inputRefs.current[item.ma_sanpham] = el; }}
                                                    type="number"
                                                    min="0"
                                                    value={currentEdit}
                                                    onChange={e => setEditing(prev => ({
                                                        ...prev,
                                                        [item.ma_sanpham]: Number(e.target.value)
                                                    }))}
                                                    style={{
                                                        width: '80px', height: '40px', textAlign: 'center',
                                                        fontWeight: 900, fontSize: '18px', color: '#111827',
                                                        border: currentEdit !== qty ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        background: currentEdit !== qty ? '#eff6ff' : '#fff',
                                                        outline: 'none', transition: 'all 0.2s',
                                                        fontFamily: 'Outfit, sans-serif'
                                                    }}
                                                />
                                                <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    {qty} xe gốc
                                                </span>
                                            </div>
                                        </td>

                                        {/* Trạng thái */}
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '5px 12px', borderRadius: '20px',
                                                background: status.bg, color: status.color,
                                                fontSize: '12px', fontWeight: 700, border: `1px solid ${status.color}30`
                                            }}>
                                                <span style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: status.color, display: 'inline-block'
                                                }} />
                                                {status.label}
                                            </span>
                                        </td>

                                        {/* Nút cập nhật */}
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => update(item.ma_sanpham)}
                                                disabled={isUpdating || currentEdit === qty}
                                                style={{
                                                    padding: '10px 20px', fontSize: '13px', fontWeight: 800,
                                                    background: currentEdit !== qty ? 'var(--primary)' : '#f3f4f6',
                                                    color: currentEdit !== qty ? '#fff' : '#9ca3af',
                                                    border: 'none', borderRadius: '10px',
                                                    cursor: currentEdit !== qty ? 'pointer' : 'default',
                                                    transition: 'all 0.2s',
                                                    boxShadow: currentEdit !== qty ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
                                                }}
                                            >
                                                {isUpdating ? '...' : (currentEdit !== qty ? 'Cập nhật' : 'Đã lưu')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
