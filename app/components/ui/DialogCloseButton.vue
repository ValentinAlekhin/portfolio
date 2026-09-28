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
    class="dialog-close-button"
    :aria-label="label"
  >
    <BaseIcon name="close" />
  </button>
</template>

<style scoped lang="scss">
.dialog-close-button {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  place-items: center;
  transition: background var(--duration-fast) ease;
}

.dialog-close-button:hover { background: var(--color-surface); }
.dialog-close-button:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
</style>
