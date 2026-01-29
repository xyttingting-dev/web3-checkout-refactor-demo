/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'], // Modern font
            },
            animation: {
                float: 'float 4s ease-in-out infinite',
                breathe: 'breathe 3s ease-in-out infinite',
                radar: 'radar 2s linear infinite',
                blob: "blob 7s infinite",
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                breathe: {
                    '0%, 100%': { boxShadow: '0 0 0 0px rgba(99, 102, 241, 0.1)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(99, 102, 241, 0)' },
                },
                radar: {
                    '0%': { transform: 'scale(0.9)', opacity: '0.7' },
                    '100%': { transform: 'scale(2.5)', opacity: '0' },
                },
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
            transformOrigin: {
                'center': 'center',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
