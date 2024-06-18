/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                "accent-light": "#4effff",
                "accent-dark": "#4e00ff",
            },
            animation: {
                vinyl: 'spin 10s linear infinite',
                marquee: 'marquee 10s linear infinite',
                "ping-once": 'pingonce 1s linear',
            },
            keyframes: {
                pingonce: {
                    "50%": {
                        transform: "scale(2)",
                        opacity: "0",
                    },
                    "75%": {
                        transform: "scale(0.8)",
                        opacity: "0",
                    },

                },
                marquee: {
                    '0%': {transform: 'translateX(0)'},
                    '100%': {transform: 'translateX(-25%)'},
                }
            },
        },
    },
    plugins: [],
}
