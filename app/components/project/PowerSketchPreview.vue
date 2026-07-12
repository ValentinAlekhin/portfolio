<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  variant?: 'hero' | 'case'
}>(), {
  variant: 'case',
})
</script>

<template>
  <div
    class="powersketch-preview"
    :class="`powersketch-preview--${variant}`"
    role="img"
    :aria-label="description"
  >
    <div class="powersketch-preview__topbar">
      <div class="powersketch-preview__brand">
        <span aria-hidden="true">P</span>
        <strong>{{ title }}</strong>
      </div>

      <div
        class="powersketch-preview__tools"
        aria-hidden="true"
      >
        <span class="is-active">
          <i />
        </span>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
      </div>

      <div class="powersketch-preview__document">
        <span>Main board</span>
        <i aria-hidden="true" />
      </div>
    </div>

    <div class="powersketch-preview__workspace">
      <nav
        class="powersketch-preview__rail"
        aria-hidden="true"
      >
        <span class="is-active"><i /></span>
        <span><i /></span>
        <span><i /></span>
        <span><i /></span>
      </nav>

      <aside
        class="powersketch-preview__library"
        aria-hidden="true"
      >
        <div class="powersketch-preview__library-heading">
          <strong>Devices</strong>
          <span>12</span>
        </div>
        <div class="powersketch-preview__search">
          <i />
          Search library
        </div>
        <small>Circuit breakers</small>
        <div class="powersketch-preview__device-row">
          <i class="powersketch-preview__device-icon" />
          <span><strong>1P C16</strong><small>Basic M</small></span>
        </div>
        <div class="powersketch-preview__device-row">
          <i class="powersketch-preview__device-icon" />
          <span><strong>2P C25</strong><small>Basic M</small></span>
        </div>
        <div class="powersketch-preview__device-row">
          <i class="powersketch-preview__device-icon" />
          <span><strong>RCD 40A</strong><small>F202</small></span>
        </div>
      </aside>

      <div class="powersketch-preview__canvas">
        <div class="powersketch-preview__canvas-meta">
          <span>Distribution board</span>
          <span>100%</span>
        </div>

        <svg
          viewBox="0 0 820 480"
          focusable="false"
          aria-hidden="true"
        >
          <g class="diagram-rail">
            <path d="M105 107H710" />
            <path d="M105 349H710" />
          </g>

          <g class="diagram-wire diagram-wire--primary">
            <path d="M200 181V218H410V270" />
            <path d="M410 270V305" />
            <path d="M410 218H632V305" />
          </g>
          <g class="diagram-wire diagram-wire--neutral">
            <path d="M245 181V238H515V305" />
            <path d="M515 238H680V305" />
          </g>

          <g class="diagram-device diagram-device--main">
            <rect
              x="150"
              y="72"
              width="142"
              height="109"
              rx="8"
            />
            <circle
              cx="200"
              cy="72"
              r="5"
            />
            <circle
              cx="245"
              cy="72"
              r="5"
            />
            <circle
              cx="200"
              cy="181"
              r="5"
            />
            <circle
              cx="245"
              cy="181"
              r="5"
            />
            <path d="M200 99v49M245 99v49" />
            <path d="M190 119l20-13M235 119l20-13" />
            <text
              x="170"
              y="163"
            >QF1 · C40</text>
          </g>

          <g class="diagram-device diagram-device--selected">
            <rect
              x="359"
              y="305"
              width="102"
              height="102"
              rx="8"
            />
            <circle
              cx="410"
              cy="305"
              r="5"
            />
            <circle
              cx="410"
              cy="407"
              r="5"
            />
            <path d="M410 326v50" />
            <path d="M399 350l22-14" />
            <text
              x="377"
              y="393"
            >QF2 · C16</text>
          </g>

          <g class="diagram-device">
            <rect
              x="464"
              y="305"
              width="102"
              height="102"
              rx="8"
            />
            <circle
              cx="515"
              cy="305"
              r="5"
            />
            <circle
              cx="515"
              cy="407"
              r="5"
            />
            <path d="M515 326v50" />
            <path d="M504 350l22-14" />
            <text
              x="482"
              y="393"
            >QF3 · C10</text>
          </g>

          <g class="diagram-device">
            <rect
              x="581"
              y="305"
              width="138"
              height="102"
              rx="8"
            />
            <circle
              cx="632"
              cy="305"
              r="5"
            />
            <circle
              cx="680"
              cy="305"
              r="5"
            />
            <circle
              cx="632"
              cy="407"
              r="5"
            />
            <circle
              cx="680"
              cy="407"
              r="5"
            />
            <path d="M632 326v50" />
            <path d="M680 326v50" />
            <path d="M621 350l22-14" />
            <path d="M669 350l22-14" />
            <text
              x="603"
              y="393"
            >QF4 · C25 · 2P</text>
          </g>

          <g class="diagram-label">
            <rect
              x="338"
              y="254"
              width="145"
              height="32"
              rx="6"
            />
            <text
              x="355"
              y="275"
            >Group · Lighting</text>
          </g>
        </svg>

        <div
          class="powersketch-preview__inspector"
          aria-hidden="true"
        >
          <span>Selected</span>
          <strong>QF2 · C16</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.powersketch-preview {
  @apply relative isolate w-full overflow-hidden;
  aspect-ratio: 1.58;
  border: 1px solid color-mix(in srgb, var(--ui-border) 86%, transparent);
  border-radius: 1rem;
  background: var(--ui-surface-muted);
  color: var(--ui-text-toned);
  box-shadow: 0 28px 70px rgb(33 39 53 / 14%);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.powersketch-preview--hero {
  aspect-ratio: 1.22;
  border-radius: 1.25rem;
}

.powersketch-preview__topbar {
  @apply grid items-center;
  grid-template-columns: 1fr auto 1fr;
  height: 11%;
  min-height: 2.8rem;
  padding-inline: 1.1rem;
  border-bottom: 1px solid var(--ui-border-soft);
  background: var(--ui-surface);
}

.powersketch-preview__brand,
.powersketch-preview__document,
.powersketch-preview__tools {
  @apply flex items-center;
}

.powersketch-preview__brand {
  gap: 0.55rem;
  font-size: clamp(0.48rem, 0.8vw, 0.72rem);
  letter-spacing: -0.02em;
}

.powersketch-preview__brand > span {
  @apply grid place-items-center;
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 0.38rem;
  background: #5569d9;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
}

.powersketch-preview__tools {
  gap: 0.2rem;
}

.powersketch-preview__tools span,
.powersketch-preview__rail span {
  @apply grid place-items-center;
  border-radius: 0.32rem;
}

.powersketch-preview__tools span {
  width: 1.55rem;
  height: 1.55rem;
}

.powersketch-preview__tools span.is-active,
.powersketch-preview__rail span.is-active {
  background: var(--ui-accent-soft);
}

.powersketch-preview__tools i,
.powersketch-preview__rail i {
  display: block;
  width: 0.68rem;
  height: 0.68rem;
  border: 1.5px solid var(--ui-text-dimmed);
  border-radius: 0.18rem;
}

.powersketch-preview__tools .is-active i,
.powersketch-preview__rail .is-active i {
  border-color: var(--ui-accent);
}

.powersketch-preview__document {
  @apply justify-end;
  gap: 0.5rem;
  color: var(--ui-text-muted);
  font-size: clamp(0.42rem, 0.7vw, 0.62rem);
}

.powersketch-preview__document i {
  width: 3rem;
  height: 1.35rem;
  border-radius: 0.38rem;
  background: #5569d9;
}

.powersketch-preview__workspace {
  @apply grid;
  grid-template-columns: 6.5% 22% 1fr;
  height: 89%;
}

.powersketch-preview__rail,
.powersketch-preview__library {
  border-right: 1px solid var(--ui-border-soft);
  background: var(--ui-surface);
}

.powersketch-preview__rail {
  @apply flex flex-col items-center;
  gap: 0.4rem;
  padding-top: 0.8rem;
}

.powersketch-preview__rail span {
  width: 1.65rem;
  height: 1.65rem;
}

.powersketch-preview__library {
  padding: clamp(0.55rem, 1.2vw, 0.9rem);
}

.powersketch-preview__library-heading {
  @apply flex items-center justify-between;
  font-size: clamp(0.46rem, 0.72vw, 0.66rem);
}

.powersketch-preview__library-heading span {
  color: var(--ui-text-dimmed);
}

.powersketch-preview__search {
  @apply flex items-center;
  gap: 0.35rem;
  margin-top: 0.65rem;
  padding: 0.36rem 0.45rem;
  border: 1px solid var(--ui-border-soft);
  border-radius: 0.35rem;
  color: var(--ui-text-dimmed);
  font-size: clamp(0.36rem, 0.58vw, 0.52rem);
}

.powersketch-preview__search i {
  width: 0.45rem;
  height: 0.45rem;
  border: 1px solid currentcolor;
  border-radius: 50%;
}

.powersketch-preview__library > small {
  @apply block;
  margin: 0.75rem 0 0.4rem;
  color: var(--ui-text-dimmed);
  font-size: clamp(0.34rem, 0.54vw, 0.49rem);
}

.powersketch-preview__device-row {
  @apply flex items-center;
  gap: 0.5rem;
  padding: 0.42rem 0;
  border-top: 1px solid var(--ui-border-soft);
}

.powersketch-preview__device-icon {
  @apply relative block flex-none;
  width: 1.05rem;
  height: 1.45rem;
  border: 1px solid var(--ui-text-dimmed);
  border-radius: 0.18rem;
  background: var(--ui-surface);
}

.powersketch-preview__device-icon::after {
  @apply absolute;
  width: 0.55rem;
  height: 1px;
  background: #5569d9;
  content: "";
  inset: 0.55rem auto auto 0.23rem;
  transform: rotate(-45deg);
}

.powersketch-preview__device-row > span {
  @apply flex min-w-0 flex-col;
}

.powersketch-preview__device-row strong,
.powersketch-preview__device-row small {
  font-size: clamp(0.34rem, 0.55vw, 0.5rem);
  line-height: 1.3;
}

.powersketch-preview__device-row small {
  color: var(--ui-text-dimmed);
}

.powersketch-preview__canvas {
  @apply relative min-w-0 overflow-hidden;
  background-color: var(--ui-surface-subtle);
  background-image:
    linear-gradient(var(--ui-border-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--ui-border-soft) 1px, transparent 1px);
  background-size: 1.2rem 1.2rem;
}

.powersketch-preview__canvas-meta {
  @apply absolute z-1 flex items-center justify-between;
  inset: 0.65rem 0.8rem auto;
  color: var(--ui-text-muted);
  font-size: clamp(0.36rem, 0.58vw, 0.53rem);
}

.powersketch-preview__canvas svg {
  @apply size-full;
}

.diagram-rail path {
  fill: none;
  stroke: var(--ui-text-dimmed);
  stroke-width: 4;
}

.diagram-wire path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.diagram-wire--primary path {
  stroke: #5569d9;
}

.diagram-wire--neutral path {
  stroke: var(--ui-text-dimmed);
  stroke-width: 3;
}

.diagram-device rect {
  fill: var(--ui-surface);
  stroke: var(--ui-text-dimmed);
  stroke-width: 2;
}

.diagram-device path {
  fill: none;
  stroke: var(--ui-text-muted);
  stroke-linecap: round;
  stroke-width: 3;
}

.diagram-device circle {
  fill: #5569d9;
}

.diagram-device text,
.diagram-label text {
  fill: var(--ui-text-toned);
  font-size: 13px;
  font-weight: 650;
}

.diagram-device--main rect {
  fill: var(--ui-surface);
}

.diagram-device--selected rect {
  fill: var(--ui-accent-soft);
  stroke: var(--ui-accent);
  stroke-width: 3;
}

.diagram-label rect {
  fill: var(--ui-surface);
  stroke: var(--ui-border);
}

.powersketch-preview__inspector {
  @apply absolute flex flex-col;
  right: 3.5%;
  bottom: 5%;
  gap: 0.08rem;
  padding: 0.42rem 0.55rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.42rem;
  background: color-mix(in srgb, var(--ui-surface) 88%, transparent);
  box-shadow: 0 8px 24px rgb(35 42 56 / 10%);
  backdrop-filter: blur(8px);
  font-size: clamp(0.34rem, 0.55vw, 0.5rem);
}

.powersketch-preview__inspector span {
  color: var(--ui-text-dimmed);
}

@media (max-width: 640px) {
  .powersketch-preview,
  .powersketch-preview--hero {
    aspect-ratio: 1.12;
    border-radius: 0.8rem;
  }

  .powersketch-preview__topbar {
    grid-template-columns: 1fr auto;
    padding-inline: 0.7rem;
  }

  .powersketch-preview__tools {
    @apply hidden;
  }

  .powersketch-preview__workspace {
    grid-template-columns: 11% 1fr;
  }

  .powersketch-preview__library {
    @apply hidden;
  }

  .powersketch-preview__rail span {
    width: 1.4rem;
    height: 1.4rem;
  }

  .powersketch-preview__inspector {
    @apply hidden;
  }
}
</style>
