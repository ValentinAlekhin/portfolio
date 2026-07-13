<script setup lang="ts">
import { profile } from '~/data/profile'

const { copy, localeCode } = usePortfolio()
const localePath = useLocalePath()
const route = useRoute()
const { time } = useLocalTime(profile.timeZone)
const hud = useState('pointer-hud', () => ({ x: 0, y: 0, active: false }))
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const isScrolled = ref(false)
const activeSection = ref('top')
const homePath = computed(() => localePath('/'))
const isHome = computed(() => !route.path.includes('/projects/'))
let observer: IntersectionObserver | undefined

function sectionHref(id: string) {
  return isHome.value ? `#${id}` : `${homePath.value}#${id}`
}

function formatCoordinate(value: number) {
  return String(value).padStart(4, '0')
}

onMounted(() => {
  const onScroll = () => {
    isScrolled.value = window.scrollY > 56
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const sections = copy.value.nav.items
    .map(item => document.getElementById(item.id))
    .filter((element): element is HTMLElement => Boolean(element))
  observer = new IntersectionObserver((entries) => {
    const visible = entries.find(entry => entry.isIntersecting)
    if (visible?.target.id) {
      activeSection.value = visible.target.id
    }
  }, { rootMargin: '-35% 0px -55%', threshold: 0 })
  sections.forEach(section => observer?.observe(section))
  scrollHandler = onScroll
})

let scrollHandler: (() => void) | undefined

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  observer?.disconnect()
})
</script>

<template>
  <header
    class="site-header"
    :class="{ 'site-header--scrolled': isScrolled }"
  >
    <div class="site-container site-header__main">
      <NuxtLink
        :to="homePath"
        class="site-brand"
        :aria-label="profile.displayName[localeCode]"
      >
        <span class="site-brand__mark">&gt;_</span>
        <span>alekhin.dev</span>
      </NuxtLink>

      <nav
        class="site-nav"
        :aria-label="copy.nav.label"
      >
        <a
          v-for="item in copy.nav.items"
          :key="item.id"
          :href="sectionHref(item.id)"
          :aria-current="activeSection === item.id ? 'location' : undefined"
        ><span>/</span>{{ item.label.toLowerCase().replaceAll(' ', '-') }}</a>
      </nav>

      <div class="site-header__actions">
        <div class="site-header__desktop-actions">
          <LocaleSwitcher :label="copy.nav.language" />
          <ThemeSwitch :label="copy.nav.theme" />
          <span class="availability system-label"><i /> {{ localeCode === 'ru' ? 'В СЕТИ' : 'ONLINE' }}</span>
          <button
            type="button"
            class="header-contact system-label"
            @click="contactOpen = true"
          >
            [ {{ copy.nav.contact }} ]
          </button>
        </div>
        <button
          type="button"
          class="header-contact header-contact--mobile system-label"
          @click="contactOpen = true"
        >
          [ {{ localeCode === 'ru' ? 'Связаться' : 'Contact' }} ]
        </button>
        <MobileNavigation />
      </div>
    </div>

    <div class="site-container site-header__telemetry system-label">
      <span>LOCAL {{ time }}</span>
      <span class="pointer-coordinates">X {{ formatCoordinate(hud.x) }} Y {{ formatCoordinate(hud.y) }}</span>
      <span>TTY / PORT 3000 / BUILD 03</span>
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
  background: color-mix(in srgb, var(--color-bg) 88%, #000);
  transition: background var(--duration-ui) ease, border-color var(--duration-ui) ease;
}

.site-header--scrolled {
  background: color-mix(in srgb, var(--color-bg) 97%, #000);
  box-shadow: 0 14px 44px rgb(0 0 0 / 14%);
}

.site-header__main {
  display: grid;
  height: 3.65rem;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
}

.site-brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
}

.site-brand__mark {
  color: var(--color-accent);
  font-weight: 800;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.site-nav a {
  position: relative;
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 520;
  text-decoration: none;
}

.site-nav a > span { color: var(--color-accent); }

.site-nav a::after {
  position: absolute;
  right: 0;
  bottom: 0.3rem;
  left: 0;
  height: 1px;
  background: var(--color-accent);
  content: '';
  opacity: 0;
  transform: scaleX(0.3);
  transition: opacity 160ms ease, transform 160ms ease;
}

.site-nav a:hover,
.site-nav a[aria-current='location'] { color: var(--color-text); }
.site-nav a[aria-current='location']::after { opacity: 1; transform: scaleX(1); }

.site-header__actions,
.site-header__desktop-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.site-header__desktop-actions { gap: 0.35rem; }

.availability {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.45rem;
  padding-inline: 0.55rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.availability i {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 70%, transparent);
}

.header-contact {
  min-height: 2.75rem;
  padding: 0.6rem 0.45rem;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  white-space: nowrap;
}

.header-contact--mobile { display: none; }

.site-header__telemetry {
  display: flex;
  height: 1.4rem;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--color-line) 55%, transparent);
  color: var(--color-text-muted);
  font-size: 0.58rem;
}

@media (max-width: 1240px) {
  .availability { display: none; }
}

@media (max-width: 1080px) {
  .site-header__main { grid-template-columns: 1fr auto; }
  .site-nav,
  .site-header__desktop-actions { display: none; }
  .header-contact--mobile { display: inline-flex; align-items: center; }
  .site-header__actions { gap: 0.45rem; }
}

@media (max-width: 767px) {
  .site-header__main { height: 3.55rem; }
  .site-header__telemetry { height: 0.95rem; font-size: 0.52rem; }
  .pointer-coordinates { display: none; }
}

@media (max-width: 390px) {
  .site-brand > span:last-child { display: none; }
  .header-contact--mobile { padding-inline: 0.55rem; font-size: 0.6rem; }
}
</style>
