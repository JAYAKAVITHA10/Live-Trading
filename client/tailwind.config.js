
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b1220',
        foreground: '#e6edf3',
        card: '#111826',
        muted: '#1b2432',
        accent: '#2e7cf6',
        positive: '#16a34a',
        negative: '#dc2626'
      }
    }
  },
  plugins: []
}
