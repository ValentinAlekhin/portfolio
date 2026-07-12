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
          <UButton
            :to="contactHref"
            :target="isExternalContact ? '_blank' : undefined"
            :rel="isExternalContact ? 'noopener noreferrer' : undefined"
            color="primary"
            variant="solid"
            size="sm"
          >
            {{ navigation.contactLabel }}
          </UButton>
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
  border-color: color-mix(in srgb, var(--ui-border) 82%, transparent);
  background: color-mix(in srgb, var(--ui-background) 88%, transparent);
  box-shadow: 0 8px 32px rgb(20 23 31 / 5%);
  backdrop-filter: blur(18px) saturate(130%);
}

.site-header__inner {
  @apply grid h-full items-center gap-6;

  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
}

.brand {
  @apply inline-flex w-fit items-center no-underline;

  gap: 0.72rem;
}

.brand__mark {
  @apply grid place-items-center border;

  width: 2.35rem;
  height: 2.35rem;
  border-color: var(--ui-border);
  border-radius: 0.7rem;
  background: var(--ui-surface);
  color: var(--ui-text-highlighted);
  box-shadow: 0 8px 22px rgb(25 28 38 / 7%);
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: -0.02em;
}

.brand__name {
  @apply whitespace-nowrap;

  color: var(--ui-text-highlighted);
  font-size: 0.92rem;
  font-weight: 740;
  letter-spacing: -0.02em;
}

.desktop-navigation ul {
  @apply m-0 flex list-none items-center p-0;

  gap: 0.12rem;
}

.desktop-navigation a {
  @apply inline-flex items-center no-underline;

  min-height: 2.75rem;
  padding-inline: 0.78rem;
  border-radius: 0.75rem;
  color: var(--ui-text-muted);
  font-size: 0.86rem;
  font-weight: 650;
  transition: color 180ms ease, background-color 180ms ease;
}

.desktop-navigation a:hover,
.desktop-navigation a[aria-current="location"] {
  background: color-mix(in srgb, var(--ui-accent) 9%, transparent);
  color: var(--ui-text-highlighted);
}

.desktop-navigation a[aria-current="location"] {
  box-shadow: inset 0 -2px var(--ui-accent);
}

.site-header__actions,
.site-header__desktop-controls {
  @apply flex items-center justify-end;

  gap: 0.45rem;
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
  .brand__name {
    @apply hidden;
  }
}
</style>
