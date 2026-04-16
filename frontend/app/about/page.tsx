'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Award, Zap, Truck, HeadphonesIcon, Star, ArrowRight, MapPin, Users, Clock, Phone, Mail, CheckCircle, Wrench, CreditCard, Heart } from 'lucide-react';

const stats = [
    { value: '2025', label: 'Năm thành lập', icon: <Clock size={24} /> },
    { value: '200+', label: 'Mẫu xe chính hãng', icon: <Star size={24} /> },
    { value: '1', label: 'Showroom Đà Nẵng', icon: <MapPin size={24} /> },
    { value: '24/7', label: 'Hỗ trợ khách hàng', icon: <HeadphonesIcon size={24} /> },
];

const values = [
    {
        icon: <Shield size={28} />,
        color: '#10b981',
        title: 'Uy tín & Minh bạch',
        desc: 'Tất cả xe đều có đầy đủ giấy tờ xuất xứ, hóa đơn VAT và chứng nhận chính hãng. Mọi thông tin về xe được công khai rõ ràng, không che giấu bất kỳ điều gì với khách hàng.',
    },
    {
        icon: <Award size={28} />,
        color: '#f59e0b',
        title: 'Chất lượng đảm bảo',
        desc: 'Mỗi chiếc xe qua kiểm định nghiêm ngặt trước khi bàn giao. Cam kết đúng mẫu, đúng màu, đúng đời xe. Hỗ trợ đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất.',
    },
    {
        icon: <Zap size={28} />,
        color: '#3b82f6',
        title: 'Giao xe nhanh chóng',
        desc: 'Nhận xe và hoàn tất thủ tục đăng ký biển số ngay tại cửa hàng. Hỗ trợ giao xe tận nhà trong nội thành Đà Nẵng. Tư vấn trả góp lãi suất ưu đãi từ các ngân hàng liên kết.',
    },
    {
        icon: <Wrench size={28} />,
        color: '#8b5cf6',
        title: 'Bảo hành & Bảo dưỡng',
        desc: 'Bảo hành chính hãng theo quy định của nhà sản xuất. Đội ngũ kỹ thuật viên lành nghề hỗ trợ bảo dưỡng định kỳ, sửa chữa nhanh chóng ngay tại cửa hàng.',
    },
    {
        icon: <CreditCard size={28} />,
        color: '#f43f5e',
        title: 'Hỗ trợ tài chính',
        desc: 'Tư vấn các gói trả góp linh hoạt với lãi suất ưu đãi từ nhiều ngân hàng và công ty tài chính. Trả góp từ 12 đến 36 tháng, duyệt hồ sơ nhanh trong ngày.',
    },
    {
        icon: <Heart size={28} />,
        color: '#ec4899',
        title: 'Chăm sóc hậu mãi',
        desc: 'Không kết thúc khi bạn mua xe — MotoShop đồng hành lâu dài. Thông báo lịch bảo dưỡng định kỳ, ưu đãi phụ tùng chính hãng và hỗ trợ thủ tục pháp lý cho xe.',
    },
];

const services = [
    { icon: <CheckCircle size={20} />, text: 'Mua xe máy mới chính hãng' },
    { icon: <CheckCircle size={20} />, text: 'Tư vấn chọn xe theo nhu cầu' },
    { icon: <CheckCircle size={20} />, text: 'Làm thủ tục đăng ký biển số' },
    { icon: <CheckCircle size={20} />, text: 'Hỗ trợ vay trả góp ngân hàng' },
    { icon: <CheckCircle size={20} />, text: 'Giao xe tận nhà nội thành Đà Nẵng' },
    { icon: <CheckCircle size={20} />, text: 'Bảo dưỡng & sửa chữa xe' },
    { icon: <CheckCircle size={20} />, text: 'Phụ tùng & phụ kiện chính hãng' },
    { icon: <CheckCircle size={20} />, text: 'Đổi trả trong 7 ngày nếu lỗi NSX' },
];

const brands = [
    { name: 'Honda', desc: 'Đại lý ủy quyền' },
    { name: 'Yamaha', desc: 'Phân phối chính thức' },
    { name: 'Suzuki', desc: 'Đại lý cấp 1' },
    { name: 'VinFast', desc: 'Xe điện chính hãng' },
    { name: 'Piaggio', desc: 'Vespa & Liberty' },
    { name: 'SYM', desc: 'Xe phổ thông' },
];

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '80px' }}>

                {/* HERO */}
                <section style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    padding: '120px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>
                            <Star size={14} fill="currentColor" /> Về Chúng Tôi
                        </div>
                        <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white', letterSpacing: '-3px', lineHeight: 0.95, marginBottom: '32px' }}>
                            Câu chuyện của<br />
                            <span style={{ background: 'linear-gradient(135deg, #f43f5e, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MotoShop</span>
                        </h1>
                        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto 16px' }}>
                            Cửa hàng xe máy chính hãng tại Đà Nẵng — nơi đam mê gặp gỡ chất lượng.
                        </p>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 48px' }}>
                            Thôn An Hòa, Xã Tây Hồ, TP.Đà Nẵng &nbsp;|&nbsp; 0339 886 769
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/products">
                                <button style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none', padding: '18px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(244,63,94,0.3)', transition: 'all 0.3s' }}>
                                    Khám phá xe ngay <ArrowRight size={20} />
                                </button>
                            </Link>
                            <a href="tel:0339886769">
                                <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1.5px solid rgba(255,255,255,0.15)', padding: '18px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(8px)', transition: 'all 0.3s' }}>
                                    <Phone size={18} /> Gọi ngay
                                </button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* STATS */}
                <section style={{ background: 'white', padding: '80px 32px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '48px 32px', borderRadius: '28px', background: '#f8fafc', border: '1.5px solid rgba(0,0,0,0.06)', transition: 'all 0.3s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(59,130,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#f43f5e' }}>
                                    {stat.icon}
                                </div>
                                <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>{stat.value}</div>
                                <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 600, marginTop: '12px' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STORY */}
                <section style={{ padding: '100px 32px', background: '#f8fafc' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '32px' }}>
                                Câu chuyện của chúng tôi
                            </div>
                            <h2 style={{ fontSize: '44px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '24px' }}>
                                Sinh ra tại Đà Nẵng,<br />
                                <span style={{ color: '#f43f5e' }}>vì người Đà Nẵng</span>
                            </h2>
                            <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                                MotoShop được thành lập năm 2025 với tâm huyết xây dựng một cửa hàng xe máy <strong>trung thực, minh bạch và tận tâm</strong> ngay tại mảnh đất thành phố đáng sống nhất Việt Nam — Đà Nẵng.
                            </p>
                            <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.8, marginBottom: '20px' }}>
                                Chúng tôi chọn đặt cửa hàng tại <strong>Thôn An Hòa, Xã Tây Hồ</strong> — vùng đang phát triển mạnh của Đà Nẵng — để phục vụ người dân địa phương với một không gian showroom rộng rãi, thoáng mát và hiện đại.
                            </p>
                            <p style={{ fontSize: '17px', color: '#475569', lineHeight: 1.8 }}>
                                Dù mới thành lập, chúng tôi mang theo kinh nghiệm và đam mê xe gắn máy nhiều năm, cam kết mang đến cho từng khách hàng <strong>trải nghiệm mua xe tốt nhất</strong> — từ lúc tư vấn đến khi bàn giao xe và hỗ trợ lâu dài sau đó.
                            </p>
                            <div style={{ marginTop: '32px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', background: 'rgba(244,63,94,0.06)', borderRadius: '14px', border: '1px solid rgba(244,63,94,0.15)' }}>
                                    <MapPin size={18} color="#f43f5e" />
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Thôn An Hòa, Xã Tây Hồ, TP.Đà Nẵng</span>
                                </div>
                                <a href="tel:0339886769" style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', background: 'rgba(16,185,129,0.06)', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.15)', cursor: 'pointer' }}>
                                        <Phone size={18} color="#10b981" />
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>0339 886 769</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '32px', padding: '48px', color: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}>
                                <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '28px', fontFamily: 'Outfit, sans-serif' }}>🛵 Dịch vụ của chúng tôi</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    {services.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ color: '#10b981', flexShrink: 0 }}>{s.icon}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#cbd5e1', lineHeight: 1.4 }}>{s.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Giờ mở cửa</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#94a3b8' }}>Thứ 2 — Thứ 7</span>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>7:30 — 17:30</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: '#94a3b8' }}>Chủ Nhật</span>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#f43f5e' }}>8:00 — 12:00</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', borderRadius: '20px', padding: '20px 28px', boxShadow: '0 20px 40px rgba(244,63,94,0.3)', zIndex: 2 }}>
                                <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white', lineHeight: 1 }}>2025</div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>Năm thành lập</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BRANDS */}
                <section style={{ padding: '80px 32px', background: 'white' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                Thương hiệu đối tác
                            </div>
                            <h2 style={{ fontSize: '40px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-2px', marginBottom: '16px' }}>Phân phối chính hãng</h2>
                            <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                                MotoShop là đại lý và điểm phân phối ủy quyền của các thương hiệu xe máy hàng đầu thế giới và Việt Nam.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                            {brands.map((b, i) => (
                                <div key={i} style={{ padding: '32px 24px', borderRadius: '20px', border: '1.5px solid rgba(0,0,0,0.06)', background: '#f8fafc', textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f43f5e'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(244,63,94,0.08)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                                    <div style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', marginBottom: '8px' }}>{b.name}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f43f5e' }}>{b.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* VALUES */}
                <section style={{ padding: '100px 32px', background: '#f8fafc' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                Giá trị cốt lõi
                            </div>
                            <h2 style={{ fontSize: '44px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-2px', marginBottom: '16px' }}>Điều gì làm chúng tôi khác biệt?</h2>
                            <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                                Mỗi quyết định chúng tôi đưa ra đều xoay quanh một mục tiêu duy nhất: <strong>khách hàng hài lòng</strong>.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                            {values.map((v, i) => (
                                <div key={i} style={{ padding: '40px 32px', borderRadius: '28px', border: '1.5px solid rgba(0,0,0,0.06)', background: 'white', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.borderColor = v.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.06)`; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${v.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, marginBottom: '24px' }}>
                                        {v.icon}
                                    </div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>{v.title}</h3>
                                    <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT INFO */}
                <section style={{ padding: '100px 32px', background: '#0f172a' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', borderRadius: '20px', padding: '8px 20px', fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                Tìm chúng tôi
                            </div>
                            <h2 style={{ fontSize: '44px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white', letterSpacing: '-2px', marginBottom: '16px' }}>Ghé thăm showroom</h2>
                            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                                Đến trực tiếp để trải nghiệm lái thử, ngắm xe thực tế và nhận tư vấn miễn phí từ đội ngũ của chúng tôi.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                            {[
                                { icon: <MapPin size={24} />, color: '#f87171', title: 'Địa chỉ showroom', lines: ['Thôn An Hòa, Xã Tây Hồ', 'Thành phố Đà Nẵng'] },
                                { icon: <Phone size={24} />, color: '#4ade80', title: 'Hotline hỗ trợ', lines: ['0339 886 769', 'Gọi miễn phí 7:30–17:30'] },
                                { icon: <Mail size={24} />, color: '#60a5fa', title: 'Email liên hệ', lines: ['buiminhquan12082003', '@gmail.com'] },
                                { icon: <Clock size={24} />, color: '#facc15', title: 'Giờ mở cửa', lines: ['T2 – T7: 7:30 – 17:30', 'CN: 8:00 – 12:00'] },
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '32px', borderRadius: '24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: '20px' }}>
                                        {item.icon}
                                    </div>
                                    <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{item.title}</h3>
                                    {item.lines.map((line, j) => (
                                        <p key={j} style={{ fontSize: j === 0 ? '17px' : '14px', fontWeight: j === 0 ? 700 : 500, color: j === 0 ? 'white' : 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{line}</p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Map Embed Placeholder */}
                        <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: '32px', textAlign: 'center' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.098!2d108.12!3d16.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sThôn+An+Hòa%2C+Xã+Tây+Hồ%2C+Đà+Nẵng!5e0!3m2!1svi!2svn!4v1"
                                width="100%"
                                height="300"
                                style={{ border: 'none', borderRadius: '16px', minHeight: '300px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ MotoShop Đà Nẵng"
                            />
                            <p style={{ marginTop: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                                📍 Thôn An Hòa, Xã Tây Hồ, TP.Đà Nẵng — Bấm vào bản đồ để chỉ đường
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ padding: '100px 32px', background: 'white', textAlign: 'center' }}>
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '44px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#0f172a', letterSpacing: '-2px', marginBottom: '20px' }}>
                            Sẵn sàng sở hữu xe mơ ước?
                        </h2>
                        <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, marginBottom: '48px' }}>
                            Hơn 200+ mẫu xe chính hãng đang chờ bạn tại showroom MotoShop Đà Nẵng. Tư vấn miễn phí, không ép mua, không phụ phí ẩn.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/products">
                                <button style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', border: 'none', padding: '18px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 15px 30px rgba(244,63,94,0.25)', transition: 'all 0.3s' }}>
                                    Xem xe ngay <ArrowRight size={18} />
                                </button>
                            </Link>
                            <a href="tel:0339886769" style={{ textDecoration: 'none' }}>
                                <button style={{ background: 'white', color: '#0f172a', border: '1.5px solid rgba(0,0,0,0.12)', padding: '18px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                                    <Phone size={18} /> 0339 886 769
                                </button>
                            </a>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
