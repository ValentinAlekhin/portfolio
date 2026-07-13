<script setup lang="ts">
const map = ref<HTMLElement | null>(null)
const { motionAllowed } = useMotionPreference()

function onPointerMove(event: PointerEvent) {
  if (!map.value || !motionAllowed.value) return
  const rect = map.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
  map.value.style.setProperty('--map-x', Math.max(-1, Math.min(1, x)).toFixed(3))
  map.value.style.setProperty('--map-y', Math.max(-1, Math.min(1, y)).toFixed(3))
}
</script>

<template>
  <div
    ref="map"
    class="system-map"
    aria-hidden="true"
    @pointermove="onPointerMove"
    @pointerleave="map?.style.setProperty('--map-x', '0'); map?.style.setProperty('--map-y', '0')"
  >
    <div class="system-map__head system-label">
      <span>SYSTEM MAP / 01</span>
      <span>ONLINE</span>
    </div>
    <svg
      viewBox="0 0 620 540"
      focusable="false"
    >
      <defs>
        <filter id="signal-glow">
          <feGaussianBlur
            stdDeviation="5"
            result="blur"
          />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g class="map-grid">
        <path d="M0 90H620M0 180H620M0 270H620M0 360H620M0 450H620" />
        <path d="M103 0V540M206 0V540M309 0V540M412 0V540M515 0V540" />
      </g>
      <g class="map-lines">
        <path d="M84 108H248V215H380V330H540" />
        <path d="M248 215V410H380" />
      </g>
      <path
        class="map-signal"
        d="M84 108H248V215H380V330H540"
      />
      <g
        class="map-node map-node--1"
        transform="translate(84 108)"
      >
        <circle r="24" /><circle r="5" /><text
          x="-22"
          y="-38"
        >IDEA</text>
      </g>
      <g
        class="map-node map-node--2"
        transform="translate(248 215)"
      >
        <circle r="31" /><circle r="5" /><text
          x="-12"
          y="-45"
        >UI</text>
      </g>
      <g
        class="map-node map-node--3"
        transform="translate(380 330)"
      >
        <circle r="25" /><circle r="5" /><text
          x="-15"
          y="-39"
        >API</text>
      </g>
      <g
        class="map-node map-node--4"
        transform="translate(380 410)"
      >
        <circle r="20" /><circle r="5" /><text
          x="-22"
          y="38"
        >DATA</text>
      </g>
      <g
        class="map-node map-node--5"
        transform="translate(540 330)"
      >
        <circle r="38" /><circle r="6" /><text
          x="-34"
          y="-52"
        >DEPLOY</text>
      </g>
    </svg>
    <div class="system-map__foot system-label">
      <span>IDEA → LAUNCH</span>
      <span>05 NODES</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-map {
  --map-x: 0;
  --map-y: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
}

.system-map::after {
  position: absolute;
  background: radial-gradient(circle at calc(50% + var(--map-x) * 25%) calc(50% + var(--map-y) * 25%), color-mix(in srgb, var(--color-phosphor) 14%, transparent), transparent 40%);
  content: '';
  inset: 0;
  pointer-events: none;
}

.system-map__head,
.system-map__foot {
  position: absolute;
  z-index: 2;
  right: 1rem;
  left: 1rem;
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: 0.6rem;
}

.system-map__head { top: 1rem; }
.system-map__foot { bottom: 1rem; }
.system-map svg { width: 100%; }

.map-grid path {
  fill: none;
  opacity: 0.28;
  stroke: var(--color-line);
  stroke-width: 1;
}

.map-lines path,
.map-signal {
  fill: none;
  stroke: var(--color-control-border);
  stroke-width: 1.5;
}

.map-signal {
  filter: url('#signal-glow');
  stroke: var(--color-phosphor);
  stroke-dasharray: 10 620;
  stroke-linecap: round;
  animation: signal 3.2s var(--ease-in-out) 900ms both;
}

.map-node {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
  transition: transform 420ms var(--ease-out);
}

.map-node circle:first-child { fill: var(--color-surface); stroke: var(--color-control-border); }
.map-node circle:nth-child(2) { fill: var(--color-accent); }
.map-node text { fill: currentcolor; letter-spacing: 0.08em; }
.map-node--1 { translate: calc(var(--map-x) * -4px) calc(var(--map-y) * -4px); }
.map-node--2 { translate: calc(var(--map-x) * 6px) calc(var(--map-y) * 6px); }
.map-node--3 { translate: calc(var(--map-x) * -5px) calc(var(--map-y) * 5px); }
.map-node--4 { translate: calc(var(--map-x) * 3px) calc(var(--map-y) * -3px); }
.map-node--5 { translate: calc(var(--map-x) * 8px) calc(var(--map-y) * -8px); }

@keyframes signal { from { stroke-dashoffset: 640; } to { stroke-dashoffset: 0; } }

@media (max-width: 767px) {
  .map-node { translate: 0 0; }
}
</style>
