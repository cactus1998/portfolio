import { describe, it, expect } from 'vitest'
import { whenAppLoaded } from '../src/utils/appLoaded'

describe('whenAppLoaded', () => {
  it('頁面已載入時立即 resolve', async () => {
    window.__appLoaded = true
    await expect(whenAppLoaded()).resolves.toBeUndefined()
  })

  it('尚未載入時，等到 app-loaded 事件才 resolve', async () => {
    let resolved = false
    const promise = whenAppLoaded().then(() => { resolved = true })

    await Promise.resolve()
    expect(resolved).toBe(false)

    window.dispatchEvent(new Event('app-loaded'))
    await promise
    expect(resolved).toBe(true)
  })
})
