<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const copied = ref(false)

async function copyEmail() {
  await navigator.clipboard.writeText(profile.email)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 2400)
}
</script>

<template>
  <section
    id="contacts"
    class="page-section contact-section"
    aria-labelledby="contact-title"
  >
    <div class="site-container contact-section__grid">
      <div
        class="contact-section__ascii"
        aria-hidden="true"
      >
        <pre>{{ t('contact.ascii') }}</pre>
      </div>
      <p class="contact-section__eyebrow system-label">
        <span>root@portfolio:~/contact$</span> ./start-conversation // {{ t('contact.eyebrow') }}
      </p>
      <h2 id="contact-title">
        <span>console.log(</span>{{ t('contact.title') }}<span>);</span>
      </h2>
      <p class="contact-section__description">
        /* {{ t('contact.description') }} */
      </p>

      <div class="contact-section__links">
        <a :href="`mailto:${profile.email}`"><span class="system-label">EMAIL</span>{{ profile.email }}</a>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        ><span class="system-label">GITHUB</span>github.com/ValentinAlekhin</a>
        <a
          :href="profile.telegram"
          target="_blank"
          rel="noopener noreferrer"
        ><span class="system-label">TELEGRAM</span>{{ profile.telegramHandle }}</a>
      </div>

      <div class="contact-section__actions">
        <BaseButton @click="contactOpen = true">
          mail --compose // {{ t('contact.write') }}
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="copyEmail"
        >
          pbcopy email.txt // {{ t('contact.copy') }}
        </BaseButton>
      </div>
      <p
        class="contact-section__feedback system-label"
        aria-live="polite"
      >
        {{ copied ? t('contact.copied') : '' }}
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-section { overflow: hidden; background: var(--contact-bg, #070907); color: var(--contact-text, #f0f2ea); }
.contact-section::before { position: absolute; opacity: 0.5; background-image: linear-gradient(var(--contact-line, #283025) 1px, transparent 1px), linear-gradient(90deg, var(--contact-line, #283025) 1px, transparent 1px); background-size: 2.5rem 2.5rem; content: ''; inset: 0; mask-image: linear-gradient(to bottom, transparent, #000 30%, #000); }
.contact-section__grid { position: relative; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1.5rem; }
.contact-section__ascii { grid-column: 1 / 4; color: var(--contact-accent, #a8ff60); font-family: var(--font-mono); font-size: clamp(0.45rem, 0.75vw, 0.65rem); line-height: 1.5; text-shadow: 0 0 15px color-mix(in srgb, var(--contact-accent, #a8ff60) 32%, transparent); }
.contact-section__ascii pre { margin: 0; }
.contact-section__eyebrow { grid-column: 4 / -1; margin: 0.5rem 0 0; color: var(--contact-muted, #a6ad9e); text-transform: none; }
.contact-section__eyebrow span { color: var(--contact-accent, #a8ff60); }
.contact-section h2 { grid-column: 4 / -1; max-width: 11ch; margin: 0; font-size: clamp(3.8rem, 8vw, 8.8rem); font-weight: 520; letter-spacing: -0.075em; line-height: 0.85; }
.contact-section h2 span { display: block; color: var(--contact-accent, #a8ff60); font-family: var(--font-mono); font-size: 0.09em; font-weight: 500; letter-spacing: 0; line-height: 2.2; }
.contact-section__description { grid-column: 7 / 12; max-width: 50ch; margin: 1.5rem 0 0; color: var(--contact-muted, #a6ad9e); }
.contact-section__description { font-family: var(--font-mono); font-size: 0.78rem; }
.contact-section__links { grid-column: 4 / 10; display: grid; margin-top: 4rem; border-top: 1px solid var(--contact-line, #283025); }
.contact-section__links a { display: grid; min-height: 4.7rem; grid-template-columns: 8rem 1fr; align-items: center; border-bottom: 1px solid var(--contact-line, #283025); color: var(--contact-text, #f0f2ea); text-decoration: none; }
.contact-section__links span { color: var(--contact-muted, #a6ad9e); }
.contact-section__actions { grid-column: 4 / -1; display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 2rem; }
.contact-section :deep(.base-button) { --color-text: var(--contact-text, #f0f2ea); --color-control-border: var(--contact-control-border, #5c6b55); --color-accent: var(--contact-accent, #a8ff60); --color-surface: var(--contact-surface, #090b09); }
.contact-section__feedback { grid-column: 4 / -1; min-height: 1rem; margin: 0.5rem 0 0; color: var(--contact-accent, #a8ff60); }

@media (max-width: 800px) {
  .contact-section__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
  .contact-section__eyebrow,
  .contact-section__ascii,
  .contact-section h2,
  .contact-section__description,
  .contact-section__links,
  .contact-section__actions,
  .contact-section__feedback { grid-column: 1 / -1; }
  .contact-section__links { margin-top: 2.5rem; }
  .contact-section__links a { grid-template-columns: 1fr; gap: 0.35rem; padding-block: 1rem; overflow-wrap: anywhere; }
}
</style>
