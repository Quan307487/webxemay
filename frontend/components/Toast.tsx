'use client';
import { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const ToastContext = createContext<{ add: (msg: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const add = useCallback((message: string, type: ToastType = 'success') => {
        switch (type) {
            case 'success': toast.success(message); break;
            case 'error': toast.error(message); break;
            default: toast(message); break;
        }
    }, []);

    return (
        <ToastContext.Provider value={{ add }}>
            {children}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(15, 23, 42, 0.9)',
                        color: '#fff',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: 500,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#f43f5e',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be inside ToastProvider');
    return ctx;
}
