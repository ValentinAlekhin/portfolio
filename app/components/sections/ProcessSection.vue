<script setup lang="ts">
import type { ProcessItem } from '~/types/content'

const { t } = useI18n()
const itemDefinitions = [
  { id: 'websites', number: '01' },
  { id: 'commerce', number: '02' },
  { id: 'applications', number: '03' },
  { id: 'products', number: '04' },
] as const
const items = computed<ProcessItem[]>(() => itemDefinitions.map(item => ({
  number: item.number,
  title: t(`process.items.${item.id}.title`),
  description: t(`process.items.${item.id}.description`),
})))
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
        :eyebrow="t('process.eyebrow')"
        :title="t('process.title')"
        :description="t('process.description')"
        title-id="process-title"
      />

      <div class="protocol">
        <div class="protocol__head system-label">
          <span>project_types.ts</span>
          <span>{{ t('process.running') }}</span>
        </div>
        <span
          ref="progress"
          class="protocol__progress"
          aria-hidden="true"
        />
        <article
          v-for="item in items"
          :key="item.number"
          class="protocol-step"
        >
          <span class="protocol-step__marker system-label">{{ Number(item.number) * 4 + 8 }}</span>
          <h3><span>build</span> {{ item.title }}<i>();</i></h3>
          <p>// {{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.process-section { background: var(--color-surface); }
.protocol { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--color-control-border); background: color-mix(in srgb, var(--color-bg) 91%, #000); }
.protocol__head { grid-column: 1 / -1; display: flex; min-height: 2.6rem; align-items: center; justify-content: space-between; padding-inline: 0.9rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.protocol__head span:last-child { color: var(--color-accent); }
.protocol::before,
.protocol__progress { position: absolute; top: 2.55rem; right: 0; left: 0; height: 2px; content: ''; transform-origin: left; }
.protocol::before { background: var(--color-line); }
.protocol__progress { z-index: 1; background: var(--color-accent); }
.protocol-step { min-height: 20rem; padding: 2rem 1.5rem; border-right: 1px solid var(--color-line); }
.protocol-step:last-child { border-right: 0; }
.protocol-step__marker { color: var(--color-text-muted); }
.protocol-step h3 { margin: 3.25rem 0 0; font-family: var(--font-mono); font-size: clamp(1.2rem, 2vw, 2rem); font-weight: 500; letter-spacing: -0.045em; }
.protocol-step h3 span { display: block; margin-bottom: 0.45rem; color: #c67be5; font-size: 0.62rem; letter-spacing: 0; }
.protocol-step h3 i { color: var(--color-accent); font-style: normal; }
.protocol-step p { max-width: 34ch; margin: 1rem 0 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.72rem; }

@media (max-width: 820px) {
  .protocol { grid-template-columns: 1fr; }
  .protocol__head { grid-column: 1; }
  .protocol__progress { display: none; }
  .protocol-step { min-height: auto; padding: 2rem 1rem; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .protocol-step h3 { margin-top: 2rem; }
}
</style>
