import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // orange-200
        input: "var(--color-input)", // orange-200
        ring: "var(--color-ring)", // amber-500
        background: "var(--color-background)", // warm-50
        foreground: "var(--color-foreground)", // amber-900
        primary: {
          DEFAULT: "var(--color-primary)", // amber-500
          foreground: "var(--color-primary-foreground)", // white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // orange-200
          foreground: "var(--color-secondary-foreground)", // amber-900
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-500
          foreground: "var(--color-destructive-foreground)", // white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // warm-50
          foreground: "var(--color-muted-foreground)", // amber-800
        },
        accent: {
          DEFAULT: "var(--color-accent)", // green-500
          foreground: "var(--color-accent-foreground)", // white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // white
          foreground: "var(--color-popover-foreground)", // amber-900
        },
        card: {
          DEFAULT: "var(--color-card)", // white
          foreground: "var(--color-card-foreground)", // amber-900
        },
        success: {
          DEFAULT: "var(--color-success)", // green-500
          foreground: "var(--color-success-foreground)", // white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-500
          foreground: "var(--color-warning-foreground)", // white
        },
        error: {
          DEFAULT: "var(--color-error)", // red-500
          foreground: "var(--color-error-foreground)", // white
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)", // 24px
        md: "var(--radius-md)", // 16px
        sm: "var(--radius-sm)", // 8px
        xl: "var(--radius-xl)", // 32px
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
        display: ['Quicksand', 'DM Sans', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 8vw, 6rem)',
        'section': 'clamp(2rem, 5vw, 3.5rem)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wag: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        wag: 'wag 0.6s ease-in-out 2',
        scroll: 'scroll 50s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
