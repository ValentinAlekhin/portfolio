<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const year = new Date().getUTCFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-container site-footer__inner">
      <span class="site-footer__identity">© {{ year }} {{ profile.domain }}</span>
      <a
        href="#main-content"
        class="site-footer__top"
      >{{ t('footer.backToTop') }}</a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer { padding-block: 1.25rem; border-top: 1px solid var(--color-line); }
.site-footer__inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.site-footer__identity { color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-ui); white-space: nowrap; }
.site-footer a { display: inline-flex; min-height: 2.75rem; align-items: center; color: var(--color-text-muted); font-size: var(--font-size-ui); text-decoration: none; }
.site-footer a:hover { color: var(--color-text); text-decoration: underline; text-underline-offset: 0.2em; }
</style>
