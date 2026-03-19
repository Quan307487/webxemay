interface StatusBadgeProps {
    active: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
    onClick?: () => void;
}

export default function StatusBadge({ active, activeLabel = 'ACTIVE', inactiveLabel = 'INACTIVE', onClick }: StatusBadgeProps) {
    return (
        <button
            onClick={onClick}
            className="status-pill"
            style={{
                background: active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: active ? '#10b981' : '#ef4444',
                border: `1px solid ${active ? '#10b981' : '#ef4444'}25`,
                padding: '8px 16px',
                cursor: onClick ? 'pointer' : 'default',
            }}
            disabled={!onClick}
        >
            <div className="status-glow" />
            {active ? activeLabel : inactiveLabel}
        </button>
    );
}
