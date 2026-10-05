import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import HeroBackground from '../src/components/HeroBackground.vue'
import { intersectionObservers, flushFrame, rafQueue } from './setup'

// 背景需掛在外層區塊內，滑鼠事件由外層區塊監聽
const Host = defineComponent({ render: () => h('section', [h(HeroBackground)]) })

const mounted = []
const mountHost = () => {
  const wrapper = mount(Host, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}
const getCtx = (wrapper) => wrapper.find('canvas').element.getContext('2d')

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  delete window.matchMedia
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('HeroBackground', () => {
  it('每幀重繪所有粒子（畫面太小時至少 30 顆）', () => {
    const ctx = getCtx(mountHost())
    flushFrame(16)
    expect(ctx.clearRect).toHaveBeenCalledTimes(1)
    expect(ctx.arc).toHaveBeenCalledTimes(30)

    flushFrame(32)
    expect(ctx.clearRect).toHaveBeenCalledTimes(2)
  })

  it('粒子數量依畫面大小調整，且有上限', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(4000)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(3000)
    const ctx = getCtx(mountHost())
    flushFrame(16)
    expect(ctx.arc).toHaveBeenCalledTimes(90)
  })

  it('滑鼠在區塊內移動時，會畫出滑鼠與附近粒子的連線', () => {
    const wrapper = mountHost()
    const ctx = getCtx(wrapper)
    const section = wrapper.find('section').element
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0 })

    flushFrame(16)
    const withoutMouse = ctx.moveTo.mock.calls.length

    // jsdom 的畫布尺寸為 0，所有粒子都在原點，滑鼠移到原點附近一定會連線
    section.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }))
    ctx.moveTo.mockClear()
    flushFrame(32)
    expect(ctx.moveTo.mock.calls.length).toBeGreaterThan(withoutMouse)
    expect(ctx.moveTo).toHaveBeenCalledWith(10, 10)

    section.dispatchEvent(new MouseEvent('mouseleave'))
    ctx.moveTo.mockClear()
    flushFrame(48)
    expect(ctx.moveTo).not.toHaveBeenCalledWith(10, 10)
  })

  it('離開畫面時暫停動畫，回到畫面時恢復', () => {
    mountHost()
    const observer = intersectionObservers[0]
    expect(rafQueue.size).toBe(1)

    observer.trigger(false)
    expect(rafQueue.size).toBe(0)

    observer.trigger(true)
    expect(rafQueue.size).toBe(1)
  })

  it('系統要求減少動態效果時，只畫一張靜態畫面', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }))
    const ctx = getCtx(mountHost())
    expect(rafQueue.size).toBe(0)
    expect(intersectionObservers).toHaveLength(0)
    expect(ctx.arc).toHaveBeenCalledTimes(30)
  })

  it('卸載時停止動畫並移除外層區塊上的事件監聽', () => {
    const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener')
    const wrapper = mountHost()
    const section = wrapper.find('section').element

    mounted.splice(0)
    wrapper.unmount()

    const removed = removeSpy.mock.contexts
      .map((ctx, i) => [ctx, removeSpy.mock.calls[i][0]])
      .filter(([ctx]) => ctx === section)
      .map(([, name]) => name)
    expect(removed).toEqual(expect.arrayContaining(['mousemove', 'mouseleave']))
    expect(rafQueue.size).toBe(0)
    expect(intersectionObservers[0].disconnected).toBe(true)
  })
})
