<template>
  <div
    class="crt-overlay"
    aria-hidden="true"
  >
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

@keyframes crt-refresh {
  from { transform: translateY(-10vh); }
  to { transform: translateY(145vh); }
}

@media (prefers-reduced-motion: reduce) {
  .crt-overlay__refresh { display: none; }
}

@media (max-width: 600px) {
  .crt-overlay__scanlines { opacity: 0.18; }
}
</style>
