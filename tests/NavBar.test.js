import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import NavBar from '../src/components/NavBar.vue'
import { intersectionObservers } from './setup'

const SECTION_IDS = ['projects', 'history', 'skills', 'contact']
const mounted = []

const mountNav = () => {
  // 建立導覽列要觀察的區塊
  SECTION_IDS.forEach((id) => {
    const el = document.createElement('section')
    el.id = id
    document.body.appendChild(el)
  })
  const wrapper = mount(NavBar, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

const setScrollY = (y) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  setScrollY(0)
  document.body.innerHTML = ''
})

describe('NavBar', () => {
  it('提供各區塊錨點與 GitHub 連結', () => {
    const wrapper = mountNav()
    const desktopLinks = wrapper.findAll('nav ul a').map((a) => a.attributes('href'))
    expect(desktopLinks).toEqual([...SECTION_IDS.map((id) => `#${id}`), 'https://github.com/cactus1998'])
  })

  it('捲動後才加上背景', async () => {
    const wrapper = mountNav()
    expect(wrapper.find('header').classes()).toContain('bg-transparent')

    setScrollY(200)
    await nextTick()
    expect(wrapper.find('header').classes()).not.toContain('bg-transparent')
  })

  it('目前所在區塊的連結會標示為 active', async () => {
    const wrapper = mountNav()
    const observer = intersectionObservers[0]
    expect(observer.elements.size).toBe(SECTION_IDS.length)

    observer.trigger(true, [document.getElementById('skills')])
    await nextTick()
    const active = wrapper.findAll('nav ul a[aria-current="true"]')
    expect(active).toHaveLength(1)
    expect(active[0].attributes('href')).toBe('#skills')

    observer.trigger(false, [document.getElementById('skills')])
    await nextTick()
    expect(wrapper.findAll('nav ul a[aria-current="true"]')).toHaveLength(0)
  })

  it('手機選單可開關，點選項目後自動收起', async () => {
    const wrapper = mountNav()
    const toggle = wrapper.find('button[aria-controls="mobile-menu"]')
    const menu = () => wrapper.find('#mobile-menu')

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(menu().isVisible()).toBe(false)

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(menu().isVisible()).toBe(true)

    await menu().find('a[href="#history"]').trigger('click')
    expect(menu().isVisible()).toBe(false)
  })

  it('卸載時移除 scroll 監聽並中斷 observer', () => {
    const wrapper = mountNav()
    mounted.splice(0)
    wrapper.unmount()
    expect(intersectionObservers[0].disconnected).toBe(true)
  })
})
