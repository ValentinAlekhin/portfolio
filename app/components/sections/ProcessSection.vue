<script setup lang="ts">
const { copy } = usePortfolio()
const root = ref<HTMLElement | null>(null)
const progress = ref<HTMLElement | null>(null)
const { motionAllowed } = useMotionPreference()
let context: ReturnType<ReturnType<typeof useNuxtApp>['$gsap']['context']> | undefined

onMounted(() => {
  if (!root.value || !progress.value || !motionAllowed.value) return
  const { $gsap } = useNuxtApp()
  context = $gsap.context(() => {
    $gsap.fromTo(progress.value, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top 75%',
        end: 'bottom 70%',
        scrub: 0.4,
      },
    })
    $gsap.from('.protocol-step', {
      autoAlpha: 0,
      y: 22,
      duration: 0.55,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.value, start: 'top 72%', once: true },
    })
  }, root.value)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
  <section
    id="process"
    ref="root"
    class="page-section section-rule process-section"
    aria-labelledby="process-title"
  >
    <div class="site-container">
      <BaseSectionHeading
        index="04"
        :eyebrow="copy.process.eyebrow"
        :title="copy.process.title"
        :description="copy.process.description"
        title-id="process-title"
      />

      <div class="protocol">
        <span
          ref="progress"
          class="protocol__progress"
          aria-hidden="true"
        />
        <article
          v-for="item in copy.process.items"
          :key="item.number"
          class="protocol-step"
        >
          <span class="protocol-step__marker system-label">{{ item.number }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.process-section { background: var(--color-surface); }
.protocol { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--color-line); }
.protocol::before,
.protocol__progress { position: absolute; top: -1px; right: 0; left: 0; height: 2px; content: ''; transform-origin: left; }
.protocol::before { background: var(--color-line); }
.protocol__progress { z-index: 1; background: var(--color-accent); }
.protocol-step { min-height: 22rem; padding: 2rem 1.5rem 1.5rem 0; border-right: 1px solid var(--color-line); }
.protocol-step + .protocol-step { padding-left: 1.5rem; }
.protocol-step:last-child { border-right: 0; }
.protocol-step__marker { display: grid; width: 2.7rem; height: 2.7rem; border: 1px solid var(--color-accent); border-radius: 50%; color: var(--color-accent); place-items: center; }
.protocol-step h3 { margin: 5rem 0 0; font-size: clamp(1.6rem, 2.5vw, 2.6rem); font-weight: 560; letter-spacing: -0.045em; }
.protocol-step p { max-width: 34ch; margin: 1rem 0 0; color: var(--color-text-muted); font-size: 0.95rem; }

@media (max-width: 820px) {
  .protocol { grid-template-columns: 1fr; }
  .protocol__progress { display: none; }
  .protocol-step,
  .protocol-step + .protocol-step { min-height: auto; padding: 2rem 0; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .protocol-step h3 { margin-top: 2rem; }
}
</style>
