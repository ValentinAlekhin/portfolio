<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { navigationItems } from '~/data/navigation'

const { t } = useI18n()
const localePath = useLocalePath()
const open = ref(false)
const homePath = computed(() => localePath('/'))
const contactOpen = useState<boolean>('contact-dialog-open', () => false)

function openContact() {
  open.value = false
  contactOpen.value = true
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <button
        type="button"
        class="mobile-menu-trigger"
        :aria-label="t('nav.open')"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="mobile-nav-overlay" />
      <DialogContent class="mobile-nav-panel">
        <div class="mobile-nav-panel__top">
          <DialogTitle class="system-label">
            {{ t('nav.drawerTitle') }}
          </DialogTitle>
          <DialogDescription class="sr-only">
            {{ t('nav.label') }}
          </DialogDescription>
          <DialogClose as-child>
            <DialogCloseButton :label="t('nav.close')" />
          </DialogClose>
        </div>

        <nav :aria-label="t('nav.label')">
          <ul class="mobile-nav-list">
            <li
              v-for="(item, index) in navigationItems"
              :key="item.id"
            >
              <DialogClose as-child>
                <a :href="`${homePath}#${item.id}`">
                  <span class="system-label">0{{ index + 1 }}</span>
                  <strong>/{{ t(item.labelKey).toLowerCase().replaceAll(' ', '-') }}</strong>
                  <i aria-hidden="true">↵</i>
                </a>
              </DialogClose>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          class="mobile-nav-contact"
          @click="openContact"
        >
          <span aria-hidden="true">&gt;_</span>
          {{ t('nav.contact') }}
          <kbd aria-hidden="true">ENTER</kbd>
        </button>

        <div
          class="mobile-nav-runtime"
          aria-hidden="true"
        >
          <p class="system-label">
            {{ t('nav.runtime') }}
          </p>
          <pre>┌─ route_table ───────┐
│  01  ./projects    │
│  02  ./pipeline    │
│  03  ./process     │
│  04  ./readme      │
└────────────────────┘</pre>
          <span class="system-label"><i /> {{ t('nav.routesReady') }}</span>
        </div>

        <div class="mobile-nav-controls">
          <ThemeSwitch :label="t('nav.theme')" />
          <LocaleSwitcher :label="t('nav.language')" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.mobile-menu-trigger {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0.8rem 0.65rem;
  border: 0;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
}

.mobile-menu-trigger span {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--color-text);
}

.mobile-menu-trigger span + span {
  width: 70%;
  margin-top: 0.45rem;
  margin-left: auto;
}

.mobile-menu-trigger:focus-visible {
  outline: 0;
  background: transparent;
}

.mobile-menu-trigger:focus-visible span { background: var(--color-accent); }

.mobile-nav-overlay,
.dialog-overlay {
  position: fixed;
  z-index: 800;
  background: rgb(3 5 3 / 82%);
  backdrop-filter: blur(4px);
  inset: 0;
  animation: overlay-in 180ms ease;
}

.mobile-nav-panel {
  position: fixed;
  z-index: 1301;
  top: 0.4rem;
  right: 0.4rem;
  display: flex;
  width: min(calc(100vw - 0.8rem), 29rem);
  height: calc(100svh - 0.8rem);
  flex-direction: column;
  padding: 0;
  overflow-y: auto;
  border: 1px solid var(--color-control-border);
  border-radius: 2px;
  background:
    linear-gradient(color-mix(in srgb, var(--color-line) 38%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-line) 38%, transparent) 1px, transparent 1px),
    color-mix(in srgb, var(--color-bg) 97%, #000);
  background-size: 3rem 3rem;
  box-shadow: -30px 0 90px rgb(0 0 0 / 45%), inset 0 0 50px rgb(0 0 0 / 18%);
  animation: panel-in 320ms var(--ease-out);
}

.mobile-nav-overlay { z-index: 1300; }

.mobile-nav-panel::after {
  position: absolute;
  z-index: 0;
  opacity: 0.24;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 9%) 4px);
  content: '';
  inset: 0;
  pointer-events: none;
}

.mobile-nav-panel > * { position: relative; z-index: 1; }

.mobile-nav-panel__top,
.mobile-nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-nav-panel__top {
  min-height: 3.2rem;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
}

.mobile-nav-panel__top h2 {
  margin: 0;
  font-size: 0.78rem;
}

.mobile-nav-list {
  margin: 0;
  padding: 0.9rem 0.75rem 0;
  list-style: none;
}

.mobile-nav-list a {
  display: grid;
  min-height: 4rem;
  grid-template-columns: 2.2rem 1fr auto;
  align-items: center;
  gap: 0.65rem;
  padding-inline: 0.35rem;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: clamp(0.82rem, 3.7vw, 1rem);
  text-decoration: none;
  transition: background var(--duration-ui) ease, color var(--duration-ui) ease;
}

.mobile-nav-list span {
  color: var(--color-accent);
  font-size: 0.62rem;
}

.mobile-nav-list strong { font-weight: 520; }
.mobile-nav-list i { color: var(--color-line); font-style: normal; }
.mobile-nav-list a:hover,
.mobile-nav-list a:focus-visible { background: color-mix(in srgb, var(--color-accent) 9%, transparent); color: var(--color-text); }
.mobile-nav-list a:hover i,
.mobile-nav-list a:focus-visible i { color: var(--color-accent); }

.mobile-nav-contact {
  display: grid;
  min-height: 3.25rem;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.7rem;
  margin: 0.9rem 0.75rem 0;
  padding-inline: 0.85rem;
  border: 1px solid var(--color-accent);
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
  color: var(--color-text);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
}

.mobile-nav-contact > span { color: var(--color-accent); font-size: 0.9rem; }
.mobile-nav-contact kbd { color: var(--color-text-muted); font: inherit; font-size: 0.52rem; }
.mobile-nav-contact:hover,
.mobile-nav-contact:focus-visible { background: var(--color-accent); color: var(--color-accent-ink); }
.mobile-nav-contact:hover > span,
.mobile-nav-contact:focus-visible > span,
.mobile-nav-contact:hover kbd,
.mobile-nav-contact:focus-visible kbd { color: currentcolor; }

.mobile-nav-runtime {
  display: flex;
  min-height: 11rem;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 1.1rem;
  color: var(--color-text-muted);
}

.mobile-nav-runtime p { margin: 0 0 0.75rem; color: var(--color-accent); }
.mobile-nav-runtime pre { margin: 0; font-family: var(--font-mono); font-size: 0.62rem; line-height: 1.65; }
.mobile-nav-runtime > span { margin-top: 0.75rem; }
.mobile-nav-runtime > span i { display: inline-block; width: 0.42rem; height: 0.42rem; margin-right: 0.35rem; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 10px var(--color-accent); }

.mobile-nav-controls {
  min-height: 3.6rem;
  margin-top: 0;
  padding: 0.55rem 0.75rem;
  border-top: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
}

@keyframes overlay-in { from { opacity: 0; } }
@keyframes panel-in { from { transform: translateX(100%); } }

@media (max-width: 1080px) {
  .mobile-menu-trigger { display: block; }
}

@media (max-height: 680px) {
  .mobile-nav-runtime { display: none; }
  .mobile-nav-controls { margin-top: auto; }
}
</style>
