<script setup lang="ts">
import type { PortfolioContent, ProjectItem } from '~/types/portfolio'

defineProps<{
  project: ProjectItem
  labels: PortfolioContent['projects']['labels']
  index: number
}>()
</script>

<template>
  <article class="project-case">
    <a
      v-if="project.url"
      :href="project.url"
      target="_blank"
      rel="noopener noreferrer"
      class="project-case__visual"
      :aria-label="`${labels.visit}: ${project.title}`"
    >
      <ProjectPreview :project="project" />
    </a>
    <div
      v-else
      class="project-case__visual"
    >
      <ProjectPreview :project="project" />
    </div>

    <div class="project-case__content">
      <p class="project-case__kicker">
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ project.featured ? labels.featured : labels.role }}
      </p>

      <h3>{{ project.title }}</h3>
      <p class="project-case__lead">
        {{ project.shortDescription }}
      </p>

      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="project-case__link"
      >
        {{ labels.visit }}
        <span aria-hidden="true">↗</span>
      </a>

      <dl
        v-if="project.role?.length"
        class="project-case__details"
      >
        <div>
          <dt>{{ labels.role }}</dt>
          <dd>{{ project.role.map(role => role.item).join(' · ') }}</dd>
        </div>
      </dl>

      <div
        v-if="project.features?.length"
        class="project-case__features"
      >
        <h4>{{ labels.features }}</h4>
        <ul>
          <li
            v-for="feature in project.features"
            :key="feature.item"
          >
            <span aria-hidden="true">—</span>
            {{ feature.item }}
          </li>
        </ul>
      </div>

      <p
        v-if="project.technologies?.length"
        class="project-case__technologies"
        :aria-label="labels.technologies"
      >
        <span
          v-for="technology in project.technologies"
          :key="technology.label"
        >{{ technology.label }}</span>
      </p>

      <div class="project-case__result">
        <h4>{{ labels.result }}</h4>
        <p>{{ project.result }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
@reference "tailwindcss";

.project-case {
  @apply grid items-start;
  grid-template-columns: minmax(0, 1.28fr) minmax(340px, 0.72fr);
  gap: clamp(2.25rem, 4.5vw, 4.75rem);
}

.project-case__visual {
  @apply block min-w-0 no-underline;
  padding: clamp(0.8rem, 1.7vw, 1.35rem);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--ui-surface-muted) 78%, var(--ui-accent-soft));
}

.project-case__visual :deep(.powersketch-preview) {
  transition: border-color 220ms ease, transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

a.project-case__visual:hover :deep(.powersketch-preview) {
  border-color: color-mix(in srgb, var(--ui-accent) 42%, var(--ui-border));
  transform: translateY(-3px);
}

.project-case__content {
  min-width: 0;
  padding-top: 0.35rem;
}

.project-case__kicker {
  @apply flex items-center;
  gap: 0.65rem;
  margin: 0 0 1.2rem;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  font-weight: 620;
}

.project-case__kicker span {
  color: var(--ui-accent);
  font-variant-numeric: tabular-nums;
}

.project-case h3 {
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(2.7rem, 4.5vw, 4.7rem);
  font-weight: 690;
  letter-spacing: -0.062em;
  line-height: 0.98;
}

.project-case__lead {
  margin: 1.25rem 0 0;
  color: var(--ui-text-toned);
  font-size: clamp(1.03rem, 1.35vw, 1.18rem);
  line-height: 1.52;
}

.project-case__link {
  @apply inline-flex items-center no-underline;
  gap: 0.55rem;
  margin-top: 1.2rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid color-mix(in srgb, var(--ui-accent) 42%, transparent);
  color: var(--ui-text-highlighted);
  font-size: 0.9375rem;
  font-weight: 680;
}

.project-case__link span {
  color: var(--ui-accent);
  transition: transform 180ms ease;
}

.project-case__link:hover span {
  transform: translate(3px, -3px);
}

.project-case__details {
  @apply grid;
  gap: 0.9rem;
  margin: 1.65rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ui-border-soft);
}

.project-case__details div {
  @apply grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
}

.project-case__details dt,
.project-case h4 {
  color: var(--ui-text-dimmed);
  font-size: 0.8125rem;
  font-weight: 680;
  letter-spacing: 0.035em;
}

.project-case__details dd {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: 0.875rem;
  line-height: 1.55;
}

.project-case__features {
  margin-top: 1.4rem;
}

.project-case h4 {
  margin: 0 0 0.75rem;
}

.project-case__features ul {
  @apply m-0 grid list-none p-0;
  gap: 0.5rem;
}

.project-case__features li {
  @apply grid;
  grid-template-columns: 1rem 1fr;
  color: var(--ui-text-toned);
  font-size: 1rem;
  line-height: 1.55;
}

.project-case__features li span {
  color: var(--ui-accent);
}

.project-case__technologies {
  @apply flex flex-wrap;
  margin: 1.25rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  font-weight: 620;
}

.project-case__technologies span + span::before {
  margin-inline: 0.45rem;
  color: var(--ui-border);
  content: "·";
}

.project-case__result {
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--ui-border-soft);
}

.project-case__result p {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 1050px) {
  .project-case {
    grid-template-columns: 1fr;
    gap: 2.25rem;
  }

  .project-case__content {
    max-width: 760px;
  }
}

@media (max-width: 640px) {
  .project-case__visual {
    margin-inline: -0.35rem;
    padding: 0.45rem;
    border-radius: 0.95rem;
  }

  .project-case h3 {
    font-size: clamp(2.5rem, 11vw, 3rem);
  }

  .project-case__details div {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  a.project-case__visual:hover :deep(.powersketch-preview),
  .project-case__link:hover span {
    transform: none;
  }
}
</style>
