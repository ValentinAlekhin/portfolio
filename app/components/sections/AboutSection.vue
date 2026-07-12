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
  gap: clamp(3rem, 8vw, 8rem);
}

.about-section :deep(.section-heading) {
  margin-bottom: 0;
}

.about-section__copy {
  @apply grid;

  gap: 1.25rem;
  padding-top: 2.1rem;
}

.about-section__copy p {
  @apply m-0;

  color: var(--ui-text-muted);
  font-size: 1.03rem;
  line-height: 1.82;
}

.about-section__copy p:first-child {
  color: var(--ui-text-toned);
  font-size: 1.18rem;
}

.about-facts {
  @apply grid grid-cols-4;

  margin: clamp(3rem, 7vw, 6rem) 0 0;
  border-block: 1px solid var(--ui-border);
}

.about-facts div {
  padding: 1.7rem clamp(0.8rem, 2.5vw, 1.8rem);
  border-right: 1px solid var(--ui-border);
}

.about-facts div:first-child {
  padding-left: 0;
}

.about-facts div:last-child {
  border-right: 0;
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
  font-size: 0.78rem;
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
    @apply grid-cols-2;
  }

  .about-facts div:nth-child(2) {
    border-right: 0;
  }

  .about-facts div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--ui-border);
  }

  .about-facts div:nth-child(3) {
    padding-left: 0;
  }
}

@media (max-width: 640px) {
  .about-facts {
    @apply grid-cols-1;
  }

  .about-facts div,
  .about-facts div:first-child,
  .about-facts div:nth-child(3) {
    padding-inline: 0;
    border-right: 0;
    border-bottom: 1px solid var(--ui-border);
  }

  .about-facts div:last-child {
    border-bottom: 0;
  }
}
</style>
