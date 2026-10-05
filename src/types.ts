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

export interface SkillBlock {
  id: number
  title: string
  icon: SkillIcon
  /** 依類別分組的技能標籤 */
  skills: { label: string; tags: string[] }[]
}
