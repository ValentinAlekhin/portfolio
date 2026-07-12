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
        <div class="contacts-section__grid">
          <div class="contacts-section__copy">
            <p class="eyebrow">
              {{ contacts.eyebrow }}
            </p>
            <h2 id="contacts-title">
              {{ contacts.title }}
            </h2>
          </div>

          <div class="contacts-section__aside">
            <p>{{ contacts.description }}</p>

            <div class="contacts-section__actions">
              <template v-if="hasContacts">
                <a
                  v-if="contacts.telegram.url"
                  :href="contacts.telegram.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ contacts.telegram.label }}
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  v-if="contacts.email.value"
                  :href="`mailto:${contacts.email.value}`"
                >
                  {{ contacts.email.label }}
                  <span aria-hidden="true">↗</span>
                </a>
              </template>

              <p
                v-else
                class="contacts-section__placeholder"
              >
                {{ contacts.placeholder }}
              </p>
            </div>

            <p class="contacts-section__note">
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
  background: var(--ui-contact-background);
  color: #f3f1eb;
}

.contacts-section__grid {
  @apply grid items-end;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.55fr);
  gap: clamp(2.5rem, 7vw, 7rem);
}

.contacts-section .eyebrow {
  color: var(--ui-accent);
}

.contacts-section h2 {
  max-width: 830px;
  margin: 0;
  color: #f7f5ef;
  font-size: clamp(2.75rem, 5.5vw, 5.5rem);
  font-weight: 670;
  letter-spacing: -0.062em;
  line-height: 0.98;
}

.contacts-section__aside > p:first-child {
  margin: 0;
  color: #b8bac2;
  font-size: 1rem;
  line-height: 1.62;
}

.contacts-section__actions {
  @apply flex flex-wrap;
  gap: 0.75rem 1.5rem;
  margin-top: 1.6rem;
}

.contacts-section__actions a {
  @apply inline-flex items-center no-underline;
  gap: 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #515765;
  color: #f7f5ef;
  font-size: 1rem;
  font-weight: 660;
}

.contacts-section__actions a span {
  color: var(--ui-accent);
  transition: transform 180ms ease;
}

.contacts-section__actions a:hover span {
  transform: translate(3px, -3px);
}

.contacts-section__placeholder {
  margin: 0;
  padding-top: 1.1rem;
  border-top: 1px solid #3a3e48;
  color: #d0d1d6;
  font-size: 0.9375rem;
}

.contacts-section__note {
  margin: 1rem 0 0;
  color: #898d99;
  font-size: 0.8125rem;
}

@media (max-width: 860px) {
  .contacts-section__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .contacts-section__aside {
    max-width: 620px;
  }
}

@media (max-width: 640px) {
  .contacts-section h2 {
    font-size: clamp(2.25rem, 10vw, 2.75rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contacts-section__actions a:hover span {
    transform: none;
  }
}
</style>
