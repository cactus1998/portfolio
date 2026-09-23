// 測試環境共用設定：補上 jsdom 沒有實作的瀏覽器 API
import { afterEach, vi } from 'vitest'

// === IntersectionObserver ===
// 記錄所有建立的 observer，測試中可手動觸發進出畫面
export const intersectionObservers = []

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.elements = new Set()
    this.disconnected = false
    intersectionObservers.push(this)
  }
  observe(el) { this.elements.add(el) }
  unobserve(el) { this.elements.delete(el) }
  disconnect() { this.disconnected = true; this.elements.clear() }
  // 測試用：模擬元素進出畫面
  trigger(isIntersecting, targets = [...this.elements]) {
    this.callback(targets.map((target) => ({ target, isIntersecting })), this)
  }
}
globalThis.IntersectionObserver = MockIntersectionObserver

// === ResizeObserver ===
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// === requestAnimationFrame ===
// 改為手動執行，測試可精準控制每一幀的時間
export const rafQueue = new Map()
let rafId = 0
globalThis.requestAnimationFrame = vi.fn((cb) => {
  rafQueue.set(++rafId, cb)
  return rafId
})
globalThis.cancelAnimationFrame = vi.fn((id) => {
  rafQueue.delete(id)
})

/** 執行目前排隊中的所有 rAF callback（模擬一幀） */
export const flushFrame = (time = performance.now()) => {
  const callbacks = [...rafQueue.values()]
  rafQueue.clear()
  callbacks.forEach((cb) => cb(time))
}

// === Canvas 2D context ===
// jsdom 沒有實作 canvas，回傳一個只記錄呼叫的假 context
const createMockContext = () => ({
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  setTransform: vi.fn(),
  scale: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn()
})
HTMLCanvasElement.prototype.getContext = vi.fn(function () {
  this.__ctx ??= createMockContext()
  return this.__ctx
})

afterEach(() => {
  intersectionObservers.length = 0
  rafQueue.clear()
  delete window.__appLoaded
})
