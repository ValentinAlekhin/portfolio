<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { profile } from '~/data/profile'

const { t } = useI18n()
const feedback = ref('')
const { copy } = useClipboard({ legacy: true })
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await copy(profile.email)
    feedback.value = t('contact.copied')
  }
  catch {
    feedback.value = t('contact.copyFailed')
  }
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    feedback.value = ''
  }, 3000)
}

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
</script>

<template>
  <section
    id="contacts"
    class="page-section contact-section"
    aria-labelledby="contact-title"
  >
    <div class="site-container contact-section__grid">
      <h2 id="contact-title">
        {{ t('contact.title') }}
      </h2>
      <div class="contact-section__body">
        <a
          class="contact-section__email"
          :href="`mailto:${profile.email}`"
        >{{ profile.email }}</a>
        <div class="contact-section__other">
          <a
            :href="profile.telegram"
            target="_blank"
            rel="noopener noreferrer"
          >Telegram</a>
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub</a>
          <button
            type="button"
            @click="copyEmail"
          >
            {{ t('contact.copy') }}
          </button>
        </div>
        <p
          class="contact-section__feedback"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ feedback }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-section__grid {
  display: grid;
  grid-template-columns: minmax(0, 12.5rem) minmax(0, 1fr);
  gap: 3rem;
}

.contact-section h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.contact-section__body {
  min-width: 0;
}

.contact-section__email {
  display: inline-flex;
  max-width: 100%;
  min-height: 2.75rem;
  align-items: center;
  color: var(--color-text);
  font-size: clamp(1.5rem, 3.1vw, 2.625rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact-section__email:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.14em;
}

.contact-section__other {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: clamp(1rem, 3vw, 2.5rem);
  margin-top: 1.25rem;
}

.contact-section__other :is(a, button) {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: var(--font-size-small);
  text-decoration: none;
}

.contact-section__other :is(a, button):hover {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.contact-section__feedback {
  min-height: 1.5rem;
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-ui);
}

.contact-section :is(a, button):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

@media (max-width: 1023px) {
  .contact-section__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 767px) {
  .contact-section__email {
    font-size: clamp(1.125rem, 5vw, 1.5rem);
    letter-spacing: -0.02em;
  }
}
</style>
