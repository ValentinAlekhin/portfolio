<script setup lang="ts">
const { t } = useI18n()
const statementParts = computed(() => t('hero.statement').split(t('hero.highlight')))
const root = ref<HTMLElement | null>(null)
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const workbenchOpen = ref(false)
const { motionAllowed } = useMotionPreference()
let context: ReturnType<ReturnType<typeof useNuxtApp>['$gsap']['context']> | undefined

onMounted(() => {
  if (!root.value || !motionAllowed.value) return
  const { $gsap } = useNuxtApp()
  const detailSelector = window.matchMedia('(max-width: 767px)').matches
    ? '.hero__description, .hero__actions, .hero__meta'
    : '.hero__description, .hero__terminal, .hero__actions, .hero__meta'

  context = $gsap.context(() => {
    $gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__eyebrow', { autoAlpha: 0, y: 12, duration: 0.4 })
      .from('.hero__name span', { yPercent: 115, duration: 0.75, stagger: 0.08 }, '-=0.15')
      .from(detailSelector, { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.07 }, '-=0.45')
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
          <span aria-hidden="true">// 01</span> {{ t('profile.displayName') }}
        </p>
        <h1
          id="hero-title"
          class="hero__name"
        >
          <span><i>{{ statementParts[0] }}<em>{{ t('hero.highlight') }}</em>{{ statementParts[1] }}</i></span>
        </h1>
        <p class="hero__description">
          <span class="hero__description-desktop">{{ t('hero.description') }}</span>
          <span class="hero__description-mobile">{{ t('hero.mobileDescription') }}</span>
        </p>
        <div class="hero__terminal">
          <TypewriterLine :text="t('hero.terminal')" />
        </div>
        <div class="hero__actions">
          <BaseButton
            class="hero__action-contact"
            @click="contactOpen = true"
          >
            {{ t('hero.primary') }}
          </BaseButton>
          <BaseButton
            class="hero__action-projects"
            href="#projects"
            variant="secondary"
          >
            {{ t('hero.secondary') }}
          </BaseButton>
        </div>
        <div class="hero__meta system-label">
          <span class="hero__availability"><i aria-hidden="true" />{{ t('hero.available') }}</span>
          <span>{{ t('hero.experienceCaption') }}</span>
        </div>
      </div>
      <div
        class="hero__workbench"
        :class="{ 'hero__workbench--open': workbenchOpen }"
      >
        <button
          type="button"
          class="hero__workbench-toggle"
          :aria-expanded="workbenchOpen"
          aria-controls="hero-workbench-panel"
          @click="workbenchOpen = !workbenchOpen"
        >
          <span
            class="hero__workbench-lights"
            aria-hidden="true"
          ><i /><i /><i /></span>
          <span>~/valentin/portfolio.ts</span>
          <span>{{ t(workbenchOpen ? 'workbench.mobileClose' : 'workbench.mobileOpen') }}</span>
        </button>
        <div
          id="hero-workbench-panel"
          class="hero__workbench-panel"
        >
          <CodeWorkbench />
        </div>
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
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 0 0 1.4rem;
  color: var(--color-text-muted);
}

.hero__eyebrow span { color: var(--color-accent); }

.hero__name {
  position: relative;
  margin: 0;
  font-size: clamp(3.5rem, 5.6vw, 6.25rem);
  font-weight: 530;
  letter-spacing: -0.065em;
  line-height: 0.98;
  text-wrap: balance;
}

.hero__copy {
  position: relative;
  padding-block: 1.5rem;
}

.hero__copy::before,
.hero__copy::after {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-color: var(--color-control-border);
  border-style: solid;
  content: '';
  pointer-events: none;
}

.hero__copy::before { top: -0.5rem; left: -1rem; border-width: 1px 0 0 1px; }
.hero__copy::after { right: 0; bottom: -0.5rem; border-width: 0 1px 1px 0; }

.hero__name > span {
  display: block;
  overflow: hidden;
}

.hero__name i { display: block; font-style: normal; }
.hero__name em { color: var(--color-accent); font-style: normal; }

.hero__description {
  max-width: 55ch;
  margin: 1.75rem 0 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-small);
}

.hero__description-mobile { display: none; }
.hero__terminal { margin-top: 1.5rem; }
.hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; margin-top: 1.8rem; }
.hero__action-contact { padding-inline: 0.9rem; border: 1px solid var(--color-accent); background: color-mix(in srgb, var(--color-accent) 7%, var(--color-bg)); }

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.5rem;
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-line);
  color: var(--color-text-muted);
}

.hero__meta span { display: inline-flex; align-items: center; gap: 0.6rem; }
.hero__availability { color: var(--color-accent); }
.hero__meta i { width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 12px var(--color-accent); }

.hero__workbench-toggle { display: none; }

@media (min-width: 1001px) and (max-width: 1200px) {
  .hero__grid { gap: 2rem; }
  .hero__name { font-size: 5.3vw; }
}

@media (max-width: 1000px) {
  .hero { align-items: flex-start; }
  .hero__grid { grid-template-columns: 1fr; }
  .hero__copy { max-width: 58rem; }
  .hero__name { max-width: 14ch; font-size: clamp(3.5rem, 8vw, 5.5rem); }
  .hero__workbench { width: min(100%, 50rem); }
}

@media (max-width: 767px) {
  .hero {
    padding: calc(var(--header-height) + 2rem) 0 4rem;
  }

  .hero__grid { gap: 2rem; }

  .hero__name {
    font-size: clamp(2.5rem, 11.8vw, 4.75rem);
    line-height: 1;
  }

  .hero__description-desktop,
  .hero__terminal {
    display: none;
  }

  .hero__description-mobile { display: inline; }

  .hero__actions {
    align-items: stretch;
    margin-top: 1.5rem;
  }

  .hero__actions .hero__action-projects {
    color: var(--color-accent);
  }

  .hero__actions .hero__action-projects::before {
    content: '[';
  }

  .hero__meta {
    display: flex;
    width: auto;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-top: 1.5rem;
  }

  .hero__workbench {
    width: 100%;
    margin-inline: auto;
  }

  .hero__workbench-toggle {
    display: grid;
    width: 100%;
    min-height: 3rem;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--color-control-border);
    border-radius: 2px;
    background: color-mix(in srgb, var(--color-surface) 94%, #000);
    color: var(--color-text-muted);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.04em;
    text-align: left;
    text-transform: uppercase;
    transition: background var(--duration-fast) ease, color var(--duration-fast) ease;
  }

  .hero__workbench-toggle > span:nth-child(2) {
    overflow: hidden;
    color: var(--color-accent);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hero__workbench-toggle > span:last-child {
    white-space: nowrap;
  }

  .hero__workbench-toggle:hover,
  .hero__workbench-toggle:focus-visible {
    background: color-mix(in srgb, var(--color-accent) 9%, var(--color-surface));
    color: var(--color-text);
  }

  .hero__workbench-lights {
    display: flex;
    gap: 0.3rem;
  }

  .hero__workbench-lights i {
    width: 0.38rem;
    height: 0.38rem;
    border: 1px solid var(--color-control-border);
    border-radius: 50%;
  }

  .hero__workbench-lights i:first-child {
    background: var(--color-accent);
  }

  .hero__workbench-panel {
    display: none;
    margin-top: 0.75rem;
  }

  .hero__workbench--open .hero__workbench-panel {
    display: block;
  }
}
</style>
