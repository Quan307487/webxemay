import type { ReactNode } from 'react';

interface EmptyStateProps {
    message?: string;
    icon?: ReactNode;
    colSpan?: boolean;
}

export default function EmptyState({ message = 'Chưa có dữ liệu nào.', icon, colSpan = true }: EmptyStateProps) {
    return (
        <div className="premium-card glass-panel" style={{
            ...(colSpan ? { gridColumn: '1/-1' } : {}),
            padding: '80px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
        }}>
            {icon && <div style={{ opacity: 0.3, marginBottom: '4px' }}>{icon}</div>}
            <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontStyle: 'italic', fontSize: '16px', margin: 0 }}>
                {message}
            </p>
        </div>
    );
}
