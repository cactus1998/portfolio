/** @type {import('tailwindcss').Config} */
export default {
  // 觸控裝置沒有 hover，避免點擊後卡在 hover 樣式（卡片放大、旋轉）
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
