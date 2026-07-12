<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

defineProps<{
  about: PortfolioContent['about']
}>()
</script>

<template>
  <section
    id="about"
    class="page-section about-section"
    aria-labelledby="about-title"
  >
    <div class="site-container">
      <RevealContent>
        <div class="about-section__grid">
          <SectionHeading
            :eyebrow="about.eyebrow"
            :title="about.title"
            title-id="about-title"
          />

          <div class="about-section__copy">
            <p
              v-for="paragraph in about.paragraphs"
              :key="paragraph.text"
            >
              {{ paragraph.text }}
            </p>
          </div>
        </div>

        <dl class="about-facts">
          <div
            v-for="fact in about.facts"
            :key="`${fact.value}-${fact.label}`"
          >
            <dt>{{ fact.value }}</dt>
            <dd>{{ fact.label }}</dd>
          </div>
        </dl>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.about-section__grid {
  @apply grid;

  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(2.5rem, 6vw, 6rem);
}

.about-section :deep(.section-heading) {
  margin-bottom: 0;
}

.about-section__copy {
  @apply grid;

  gap: 0.9rem;
  padding-top: 1.5rem;
}

.about-section__copy p {
  @apply m-0;

  color: var(--ui-text-muted);
  font-size: 1rem;
  line-height: 1.65;
}

.about-section__copy p:first-child {
  color: var(--ui-text-toned);
  font-size: 1.125rem;
}

.about-facts {
  @apply grid grid-cols-3;

  margin: clamp(2.25rem, 4.5vw, 4rem) 0 0;
  border-top: 1px solid var(--ui-border);
}

.about-facts div {
  padding: 1.25rem clamp(1rem, 3vw, 2.5rem) 0 0;
}

.about-facts div:first-child {
  padding-left: 0;
}

.about-facts dt {
  color: var(--ui-text-highlighted);
  font-size: clamp(1.35rem, 2.8vw, 2.15rem);
  font-weight: 740;
  letter-spacing: -0.045em;
  line-height: 1.1;
}

.about-facts dd {
  margin: 0.55rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .about-section__grid {
    @apply grid-cols-1;
  }

  .about-section__copy {
    padding-top: 0;
  }

  .about-facts {
    @apply grid-cols-3;
  }
}

@media (max-width: 640px) {
  .about-facts {
    @apply grid-cols-1;
  }

  .about-facts div,
  .about-facts div:first-child,
  .about-facts div:nth-child(3) {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--ui-border-soft);
  }

  .about-facts div:last-child {
    border-bottom: 0;
  }
}
</style>
