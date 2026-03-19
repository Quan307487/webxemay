import { Pencil, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    size?: number;
}

export default function ActionButtons({ onEdit, onDelete, size = 18 }: ActionButtonsProps) {
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="action-icon-btn"
                    title="Chỉnh sửa"
                    style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: 'var(--bg-deep)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border-light)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: '0.2s',
                    }}
                >
                    <Pencil size={size} />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="action-icon-btn danger"
                    title="Xóa"
                    style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        background: 'rgba(230,57,70,0.05)', color: '#ef4444',
                        border: '1px solid rgba(230,57,70,0.1)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: '0.2s',
                    }}
                >
                    <Trash2 size={size} />
                </button>
            )}
        </div>
    );
}
