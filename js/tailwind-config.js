// Tailwind CSS CDN theme configuration (loaded immediately after cdn.tailwindcss.com)
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        bg: '#0b0b0c',
        card: '#141416',
        border: '#242428',
        ink: '#f4f4f5',
        muted: '#a1a1aa'
      }
    }
  }
};
