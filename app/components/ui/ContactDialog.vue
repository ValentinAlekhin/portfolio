<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
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
      <DialogContent
        class="contact-dialog"
        aria-modal="true"
        :aria-describedby="undefined"
      >
        <div class="contact-dialog__top">
          <DialogTitle class="contact-dialog__title">
            {{ t('contact.title') }}
          </DialogTitle>
          <DialogClose as-child>
            <DialogCloseButton :label="t('contact.close')" />
          </DialogClose>
        </div>

        <a
          :href="`mailto:${profile.email}`"
          class="contact-dialog__email"
        >{{ profile.email }}</a>

        <div class="contact-dialog__other">
          <a
            :href="profile.telegram"
            target="_blank"
            rel="noopener noreferrer"
          >Telegram <span>{{ profile.telegramHandle }}</span></a>
          <button
            type="button"
            @click="copyEmail"
          >
            <BaseIcon :name="feedback === 'copied' ? 'check' : 'copy'" />
            {{ t('contact.copy') }}
          </button>
        </div>
        <p
          class="contact-dialog__feedback"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ feedback ? t(`contact.${feedback}`) : '' }}
        </p>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  z-index: 1400;
  inset: 0;
  background: rgb(0 0 0 / 58%);
}

.dialog-overlay[data-state='open'] {
  animation: contact-overlay-in 180ms ease-out both;
}

.dialog-overlay[data-state='closed'] {
  animation: contact-overlay-out 140ms ease-in both;
}

.contact-dialog {
  position: fixed;
  z-index: 1401;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: min(calc(100% - 2rem), 32rem);
  max-height: calc(100svh - 2rem);
  padding: clamp(1.25rem, 3vw, 2rem);
  overflow-y: auto;
  border: 1px solid var(--color-line);
  border-radius: 0;
  background: var(--color-bg);
  color: var(--color-text);
  transform: translate(-50%, -50%);
}

.contact-dialog[data-state='open'] {
  animation: contact-panel-in 180ms ease-out both;
}

.contact-dialog[data-state='closed'] {
  animation: contact-panel-out 140ms ease-in both;
}

.contact-dialog__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.contact-dialog__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.contact-dialog__email {
  display: inline-flex;
  max-width: 100%;
  min-height: 2.75rem;
  align-items: center;
  margin-top: 1.75rem;
  color: var(--color-text);
  font-size: clamp(1.375rem, 4vw, 1.625rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.25;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact-dialog__email:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.14em;
}

.contact-dialog__other {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 1.75rem;
  margin-top: 1rem;
}

.contact-dialog__other :is(a, button) {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: var(--font-size-small);
  text-decoration: none;
}

.contact-dialog__other a span {
  color: var(--color-text);
}

.contact-dialog__other :is(a, button):hover {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.contact-dialog__feedback {
  min-height: 1.4rem;
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-ui);
}

.contact-dialog :is(a, button):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

@keyframes contact-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes contact-overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes contact-panel-in {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 0.5rem)); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

@keyframes contact-panel-out {
  from { opacity: 1; transform: translate(-50%, -50%); }
  to { opacity: 0; transform: translate(-50%, calc(-50% + 0.5rem)); }
}

@media (max-width: 540px) {
  .contact-dialog {
    width: calc(100% - 1rem);
    max-height: calc(100svh - 1rem);
    padding: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dialog-overlay,
  .contact-dialog {
    animation: none !important;
  }
}
</style>
