<script setup lang="ts">
import { caseSections } from '~/data/caseSections'
import type { Project, ProjectMedia } from '~/types/content'
import { ensureTrailingSlash } from '~/utils/url'

const props = defineProps<{ project: Project }>()
const { t, te } = useI18n()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const { localeCode } = usePortfolio()
const localePath = useLocalePath()
const homeProjects = computed(() => `${ensureTrailingSlash(localePath('/'))}#projects`)
const cover = computed(() => props.project.media.find(item => item.src === props.project.cover) ?? props.project.media[0]!)
const sections = computed(() => caseSections[props.project.caseName].map(section => ({
  ...section,
  media: section.mediaIds.map((rawId): ProjectMedia => {
    const [id, theme] = rawId.split(':')
    const item = props.project.media.find(candidate => candidate.id === id)
    if (!item) throw new Error(`Project media not found: ${props.project.slug}/${rawId}`)
    if (theme === 'light' || theme === 'dark') {
      const src = item.sources?.[localeCode.value][theme]
      if (!src) throw new Error(`Project theme media not found: ${props.project.slug}/${rawId}`)
      return {
        ...item,
        id: rawId,
        src,
        sources: undefined,
        captionKey: `${props.project.translationKey}.themes.items.${theme}`,
        descriptionKey: `${props.project.translationKey}.themeExamples.${theme}`,
      }
    }
    return item
  }),
})))
const technicalKeys = computed(() => ['architecture', 'constraints', 'implementation']
  .map(suffix => `${props.project.translationKey}.${suffix}`)
  .filter(key => te(key)))
const period = computed(() => props.project.period.replace('NOW', t('case.present')))
</script>

<template>
  <main
    id="main-content"
    class="project-case"
    :data-project-theme="project.theme"
    tabindex="-1"
  >
    <div class="site-container">
      <div class="project-case__top">
        <NuxtLink :to="homeProjects">{{ t('case.back') }}</NuxtLink>
        <span>{{ period }}</span>
      </div>
      <header class="project-case__header">
        <p class="project-case__eyebrow">
          {{ t(`${project.translationKey}.eyebrow`) }}
        </p>
        <h1>{{ project.title }}</h1>
        <p class="project-case__summary">
          {{ t(`${project.translationKey}.summary`) }}
        </p>
        <p
          v-if="te(`${project.translationKey}.description`)"
          class="project-case__intro"
        >
          {{ t(`${project.translationKey}.description`) }}
        </p>
        <p
          v-if="te(`${project.translationKey}.audience`)"
          class="project-case__intro project-case__intro--muted"
        >
          {{ t(`${project.translationKey}.audience`) }}
        </p>
        <a
          v-if="project.externalUrl"
          class="project-case__external"
          :href="project.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t('case.live') }} <BaseIcon name="arrow-up-right" /></a>
      </header>
      <ProjectBrief :project="project" />
      <ProjectFacts :project="project" />
      <ProjectScreenshot
        class="project-case__cover"
        :media="cover"
        priority
      />
    </div>

    <section
      v-for="section in sections"
      :key="section.titleSuffix"
      class="project-case__section"
    >
      <div class="site-container">
        <div class="project-case__section-head">
          <div>
            <h2>{{ t(`${project.translationKey}.${section.titleSuffix}`) }}</h2>
            <p>{{ t(`${project.translationKey}.${section.textSuffix}`) }}</p>
          </div>
        </div>
        <ul
          v-if="section.itemsPrefix && section.itemNames?.length"
          class="project-case__items"
        >
          <li
            v-for="itemName in section.itemNames"
            :key="itemName"
          >
            <h3>{{ t(`${project.translationKey}.${section.itemsPrefix}.${itemName}.title`) }}</h3>
            <p>{{ t(`${project.translationKey}.${section.itemsPrefix}.${itemName}.description`) }}</p>
          </li>
        </ul>
        <div
          class="project-case__gallery"
          :class="{ 'project-case__gallery--single': section.media.length === 1 }"
        >
          <ProjectScreenshot
            v-for="item in section.media"
            :key="item.id"
            :media="item"
          />
        </div>
      </div>
    </section>

    <section class="project-case__details-section">
      <div class="site-container project-case__details-grid">
        <details class="technical-details">
          <summary>{{ t('case.technicalDetails') }} <BaseIcon name="chevron-down" /></summary>
          <p
            v-for="key in technicalKeys"
            :key="key"
          >
            {{ t(key) }}
          </p>
          <p v-if="!technicalKeys.length">
            {{ project.stack.join(' / ') }}
          </p>
        </details>
        <div class="project-case__next">
          <h2>{{ t('case.nextTitle') }}</h2>
          <p>{{ t('case.nextText') }}</p>
          <button
            type="button"
            @click="contactOpen = true"
          >
            {{ t('hero.primary') }} <BaseIcon name="arrow-up-right" />
          </button>
        </div>
      </div>
    </section>
    <ContactSection />
  </main>
</template>

<style scoped lang="scss">
.project-case { color: var(--color-text); background: var(--color-bg); }
.project-case__top { display: flex; justify-content: space-between; gap: 1rem; padding-top: calc(var(--header-height) + 2rem); padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-case__top a { color: var(--project-accent, var(--color-text)); text-decoration: none; }
.project-case__top a:hover, .project-case__external:hover, .project-case__next button:hover { text-decoration: underline; text-underline-offset: 0.2em; }
.project-case__header { max-width: 58rem; padding-block: 2rem 0; }
.project-case__eyebrow { margin: 0 0 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.project-case h1 { margin: 0; font-size: clamp(2.75rem, 4.5vw, 4rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.08; overflow-wrap: anywhere; }
.project-case__summary { max-width: 54ch; margin: 1rem 0 0; color: var(--color-text-muted); font-size: clamp(1rem, 1.25vw, 1.125rem); line-height: 1.6; }
.project-case__intro { max-width: 67ch; margin: 1rem 0 0; line-height: 1.65; }
.project-case__intro--muted { color: var(--color-text-muted); }
.project-case__external { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; color: var(--project-accent, var(--color-text)); font-size: var(--font-size-small); text-decoration: none; }
.project-case__cover { margin-block: 2.5rem; }
.project-case__section { padding-block: clamp(2.5rem, 4vw, 4rem); border-top: 1px solid var(--color-line); }
.project-case__section-head { max-width: 54rem; }
.project-case__section-head h2 { max-width: 28ch; margin: 0; font-size: clamp(2rem, 2.5vw, 2.25rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.16; }
.project-case__section-head p { max-width: 60ch; margin: 1rem 0 0; color: var(--color-text-muted); line-height: 1.7; }
.project-case__items { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 2rem; margin: 2rem 0 0; padding: 0; border-top: 1px solid var(--color-line); list-style: none; }
.project-case__items li { padding: 1rem 0; border-bottom: 1px solid var(--color-line); }
.project-case__items h3 { margin: 0 0 0.5rem; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; }
.project-case__items p { max-width: 65ch; margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.7; }
.project-case__gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: clamp(1rem, 2vw, 2rem); margin-top: 2rem; }
.project-case__gallery--single { grid-template-columns: 1fr; }
.project-case__gallery > :last-child:nth-child(odd) { grid-column: 1 / -1; }
.project-case__details-section { padding-block: clamp(2.5rem, 4vw, 4rem); border-top: 1px solid var(--color-line); }
.project-case__details-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr); gap: clamp(2rem, 6vw, 6rem); }
.technical-details { border-top: 1px solid var(--color-line); }
.technical-details summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--color-line); cursor: pointer; font-family: var(--font-mono); font-size: var(--font-size-small); list-style: none; }
.technical-details summary::-webkit-details-marker { display: none; }
.technical-details[open] summary :deep(svg) { transform: rotate(180deg); }
.technical-details p { max-width: 65ch; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.7; }
.project-case__next button:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
.project-case__next h2 { margin: 0; font-size: clamp(1.8rem, 2.5vw, 2.25rem); font-weight: 600; letter-spacing: -0.025em; }
.project-case__next p { max-width: 42ch; color: var(--color-text-muted); line-height: 1.6; }
.project-case__next button { padding: 0; border: 0; background: transparent; font: inherit; cursor: pointer; display: inline-flex; gap: 0.5rem; align-items: center; color: var(--project-accent, var(--color-text)); text-decoration: none; }
.project-case :is(a, summary):focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
@media (max-width: 767px) { .project-case__top { padding-top: calc(var(--header-height) + 1.5rem); } .project-case h1 { font-size: clamp(2.25rem, 9vw, 3rem); } .project-case__cover { margin-block: 2rem; } .project-case__gallery, .project-case__details-grid, .project-case__items { grid-template-columns: 1fr; } .project-case__gallery > :last-child:nth-child(odd) { grid-column: 1; } }
</style>
