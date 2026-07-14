<script setup lang="ts">
const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const { motionAllowed } = useMotionPreference()
let context: ReturnType<ReturnType<typeof useNuxtApp>['$gsap']['context']> | undefined

onMounted(() => {
  if (!root.value || !motionAllowed.value) return
  const { $gsap } = useNuxtApp()
  context = $gsap.context(() => {
    $gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__eyebrow', { autoAlpha: 0, y: 12, duration: 0.4 })
      .from('.hero__name span', { yPercent: 115, duration: 0.75, stagger: 0.08 }, '-=0.15')
      .from('.hero__statement, .hero__description, .hero__terminal, .hero__actions, .hero__meta', { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.07 }, '-=0.45')
      .from('.hero__workbench', { autoAlpha: 0, scale: 0.97, duration: 0.7 }, '-=0.65')
  }, root.value)
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
  <section
    id="top"
    ref="root"
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="site-container hero__grid">
      <div class="hero__copy">
        <p class="hero__eyebrow system-label">
          <span>//</span> {{ t('hero.eyebrow') }}
        </p>
        <h1
          id="hero-title"
          class="hero__name"
        >
          <b aria-hidden="true">&lt;</b>
          <span><i>{{ t('hero.name.first') }}</i></span>
          <span><i>{{ t('hero.name.last') }}</i></span>
          <b aria-hidden="true">/&gt;</b>
        </h1>
        <p class="hero__statement">
          <span>const</span> product = <q>{{ t('hero.statement') }}</q>
        </p>
        <p class="hero__description">
          /* {{ t('hero.description') }} */
        </p>
        <div class="hero__terminal">
          <TypewriterLine :text="t('hero.terminal')" />
        </div>
        <div class="hero__actions">
          <BaseButton @click="contactOpen = true">
            {{ t('hero.primary') }}
          </BaseButton>
          <BaseButton
            href="#projects"
            variant="secondary"
          >
            {{ t('hero.secondary') }}
          </BaseButton>
        </div>
        <div class="hero__meta system-label">
          <span>&#123;</span>
          <span><b>{{ t('hero.meta.available') }}:</b> <i /> true,</span>
          <span><b>{{ t('hero.meta.experience') }}:</b> '{{ t('hero.experience') }}',</span>
          <span><b>{{ t('hero.meta.stack') }}:</b> ['vue', 'nuxt', 'ts', 'node', 'go']</span>
          <span>&#125;</span>
        </div>
      </div>
      <div class="hero__workbench">
        <CodeWorkbench />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  align-items: center;
  padding: calc(var(--header-height) + 3rem) 0 4rem;
}

.hero::before {
  position: absolute;
  width: min(38vw, 34rem);
  aspect-ratio: 1;
  border: 1px solid var(--color-line);
  background-image: linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px);
  background-size: 2rem 2rem;
  content: '';
  opacity: 0.45;
  right: -16vw;
  top: 12vh;
  pointer-events: none;
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 13fr) minmax(22rem, 11fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.hero__eyebrow {
  margin: 0 0 1.4rem;
  color: var(--color-text-muted);
}

.hero__eyebrow span { color: var(--color-accent); }

.hero__name {
  position: relative;
  margin: 0;
  font-size: clamp(4rem, 8.7vw, 9rem);
  font-weight: 530;
  letter-spacing: -0.082em;
  line-height: 0.83;
}

.hero__name > b {
  position: absolute;
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: clamp(1.1rem, 2vw, 2rem);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
}

.hero__name > b:first-child { top: -1.8rem; left: 0; }
.hero__name > b:last-child { right: 0; bottom: -1rem; }

.hero__name > span {
  display: block;
  overflow: hidden;
}

.hero__name i { display: block; font-style: normal; }

.hero__statement {
  max-width: 22ch;
  margin: 2rem 0 0;
  font-size: clamp(1.35rem, 2.2vw, 2.25rem);
  font-weight: 520;
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.hero__statement > span { color: #c67be5; font-family: var(--font-mono); font-size: 0.58em; }
.hero__statement q { color: var(--color-text); quotes: '"' '"'; }
.hero__statement q::before,
.hero__statement q::after { color: #d5b767; }

.hero__description {
  max-width: 55ch;
  margin: 1rem 0 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.hero__terminal { margin-top: 1.5rem; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 1.8rem; }

.hero__meta {
  display: grid;
  width: fit-content;
  gap: 0.45rem;
  margin-top: 2rem;
  color: var(--color-text-muted);
}

.hero__meta span { display: inline-flex; max-width: 100%; flex-wrap: wrap; align-items: center; gap: 0.45rem; padding-left: 1rem; overflow-wrap: anywhere; }
.hero__meta span:first-child,
.hero__meta span:last-child { padding-left: 0; }
.hero__meta span:first-child,
.hero__meta span:last-child,
.hero__meta b { color: var(--color-accent); font-weight: 500; }
.hero__meta i { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 12px var(--color-accent); }

@media (max-width: 1200px) {
  .hero { align-items: flex-start; }
  .hero__grid { grid-template-columns: 1fr; }
  .hero__copy { max-width: 58rem; }
  .hero__workbench { width: min(100%, 50rem); }
}

@media (max-width: 767px) {
  .hero { padding-top: calc(var(--header-height) + 2.5rem); }
  .hero__name { font-size: clamp(3.6rem, 17vw, 6rem); }
  .hero__grid { gap: 3rem; }
  .hero__workbench { margin-inline: auto; }
  .hero__actions { align-items: stretch; }
}
</style>
