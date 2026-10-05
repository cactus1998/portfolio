import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BackToTop from '../src/components/BackToTop.vue'

const setScrollY = (y) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => setScrollY(0))

describe('BackToTop', () => {
  it('捲動超過一個畫面高度才顯示，並連到頁首', async () => {
    const wrapper = mount(BackToTop)
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('#top')
    expect(link.classes()).toContain('opacity-0')
    expect(link.attributes('tabindex')).toBe('-1')

    setScrollY(window.innerHeight + 1)
    await nextTick()
    expect(link.classes()).toContain('opacity-100')
    expect(link.attributes('tabindex')).toBeUndefined()

    setScrollY(0)
    await nextTick()
    expect(link.classes()).toContain('opacity-0')
    wrapper.unmount()
  })
})
