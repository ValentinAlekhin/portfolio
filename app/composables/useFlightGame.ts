import type { Ref } from 'vue'

export type FlightGameStatus = 'idle' | 'running' | 'terminated'

interface FlightGameOptions {
  motionAllowed: Readonly<Ref<boolean>>
}

interface Body {
  x: number
  y: number
  width: number
  height: number
}

interface Enemy extends Body {
  kind: 'drone' | 'interceptor'
  phase: number
  speed: number
}

interface Obstacle extends Body {
  speed: number
}

interface Bullet extends Body {
  speed: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
}

const PLAYER_WIDTH = 36
const PLAYER_HEIGHT = 46
const MAX_FRAME_DELTA = 0.034
const SCORE_LIMIT = 999999

export function useFlightGame(options: FlightGameOptions) {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const status = ref<FlightGameStatus>('idle')
  const score = ref(0)
  const elapsed = ref(0)

  let context: CanvasRenderingContext2D | null = null
  let animationFrame: number | undefined
  let resizeObserver: ResizeObserver | undefined
  let intersectionObserver: IntersectionObserver | undefined
  let themeObserver: MutationObserver | undefined
  let lastFrameTime = 0
  let spawnClock = 0
  let obstacleClock = 0
  let fireClock = 0
  let backgroundOffset = 0
  let isIntersecting = true
  let documentVisible = true
  let activePointer: number | undefined
  let pointerTarget: number | undefined

  const viewport = { width: 960, height: 540, dpr: 1 }
  const player = { x: 480, y: 440, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
  const pressedKeys = new Set<'left' | 'right'>()
  const enemies: Enemy[] = []
  const obstacles: Obstacle[] = []
  const bullets: Bullet[] = []
  const particles: Particle[] = []
  const stars: Star[] = []
  const palette = {
    background: '#071007',
    surface: '#101b0f',
    grid: '#244025',
    accent: '#a8ff60',
    text: '#f0f2ea',
    muted: '#7e9278',
    danger: '#ff8d82',
    enemy: '#d5b767',
  }

  const formattedScore = computed(() => String(score.value).padStart(6, '0'))
  const formattedTime = computed(() => String(Math.floor(elapsed.value)).padStart(2, '0'))

  function refreshPalette() {
    if (!canvas.value) return
    const styles = getComputedStyle(canvas.value)
    palette.accent = styles.getPropertyValue('--color-phosphor').trim() || '#a8ff60'
    palette.danger = styles.getPropertyValue('--color-danger').trim() || '#ff8d82'
  }

  function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min)
  }

  function seedStars() {
    stars.length = 0
    const count = Math.max(32, Math.round((viewport.width * viewport.height) / 11000))
    for (let index = 0; index < count; index += 1) {
      stars.push({
        x: Math.random() * viewport.width,
        y: Math.random() * viewport.height,
        size: randomBetween(0.6, 1.7),
        speed: randomBetween(18, 62),
      })
    }
  }

  function resizeCanvas() {
    if (!canvas.value) return
    const rect = canvas.value.getBoundingClientRect()
    const previousWidth = viewport.width
    viewport.width = Math.max(1, rect.width)
    viewport.height = Math.max(1, rect.height)
    viewport.dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.value.width = Math.round(viewport.width * viewport.dpr)
    canvas.value.height = Math.round(viewport.height * viewport.dpr)
    context = canvas.value.getContext('2d')
    context?.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0)

    if (previousWidth > 0) player.x = (player.x / previousWidth) * viewport.width
    player.x = Math.min(Math.max(player.width, player.x), viewport.width - player.width)
    player.y = viewport.height * 0.82
    seedStars()
    render(performance.now())
  }

  function resetGame() {
    score.value = 0
    elapsed.value = 0
    spawnClock = 0
    obstacleClock = -3.5
    fireClock = 0
    backgroundOffset = 0
    pointerTarget = undefined
    pressedKeys.clear()
    enemies.length = 0
    obstacles.length = 0
    bullets.length = 0
    particles.length = 0
    player.x = viewport.width / 2
    player.y = viewport.height * 0.82
    seedStars()
  }

  function start() {
    stopLoop()
    resetGame()
    status.value = 'running'
    lastFrameTime = performance.now()
    canvas.value?.focus({ preventScroll: true })
    render(lastFrameTime)
    syncLoop()
  }

  function terminate() {
    if (status.value !== 'running') return
    status.value = 'terminated'
    pressedKeys.clear()
    pointerTarget = undefined
    createBurst(player.x, player.y, 26)
  }

  function spawnEnemy(difficulty: number) {
    const size = randomBetween(26, 38)
    const margin = size + 10
    enemies.push({
      x: randomBetween(margin, Math.max(margin, viewport.width - margin)),
      y: -size,
      width: size,
      height: size * 1.15,
      kind: Math.random() > 0.48 ? 'drone' : 'interceptor',
      phase: Math.random() * Math.PI * 2,
      speed: randomBetween(92, 124) + difficulty * 105,
    })
  }

  function spawnObstacle(difficulty: number) {
    const width = randomBetween(44, Math.min(106, viewport.width * 0.24))
    obstacles.push({
      x: randomBetween(width / 2 + 8, Math.max(width / 2 + 8, viewport.width - width / 2 - 8)),
      y: -34,
      width,
      height: randomBetween(22, 36),
      speed: randomBetween(102, 132) + difficulty * 112,
    })
  }

  function shoot() {
    bullets.push({
      x: player.x,
      y: player.y - player.height * 0.52,
      width: 3,
      height: 14,
      speed: 420,
    })
  }

  function createBurst(x: number, y: number, amount = 10) {
    if (!options.motionAllowed.value) return
    for (let index = 0; index < amount; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const speed = randomBetween(45, 170)
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: randomBetween(0.28, 0.7),
        size: randomBetween(1, 3.5),
      })
    }
  }

  function intersects(first: Body, second: Body, inset = 0) {
    return Math.abs(first.x - second.x) * 2 < first.width + second.width - inset
      && Math.abs(first.y - second.y) * 2 < first.height + second.height - inset
  }

  function updatePlayer(delta: number) {
    const direction = Number(pressedKeys.has('right')) - Number(pressedKeys.has('left'))
    if (direction !== 0) {
      pointerTarget = undefined
      player.x += direction * Math.min(480, viewport.width * 0.95) * delta
    }
    else if (pointerTarget !== undefined) {
      const distance = pointerTarget - player.x
      player.x += distance * Math.min(1, delta * 13)
    }
    const edge = player.width * 0.62
    player.x = Math.min(Math.max(edge, player.x), viewport.width - edge)
  }

  function updateEntities(delta: number, difficulty: number) {
    for (const star of stars) {
      star.y += (star.speed + difficulty * 45) * delta
      if (star.y > viewport.height + 3) {
        star.y = -3
        star.x = Math.random() * viewport.width
      }
    }

    for (const bullet of bullets) bullet.y -= bullet.speed * delta
    for (const enemy of enemies) {
      enemy.y += enemy.speed * delta
      enemy.x += Math.sin(elapsed.value * 2.4 + enemy.phase) * 30 * delta
      enemy.x = Math.min(Math.max(enemy.width / 2, enemy.x), viewport.width - enemy.width / 2)
    }
    for (const obstacle of obstacles) obstacle.y += obstacle.speed * delta
    for (const particle of particles) {
      particle.x += particle.vx * delta
      particle.y += particle.vy * delta
      particle.life -= delta
    }

    for (let index = bullets.length - 1; index >= 0; index -= 1) {
      if (bullets[index]!.y < -20) bullets.splice(index, 1)
    }
    for (let index = enemies.length - 1; index >= 0; index -= 1) {
      if (enemies[index]!.y > viewport.height + 60) enemies.splice(index, 1)
    }
    for (let index = obstacles.length - 1; index >= 0; index -= 1) {
      if (obstacles[index]!.y > viewport.height + 60) obstacles.splice(index, 1)
    }
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      if (particles[index]!.life <= 0) particles.splice(index, 1)
    }
  }

  function resolveShots(difficulty: number) {
    for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
      const bullet = bullets[bulletIndex]!
      for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
        const enemy = enemies[enemyIndex]!
        if (!intersects(bullet, enemy, 4)) continue
        createBurst(enemy.x, enemy.y)
        bullets.splice(bulletIndex, 1)
        enemies.splice(enemyIndex, 1)
        score.value = Math.min(SCORE_LIMIT, score.value + 100 + Math.round(difficulty * 150))
        break
      }
    }
  }

  function resolvePlayerCollision() {
    const playerHitbox: Body = {
      x: player.x,
      y: player.y,
      width: player.width * 0.48,
      height: player.height * 0.62,
    }
    if (enemies.some(enemy => intersects(playerHitbox, enemy, 8))
      || obstacles.some(obstacle => intersects(playerHitbox, obstacle, 5))) {
      terminate()
    }
  }

  function update(delta: number) {
    elapsed.value += delta
    const difficulty = Math.min(1, elapsed.value / 68)
    backgroundOffset = (backgroundOffset + (92 + difficulty * 120) * delta) % 52
    spawnClock += delta
    obstacleClock += delta
    fireClock += delta

    const enemyInterval = 0.98 - difficulty * 0.5
    const obstacleInterval = 2.55 - difficulty * 1.18
    if (spawnClock >= enemyInterval) {
      spawnClock = -Math.random() * 0.22
      spawnEnemy(difficulty)
    }
    if (obstacleClock >= obstacleInterval) {
      obstacleClock = -Math.random() * 0.45
      spawnObstacle(difficulty)
    }
    if (fireClock >= 0.19) {
      fireClock = 0
      shoot()
    }

    updatePlayer(delta)
    updateEntities(delta, difficulty)
    resolveShots(difficulty)
    resolvePlayerCollision()
  }

  function drawBackground(ctx: CanvasRenderingContext2D) {
    const { width, height } = viewport
    const horizon = height * 0.16
    ctx.fillStyle = palette.background
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.strokeStyle = palette.grid
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.58
    for (let lane = -8; lane <= 8; lane += 1) {
      ctx.beginPath()
      ctx.moveTo(width / 2 + lane * 8, horizon)
      ctx.lineTo(width / 2 + lane * Math.max(52, width / 11), height)
      ctx.stroke()
    }
    for (let line = -1; line < Math.ceil((height - horizon) / 52) + 2; line += 1) {
      const y = horizon + ((line * 52 + backgroundOffset) % (height - horizon + 52))
      const depth = Math.max(0, (y - horizon) / (height - horizon))
      ctx.globalAlpha = 0.14 + depth * 0.42
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.restore()

    ctx.fillStyle = palette.muted
    for (const star of stars) {
      ctx.globalAlpha = 0.32 + star.size * 0.18
      ctx.fillRect(star.x, star.y, star.size, star.size * 2.2)
    }
    ctx.globalAlpha = 1
  }

  function drawBullets(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.fillStyle = palette.accent
    ctx.shadowBlur = options.motionAllowed.value ? 10 : 0
    ctx.shadowColor = palette.accent
    for (const bullet of bullets) {
      ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height)
    }
    ctx.restore()
  }

  function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    ctx.save()
    ctx.translate(enemy.x, enemy.y)
    ctx.strokeStyle = palette.enemy
    ctx.fillStyle = palette.surface
    ctx.lineWidth = 2
    ctx.shadowBlur = options.motionAllowed.value ? 7 : 0
    ctx.shadowColor = palette.enemy
    ctx.beginPath()
    if (enemy.kind === 'drone') {
      ctx.moveTo(0, enemy.height / 2)
      ctx.lineTo(-enemy.width / 2, -enemy.height * 0.1)
      ctx.lineTo(-enemy.width * 0.22, -enemy.height / 2)
      ctx.lineTo(0, -enemy.height * 0.28)
      ctx.lineTo(enemy.width * 0.22, -enemy.height / 2)
      ctx.lineTo(enemy.width / 2, -enemy.height * 0.1)
    }
    else {
      ctx.moveTo(0, enemy.height / 2)
      ctx.lineTo(-enemy.width / 2, 0)
      ctx.lineTo(0, -enemy.height / 2)
      ctx.lineTo(enemy.width / 2, 0)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = palette.danger
    ctx.fillRect(-2, -2, 4, 7)
    ctx.restore()
  }

  function drawObstacles(ctx: CanvasRenderingContext2D) {
    ctx.save()
    for (const obstacle of obstacles) {
      const left = obstacle.x - obstacle.width / 2
      const top = obstacle.y - obstacle.height / 2
      ctx.fillStyle = palette.surface
      ctx.strokeStyle = palette.danger
      ctx.lineWidth = 1.5
      ctx.fillRect(left, top, obstacle.width, obstacle.height)
      ctx.save()
      ctx.beginPath()
      ctx.rect(left, top, obstacle.width, obstacle.height)
      ctx.clip()
      ctx.beginPath()
      for (let offset = -obstacle.height; offset < obstacle.width; offset += 13) {
        ctx.moveTo(left + offset, top + obstacle.height)
        ctx.lineTo(left + offset + obstacle.height, top)
      }
      ctx.globalAlpha = 0.65
      ctx.stroke()
      ctx.restore()
      ctx.strokeRect(left, top, obstacle.width, obstacle.height)
    }
    ctx.restore()
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save()
    ctx.translate(player.x, player.y)
    ctx.strokeStyle = palette.accent
    ctx.fillStyle = palette.surface
    ctx.lineWidth = 2
    ctx.shadowBlur = options.motionAllowed.value ? 12 : 0
    ctx.shadowColor = palette.accent
    ctx.beginPath()
    ctx.moveTo(0, -player.height / 2)
    ctx.lineTo(7, -5)
    ctx.lineTo(player.width / 2, 9)
    ctx.lineTo(8, 12)
    ctx.lineTo(6, player.height / 2)
    ctx.lineTo(0, 16)
    ctx.lineTo(-6, player.height / 2)
    ctx.lineTo(-8, 12)
    ctx.lineTo(-player.width / 2, 9)
    ctx.lineTo(-7, -5)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -15)
    ctx.lineTo(0, 14)
    ctx.stroke()

    const flame = options.motionAllowed.value ? 6 + Math.sin(time / 45) * 3 : 7
    ctx.fillStyle = palette.accent
    ctx.beginPath()
    ctx.moveTo(-4, 19)
    ctx.lineTo(0, 19 + flame)
    ctx.lineTo(4, 19)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  function drawParticles(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.fillStyle = palette.accent
    for (const particle of particles) {
      ctx.globalAlpha = Math.max(0, particle.life * 1.6)
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
    }
    ctx.restore()
  }

  function drawIdleSignal(ctx: CanvasRenderingContext2D, time: number) {
    if (status.value === 'running') return
    const pulse = options.motionAllowed.value ? 0.35 + Math.sin(time / 500) * 0.1 : 0.32
    ctx.save()
    ctx.globalAlpha = pulse
    ctx.strokeStyle = status.value === 'terminated' ? palette.danger : palette.accent
    ctx.setLineDash([5, 8])
    ctx.strokeRect(viewport.width * 0.28, viewport.height * 0.36, viewport.width * 0.44, viewport.height * 0.28)
    ctx.restore()
  }

  function render(time: number) {
    if (!context) return
    context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0)
    context.clearRect(0, 0, viewport.width, viewport.height)
    drawBackground(context)
    drawObstacles(context)
    for (const enemy of enemies) drawEnemy(context, enemy)
    drawBullets(context)
    drawPlayer(context, time)
    drawParticles(context)
    drawIdleSignal(context, time)
  }

  function frame(time: number) {
    animationFrame = undefined
    if (status.value !== 'running') return
    const delta = Math.min(MAX_FRAME_DELTA, Math.max(0, (time - lastFrameTime) / 1000))
    lastFrameTime = time
    update(delta)
    render(time)
    if (status.value === 'running') animationFrame = requestAnimationFrame(frame)
  }

  function stopLoop() {
    if (animationFrame === undefined) return
    cancelAnimationFrame(animationFrame)
    animationFrame = undefined
  }

  function syncLoop() {
    if (status.value !== 'running' || !isIntersecting || !documentVisible) {
      stopLoop()
      return
    }
    if (animationFrame !== undefined) return
    lastFrameTime = performance.now()
    animationFrame = requestAnimationFrame(frame)
  }

  function controlFromKey(key: string) {
    const normalized = key.toLowerCase()
    if (normalized === 'arrowleft' || normalized === 'a' || normalized === 'ф') return 'left' as const
    if (normalized === 'arrowright' || normalized === 'd' || normalized === 'в') return 'right' as const
  }

  function onKeyDown(event: KeyboardEvent) {
    if (status.value !== 'running') return
    const control = controlFromKey(event.key)
    if (!control) return
    event.preventDefault()
    pressedKeys.add(control)
  }

  function onKeyUp(event: KeyboardEvent) {
    const control = controlFromKey(event.key)
    if (!control) return
    pressedKeys.delete(control)
  }

  function pointerX(event: PointerEvent) {
    const rect = canvas.value?.getBoundingClientRect()
    if (!rect) return
    pointerTarget = Math.min(Math.max(0, event.clientX - rect.left), rect.width)
  }

  function onPointerDown(event: PointerEvent) {
    if (status.value !== 'running' || !canvas.value) return
    activePointer = event.pointerId
    canvas.value.setPointerCapture(event.pointerId)
    pointerX(event)
  }

  function onPointerMove(event: PointerEvent) {
    if (status.value !== 'running' || event.pointerId !== activePointer) return
    pointerX(event)
  }

  function onPointerUp(event: PointerEvent) {
    if (event.pointerId !== activePointer) return
    if (canvas.value?.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId)
    activePointer = undefined
  }

  function onVisibilityChange() {
    documentVisible = document.visibilityState === 'visible'
    syncLoop()
  }

  onMounted(() => {
    if (!canvas.value) return
    refreshPalette()
    resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas.value)
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? true
      syncLoop()
    }, { threshold: 0.05 })
    intersectionObserver.observe(canvas.value)
    themeObserver = new MutationObserver(() => {
      refreshPalette()
      render(performance.now())
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('keydown', onKeyDown, { passive: false })
    window.addEventListener('keyup', onKeyUp)
    document.addEventListener('visibilitychange', onVisibilityChange)
    resizeCanvas()
  })

  onBeforeUnmount(() => {
    stopLoop()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    themeObserver?.disconnect()
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    canvas,
    status: readonly(status),
    score: readonly(score),
    elapsed: readonly(elapsed),
    formattedScore,
    formattedTime,
    start,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
