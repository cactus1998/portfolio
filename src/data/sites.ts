import logo from "../assets/logo.webp";
import reactGame01 from "../assets/reactGame01.png";
import stone from "../assets/stone.webp";
import type { Site } from "../types";

export const sites: Site[] = [
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
