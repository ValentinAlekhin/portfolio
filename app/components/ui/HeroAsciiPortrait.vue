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

// Place the circular fade above the torso, keeping the face and shoulders opaque.
$torso-fade-center-y: 25%;
// Radii relative to the farthest canvas corner; their gap controls the soft edge.
$torso-fade-start: 60%;
$torso-fade-end: 74%;

.ascii-portrait {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  color: var(--color-text);
  user-select: none;
  pointer-events: none;
  mask-image: radial-gradient(circle farthest-corner at 50% $torso-fade-center-y, #000 $torso-fade-start, transparent $torso-fade-end);
}
.ascii-portrait__fallback { position: absolute; inset: 0; overflow: hidden; margin: 0; font-family: var(--font-mono); font-size: $fallback-font-size; font-weight: 700; line-height: 1; white-space: pre; }
.ascii-portrait__canvas { display: block; width: 100%; height: 100%; }
</style>
