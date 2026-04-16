'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2, ArrowRight, Home, ShoppingBag, RefreshCw, Phone } from 'lucide-react';
import Link from 'next/link';

function VNPayReturnContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderCode, setOrderCode] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [bankCode, setBankCode] = useState<string | null>(null);
    const [transNo, setTransNo] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const query = searchParams.toString();
        const verifyUrl = `/api/verify-vnpay?${query}`;

        // Lấy thêm thông tin từ URL params
        const rawAmount = searchParams.get('vnp_Amount');
        const rawBank = searchParams.get('vnp_BankCode');
        const rawTransNo = searchParams.get('vnp_BankTranNo');
        const rawOrderInfo = searchParams.get('vnp_OrderInfo');

        if (rawAmount) setAmount(Number(rawAmount) / 100);
        if (rawBank) setBankCode(rawBank);
        if (rawTransNo) setTransNo(rawTransNo);

        fetch(verifyUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        })
            .then(async res => {
                const data = await res.json();
                setOrderId(data.orderId);
                if (data.orderCode) setOrderCode(data.orderCode);
                if (data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Thanh toán không thành công');
                }
            })
            .catch(err => {
                setStatus('error');
                setMessage('Lỗi xác thực thanh toán: ' + err.message);
            });
    }, [searchParams]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
                
                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeUp {
                    from { transform: translateY(24px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
                    70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .success-icon { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, pulse-ring 2s ease-out 0.5s infinite; }
                .error-icon { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .fade-up-1 { animation: fadeUp 0.6s ease forwards 0.1s; opacity: 0; }
                .fade-up-2 { animation: fadeUp 0.6s ease forwards 0.2s; opacity: 0; }
                .fade-up-3 { animation: fadeUp 0.6s ease forwards 0.3s; opacity: 0; }
                .fade-up-4 { animation: fadeUp 0.6s ease forwards 0.4s; opacity: 0; }
                .fade-up-5 { animation: fadeUp 0.6s ease forwards 0.55s; opacity: 0; }
                .info-row:hover { background: rgba(0,0,0,0.04) !important; }
            `}</style>
            <main style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh', background: '#f8fafc' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px' }}>

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                            <Loader2 size={56} style={{ color: 'var(--primary)', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
                            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Đang xác thực giao dịch...</h2>
                            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Vui lòng không đóng hoặc tải lại trình duyệt</p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {/* Header Banner */}
                            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                {/* Decorative circles */}
                                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                                <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                                <div className="success-icon" style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
                                    <CheckCircle size={52} color="white" strokeWidth={2.5} />
                                </div>

                                <h1 className="fade-up-1" style={{ fontSize: '32px', fontWeight: 950, color: '#fff', marginBottom: '8px', fontFamily: 'Outfit, sans-serif', position: 'relative', zIndex: 1 }}>
                                    Thanh toán thành công!
                                </h1>
                                <p className="fade-up-2" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
                                    Giao dịch của bạn đã được xác nhận
                                </p>

                                {amount && (
                                    <div className="fade-up-3" style={{ marginTop: '20px', display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '12px 28px', position: 'relative', zIndex: 1 }}>
                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Số tiền</p>
                                        <p style={{ fontSize: '28px', fontWeight: 950, color: '#fff', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                                            {amount.toLocaleString('vi-VN')} ₫
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Order Details */}
                            <div className="fade-up-4" style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Chi tiết giao dịch</h3>

                                <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                                    {[
                                        { label: 'Mã đơn hàng', value: `#${orderCode || orderId}`, highlight: true },
                                        { label: 'Ngân hàng', value: bankCode || '—' },
                                        { label: 'Mã giao dịch', value: transNo || '—' },
                                        { label: 'Trạng thái', value: '✅ Đã thanh toán', color: '#10b981' },
                                    ].map((row, idx) => (
                                        <div key={idx} className="info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: idx < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none', transition: 'background 0.2s' }}>
                                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>{row.label}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 800, color: row.color || (row.highlight ? 'var(--primary)' : '#1e293b'), fontFamily: row.highlight ? 'Outfit, sans-serif' : 'inherit' }}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Note */}
                                <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(16, 185, 129, 0.06)', borderRadius: '14px', border: '1.5px solid rgba(16, 185, 129, 0.15)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '20px' }}>📦</span>
                                    <p style={{ fontSize: '13px', color: '#065f46', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                                        Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất có thể!
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="fade-up-5" style={{ padding: '0 32px 32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Link href={`/orders/${orderId}`} style={{ flex: 1, minWidth: '160px' }}>
                                    <button style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                                    >
                                        <ShoppingBag size={18} /> Xem đơn hàng
                                    </button>
                                </Link>
                                <Link href="/" style={{ flex: 1, minWidth: '160px' }}>
                                    <button style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#f1f5f9', color: '#374151', border: '1.5px solid rgba(0,0,0,0.08)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >
                                        <Home size={18} /> Trang chủ
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            {/* Error Header */}
                            <div style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                                <div className="error-icon" style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
                                    <XCircle size={52} color="white" strokeWidth={2.5} />
                                </div>
                                <h1 style={{ fontSize: '32px', fontWeight: 950, color: '#fff', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Thanh toán thất bại</h1>
                                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: 600 }}>Giao dịch không được xác nhận</p>
                            </div>

                            {/* Error Details */}
                            <div style={{ padding: '32px' }}>
                                <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '14px', border: '1.5px solid rgba(239, 68, 68, 0.15)', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>⚠️</span>
                                    <p style={{ fontSize: '14px', color: '#7f1d1d', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>{message || 'Đã có lỗi xảy ra trong quá trình thanh toán. Số tiền chưa bị trừ.'}</p>
                                </div>

                                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Bạn có thể</h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['Kiểm tra lại thông tin thẻ / tài khoản ngân hàng', 'Đảm bảo tài khoản có đủ số dư', 'Thử lại với phương thức thanh toán khác'].map((tip, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151', fontWeight: 600 }}>
                                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>

                                {/* Contact */}
                                <div style={{ marginTop: '24px', padding: '16px 20px', background: '#f8fafc', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Phone size={18} color="#64748b" />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, margin: '0 0 2px' }}>Cần hỗ trợ?</p>
                                        <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: 800, margin: 0 }}>Hotline: 0339886769</p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Actions */}
                            <div style={{ padding: '0 32px 32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <Link href="/cart" style={{ flex: 1, minWidth: '160px' }}>
                                    <button style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                                    >
                                        <RefreshCw size={18} /> Thử lại
                                    </button>
                                </Link>
                                <Link href="/" style={{ flex: 1, minWidth: '160px' }}>
                                    <button style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#f1f5f9', color: '#374151', border: '1.5px solid rgba(0,0,0,0.08)', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >
                                        <Home size={18} /> Trang chủ
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default function VNPayReturnPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <main style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh', background: '#f8fafc' }}>
                    <Loader2 size={48} style={{ margin: '80px auto', color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                </main>
            }>
                <VNPayReturnContent />
            </Suspense>
            <Footer />
        </>
    );
}
