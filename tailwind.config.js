/** @type {import('tailwindcss').Config} */
export default {
  // Scanne tous les fichiers src pour purger les classes inutilisées en prod
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}