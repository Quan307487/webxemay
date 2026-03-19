import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            gap: '24px',
        }}>
            <div>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    letterSpacing: '-1.5px',
                    marginBottom: '8px',
                    fontFamily: 'Outfit, sans-serif',
                }}>
                    {title}
                </h1>
                {description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
                        {description}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </header>
    );
}
