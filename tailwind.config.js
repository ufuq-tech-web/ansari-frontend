/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                // Headings (H1–H3) and product names. Self-hosted via next/font (see app/layout.tsx).
                sora: ['var(--font-sora)', 'sans-serif'],
                // Legacy fallback for other components using font-poppins that expect Sora.
                poppins: ['var(--font-sora)', 'sans-serif'],
                // Body copy — product descriptions, blog/guide content, footer.
                inter: ['var(--font-inter)', 'sans-serif'],
                // CTA buttons, navigation, and price.
                manrope: ['var(--font-manrope)', 'sans-serif'],
            },
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                accent: 'rgb(var(--color-accent) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
                error: 'rgb(var(--color-error) / <alpha-value>)',
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                charcoal: {
                    DEFAULT: '#1F2937',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                leather: {
                    DEFAULT: '#92400E',
                    50: '#FEF3C7',
                    100: '#FDE68A',
                    200: '#FCD34D',
                    300: '#B45309',
                    400: '#92400E',
                    500: '#78350F',
                },
                brand: {
                    orange: '#EA580C',
                    'orange-light': '#FB923C',
                    'orange-dark': '#C2410C',
                    green: '#16A34A',
                    ivory: '#F8F7F4',
                    brown: '#92400E',
                },
            },
            boxShadow: {
                card: '0 2px 12px rgba(0,0,0,0.06)',
                'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
                sticky: '0 2px 20px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                xl: '12px',
                '2xl': '16px',
            },
        },
    },
    plugins: [],
};
