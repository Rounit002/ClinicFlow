import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        clinic: {
          50: "#f0f7ff",
          100: "#e0efff",
          200: "#c7e0ff",
          300: "#a0caff",
          400: "#72acff",
          500: "#3f89ff",
          600: "#2872f5",
          700: "#1f5ce2",
          800: "#1e4cb7",
          900: "#1e4290",
          950: "#172a56"
        },
        teal: {
          50: '#E6FFFA',
          100: '#B5F5EC',
          200: '#81ECEC',
          500: '#2DD4BF',
          600: '#26A69A',
          700: '#1D7A74',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        lavender: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          500: '#D6BCFA',
          600: '#B794F4',
          700: '#9F7AEA',
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF7ED',
          200: '#FFF1DB',
        },
        yellow: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          500: '#FBBF24',
          600: '#F59E0B',
          700: '#D97706',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          500: '#38BDF8',
          600: '#0EA5E9',
          700: '#0284C7',
        },
        slate: {
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#4B5563',
          800: '#1F2937',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        },
        'slide-in': {
          from: {
            transform: 'translateX(-100%)'
          },
          to: {
            transform: 'translateX(0)'
          }
        },
        'scale-in': {
          from: {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          to: {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.04), 0 3px 6px rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;