<script setup lang="ts">
import { profile } from '~/data/profile'

const { copy } = usePortfolio()
const { time } = useLocalTime(profile.timeZone)
const localePath = useLocalePath()
const year = new Date().getUTCFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-container site-footer__grid">
      <div class="site-footer__brand">
        <strong>&gt;_ alekhin.dev</strong>
        <span class="system-label">{{ copy.footer.role }}</span>
      </div>
      <div class="site-footer__links system-label">
        <LocaleSwitcher :label="copy.nav.language" />
        <a :href="`mailto:${profile.email}`">EMAIL</a>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        >GITHUB</a>
        <a
          :href="profile.telegram"
          target="_blank"
          rel="noopener noreferrer"
        >TELEGRAM</a>
      </div>
      <div class="site-footer__meta system-label">
        <span>LOCAL {{ time }}</span>
        <span>BUILD 02</span>
        <span>© {{ year }}</span>
      </div>
      <a
        :href="`${localePath('/')}#top`"
        class="site-footer__top system-label"
      >cd /top</a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer { padding-block: 2rem; border-top: 1px solid var(--color-line); }
.site-footer__grid { display: grid; grid-template-columns: 2fr 2fr 1.5fr auto; align-items: end; gap: 2rem; }
.site-footer__brand { display: grid; gap: 0.4rem; }
.site-footer__brand strong { font-size: 0.86rem; }
.site-footer__brand span,
.site-footer__meta { color: var(--color-text-muted); }
.site-footer__links { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.site-footer__links a,
.site-footer__top { min-height: 2.75rem; display: inline-flex; align-items: center; color: var(--color-text-muted); text-decoration: none; }
.site-footer__meta { display: grid; gap: 0.2rem; }
.site-footer__top { justify-self: end; }

@media (max-width: 800px) {
  .site-footer__grid { grid-template-columns: 1fr auto; }
  .site-footer__links,
  .site-footer__meta { grid-column: 1 / -1; }
  .site-footer__top { grid-column: 2; grid-row: 1; }
}
</style>
