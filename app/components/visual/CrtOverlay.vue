<template>
  <div
    class="crt-overlay"
    aria-hidden="true"
  >
    <div class="crt-overlay__bezel">
      <span class="crt-overlay__model">{{ $t('system.crtModel') }}</span>
      <span class="crt-overlay__signal">{{ $t('system.crtSignal') }}</span>
      <i class="crt-overlay__screw crt-overlay__screw--tl" />
      <i class="crt-overlay__screw crt-overlay__screw--tr" />
      <i class="crt-overlay__screw crt-overlay__screw--bl" />
      <i class="crt-overlay__screw crt-overlay__screw--br" />
    </div>
    <div class="crt-overlay__scanlines" />
    <div class="crt-overlay__glass" />
    <div class="crt-overlay__refresh" />
  </div>
</template>

<style scoped lang="scss">
.crt-overlay,
.crt-overlay > div {
  position: fixed;
  z-index: 1800;
  inset: 0;
  pointer-events: none;
}

.crt-overlay__bezel {
  border: clamp(5px, 0.7vw, 11px) solid color-mix(in srgb, var(--color-text) 12%, #050605);
  border-radius: 18px;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--color-text) 18%, transparent),
    inset 0 0 70px rgb(0 0 0 / 13%),
    0 0 0 1px #000;
}

.crt-overlay__model,
.crt-overlay__signal {
  position: absolute;
  bottom: 1px;
  color: color-mix(in srgb, var(--color-text-muted) 72%, transparent);
  font-family: var(--font-mono);
  font-size: 6px;
  letter-spacing: 0.12em;
}

.crt-overlay__model { left: 2rem; }
.crt-overlay__signal { right: 2rem; }

.crt-overlay__scanlines {
  opacity: 0.28;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 3px,
    rgb(0 0 0 / 7%) 4px
  );
}

.crt-overlay__glass {
  background:
    radial-gradient(ellipse at center, transparent 57%, rgb(0 0 0 / 12%) 100%),
    linear-gradient(90deg, rgb(255 0 0 / 0.012), rgb(0 255 70 / 0.008), rgb(0 80 255 / 0.012));
  box-shadow: inset 0 0 90px rgb(0 0 0 / 12%);
}

.crt-overlay__refresh {
  top: -30%;
  bottom: auto;
  height: 30%;
  opacity: 0.09;
  background: linear-gradient(to bottom, transparent, var(--color-phosphor), transparent);
  animation: crt-refresh 11s linear infinite;
}

.crt-overlay__screw {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-text-muted) 60%, #000);
}

.crt-overlay__screw--tl { top: 3px; left: 3px; }
.crt-overlay__screw--tr { top: 3px; right: 3px; }
.crt-overlay__screw--bl { bottom: 3px; left: 3px; }
.crt-overlay__screw--br { right: 3px; bottom: 3px; }

@keyframes crt-refresh {
  from { transform: translateY(-10vh); }
  to { transform: translateY(145vh); }
}

@media (prefers-reduced-motion: reduce) {
  .crt-overlay__refresh { display: none; }
}

@media (max-width: 600px) {
  .crt-overlay__bezel { border-width: 4px; border-radius: 10px; }
  .crt-overlay__scanlines { opacity: 0.18; }
  .crt-overlay__model,
  .crt-overlay__signal { display: none; }
}
</style>
