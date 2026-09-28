<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { profile } from '~/data/profile'

const { t } = useI18n()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const feedback = ref('')
const githubLabel = profile.github.replace(/^https?:\/\//, '')
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
      <div>
        <h2 id="contact-title">
          {{ t('contact.title') }}
        </h2>
        <p class="contact-section__description">
          {{ t('contact.description') }}
        </p>
        <div class="contact-section__actions">
          <BaseButton
            @click="contactOpen = true"
          >
            {{ t('contact.write') }}
            <template #icon>
              <BaseIcon name="arrow-up-right" />
            </template>
          </BaseButton>
          <BaseButton
            variant="secondary"
            @click="copyEmail"
          >
            {{ t('contact.copy') }}
          </BaseButton>
        </div>
        <p
          class="contact-section__feedback"
          aria-live="polite"
        >
          {{ feedback }}
        </p>
      </div>
      <div class="contact-section__links">
        <a :href="`mailto:${profile.email}`"><span>Email</span>{{ profile.email }} <BaseIcon name="arrow-up-right" /></a>
        <a
          :href="profile.telegram"
          target="_blank"
          rel="noopener noreferrer"
        ><span>Telegram</span>{{ profile.telegramHandle }} <BaseIcon name="arrow-up-right" /></a>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        ><span>GitHub</span>{{ githubLabel }} <BaseIcon name="arrow-up-right" /></a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-section { border-top: 1px solid var(--color-line); }
.contact-section__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr); gap: clamp(2rem, 4vw, 4rem); }
.contact-section h2 { max-width: 18ch; margin: 0; font-size: clamp(2rem, 2.8vw, 2.5rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.15; }
.contact-section__description { max-width: 52ch; margin: 0.85rem 0 0; color: var(--color-text-muted); line-height: 1.6; }
.contact-section__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-top: 1rem; }
.contact-section__feedback { min-height: 1.5rem; margin: 0.5rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-ui); }
.contact-section__links { align-self: start; border-top: 1px solid var(--color-line); }
.contact-section__links a { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr) auto; gap: 0.75rem; padding: 1rem 0; border-bottom: 1px solid var(--color-line); color: var(--color-text); font-size: var(--font-size-small); text-decoration: none; overflow-wrap: anywhere; }
.contact-section__links a span:first-child { color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.8125rem; }
.contact-section__links a:hover { text-decoration: underline; text-underline-offset: 0.2em; }
.contact-section :is(a, button):focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
@media (max-width: 800px) { .contact-section__grid { grid-template-columns: 1fr; } }
@media (max-width: 420px) { .contact-section__links a { grid-template-columns: 1fr auto; } .contact-section__links a span:first-child { grid-column: 1 / -1; } }
</style>
