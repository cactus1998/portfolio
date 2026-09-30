import logo from "../assets/logo.webp";
import reactGame01 from "../assets/reactGame01.png";
import stone from "../assets/stone.webp";
import wrench from "../assets/wrench.png";

export const sites = [
  {
    title: "投資筆記",
    description: "施工中 可使用帳密 admin01 / admin01 登入測試",
    image: wrench,
    link: "https://kentfolio.dev/transaction-records/",
    techStack: ["Vue 3", "Vite", "bcryptjs", "jsonwebtoken", "Firebase", "Tailwind CSS", "echarts"]
  },
  {
    title: "樂咖大物輪",
    description: "純手工鋁製前打輪形象網站",
    image: logo,
    link: "https://kentfolio.dev/fishing-reel/",
    techStack: ["Vue 3", "Vue CLI", "webpack", "element-plus", "Tailwind CSS", "GSAP", "aos", "Swiper", "vue3-table-lite", "vue-i18n"]
  },
  {
    title: "樂咖大物輪 購物車",
    description: "線上購物車系統，只做為展示用，不提供實際交易",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop/",
    techStack: ["Vue 3", "Vite", "Vue Router", "Pinia", "element-plus", "Tailwind CSS", "Swiper", "SweetAlert2", "Firestore"]
  },
  {
    title: "樂咖大物輪 購物車後台",
    description: "線上購物車系統後台，須第三方登入，只做為展示用",
    image: logo,
    link: "https://kentfolio.dev/fishing-shop-backstage/",
    techStack: ["Vue 3", "Vite", "Vue Router", "element-plus", "Tailwind CSS", "Firebase Auth", "Firestore", "SweetAlert2"]
  },
  {
    title: "react-game-tic-tac-toe",
    description: "React課程上的OOXX小遊戲",
    image: reactGame01,
    link: "https://kentfolio.dev/react-game-tic-tac-toe/",
    techStack: ["React"]
  },

  {
    title: "遊藝新境鐵丸石藝",
    description: "遊藝新境鐵丸石藝形象網站",
    image: stone,
    link: "https://kentfolio.dev/yoyi/",
    techStack: ["JS", "emailjs", "CSS", "github pages", "Swiper"]
  },
];
