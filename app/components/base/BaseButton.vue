<script setup lang="ts">
const props = withDefaults(defineProps<{
  href?: string
  to?: string
  variant?: 'primary' | 'secondary' | 'text'
  external?: boolean
  magnetic?: boolean
}>(), {
  href: undefined,
  to: undefined,
  variant: 'primary',
  external: false,
  magnetic: true,
})

const target = ref<HTMLElement | null>(null)

if (props.magnetic) {
  useMagnetic(target)
}
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : href ? 'a' : 'button'"
    ref="target"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="base-button"
    :class="`base-button--${variant}`"
    :type="!href && !to ? 'button' : undefined"
  >
    <span class="base-button__fill" />
    <span class="base-button__label"><slot /></span>
    <span
      v-if="$slots.icon"
      class="base-button__icon"
      aria-hidden="true"
    ><slot name="icon" /></span>
  </component>
</template>

<style scoped lang="scss">
.base-button {
  --magnetic-x: 0px;
  --magnetic-y: 0px;
  --magnetic-inner-x: 0px;
  --magnetic-inner-y: 0px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  gap: 0.75rem;
  padding: 0.72rem 1.05rem;
  overflow: hidden;
  border: 1px solid var(--color-control-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  transform: translate3d(var(--magnetic-x), var(--magnetic-y), 0);
  transition: color var(--duration-fast) ease, border-color var(--duration-fast) ease, transform var(--duration-ui) var(--ease-out);
}

.base-button__fill {
  position: absolute;
  background: var(--color-phosphor);
  inset: 0;
  transform: translateY(102%);
  transition: transform var(--duration-ui) var(--ease-out);
}

.base-button__label,
.base-button__icon {
  position: relative;
  z-index: 1;
}

.base-button__label {
  transform: translate3d(var(--magnetic-inner-x), var(--magnetic-inner-y), 0);
}

.base-button__icon {
  font-size: 1rem;
  transition: transform var(--duration-fast) var(--ease-out);
}

.base-button:hover {
  border-color: var(--color-phosphor);
  color: var(--color-accent-ink);
}

.base-button:hover .base-button__fill {
  transform: translateY(0);
}

.base-button:hover .base-button__icon {
  transform: translate(2px, -2px);
}

.base-button--primary {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-surface);
}

html[data-theme='phosphor'] .base-button--primary {
  color: var(--color-accent-ink);
}

.base-button--text {
  min-height: 2.75rem;
  padding-inline: 0;
  border-color: transparent;
}

.base-button--text .base-button__fill {
  display: none;
}

.base-button--text:hover {
  color: var(--color-accent);
}

@media (prefers-reduced-motion: reduce) {
  .base-button {
    transform: none;
  }
}
</style>
