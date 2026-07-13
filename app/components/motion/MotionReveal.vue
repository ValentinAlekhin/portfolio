<script setup lang="ts">
const props = withDefaults(defineProps<{
  delay?: number
  y?: number
}>(), {
  delay: 0,
  y: 24,
})

const root = ref<HTMLElement | null>(null)
const { motionAllowed } = useMotionPreference()
let context: ReturnType<ReturnType<typeof useNuxtApp>['$gsap']['context']> | undefined

onMounted(() => {
  if (!root.value || !motionAllowed.value) return
  const { $gsap } = useNuxtApp()
  context = $gsap.context(() => {
    $gsap.fromTo(root.value, {
      autoAlpha: 0,
      y: props.y,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      delay: props.delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root.value,
        start: 'top 88%',
        once: true,
      },
    })
  }, root.value)
  document.documentElement.dataset.motionReady = 'true'
})

onBeforeUnmount(() => context?.revert())
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
