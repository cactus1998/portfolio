import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { rafQueue } from './setup'

vi.mock('gsap', () => {
  const timeline = { to: vi.fn() }
  timeline.to.mockReturnValue(timeline)
  timeline.kill = vi.fn()
  const gsap = { registerPlugin: vi.fn(), timeline: vi.fn(() => timeline), __timeline: timeline }
  return { gsap, default: gsap }
})
vi.mock('gsap/TextPlugin', () => ({ TextPlugin: {} }))

const { default: gsap } = await import('gsap')
const { default: FirstSection } = await import('../src/components/FirstSection.vue')

const mounted = []
const mountSection = () => {
  const wrapper = mount(FirstSection, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

beforeEach(() => {
  // 只模擬計時器，rAF 由 setup.js 手動控制
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  vi.clearAllMocks()
})

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('FirstSection', () => {
  it('完整標題與描述文字存在於 DOM，供螢幕閱讀器與搜尋引擎讀取', () => {
    const wrapper = mountSection()
    const srTexts = wrapper.findAll('.sr-only').map((el) => el.text())
    expect(srTexts[0]).toBe('Hello, 我是 邦晉')
    expect(srTexts[1]).toContain('熱愛創造優雅的網頁體驗')
    // 打字動畫用的元素對輔助技術隱藏，避免重複朗讀
    expect(wrapper.findAll('h1 [aria-hidden="true"], .description [aria-hidden="true"]').length).toBe(3)
  })

  it('顯示職稱與年資，並提供 GitHub 連結', () => {
    const wrapper = mountSection()
    expect(wrapper.text()).toContain('前端工程師')
    expect(wrapper.text()).toContain('3 年以上經驗')
    const github = wrapper.find('a[aria-label="GitHub"]')
    expect(github.attributes('href')).toBe('https://github.com/cactus1998')
    expect(github.attributes('rel')).toContain('noopener')
  })

  it('系統要求減少動態效果時，直接顯示完整內容且不播放動畫', async () => {
    window.matchMedia = vi.fn(() => ({ matches: true }))
    try {
      window.__appLoaded = true
      const wrapper = mountSection()
      await vi.advanceTimersByTimeAsync(1000)

      expect(gsap.timeline).not.toHaveBeenCalled()
      expect(rafQueue.size).toBe(0)
      expect(wrapper.find('h1 [aria-hidden="true"]').text()).toBe('Hello, 我是')
      expect(wrapper.find('.description [aria-hidden="true"]').text()).toContain('熱愛創造優雅的網頁體驗')
    } finally {
      delete window.matchMedia
    }
  })

  it('等 Loading 畫面結束後才開始打字動畫', async () => {
    mountSection()
    vi.advanceTimersByTime(1000)
    expect(gsap.timeline).not.toHaveBeenCalled()

    window.__appLoaded = true
    window.dispatchEvent(new Event('app-loaded'))
    await vi.advanceTimersByTimeAsync(299)
    expect(gsap.timeline).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(gsap.timeline).toHaveBeenCalledTimes(1)
    const texts = gsap.__timeline.to.mock.calls.map(([, vars]) => vars.text).filter(Boolean)
    expect(texts.join('')).toContain('Hello, 我是 邦晉')
  })

  it('頁面已載入時掛載，也會開始動畫', async () => {
    window.__appLoaded = true
    mountSection()
    await vi.advanceTimersByTimeAsync(300)
    expect(gsap.timeline).toHaveBeenCalledTimes(1)
  })

  it('在動畫開始前卸載，不會啟動動畫', async () => {
    const wrapper = mountSection()
    mounted.splice(0)
    wrapper.unmount()
    window.__appLoaded = true
    window.dispatchEvent(new Event('app-loaded'))
    await vi.advanceTimersByTimeAsync(1000)
    expect(gsap.timeline).not.toHaveBeenCalled()
  })
})
