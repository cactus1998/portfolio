import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteCard from '../src/components/SiteCard.vue'
import ProjectSection from '../src/components/ProjectSection.vue'
import { sites } from '../src/data/sites'

const props = {
  title: '測試作品',
  description: '作品描述',
  image: '/test.png',
  link: 'https://example.com/',
  techStack: ['Vue 3', 'Vite']
}

describe('SiteCard', () => {
  it('顯示標題、描述與技術標籤', () => {
    const wrapper = mount(SiteCard, { props })
    expect(wrapper.find('h2').text()).toBe('測試作品')
    expect(wrapper.text()).toContain('作品描述')
    const tags = wrapper.findAll('span').map((s) => s.text())
    expect(tags).toEqual(['Vue 3', 'Vite'])
  })

  it('圖片延遲載入並以標題作為 alt', () => {
    const img = mount(SiteCard, { props }).find('img')
    expect(img.attributes('src')).toBe('/test.png')
    expect(img.attributes('alt')).toBe('測試作品')
    expect(img.attributes('loading')).toBe('lazy')
  })

  it('外部連結在新分頁開啟並帶 noopener', () => {
    const link = mount(SiteCard, { props }).find('a')
    expect(link.attributes('href')).toBe('https://example.com/')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('沒有技術標籤時顯示提示文字', () => {
    const wrapper = mount(SiteCard, { props: { ...props, techStack: [] } })
    expect(wrapper.text()).toContain('無相關技術資訊')
  })
})

describe('ProjectSection', () => {
  it('依資料渲染所有作品卡片', () => {
    const wrapper = mount(ProjectSection)
    const cards = wrapper.findAllComponents(SiteCard)
    expect(cards).toHaveLength(sites.length)
    expect(cards.map((c) => c.props('title'))).toEqual(sites.map((s) => s.title))
  })

  it('有 #projects 錨點供首頁按鈕跳轉', () => {
    expect(mount(ProjectSection).find('section').attributes('id')).toBe('projects')
  })
})
