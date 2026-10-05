<!-- components/HeroBackground.vue -->
<!-- 首頁背景：極光色塊 + 格線 + 粒子連線網路（滑鼠靠近會連線） -->
<template>
  <div ref="rootRef" class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <!-- 底色 -->
    <div class="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/70 to-white"></div>

    <!-- 極光色塊：緩慢飄移 -->
    <div class="aurora absolute -top-48 -left-40 w-[38rem] h-[38rem] rounded-full bg-indigo-300/40 blur-3xl"></div>
    <div class="aurora aurora--2 absolute top-1/4 -right-48 w-[34rem] h-[34rem] rounded-full bg-violet-300/35 blur-3xl"></div>
    <div class="aurora aurora--3 absolute -bottom-56 left-1/4 w-[32rem] h-[32rem] rounded-full bg-sky-200/50 blur-3xl"></div>

    <!-- 格線：中央清楚、邊緣淡出 -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]"
    ></div>

    <!-- 粒子網路 -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- 底部淡出，銜接下一個區塊 -->
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-gray-50"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { prefersReducedMotion } from '../utils/motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

// === 參數 ===
const AREA_PER_PARTICLE = 14000 // 每多少平方像素放一顆粒子
const MIN_PARTICLES = 30
const MAX_PARTICLES = 90
const LINK_DISTANCE = 130       // 粒子間連線的最大距離
const MOUSE_DISTANCE = 180      // 滑鼠與粒子連線的最大距離
const SPEED = 0.012             // 移動速度（px / ms）
const MAX_FRAME_MS = 50         // 單幀最大時間，避免切回分頁時一次移動太遠
const DOT_COLOR = 'rgba(79, 70, 229, 0.55)'
const LINE_RGB = '99, 102, 241'

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let width = 0
let height = 0
let dpr = 1
let animationId: number | null = null
let lastTime = 0
let host: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null
let reducedMotion = false

const mouse = { x: 0, y: 0, active: false }

// ========== 粒子 ==========
const createParticles = () => {
  const count = Math.round(
    Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, (width * height) / AREA_PER_PARTICLE))
  )
  particles = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = SPEED * (0.4 + Math.random() * 0.6)
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.2 + Math.random() * 1.3
    }
  })
}

const moveParticles = (elapsed: number) => {
  for (const p of particles) {
    p.x += p.vx * elapsed
    p.y += p.vy * elapsed
    // 碰到邊界反彈
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
    p.x = Math.min(width, Math.max(0, p.x))
    p.y = Math.min(height, Math.max(0, p.y))
  }
}

// 越接近畫面中央（文字所在位置）越淡，避免干擾閱讀
const centerFade = (x: number, y: number) => {
  const dx = (x - width / 2) / (width * 0.32)
  const dy = (y - height / 2) / (height * 0.36)
  return Math.min(1, Math.max(0.15, Math.sqrt(dx * dx + dy * dy)))
}

// ========== 繪製 ==========
const draw = () => {
  if (!ctx) return
  const context = ctx
  context.clearRect(0, 0, width, height)
  context.lineWidth = 1

  // 粒子之間的連線
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > LINK_DISTANCE) continue
      const alpha = (1 - distance / LINK_DISTANCE) * 0.35 * centerFade((a.x + b.x) / 2, (a.y + b.y) / 2)
      context.strokeStyle = `rgba(${LINE_RGB}, ${alpha})`
      context.beginPath()
      context.moveTo(a.x, a.y)
      context.lineTo(b.x, b.y)
      context.stroke()
    }
  }

  // 滑鼠與附近粒子的連線
  if (mouse.active) {
    for (const p of particles) {
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > MOUSE_DISTANCE) continue
      context.strokeStyle = `rgba(${LINE_RGB}, ${(1 - distance / MOUSE_DISTANCE) * 0.5})`
      context.beginPath()
      context.moveTo(mouse.x, mouse.y)
      context.lineTo(p.x, p.y)
      context.stroke()
    }
  }

  // 粒子本身
  context.fillStyle = DOT_COLOR
  for (const p of particles) {
    context.globalAlpha = centerFade(p.x, p.y)
    context.beginPath()
    context.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1
}

// ========== 動畫循環 ==========
const animate = (now: number) => {
  animationId = requestAnimationFrame(animate)
  const elapsed = Math.min(now - lastTime, MAX_FRAME_MS)
  lastTime = now
  moveParticles(elapsed)
  draw()
}

const start = () => {
  if (reducedMotion || animationId) return
  lastTime = performance.now()
  animationId = requestAnimationFrame(animate)
}

const stop = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// ========== 尺寸 ==========
const resize = () => {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = canvas.offsetWidth
  height = canvas.offsetHeight
  // 依像素比放大實際解析度，高 DPI 螢幕才不會模糊
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  createParticles()
  // 減少動態效果時只畫一張靜態畫面
  if (reducedMotion) draw()
}

// ========== 滑鼠 ==========
const handleMouseMove = (e: MouseEvent) => {
  if (!host) return
  const rect = host.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
  mouse.active = true
}

const handleMouseLeave = () => {
  mouse.active = false
}

// ========== Vue 生命週期 ==========
onMounted(() => {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context) return
  ctx = context
  reducedMotion = prefersReducedMotion()

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  if (reducedMotion) return

  // 背景本身不接收滑鼠事件，改由外層區塊監聽
  host = rootRef.value?.parentElement ?? null
  host?.addEventListener('mousemove', handleMouseMove)
  host?.addEventListener('mouseleave', handleMouseLeave)

  // 首頁不在畫面上時暫停動畫，節省效能
  visibilityObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start()
    else stop()
  })
  if (rootRef.value) visibilityObserver.observe(rootRef.value)

  start()
})

onUnmounted(() => {
  stop()
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  host?.removeEventListener('mousemove', handleMouseMove)
  host?.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style scoped>
/* 極光色塊緩慢飄移（系統減少動態效果時由全域樣式關閉） */
.aurora {
  animation: aurora-drift 18s ease-in-out infinite alternate;
}
.aurora--2 {
  animation-duration: 22s;
  animation-delay: -6s;
}
.aurora--3 {
  animation-duration: 26s;
  animation-delay: -12s;
}

@keyframes aurora-drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(4%, 6%, 0) scale(1.08);
  }
  100% {
    transform: translate3d(-5%, 2%, 0) scale(0.95);
  }
}
</style>
