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

const roleKeys = ['product', 'design', 'frontend', 'backend', 'architecture'] as const
const workflowKeys = ['create', 'compose', 'connect', 'report', 'share'] as const
const featureKeys = ['scene', 'catalog', 'layers', 'data'] as const
const roles = computed(() => roleKeys.map(key => t(`${translationKey.value}.roles.${key}`)))
const workflow = computed(() => workflowKeys.map((key, index) => ({
  index: String(index + 1).padStart(2, '0'),
  title: t(`${translationKey.value}.workflow.steps.${key}.title`),
  description: t(`${translationKey.value}.workflow.steps.${key}.description`),
})))
const features = computed(() => featureKeys.map(key => ({
  title: t(`${translationKey.value}.features.${key}.title`),
  description: t(`${translationKey.value}.features.${key}.description`),
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
    class="powersketch-case"
    tabindex="-1"
  >
    <section class="powersketch-hero">
      <div class="site-container">
        <div class="powersketch-hero__top system-label">
          <NuxtLink :to="homeProjects">[ {{ t('case.code.backCommand') }} ]</NuxtLink>
          <span>{{ t('case.code.caseFile', { index: project.index, period: project.period }) }}</span>
          <span>&#123; {{ t('case.code.status') }}: <i /> '{{ t(`projects.status.${project.status}`) }}' &#125;</span>
        </div>

        <div class="powersketch-hero__title">
          <p class="system-label">
            {{ t(`${translationKey}.eyebrow`) }}
          </p>
          <h1>{{ project.title }}<i>;</i></h1>
        </div>

        <div class="powersketch-hero__intro">
          <p>/* {{ content.summary }} */</p>
          <a
            :href="project.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="powersketch-live-link system-label"
          >[ {{ t('case.live') }} ]</a>
        </div>

        <div class="powersketch-manifest system-label">
          <span>{{ t('case.code.exportDefault') }} &#123;</span>
          <span>&nbsp;&nbsp;{{ t('case.code.role') }}: '{{ t('projects.roleLabel') }}',</span>
          <span>&nbsp;&nbsp;{{ t('case.code.stack') }}: [{{ project.stack.map(item => `'${item}'`).join(', ') }}],</span>
          <span>&nbsp;&nbsp;{{ t('case.code.production') }}: true,</span>
          <span>&#125;</span>
        </div>

        <ProjectMedia
          class="powersketch-hero__media"
          :media="media('editor')"
          priority
        />
      </div>
    </section>

    <section class="powersketch-metrics section-rule">
      <div class="site-container">
        <p class="case-label system-label">
          <span>// 01</span>{{ t(`${translationKey}.metrics.label`) }}.json
        </p>
        <dl>
          <div
            v-for="metric in project.metrics"
            :key="metric.labelKey"
          >
            <dt>{{ t(metric.labelKey) }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 02</span>{{ t('case.labels.context') }}.md
        </p>
        <div class="case-prose case-prose--large">
          <p>{{ content.description }}</p>
          <p class="case-prose__note">
            {{ t(`${translationKey}.audience`) }}
          </p>
        </div>
      </div>
      <div class="site-container case-media-wide">
        <ProjectMedia :media="media('landing')" />
      </div>
    </section>

    <section class="case-section case-section--surface section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 03</span>{{ t(`${translationKey}.workflow.label`) }}.flow
        </p>
        <div class="case-prose">
          <h2>{{ t(`${translationKey}.workflow.title`) }}</h2>
          <p>{{ t(`${translationKey}.workflow.description`) }}</p>
        </div>
      </div>
      <ol class="site-container workflow-list">
        <li
          v-for="item in workflow"
          :key="item.index"
        >
          <span class="system-label">{{ item.index }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </li>
      </ol>
      <div class="site-container case-media-pair">
        <ProjectMedia :media="media('dashboard')" />
        <ProjectMedia :media="media('projects')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 04</span>{{ t('case.labels.problem') }}.issue
        </p>
        <div class="case-prose">
          <h2>{{ t(`${translationKey}.challengeTitle`) }}</h2>
          <p>{{ content.challenge }}</p>
          <p class="case-constraint">
            {{ content.constraints }}
          </p>
        </div>
        <div class="case-aside system-label">
          {{ t(`${translationKey}.constraintAxis`) }}
        </div>
      </div>
    </section>

    <section class="case-section case-section--deep section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 05</span>{{ t('case.labels.architecture') }}.graph
        </p>
        <div class="case-prose">
          <h2>{{ t(`${translationKey}.systemTitle`) }}</h2>
          <p>{{ content.approach }}</p>
          <p>{{ content.architecture }}</p>
        </div>
      </div>

      <div
        class="site-container architecture-map system-label"
        :aria-label="t('case.architectureLabel')"
      >
        <span>catalog.device</span><i>=&gt;</i><span>svg.scene</span><i>=&gt;</i><span>project.state</span><i>=&gt;</i><span>report.build</span><i>=&gt;</i><span>export.svg</span>
      </div>

      <div class="site-container case-media-wide">
        <ProjectMedia :media="media('editor')" />
      </div>

      <div class="site-container feature-grid">
        <article
          v-for="(feature, index) in features"
          :key="feature.title"
        >
          <span class="system-label">listener[{{ index }}]</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>

      <div class="site-container case-media-pair">
        <ProjectMedia :media="media('library')" />
        <ProjectMedia :media="media('layers')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-split">
        <div>
          <p class="case-label system-label">
            <span>// 06</span>{{ t(`${translationKey}.customDevices.label`) }}.schema
          </p>
          <div class="case-prose">
            <h2>{{ t(`${translationKey}.customDevices.title`) }}</h2>
            <p>{{ t(`${translationKey}.customDevices.description`) }}</p>
          </div>
        </div>
        <ProjectMedia :media="media('customDevices')" />
      </div>
    </section>

    <section class="case-section case-section--surface section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 07</span>{{ t(`${translationKey}.reports.label`) }}.table
        </p>
        <div class="case-prose">
          <h2>{{ t(`${translationKey}.reports.title`) }}</h2>
          <p>{{ t(`${translationKey}.reports.description`) }}</p>
        </div>
      </div>
      <div class="site-container case-media-pair">
        <ProjectMedia :media="media('deviceReport')" />
        <ProjectMedia :media="media('wireReport')" />
      </div>
    </section>

    <section class="case-section section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 08</span>{{ t(`${translationKey}.handoff.label`) }}.output
        </p>
        <div class="case-prose">
          <h2>{{ t(`${translationKey}.handoff.title`) }}</h2>
          <p>{{ t(`${translationKey}.handoff.description`) }}</p>
        </div>
      </div>
      <div class="site-container case-media-pair case-media-pair--handoff">
        <ProjectMedia :media="media('sharing')" />
        <ProjectMedia :media="media('export')" />
      </div>
    </section>

    <section class="case-section case-section--surface section-rule">
      <div class="site-container case-split case-split--reverse">
        <ProjectMedia :media="media('subscription')" />
        <div>
          <p class="case-label system-label">
            <span>// 09</span>{{ t(`${translationKey}.productModel.label`) }}.plan
          </p>
          <div class="case-prose">
            <h2>{{ t(`${translationKey}.productModel.title`) }}</h2>
            <p>{{ t(`${translationKey}.productModel.description`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="case-section case-result section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 10</span>{{ t('case.labels.result') }}.log
        </p>
        <div class="case-prose case-prose--large">
          <h2>{{ t(`${translationKey}.resultTitle`) }}</h2>
          <p>{{ content.result }}</p>
        </div>
      </div>

      <div class="site-container case-role-grid">
        <div>
          <p class="case-label system-label">
            <span>// {{ t('case.labels.role') }}</span>
          </p>
          <p>{{ content.role }}</p>
        </div>
        <ul>
          <li
            v-for="role in roles"
            :key="role"
          >
            '{{ role }}',
          </li>
        </ul>
      </div>

      <div class="site-container case-stack">
        <p class="case-label system-label">
          {{ t('case.labels.stack') }}[]
        </p>
        <ul>
          <li
            v-for="item in project.stack"
            :key="item"
          >
            '{{ item }}',
          </li>
        </ul>
      </div>
    </section>

    <section class="case-next section-rule">
      <div class="site-container case-copy-grid">
        <p class="case-label system-label">
          <span>// 11</span>{{ t('case.labels.next') }}.command
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
.powersketch-case { background: var(--color-bg); }
.powersketch-hero { min-height: 100svh; padding: calc(var(--header-height) + 4rem) 0 clamp(5rem, 9vw, 9rem); }
.powersketch-hero__top { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.powersketch-hero__top a { color: var(--color-accent); text-decoration: none; }
.powersketch-hero__top i { display: inline-block; width: 0.42rem; height: 0.42rem; margin-right: 0.25rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 70%, transparent); }
.powersketch-hero__title { margin-top: clamp(3.5rem, 8vw, 7.5rem); }
.powersketch-hero__title p { margin: 0 0 1rem; color: var(--color-code-blue); }
.powersketch-hero h1 { margin: 0; font-size: clamp(4rem, 12vw, 12rem); font-weight: 560; letter-spacing: -0.09em; line-height: 0.78; }
.powersketch-hero h1 i { color: var(--color-accent); font-family: var(--font-mono); font-size: 0.16em; font-style: normal; letter-spacing: 0; }
.powersketch-hero__intro { display: grid; grid-template-columns: 7fr 5fr; align-items: end; gap: 2rem; margin-top: 3.5rem; }
.powersketch-hero__intro p { max-width: 64ch; margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: clamp(0.76rem, 1vw, 0.92rem); line-height: 1.7; }
.powersketch-live-link { justify-self: end; padding-bottom: 0.45rem; border-bottom: 1px solid var(--color-accent); text-decoration: none; }
.powersketch-manifest { display: grid; width: min(100%, 52rem); margin-top: 3rem; color: var(--color-text-muted); text-transform: none; }
.powersketch-manifest span:first-child,
.powersketch-manifest span:last-child { color: var(--color-accent); }
.powersketch-hero__media { margin-top: clamp(4rem, 8vw, 8rem); }

.powersketch-metrics { padding-block: 2.5rem; background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); }
.powersketch-metrics .site-container { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; }
.powersketch-metrics dl { display: grid; grid-template-columns: repeat(3, 1fr); margin: 0; }
.powersketch-metrics dl > div { display: flex; min-height: 8rem; flex-direction: column-reverse; justify-content: space-between; padding: 1rem 1.5rem; border-left: 1px solid var(--color-line); }
.powersketch-metrics dt { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.72rem; }
.powersketch-metrics dd { margin: 0; color: var(--color-accent); font-family: var(--font-mono); font-size: clamp(2.4rem, 5vw, 5rem); letter-spacing: -0.07em; line-height: 1; }

.case-section { padding-block: clamp(5rem, 9vw, 9rem); }
.case-section--surface { background: color-mix(in srgb, var(--color-surface) 88%, var(--color-bg)); }
.case-copy-grid { display: grid; grid-template-columns: 3fr 7fr 2fr; gap: 1.5rem; }
.case-label { margin: 0.45rem 0 0; color: var(--color-text-muted); }
.case-label span { margin-right: 0.7rem; color: var(--color-accent); }
.case-prose { grid-column: 2; }
.case-prose h2,
.case-next h2 { max-width: 11ch; margin: 0; font-size: clamp(2.7rem, 6vw, 6rem); font-weight: 550; letter-spacing: -0.07em; line-height: 0.9; }
.case-prose h2::before,
.case-next h2::before { display: block; margin-bottom: 0.9rem; color: var(--color-code-blue); content: 'const section ='; font-family: var(--font-mono); font-size: 0.12em; font-weight: 500; letter-spacing: 0; line-height: 1; }
.case-prose p { max-width: 56ch; margin: 1.6rem 0 0; color: var(--color-text-muted); font-size: clamp(1.08rem, 1.7vw, 1.4rem); }
.case-prose--large p { margin-top: 0; color: var(--color-text); font-size: clamp(1.55rem, 3.2vw, 3.35rem); line-height: 1.2; }
.case-prose--large .case-prose__note { margin-top: 2rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.7; }
.case-constraint { padding-top: 1.5rem; border-top: 1px solid var(--color-line); font-family: var(--font-mono); font-size: 0.78rem !important; }
.case-aside { color: var(--color-text-muted); writing-mode: vertical-rl; }
.case-media-wide,
.case-media-pair { margin-top: clamp(3rem, 6vw, 6rem); }
.case-media-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 2rem); align-items: start; }

.workflow-list { display: grid; grid-template-columns: repeat(5, 1fr); margin-top: clamp(3rem, 6vw, 6rem); list-style: none; border-top: 1px solid var(--color-line); }
.workflow-list li { min-height: 18rem; padding: 1.35rem; border-right: 1px solid var(--color-line); }
.workflow-list li:last-child { border-right: 0; }
.workflow-list span { color: var(--color-accent); }
.workflow-list h3 { margin: 4rem 0 1rem; font-family: var(--font-mono); font-size: clamp(1rem, 1.6vw, 1.45rem); font-weight: 500; line-height: 1.15; }
.workflow-list p { margin: 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.7rem; line-height: 1.6; }

.case-section--deep { background: var(--project-deep); color: var(--project-on-deep); }
.case-section--deep .case-label,
.case-section--deep .case-prose p,
.case-section--deep .feature-grid p { color: var(--project-muted-on-deep); }
.case-section--deep .case-prose h2::before { color: var(--color-accent); }
.case-section--deep :deep(.project-media) { --color-text-muted: var(--project-muted-on-deep); --color-line: color-mix(in srgb, var(--project-muted-on-deep) 28%, transparent); --color-control-border: color-mix(in srgb, var(--project-muted-on-deep) 48%, transparent); --project-media-bg: var(--project-deep-surface); }
.architecture-map { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 5rem; padding: 2rem; border: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 35%, transparent); color: var(--color-accent); }
.architecture-map i { color: var(--project-muted-on-deep); font-style: normal; }
.feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: clamp(3rem, 6vw, 6rem); border-top: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 30%, transparent); }
.feature-grid article { min-height: 17rem; padding: 1.5rem; border-right: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 30%, transparent); }
.feature-grid article:last-child { border-right: 0; }
.feature-grid span { color: var(--color-accent); }
.feature-grid h3 { margin: 4rem 0 1rem; color: var(--project-on-deep); font-family: var(--font-mono); font-size: clamp(1rem, 1.7vw, 1.55rem); font-weight: 500; }
.feature-grid p { margin: 0; font-family: var(--font-mono); font-size: 0.72rem; line-height: 1.6; }

.case-split { display: grid; grid-template-columns: 4fr 7fr; align-items: start; gap: clamp(2rem, 5vw, 6rem); }
.case-split .case-prose { margin-top: 4rem; }
.case-split .case-prose h2 { max-width: 8ch; }
.case-split--reverse { grid-template-columns: 7fr 4fr; }
.case-media-pair--handoff { grid-template-columns: 4fr 7fr; }

.case-result { background: color-mix(in srgb, var(--color-accent) 5%, var(--color-bg)); }
.case-result .case-prose--large h2 { margin-bottom: 2rem; }
.case-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 7rem); margin-top: clamp(4rem, 8vw, 8rem); padding-top: 2rem; border-top: 1px solid var(--color-line); }
.case-role-grid > div > p:last-child { max-width: 54ch; color: var(--color-text-muted); }
.case-role-grid ul,
.case-stack ul { display: flex; flex-wrap: wrap; margin: 0; list-style: none; }
.case-role-grid li,
.case-stack li { padding: 0.75rem 1rem; border: 1px solid var(--color-line); color: var(--color-code-string); font-family: var(--font-mono); font-size: 0.72rem; }
.case-stack { display: grid; grid-template-columns: 3fr 9fr; gap: 1.5rem; margin-top: 3rem; }

.case-next { padding-block: clamp(6rem, 10vw, 10rem); background: color-mix(in srgb, var(--color-accent) 10%, var(--color-surface)); }
.case-next p { max-width: 48ch; margin: 1.5rem 0 2rem; color: var(--color-text-muted); }

@media (max-width: 980px) {
  .workflow-list { grid-template-columns: repeat(2, 1fr); }
  .workflow-list li { min-height: 14rem; border-bottom: 1px solid var(--color-line); }
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .feature-grid article { min-height: 14rem; border-bottom: 1px solid color-mix(in srgb, var(--project-muted-on-deep) 30%, transparent); }
}

@media (max-width: 820px) {
  .powersketch-hero__top { flex-wrap: wrap; }
  .powersketch-hero__top span:nth-child(2) { width: 100%; order: 3; }
  .powersketch-hero__intro,
  .case-copy-grid,
  .case-split,
  .case-split--reverse,
  .case-role-grid { grid-template-columns: 1fr; }
  .powersketch-live-link { justify-self: start; }
  .case-label,
  .case-prose,
  .case-aside { grid-column: 1; }
  .case-aside { writing-mode: initial; }
  .powersketch-metrics .site-container,
  .case-stack { grid-template-columns: 1fr; }
  .case-media-pair,
  .case-media-pair--handoff { grid-template-columns: 1fr; }
  .case-split .case-prose { margin-top: 2rem; }
}

@media (max-width: 600px) {
  .powersketch-hero { padding: calc(var(--header-height) + 2.5rem) 0 4rem; }
  .powersketch-hero h1 { font-size: clamp(2.8rem, 16vw, 5rem); line-height: 0.84; }
  .powersketch-hero__intro { margin-top: 2.5rem; }
  .powersketch-manifest { overflow-wrap: anywhere; }
  .powersketch-metrics dl { grid-template-columns: 1fr; }
  .powersketch-metrics dl > div { min-height: 6rem; border-top: 1px solid var(--color-line); border-left: 0; }
  .workflow-list,
  .feature-grid { grid-template-columns: 1fr; }
  .workflow-list li,
  .feature-grid article { min-height: auto; border-right: 0; }
  .workflow-list h3,
  .feature-grid h3 { margin-top: 2rem; }
  .architecture-map { align-items: flex-start; flex-direction: column; }
}
</style>
