// data/skills.ts
import { siVuedotjs, siTypescript, siPinia, siTailwindcss, siVite, siThreedotjs } from 'simple-icons'
import type { CoreSkill, SkillBlock } from '../types'

// 主力技術：工作上最常使用
export const coreSkills: CoreSkill[] = [
  { name: 'Vue 3', path: siVuedotjs.path, hex: siVuedotjs.hex, note: 'Composition API' },
  { name: 'TypeScript', path: siTypescript.path, hex: siTypescript.hex, note: '型別安全' },
  { name: 'Pinia', path: siPinia.path, hex: siPinia.hex, note: '狀態管理' },
  { name: 'Tailwind CSS', path: siTailwindcss.path, hex: siTailwindcss.hex, note: 'Utility-First' },
  { name: 'Vite', path: siVite.path, hex: siVite.hex, note: '建置工具' },
  { name: 'Three.js', path: siThreedotjs.path, hex: siThreedotjs.hex, note: '3D 視覺' }
]

export const skillBlocks: SkillBlock[] = [
  {
    id: 1,
    title: 'Frontend Development',
    summary: '以 Vue 生態系為主，涵蓋狀態管理、多語系與資料視覺化',
    icon: 'code',
    accent: 'indigo',
    skills: [
      { label: '語言與樣式', tags: ['HTML5', 'CSS3', 'SCSS', 'Tailwind CSS', 'JavaScript', 'TypeScript'] },
      { label: '框架與狀態管理', tags: ['Vue2', 'Vue3', 'Vuex', 'Vue Router', 'Pinia', 'TanStack Query', 'Vue I18n', 'React', 'Hooks', 'Redux'] },
      { label: 'UI 與視覺化', tags: ['Element Plus', 'jQuery', 'GSAP', 'Three.js', 'Canvas', 'ECharts', 'Leaflet', 'FullCalendar'] }
    ]
  },
  {
    id: 2,
    title: 'Backend & Database',
    summary: 'ASP.NET API 開發與資料庫串接',
    icon: 'server',
    accent: 'emerald',
    skills: [
      { label: '後端', tags: ['ASP.NET', 'C#', 'IIS'] },
      { label: '資料庫', tags: ['MS SQL', 'MySQL', 'Firebase', 'Firestore'] }
    ]
  },
  {
    id: 3,
    title: 'DevOps & Tools',
    summary: '版本控制、CI/CD、測試與部署流程',
    icon: 'tools',
    accent: 'violet',
    skills: [
      { label: '版本控制', tags: ['Git', 'GitHub', 'Sourcetree'] },
      { label: 'CI/CD 與品質', tags: ['GitHub Actions', 'Jenkins', 'SonarQube'] },
      { label: '建置與測試', tags: ['Vite', 'Webpack', 'Vitest', 'Cypress'] },
      { label: '部署與環境', tags: ['GitHub Pages', 'Linux CLI'] }
    ]
  },
  {
    id: 4,
    title: 'Others',
    summary: '數據追蹤、平台整合與介面設計',
    icon: 'spark',
    accent: 'amber',
    skills: [
      { label: '數據追蹤', tags: ['GA4 事件追蹤'] },
      { label: '平台整合', tags: ['LINE Developer'] },
      { label: '設計', tags: ['UI/UX Planning', 'Photoshop', 'Illustrator'] }
    ]
  }
]
