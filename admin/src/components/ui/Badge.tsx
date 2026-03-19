/** Hiển thị badge trạng thái nhỏ gọn với màu sắc và dot indicator. */
export default function Badge({ label, color }: { label: string; color: string }) {
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '50px',
            background: `${color}18`, border: `1px solid ${color}30`,
            fontSize: '12px', fontWeight: 800, color,
        }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
            {label}
        </div>
    );
}
