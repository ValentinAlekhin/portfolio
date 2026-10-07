<script setup lang="ts">
import {
  Add20,
  ArrowDown20,
  ArrowLeft20,
  ArrowRight20,
  ArrowUpRight20,
  Checkmark20,
  ChevronDown20,
  ChevronLeft20,
  ChevronRight20,
  Close20,
  Copy20,
  Email20,
  LogoGithub20,
  Menu20,
  Moon20,
  Screen20,
  Sun20,
  Subtract20,
} from '@carbon/icons-vue'

const icons = {
  'arrow-down': ArrowDown20,
  'arrow-left': ArrowLeft20,
  'arrow-right': ArrowRight20,
  'arrow-up-right': ArrowUpRight20,
  'check': Checkmark20,
  'chevron-down': ChevronDown20,
  'chevron-left': ChevronLeft20,
  'chevron-right': ChevronRight20,
  'close': Close20,
  'copy': Copy20,
  'email': Email20,
  'github': LogoGithub20,
  'menu': Menu20,
  'minus': Subtract20,
  'moon': Moon20,
  'plus': Add20,
  'screen': Screen20,
  'sun': Sun20,
} as const

defineProps<{ name: keyof typeof icons }>()
</script>

<template>
  <component
    :is="icons[name]"
    class="base-icon"
    aria-hidden="true"
    focusable="false"
  />
</template>

<style scoped>
.base-icon {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
}
</style>
