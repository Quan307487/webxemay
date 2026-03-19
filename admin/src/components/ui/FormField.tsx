import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/** Bao bọc label + input/select với style nhất quán */
export function FormField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {label}
            </label>
            {children}
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    children: ReactNode;
}

/** FormField với select + custom arrow icon */
export function SelectField({ label, value, onChange, children }: SelectFieldProps) {
    return (
        <FormField label={label}>
            <div style={{ position: 'relative' }}>
                <select
                    className="input-premium"
                    style={{ width: '100%', appearance: 'none', paddingRight: '36px' }}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                >
                    {children}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
        </FormField>
    );
}
