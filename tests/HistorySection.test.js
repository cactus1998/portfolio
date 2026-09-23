import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HistorySection from '../src/components/HistorySection.vue'
import { jobs } from '../src/data/jobs'
import { flushFrame } from './setup'

const mounted = []

// 讓 el-collapse-transition 直接渲染內容，不做動畫
const mountSection = () => {
  const wrapper = mount(HistorySection, {
    attachTo: document.body,
    global: { stubs: { ElCollapseTransition: { template: '<div><slot /></div>' } } }
  })
  mounted.push(wrapper)
  return wrapper
}

const rect = (top, bottom) => ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top })

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('HistorySection', () => {
  it('渲染所有工作項目', () => {
    const wrapper = mountSection()
    const titles = wrapper.findAll('h3').map((h) => h.text())
    expect(titles).toEqual(jobs.map((j) => j.title))
    jobs.forEach((job) => expect(wrapper.text()).toContain(job.company))
  })

  it('預設收合，點擊後展開描述，再點一次收起', async () => {
    const wrapper = mountSection()
    const button = wrapper.findAll('button')[0]
    expect(button.text()).toBe('展開更多')
    expect(wrapper.text()).not.toContain(jobs[0].description[0])

    await button.trigger('click')
    expect(button.text()).toBe('收起內容')
    jobs[0].description.forEach((d) => expect(wrapper.text()).toContain(d))

    await button.trigger('click')
    expect(button.text()).toBe('展開更多')
    expect(wrapper.text()).not.toContain(jobs[0].description[0])
  })

  it('各項目展開狀態互相獨立', async () => {
    const wrapper = mountSection()
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    expect(buttons[0].text()).toBe('展開更多')
    expect(buttons[1].text()).toBe('收起內容')
    expect(wrapper.text()).toContain(jobs[1].description[0])
    expect(wrapper.text()).not.toContain(jobs[0].description[0])
  })

  it('不會修改原始資料', async () => {
    const wrapper = mountSection()
    await wrapper.findAll('button')[0].trigger('click')
    expect(jobs[0]).not.toHaveProperty('showDetails')
  })

  it('區塊還沒進入畫面時進度為 0，完全捲過後為 1', async () => {
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect')
    const wrapper = mountSection()
    const bar = () => wrapper.find('.from-purple-500.to-indigo-500.absolute').attributes('style')

    // 區塊在畫面下方
    spy.mockReturnValue(rect(5000, 8000))
    window.dispatchEvent(new Event('scroll'))
    flushFrame()
    await nextTick()
    expect(bar()).toContain('height: 0%')

    // 區塊已完全捲到畫面上方
    spy.mockReturnValue(rect(-5000, -100))
    window.dispatchEvent(new Event('scroll'))
    flushFrame()
    await nextTick()
    expect(bar()).toContain('height: 100%')
  })

  it('捲動到一半時依時間軸位置計算進度', async () => {
    const wrapper = mountSection()
    const section = wrapper.find('section').element
    const timeline = wrapper.find('.top-8').element
    const cards = wrapper.findAll('.space-y-16 > div > div:nth-child(2)').map((c) => c.element)

    // innerHeight 預設 768：section 在畫面中，時間軸頂端 568、最後一張卡片底部 1568
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(rect(0, 2000))
    vi.spyOn(timeline, 'getBoundingClientRect').mockReturnValue(rect(568, 2000))
    vi.spyOn(cards.at(-1), 'getBoundingClientRect').mockReturnValue(rect(1200, 1568))

    window.dispatchEvent(new Event('scroll'))
    flushFrame()
    await nextTick()

    // scrollOffset = 768 - 568 = 200；contentHeight = 1568 - 568 - 200 = 800
    // progress = 200 / (800 + 768)
    const expected = (200 / (800 + 768)) * 100
    const style = wrapper.find('.from-purple-500.to-indigo-500.absolute').attributes('style')
    expect(parseFloat(style.match(/height: ([\d.]+)%/)[1])).toBeCloseTo(expected, 5)
  })

  it('同一幀內多次 scroll 只計算一次', () => {
    mountSection()
    requestAnimationFrame.mockClear()
    for (let i = 0; i < 10; i++) window.dispatchEvent(new Event('scroll'))
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it('卸載時移除 scroll / resize 監聽', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    mounted.splice(0).forEach((w) => w.unmount())
    mount(HistorySection).unmount()
    const events = removeSpy.mock.calls.map(([name]) => name)
    expect(events).toContain('scroll')
    expect(events).toContain('resize')
  })
})
