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

export interface SkillBlock {
  id: number
  title: string
  icon: string
  /** 以下皆為 Tailwind class */
  color: string
  borderColor: string
  textColor: string
  tagColor: string
  skills: { tags: string[] }[]
}
