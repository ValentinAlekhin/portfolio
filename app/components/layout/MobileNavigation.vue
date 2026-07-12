<script setup lang="ts">
import type { NavigationItem } from '~/types/portfolio'

const props = defineProps<{
  items: NavigationItem[]
  activeSection: string
  menuTitle: string
  openLabel: string
  closeLabel: string
  contactLabel: string
  contactHref: string
  themeLabel: string
  languageLabel: string
}>()

const open = ref(false)
const isExternalContact = computed(() => /^https?:\/\//.test(props.contactHref))

function closeMenu() {
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="menuTitle"
    :close="true"
    side="right"
    :ui="{
      content: 'mobile-navigation__panel',
      body: 'mobile-navigation__body',
      header: 'mobile-navigation__header',
    }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      size="lg"
      square
      :aria-label="openLabel"
      class="mobile-menu-button"
    >
      <span
        class="menu-icon"
        aria-hidden="true"
      >
        <span />
        <span />
      </span>
    </UButton>

    <template #close>
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        square
        :aria-label="closeLabel"
        class="mobile-navigation__close"
      >
        <span aria-hidden="true">×</span>
      </UButton>
    </template>

    <template #body>
      <nav :aria-label="menuTitle">
        <ul class="mobile-navigation__list">
          <li
            v-for="item in items"
            :key="item.id"
          >
            <a
              :href="`#${item.id}`"
              :aria-current="activeSection === item.id ? 'location' : undefined"
              @click="closeMenu"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <UButton
        :to="contactHref"
        :target="isExternalContact ? '_blank' : undefined"
        :rel="isExternalContact ? 'noopener noreferrer' : undefined"
        color="primary"
        variant="solid"
        size="lg"
        block
        class="mobile-navigation__contact"
        @click="closeMenu"
      >
        {{ contactLabel }}
      </UButton>

      <div class="mobile-navigation__controls">
        <ThemeSwitcher :label="themeLabel" />
        <LocaleSwitcher :label="languageLabel" />
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
@reference "tailwindcss";

.mobile-menu-button {
  @apply hidden;
}

.menu-icon {
  @apply grid;

  width: 1.25rem;
  gap: 0.3rem;
}

.menu-icon span {
  @apply block w-full rounded-full bg-current;

  height: 2px;
}

.menu-icon span:last-child {
  @apply ml-auto;

  width: 72%;
}

:global(.mobile-navigation__panel) {
  width: min(90vw, 26rem) !important;
  border-left: 1px solid var(--ui-border) !important;
  background: var(--ui-surface) !important;
}

:global(.mobile-navigation__header) {
  border-bottom: 1px solid var(--ui-border);
}

:global(.mobile-navigation__body) {
  @apply flex flex-col gap-6;
}

.mobile-navigation__list {
  @apply m-0 grid list-none p-0;

  gap: 0.25rem;
}

.mobile-navigation__list a {
  @apply flex items-center no-underline;

  min-height: 3.4rem;
  padding-inline: 1rem;
  border-radius: 0.85rem;
  color: var(--ui-text-muted);
  font-size: 1.05rem;
  font-weight: 680;
}

.mobile-navigation__list a:hover,
.mobile-navigation__list a[aria-current="location"] {
  background: var(--ui-surface-muted);
  color: var(--ui-text-highlighted);
}

.mobile-navigation__controls {
  @apply mt-auto flex items-center justify-between border-t pt-5;

  border-color: var(--ui-border);
}

@media (max-width: 1120px) {
  .mobile-menu-button {
    @apply inline-flex;
  }
}
</style>
