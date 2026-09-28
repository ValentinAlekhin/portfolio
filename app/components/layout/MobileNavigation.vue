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
import { ensureTrailingSlash } from '~/utils/url'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const open = ref(false)
const homePath = computed(() => ensureTrailingSlash(localePath('/')))
const contactOpen = useState<boolean>('contact-dialog-open', () => false)

watch(() => route.fullPath, () => {
  open.value = false
})

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
        <BaseIcon name="menu" />
      </button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="mobile-nav-overlay" />
      <DialogContent class="mobile-nav-panel">
        <div class="mobile-nav-panel__top">
          <DialogTitle>{{ t('nav.drawerTitle') }}</DialogTitle>
          <DialogDescription class="sr-only">
            {{ t('nav.label') }}
          </DialogDescription>
          <DialogClose as-child>
            <DialogCloseButton :label="t('nav.close')" />
          </DialogClose>
        </div>
        <nav :aria-label="t('nav.label')">
          <DialogClose
            v-for="item in navigationItems"
            :key="item.id"
            as-child
          >
            <a :href="`${homePath}#${item.id}`">{{ t(item.labelKey) }}</a>
          </DialogClose>
        </nav>
        <button
          type="button"
          class="mobile-nav-panel__contact"
          @click="openContact"
        >
          {{ t('nav.contact') }}
          <BaseIcon name="arrow-up-right" />
        </button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.mobile-menu-trigger {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  place-items: center;
}

.mobile-nav-overlay {
  position: fixed;
  z-index: 1300;
  background: rgb(0 0 0 / 56%);
  inset: 0;
}

.mobile-nav-panel {
  position: fixed;
  z-index: 1301;
  top: 0;
  right: 0;
  display: flex;
  width: min(100vw, 27rem);
  height: 100dvh;
  flex-direction: column;
  padding: 1.25rem;
  overflow-y: auto;
  border-left: 1px solid var(--color-line);
  border-radius: 0;
  background: var(--color-bg);
  color: var(--color-text);
}

.mobile-nav-panel__top {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-line);
}

.mobile-nav-panel__top h2 { margin: 0; font-size: 1.125rem; font-weight: 700; }
.mobile-nav-panel nav { display: grid; margin-top: 1.5rem; }

.mobile-nav-panel nav a {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-text);
  font-size: 1.125rem;
  text-decoration: none;
}

.mobile-nav-panel nav a:hover { background: var(--color-surface); }

.mobile-nav-panel__contact {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-text);
  border-radius: 0;
  margin-top: 2rem;
  background: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  font-weight: 650;
  text-align: left;
}

@media (max-width: 1000px) {
  .mobile-menu-trigger { display: grid; }
}
</style>
