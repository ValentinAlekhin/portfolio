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
  gap: 0.35rem;
  padding: 0.72rem 0.2rem;
  border: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 580;
  letter-spacing: 0.025em;
  line-height: 1;
  text-decoration: none;
  transform: translate3d(var(--magnetic-x), var(--magnetic-y), 0);
  transition: color var(--duration-fast) ease, transform var(--duration-ui) var(--ease-out);
}

.base-button::before,
.base-button::after {
  color: var(--color-text-muted);
  transition: color var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.base-button::before { content: '['; }
.base-button::after { content: ']'; }

.base-button__label,
.base-button__icon {
  position: relative;
  z-index: 1;
}

.base-button__label {
  transform: translate3d(var(--magnetic-inner-x), var(--magnetic-inner-y), 0);
}

.base-button__icon {
  display: none;
}

.base-button:hover {
  color: var(--color-text);
}

.base-button:hover::before { color: var(--color-accent); transform: translateX(-0.2rem); }
.base-button:hover::after { color: var(--color-accent); transform: translateX(0.2rem); }
.base-button--primary::before { content: '$_ ['; }
.base-button--secondary { color: var(--color-text-muted); }

.base-button--text {
  min-height: 2.75rem;
  padding-inline: 0;
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
