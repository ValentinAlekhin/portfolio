<script setup lang="ts">
import type { Project, ProjectContent, ProjectMedia } from '~/types/content'

const props = defineProps<{
  project: Project
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const homeProjects = computed(() => `${localePath('/')}#projects`)
const translationKey = computed(() => props.project.translationKey)

const content = computed<ProjectContent>(() => ({
  summary: t(`${translationKey.value}.summary`),
  description: t(`${translationKey.value}.description`),
  challenge: t(`${translationKey.value}.challenge`),
  role: t(`${translationKey.value}.role`),
  approach: t(`${translationKey.value}.approach`),
  architecture: t(`${translationKey.value}.architecture`),
  result: t(`${translationKey.value}.result`),
  constraints: t(`${translationKey.value}.constraints`),
}))

const roleKeys = ['frontend', 'cms', 'localization', 'production'] as const
const featureKeys = ['locales', 'themes', 'cms', 'media'] as const
const categoryKeys = ['all', 'private', 'commercial', 'cultural', 'competitions'] as const
const themeKeys = ['system', 'light', 'dark'] as const

const roles = computed(() => roleKeys.map(key => t(`${translationKey.value}.roles.${key}`)))
const features = computed(() => featureKeys.map(key => ({
  title: t(`${translationKey.value}.features.${key}.title`),
  description: t(`${translationKey.value}.features.${key}.description`),
})))
const categories = computed(() => categoryKeys.map(key => t(`${translationKey.value}.portfolio.categories.${key}`)))
const themes = computed(() => themeKeys.map(key => ({
  id: key,
  label: t(`${translationKey.value}.themes.items.${key}`),
})))

function media(id: string): ProjectMedia {
  const item = props.project.media.find(candidate => candidate.id === id)

  if (!item) {
    throw new Error(`Project media not found: ${id}`)
  }

  return item
}
</script>

<template>
  <main
    id="main-content"
    class="planes-case"
    tabindex="-1"
  >
    <section class="planes-hero">
      <div class="site-container">
        <div class="planes-hero__top system-label">
          <NuxtLink :to="homeProjects">[ {{ t('case.code.backCommand') }} ]</NuxtLink>
          <span>{{ t('case.code.caseFile', { index: project.index, period: project.period }) }}</span>
          <span>&#123; {{ t('case.code.status') }}: '{{ t(`projects.status.${project.status}`) }}' &#125;</span>
        </div>

        <div class="planes-hero__heading">
          <p class="system-label">
            {{ t(`${translationKey}.eyebrow`) }}
          </p>
          <h1>
            <span>PLANES</span>
            <small>architects</small>
          </h1>
        </div>

        <div class="planes-hero__intro">
          <p>{{ content.summary }}</p>
          <a
            :href="project.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="planes-live-link system-label"
          >[ {{ t('case.live') }} ]</a>
        </div>

        <ProjectMedia
          class="planes-hero__media"
          :media="media('landing')"
          priority
        />
      </div>
    </section>

    <section class="planes-metrics section-rule">
      <div class="site-container">
        <p class="planes-label system-label">
          <span>// 01</span>{{ t(`${translationKey}.metrics.label`) }}
        </p>
        <dl>
          <div
            v-for="metric in project.metrics"
            :key="metric.labelKey"
          >
            <dd>{{ metric.value }}</dd>
            <dt>{{ t(metric.labelKey) }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 02</span>{{ t('case.labels.context') }}
        </p>
        <div class="planes-lead">
          <p>{{ content.description }}</p>
          <p class="planes-lead__note">
            {{ t(`${translationKey}.audience`) }}
          </p>
        </div>
      </div>
      <div class="site-container planes-about">
        <div class="planes-about__index system-label">
          <span>02</span>
          <span>about.studio</span>
        </div>
        <ProjectMedia :media="media('about')" />
      </div>
    </section>

    <section class="planes-section planes-section--surface section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 03</span>{{ t('case.labels.problem') }}
        </p>
        <div class="planes-prose">
          <h2>{{ t(`${translationKey}.challengeTitle`) }}</h2>
          <p>{{ content.challenge }}</p>
          <p>{{ content.approach }}</p>
          <p class="planes-constraint system-label">
            {{ content.constraints }}
          </p>
        </div>
        <p class="planes-axis system-label">
          {{ t(`${translationKey}.constraintAxis`) }}
        </p>
      </div>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container planes-section-head">
        <p class="planes-label system-label">
          <span>// 04</span>{{ t(`${translationKey}.portfolio.label`) }}
        </p>
        <div class="planes-prose">
          <h2>{{ t(`${translationKey}.portfolio.title`) }}</h2>
          <p>{{ t(`${translationKey}.portfolio.description`) }}</p>
        </div>
      </div>
      <ul class="site-container planes-filters system-label">
        <li
          v-for="(category, index) in categories"
          :key="category"
          :class="{ active: index === 0 }"
        >
          {{ category }}
        </li>
      </ul>
      <div class="site-container planes-media-wide">
        <ProjectMedia :media="media('projects')" />
      </div>
    </section>

    <section class="planes-section planes-section--deep section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 05</span>{{ t(`${translationKey}.content.label`) }}
        </p>
        <div class="planes-prose">
          <h2>{{ t(`${translationKey}.content.title`) }}</h2>
          <p>{{ t(`${translationKey}.content.description`) }}</p>
          <p>{{ content.architecture }}</p>
        </div>
      </div>

      <div
        class="site-container planes-flow system-label"
        :aria-label="t('case.architectureLabel')"
      >
        <span>Strapi</span><i>→</i><span>PostgreSQL</span><i>→</i><span>Nuxt</span><i>→</i><span>RU / EN</span>
      </div>

      <div class="site-container planes-feature-grid">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
        >
          <span class="system-label">0{{ index + 1 }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>

    <section class="planes-section planes-section--themes section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 06</span>{{ t(`${translationKey}.themes.label`) }}
        </p>
        <div class="planes-prose">
          <h2>{{ t(`${translationKey}.themes.title`) }}</h2>
          <p>{{ t(`${translationKey}.themes.description`) }}</p>
        </div>
      </div>
      <ul
        class="site-container planes-theme-list"
        :aria-label="t(`${translationKey}.themes.label`)"
      >
        <li
          v-for="theme in themes"
          :key="theme.id"
          :class="`planes-theme-list__${theme.id}`"
        >
          <span class="system-label">{{ theme.label }}</span>
          <i aria-hidden="true" />
        </li>
      </ul>
    </section>

    <section class="planes-section section-rule">
      <div class="site-container planes-mobile-grid">
        <div>
          <p class="planes-label system-label">
            <span>// 07</span>{{ t(`${translationKey}.responsive.label`) }}
          </p>
          <div class="planes-prose">
            <h2>{{ t(`${translationKey}.responsive.title`) }}</h2>
            <p>{{ t(`${translationKey}.responsive.description`) }}</p>
          </div>
        </div>
        <ProjectMedia
          class="planes-mobile-media"
          :media="media('mobile')"
        />
      </div>
    </section>

    <section class="planes-section planes-result section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 08</span>{{ t('case.labels.result') }}
        </p>
        <div class="planes-lead">
          <h2>{{ t(`${translationKey}.resultTitle`) }}</h2>
          <p>{{ content.result }}</p>
        </div>
      </div>

      <div class="site-container planes-role-grid">
        <div>
          <p class="planes-label system-label">
            // {{ t('case.labels.role') }}
          </p>
          <p>{{ content.role }}</p>
        </div>
        <ul>
          <li
            v-for="role in roles"
            :key="role"
          >
            {{ role }}
          </li>
        </ul>
      </div>

      <div class="site-container planes-stack">
        <p class="planes-label system-label">
          {{ t('case.labels.stack') }}[]
        </p>
        <ul>
          <li
            v-for="item in project.stack"
            :key="item"
          >
            '{{ item }}'
          </li>
        </ul>
      </div>
    </section>

    <section class="planes-next section-rule">
      <div class="site-container planes-copy-grid">
        <p class="planes-label system-label">
          <span>// 09</span>{{ t('case.labels.next') }}
        </p>
        <div>
          <h2>{{ t('case.nextTitle') }}</h2>
          <p>{{ t('case.nextText') }}</p>
          <BaseButton href="#contacts">
            {{ t('hero.primary') }}
          </BaseButton>
        </div>
      </div>
    </section>

    <ContactSection />
  </main>
</template>

<style scoped lang="scss">
.planes-case { background: var(--color-bg); }
.planes-hero { min-height: 100svh; padding: calc(var(--header-height) + 3rem) 0 clamp(5rem, 9vw, 9rem); }
.planes-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.planes-hero__top a { color: var(--color-accent); text-decoration: none; }
.planes-hero__heading { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; align-items: end; margin-top: clamp(4rem, 9vw, 9rem); }
.planes-hero__heading p { align-self: start; margin: 0.5rem 0 0; color: var(--color-accent); }
.planes-hero h1 { display: flex; flex-direction: column; margin: 0; font-size: clamp(4.2rem, 14vw, 13rem); font-weight: 560; letter-spacing: -0.105em; line-height: 0.67; }
.planes-hero h1 small { align-self: flex-end; margin: 0.16em 0 0; font-size: 0.27em; font-weight: 450; letter-spacing: -0.06em; }
.planes-hero__intro { display: grid; grid-template-columns: 3fr 7fr 2fr; gap: 1.5rem; align-items: end; margin-top: clamp(3rem, 6vw, 6rem); }
.planes-hero__intro p { grid-column: 2; max-width: 54ch; margin: 0; color: var(--color-text-muted); font-size: clamp(1.1rem, 1.8vw, 1.5rem); }
.planes-live-link { justify-self: end; padding-bottom: 0.45rem; border-bottom: 1px solid var(--color-accent); text-decoration: none; }
.planes-hero__media { margin-top: clamp(4rem, 8vw, 8rem); }

.planes-metrics { padding-block: 2.5rem; background: var(--color-surface); }
.planes-metrics .site-container { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; }
.planes-metrics dl { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0; }
.planes-metrics dl > div { min-height: 8rem; padding: 1.25rem 1.5rem; border-left: 1px solid var(--color-line); }
.planes-metrics dd { margin: 0 0 1.8rem; color: var(--color-accent); font-size: clamp(2.6rem, 5vw, 5rem); font-weight: 500; letter-spacing: -0.08em; line-height: 0.85; }
.planes-metrics dt { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.7rem; }

.planes-section { padding-block: clamp(5rem, 9vw, 9rem); }
.planes-section--surface { background: color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)); }
.planes-copy-grid,
.planes-section-head { display: grid; grid-template-columns: 3fr 7fr 2fr; gap: 1.5rem; }
.planes-label { margin: 0.45rem 0 0; color: var(--color-text-muted); }
.planes-label span { margin-right: 0.75rem; color: var(--color-accent); }
.planes-lead,
.planes-prose { grid-column: 2; }
.planes-lead > p:first-of-type { max-width: 43ch; margin: 0; color: var(--color-text); font-size: clamp(1.6rem, 3.3vw, 3.4rem); letter-spacing: -0.045em; line-height: 1.18; }
.planes-lead__note { max-width: 56ch; margin: 2rem 0 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.7; }
.planes-prose h2,
.planes-lead h2,
.planes-next h2 { max-width: 13ch; margin: 0; font-size: clamp(2.7rem, 6vw, 6rem); font-weight: 500; letter-spacing: -0.075em; line-height: 0.92; }
.planes-prose p { max-width: 56ch; margin: 1.7rem 0 0; color: var(--color-text-muted); font-size: clamp(1.05rem, 1.55vw, 1.32rem); }
.planes-about { display: grid; grid-template-columns: 2fr 10fr; gap: 1.5rem; align-items: start; margin-top: clamp(4rem, 7vw, 7rem); }
.planes-about__index { display: flex; justify-content: space-between; padding-top: 0.8rem; border-top: 1px solid var(--color-line); color: var(--color-text-muted); }
.planes-about__index span:first-child { color: var(--color-accent); }
.planes-constraint { padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-size: 0.72rem !important; line-height: 1.65; }
.planes-axis { align-self: stretch; color: var(--color-text-muted); writing-mode: vertical-rl; }

.planes-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: clamp(3rem, 5vw, 5rem); list-style: none; }
.planes-filters li { padding: 0.8rem 1rem; border: 1px solid var(--color-line); color: var(--color-text-muted); }
.planes-filters li.active { border-color: var(--color-text); background: var(--color-text); color: var(--color-bg); }
.planes-media-wide { margin-top: 2rem; }

.planes-section--deep { background: var(--project-deep); color: var(--project-on-deep); }
.planes-section--deep .planes-label,
.planes-section--deep .planes-prose p,
.planes-section--deep .planes-feature-grid p { color: var(--project-muted-on-deep); }
.planes-flow { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: clamp(4rem, 7vw, 7rem); padding: 1.5rem; border-block: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); color: var(--color-accent); }
.planes-flow i { color: var(--project-muted-on-deep); font-style: normal; }
.planes-feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 2rem; }
.planes-feature-grid article { min-height: 16rem; padding: 1.5rem; border-right: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); }
.planes-feature-grid article:last-child { border-right: 0; }
.planes-feature-grid span { color: var(--color-accent); }
.planes-feature-grid h3 { margin: 4rem 0 1rem; color: var(--project-on-deep); font-size: clamp(1.2rem, 2vw, 1.7rem); font-weight: 500; line-height: 1.1; }
.planes-feature-grid p { margin: 0; font-size: 0.85rem; line-height: 1.65; }

.planes-section--themes { background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); }
.planes-theme-list { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: clamp(4rem, 7vw, 7rem); list-style: none; }
.planes-theme-list li { position: relative; min-height: clamp(15rem, 28vw, 28rem); overflow: hidden; border: 1px solid var(--color-line); }
.planes-theme-list li + li { border-left: 0; }
.planes-theme-list span { position: absolute; z-index: 1; top: 1rem; left: 1rem; padding: 0.45rem 0.65rem; background: var(--color-bg); color: var(--color-text); }
.planes-theme-list i { position: absolute; border: 1px solid currentColor; inset: 22% 16%; }
.planes-theme-list__system { background: linear-gradient(90deg, #f1eee8 50%, #1a1a18 50%); color: #9eaaa8; }
.planes-theme-list__light { background: #f1eee8; color: #171715; }
.planes-theme-list__dark { background: #1a1a18; color: #f1eee8; }

.planes-mobile-grid { display: grid; grid-template-columns: 7fr 5fr; gap: clamp(3rem, 8vw, 9rem); align-items: center; }
.planes-mobile-grid .planes-prose { margin-top: clamp(3rem, 6vw, 6rem); }
.planes-mobile-media { width: min(100%, 28rem); justify-self: center; }

.planes-result { background: var(--color-surface); }
.planes-result .planes-lead h2 { margin-bottom: 2rem; }
.planes-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 7rem); margin-top: clamp(4rem, 8vw, 8rem); padding-top: 2rem; border-top: 1px solid var(--color-line); }
.planes-role-grid > div > p:last-child { max-width: 54ch; color: var(--color-text-muted); }
.planes-role-grid ul,
.planes-stack ul { display: flex; align-content: flex-start; align-items: flex-start; align-self: start; flex-wrap: wrap; margin: 0; list-style: none; }
.planes-role-grid li,
.planes-stack li { padding: 0.75rem 1rem; border: 1px solid var(--color-line); color: var(--color-code-string); font-family: var(--font-mono); font-size: 0.72rem; }
.planes-stack { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; margin-top: 3rem; }

.planes-next { padding-block: clamp(6rem, 10vw, 10rem); background: color-mix(in srgb, var(--color-accent) 10%, var(--color-bg)); }
.planes-next p { max-width: 48ch; margin: 1.5rem 0 2rem; color: var(--color-text-muted); }

@media (max-width: 980px) {
  .planes-feature-grid { grid-template-columns: repeat(2, 1fr); }
  .planes-feature-grid article { min-height: 13rem; border-bottom: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); }
  .planes-theme-list li { min-height: 18rem; }
}

@media (max-width: 820px) {
  .planes-hero__top { flex-wrap: wrap; }
  .planes-hero__top span:nth-child(2) { width: 100%; order: 3; }
  .planes-hero__heading,
  .planes-hero__intro,
  .planes-copy-grid,
  .planes-section-head,
  .planes-about,
  .planes-mobile-grid,
  .planes-role-grid,
  .planes-stack { grid-template-columns: 1fr; }
  .planes-hero__intro p,
  .planes-lead,
  .planes-prose { grid-column: 1; }
  .planes-live-link { justify-self: start; }
  .planes-about__index { display: none; }
  .planes-axis { writing-mode: initial; }
  .planes-metrics .site-container { grid-template-columns: 1fr; }
  .planes-mobile-media { margin-top: 3rem; }
}

@media (max-width: 600px) {
  .planes-hero { padding: calc(var(--header-height) + 2.5rem) 0 4rem; }
  .planes-hero h1 { font-size: clamp(3.4rem, 20vw, 6rem); line-height: 0.72; }
  .planes-metrics dl,
  .planes-feature-grid { grid-template-columns: 1fr; }
  .planes-metrics dl > div { min-height: 6rem; border-top: 1px solid var(--color-line); border-left: 0; }
  .planes-feature-grid article { min-height: auto; border-right: 0; }
  .planes-feature-grid h3 { margin-top: 2rem; }
  .planes-flow { display: grid; padding: 0; border: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .planes-flow i { display: none; }
  .planes-flow span { display: flex; min-height: 5.5rem; align-items: flex-end; padding: 1rem; border-right: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 32%, transparent); }
  .planes-flow span:nth-of-type(2n) { border-right: 0; }
  .planes-flow span:nth-of-type(n + 3) { border-bottom: 0; }
  .planes-theme-list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .planes-theme-list li { min-height: 9rem; }
  .planes-theme-list li + li { border-top: 1px solid var(--color-line); border-left: 0; }
  .planes-theme-list span { top: 0.65rem; left: 0.65rem; padding: 0.35rem 0.45rem; font-size: 0.5rem; }
  .planes-theme-list i { inset: 44% 12% 12%; }
}
</style>
