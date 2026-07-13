<script setup lang="ts">
import { profile } from '~/data/profile'

const { copy } = usePortfolio()
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
      <p class="contact-section__eyebrow system-label">
        <span>●</span> 06 / {{ copy.contact.eyebrow }}
      </p>
      <h2 id="contact-title">
        {{ copy.contact.title }}
      </h2>
      <p class="contact-section__description">
        {{ copy.contact.description }}
      </p>

      <div class="contact-section__links">
        <a :href="`mailto:${profile.email}`"><span class="system-label">EMAIL</span>{{ profile.email }}</a>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        ><span class="system-label">GITHUB</span>ValentinAlekhin ↗</a>
      </div>

      <div class="contact-section__actions">
        <BaseButton @click="contactOpen = true">
          {{ copy.contact.write }}
          <template #icon>
            ↗
          </template>
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="copyEmail"
        >
          {{ copy.contact.copy }}
        </BaseButton>
      </div>
      <p
        class="contact-section__feedback system-label"
        aria-live="polite"
      >
        {{ copied ? copy.contact.copied : '' }}
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-section { overflow: hidden; background: #090b09; color: #f0f2ea; }
.contact-section::before { position: absolute; width: 48rem; height: 48rem; border: 1px solid #283025; border-radius: 50%; content: ''; right: -12rem; bottom: -24rem; }
.contact-section__grid { position: relative; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1.5rem; }
.contact-section__eyebrow { grid-column: 1 / 4; margin: 0.5rem 0 0; color: #a6ad9e; }
.contact-section__eyebrow span { color: #a8ff60; }
.contact-section h2 { grid-column: 4 / -1; max-width: 11ch; margin: 0; font-size: clamp(3.8rem, 8vw, 8.8rem); font-weight: 520; letter-spacing: -0.075em; line-height: 0.85; }
.contact-section__description { grid-column: 7 / 12; max-width: 50ch; margin: 1.5rem 0 0; color: #a6ad9e; }
.contact-section__links { grid-column: 4 / 10; display: grid; margin-top: 4rem; border-top: 1px solid #283025; }
.contact-section__links a { display: grid; min-height: 4.7rem; grid-template-columns: 8rem 1fr; align-items: center; border-bottom: 1px solid #283025; color: #f0f2ea; text-decoration: none; }
.contact-section__links span { color: #a6ad9e; }
.contact-section__actions { grid-column: 4 / -1; display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 2rem; }
.contact-section :deep(.base-button) { --color-text: #f0f2ea; --color-control-border: #5c6b55; --color-accent: #a8ff60; --color-surface: #090b09; }
.contact-section__feedback { grid-column: 4 / -1; min-height: 1rem; margin: 0.5rem 0 0; color: #a8ff60; }

@media (max-width: 800px) {
  .contact-section__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
  .contact-section__eyebrow,
  .contact-section h2,
  .contact-section__description,
  .contact-section__links,
  .contact-section__actions,
  .contact-section__feedback { grid-column: 1 / -1; }
  .contact-section__links { margin-top: 2.5rem; }
  .contact-section__links a { grid-template-columns: 1fr; gap: 0.35rem; padding-block: 1rem; overflow-wrap: anywhere; }
}
</style>
