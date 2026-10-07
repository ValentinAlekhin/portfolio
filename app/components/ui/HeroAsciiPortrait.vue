<script setup lang="ts">
import asciiArt from '~/assets/asciiart.txt?raw'

const host = useTemplateRef<HTMLElement>('host')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const { state, nod } = useAsciiPortrait(host, canvas)

defineExpose({ nod })
</script>

<template>
  <div
    ref="host"
    class="hero__ascii ascii-portrait"
    :data-state="state"
    aria-hidden="true"
  >
    <pre
      v-show="state === 'fallback'"
      class="ascii-portrait__fallback"
    >{{ asciiArt }}</pre>
    <canvas
      v-show="state === 'assembling' || state === 'ready'"
      ref="canvas"
      class="ascii-portrait__canvas"
    />
  </div>
</template>

<style scoped lang="scss">
// Scale the original 288px text fallback to the 384px desktop portrait window.
$fallback-font-size: calc(1.15px * 4 / 3);

.ascii-portrait { position: relative; width: 100%; aspect-ratio: 3 / 4; color: var(--color-text); user-select: none; pointer-events: none; }
.ascii-portrait__fallback { position: absolute; inset: 0; overflow: hidden; margin: 0; font-family: var(--font-mono); font-size: $fallback-font-size; font-weight: 700; line-height: 1; white-space: pre; }
.ascii-portrait__canvas { display: block; width: 100%; height: 100%; }
</style>
