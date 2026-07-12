<script setup lang="ts">
const props = defineProps<{
  projectId: string
  title: string
}>()

const patternId = computed(() => `editor-grid-${props.projectId.replace(/[^a-z0-9_-]/gi, '-')}`)
</script>

<template>
  <div
    class="project-placeholder"
    aria-hidden="true"
  >
    <div class="project-placeholder__bar">
      <span class="project-placeholder__window-dots">
        <i />
        <i />
        <i />
      </span>
      <span class="project-placeholder__title">{{ title }}</span>
      <span class="project-placeholder__action" />
    </div>

    <div class="project-placeholder__workspace">
      <aside class="project-placeholder__sidebar">
        <span class="project-placeholder__sidebar-title" />
        <span
          v-for="index in 5"
          :key="index"
          class="project-placeholder__device"
        >
          <i />
          <i />
        </span>
      </aside>

      <div class="project-placeholder__canvas">
        <svg
          viewBox="0 0 760 420"
          role="presentation"
          focusable="false"
        >
          <defs>
            <pattern
              :id="patternId"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              />
            </pattern>
          </defs>
          <rect
            width="760"
            height="420"
            :fill="`url(#${patternId})`"
            class="project-placeholder__grid"
          />
          <g class="project-placeholder__wire">
            <path d="M145 100V155H300V210" />
            <path d="M300 210V280H500V330" />
            <path d="M300 210H565V150" />
          </g>
          <g class="project-placeholder__node">
            <rect
              x="100"
              y="58"
              width="90"
              height="82"
              rx="10"
            />
            <path d="M122 82h46M122 96h28M122 112h36" />
            <circle
              cx="145"
              cy="140"
              r="4"
            />
          </g>
          <g class="project-placeholder__node project-placeholder__node--accent">
            <rect
              x="254"
              y="168"
              width="94"
              height="84"
              rx="10"
            />
            <path d="M276 191h50M276 207h34M276 224h42" />
            <circle
              cx="300"
              cy="168"
              r="4"
            />
            <circle
              cx="300"
              cy="252"
              r="4"
            />
          </g>
          <g class="project-placeholder__node">
            <rect
              x="518"
              y="106"
              width="94"
              height="84"
              rx="10"
            />
            <path d="M540 130h50M540 146h30M540 162h42" />
            <circle
              cx="565"
              cy="190"
              r="4"
            />
          </g>
          <g class="project-placeholder__node">
            <rect
              x="454"
              y="290"
              width="94"
              height="84"
              rx="10"
            />
            <path d="M476 314h50M476 330h34M476 346h42" />
            <circle
              cx="500"
              cy="290"
              r="4"
            />
          </g>
        </svg>
        <div class="project-placeholder__zoom">
          <span>−</span>
          <span>100%</span>
          <span>+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.project-placeholder {
  @apply overflow-hidden border;

  aspect-ratio: 1.78;
  min-height: 360px;
  border-color: color-mix(in srgb, var(--ui-border) 88%, transparent);
  border-radius: 1rem;
  background: #f7f8fb;
  color: #d9dee9;
  box-shadow: 0 20px 60px rgb(33 42 67 / 12%);
}

:global(.dark) .project-placeholder {
  background: #121720;
  color: #242c3a;
}

.project-placeholder__bar {
  @apply grid items-center;

  grid-template-columns: 1fr auto 1fr;
  height: 10%;
  min-height: 2.8rem;
  padding-inline: 1.2rem;
  border-bottom: 1px solid #e1e5ed;
  background: #ffffff;
}

:global(.dark) .project-placeholder__bar {
  border-color: #28303d;
  background: #181e28;
}

.project-placeholder__window-dots {
  @apply flex;

  gap: 0.35rem;
}

.project-placeholder__window-dots i {
  @apply rounded-full;

  width: 0.45rem;
  height: 0.45rem;
  background: #cdd2dc;
}

.project-placeholder__window-dots i:first-child {
  background: #5b7cfa;
}

.project-placeholder__title {
  color: #313846;
  font-size: 0.76rem;
  font-weight: 780;
  letter-spacing: -0.02em;
}

:global(.dark) .project-placeholder__title {
  color: #dce2ee;
}

.project-placeholder__action {
  width: 3.6rem;
  height: 1.25rem;
  justify-self: end;
  border-radius: 0.38rem;
  background: #5b7cfa;
}

.project-placeholder__workspace {
  @apply grid;

  grid-template-columns: 18% 1fr;
  height: 90%;
}

.project-placeholder__sidebar {
  @apply flex flex-col;

  gap: 0.65rem;
  padding: 1.1rem 0.85rem;
  border-right: 1px solid #e1e5ed;
  background: #ffffff;
}

:global(.dark) .project-placeholder__sidebar {
  border-color: #28303d;
  background: #181e28;
}

.project-placeholder__sidebar-title {
  width: 70%;
  height: 0.42rem;
  margin-bottom: 0.25rem;
  border-radius: 999px;
  background: #cbd1dc;
}

:global(.dark) .project-placeholder__sidebar-title {
  background: #3a4352;
}

.project-placeholder__device {
  @apply grid;

  height: 2.45rem;
  align-content: center;
  gap: 0.35rem;
  padding-inline: 0.55rem;
  border: 1px solid #e6e9ef;
  border-radius: 0.45rem;
  background: #f8f9fb;
}

:global(.dark) .project-placeholder__device {
  border-color: #2b3442;
  background: #141a23;
}

.project-placeholder__device i {
  width: 80%;
  height: 0.22rem;
  border-radius: 999px;
  background: #d7dbe4;
}

.project-placeholder__device i:last-child {
  width: 50%;
}

:global(.dark) .project-placeholder__device i {
  background: #36404e;
}

.project-placeholder__canvas {
  @apply relative min-w-0;
}

.project-placeholder__canvas svg {
  @apply size-full;
}

.project-placeholder__grid {
  opacity: 0.62;
}

.project-placeholder__wire path {
  fill: none;
  stroke: #5b7cfa;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.project-placeholder__node rect {
  fill: #ffffff;
  stroke: #aeb7c7;
  stroke-width: 2;
}

.project-placeholder__node path {
  fill: none;
  stroke: #8994a7;
  stroke-linecap: round;
  stroke-width: 4;
}

.project-placeholder__node circle {
  fill: #5b7cfa;
}

.project-placeholder__node--accent rect {
  fill: #eef1ff;
  stroke: #5b7cfa;
}

:global(.dark) .project-placeholder__node rect {
  fill: #1b2330;
  stroke: #536077;
}

:global(.dark) .project-placeholder__node--accent rect {
  fill: #232e4d;
  stroke: #7893ff;
}

.project-placeholder__zoom {
  @apply absolute flex items-center overflow-hidden;

  right: 1rem;
  bottom: 1rem;
  border: 1px solid #dce1e9;
  border-radius: 0.48rem;
  background: #ffffff;
  color: #667084;
  box-shadow: 0 8px 20px rgb(31 40 61 / 10%);
  font-size: 0.62rem;
  font-weight: 700;
}

:global(.dark) .project-placeholder__zoom {
  border-color: #303a49;
  background: #1a212c;
  color: #a7b0bf;
}

.project-placeholder__zoom span {
  padding: 0.34rem 0.5rem;
  border-right: 1px solid #e4e7ed;
}

:global(.dark) .project-placeholder__zoom span {
  border-color: #303a49;
}

.project-placeholder__zoom span:last-child {
  border-right: 0;
}

@media (max-width: 640px) {
  .project-placeholder {
    aspect-ratio: 1.25;
    min-height: 0;
  }

  .project-placeholder__workspace {
    grid-template-columns: 1fr;
  }

  .project-placeholder__sidebar {
    @apply hidden;
  }

  .project-placeholder__bar {
    padding-inline: 0.7rem;
  }

  .project-placeholder__action {
    width: 2.2rem;
  }
}
</style>
