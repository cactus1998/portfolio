import logo from "../assets/logo.png";
import reactGame01 from "../assets/reactGame01.png";
import stone from "../assets/stone.jpg";
import wrench from "../assets/wrench.png";

export const sites = [
  {
    title: "投資筆記",
    description: "施工中 可使用帳密 admin01 / admin01 登入測試",
    image: wrench,
    link: "https://yoake1.tw/transaction-records/",
    techStack: ["Vue 3", "vite" , "bcryptjs", "jsonwebtoken", "Firebase", "Tailwind CSS", "echarts"]
  },
  {
    title: "樂咖大物輪",
    description: "純手工鋁製前打輪形象網站",
    image: logo,
    link: "https://yoake1.tw/fishing-reel/",
    techStack: ["Vue 3", "Vite" , "element-plus" , "tailwind" , "GSAP" , "aos", "vue-awesome-swiper" , "vue3-table-lite" , "webpack" , "i18n" , "vercel"]
  },
  {
    title: "樂咖大物輪 購物車",
    description: "線上購物車系統，只做為展示用，不提供實際交易",
    image: logo,
    link: "https://yoake1.tw/fishing-shop/",
    techStack: ["Vue 3" , "element-plus" , "tailwind" , "Pinia" , "SweetAlert2", "firebase" , "webpack" , "vercel"]
  },
  {
    title: "樂咖大物輪 購物車後台",
    description: "線上購物車系統後台，須第三方登入，只做為展示用",
    image: logo,
    link: "https://yoake1.tw/fishing-shop-backstage/",
    techStack: ["Vue 3", "Vite" , "element-plus" , "tailwind" , "Pinia" , "firebase" , "webpack" , "vercel"]
  },
  {
    title: "react-game-tic-tac-toe",
    description: "React課程上的OOXX小遊戲",
    image: reactGame01,
    link: "https://yoake1.tw/react-game-tic-tac-toe/",
    techStack: ["React"]
  },
  {
    title: "遊藝新境鐵丸石藝",
    description: "遊藝新境鐵丸石藝形象網站",
    image: stone,
    link: "https://yoake1.tw/yoyi/",
    techStack: ["JS", "emailjs", "CSS ", "github pages", "Swiper"]
  },
];
