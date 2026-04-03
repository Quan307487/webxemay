'use client';
import { useAuthStore } from '@/lib/store';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccountStatusModal() {
    const { accountStatusError, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !accountStatusError) return null;

    const handleConfirm = () => {
        logout();
        window.location.href = '/auth/login';
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'white',
                borderRadius: '32px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    background: '#fee2e2',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                }}>
                    <ShieldAlert size={40} />
                </div>

                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#0f172a',
                    marginBottom: '16px',
                    fontFamily: 'Outfit, sans-serif'
                }}>
                    Thông báo quan trọng
                </h2>

                <p style={{
                    fontSize: '16px',
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                    fontWeight: 500
                }}>
                    {accountStatusError}
                </p>

                <button
                    onClick={handleConfirm}
                    style={{
                        width: '100%',
                        height: '56px',
                        background: '#0f172a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Xác nhận
                </button>
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
