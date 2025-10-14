<!-- components/HeroSection.vue -->
<template>
  <section class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-50 to-blue-300 relative overflow-hidden p-4">
    <!-- Canvas 雪花背景 -->
    <canvas ref="snowCanvas" class="absolute inset-0 w-full h-full"></canvas>
    
    <!-- 內容 -->
    <div class="max-w-4xl text-center px-6 relative z-10">
      <div class="mb-8">
        <div ref="avatarRef" class="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 opacity-0 scale-0"></div>
      </div>
      
      <h1 ref="titleRef" class="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
        <span ref="titleTextRef"></span><span ref="titleSpanRef" class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"></span>
      </h1>
      
      <p ref="descRef" class="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"></p>
      
      <div ref="buttonsRef" class="flex flex-col sm:flex-row gap-4 justify-center opacity-0">
        <a href="#projects" class="w-full sm:w-auto px-8 py-3 border-2 bg-black text-white rounded-full hover:bg-transparent hover:text-black hover:border-black hover:border-2 transition duration-300">
          查看作品
        </a>
        <a href="#skills" class="w-full sm:w-auto px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300">
          技能介紹
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// 註冊 GSAP TextPlugin
gsap.registerPlugin(TextPlugin)

// Canvas 相關 refs
const snowCanvas = ref(null)
let ctx = null
let snowflakes = []
let animationId = null
let mouseX = -9999
let mouseY = -9999
let resizeObserver = null
let targetSnowflakeCount = 120
let currentSnowflakeCount = 0
let snowflakeSpawnRate = 1

// GSAP 文字動畫 refs
const titleTextRef = ref(null)
const titleSpanRef = ref(null)
const descRef = ref(null)
const buttonsRef = ref(null)
const avatarRef = ref(null)

// ========== 雪花類別 ==========
class Snowflake {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * -100
    this.radius = Math.random() * 4 + 2
    this.speed = Math.random() * 1 + 0.5
    this.wind = Math.random() * 0.5 - 0.25
    this.opacity = Math.random() * 0.6 + 0.4
  }
  
  update() {
    this.y += this.speed
    this.x += this.wind
    
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 120 && distance > 0) {
      const force = (120 - distance) / 120
      this.x += dx * force * 0.03
      this.y += dy * force * 0.03
    }
    
    if (this.y > this.canvas.height + 10) {
      this.reset()
    }
    
    if (this.x > this.canvas.width + 10) {
      this.x = -10
    } else if (this.x < -10) {
      this.x = this.canvas.width + 10
    }
  }
  
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

// ========== 初始化雪花系統 ==========
const initSnow = () => {
  const canvas = snowCanvas.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  
  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    if (snowflakes.length > 0) {
      snowflakes.forEach(snowflake => {
        snowflake.canvas = canvas
      })
    }
  }
  resize()
  
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  
  snowflakes = []
  currentSnowflakeCount = 0
  
  const section = canvas.parentElement
  
  const handleMouseMove = (e) => {
    const rect = section.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
  
  const handleMouseLeave = () => {
    mouseX = -9999
    mouseY = -9999
  }
  
  section.addEventListener('mousemove', handleMouseMove)
  section.addEventListener('mouseleave', handleMouseLeave)
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (currentSnowflakeCount < targetSnowflakeCount) {
      const toAdd = Math.min(
        snowflakeSpawnRate, 
        targetSnowflakeCount - currentSnowflakeCount
      )
      
      for (let i = 0; i < toAdd; i++) {
        snowflakes.push(new Snowflake(canvas))
        currentSnowflakeCount++
      }
    }
    
    snowflakes.forEach(snowflake => {
      snowflake.update()
      snowflake.draw(ctx)
    })
    
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

// ========== GSAP 文字動畫 ==========
const initTextAnimation = () => {
  // 創建時間軸，讓動畫依序執行
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' }
  })
  
  // 0. 頭像圓形：從小到大彈出
  tl.to(avatarRef.value, {
    duration: 0.8,
    opacity: 1,
    scale: 1,
    ease: 'back.out(1.7)',
  })
  
  // 1. 標題第一部分：「Hello, 我是 」
  .to(titleTextRef.value, {
    duration: 1,
    text: 'Hello, 我是 ',
    ease: 'none',
  }, '-=0.3') // 在頭像動畫快結束時開始
  
  // 2. 標題第二部分（漸變文字）：「邦晉」- 同時開始
  .to(titleSpanRef.value, {
    duration: 0.5,
    text: '邦晉',
    ease: 'none',
  }, '-=0.3') // '<' 表示與上一個動畫同時開始
  
  // 3. 描述段落（分兩行）
  .to(descRef.value, {
    duration: 2,
    text: '熱愛創造優雅的網頁體驗，專注於前端開發與使用者介面設計。\n用程式碼實現創意，讓每個專案都充滿生命力。',
    ease: 'none',
  }, '-=0.3')
  
  // 4. 按鈕淡入
  .to(buttonsRef.value, {
    duration: 0.6,
    opacity: 1,
    y: 0,
    ease: 'back.out(1.7)',
  }, '-=0.5')
}

// ========== Vue 生命週期 ==========
onMounted(() => {
  initSnow()
  
  // 延遲一點點開始文字動畫，讓雪花先出現
  setTimeout(() => {
    initTextAnimation()
  }, 300)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  
  // 清理 GSAP 動畫
  gsap.killTweensOf([avatarRef.value, titleTextRef.value, titleSpanRef.value, descRef.value, buttonsRef.value])
})
</script>

<style scoped>
/* 保持描述文字的換行 */
p {
  white-space: pre-line;
}
</style>