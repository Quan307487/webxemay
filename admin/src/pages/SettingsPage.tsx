import { useState, useEffect } from 'react';
import { settingsApi } from '../lib/api';
import { Save, Globe, Facebook, Youtube, Instagram, MessageCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, Spinner } from '../components/ui';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await settingsApi.get();
            setSettings(res.data);
        } catch (err) {
            toast.error('Không thể tải cài đặt');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsApi.update(settings);
            toast.success('Cập nhật cài đặt thành công!');
        } catch (err) {
            toast.error('Cập nhật thất bại');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}><Spinner /></div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <PageHeader
                title="Cấu hình Hệ thống"
                description="Quản lý thông tin chung, mạng xã hội và chân trang"
                action={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-premium btn-primary"
                        style={{ padding: '0 32px', height: '44px', borderRadius: '12px', gap: '8px' }}
                    >
                        {saving ? <Spinner size={18} color="white" /> : <Save size={18} />}
                        <span>Lưu thay đổi</span>
                    </button>
                }
            />

            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                {/* General Info */}
                <div className="premium-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Globe size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Thông tin cơ bản</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                        <div>
                            <label className="text-muted" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Tên Website</label>
                            <input
                                className="input-premium"
                                value={settings.site_name}
                                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Số điện thoại</label>
                            <input
                                className="input-premium"
                                value={settings.phone}
                                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Email liên hệ</label>
                            <input
                                className="input-premium"
                                value={settings.email}
                                onChange={e => setSettings({ ...settings, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Địa chỉ cửa hàng</label>
                            <input
                                className="input-premium"
                                value={settings.address}
                                onChange={e => setSettings({ ...settings, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="premium-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Info size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Mạng xã hội</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Facebook size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#1877F2' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '48px' }}
                                value={settings.facebook_url}
                                onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                                placeholder="Facebook URL"
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Youtube size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#FF0000' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '48px' }}
                                value={settings.youtube_url}
                                onChange={e => setSettings({ ...settings, youtube_url: e.target.value })}
                                placeholder="Youtube URL"
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Instagram size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#E1306C' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '48px' }}
                                value={settings.instagram_url}
                                onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                                placeholder="Instagram URL"
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <MessageCircle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0068ff' }} />
                            <input
                                className="input-premium"
                                style={{ paddingLeft: '48px' }}
                                value={settings.zalo_url}
                                onChange={e => setSettings({ ...settings, zalo_url: e.target.value })}
                                placeholder="Zalo URL"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer and Copy */}
                <div className="premium-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Info size={20} color="var(--primary)" />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Chân trang</h3>
                    </div>
                    <div>
                        <label className="text-muted" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Dòng chữ bản quyền (Footer)</label>
                        <textarea
                            className="input-premium"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                            value={settings.footer_text}
                            onChange={e => setSettings({ ...settings, footer_text: e.target.value })}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
