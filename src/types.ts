// 各資料檔共用的型別

export interface Site {
  title: string
  description: string
  image: string
  link: string
  /** GitHub 原始碼連結，沒有公開 repo 時省略 */
  repo?: string
  techStack: string[]
}

export interface Job {
  title: string
  company: string
  /** 格式：YYYY/M~YYYY/M */
  duration: string
  period: string
  highlights: string[]
  description: string[]
}

export type SkillIcon = 'code' | 'server' | 'tools' | 'spark'

/** 技能類別的強調色，對應 SkillSection 內的樣式表 */
export type SkillAccent = 'indigo' | 'emerald' | 'violet' | 'amber'

export interface SkillBlock {
  id: number
  title: string
  /** 一句話說明此類別 */
  summary: string
  icon: SkillIcon
  accent: SkillAccent
  /** 依類別分組的技能標籤 */
  skills: { label: string; tags: string[] }[]
}

/** 主力技術（顯示品牌圖示） */
export interface CoreSkill {
  name: string
  /** 品牌圖示的 SVG path（24x24） */
  path: string
  /** 品牌色，不含 # */
  hex: string
  note: string
}
