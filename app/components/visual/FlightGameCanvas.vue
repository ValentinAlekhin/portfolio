<script setup lang="ts">
const { t } = useI18n()
const { motionAllowed } = useMotionPreference()
const {
  canvas,
  status,
  formattedScore,
  formattedTime,
  start,
  onPointerDown,
  onPointerMove,
  onPointerUp,
} = useFlightGame({ motionAllowed })

const statusLabel = computed(() => t(`flight.status.${status.value}`))
const commandLabel = computed(() => status.value === 'terminated'
  ? t('flight.restart')
  : t('flight.run'))
</script>

<template>
  <div class="flight-terminal">
    <header class="flight-terminal__head system-label">
      <div>
        <i aria-hidden="true" />
        <span>{{ t('flight.windowTitle') }}</span>
      </div>
      <span>{{ statusLabel }}</span>
    </header>

    <div
      class="flight-stage"
      :class="`is-${status}`"
    >
      <canvas
        ref="canvas"
        class="flight-stage__canvas"
        tabindex="0"
        role="img"
        :aria-label="t('flight.canvasLabel')"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      />

      <div
        class="flight-hud system-label"
        aria-hidden="true"
      >
        <span>{{ t('flight.score') }}: <b>{{ formattedScore }}</b></span>
        <span>{{ t('flight.time') }}: <b>{{ formattedTime }}s</b></span>
        <span>{{ t('flight.system') }}: <b>{{ status === 'running' ? t('flight.online') : t('flight.standby') }}</b></span>
      </div>

      <div
        class="flight-reticle"
        aria-hidden="true"
      >
        <span />
      </div>

      <div
        v-if="status !== 'running'"
        class="flight-overlay"
        :class="{ 'is-terminated': status === 'terminated' }"
      >
        <p class="flight-overlay__code system-label">
          {{ status === 'terminated' ? t('flight.exitCode') : t('flight.bootLabel') }}
        </p>
        <h3>{{ status === 'terminated' ? t('flight.terminated') : t('flight.ready') }}</h3>
        <p
          v-if="status === 'idle'"
          class="flight-overlay__description"
        >
          {{ t('flight.intro') }}
        </p>
        <p
          v-else
          class="flight-overlay__result system-label"
        >
          {{ t('flight.finalScore') }}: {{ formattedScore }}
        </p>
        <button
          type="button"
          class="flight-overlay__command"
          @click="start"
        >
          {{ commandLabel }}
        </button>
      </div>

      <div
        class="flight-stage__scanlines"
        aria-hidden="true"
      />
      <div
        class="flight-stage__glass"
        aria-hidden="true"
      />
      <p
        class="visually-hidden"
        aria-live="polite"
      >
        {{ status === 'terminated' ? `${t('flight.terminated')}. ${t('flight.finalScore')}: ${formattedScore}` : '' }}
      </p>
    </div>

    <footer class="flight-terminal__controls system-label">
      <span><b>{{ t('flight.keyboardLabel') }}</b> {{ t('flight.keyboardControls') }}</span>
      <span><b>{{ t('flight.mobileLabel') }}</b> {{ t('flight.mobileControls') }}</span>
      <span>{{ t('flight.autofire') }}</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.flight-terminal {
  position: relative;
  border: 1px solid var(--color-control-border);
  background: #090d09;
  box-shadow: 0 34px 90px rgb(0 0 0 / 20%), 0 0 35px color-mix(in srgb, var(--color-phosphor) 7%, transparent);
  color: #f0f2ea;
  font-family: var(--font-mono);
}

.flight-terminal__head {
  display: flex;
  min-height: 2.7rem;
  align-items: center;
  justify-content: space-between;
  padding-inline: 0.85rem;
  border-bottom: 1px solid #283025;
  color: #84907e;
}

.flight-terminal__head div { display: flex; align-items: center; gap: 0.6rem; }
.flight-terminal__head i { width: 0.45rem; height: 0.45rem; background: var(--color-phosphor); box-shadow: 0 0 10px var(--color-phosphor); }
.flight-terminal__head > span { color: var(--color-phosphor); }

.flight-stage {
  position: relative;
  aspect-ratio: 16 / 8.5;
  overflow: hidden;
  background: #071007;
  isolation: isolate;
}

.flight-stage__canvas {
  display: block;
  width: 100%;
  height: 100%;
  outline: 0;
  touch-action: none;
}

.flight-stage__canvas:focus-visible { box-shadow: inset 0 0 0 2px var(--color-focus); }

.flight-hud {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  min-height: 3rem;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-inline: clamp(0.7rem, 2vw, 1.4rem);
  border-bottom: 1px solid rgb(168 255 96 / 18%);
  background: linear-gradient(to bottom, rgb(7 16 7 / 92%), rgb(7 16 7 / 18%));
  color: #7e9278;
  pointer-events: none;
}

.flight-hud span:nth-child(2) { justify-self: center; }
.flight-hud span:last-child { justify-self: end; }
.flight-hud b { color: var(--color-phosphor); font-weight: 500; text-shadow: 0 0 10px rgb(168 255 96 / 34%); }

.flight-reticle {
  position: absolute;
  z-index: 2;
  top: 21%;
  left: 50%;
  width: clamp(2.5rem, 7vw, 5rem);
  aspect-ratio: 1;
  border: 1px solid rgb(168 255 96 / 18%);
  border-radius: 50%;
  opacity: 0.5;
  pointer-events: none;
  transform: translateX(-50%);
}

.flight-reticle::before,
.flight-reticle::after,
.flight-reticle span::before,
.flight-reticle span::after { position: absolute; background: rgb(168 255 96 / 45%); content: ''; }
.flight-reticle::before { top: 50%; right: -15%; left: -15%; height: 1px; }
.flight-reticle::after { top: -15%; bottom: -15%; left: 50%; width: 1px; }
.flight-reticle span::before { top: 50%; left: 50%; width: 20%; height: 1px; transform: translate(-50%, -50%) rotate(45deg); }
.flight-reticle span::after { top: 50%; left: 50%; width: 20%; height: 1px; transform: translate(-50%, -50%) rotate(-45deg); }

.flight-overlay {
  position: absolute;
  z-index: 5;
  top: 50%;
  left: 50%;
  display: grid;
  width: min(88%, 34rem);
  justify-items: center;
  padding: clamp(1.4rem, 4vw, 2.6rem);
  border: 1px solid rgb(168 255 96 / 52%);
  background: rgb(7 12 7 / 90%);
  box-shadow: 0 0 55px rgb(0 0 0 / 65%), inset 0 0 35px rgb(168 255 96 / 4%);
  text-align: center;
  transform: translate(-50%, -50%);
}

.flight-overlay::before,
.flight-overlay::after { position: absolute; width: 1.2rem; height: 1.2rem; border-color: var(--color-phosphor); content: ''; pointer-events: none; }
.flight-overlay::before { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
.flight-overlay::after { right: -1px; bottom: -1px; border-right: 2px solid; border-bottom: 2px solid; }
.flight-overlay.is-terminated { border-color: rgb(255 141 130 / 62%); }
.flight-overlay.is-terminated::before,
.flight-overlay.is-terminated::after { border-color: var(--color-danger); }
.flight-overlay__code { margin: 0; color: #7e9278; }
.flight-overlay.is-terminated .flight-overlay__code { color: var(--color-danger); }

.flight-overlay h3 {
  margin: 0.7rem 0 0;
  color: var(--color-phosphor);
  font-size: clamp(1.3rem, 3.4vw, 2.7rem);
  font-weight: 520;
  letter-spacing: -0.045em;
  line-height: 1;
  text-shadow: 0 0 18px rgb(168 255 96 / 28%);
}

.flight-overlay.is-terminated h3 { color: var(--color-danger); text-shadow: 0 0 18px rgb(255 141 130 / 28%); }
.flight-overlay__description { max-width: 48ch; margin: 1rem 0 0; color: #a6ad9e; font-family: var(--font-sans); font-size: 0.9rem; line-height: 1.5; }
.flight-overlay__result { margin: 1rem 0 0; color: #a6ad9e; }

.flight-overlay__command {
  margin-top: 1.4rem;
  padding: 0.8rem 1rem;
  border: 0;
  background: var(--color-phosphor);
  color: #071007;
  cursor: pointer;
  font: inherit;
  font-size: clamp(0.68rem, 1.1vw, 0.82rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: left;
}

.flight-overlay__command:hover { box-shadow: 0 0 24px rgb(168 255 96 / 38%); }
.flight-overlay__command:focus-visible { outline: 2px solid #f0f2ea; outline-offset: 3px; }
.flight-overlay.is-terminated .flight-overlay__command { background: var(--color-danger); }

.flight-stage__scanlines,
.flight-stage__glass { position: absolute; z-index: 4; content: ''; inset: 0; pointer-events: none; }
.flight-stage__scanlines { opacity: 0.48; background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 18%) 4px); }
.flight-stage__glass { background: radial-gradient(ellipse at center, transparent 58%, rgb(0 0 0 / 38%) 100%), linear-gradient(90deg, rgb(255 0 0 / 1.2%), transparent, rgb(0 100 255 / 1.2%)); }

.flight-terminal__controls {
  display: grid;
  min-height: 3.2rem;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 1rem;
  padding-inline: 0.85rem;
  border-top: 1px solid #283025;
  color: #7e9278;
}

.flight-terminal__controls b { color: var(--color-phosphor); font-weight: 500; }
.flight-terminal__controls span:last-child { color: #d5b767; }

@media (max-width: 700px) {
  .flight-stage { aspect-ratio: 4 / 5; }
  .flight-hud { min-height: 2.6rem; grid-template-columns: 1fr auto; font-size: 0.58rem; }
  .flight-hud span:nth-child(2) { justify-self: end; }
  .flight-hud span:last-child { display: none; }
  .flight-reticle { top: 16%; }
  .flight-overlay { width: calc(100% - 2rem); padding: 1.3rem 0.9rem; }
  .flight-overlay__description { font-size: 0.78rem; }
  .flight-terminal__controls { grid-template-columns: 1fr; gap: 0.25rem; padding-block: 0.65rem; }
  .flight-terminal__controls span:first-child { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .flight-overlay__command:hover { box-shadow: none; }
}
</style>
