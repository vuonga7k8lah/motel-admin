
import React, { createContext, ReactNode, useContext } from 'react';
import { toast, ToastOptions } from 'react-toastify';

interface ToastContextType {
    notify: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const notify = (message: string, options?: ToastOptions) => {
        toast(message, options);
    };

    return (
        <ToastContext.Provider value={{ notify }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
