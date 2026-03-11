import { useState, useEffect } from 'react';
import { Mail, Phone, Shield, Calendar, Eye, EyeOff, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function ProfilePage() {
    const [admin, setAdmin] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ hovaten: '', SDT: '', diachi: '' });
    const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('admin_user');
            if (raw) {
                const data = JSON.parse(raw);
                setAdmin(data);
                setForm({ hovaten: data.hovaten || '', SDT: data.SDT || '', diachi: data.diachi || '' });
            }
        } catch { /* ignore */ }
    }, []);

    function getInitials(name: string) {
        if (!name) return 'A';
        const parts = name.trim().split(' ');
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
    }

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            const res = await api.put('/users/me', form);
            const updated = { ...admin, ...res.data };
            localStorage.setItem('admin_user', JSON.stringify(updated));
            setAdmin(updated);
            setEditMode(false);
            toast.success('Cập nhật thông tin thành công!');
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Lỗi cập nhật');
        } finally { setSavingProfile(false); }
    };

    const handleChangePassword = async () => {
        if (pwForm.new_password !== pwForm.confirm) { toast.error('Xác nhận mật khẩu không khớp!'); return; }
        if (pwForm.new_password.length < 6) { toast.error('Mật khẩu cần ít nhất 6 ký tự'); return; }
        setSavingPw(true);
        try {
            await api.put('/users/me/password', { old_password: pwForm.old_password, new_password: pwForm.new_password });
            toast.success('Đổi mật khẩu thành công!');
            setPwForm({ old_password: '', new_password: '', confirm: '' });
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Mật khẩu cũ không đúng');
        } finally { setSavingPw(false); }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        const loadToast = toast.loading('Đang tải ảnh lên...');
        try {
            const res = await api.post('/users/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updated = { ...admin, ...res.data };
            localStorage.setItem('admin_user', JSON.stringify(updated));
            setAdmin(updated);
            toast.success('Cập nhật ảnh đại diện thành công!', { id: loadToast });
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Lỗi khi tải ảnh lên', { id: loadToast });
        } finally {
            setUploading(false);
        }
    };

    if (!admin) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(230,57,70,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>;

    const displayName = admin.hovaten || admin.ten_user || 'Admin';
    const initials = getInitials(displayName);

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            {/* Page Header */}
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Thiết lập tài khoản</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                    Quản lý thông tin định danh và bảo mật dành riêng cho <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Quản trị viên</span>.
                </p>
            </header>

            <form autoComplete="off" onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Autofill Trap */}
                <input type="text" style={{ display: 'none' }} />
                <input type="password" style={{ display: 'none' }} />
                {/* Left: Avatar Card */}
                <div className="premium-card glass-panel" style={{ padding: '48px 32px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                    <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto 32px' }}>
                        <div style={{
                            width: '140px', height: '140px',
                            background: admin.hinh_anh ? `url(${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${admin.hinh_anh})` : 'linear-gradient(135deg, var(--primary), #7f1d1d)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '56px', fontWeight: 950, color: 'white',
                            boxShadow: '0 20px 40px -10px rgba(var(--primary-rgb), 0.4)',
                            border: '2px solid rgba(255,255,255,0.1)',
                            transform: 'rotate(-3deg)',
                            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            overflow: 'hidden'
                        }}>
                            {!admin.hinh_anh && initials}
                        </div>

                        <label className="avatar-upload-label" style={{
                            position: 'absolute',
                            bottom: '-10px',
                            right: '-10px',
                            width: '44px',
                            height: '44px',
                            background: 'var(--primary)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.4)',
                            transition: 'all 0.3s ease',
                            zIndex: 10,
                            border: '3px solid var(--bg-main)'
                        }}>
                            <Camera size={20} />
                            <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        </label>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: 950, color: 'white', marginBottom: '6px', letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>{displayName}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', fontWeight: 600 }}>{admin.email}</p>

                    <div className="status-pill" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        padding: '8px 20px',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        marginBottom: '40px',
                        display: 'inline-flex'
                    }}>
                        <div className="status-glow" style={{ color: '#10b981' }} />
                        <Shield size={12} style={{ marginRight: '6px' }} />
                        XÁC THỰC QUẢN TRỊ
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                        {[
                            { icon: <Mail size={18} />, label: 'Hòm thư trực tuyến', value: admin.email },
                            { icon: <Phone size={18} />, label: 'Số điện thoại', value: admin.SDT || 'Chưa cập nhật' },
                            { icon: <Calendar size={18} />, label: 'Trạng thái tài khoản', value: admin.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng' },
                        ].map(({ icon, label, value }) => (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '18px', background: 'rgba(255,255,255,0.02)',
                                borderRadius: '20px', border: '1px solid var(--border-light)',
                                transition: '0.3s'
                            }} className="info-item">
                                <div style={{ color: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '14px' }}>{icon}</div>
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
                                    <p style={{ fontSize: '14px', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Edit info + Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Profile Info */}
                    <div className="premium-card glass-panel" style={{ padding: '40px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <div>
                                <h3 style={{ fontSize: '22px', fontWeight: 950, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Thông tin định danh</h3>
                                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600 }}>Cập nhật danh tính và phương thức liên lạc cá nhân.</p>
                            </div>
                            {!editMode ? (
                                <button className="btn-premium" style={{ height: '44px', padding: '0 28px', fontSize: '14px' }} onClick={() => setEditMode(true)}>
                                    Chỉnh sửa hồ sơ
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button onClick={() => setEditMode(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>Hủy bỏ</button>
                                    <button className="btn-premium" style={{ height: '44px', padding: '0 28px', fontSize: '14px', opacity: savingProfile ? 0.7 : 1 }} onClick={handleSaveProfile} disabled={savingProfile}>
                                        {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tên đăng nhập (Cố định)</label>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', padding: '0 20px', color: 'var(--text-muted)', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: 700 }}>
                                    {admin.ten_user}
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Họ và tên</label>
                                <input
                                    className="input-premium"
                                    style={{ borderColor: editMode ? 'var(--primary)' : 'var(--border-light)', opacity: editMode ? 1 : 0.6, fontSize: '15px', height: '52px', width: '100%' }}
                                    value={form.hovaten}
                                    onChange={e => setForm({ ...form, hovaten: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Số điện thoại</label>
                                <input
                                    className="input-premium"
                                    style={{ borderColor: editMode ? 'var(--primary)' : 'var(--border-light)', opacity: editMode ? 1 : 0.6, fontSize: '15px', height: '52px', width: '100%' }}
                                    value={form.SDT}
                                    onChange={e => setForm({ ...form, SDT: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="Nhập số điện thoại liên lạc"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Địa chỉ thường trú</label>
                                <input
                                    className="input-premium"
                                    style={{ borderColor: editMode ? 'var(--primary)' : 'var(--border-light)', opacity: editMode ? 1 : 0.6, fontSize: '15px', height: '52px', width: '100%' }}
                                    value={form.diachi}
                                    onChange={e => setForm({ ...form, diachi: e.target.value })}
                                    disabled={!editMode}
                                    placeholder="Nhập địa chỉ của bạn"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="premium-card glass-panel" style={{ padding: '40px', border: '1px solid var(--border-light)' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 950, color: 'white', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Bảo mật hệ thống</h3>
                        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', fontWeight: 600 }}>Thay đổi mật khẩu định kỳ để duy trì an toàn tuyệt đối cho tài khoản.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'flex-end' }}>
                            {[
                                { label: 'Mật khẩu hiện tại', key: 'old_password', ph: '••••••••' },
                                { label: 'Mật khẩu mới', key: 'new_password', ph: 'Tối thiểu 6 ký tự' },
                                { label: 'Xác nhận mật khẩu', key: 'confirm', ph: 'Nhập lại mật khẩu mới' },
                            ].map(({ label, key, ph }) => (
                                <div key={key}>
                                    <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="input-premium"
                                            style={{ height: '52px', paddingRight: '48px', fontSize: '15px', width: '100%' }}
                                            type={showPw ? 'text' : 'password'}
                                            placeholder={ph}
                                            value={(pwForm as any)[key]}
                                            onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                                        />
                                        <button
                                            onClick={() => setShowPw(!showPw)}
                                            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: '0.2s' }}
                                            className="eye-toggle"
                                        >
                                            {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                                <button className="btn-premium" style={{ height: '52px', padding: '0 48px', fontSize: '15px', opacity: savingPw ? 0.7 : 1 }} onClick={handleChangePassword} disabled={savingPw}>
                                    {savingPw ? 'Đang xác thực...' : 'Cập nhật mật khẩu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .info-item:hover { background: rgba(255,255,255,0.04) !important; transform: translateX(8px); border-color: var(--primary) !important; }
                .eye-toggle:hover { color: var(--primary) !important; }
                .avatar-upload-label:hover { transform: scale(1.1) rotate(5deg); background: white !important; color: var(--primary) !important; }
            `}</style>
        </div>
    );
}
