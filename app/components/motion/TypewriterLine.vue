<script setup lang="ts">
const props = defineProps<{ text: string }>()
const displayText = ref(props.text)
const { motionAllowed } = useMotionPreference()
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (!motionAllowed.value) return
  displayText.value = ''
  let index = 0
  const step = () => {
    index += 1
    displayText.value = props.text.slice(0, index)
    if (index < props.text.length) {
      timer = setTimeout(step, 30)
    }
  }
  timer = setTimeout(step, 180)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <p class="typewriter-line system-label">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">{{ displayText }}<i /></span>
  </p>
</template>

<style scoped lang="scss">
.typewriter-line {
  min-height: 1.5em;
  margin: 0;
  color: var(--color-accent);
  text-transform: none;
}

.typewriter-line i {
  display: inline-block;
  width: 0.52em;
  height: 1.05em;
  margin-left: 0.18em;
  background: currentcolor;
  vertical-align: -0.18em;
  animation: caret 1s step-end 12;
}

@keyframes caret { 50% { opacity: 0; } }
</style>
