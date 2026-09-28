<script setup lang="ts">
import { navigationItems } from '~/data/navigation'
import { ensureTrailingSlash, isLocalizedHomePath } from '~/utils/url'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const homePath = computed(() => ensureTrailingSlash(localePath('/')))
const isHome = computed(() => isLocalizedHomePath(route.path, homePath.value))

function sectionHref(id: string) {
  return isHome.value ? `#${id}` : `${homePath.value}#${id}`
}
</script>

<template>
  <header class="site-header">
    <div class="site-container site-header__inner">
      <NuxtLink
        :to="homePath"
        class="site-brand"
        :aria-label="t('profile.displayName')"
      >alekhin.dev</NuxtLink>

      <nav
        class="site-nav"
        :aria-label="t('nav.label')"
      >
        <a
          v-for="item in navigationItems"
          :key="item.id"
          :href="sectionHref(item.id)"
        >{{ t(item.labelKey) }}</a>
      </nav>

      <div class="site-header__actions">
        <LocaleSwitcher :label="t('nav.language')" />
        <ThemeSwitch :label="t('nav.theme')" />
        <button
          type="button"
          class="site-header__contact"
          @click="contactOpen = true"
        >
          {{ t('nav.contact') }}
        </button>
        <MobileNavigation />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  position: fixed;
  z-index: 500;
  top: 0;
  right: 0;
  left: 0;
  height: var(--header-height);
  border-bottom: 1px solid var(--color-line);
  background: var(--color-bg);
}

.site-header__inner {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1rem, 3vw, 2.5rem);
}

.site-brand {
  flex: none;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.045em;
  text-decoration: none;
}

.site-nav,
.site-header__actions {
  display: flex;
  align-items: center;
}

.site-nav {
  flex: 1;
  justify-content: center;
  gap: clamp(1rem, 2vw, 2rem);
}

.site-nav a {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 560;
  text-decoration: none;
  white-space: nowrap;
}

.site-nav a:hover,
.site-nav a:focus-visible { color: var(--color-text); }

.site-header__actions { flex: none; gap: 0.15rem; }

.site-header__contact {
  min-height: 2.75rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--color-text);
  border-radius: 0;
  margin-left: 0.6rem;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 650;
  white-space: nowrap;
}

.site-header__contact:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

@media (max-width: 1000px) {
  .site-nav,
  .site-header__contact { display: none; }
}

@media (max-width: 380px) {
  .site-brand { font-size: 0.91rem; }
  .site-header__actions { gap: 0; }
}
</style>
