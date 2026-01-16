import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0F1115",
                foreground: "#FFFFFF",
                primary: {
                    DEFAULT: "#22C55E", // green-500
                    hover: "#16A34A",   // green-600
                },
            },
            keyframes: {
                'float-up': {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-50px)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
            animation: {
                'float-up': 'float-up 1s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
export default config;
