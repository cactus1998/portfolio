// data/skills.js
export const skillBlocks = [
  {
    id: 1,
    title: 'Frontend Development',
    icon: '⚛️',
    color: 'bg-indigo-100',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700',
    tagColor: 'bg-indigo-200 text-indigo-700 border-indigo-300',
    skills: [
      { tags: ['HTML5'] },
      { tags: ['CSS3', 'SCSS'] },
      { tags: ['JavaScript'] },
      { tags: ['Vue2', 'Vue3', 'Vuex', 'Router', 'Pinia'] },
      { tags: ['React', 'Hooks', 'Redux'] },
      { tags: ['ASP.NET', 'jQuery'] }
    ]
  },
  {
    id: 2,
    title: 'Backend & Database',
    icon: '🔧',
    color: 'bg-green-100',
    borderColor: 'border-green-100',
    textColor: 'text-green-700',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    skills: [
      { tags: ['ASP.NET', 'C#'] },
      { tags: ['MS SQL'] },
      { tags: ['MySQL'] },
      { tags: ['Firebase'] },
      { tags: ['C#'] }
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
      { tags: ['Git', 'Sourcetree'] },
      { tags: ['GitHub'] },
      { tags: ['GitHub Pages'] },
      { tags: ['Linux CLI'] }
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
      { tags: ['Git Mind', 'Miro'] },
      { tags: ['LINE Developer'] },
      { tags: ['UI/UX Planning'] }
    ]
  }
]