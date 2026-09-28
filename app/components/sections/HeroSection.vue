<script setup lang="ts">
import asciiArt from '~/assets/asciiart.txt?raw'

const { t } = useI18n()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
</script>

<template>
  <section
    id="top"
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="site-container hero__grid">
      <div class="hero__copy">
        <p class="hero__name-mobile">
          {{ t('profile.displayName') }}
        </p>
        <h1 id="hero-title">
          {{ t('hero.statement') }}
        </h1>
        <div class="hero__actions">
          <BaseButton
            class="hero__primary"
            @click="contactOpen = true"
          >
            {{ t('hero.primary') }}
            <template #icon>
              <BaseIcon name="arrow-up-right" />
            </template>
          </BaseButton>
          <BaseButton
            class="hero__secondary"
            href="#projects"
            variant="secondary"
          >
            {{ t('hero.secondary') }}
            <template #icon>
              <BaseIcon name="arrow-down" />
            </template>
          </BaseButton>
        </div>
        <p class="hero__availability">
          <span aria-hidden="true" />{{ t('hero.available') }} · {{ t('hero.experienceCaption') }}
        </p>
      </div>
      <figure class="hero__portrait">
        <pre
          class="hero__ascii"
          aria-hidden="true"
        >{{ asciiArt }}</pre>
        <figcaption>{{ t('profile.displayName') }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero { padding-block: calc(var(--header-height) + 3rem) 2.5rem; }
.hero__grid { display: grid; grid-template-columns: minmax(0, 1fr) 18rem; align-items: center; gap: clamp(2rem, 4vw, 4rem); }
.hero__copy { min-width: 0; }
.hero__name-mobile { display: none; }
.hero h1 { max-width: 17ch; margin: 0; font-size: clamp(2.75rem, 4.2vw, 3.75rem); font-weight: 600; letter-spacing: -0.03em; line-height: 1.08; text-wrap: balance; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; }
.hero__availability { display: flex; align-items: center; gap: 0.65rem; margin: 1.75rem 0 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8rem; }
.hero__availability span { width: 0.4rem; height: 0.4rem; flex: 0 0 auto; background: var(--color-text); }
.hero__portrait { width: 18rem; margin: 0; }
.hero__ascii { width: 18rem; margin: 0; color: var(--color-text); font-family: var(--font-mono); font-size: 1.15px; font-weight: 700; line-height: 1; white-space: pre; user-select: none; }
.hero__portrait figcaption { margin-top: 0.85rem; color: var(--color-text-muted); font-size: 0.875rem; text-align: right; }
@media (max-width: 1023px) { .hero__grid { grid-template-columns: 1fr; } .hero__portrait { display: none; } .hero__name-mobile { display: block; margin: 0 0 1rem; color: var(--color-text-muted); font-size: 0.875rem; } }
@media (max-width: 767px) { .hero { padding-block: calc(var(--header-height) + 2rem) 2rem; } .hero h1 { font-size: clamp(2.25rem, 8vw, 3rem); } .hero__actions :deep(.base-button) { flex: 1 1 100%; } .hero__availability { line-height: 1.5; } }
</style>
