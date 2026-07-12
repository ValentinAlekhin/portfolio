<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

const props = defineProps<{
  availability: PortfolioContent['availability']
  contactHref: string
  contactLabel: string
}>()

const isExternalContact = computed(() => /^https?:\/\//.test(props.contactHref))
</script>

<template>
  <section
    v-if="availability.visible"
    class="availability-section"
    aria-labelledby="availability-title"
  >
    <div class="site-container">
      <RevealContent>
        <div class="availability-section__inner">
          <div>
            <p class="availability-section__status">
              <span
                :class="{ 'is-available': availability.available }"
                aria-hidden="true"
              />
              {{ availability.label }}
            </p>
            <h2 id="availability-title">
              {{ availability.title }}
            </h2>
          </div>

          <div class="availability-section__aside">
            <p>{{ availability.description }}</p>

            <dl v-if="availability.location || availability.timezone">
              <div v-if="availability.location">
                <dt>{{ availability.locationLabel }}</dt>
                <dd>{{ availability.location }}</dd>
              </div>
              <div v-if="availability.timezone">
                <dt>{{ availability.timezoneLabel }}</dt>
                <dd>{{ availability.timezone }}</dd>
              </div>
            </dl>

            <a
              :href="contactHref"
              :target="isExternalContact ? '_blank' : undefined"
              :rel="isExternalContact ? 'noopener noreferrer' : undefined"
              class="availability-section__link"
            >
              {{ contactLabel }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.availability-section {
  padding-block: clamp(4.5rem, 7vw, 7rem);
  background: var(--ui-accent-soft);
}

.availability-section__inner {
  @apply grid items-start;
  grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.58fr);
  gap: clamp(3rem, 9vw, 9rem);
}

.availability-section__status {
  @apply flex items-center;
  gap: 0.5rem;
  margin: 0 0 1.3rem;
  color: var(--ui-text-muted);
  font-size: 0.76rem;
  font-weight: 620;
}

.availability-section__status span {
  width: 0.43rem;
  height: 0.43rem;
  border-radius: 50%;
  background: var(--ui-text-dimmed);
}

.availability-section__status span.is-available {
  background: var(--ui-success);
}

.availability-section h2 {
  max-width: 820px;
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(2.2rem, 4.4vw, 4.25rem);
  font-weight: 680;
  letter-spacing: -0.058em;
  line-height: 1.02;
}

.availability-section__aside > p {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: 0.94rem;
  line-height: 1.7;
}

.availability-section__aside dl {
  @apply flex;
  gap: 2rem;
  margin: 1.4rem 0 0;
}

.availability-section__aside dt {
  color: var(--ui-text-dimmed);
  font-size: 0.65rem;
}

.availability-section__aside dd {
  margin: 0.15rem 0 0;
  color: var(--ui-text-toned);
  font-size: 0.8rem;
}

.availability-section__link {
  @apply inline-flex items-center no-underline;
  gap: 0.6rem;
  margin-top: 1.7rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid color-mix(in srgb, var(--ui-accent) 45%, transparent);
  color: var(--ui-text-highlighted);
  font-size: 0.86rem;
  font-weight: 680;
}

.availability-section__link span {
  color: var(--ui-accent);
  transition: transform 180ms ease;
}

.availability-section__link:hover span {
  transform: translateX(3px);
}

@media (max-width: 860px) {
  .availability-section__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .availability-section__aside {
    max-width: 650px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .availability-section__link:hover span {
    transform: none;
  }
}
</style>
