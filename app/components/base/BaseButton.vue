<script setup lang="ts">
withDefaults(defineProps<{
  href?: string
  to?: string
  variant?: 'primary' | 'secondary' | 'text'
  external?: boolean
  disabled?: boolean
}>(), {
  disabled: false,
  href: undefined,
  to: undefined,
  variant: 'primary',
  external: false,
})
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :disabled="!href && !to ? disabled : undefined"
    class="base-button"
    :class="`base-button--${variant}`"
    :type="!href && !to ? 'button' : undefined"
  >
    <span class="base-button__label"><slot /></span>
    <span
      v-if="$slots.icon"
      class="base-button__icon"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
  </component>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border: 1px solid var(--color-text);
  border-radius: 0;
  background: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--font-size-ui);
  font-weight: 650;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--duration-fast) ease, color var(--duration-fast) ease, border-color var(--duration-fast) ease;
}

.base-button:hover {
  border-color: var(--color-text-muted);
  background: var(--color-text-muted);
}

.base-button--secondary {
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: var(--color-line);
  text-underline-offset: 0.35em;
}

.base-button--secondary:hover {
  border-color: transparent;
  background: transparent;
  text-decoration-color: currentcolor;
}

.base-button--text {
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
  color: var(--color-text);
}

.base-button--text:hover {
  border-color: transparent;
  background: transparent;
  color: var(--color-text-muted);
}

.base-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.base-button:disabled {
  border-color: var(--color-line);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.65;
}

.base-button__icon { display: inline-flex; }
.base-button__label { white-space: nowrap; }
.base-button__icon :deep(svg) { flex: none; }
</style>
