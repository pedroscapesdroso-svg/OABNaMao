import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores da marca OAB Na Mão
        brand: {
          dark: '#333333',    // Navy/escuro
          blue: '#0070f3',    // Azul principal
          green: '#28a745',   // Verde acerto
          red: '#dc3545',     // Vermelho erro
          light: '#f8f9fa',   // Fundo claro
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
