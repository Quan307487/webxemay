'use client';
import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { User, Lock, Package, Save, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, setAuth, token, _hasHydrated } = useAuthStore() as any;
    const router = useRouter();
    const { add: toast } = useToast();
    const [tab, setTab] = useState<'info' | 'password'>('info');
    const [form, setForm] = useState({ hovaten: '', email: '', sdt: '', diachi: '' });
    const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
    const [showPw, setShowPw] = useState({ cur: false, new: false, con: false });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user) { router.push('/auth/login'); return; }
        setForm({
            hovaten: user.hovaten || '',
            email: user.email || '',
            sdt: user.SDT || user.sdt || '',
            diachi: user.diachi || ''
        });
    }, [_hasHydrated, user]);

    const saveInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const r = await usersApi.updateMe({
                hovaten: form.hovaten,
                SDT: form.sdt,
                diachi: form.diachi
            });
            setAuth(token, r.data);
            toast('Cập nhật thông tin thành công!');
        } catch (e: any) { toast(e.response?.data?.message || 'Lỗi cập nhật', 'error'); }
        finally { setSaving(false); }
    };

    const savePw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.new_password !== pwForm.confirm) { toast('Mật khẩu xác nhận không khớp', 'error'); return; }
        if (pwForm.new_password.length < 6) { toast('Mật khẩu mới tối thiểu 6 ký tự', 'warning'); return; }
        setSaving(true);
        try {
            await usersApi.changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password });
            toast('Đổi mật khẩu thành công!');
            setPwForm({ current_password: '', new_password: '', confirm: '' });
        } catch (e: any) { toast(e.response?.data?.message || 'Lỗi đổi mật khẩu', 'error'); }
        finally { setSaving(false); }
    };

    if (!user) return null;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px', maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px', minHeight: '70vh' }}>
                {/* Profile header */}
                <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                        {(user.hovaten || user.ten_user || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>{user.hovaten || user.ten_user}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{user.email}</p>
                        <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                            {user.quyen === 'admin' ? '👑 Admin' : '👤 Thành viên'}
                        </span>
                    </div>
                    <Link href="/orders" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px' }}>
                            <Package size={16} /> Đơn hàng
                        </button>
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                    {([['info', <User size={15} key="u" />, 'Thông tin'], ['password', <Lock size={15} key="l" />, 'Mật khẩu']] as const).map(([key, icon, label]) => (
                        <button key={key} className={`tab-btn ${tab === key ? 'active' : ''}`} onClick={() => setTab(key as any)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {icon}{label}
                        </button>
                    ))}
                </div>

                {tab === 'info' && (
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Thông tin cá nhân</h2>
                        <form onSubmit={saveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Họ và tên</label>
                                <input className="input-field" value={form.hovaten} onChange={e => setForm({ ...form, hovaten: e.target.value })} placeholder="Nhập họ và tên..." />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
                                <input className="input-field" value={form.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Email không thể thay đổi</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Số điện thoại</label>
                                <input className="input-field" value={form.sdt} onChange={e => setForm({ ...form, sdt: e.target.value })} placeholder="0912 xxx xxx" type="tel" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Địa chỉ</label>
                                <textarea
                                    className="input-field"
                                    value={form.diachi}
                                    onChange={e => setForm({ ...form, diachi: e.target.value })}
                                    placeholder="Nhập địa chỉ của bạn..."
                                    style={{ height: '80px', padding: '12px', resize: 'none' }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }} disabled={saving}>
                                <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </form>
                    </div>
                )}

                {tab === 'password' && (
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Đổi mật khẩu</h2>
                        <form onSubmit={savePw} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {([['current_password', 'cur', 'Mật khẩu hiện tại'], ['new_password', 'new', 'Mật khẩu mới'], ['confirm', 'con', 'Xác nhận mật khẩu mới']] as const).map(([key, showKey, label]) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="input-field" type={showPw[showKey] ? 'text' : 'password'} required minLength={6}
                                            value={(pwForm as any)[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                                            placeholder="••••••••" style={{ paddingRight: '44px' }} />
                                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [showKey]: !p[showKey] }))}
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            {showPw[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }} disabled={saving}>
                                <Lock size={16} /> {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
                            </button>
                        </form>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
