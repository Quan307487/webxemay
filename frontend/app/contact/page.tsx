'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/Toast';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, HeadphonesIcon, ArrowRight } from 'lucide-react';

const contacts = [
    {
        icon: <Phone size={24} />,
        color: '#10b981',
        title: 'Hotline hỗ trợ',
        primary: '0339 886 769',
        secondary: 'Gọi miễn phí • 7:30 – 17:30 hàng ngày'
    },
    {
        icon: <Mail size={24} />,
        color: '#3b82f6',
        title: 'Email liên hệ',
        primary: 'buiminhquan12082003@gmail.com',
        secondary: 'Phản hồi trong vòng 24 giờ làm việc'
    },
    {
        icon: <MapPin size={24} />,
        color: '#f43f5e',
        title: 'Showroom',
        primary: 'Thôn An Hòa, Xã Tây Hồ',
        secondary: 'TP.Đà Nẵng'
    },
    {
        icon: <Clock size={24} />,
        color: '#f59e0b',
        title: 'Giờ hoạt động',
        primary: 'T2–T7: 7:30 – 17:30',
        secondary: 'Chủ nhật: 8:00 – 12:00'
    },
];

const faqs = [
    { q: 'Làm thế nào để đặt mua xe trên MotoShop?', a: 'Bạn chọn xe ưa thích, thêm vào giỏ hàng và tiến hành thanh toán. Chúng tôi hỗ trợ COD, chuyển khoản và thanh toán qua VNPay.' },
    { q: 'MotoShop có hỗ trợ giao xe tận nhà không?', a: 'Có! Chúng tôi hỗ trợ giao xe tận nhà trong nội thành Đà Nẵng. Khách ở xa tỉnh có thể đến showroom nhận trực tiếp tại Thôn An Hòa, Xã Tây Hồ, TP.Đà Nẵng.' },
    { q: 'MotoShop có hỗ trợ trả góp không?', a: 'Có! Chúng tôi tư vấn và hỗ trợ làm hồ sơ vay trả góp với nhiều ngân hàng và công ty tài chính, lãi suất ưu đãi, duyệt nhanh trong ngày.' },
    { q: 'Chính sách bảo hành xe như thế nào?', a: 'Tất cả xe đều được bảo hành chính hãng theo quy định nhà sản xuất. Đội kỹ thuật của chúng tôi hỗ trợ bảo dưỡng và sửa chữa nhanh chóng ngay tại showroom.' },
    { q: 'Tôi có thể đổi trả xe không?', a: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận xe nếu xe có lỗi do nhà sản xuất hoặc không đúng với mô tả. Vui lòng liên hệ hotline 0339 886 769 để được hỗ trợ.' },
    { q: 'Showroom MotoShop ở đâu tại Đà Nẵng?', a: 'Showroom của chúng tôi đặt tại Thôn An Hòa, Xã Tây Hồ, TP.Đà Nẵng. Mở cửa từ Thứ 2 đến Thứ 7 (7:30–17:30) và Chủ nhật (8:00–12:00). Gọi 0339 886 769 để được chỉ đường.' },
];

export default function ContactPage() {
    const { add: toast } = useToast();
    const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.message) {
            toast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }
        setLoading(true);
        // Giả lập gửi
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setForm({ name: '', phone: '', email: '', subject: '', message: '' });
        toast('Gửi thành công! Chúng tôi sẽ liên hệ lại trong vòng 2 giờ.', 'success');
    };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px' }}>

                {/* HERO */}
                <section style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                    padding: '100px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '28px' }}>
                            <MessageCircle size={14} /> Liên hệ
                        </div>
                        <h1 style={{ fontSize: 'clamp(40px, 5vw, 74px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white', letterSpacing: '-2.5px', lineHeight: 0.95, marginBottom: '24px' }}>
                            Chúng tôi luôn<br />
                            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>lắng nghe bạn</span>
                        </h1>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
                            Có câu hỏi về xe hay cần tư vấn? Đội ngũ chuyên gia của MotoShop luôn sẵn sàng hỗ trợ bạn 24/7.
                        </p>
                    </div>
                </section>

                {/* CONTACT CARDS */}
                <section style={{ background: 'white', padding: '80px 32px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        {contacts.map((c, i) => (
                            <div key={i} style={{ padding: '36px 28px', borderRadius: '24px', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.06)', transition: 'all 0.3s', cursor: 'default' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = c.color; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: '20px' }}>
                                    {c.icon}
                                </div>
                                <p style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{c.title}</p>
                                <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{c.primary}</p>
                                <p style={{ fontSize: '13px', color: '#64748b' }}>{c.secondary}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FORM + MAP */}
                <section style={{ padding: '80px 32px', background: '#f8fafc' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)', gap: '48px', alignItems: 'start' }}>

                        {/* FORM */}
                        <div style={{ background: 'white', borderRadius: '28px', padding: '48px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ marginBottom: '36px' }}>
                                <h2 style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-1px', marginBottom: '10px' }}>
                                    Gửi tin nhắn cho chúng tôi
                                </h2>
                                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
                                    Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong vòng 2 giờ làm việc.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                            Họ và tên <span style={{ color: '#f43f5e' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                            onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                            Số điện thoại <span style={{ color: '#f43f5e' }}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="0339 886 769"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                            onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                        Chủ đề
                                    </label>
                                    <select
                                        value={form.subject}
                                        onChange={e => setForm({ ...form, subject: e.target.value })}
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', background: 'white', cursor: 'pointer', boxSizing: 'border-box' }}>
                                        <option value="">Chọn chủ đề...</option>
                                        <option value="tuvanhang">Tư vấn mua hàng</option>
                                        <option value="baohank">Bảo hành & sữa chữa</option>
                                        <option value="tragop">Hỗ trợ trả góp</option>
                                        <option value="donhang">Theo dõi đơn hàng</option>
                                        <option value="khac">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                        Nội dung tin nhắn <span style={{ color: '#f43f5e' }}>*</span>
                                    </label>
                                    <textarea
                                        placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        rows={5}
                                        style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '14px', fontSize: '15px', fontFamily: 'inherit', outline: 'none', resize: 'vertical', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ padding: '18px 40px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 10px 25px rgba(244,63,94,0.25)', transition: 'all 0.3s' }}>
                                    {loading ? (
                                        <>
                                            <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Gửi tin nhắn
                                        </>
                                    )}
                                </button>
                            </form>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>

                        {/* RIGHT: Quick contacts + social */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Quick action */}
                            <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Liên hệ nhanh</h3>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Không muốn điền form? Liên hệ trực tiếp qua các kênh dưới đây.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="tel:0339886769" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#f0fdf4', borderRadius: '16px', textDecoration: 'none', border: '1px solid rgba(16,185,129,0.2)', transition: 'all 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#dcfce7'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f0fdf4'}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', margin: 0 }}>Gọi ngay</p>
                                            <p style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>0339 886 769</p>
                                        </div>
                                        <ArrowRight size={18} style={{ marginLeft: 'auto', color: '#10b981' }} />
                                    </a>
                                    <a href="mailto:buiminhquan12082003@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#eff6ff', borderRadius: '16px', textDecoration: 'none', border: '1px solid rgba(59,130,246,0.2)', transition: 'all 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#dbeafe'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#eff6ff'}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6', margin: 0 }}>Email cho chúng tôi</p>
                                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>buiminhquan12082003@gmail.com</p>
                                        </div>
                                        <ArrowRight size={18} style={{ marginLeft: 'auto', color: '#3b82f6' }} />
                                    </a>
                                </div>
                            </div>

                            {/* Support hours */}
                            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: '24px', padding: '36px', color: 'white' }}>
                                <HeadphonesIcon size={28} style={{ color: '#60a5fa', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                                    Hỗ trợ 24/7
                                </h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '24px' }}>
                                    Đội ngũ hỗ trợ của chúng tôi luôn trực tuyến để giải đáp mọi thắc mắc của bạn.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Tư vấn mua xe miễn phí', 'Hỗ trợ tra cứu đơn hàng', 'Giải đáp chính sách bảo hành'].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section style={{ padding: '80px 32px', background: 'white' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                Câu hỏi thường gặp
                            </div>
                            <h2 style={{ fontSize: '40px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-1.5px' }}>
                                FAQ
                            </h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {faqs.map((faq, i) => (
                                <div key={i} style={{ border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '18px', overflow: 'hidden', transition: 'all 0.3s' }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{ width: '100%', padding: '20px 24px', background: openFaq === i ? '#f8fafc' : 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', textAlign: 'left', fontFamily: 'inherit' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{faq.q}</span>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: openFaq === i ? '#f43f5e' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                                            <span style={{ fontSize: '18px', lineHeight: 1, color: openFaq === i ? 'white' : '#64748b', transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'block', transition: 'transform 0.3s' }}>+</span>
                                        </div>
                                    </button>
                                    {openFaq === i && (
                                        <div style={{ padding: '0 24px 20px', background: '#f8fafc' }}>
                                            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
