<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  mode?: 'editor' | 'library' | 'report'
}>(), {
  label: undefined,
  mode: 'editor',
})

const { t } = useI18n()
const resolvedLabel = computed(() => props.label ?? t('preview.label'))
</script>

<template>
  <div
    class="powersketch-preview"
    :class="`powersketch-preview--${mode}`"
    role="img"
    :aria-label="resolvedLabel"
  >
    <div class="powersketch-preview__bar">
      <span class="powersketch-logo">P</span>
      <strong>PowerSketch</strong>
      <span class="powersketch-preview__file system-label">MAIN_BOARD.PS</span>
      <span class="powersketch-preview__action system-label">{{ t('preview.share') }}</span>
    </div>
    <div class="powersketch-preview__body">
      <aside
        class="powersketch-preview__rail"
        aria-hidden="true"
      >
        <i class="active" /><i /><i /><i /><i />
      </aside>
      <aside
        class="powersketch-preview__library"
        aria-hidden="true"
      >
        <span class="system-label">{{ mode === 'report' ? t('preview.report') : t('preview.devices') }}</span>
        <div class="powersketch-search" />
        <template v-if="mode !== 'report'">
          <div
            v-for="item in 4"
            :key="item"
            class="powersketch-device"
          >
            <i /><span><b>{{ item }}P C{{ item * 8 }}</b><small>Basic M</small></span>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in 5"
            :key="item"
            class="powersketch-report-line"
          >
            <i /><span />
          </div>
        </template>
      </aside>
      <div
        class="powersketch-canvas"
        aria-hidden="true"
      >
        <span class="powersketch-canvas__zoom system-label">100%</span>
        <svg viewBox="0 0 720 420">
          <g class="ps-rails"><path d="M75 75H650M75 330H650" /></g>
          <g class="ps-wires">
            <path d="M170 168V215H354V268" />
            <path d="M214 168V235H465V268" />
            <path d="M354 215H575V268" />
          </g>
          <g
            class="ps-device ps-device--main"
            transform="translate(122 72)"
          >
            <rect
              width="140"
              height="96"
              rx="7"
            /><path d="M48 20v48M92 20v48M38 46l20-14M82 46l20-14" /><text
              x="25"
              y="86"
            >QF1 · C40</text>
          </g>
          <g
            class="ps-device ps-device--selected"
            transform="translate(310 268)"
          >
            <rect
              width="88"
              height="92"
              rx="7"
            /><path d="M44 19v48M34 45l20-14" /><text
              x="12"
              y="82"
            >QF2 · C16</text>
          </g>
          <g
            class="ps-device"
            transform="translate(421 268)"
          >
            <rect
              width="88"
              height="92"
              rx="7"
            /><path d="M44 19v48M34 45l20-14" /><text
              x="12"
              y="82"
            >QF3 · C10</text>
          </g>
          <g
            class="ps-device"
            transform="translate(532 268)"
          >
            <rect
              width="88"
              height="92"
              rx="7"
            /><path d="M44 19v48M34 45l20-14" /><text
              x="12"
              y="82"
            >QF4 · C25</text>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.powersketch-preview {
  width: 100%;
  aspect-ratio: 1.55;
  overflow: hidden;
  background: #f6f7f9;
  color: #222936;
  font-family: var(--font-sans);
}

.powersketch-preview__bar {
  display: grid;
  height: 11%;
  min-height: 2.4rem;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 0.45rem;
  padding-inline: 1rem;
  border-bottom: 1px solid #dfe3e9;
  background: #fff;
  font-size: clamp(0.38rem, 0.8vw, 0.7rem);
}

.powersketch-logo {
  display: grid;
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 0.32rem;
  background: #3d63dd;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  place-items: center;
}

.powersketch-preview__file { color: #727a89; font-size: clamp(0.32rem, 0.62vw, 0.56rem); }
.powersketch-preview__action { padding: 0.38rem 0.5rem; border-radius: 0.3rem; background: #3d63dd; color: #fff; font-size: clamp(0.3rem, 0.58vw, 0.52rem); }
.powersketch-preview__body { display: grid; height: 89%; grid-template-columns: 7% 23% 1fr; }
.powersketch-preview__rail,
.powersketch-preview__library { border-right: 1px solid #dfe3e9; background: #fff; }
.powersketch-preview__rail { display: flex; flex-direction: column; align-items: center; gap: 0.55rem; padding-top: 0.8rem; }
.powersketch-preview__rail i { width: 1rem; height: 1rem; border: 1px solid #a5adba; border-radius: 0.2rem; }
.powersketch-preview__rail i.active { border-color: #3d63dd; background: #edf2ff; }
.powersketch-preview__library { padding: clamp(0.45rem, 1.1vw, 0.9rem); }
.powersketch-preview__library > span { color: #6c7482; font-size: clamp(0.28rem, 0.56vw, 0.52rem); }
.powersketch-search { height: 1.5rem; margin: 0.65rem 0; border: 1px solid #dfe3e9; border-radius: 0.3rem; background: #f7f8fa; }
.powersketch-device { display: flex; align-items: center; gap: 0.45rem; padding-block: 0.42rem; border-top: 1px solid #eceef2; }
.powersketch-device > i { width: 0.85rem; height: 1.2rem; border: 1px solid #8a93a2; border-radius: 0.16rem; }
.powersketch-device span { display: grid; }
.powersketch-device b,
.powersketch-device small { font-size: clamp(0.28rem, 0.53vw, 0.48rem); line-height: 1.2; }
.powersketch-device small { color: #8a93a2; }
.powersketch-canvas { position: relative; overflow: hidden; background-color: #f7f8fa; background-image: linear-gradient(#e5e8ed 1px, transparent 1px), linear-gradient(90deg, #e5e8ed 1px, transparent 1px); background-size: 1.15rem 1.15rem; }
.powersketch-canvas__zoom { position: absolute; z-index: 1; top: 0.6rem; right: 0.7rem; color: #717989; font-size: clamp(0.28rem, 0.5vw, 0.48rem); }
.powersketch-canvas svg { width: 100%; height: 100%; }
.ps-rails path { fill: none; stroke: #6f7886; stroke-width: 3; }
.ps-wires path { fill: none; stroke: #3d63dd; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; }
.ps-device rect { fill: #fff; stroke: #8a93a2; stroke-width: 2; }
.ps-device path { fill: none; stroke: #5e6674; stroke-width: 2.5; }
.ps-device text { fill: #4c5564; font-family: var(--font-mono); font-size: 9px; }
.ps-device--selected rect { stroke: #3d63dd; stroke-width: 3; }
.powersketch-report-line { display: flex; gap: 0.4rem; padding: 0.5rem 0; border-top: 1px solid #eceef2; }
.powersketch-report-line i { width: 1rem; height: 0.5rem; background: #dce3f9; }
.powersketch-report-line span { width: 65%; height: 0.5rem; background: #e7e9ed; }

@media (max-width: 520px) {
  .powersketch-preview__body { grid-template-columns: 9% 1fr; }
  .powersketch-preview__library { display: none; }
  .powersketch-preview__file { display: none; }
}
</style>
