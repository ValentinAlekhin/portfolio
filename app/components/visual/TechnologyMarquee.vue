<script setup lang="ts">
const technologies = [
  'Vue',
  'Nuxt',
  'TypeScript',
  'Node.js',
  'Go',
  'PostgreSQL',
  'Redis',
  'Docker',
  'REST API',
  'WebSocket',
  'SVG',
  'Git',
] as const
</script>

<template>
  <section
    class="technology-marquee"
    aria-label="Development technologies"
    tabindex="0"
  >
    <p class="technology-marquee__prompt system-label">
      <span>$</span> stack --watch
    </p>
    <div class="technology-marquee__viewport">
      <div
        class="technology-marquee__track"
        aria-hidden="true"
      >
        <div
          v-for="copy in 2"
          :key="copy"
          class="technology-marquee__group"
        >
          <span
            v-for="technology in technologies"
            :key="technology"
            class="technology-marquee__item"
          >
            <i>+</i> '{{ technology }}'<b>/</b>
          </span>
        </div>
      </div>
    </div>
    <ul class="sr-only">
      <li
        v-for="technology in technologies"
        :key="technology"
      >
        {{ technology }}
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.technology-marquee {
  --marquee-fill: #a8ff60;
  --marquee-ink: #071007;
  position: relative;
  display: grid;
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, var(--marquee-ink) 48%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--marquee-ink) 48%, transparent);
  background: var(--marquee-fill);
  box-shadow: inset 0 1px color-mix(in srgb, var(--marquee-ink) 16%, transparent), inset 0 -1px color-mix(in srgb, #000 20%, transparent);
  grid-template-columns: auto minmax(0, 1fr);
}

.technology-marquee::after {
  position: absolute;
  z-index: 3;
  opacity: 0.18;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 8%) 4px);
  content: '';
  inset: 0;
  pointer-events: none;
}

.technology-marquee:focus-visible {
  outline: 2px solid var(--marquee-ink);
  outline-offset: -2px;
}

.technology-marquee__prompt {
  position: relative;
  z-index: 2;
  display: flex;
  min-width: 12rem;
  align-items: center;
  gap: 0.65rem;
  margin: 0;
  padding: 0.9rem var(--layout-gutter);
  border-right: 1px solid color-mix(in srgb, var(--marquee-ink) 42%, transparent);
  background: color-mix(in srgb, var(--marquee-fill) 88%, #000);
  color: var(--marquee-ink);
  text-transform: none;
  white-space: nowrap;
}

.technology-marquee__prompt span {
  color: var(--marquee-ink);
  text-shadow: 0 0 10px color-mix(in srgb, var(--marquee-ink) 28%, transparent);
}

.technology-marquee__viewport {
  min-width: 0;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 3rem, #000 calc(100% - 3rem), transparent);
}

.technology-marquee__track {
  display: flex;
  width: max-content;
  animation: technology-stream 30s linear infinite;
  will-change: transform;
}

.technology-marquee__group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.technology-marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.9rem 1.25rem;
  color: var(--marquee-ink);
  font-family: var(--font-mono);
  font-size: clamp(0.65rem, 0.78vw, 0.78rem);
  line-height: 1.4;
  white-space: nowrap;
}

.technology-marquee__item i {
  color: var(--marquee-ink);
  font-style: normal;
}

.technology-marquee__item b {
  margin-left: 0.7rem;
  color: color-mix(in srgb, var(--marquee-ink) 62%, transparent);
  font-weight: 400;
}

.technology-marquee:hover .technology-marquee__track,
.technology-marquee:focus .technology-marquee__track {
  animation-play-state: paused;
}

@keyframes technology-stream {
  to { transform: translateX(-50%); }
}

@media (max-width: 680px) {
  .technology-marquee {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .technology-marquee__prompt {
    min-width: auto;
    padding-inline: 0.75rem;
    font-size: 0;
  }

  .technology-marquee__prompt span {
    font-size: 0.72rem;
  }

  .technology-marquee__viewport {
    mask-image: linear-gradient(90deg, transparent, #000 1.25rem, #000 calc(100% - 1.25rem), transparent);
  }

  .technology-marquee__item {
    padding-inline: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .technology-marquee__track {
    animation: none;
  }
}
</style>
