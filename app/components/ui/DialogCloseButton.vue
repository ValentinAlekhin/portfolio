<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
}>()
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    class="dialog-close-button system-label"
    :aria-label="label"
  >
    [×]
  </button>
</template>

<style scoped lang="scss">
.dialog-close-button {
  display: grid;
  width: 2.35rem;
  height: 2.2rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  place-items: center;
  transition: color var(--duration-ui) ease, text-shadow var(--duration-ui) ease;
}

.dialog-close-button:hover,
.dialog-close-button:focus-visible {
  outline: 0;
  color: var(--color-text);
  text-shadow: 0 0 10px var(--color-accent);
}
</style>
