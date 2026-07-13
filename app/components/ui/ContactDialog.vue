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

const { copy } = usePortfolio()
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
            <span>●</span> OPEN CHANNEL
          </p>
          <DialogClose as-child>
            <button
              type="button"
              class="dialog-close"
              :aria-label="copy.contact.close"
            >
              ×
            </button>
          </DialogClose>
        </div>
        <DialogTitle class="contact-dialog__title">
          {{ copy.contact.dialogTitle }}
        </DialogTitle>
        <DialogDescription class="contact-dialog__description">
          {{ copy.contact.dialogDescription }}
        </DialogDescription>

        <div class="contact-dialog__address">
          <span class="system-label">EMAIL</span>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
        </div>

        <div class="contact-dialog__actions">
          <BaseButton :href="`mailto:${profile.email}?subject=New%20project`">
            {{ copy.contact.compose }}
            <template #icon>
              ↗
            </template>
          </BaseButton>
          <BaseButton
            variant="secondary"
            @click="copyEmail"
          >
            {{ copy.contact.copy }}
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
          {{ copied ? copy.contact.copied : '' }}
        </p>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss">
.contact-dialog {
  position: fixed;
  z-index: 801;
  top: 50%;
  left: 50%;
  width: min(calc(100% - 2rem), 42rem);
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid var(--color-line);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 35px 100px rgb(0 0 0 / 30%);
  transform: translate(-50%, -50%);
  animation: contact-dialog-in 320ms var(--ease-out);
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
  display: grid;
  gap: 0.4rem;
  margin-top: 2.2rem;
  padding: 1.2rem 0;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
}

.contact-dialog__address span { color: var(--color-text-muted); }
.contact-dialog__address a { width: fit-content; font-size: clamp(1.1rem, 3vw, 1.5rem); }
.contact-dialog__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.5rem; }
.contact-dialog__github { display: inline-block; margin-top: 1.6rem; color: var(--color-text-muted); }
.contact-dialog__feedback { min-height: 1.2rem; margin: 1rem 0 0; color: var(--color-accent); }

@keyframes contact-dialog-in {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.98); }
}
</style>
