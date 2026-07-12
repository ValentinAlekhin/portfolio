<script setup lang="ts">
import type { PortfolioContent } from '~/types/portfolio'

defineProps<{
  site: PortfolioContent['site']
  footer: PortfolioContent['footer']
}>()

const year = useState('copyright-year', () => new Date().getUTCFullYear())
</script>

<template>
  <footer class="site-footer">
    <div class="site-container site-footer__inner">
      <div>
        <p class="site-footer__name">
          {{ site.name }}
        </p>
        <p class="site-footer__role">
          {{ footer.role }} · {{ site.domain }}
        </p>
      </div>

      <p class="site-footer__copyright">
        © {{ year }} {{ footer.copyright }}
      </p>

      <UButton
        to="#top"
        color="neutral"
        variant="ghost"
        size="sm"
        class="site-footer__top"
      >
        {{ footer.backToTopLabel }}
        <span aria-hidden="true">↑</span>
      </UButton>
    </div>
  </footer>
</template>

<style scoped>
@reference "tailwindcss";

.site-footer {
  @apply border-t;

  padding-block: 2.2rem;
  border-color: var(--ui-border);
}

.site-footer__inner {
  @apply grid items-center gap-6;

  grid-template-columns: 1fr auto 1fr;
}

.site-footer__name,
.site-footer__role,
.site-footer__copyright {
  @apply m-0;
}

.site-footer__name {
  color: var(--ui-text-highlighted);
  font-size: 0.9rem;
  font-weight: 730;
}

.site-footer__role,
.site-footer__copyright {
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}

.site-footer__copyright {
  @apply text-center;
}

.site-footer__top {
  @apply justify-self-end;
}

@media (max-width: 640px) {
  .site-footer__inner {
    grid-template-columns: 1fr auto;
  }

  .site-footer__copyright {
    @apply text-left;

    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
