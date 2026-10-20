import aiotMonitor from "../assets/aiot-monitor.svg";
import functionLibrary from "../assets/function-library.svg";
import logo from "../assets/logo.webp";
import lotteryBattle from "../assets/lottery-battle.svg";
import reactGame01 from "../assets/reactGame01.png";
import stone from "../assets/stone.webp";
import type { Site } from "../types";

export const sites: Site[] = [
  {
    title: "AIoT Monitor",
    description: "工廠機台戰情室：模擬機台資料即時串流，提供總覽、機台詳情、歷史查詢、告警中心與趨勢預測，展示版以瀏覽器內模擬資料運作",
    image: aiotMonitor,
    link: "https://kentfolio.dev/aiot-monitor/",
    repo: "https://github.com/cactus1998/aiot-monitor",
    techStack: ["Vue 3", "TypeScript", "Vite", "Pinia", "Vue Router", "ECharts", "Zod", "Node.js", "Fastify", "SQLite", "SSE", "Vitest", "Playwright"]
  },
  {
    title: "抽獎大亂鬥",
    description: "把抽獎變成像素小人偶的自動混戰：每位參加者隨機分配職業，在競技場打到剩最後一人，依存活順序決定名次與獎品，同一個 seed 可重播出相同結果",
    image: lotteryBattle,
    link: "https://kentfolio.dev/lottery-battle/",
    repo: "https://github.com/cactus1998/lottery-battle",
    techStack: ["React 19", "TypeScript", "Vite", "Zustand", "Canvas 2D", "Vitest", "Testing Library"]
  },
  {
    title: "Function Library",
    description: "前端技術展示庫：虛擬列表、指令面板、拖放看板、跨分頁購物車等常見難題的可互動實作，附設計說明與測試",
    image: functionLibrary,
    link: "https://kentfolio.dev/function-library/",
    repo: "https://github.com/cactus1998/function-library",
    techStack: ["Vue 3", "TypeScript", "Vite", "Pinia", "Vue Router", "Vitest", "Fuse.js"]
  },
  {
    title: "樂咖大物輪",
    description: "純手工鋁製前打輪品牌形象頁：商品介紹、配色展示、價目表，支援繁中、簡中、英文（monorepo 三個 app 之一）",
    image: logo,
    link: "https://kentfolio.dev/fishing-reel/",
    techStack: ["Vue 3", "Vite", "vue-i18n", "element-plus", "Tailwind CSS", "aos", "Swiper", "Vitest"]
  },
  {
    title: "樂咖大物輪 購物車",
    description: "購物前台：商品列表、購物車、結帳下單；訂單格式由共用 schema 與 Firestore Security Rules 雙重驗證。僅供展示，不提供實際交易",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop/",
    techStack: ["Vue 3", "Vite", "Vue Router", "Pinia", "element-plus", "Tailwind CSS", "Swiper", "Firestore", "Vitest", "Playwright"]
  },
  {
    title: "樂咖大物輪 購物車後台",
    description: "後台訂單管理：Google 登入搭配管理員白名單，另有訪客模式可瀏覽；訂單狀態依規則逐步推進。僅供展示",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop-backstage/",
    techStack: ["Vue 3", "Vite", "Vue Router", "Pinia", "element-plus", "Tailwind CSS", "Firebase Auth", "Firestore", "Vitest"]
  },
  {
    title: "React 井字遊戲",
    description: "React 課程上的 OOXX 小遊戲",
    image: reactGame01,
    link: "https://kentfolio.dev/react-game-tic-tac-toe/",
    repo: "https://github.com/cactus1998/React_game01",
    techStack: ["React", "Vite"],
    early: true
  },
  {
    title: "遊藝新境鐵丸石藝",
    description: "遊藝新境鐵丸石藝形象網站",
    image: stone,
    link: "https://kentfolio.dev/yoyi/",
    repo: "https://github.com/cactus1998/yoyi",
    techStack: ["JS", "emailjs", "CSS", "github pages", "Swiper"],
    early: true
  },
];
