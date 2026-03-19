interface SpinnerProps {
    size?: number;
    color?: string;
}

export default function Spinner({ size = 40, color = 'var(--primary)' }: SpinnerProps) {
    return (
        <div style={{
            display: 'inline-block',
            width: `${size}px`,
            height: `${size}px`,
            border: `${size <= 20 ? 3 : 4}px solid rgba(244,63,94,0.1)`,
            borderTopColor: color,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
        }} />
    );
}

export function SpinnerPage() {
    return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Spinner />
        </div>
    );
}
