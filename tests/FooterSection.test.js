import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { intersectionObservers, flushFrame, rafQueue } from './setup'

// 使用真的 three.js 做場景與物理計算，只把需要 WebGL 的渲染器換成假的
const renderer = vi.hoisted(() => ({ instances: [] }))
vi.mock('three', async (importOriginal) => {
  const THREE = await importOriginal()
  class FakeWebGLRenderer {
    constructor(options) {
      this.options = options
      this.setSize = vi.fn()
      this.setPixelRatio = vi.fn()
      this.dispose = vi.fn()
      this.render = vi.fn((scene, camera) => {
        this.lastScene = scene
        this.lastCamera = camera
      })
      renderer.instances.push(this)
    }
  }
  return { ...THREE, WebGLRenderer: FakeWebGLRenderer }
})

const STEP_MS = 1000 / 60
const mounted = []

const mountFooter = async () => {
  const { default: FooterSection } = await import('../src/components/FooterSection.vue')
  const wrapper = mount(FooterSection, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

/** 讓 footer 進入畫面並等待 three.js 載入完成 */
const showFooter = async () => {
  intersectionObservers[0].trigger(true)
  await vi.dynamicImportSettled()
}

const trails = () => renderer.instances[0].lastScene.children.filter((o) => o.isLine)

beforeEach(() => {
  renderer.instances.length = 0
  vi.spyOn(performance, 'now').mockReturnValue(0)
})

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.resetModules()
  document.body.innerHTML = ''
})

describe('FooterSection 內容', () => {
  it('Email 為 mailto 連結', async () => {
    const link = (await mountFooter()).find('a')
    expect(link.attributes('href')).toBe('mailto:s770880qq@gmail.com')
    expect(link.text()).toBe('s770880qq@gmail.com')
  })

  it('2025 年只顯示單一年份', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2025-06-01'))
    expect((await mountFooter()).text()).toContain('© 2025 Designed')
  })

  it('之後的年份顯示為區間', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2027-03-01'))
    expect((await mountFooter()).text()).toContain('© 2025-2027 Designed')
  })
})

describe('FooterSection 三體動畫', () => {
  it('footer 進入畫面前不載入 three.js、不執行動畫', async () => {
    await mountFooter()
    await vi.dynamicImportSettled()
    expect(renderer.instances).toHaveLength(0)
    expect(rafQueue.size).toBe(0)
  })

  it('頁面載入後利用閒置時間預先載入，但不在畫面上時不執行動畫', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    window.__appLoaded = true
    await mountFooter()
    await vi.runAllTimersAsync()
    await vi.dynamicImportSettled()

    expect(renderer.instances).toHaveLength(1)
    expect(rafQueue.size).toBe(0)
  })

  it('進入畫面後建立場景並開始動畫，離開畫面後暫停', async () => {
    await mountFooter()
    await showFooter()

    expect(renderer.instances).toHaveLength(1)
    expect(rafQueue.size).toBe(1)

    flushFrame(STEP_MS)
    expect(renderer.instances[0].render).toHaveBeenCalledTimes(1)
    expect(trails()).toHaveLength(3)

    intersectionObservers[0].trigger(false)
    expect(rafQueue.size).toBe(0)
  })

  it('再次進入畫面不會重複建立場景', async () => {
    await mountFooter()
    await showFooter()
    intersectionObservers[0].trigger(false)
    await showFooter()
    expect(renderer.instances).toHaveLength(1)
    expect(rafQueue.size).toBe(1)
  })

  it('物理模擬以固定步長進行：60Hz 每幀一步', async () => {
    await mountFooter()
    await showFooter()
    for (let i = 1; i <= 10; i++) flushFrame(i * STEP_MS + 0.01)
    trails().forEach((t) => expect(t.geometry.drawRange.count).toBe(10))
  })

  it('120Hz 螢幕不會讓模擬變快：兩幀才一步', async () => {
    await mountFooter()
    await showFooter()
    for (let i = 1; i <= 20; i++) flushFrame(i * (STEP_MS / 2) + 0.01)
    trails().forEach((t) => expect(t.geometry.drawRange.count).toBe(10))
  })

  it('長時間沒更新（例如切換分頁）時，單幀最多補算 100ms', async () => {
    await mountFooter()
    await showFooter()
    flushFrame(10_000)
    trails().forEach((t) => expect(t.geometry.drawRange.count).toBeLessThanOrEqual(6))
  })

  it('軌跡最多保留 400 點，依序為最近 400 步的位置', async () => {
    await mountFooter()
    await showFooter()

    // 60Hz 每幀剛好一步，記錄每一步後的天體位置
    const history = [[], [], []]
    for (let i = 1; i <= 500; i++) {
      flushFrame(i * STEP_MS + 0.01)
      renderer.instances[0].lastScene.children
        .filter((o) => o.isMesh)
        .forEach((body, b) => history[b].push(body.position.clone()))
    }

    trails().forEach((trail, b) => {
      expect(trail.geometry.drawRange.count).toBe(400)
      const pos = trail.geometry.attributes.position
      const expected = history[b].slice(-400)
      // 抽查頭、中、尾，確認舊點有正確往前移
      for (const i of [0, 1, 200, 398, 399]) {
        expect(pos.getX(i)).toBeCloseTo(expected[i].x, 4)
        expect(pos.getY(i)).toBeCloseTo(expected[i].y, 4)
        expect(pos.getZ(i)).toBeCloseTo(expected[i].z, 4)
      }
    })
  })

  it('three.js 載入期間離開畫面，載入完成後不會開始動畫', async () => {
    await mountFooter()
    intersectionObservers[0].trigger(true)
    intersectionObservers[0].trigger(false)
    await vi.dynamicImportSettled()

    expect(renderer.instances).toHaveLength(1)
    expect(rafQueue.size).toBe(0)
  })


  it('天體始終維持在邊界內且數值有效', async () => {
    await mountFooter()
    await showFooter()
    const scene = () => renderer.instances[0].lastScene
    for (let i = 1; i <= 2000; i++) {
      flushFrame(i * STEP_MS + 0.01)
      if (i % 100 === 0) {
        scene().children.filter((o) => o.isMesh).forEach((body) => {
          for (const axis of ['x', 'y', 'z']) {
            expect(Number.isFinite(body.position[axis])).toBe(true)
            expect(Math.abs(body.position[axis])).toBeLessThanOrEqual(17)
          }
        })
      }
    }
  })

  it('卸載時停止動畫並釋放 WebGL 與幾何體資源', async () => {
    const wrapper = await mountFooter()
    await showFooter()
    flushFrame(STEP_MS)
    const scene = renderer.instances[0].lastScene
    const geometries = new Set()
    scene.traverse((o) => o.geometry && geometries.add(o.geometry))
    const disposeSpies = [...geometries].map((g) => vi.spyOn(g, 'dispose'))

    mounted.splice(0)
    wrapper.unmount()

    expect(rafQueue.size).toBe(0)
    expect(renderer.instances[0].dispose).toHaveBeenCalled()
    disposeSpies.forEach((spy) => expect(spy).toHaveBeenCalled())
    expect(intersectionObservers[0].disconnected).toBe(true)
  })
})
