# Portfolio 個人作品集網站

![Static Badge](https://img.shields.io/badge/Vue3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) 
![Static Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) 
![Static Badge](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) 
![Static Badge](https://img.shields.io/badge/Element%20Plus-409EFF?style=for-the-badge&logo=element&logoColor=white) 
![Static Badge](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white) 
![Static Badge](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white) 
![Static Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![Static Badge](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## 📖 說明

本專案為個人作品集網站 (Portfolio)，使用 **Vue 3 + Vite** 打造，  
結合 **Three.js** 與 **GSAP 動畫效果**，呈現流暢的互動體驗與視覺設計。  

專案以模組化結構開發，並運用 **Tailwind CSS** 提供響應式排版設計，  
同時整合 **Element Plus** 元件庫以提升開發效率。

---

## 🧩 專案技術

| 技術 | 版本 | 用途說明 |
|------|------|----------|
| Node.js | v18+ | 執行開發伺服器與建置專案 |
| Vue | ^3.5.18 | 前端核心框架 |
| Vite | ^7.1.2 | 開發與打包工具 |
| Tailwind CSS | ^3.4.17 | 響應式樣式框架 |
| Element Plus | ^2.11.4 | UI 元件庫 |
| GSAP | ^3.13.0 | 高效動畫特效 |
| Three.js | ^0.180.0 | 3D 視覺與互動效果 |
| gh-pages | ^6.3.0 | 部署至 GitHub Pages |

---

## 📂 資料夾結構說明

- **`components/`** — 頁面元件放置處  
- **`assets/`** — 靜態資源（圖片、模型、CSS）  
- **`data/`** — 靜態資料  
- **`public/`** — 靜態檔案（favicon、meta 資訊）  
- **`vite.config.js`** — Vite 專案設定檔  

---

## 🚀 指令說明

| 指令 | 說明 |
|------|------|
| `npm install` | 安裝專案依賴套件 |
| `npm run dev` | 啟動本地開發伺服器 |
| `npm run build` | 打包專案（輸出至 `/dist`） |
| `npm run preview` | 預覽打包後的結果 |
| `npm run deploy` | 部署至 GitHub Pages |

---

## 🌐 部署

專案已配置 GitHub Pages，自動將 `/dist` 目錄內容部署至分支。  
如需手動部署，可執行：

```bash
npm run build
npm run deploy
