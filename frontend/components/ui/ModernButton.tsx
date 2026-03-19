'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    children?: React.ReactNode;
}

const ModernButton: React.FC<ModernButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-[#ff4b2b] to-[#e60000] text-white shadow-[0_4px_15px_rgba(230,0,0,0.4)] hover:shadow-[0_8px_20px_rgba(230,0,0,0.6)]',
        secondary: 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white',
        ghost: 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white',
        outline: 'bg-transparent border-2 border-[#e60000] text-[#e60000] hover:bg-[#e60000] hover:text-white',
    };

    const sizes = {
        sm: 'px-4 py-2.5 text-xs rounded-lg',
        md: 'px-8 py-4 text-sm rounded-xl',
        lg: 'px-10 py-5 text-base rounded-2xl',
        xl: 'px-12 py-6 text-lg rounded-[24px]',
    };

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled || loading}
            className={`
                relative inline-flex items-center justify-center font-bold transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {icon && <span className="transition-transform duration-300">{icon}</span>}
                {children}
            </span>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            )}
        </motion.button>
    );
};

export default ModernButton;
