import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    width?: string;
    side?: boolean; // Slide-in from right
}

export default function Modal({ open, onClose, title, subtitle, icon, children, footer, width = '700px', side = false }: ModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: side ? 'stretch' : 'center',
                justifyContent: side ? 'flex-end' : 'center',
                padding: side ? 0 : '24px',
                animation: 'fadeIn 0.2s ease'
            }}
        >
            <div style={{
                width: side ? width : '100%',
                maxWidth: side ? width : width,
                height: side ? '100vh' : 'auto',
                maxHeight: side ? '100vh' : '90vh',
                background: 'var(--bg-main)',
                borderLeft: side ? '1px solid var(--border-subtle)' : 'none',
                borderRadius: side ? 0 : '24px',
                boxShadow: side ? '-20px 0 60px rgba(0,0,0,0.1)' : '0 40px 80px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: side ? 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)' : 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px 28px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {icon && (
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: 'var(--primary)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 6px 16px rgba(var(--primary-rgb),0.2)'
                            }}>
                                {icon}
                            </div>
                        )}
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
                            {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 600 }}>{subtitle}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)',
                        cursor: 'pointer', color: 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-deep)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '16px 28px', borderTop: '1px solid var(--border-subtle)',
                        background: 'var(--bg-main)', flexShrink: 0,
                        display: 'flex', justifyContent: 'flex-end', gap: '12px',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
