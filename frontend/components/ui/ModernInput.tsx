'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    error?: string;
}

const ModernInput: React.FC<ModernInputProps> = ({
    label,
    icon,
    error,
    type,
    value,
    onFocus,
    onBlur,
    className = "",
    ...props
}) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className={`w-full flex flex-col gap-2 ${className}`}>
            {/* Label - always above, never overlaps */}
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 pl-1">
                {label}
            </label>

            <div className="relative">
                {/* Input */}
                <input
                    type={isPassword && showPassword ? 'text' : type}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`
                        w-full bg-white/[0.04] border rounded-xl py-4 text-white outline-none 
                        transition-all duration-200 font-medium text-sm placeholder:text-white/20
                        ${icon ? 'pl-12 pr-12' : 'pl-4 pr-12'}
                        ${error
                            ? 'border-red-500/60 ring-2 ring-red-500/10'
                            : focused
                                ? 'border-[#e00000]/80 ring-2 ring-[#e00000]/10 bg-white/[0.06]'
                                : 'border-white/10 hover:border-white/20'
                        }
                    `}
                    {...props}
                />

                {/* Left Icon */}
                {icon && (
                    <div className={`
                        absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center
                        transition-colors duration-200
                        ${focused ? 'text-[#e00000]' : 'text-white/25'}
                    `}>
                        {icon}
                    </div>
                )}

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-red-400 text-xs font-medium pl-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernInput;
