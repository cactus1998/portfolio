import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { intersectionObservers } from './setup'
import { skillBlocks } from '../src/data/skills'

vi.mock('gsap', () => {
  const gsap = { fromTo: vi.fn(), to: vi.fn(), killTweensOf: vi.fn() }
  return { gsap, default: gsap }
})

const { gsap } = await import('gsap')
const { default: SkillSection } = await import('../src/components/SkillSection.vue')

beforeEach(() => vi.clearAllMocks())

describe('SkillSection', () => {
  it('渲染所有技能區塊與標籤', () => {
    const wrapper = mount(SkillSection)
    const titles = wrapper.findAll('h3').map((h) => h.text())
    expect(titles).toEqual(skillBlocks.map((b) => b.title))
    skillBlocks
      .flatMap((b) => b.skills.flatMap((s) => s.tags))
      .forEach((tag) => expect(wrapper.text()).toContain(tag))
  })

  it('有 #skills 錨點供首頁按鈕跳轉', () => {
    expect(mount(SkillSection).find('section').attributes('id')).toBe('skills')
  })

  it('觀察每張卡片', () => {
    mount(SkillSection)
    expect(intersectionObservers).toHaveLength(1)
    expect(intersectionObservers[0].elements.size).toBe(skillBlocks.length)
  })

  it('卡片進入畫面時依位置從不同方向飛入', () => {
    const wrapper = mount(SkillSection)
    const cards = wrapper.findAll('.skill-card').map((c) => c.element)
    // 故意打亂順序觸發，確認方向是依卡片位置而非觸發順序
    intersectionObservers[0].trigger(true, [cards[2], cards[0]])

    expect(gsap.fromTo).toHaveBeenCalledTimes(2)
    const [[el1, from1], [el2, from2]] = gsap.fromTo.mock.calls
    expect(el1).toBe(cards[2])
    expect(from1).toMatchObject({ opacity: 0, x: 80, y: 80 })
    expect(el2).toBe(cards[0])
    expect(from2).toMatchObject({ opacity: 0, x: -80, y: -80 })
  })

  it('卡片離開畫面時淡出', () => {
    const wrapper = mount(SkillSection)
    const card = wrapper.findAll('.skill-card')[1].element
    intersectionObservers[0].trigger(false, [card])

    expect(gsap.killTweensOf).toHaveBeenCalledWith(card)
    expect(gsap.to).toHaveBeenCalledWith(card, expect.objectContaining({ opacity: 0, x: -40, y: -40 }))
  })

  it('卸載時中斷 observer，且不污染 window', () => {
    const wrapper = mount(SkillSection)
    wrapper.unmount()
    expect(intersectionObservers[0].disconnected).toBe(true)
    expect(window.skillsObserver).toBeUndefined()
  })
})
