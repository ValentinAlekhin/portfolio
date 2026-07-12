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

      <a
        href="#top"
        class="site-footer__top"
      >
        {{ footer.backToTopLabel }}
        <span aria-hidden="true">↑</span>
      </a>
    </div>
  </footer>
</template>

<style scoped>
@reference "tailwindcss";

.site-footer {
  @apply border-t;

  padding-block: 1.75rem;
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
  font-size: 0.8125rem;
}

.site-footer__copyright {
  @apply text-center;
}

.site-footer__top {
  @apply inline-flex items-center justify-self-end no-underline;
  gap: 0.45rem;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  font-weight: 620;
}

.site-footer__top span {
  color: var(--ui-accent);
  transition: transform 180ms ease;
}

.site-footer__top:hover span {
  transform: translateY(-2px);
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
