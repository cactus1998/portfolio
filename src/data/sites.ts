import functionLibrary from "../assets/function-library.svg";
import logo from "../assets/logo.webp";
import lotteryBattle from "../assets/lottery-battle.svg";
import reactGame01 from "../assets/reactGame01.png";
import stone from "../assets/stone.webp";
import type { Site } from "../types";

export const sites: Site[] = [
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
    description: "純手工鋁製前打輪形象網站",
    image: logo,
    link: "https://kentfolio.dev/fishing-reel/",
    repo: "https://github.com/cactus1998/fishing-reel",
    techStack: ["Vue 3", "Vue CLI", "webpack", "element-plus", "Tailwind CSS", "GSAP", "aos", "Swiper", "vue3-table-lite", "vue-i18n"]
  },
  {
    title: "樂咖大物輪 購物車",
    description: "線上購物車系統，只做為展示用，不提供實際交易",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop/",
    repo: "https://github.com/cactus1998/fishing-shop",
    techStack: ["Vue 3", "Vite", "Vue Router", "Pinia", "element-plus", "Tailwind CSS", "Swiper", "SweetAlert2", "Firestore"]
  },
  {
    title: "樂咖大物輪 購物車後台",
    description: "線上購物車系統後台，須第三方登入，只做為展示用",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop-backstage/",
    repo: "https://github.com/cactus1998/fishing-shop-backstage",
    techStack: ["Vue 3", "Vite", "Vue Router", "element-plus", "Tailwind CSS", "Firebase Auth", "Firestore", "SweetAlert2"]
  },
  {
    title: "React 井字遊戲",
    description: "React 課程上的 OOXX 小遊戲",
    image: reactGame01,
    link: "https://kentfolio.dev/react-game-tic-tac-toe/",
    repo: "https://github.com/cactus1998/React_game01",
    techStack: ["React", "Vite"]
  },
  {
    title: "遊藝新境鐵丸石藝",
    description: "遊藝新境鐵丸石藝形象網站",
    image: stone,
    link: "https://kentfolio.dev/yoyi/",
    repo: "https://github.com/cactus1998/yoyi",
    techStack: ["JS", "emailjs", "CSS", "github pages", "Swiper"]
  },
];
