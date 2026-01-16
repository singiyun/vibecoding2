import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover active:scale-95 rounded-full shadow-lg shadow-green-900/20",
        ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/10 rounded-lg",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg"
    };

    const widthStyles = fullWidth ? "w-full py-4 text-base" : "px-6 py-3 text-sm";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
