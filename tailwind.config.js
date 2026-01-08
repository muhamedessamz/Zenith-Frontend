/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                zenith: {
                    primary: '#6366f1',
                    'primary-dark': '#4f46e5',
                    'primary-light': '#818cf8',
                    accent: '#06b6d4',
                    'accent-dark': '#0891b2',
                },
                priority: {
                    low: '#6b7280',
                    medium: '#3b82f6',
                    high: '#f59e0b',
                    critical: '#ef4444',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                'gradient-dark': 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
            },
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-out',
                'slideInRight': 'slideInRight 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
}

