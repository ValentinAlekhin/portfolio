<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { profile } from '~/data/profile'

const { t } = useI18n()
const state = useState<boolean>('contact-dialog-open', () => false)
const open = computed({
  get: () => state.value,
  set: (value) => {
    state.value = value
  },
})
const copied = ref(false)
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  await navigator.clipboard.writeText(profile.email)
  copied.value = true
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => {
    copied.value = false
  }, 2500)
}

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer)
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="contact-dialog">
        <div class="contact-dialog__top">
          <p class="system-label">
            <span>●</span> {{ t('contact.eyebrow') }}
          </p>
          <DialogClose as-child>
            <DialogCloseButton :label="t('contact.close')" />
          </DialogClose>
        </div>
        <DialogTitle class="contact-dialog__title">
          {{ t('contact.dialogTitle') }}
        </DialogTitle>
        <DialogDescription class="contact-dialog__description">
          {{ t('contact.dialogDescription') }}
        </DialogDescription>

        <div class="contact-dialog__address">
          <div class="contact-dialog__address-row">
            <span class="system-label">EMAIL</span>
            <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          </div>
          <div class="contact-dialog__address-row">
            <span class="system-label">TELEGRAM</span>
            <a
              :href="profile.telegram"
              target="_blank"
              rel="noopener noreferrer"
            >{{ profile.telegramHandle }}</a>
          </div>
        </div>

        <div class="contact-dialog__actions">
          <BaseButton :href="`mailto:${profile.email}?subject=New%20project`">
            {{ t('contact.compose') }}
            <template #icon>
              ↗
            </template>
          </BaseButton>
          <BaseButton
            variant="secondary"
            @click="copyEmail"
          >
            {{ t('contact.copy') }}
          </BaseButton>
          <BaseButton
            :href="profile.telegram"
            external
            variant="secondary"
          >
            Telegram {{ profile.telegramHandle }}
          </BaseButton>
        </div>

        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-dialog__github system-label"
        >GITHUB ↗</a>
        <p
          class="contact-dialog__feedback system-label"
          aria-live="polite"
        >
          {{ copied ? t('contact.copied') : '' }}
        </p>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.dialog-overlay {
  z-index: 1400;
}

.contact-dialog {
  position: fixed;
  z-index: 1401;
  top: 50%;
  left: 50%;
  width: min(calc(100% - 2rem), 42rem);
  max-height: calc(100svh - 2rem);
  padding: clamp(1.25rem, 4vw, 2.5rem);
  overflow-y: auto;
  border: 1px solid var(--color-control-border);
  border-radius: 2px;
  background:
    linear-gradient(color-mix(in srgb, var(--color-line) 38%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-line) 38%, transparent) 1px, transparent 1px),
    color-mix(in srgb, var(--color-bg) 97%, #000);
  background-size: 3rem 3rem;
  box-shadow: 0 35px 100px rgb(0 0 0 / 45%), inset 0 0 50px rgb(0 0 0 / 18%);
  transform: translate(-50%, -50%);
  animation: contact-dialog-in 320ms var(--ease-out);
}

.contact-dialog::after {
  position: absolute;
  z-index: 0;
  opacity: 0.24;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 9%) 4px);
  content: '';
  inset: 0;
  pointer-events: none;
}

.contact-dialog > * {
  position: relative;
  z-index: 1;
}

.contact-dialog__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-line);
}

.contact-dialog__top p { margin: 0; color: var(--color-text-muted); }
.contact-dialog__top p span { color: var(--color-accent); }

.contact-dialog__title {
  margin: clamp(2rem, 5vw, 3.5rem) 0 0;
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 3.2rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
}

.contact-dialog__description {
  max-width: 42ch;
  margin: 1rem 0 0;
  color: var(--color-text-muted);
}

.contact-dialog__address {
  margin-top: 2.2rem;
  border-top: 1px solid var(--color-line);
}

.contact-dialog__address-row { display: grid; grid-template-columns: 7rem 1fr; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--color-line); }
.contact-dialog__address span { color: var(--color-text-muted); }
.contact-dialog__address a { width: fit-content; font-size: clamp(1rem, 3vw, 1.35rem); }
.contact-dialog__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.5rem; }
.contact-dialog__github { display: inline-block; margin-top: 1.6rem; color: var(--color-text-muted); }
.contact-dialog__feedback { min-height: 1.2rem; margin: 1rem 0 0; color: var(--color-accent); }

@keyframes contact-dialog-in {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.98); }
}

@keyframes contact-dialog-mobile-in {
  from { opacity: 0; transform: translateY(0.75rem); }
}

@media (max-width: 600px) {
  .contact-dialog {
    top: 0.4rem;
    left: 0.4rem;
    width: calc(100% - 0.8rem);
    max-height: calc(100svh - 0.8rem);
    padding: 1.25rem;
    transform: none;
    animation-name: contact-dialog-mobile-in;
  }

  .contact-dialog__title {
    margin-top: 2rem;
    font-size: clamp(1.3rem, 6vw, 1.55rem);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }

  .contact-dialog__description {
    font-size: 0.95rem;
  }

  .contact-dialog__address {
    margin-top: 1.75rem;
  }

  .contact-dialog__address-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .contact-dialog__address a {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .contact-dialog__actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .contact-dialog__actions .base-button {
    width: 100%;
  }
}
</style>
