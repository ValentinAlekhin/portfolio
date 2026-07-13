<template>
  <section
    id="flight"
    class="page-section section-rule flight-section"
  >
    <div class="site-container">
      <MotionReveal>
        <FlightGameCanvas />
      </MotionReveal>
    </div>
  </section>
</template>

<style scoped lang="scss">
.flight-section {
  overflow: hidden;
  padding-block: clamp(1.5rem, 4vw, 4rem);
  background:
    linear-gradient(color-mix(in srgb, var(--color-line) 22%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-line) 22%, transparent) 1px, transparent 1px),
    var(--color-surface);
  background-size: 3rem 3rem;
}

.flight-section::before {
  position: absolute;
  background: radial-gradient(circle, color-mix(in srgb, var(--color-accent) 7%, transparent), transparent 64%);
  content: '';
  inset: 15% 8%;
  pointer-events: none;
}

.flight-section :deep(.flight-terminal) { position: relative; }
</style>
