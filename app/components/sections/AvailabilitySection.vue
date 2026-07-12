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
    class="page-section availability-section"
    aria-labelledby="availability-title"
  >
    <div class="site-container">
      <RevealContent>
        <div class="availability-panel">
          <div>
            <AvailabilityBadge
              :available="availability.available"
              :label="availability.label"
            />
            <h2 id="availability-title">
              {{ availability.title }}
            </h2>
            <p>{{ availability.description }}</p>

            <dl
              v-if="availability.location || availability.timezone"
              class="availability-panel__details"
            >
              <div v-if="availability.location">
                <dt>{{ availability.locationLabel }}</dt>
                <dd>{{ availability.location }}</dd>
              </div>
              <div v-if="availability.timezone">
                <dt>{{ availability.timezoneLabel }}</dt>
                <dd>{{ availability.timezone }}</dd>
              </div>
            </dl>
          </div>

          <UButton
            :to="contactHref"
            :locale="false"
            :target="isExternalContact ? '_blank' : undefined"
            :rel="isExternalContact ? 'noopener noreferrer' : undefined"
            color="primary"
            variant="solid"
            size="xl"
          >
            {{ contactLabel }}
          </UButton>
        </div>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.availability-section {
  padding-top: 0;
}

.availability-panel {
  @apply relative grid items-center overflow-hidden border;

  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(2rem, 6vw, 6rem);
  padding: clamp(2rem, 5vw, 4rem);
  border-color: color-mix(in srgb, var(--ui-accent) 30%, var(--ui-border));
  border-radius: clamp(1.4rem, 3vw, 2rem);
  background: linear-gradient(130deg, color-mix(in srgb, var(--ui-accent) 10%, var(--ui-surface)), var(--ui-surface));
}

.availability-panel::after {
  @apply pointer-events-none absolute rounded-full;

  width: 18rem;
  height: 18rem;
  background: radial-gradient(circle, color-mix(in srgb, var(--ui-accent) 22%, transparent), transparent 70%);
  content: "";
  inset: -9rem -7rem auto auto;
}

.availability-panel :deep(.availability-badge) {
  margin-bottom: 1.35rem;
}

.availability-panel h2 {
  max-width: 820px;
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(2rem, 4vw, 3.6rem);
  font-weight: 720;
  letter-spacing: -0.055em;
  line-height: 1.03;
}

.availability-panel > div > p {
  max-width: 760px;
  margin: 1.3rem 0 0;
  color: var(--ui-text-muted);
  line-height: 1.75;
}

.availability-panel__details {
  @apply flex;

  gap: 2rem;
  margin: 1.5rem 0 0;
}

.availability-panel__details dt {
  color: var(--ui-text-dimmed);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.availability-panel__details dd {
  margin: 0.18rem 0 0;
  color: var(--ui-text-toned);
}

@media (max-width: 860px) {
  .availability-panel {
    @apply grid-cols-1 items-start;
  }

  .availability-panel > a,
  .availability-panel > button {
    width: fit-content;
  }
}

@media (max-width: 640px) {
  .availability-panel > a,
  .availability-panel > button {
    @apply w-full justify-center;
  }
}
</style>
