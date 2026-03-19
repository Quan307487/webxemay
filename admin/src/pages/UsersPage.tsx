import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usersApi, ordersApi } from '../lib/api';
import toast from 'react-hot-toast';
import { X, Phone, Mail, MapPin, Calendar, Clock, Shield, User, ShoppingBag, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, Spinner } from '../components/ui';

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
    active: { label: 'Hoạt động', bg: '#10b98120', color: '#10b981' },
    inactive: { label: 'Tạm ngưng', bg: '#94a3b820', color: '#94a3b8' },
    banned: { label: 'Bị khóa', bg: '#ef444420', color: '#ef4444' },
};

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const load = (searchTerm = '') => {
        setLoading(true);
        usersApi.getAll(searchTerm.trim() ? { search: searchTerm.trim() } : {})
            .then(r => setUsers(r.data || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(''); }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            load(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const updateStatus = async (id: number, status: string) => {
        if (updating === id) return;
        setUpdating(id);
        try {
            await usersApi.updateStatus(id, status);
            setUsers(prev => prev.map(u => u.ma_user === id ? { ...u, status } : u));
            toast.success(`Đã cập nhật trạng thái: ${STATUS_CONFIG[status]?.label}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
            load();
        } finally {
            setUpdating(null);
        }
    };

    const viewDetails = async (id: number) => {
        try {
            const r = await usersApi.getOne(id);
            setSelectedUser(r.data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error('Không thể tải chi tiết người dùng');
        }
    };

    const deleteUser = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
        try {
            await usersApi.delete(id);
            setUsers(prev => prev.filter(u => u.ma_user !== id));
            toast.success('Đã xóa thành công');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Lỗi khi xóa');
        }
    };

    const openEdit = (user: any) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <PageHeader
                title="Quản trị thành viên"
                description={<>Thiết lập quyền hạn và kiểm soát trạng thái của <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{users.length}</span> tài khoản.</>}
                action={
                    <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-light)', backdropFilter: 'blur(10px)' }}>
                        <input
                            className="input-premium"
                            style={{ width: '280px', height: '48px', fontSize: '14px', fontWeight: 700 }}
                            placeholder="Tìm theo tên, email, SĐT..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && load(search)}
                        />
                        <button onClick={() => load(search)} className="btn-premium" style={{ height: '48px', padding: '0 24px' }}>
                            Tìm kiếm
                        </button>
                    </div>
                }
            />

            <div className="modern-table-container">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Thành viên</th>
                            <th>Thông tin liên hệ</th>
                            <th>Vai trò hệ thống</th>
                            <th>Trạng thái</th>
                            <th>Thiết lập bảo mật</th>
                            <th style={{ textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '100px', textAlign: 'center' }}>
                                    <Spinner />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    Hệ thống không tìm thấy dữ liệu người dùng yêu cầu.
                                </td>
                            </tr>
                        ) : (
                            users.map((u: any) => {
                                const sc = STATUS_CONFIG[u.status] || STATUS_CONFIG.active;
                                return (
                                    <tr key={u.ma_user}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <div style={{
                                                    width: '44px', height: '44px', borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '18px', fontWeight: 900, color: 'white',
                                                    border: '1px solid var(--border-light)'
                                                }}>
                                                    {(u.ten_user || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{u.ten_user}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>ID: #{u.ma_user}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '14px', color: 'white', fontWeight: 700 }}>{u.hovaten || '—'}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>{u.email}</div>
                                            {u.SDT && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{u.SDT}</div>}
                                        </td>
                                        <td>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                padding: '6px 14px', borderRadius: '10px',
                                                background: u.quyen === 'admin' ? 'rgba(230, 57, 70, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: u.quyen === 'admin' ? 'var(--primary)' : '#3b82f6',
                                                border: `1px solid ${u.quyen === 'admin' ? 'var(--primary)' : '#3b82f6'}20`,
                                                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.quyen === 'admin' ? 'var(--primary)' : '#3b82f6' }} />
                                                {u.quyen}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-pill" style={{
                                                background: `${sc.color}15`,
                                                color: sc.color,
                                                border: `1px solid ${sc.color}25`
                                            }}>
                                                <div className="status-glow" style={{ color: sc.color }} />
                                                {sc.label}
                                            </div>
                                        </td>
                                        <td>
                                            {u.quyen !== 'admin' ? (
                                                <div style={{ display: 'inline-block', position: 'relative' }}>
                                                    <select
                                                        disabled={updating === u.ma_user}
                                                        className="input-premium"
                                                        style={{
                                                            padding: '0 36px 0 16px',
                                                            height: '40px',
                                                            fontSize: '13px',
                                                            fontWeight: 800,
                                                            color: sc.color,
                                                            borderColor: `${sc.color}40`,
                                                            cursor: updating === u.ma_user ? 'wait' : 'pointer',
                                                            minWidth: '140px',
                                                            appearance: 'none'
                                                        }}
                                                        value={u.status}
                                                        onChange={e => updateStatus(u.ma_user, e.target.value)}
                                                    >
                                                        <option value="active" style={{ background: '#0f172a', color: '#10b981' }}>Cho phép hoạt động</option>
                                                        <option value="inactive" style={{ background: '#0f172a', color: '#94a3b8' }}>Tạm ngưng tài khoản</option>
                                                        <option value="banned" style={{ background: '#0f172a', color: '#ef4444' }}>Khóa tài khoản</option>
                                                    </select>
                                                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: sc.color, opacity: 0.6 }}>
                                                        {updating === u.ma_user ? (
                                                            <div style={{ width: '12px', height: '12px', border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                                        ) : (
                                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 700, fontStyle: 'italic' }}>Quản trị viên</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); viewDetails(u.ma_user); }}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        background: '#3b82f6',
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    title="Xem chi tiết"
                                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <img src="/realistic_eye.png" alt="view" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEdit(u); }}
                                                    className="btn-icon-premium"
                                                    title="Chỉnh sửa"
                                                    style={{ width: '36px', height: '36px', color: '#3b82f6' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {u.quyen !== 'admin' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteUser(u.ma_user); }}
                                                        className="btn-icon-premium"
                                                        title="Xóa tài khoản"
                                                        style={{ width: '36px', height: '36px', color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isEditModalOpen && editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => { setIsEditModalOpen(false); load(search); }}
                />
            )}

            <style>{`
                .modern-table tr:hover td { background: rgba(59, 130, 246, 0.03) !important; }
            `}</style>
        </div>
    );
}

function UserDetailModal({ user, onClose }: { user: any; onClose: () => void }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoadingOrders(true);
        ordersApi.getAll({ ma_user: user.ma_user })
            .then(r => {
                if (isMounted) setOrders(r.data.data || r.data || []);
            })
            .catch(err => {
                console.error('Failed to load user orders:', err);
                if (isMounted) setOrders([]); // Fail gracefully
            })
            .finally(() => {
                if (isMounted) setLoadingOrders(false);
            });

        return () => { isMounted = false; };
    }, [user.ma_user]);

    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--bg-card, #fff)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* Header - Fixed */}
                <div style={{ flex: 'none', padding: '24px 32px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main, #f8fafc)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: 'var(--primary)', background: 'rgba(230, 57, 70, 0.1)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                {(user.ten_user || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>{user.ten_user}</h2>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>ID Người dùng: #{user.ma_user}</div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'rgba(248, 250, 252, 0.5)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', marginBottom: '40px' }}>
                        {/* Profile Info */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} /> Thông tin hồ sơ
                            </h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <InfoRow icon={<Shield size={16} />} label="Họ và tên" value={user.hovaten || '—'} />
                                <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
                                <InfoRow icon={<Phone size={16} />} label="Số điện thoại" value={user.SDT || '—'} />
                                <InfoRow icon={<MapPin size={16} />} label="Địa chỉ" value={user.diachi || 'Chưa cung cấp'} />
                            </div>
                        </div>

                        {/* System Info */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={16} /> Hệ thống & Quyền hạn
                            </h3>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <InfoRow icon={<Shield size={16} />} label="Vai trò" value={user.quyen} isPill color={user.quyen === 'admin' ? 'var(--primary, #e63946)' : '#3b82f6'} />
                                <InfoRow icon={<Clock size={16} />} label="Trạng thái" value={user.status} isPill color={user.status === 'active' ? '#10b981' : user.status === 'banned' ? '#ef4444' : '#94a3b8'} />
                                <InfoRow icon={<Calendar size={16} />} label="Ngày tham gia" value={user.ngay_lap ? new Date(user.ngay_lap).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'} />
                                <InfoRow icon={<Clock size={16} />} label="Cập nhật gần nhất" value={user.cap_nhat_ngay ? new Date(user.cap_nhat_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'} />
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingBag size={16} /> Lịch sử đơn hàng gần đây
                        </h3>
                        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                                        <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mã đơn</th>
                                        <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ngày đặt</th>
                                        <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Tổng tiền</th>
                                        <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingOrders ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-small" /></td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>Chưa có đơn hàng nào</td></tr>
                                    ) : (
                                        orders.map((o: any) => (
                                            <tr key={o.ma_donhang} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>#{o.code}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>{new Date(o.ngay_lap).toLocaleDateString('vi-VN')}</td>
                                                <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 800, color: 'var(--primary)', textAlign: 'right' }}>{Number(o.tong_tien).toLocaleString()}đ</td>
                                                <td style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
                                                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, background: '#f1f5f9', color: '#475569' }}>{o.trang_thai}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .spinner-small { width: 24px; height: 24px; border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--primary, #e63946); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
            `}</style>
        </div>,
        document.body
    );
}

function EditUserModal({ user, onClose, onSuccess }: { user: any; onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        hovaten: user.hovaten || '',
        email: user.email || '',
        SDT: user.SDT || '',
        diachi: user.diachi || '',
        quyen: user.quyen || 'customer'
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await usersApi.update(user.ma_user, formData);
            toast.success('Cập nhật người dùng thành công');
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Lỗi khi cập nhật');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '500px', background: 'var(--bg-card, #fff)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main, #f8fafc)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>Chỉnh sửa thành viên</h2>
                    <button type="button" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="custom-scrollbar" style={{ padding: '24px 32px', overflowY: 'auto', maxHeight: '80vh', flex: 1, background: 'rgba(248, 250, 252, 0.5)' }}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Họ và tên</label>
                            <input className="input-premium" style={{ width: '100%', background: '#fff', fontWeight: 600, color: 'var(--text-primary)', boxSizing: 'border-box' }} value={formData.hovaten} onChange={e => setFormData({ ...formData, hovaten: e.target.value })} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Email</label>
                            <input className="input-premium" type="email" style={{ width: '100%', background: '#fff', fontWeight: 600, color: 'var(--text-primary)', boxSizing: 'border-box' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Số điện thoại</label>
                                <input className="input-premium" style={{ width: '100%', background: '#fff', fontWeight: 600, color: 'var(--text-primary)', boxSizing: 'border-box' }} value={formData.SDT} onChange={e => setFormData({ ...formData, SDT: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Vai trò</label>
                                <select className="input-premium" style={{ width: '100%', background: '#fff', fontWeight: 600, color: 'var(--text-primary)', boxSizing: 'border-box', appearance: 'none' }} value={formData.quyen} onChange={e => setFormData({ ...formData, quyen: e.target.value })}>
                                    <option value="customer">Khách hàng</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Địa chỉ</label>
                            <textarea className="input-premium" style={{ width: '100%', height: '96px', paddingTop: '12px', background: '#fff', fontWeight: 600, color: 'var(--text-primary)', boxSizing: 'border-box', resize: 'vertical' }} value={formData.diachi} onChange={e => setFormData({ ...formData, diachi: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, height: '48px', borderRadius: '12px', fontWeight: 700, background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>Hủy</button>
                        <button type="submit" disabled={saving} className="btn-premium" style={{ flex: 1, height: '48px', justifyContent: 'center' }}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

function InfoRow({ icon, label, value, isPill, color }: { icon: any; label: string; value: string; isPill?: boolean; color?: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
                {icon}
                <span>{label}</span>
            </div>
            {isPill ? (
                <div style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', border: `1px solid ${color}25`, backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {value}
                </div>
            ) : (
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{value}</div>
            )}
        </div>
    );
}
