import { describe, it, expect } from 'vitest'
import { sites } from '../src/data/sites'
import { jobs } from '../src/data/jobs'
import { skillBlocks } from '../src/data/skills'

const isTrimmedNonEmpty = (s) => typeof s === 'string' && s.length > 0 && s === s.trim()

describe('sites 作品資料', () => {
  it('每個作品都有完整欄位', () => {
    expect(sites.length).toBeGreaterThan(0)
    sites.forEach((site) => {
      expect(isTrimmedNonEmpty(site.title)).toBe(true)
      expect(isTrimmedNonEmpty(site.description)).toBe(true)
      expect(typeof site.image).toBe('string')
      expect(site.link).toMatch(/^https:\/\//)
      expect(Array.isArray(site.techStack)).toBe(true)
    })
  })

  it('連結不重複（ProjectSection 以 link 當 v-for key）', () => {
    const links = sites.map((s) => s.link)
    expect(new Set(links).size).toBe(links.length)
  })

  it('技術標籤沒有多餘空白，且同一作品內不重複（SiteCard 以 tag 當 key）', () => {
    sites.forEach((site) => {
      site.techStack.forEach((tech) => expect(isTrimmedNonEmpty(tech)).toBe(true))
      expect(new Set(site.techStack).size).toBe(site.techStack.length)
    })
  })
})

describe('jobs 工作歷程資料', () => {
  it('每筆工作都有完整欄位', () => {
    expect(jobs.length).toBeGreaterThan(0)
    jobs.forEach((job) => {
      expect(isTrimmedNonEmpty(job.title)).toBe(true)
      expect(isTrimmedNonEmpty(job.company)).toBe(true)
      expect(job.duration).toMatch(/^\d{4}\/\d{1,2}~\d{4}\/\d{1,2}$/)
      expect(job.highlights.length).toBeGreaterThan(0)
      expect(job.description.length).toBeGreaterThan(0)
    })
  })

  it('公司名稱不重複（HistorySection 以 company 當 v-for key）', () => {
    const companies = jobs.map((j) => j.company)
    expect(new Set(companies).size).toBe(companies.length)
  })

  it('依時間由新到舊排序', () => {
    const start = (job) => {
      const [y, m] = job.duration.split('~')[0].split('/').map(Number)
      return y * 12 + m
    }
    for (let i = 1; i < jobs.length; i++) {
      expect(start(jobs[i - 1])).toBeGreaterThan(start(jobs[i]))
    }
  })
})

describe('skillBlocks 技能資料', () => {
  it('id 不重複', () => {
    const ids = skillBlocks.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每個區塊都有樣式設定與至少一個標籤', () => {
    skillBlocks.forEach((block) => {
      for (const key of ['title', 'icon', 'color', 'borderColor', 'textColor', 'tagColor']) {
        expect(isTrimmedNonEmpty(block[key])).toBe(true)
      }
      const tags = block.skills.flatMap((s) => s.tags)
      expect(tags.length).toBeGreaterThan(0)
      tags.forEach((tag) => expect(isTrimmedNonEmpty(tag)).toBe(true))
    })
  })
})
