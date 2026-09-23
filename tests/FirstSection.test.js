import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { intersectionObservers, flushFrame, rafQueue } from './setup'

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
    expect(wrapper.findAll('[aria-hidden="true"]').length).toBe(3)
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

  it('每幀繪製雪花，並逐漸增加到 120 顆', () => {
    const wrapper = mountSection()
    const ctx = wrapper.find('canvas').element.getContext('2d')

    flushFrame()
    expect(ctx.clearRect).toHaveBeenCalled()
    expect(ctx.drawImage).toHaveBeenCalledTimes(1)

    for (let i = 0; i < 200; i++) flushFrame()
    ctx.drawImage.mockClear()
    flushFrame()
    expect(ctx.drawImage).toHaveBeenCalledTimes(120)
  })

  it('首頁離開畫面時暫停雪花動畫，回到畫面時恢復', () => {
    mountSection()
    const observer = intersectionObservers[0]
    expect(rafQueue.size).toBe(1)

    observer.trigger(false)
    expect(rafQueue.size).toBe(0)

    observer.trigger(true)
    expect(rafQueue.size).toBe(1)
  })

  it('卸載時停止動畫，並移除所有加在首頁區塊上的事件監聽', () => {
    const addSpy = vi.spyOn(EventTarget.prototype, 'addEventListener')
    const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener')
    const wrapper = mountSection()
    const section = wrapper.find('section').element

    const added = addSpy.mock.contexts
      .map((ctx, i) => [ctx, ...addSpy.mock.calls[i]])
      .filter(([ctx]) => ctx === section)
    expect(added.map(([, name]) => name)).toEqual(expect.arrayContaining(['mousemove', 'mouseleave']))

    mounted.splice(0)
    wrapper.unmount()

    const removed = removeSpy.mock.contexts
      .map((ctx, i) => [ctx, ...removeSpy.mock.calls[i]])
      .filter(([ctx]) => ctx === section)
    // 每個加上的監聽都要以同一個 handler 移除
    added.forEach(([, name, handler]) => {
      expect(removed.some(([, n, h]) => n === name && h === handler)).toBe(true)
    })
    expect(rafQueue.size).toBe(0)
    expect(intersectionObservers[0].disconnected).toBe(true)
    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

})
