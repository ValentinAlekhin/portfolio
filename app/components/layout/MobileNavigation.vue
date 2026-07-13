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

const { copy } = usePortfolio()
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
        :aria-label="copy.nav.open"
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
            VA // NAVIGATION
          </DialogTitle>
          <DialogDescription class="sr-only">
            {{ copy.nav.label }}
          </DialogDescription>
          <DialogClose as-child>
            <button
              type="button"
              class="dialog-close system-label"
              :aria-label="copy.nav.close"
            >
              ×
            </button>
          </DialogClose>
        </div>

        <nav :aria-label="copy.nav.label">
          <ul class="mobile-nav-list">
            <li
              v-for="(item, index) in copy.nav.items"
              :key="item.id"
            >
              <DialogClose as-child>
                <a :href="`${homePath}#${item.id}`">
                  <span class="system-label">0{{ index + 1 }}</span>
                  {{ item.label }}
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
          {{ copy.nav.contact }} <span aria-hidden="true">↗</span>
        </button>

        <div class="mobile-nav-controls">
          <ThemeSwitch :label="copy.nav.theme" />
          <LocaleSwitcher :label="copy.nav.language" />
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
  border: 1px solid var(--color-line);
  border-radius: 6px;
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

.mobile-nav-overlay,
.dialog-overlay {
  position: fixed;
  z-index: 800;
  background: rgb(9 11 9 / 70%);
  inset: 0;
  animation: overlay-in 180ms ease;
}

.mobile-nav-panel {
  position: fixed;
  z-index: 801;
  top: 0;
  right: 0;
  display: flex;
  width: min(92vw, 31rem);
  height: 100svh;
  flex-direction: column;
  padding: 1.25rem;
  border-left: 1px solid var(--color-line);
  background: var(--color-surface);
  box-shadow: -30px 0 80px rgb(0 0 0 / 16%);
  animation: panel-in 320ms var(--ease-out);
}

.mobile-nav-panel__top,
.mobile-nav-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-nav-panel__top {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-line);
}

.mobile-nav-panel__top h2 {
  margin: 0;
  font-size: 0.78rem;
}

.dialog-close {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 1.3rem;
  place-items: center;
}

.mobile-nav-list {
  margin: 2.5rem 0;
  list-style: none;
}

.mobile-nav-list a {
  display: flex;
  min-height: 4.4rem;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--color-line);
  font-size: clamp(1.5rem, 7vw, 2.4rem);
  font-weight: 560;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.mobile-nav-list span {
  color: var(--color-accent);
  font-size: 0.7rem;
}

.mobile-nav-contact {
  min-height: 3.4rem;
  border: 0;
  border-radius: 6px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.mobile-nav-controls {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-line);
}

@keyframes overlay-in { from { opacity: 0; } }
@keyframes panel-in { from { transform: translateX(100%); } }

@media (max-width: 1080px) {
  .mobile-menu-trigger { display: block; }
}
</style>
