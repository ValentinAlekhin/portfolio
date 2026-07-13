<script setup lang="ts">
const { copy } = usePortfolio()
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
      .from('.hero__map', { autoAlpha: 0, scale: 0.97, duration: 0.7 }, '-=0.65')
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
          <span>●</span> {{ copy.hero.eyebrow }}
        </p>
        <h1
          id="hero-title"
          class="hero__name"
        >
          <span><i>{{ copy.hero.name[0] }}</i></span>
          <span><i>{{ copy.hero.name[1] }}</i></span>
        </h1>
        <p class="hero__statement">
          {{ copy.hero.statement }}
        </p>
        <p class="hero__description">
          {{ copy.hero.description }}
        </p>
        <div class="hero__terminal">
          <TypewriterLine :text="copy.hero.terminal" />
        </div>
        <div class="hero__actions">
          <BaseButton @click="contactOpen = true">
            {{ copy.hero.primary }}
            <template #icon>
              ↗
            </template>
          </BaseButton>
          <BaseButton
            href="#projects"
            variant="secondary"
          >
            {{ copy.hero.secondary }}
            <template #icon>
              ↓
            </template>
          </BaseButton>
        </div>
        <div class="hero__meta system-label">
          <span><i /> {{ copy.hero.available }}</span>
          <span>{{ copy.hero.experience }}</span>
          <span>VUE / NUXT / TYPESCRIPT / NODE / GO</span>
        </div>
      </div>
      <div class="hero__map">
        <SystemMap />
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
  border-radius: 50%;
  content: '';
  opacity: 0.45;
  right: -16vw;
  top: 12vh;
  pointer-events: none;
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(22rem, 5fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.hero__eyebrow {
  margin: 0 0 1.4rem;
  color: var(--color-text-muted);
}

.hero__eyebrow span { color: var(--color-accent); }

.hero__name {
  margin: 0;
  font-size: clamp(4rem, 8.7vw, 9rem);
  font-weight: 530;
  letter-spacing: -0.082em;
  line-height: 0.83;
}

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

.hero__description {
  max-width: 55ch;
  margin: 1rem 0 0;
  color: var(--color-text-muted);
}

.hero__terminal { margin-top: 1.5rem; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 1.8rem; }

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.25rem;
  margin-top: 2rem;
  color: var(--color-text-muted);
}

.hero__meta span { display: inline-flex; align-items: center; gap: 0.45rem; }
.hero__meta i { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 12px var(--color-accent); }

@media (max-width: 1080px) {
  .hero { align-items: flex-start; }
  .hero__grid { grid-template-columns: 1fr; }
  .hero__copy { max-width: 58rem; }
  .hero__map { width: min(100%, 42rem); }
}

@media (max-width: 767px) {
  .hero { padding-top: calc(var(--header-height) + 2.5rem); }
  .hero__name { font-size: clamp(3.6rem, 17vw, 6rem); }
  .hero__grid { gap: 3rem; }
  .hero__map { margin-inline: auto; }
  .hero__actions { align-items: stretch; }
}
</style>
