// data/skills.ts
import type { SkillBlock } from '../types'

export const skillBlocks: SkillBlock[] = [
  {
    id: 1,
    title: 'Frontend Development',
    icon: '⚛️',
    color: 'bg-indigo-100',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700',
    tagColor: 'bg-indigo-200 text-indigo-700 border-indigo-300',
    skills: [
      { tags: ['HTML5', 'CSS3', 'SCSS', 'Tailwind CSS'] },
      { tags: ['JavaScript', 'TypeScript'] },
      { tags: ['Vue2', 'Vue3', 'Vuex', 'Vue Router', 'Pinia', 'TanStack Query', 'Vue I18n'] },
      { tags: ['React', 'Hooks', 'Redux'] },
      { tags: ['Element Plus', 'jQuery'] },
      { tags: ['GSAP', 'Three.js', 'Canvas'] },
      { tags: ['ECharts', 'Leaflet', 'FullCalendar'] }
    ]
  },
  {
    id: 2,
    title: 'Backend & Database',
    icon: '🔧',
    color: 'bg-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    tagColor: 'bg-green-200 text-green-700 border-green-300',
    skills: [
      { tags: ['ASP.NET', 'C#'] },
      { tags: ['MS SQL', 'MySQL'] },
      { tags: ['Firebase', 'Firestore'] },
      { tags: ['IIS'] }
    ]
  },
  {
    id: 3,
    title: 'DevOps & Tools',
    icon: '🚀',
    color: 'bg-purple-100',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    tagColor: 'bg-purple-200 text-purple-700 border-purple-300',
    skills: [
      { tags: ['Git', 'GitHub', 'Sourcetree'] },
      { tags: ['GitHub Actions', 'Jenkins', 'SonarQube'] },
      { tags: ['Vite', 'Webpack'] },
      { tags: ['Vitest', 'Cypress'] },
      { tags: ['GitHub Pages', 'Linux CLI'] }
    ]
  },
  {
    id: 4,
    title: 'Others',
    icon: '✨',
    color: 'bg-orange-100',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    tagColor: 'bg-orange-200 text-orange-700 border-orange-300',
    skills: [
      { tags: ['GA4 事件追蹤'] },
      { tags: ['LINE Developer'] },
      { tags: ['UI/UX Planning', 'Photoshop', 'Illustrator'] }
    ]
  }
]
