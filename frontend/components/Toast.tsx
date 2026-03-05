'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastContext = createContext<{ add: (msg: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const add = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);

    const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
        success: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', icon: '✅' },
        error: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', icon: '❌' },
        info: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', icon: 'ℹ️' },
        warning: { bg: 'rgba(234,179,8,0.15)', border: '#eab308', icon: '⚠️' },
    };

    return (
        <ToastContext.Provider value={{ add }}>
            {children}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' }}>
                {toasts.map(t => (
                    <div key={t.id} className="toast-item" style={{
                        background: colors[t.type].bg,
                        border: `1px solid ${colors[t.type].border}`,
                        borderRadius: '12px', padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        animation: 'slideInRight 0.3s ease',
                        fontSize: '14px', fontWeight: 500,
                    }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{colors[t.type].icon}</span>
                        <span style={{ color: 'var(--text)', lineHeight: 1.4 }}>{t.message}</span>
                        <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>×</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be inside ToastProvider');
    return ctx;
}
