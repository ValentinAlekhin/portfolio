<script setup lang="ts">
import type { PortfolioContent, ProjectItem } from '~/types/portfolio'

defineProps<{
  project: ProjectItem
  labels: PortfolioContent['projects']['labels']
}>()
</script>

<template>
  <article class="project-card">
    <ProjectPreview :project="project" />

    <div class="project-card__content">
      <div class="project-card__intro">
        <div>
          <UBadge
            v-if="project.featured"
            color="primary"
            variant="soft"
            size="sm"
            class="project-card__badge"
          >
            {{ labels.featured }}
          </UBadge>
          <h3>{{ project.title }}</h3>
          <p class="project-card__lead">
            {{ project.shortDescription }}
          </p>
        </div>

        <div
          v-if="project.url || project.repositoryUrl"
          class="project-card__actions"
        >
          <UButton
            v-if="project.url"
            :to="project.url"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="solid"
            size="md"
          >
            {{ labels.visit }}
            <span aria-hidden="true">↗</span>
          </UButton>
          <UButton
            v-if="project.repositoryUrl"
            :to="project.repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            size="md"
          >
            {{ labels.repository }}
          </UButton>
        </div>
      </div>

      <p class="project-card__description">
        {{ project.fullDescription }}
      </p>

      <div class="project-card__details">
        <div v-if="project.role?.length">
          <h4>{{ labels.role }}</h4>
          <ul class="tag-list">
            <li
              v-for="role in project.role"
              :key="role.item"
            >
              {{ role.item }}
            </li>
          </ul>
        </div>

        <div v-if="project.features?.length">
          <h4>{{ labels.features }}</h4>
          <ul class="feature-list">
            <li
              v-for="feature in project.features"
              :key="feature.item"
            >
              <span aria-hidden="true">✓</span>
              {{ feature.item }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="project.responsibilities?.length"
        class="project-card__responsibilities"
      >
        <h4>{{ labels.responsibilities }}</h4>
        <ul>
          <li
            v-for="responsibility in project.responsibilities"
            :key="responsibility.item"
          >
            {{ responsibility.item }}
          </li>
        </ul>
      </div>

      <div
        v-if="project.technologies?.length"
        class="technology-list"
        :aria-label="labels.technologies"
      >
        <span
          v-for="technology in project.technologies"
          :key="technology.label"
        >
          {{ technology.label }}
        </span>
      </div>

      <div class="project-card__result">
        <p class="eyebrow">
          {{ labels.result }}
        </p>
        <p>{{ project.result }}</p>
      </div>

      <ProjectMetrics
        v-if="project.metrics?.length"
        :metrics="project.metrics"
      />
    </div>
  </article>
</template>

<style scoped>
@reference "tailwindcss";

.project-card {
  @apply overflow-hidden border;

  border-color: var(--ui-border);
  border-radius: clamp(1.4rem, 3vw, 2.2rem);
  background: var(--ui-surface);
  box-shadow: var(--ui-shadow-card);
}

.project-card__content {
  padding: clamp(1.5rem, 4vw, 3rem);
}

.project-card__intro {
  @apply flex items-end justify-between;

  gap: 2rem;
}

.project-card__badge {
  @apply mb-4;
}

.project-card h3 {
  @apply m-0;

  color: var(--ui-text-highlighted);
  font-size: clamp(2.1rem, 5vw, 4rem);
  font-weight: 740;
  letter-spacing: -0.06em;
  line-height: 1;
}

.project-card__lead {
  max-width: 620px;
  margin: 1rem 0 0;
  color: var(--ui-text-toned);
  font-size: clamp(1rem, 1.5vw, 1.18rem);
  line-height: 1.6;
}

.project-card__actions {
  @apply flex flex-none flex-wrap;

  gap: 0.65rem;
}

.project-card__description {
  max-width: 900px;
  margin: 2rem 0 0;
  padding-top: 2rem;
  border-top: 1px solid var(--ui-border);
  color: var(--ui-text-muted);
  font-size: 1.04rem;
  line-height: 1.8;
}

.project-card__details {
  @apply grid;

  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2rem, 5vw, 5rem);
  margin-top: 2.7rem;
}

.project-card h4,
.project-card__responsibilities h4 {
  margin: 0 0 1rem;
  color: var(--ui-text-highlighted);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.tag-list,
.feature-list,
.project-card__responsibilities ul {
  @apply m-0 list-none p-0;
}

.tag-list {
  @apply flex flex-wrap;

  gap: 0.48rem;
}

.tag-list li {
  padding: 0.38rem 0.66rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.55rem;
  background: var(--ui-surface-muted);
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  font-weight: 650;
}

.feature-list {
  @apply grid;

  gap: 0.7rem;
}

.feature-list li {
  @apply grid;

  grid-template-columns: 1.3rem 1fr;
  color: var(--ui-text-toned);
  font-size: 0.92rem;
  line-height: 1.5;
}

.feature-list span {
  color: var(--ui-accent);
  font-weight: 800;
}

.project-card__responsibilities {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ui-border);
}

.project-card__responsibilities ul {
  @apply flex flex-wrap;

  gap: 0.55rem 1.5rem;
}

.project-card__responsibilities li {
  @apply relative;

  padding-left: 1rem;
  color: var(--ui-text-muted);
  font-size: 0.85rem;
}

.project-card__responsibilities li::before {
  @apply absolute rounded-full;

  top: 0.68em;
  left: 0;
  width: 0.28rem;
  height: 0.28rem;
  background: var(--ui-accent);
  content: "";
}

.technology-list {
  @apply flex flex-wrap;

  gap: 0.5rem;
  margin-top: 2rem;
}

.technology-list span {
  padding: 0.35rem 0.68rem;
  border: 1px solid var(--ui-border);
  border-radius: 999px;
  color: var(--ui-text-muted);
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.35;
}

.project-card__result {
  margin-top: 2.7rem;
  padding: clamp(1.4rem, 3vw, 2rem);
  border: 1px solid color-mix(in srgb, var(--ui-accent) 22%, var(--ui-border));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--ui-accent) 6%, var(--ui-surface-muted));
}

.project-card__result .eyebrow {
  margin-bottom: 0.65rem;
}

.project-card__result > p:last-child {
  max-width: 850px;
  margin: 0;
  color: var(--ui-text-toned);
  line-height: 1.72;
}

@media (max-width: 860px) {
  .project-card__intro {
    @apply grid items-start;

    grid-template-columns: 1fr;
  }

  .project-card__actions {
    @apply justify-start;
  }
}

@media (max-width: 640px) {
  .project-card__details {
    grid-template-columns: 1fr;
  }

  .project-card__actions {
    @apply grid;

    grid-template-columns: 1fr;
  }

  .project-card__actions > * {
    @apply w-full justify-center;
  }
}
</style>
