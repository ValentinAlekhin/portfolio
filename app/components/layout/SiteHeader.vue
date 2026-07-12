<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

import type { PortfolioContent } from '~/types/portfolio'

const props = defineProps<{
  site: PortfolioContent['site']
  navigation: PortfolioContent['navigation']
  contactHref: string
}>()

const sectionIds = computed(() => props.navigation.items.map(item => item.id))
const activeSection = useActiveSection(sectionIds)
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 16)
const isExternalContact = computed(() => /^https?:\/\//.test(props.contactHref))
</script>

<template>
  <header
    class="site-header"
    :class="{ 'site-header--scrolled': isScrolled }"
  >
    <div class="site-container site-header__inner">
      <a
        href="#top"
        class="brand"
        :aria-label="site.name"
      >
        <span
          class="brand__mark"
          aria-hidden="true"
        >{{ site.shortName }}</span>
        <span class="brand__name">{{ site.name }}</span>
      </a>

      <nav
        class="desktop-navigation"
        :aria-label="navigation.menuTitle"
      >
        <ul>
          <li
            v-for="item in navigation.items"
            :key="item.id"
          >
            <a
              :href="`#${item.id}`"
              :aria-current="activeSection === item.id ? 'location' : undefined"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <div class="site-header__desktop-controls">
          <ThemeSwitcher :label="navigation.themeLabel" />
          <LocaleSwitcher :label="navigation.languageLabel" />
          <a
            :href="contactHref"
            :target="isExternalContact ? '_blank' : undefined"
            :rel="isExternalContact ? 'noopener noreferrer' : undefined"
            class="site-header__contact"
          >
            {{ navigation.contactLabel }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <MobileNavigation
          :items="navigation.items"
          :active-section="activeSection"
          :menu-title="navigation.menuTitle"
          :open-label="navigation.menuOpenLabel"
          :close-label="navigation.menuCloseLabel"
          :contact-label="navigation.contactLabel"
          :contact-href="contactHref"
          :theme-label="navigation.themeLabel"
          :language-label="navigation.languageLabel"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
@reference "tailwindcss";

.site-header {
  @apply fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent;

  height: var(--header-height);
  transition: background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.site-header--scrolled {
  border-color: color-mix(in srgb, var(--ui-border) 68%, transparent);
  background: color-mix(in srgb, var(--ui-background) 91%, transparent);
  box-shadow: 0 6px 24px rgb(20 23 31 / 4%);
  backdrop-filter: blur(16px) saturate(120%);
}

.site-header__inner {
  @apply grid h-full items-center gap-6;

  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
}

.brand {
  @apply inline-flex w-fit items-center no-underline;

  gap: 0.7rem;
}

.brand__mark {
  @apply inline-flex items-center;
  height: 1.55rem;
  padding-right: 0.7rem;
  border-right: 1px solid var(--ui-border);
  color: var(--ui-accent);
  font-size: 0.8125rem;
  font-weight: 780;
  letter-spacing: -0.035em;
}

.brand__name {
  @apply whitespace-nowrap;

  color: var(--ui-text-highlighted);
  font-size: 0.88rem;
  font-weight: 690;
  letter-spacing: -0.02em;
}

.desktop-navigation ul {
  @apply m-0 flex list-none items-center p-0;

  gap: 1.35rem;
}

.desktop-navigation a {
  @apply inline-flex items-center no-underline;

  position: relative;
  min-height: 2.75rem;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  font-weight: 620;
  transition: color 180ms ease;
}

.desktop-navigation a:hover,
.desktop-navigation a[aria-current="location"] {
  color: var(--ui-text-highlighted);
}

.desktop-navigation a::after {
  @apply absolute rounded-full;
  right: 0;
  bottom: 0.25rem;
  left: 0;
  height: 1px;
  background: var(--ui-accent);
  content: "";
  opacity: 0;
  transform: scaleX(0.45);
  transition: opacity 180ms ease, transform 180ms ease;
}

.desktop-navigation a[aria-current="location"]::after {
  opacity: 1;
  transform: scaleX(1);
}

.site-header__actions,
.site-header__desktop-controls {
  @apply flex items-center justify-end;

  gap: 0.45rem;
}

.site-header__contact {
  @apply inline-flex min-h-9 items-center no-underline;
  gap: 0.45rem;
  padding: 0.48rem 0.72rem;
  border-radius: 0.55rem;
  background: var(--ui-accent);
  color: var(--ui-accent-contrast);
  font-size: 0.8125rem;
  font-weight: 680;
  transition: background-color 180ms ease, color 180ms ease;
}

.site-header__contact span {
  color: inherit;
  transition: transform 180ms ease;
}

.site-header__contact:hover {
  background: var(--ui-accent-hover);
  color: var(--ui-accent-contrast);
}

.site-header__contact:hover span {
  color: inherit;
  transform: translate(2px, -2px);
}

@media (max-width: 1120px) {
  .site-header__inner {
    grid-template-columns: 1fr auto;
  }

  .desktop-navigation,
  .site-header__desktop-controls {
    @apply hidden;
  }
}

@media (max-width: 640px) {
  .brand {
    gap: 0.55rem;
  }

  .brand__mark {
    padding-right: 0.55rem;
  }

  .brand__name {
    font-size: 0.82rem;
  }
}

@media (max-width: 360px) {
  .brand__name {
    @apply hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header__contact:hover span {
    transform: none;
  }
}
</style>
