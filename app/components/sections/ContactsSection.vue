<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

const props = defineProps<{
  contacts: PortfolioContent['contacts']
}>()

const hasContacts = computed(() => Boolean(props.contacts.telegram.url || props.contacts.email.value))
</script>

<template>
  <section
    id="contacts"
    class="page-section contacts-section"
    aria-labelledby="contacts-title"
  >
    <div class="site-container">
      <RevealContent>
        <div class="contacts-panel">
          <div class="contacts-panel__copy">
            <p class="eyebrow">
              {{ contacts.eyebrow }}
            </p>
            <h2 id="contacts-title">
              {{ contacts.title }}
            </h2>
            <p>{{ contacts.description }}</p>
          </div>

          <div
            v-auto-animate="{ duration: 240, easing: 'ease-out' }"
            class="contacts-panel__actions"
          >
            <template v-if="hasContacts">
              <UButton
                v-if="contacts.telegram.url"
                :to="contacts.telegram.url"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                size="xl"
              >
                {{ contacts.telegram.label }}
                <span aria-hidden="true">↗</span>
              </UButton>
              <UButton
                v-if="contacts.email.value"
                :to="`mailto:${contacts.email.value}`"
                color="neutral"
                variant="outline"
                size="xl"
              >
                {{ contacts.email.label }}
              </UButton>
            </template>

            <p
              v-else
              class="contacts-panel__placeholder"
            >
              {{ contacts.placeholder }}
            </p>
            <p class="contacts-panel__note">
              {{ contacts.responseNote }}
            </p>
          </div>
        </div>
      </RevealContent>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.contacts-section {
  padding-top: 0;
}

.contacts-panel {
  @apply relative grid items-end overflow-hidden;

  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: clamp(2.5rem, 8vw, 8rem);
  padding: clamp(2.2rem, 6vw, 5rem);
  border-radius: clamp(1.5rem, 3.5vw, 2.5rem);
  background: #171b25;
  color: #f5f4ef;
  box-shadow: 0 30px 90px rgb(17 20 29 / 18%);
}

.contacts-panel::before {
  @apply pointer-events-none absolute rounded-full;

  width: 30rem;
  height: 30rem;
  background: radial-gradient(circle, rgb(91 124 250 / 34%), transparent 66%);
  content: "";
  filter: blur(12px);
  inset: -16rem -10rem auto auto;
}

.contacts-panel__copy,
.contacts-panel__actions {
  @apply relative z-1;
}

.eyebrow {
  margin: 0 0 1rem;
  color: var(--ui-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.4;
  text-transform: uppercase;
}

.contacts-panel h2 {
  max-width: 720px;
  margin: 0;
  color: #ffffff;
  font-size: clamp(2.25rem, 5vw, 4.3rem);
  font-weight: 720;
  letter-spacing: -0.055em;
  line-height: 1.03;
}

.contacts-panel__copy > p:last-child {
  max-width: 680px;
  margin: 1.4rem 0 0;
  color: #b9bdc8;
  font-size: 1.05rem;
  line-height: 1.75;
}

.contacts-panel__actions {
  @apply flex flex-wrap;

  gap: 0.75rem;
}

.contacts-panel__placeholder {
  @apply m-0 w-full;

  padding: 1rem 1.15rem;
  border: 1px solid #343b4c;
  border-radius: 0.9rem;
  background: #1e2430;
  color: #d7dae2;
  line-height: 1.5;
}

.contacts-panel__note {
  @apply w-full;

  margin: 0.4rem 0 0;
  color: #9298a8;
  font-size: 0.78rem;
}

@media (max-width: 860px) {
  .contacts-panel {
    @apply grid-cols-1;
  }
}

@media (max-width: 640px) {
  .contacts-panel h2 {
    font-size: clamp(2.15rem, 12vw, 3.2rem);
  }

  .contacts-panel__actions {
    @apply grid;
  }

  .contacts-panel__actions > a,
  .contacts-panel__actions > button {
    @apply w-full justify-center;
  }
}
</style>
