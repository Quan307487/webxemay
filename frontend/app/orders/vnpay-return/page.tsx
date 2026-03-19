'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function VNPayReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const params: any = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        ordersApi.api.get('/orders/vnpay-return', { params })
            .then(r => {
                setOrderId(r.data.orderId);
                if (r.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(r.data.message || 'Thanh toán không thành công');
                }
            })
            .catch(err => {
                setStatus('error');
                setMessage('Lỗi xác thực thanh toán');
            });
    }, [searchParams]);

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', minHeight: '60vh' }}>
            <div className="glass-card" style={{ padding: '48px 24px' }}>
                {status === 'loading' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <Loader2 size={64} className="animate-spin" style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Đang xác thực giao dịch...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Vui lòng không đóng trình duyệt</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                            <CheckCircle size={48} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>Thanh toán thành công!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Đơn hàng #{orderId} của bạn đã được thanh toán.</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <Link href={`/orders/${orderId}`}>
                                <button className="btn-primary" style={{ padding: '12px 24px' }}>Xem đơn hàng <ArrowRight size={16} /></button>
                            </Link>
                            <Link href="/">
                                <button className="btn-secondary" style={{ padding: '12px 24px' }}>Trở về trang chủ</button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                            <XCircle size={48} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>Thanh toán thất bại</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{message}</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <Link href="/cart">
                                <button className="btn-primary" style={{ padding: '12px 24px' }}>Thử lại</button>
                            </Link>
                            <Link href="/">
                                <button className="btn-secondary" style={{ padding: '12px 24px' }}>Trở về trang chủ</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function VNPayReturnPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <main style={{ paddingTop: '120px', textAlign: 'center' }}>
                    <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto' }} />
                </main>
            }>
                <VNPayReturnContent />
            </Suspense>
            <Footer />
        </>
    );
}
