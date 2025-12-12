/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'gradient-yellow': '#EBC894',
        'gradient-blue': '#B49EF4',
        'primary': '#1D61E7',
        'green': '#00B288',
        'pink': '#FF1B5E',
        'orange': '#FF9E2D',
        'red': '#EB5757',
        'red-secondary': '#FF6B6B',
        'purple': '#9B51E0',
        'blue': '#29BAE2',
        'link': "#4D81E7",
        'gray': '#6C7278',
        'light-gray': '#E5E7EB',
        'headline': "#111827",
        'bege': "#F6CFAC",
        'text': '#371B34'
      },
      fontFamily: {
        'inter-bold': ['Inter_700Bold'],
        'inter-regular': ['Inter_400Regular'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-light': ['Inter_300Light']
      },
      fontSize: {
        '14': '14px',
      },
    },
  },
  plugins: [],
}