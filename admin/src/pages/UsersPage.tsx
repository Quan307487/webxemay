import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usersApi, ordersApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Eye, X, Phone, Mail, MapPin, Calendar, Clock, Shield, User, ShoppingBag } from 'lucide-react';

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

    // Truyền searchTerm thẳng vào hàm để tránh stale closure
    const load = (searchTerm = '') => {
        setLoading(true);
        usersApi.getAll(searchTerm.trim() ? { search: searchTerm.trim() } : {})
            .then(r => setUsers(r.data || []))
            .finally(() => setLoading(false));
    };

    // Load ban đầu
    useEffect(() => { load(''); }, []);

    // Tìm kiếm realtime với debounce 400ms
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

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Quản trị thành viên</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                        Thiết lập quyền hạn và kiểm soát trạng thái của <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{users.length}</span> tài khoản.
                    </p>
                </div>
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
            </header>

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
                                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(230,57,70,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
                                            <button
                                                onClick={() => viewDetails(u.ma_user)}
                                                className="btn-icon-premium"
                                                title="Xem chi tiết"
                                                style={{ width: '36px', height: '36px' }}
                                            >
                                                <Eye size={16} />
                                            </button>
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

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .modern-table tr:hover td { background: rgba(59, 130, 246, 0.03) !important; }
            `}</style>
        </div>
    );
}

function UserDetailModal({ user, onClose }: { user: any; onClose: () => void }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        setLoadingOrders(true);
        ordersApi.getAll({ ma_user: user.ma_user })
            .then(r => setOrders(r.data.data || r.data || []))
            .finally(() => setLoadingOrders(false));
    }, [user.ma_user]);

    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', background: 'var(--card-bg)', border: '1px solid var(--border-light)', borderRadius: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>
                            {(user.ten_user || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{user.ten_user}</h2>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>ID Người dùng: #{user.ma_user}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-icon-premium" style={{ width: '40px', height: '40px' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '32px', overflowY: 'auto', maxHeight: 'calc(90vh - 100px)' }} className="custom-scrollbar">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
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
                                <InfoRow icon={<Shield size={16} />} label="Vai trò" value={user.quyen} isPill color={user.quyen === 'admin' ? 'var(--primary)' : '#3b82f6'} />
                                <InfoRow icon={<Clock size={16} />} label="Trạng thái" value={user.status} isPill color={user.status === 'active' ? '#10b981' : user.status === 'banned' ? '#ef4444' : '#94a3b8'} />
                                <InfoRow icon={<Calendar size={16} />} label="Ngày tham gia" value={new Date(user.ngay_lap).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                                <InfoRow icon={<Clock size={16} />} label="Cập nhật gần nhất" value={user.cap_nhat_ngay ? new Date(user.cap_nhat_ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'} />
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingBag size={16} /> Lịch sử đơn hàng gần đây
                        </h3>
                        <div className="modern-table-container" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)' }}>
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Mã đơn</th>
                                        <th>Ngày đặt</th>
                                        <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingOrders ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-small" /></td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có đơn hàng nào</td></tr>
                                    ) : (
                                        orders.map((o: any) => (
                                            <tr key={o.ma_donhang}>
                                                <td style={{ fontWeight: 800, color: 'white' }}>#{o.code}</td>
                                                <td style={{ fontSize: '13px' }}>{new Date(o.ngay_lap).toLocaleDateString('vi-VN')}</td>
                                                <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>{Number(o.tong_tien).toLocaleString()}đ</td>
                                                <td>
                                                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>{o.trang_thai}</span>
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
                .spinner-small { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
            `}</style>
        </div>,
        document.body
    );
}

function InfoRow({ icon, label, value, isPill, color }: { icon: any; label: string; value: string; isPill?: boolean; color?: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
                {icon}
                <span>{label}</span>
            </div>
            {isPill ? (
                <div style={{ padding: '4px 12px', borderRadius: '8px', background: `${color}15`, color: color, fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', border: `1px solid ${color}25` }}>
                    {value}
                </div>
            ) : (
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>{value}</div>
            )}
        </div>
    );
}
