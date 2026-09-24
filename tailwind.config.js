export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: '#0a0a0a',
        muted: '#9ca3af',
        rule: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
