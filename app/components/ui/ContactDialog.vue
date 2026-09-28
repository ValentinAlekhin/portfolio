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
  set: (value) => { state.value = value },
})
const feedback = ref<'copied' | 'copyFailed' | null>(null)
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  if (feedbackTimer) clearTimeout(feedbackTimer)
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(profile.email)
    feedback.value = 'copied'
  }
  catch {
    feedback.value = 'copyFailed'
  }
  feedbackTimer = setTimeout(() => {
    feedback.value = null
  }, 3500)
}

watch(open, (isOpen) => {
  if (isOpen) return
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedback.value = null
})

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
          <span class="contact-dialog__eyebrow">{{ t('contact.eyebrow') }}</span>
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

        <div class="contact-dialog__methods">
          <a
            :href="`mailto:${profile.email}`"
            class="contact-dialog__method"
          >
            <span>Email</span>
            <strong>{{ profile.email }}</strong>
            <BaseIcon name="arrow-up-right" />
          </a>
          <a
            :href="profile.telegram"
            class="contact-dialog__method"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Telegram</span>
            <strong>{{ profile.telegramHandle }}</strong>
            <BaseIcon name="arrow-up-right" />
          </a>
        </div>

        <div class="contact-dialog__copy-row">
          <BaseButton
            variant="secondary"
            @click="copyEmail"
          >
            {{ t('contact.copy') }}
            <template #icon>
              <BaseIcon :name="feedback === 'copied' ? 'check' : 'copy'" />
            </template>
          </BaseButton>
          <p
            aria-live="polite"
            aria-atomic="true"
          >
            {{ feedback ? t(`contact.${feedback}`) : '' }}
          </p>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.dialog-overlay {
  position: fixed;
  z-index: 1400;
  inset: 0;
  background: rgb(0 0 0 / 58%);
}

.contact-dialog {
  position: fixed;
  z-index: 1401;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: min(calc(100% - 2rem), 38rem);
  max-height: calc(100svh - 2rem);
  padding: clamp(1.25rem, 3.5vw, 2.5rem);
  overflow-y: auto;
  border: 1px solid var(--color-line);
  border-radius: 0;
  background: var(--color-bg);
  color: var(--color-text);
  transform: translate(-50%, -50%);
}

.contact-dialog__top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }

.contact-dialog__eyebrow {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--font-size-ui);
}

.contact-dialog__title {
  margin: 2rem 0 0;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 1.08;
}

.contact-dialog__description { max-width: 48ch; margin: 0.9rem 0 0; color: var(--color-text-muted); }
.contact-dialog__methods { margin-top: 2rem; border-top: 1px solid var(--color-line); }

.contact-dialog__method {
  display: grid;
  min-height: 4.5rem;
  grid-template-columns: 5.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-text);
  text-decoration: none;
}

.contact-dialog__method:hover { color: var(--color-text-muted); }
.contact-dialog__method > span { color: var(--color-text-muted); font-size: var(--font-size-ui); }

.contact-dialog__method strong {
  min-width: 0;
  font-family: var(--font-mono);
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  font-weight: 500;
  overflow-wrap: anywhere;
}

.contact-dialog__copy-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem 1rem; margin-top: 1.5rem; }
.contact-dialog__copy-row p { min-height: 1.4rem; margin: 0; color: var(--color-text-muted); font-size: var(--font-size-ui); }

@media (max-width: 540px) {
  .contact-dialog { width: calc(100% - 1rem); max-height: calc(100svh - 1rem); padding: 1.25rem; }
  .contact-dialog__method { grid-template-columns: minmax(0, 1fr) auto; gap: 0.3rem 1rem; padding: 0.9rem 0; }
  .contact-dialog__method > span { grid-column: 1; }
  .contact-dialog__method strong { grid-column: 1; }
  .contact-dialog__method .base-icon { grid-column: 2; grid-row: 1 / 3; }
}
</style>
