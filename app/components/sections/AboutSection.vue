<script setup lang="ts">
const { t } = useI18n()
const paragraphKeys = ['about.paragraphs.product', 'about.paragraphs.workflow'] as const
const principleKeys = [
  'about.principles.interface',
  'about.principles.prototype',
  'about.principles.automation',
  'about.principles.launch',
] as const
const paragraphs = computed(() => paragraphKeys.map(key => t(key)))
const principles = computed(() => principleKeys.map(key => t(key)))
const nowItems = [
  { id: 'building', labelKey: 'about.now.building.label', valueKey: 'about.now.building.value' },
  { id: 'exploring', labelKey: 'about.now.exploring.label', valueKey: 'about.now.exploring.value' },
  { id: 'available', labelKey: 'about.now.available.label', valueKey: 'about.now.available.value' },
] as const
</script>

<template>
  <section
    id="about"
    class="page-section section-rule about-section"
    aria-labelledby="about-title"
  >
    <div class="site-container">
      <MotionReveal>
        <BaseSectionHeading
          index="05"
          :eyebrow="t('about.eyebrow')"
          :title="t('about.title')"
          title-id="about-title"
        />
      </MotionReveal>

      <div class="about-file system-label">
        <span>README.md</span>
        <span>UTF-8 / LF</span>
      </div>
      <div class="about-grid">
        <MotionReveal class="about-copy">
          <p class="about-copy__prompt">
            ## valentin-alekhin / product-developer
          </p>
          <p
            v-for="paragraph in paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </MotionReveal>

        <MotionReveal
          :delay="0.08"
          class="about-principles"
        >
          <p class="system-label">
            <span>const</span> {{ t('about.principlesKey') }} = [
          </p>
          <ol>
            <li
              v-for="(principle, index) in principles"
              :key="principle"
            >
              <span class="system-label">{{ index + 1 }}:</span><q>{{ principle }}</q><i>,</i>
            </li>
          </ol>
        </MotionReveal>
      </div>

      <MotionReveal class="now-board">
        <div
          v-for="item in nowItems"
          :key="item.id"
          class="now-board__item"
        >
          <span class="system-label">"{{ t(item.labelKey).toLowerCase() }}":</span>
          <strong>"{{ t(item.valueKey) }}"</strong>
        </div>
      </MotionReveal>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-file { display: flex; min-height: 2.6rem; align-items: center; justify-content: space-between; padding-inline: 0.9rem; border: 1px solid var(--color-control-border); border-bottom: 0; color: var(--color-text-muted); }
.about-file span:first-child { color: var(--color-accent); }
.about-grid { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(3rem, 9vw, 9rem); padding: clamp(1.5rem, 4vw, 3.5rem); border: 1px solid var(--color-control-border); background: color-mix(in srgb, var(--color-bg) 92%, #000); }
.about-copy { font-size: clamp(1.2rem, 2vw, 1.65rem); line-height: 1.48; }
.about-copy p { margin: 0; }
.about-copy p + p { margin-top: 1.5rem; color: var(--color-text-muted); }
.about-copy .about-copy__prompt { margin-bottom: 2rem; color: var(--color-accent); font-family: var(--font-mono); font-size: 0.72rem; }
.about-principles > p { margin: 0 0 1rem; color: var(--color-text-muted); }
.about-principles > p span { color: #c67be5; }
.about-principles ol { margin: 0; list-style: none; border-top: 1px solid var(--color-line); }
.about-principles li { display: grid; min-height: 4.7rem; grid-template-columns: 3rem minmax(0, 1fr) auto; align-items: center; border-bottom: 1px solid var(--color-line); }
.about-principles li span { color: var(--color-accent); }
.about-principles li q { color: #d5b767; quotes: '"' '"'; }
.about-principles li i { color: var(--color-text-muted); font-style: normal; }
.now-board { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 3.25rem; border: 1px solid var(--color-line); }
.now-board::before { position: absolute; top: -2.1rem; left: 0; color: var(--color-accent); content: 'runtime = {'; font-family: var(--font-mono); font-size: 0.7rem; }
.now-board::after { position: absolute; right: 0; bottom: -1.8rem; color: var(--color-accent); content: '}'; font-family: var(--font-mono); font-size: 0.7rem; }
.now-board__item { min-height: 10rem; padding: 1.3rem; border-right: 1px solid var(--color-line); background: var(--color-surface); }
.now-board__item:last-child { border-right: 0; }
.now-board__item span { display: block; color: var(--color-text-muted); }
.now-board__item strong { display: block; margin-top: 3rem; color: #d5b767; font-family: var(--font-mono); font-size: clamp(0.9rem, 1.6vw, 1.25rem); font-weight: 500; line-height: 1.35; }

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-principles li { min-height: 0; grid-template-columns: 2.25rem minmax(0, 1fr) auto; align-items: start; padding-block: 1rem; }
  .about-principles li i { padding-left: 0.2rem; }
  .now-board { grid-template-columns: 1fr; }
  .now-board__item { min-height: 8rem; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .now-board__item:last-child { border-bottom: 0; }
  .now-board__item strong { margin-top: 2rem; }
}
</style>
