/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        secondary: "#0B1120",
        glass: "rgba(255, 255, 255, 0.04)",
        glassBorder: "rgba(255, 255, 255, 0.08)",
        purpleAccent: "#8B5CF6",
        blueAccent: "#3B82F6",
        cyanAccent: "#22D3EE",
        whiteAccent: "#F8FAFC",
        mutedText: "#94A3B8",
        bestDeal: "#22C55E"
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' }
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.2), 0 0 15px rgba(59, 130, 246, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 35px rgba(34, 211, 238, 0.3)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
