<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  availability: string
  description?: string
  eyebrow?: string
  locale?: string
}>(), {
  description: '',
  eyebrow: 'PORTFOLIO',
  locale: 'ru-RU',
})

const titleStyle = computed(() => ({
  fontSize: props.title.length > 72 ? '48px' : props.title.length > 52 ? '56px' : '68px',
  lineHeight: '1.09',
  letterSpacing: '-0.045em',
  textWrap: 'balance',
}))
</script>

<template>
  <div
    class="box-border flex h-full w-full flex-col bg-[#111111] p-[64px] text-[#f6f6f6]"
    style="font-family: 'Manrope Cyrillic', 'Manrope Latin', sans-serif;"
  >
    <div class="box-border flex h-[75px] shrink-0 items-center border-b border-[#555555] pb-[24px]">
      <div class="flex items-center gap-[17px]">
        <div
          class="flex h-[44px] w-[44px] items-center justify-center border border-[#f6f6f6] text-[20px] font-semibold"
          style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
        >
          &gt;_
        </div>
        <span
          class="text-[21px] font-semibold"
          style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
        >alekhin.dev</span>
      </div>
      <span
        class="ml-auto text-[17px] text-[#b9b9b9]"
        style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
      >{{ locale }}</span>
    </div>

    <div class="box-border flex h-[375px] shrink-0 flex-col justify-center">
      <span
        class="mb-[22px] text-[19px] text-[#b9b9b9]"
        style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
      >{{ eyebrow }}</span>
      <h1
        class="m-0 max-w-[1060px] font-semibold"
        :style="titleStyle"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mb-0 mt-[24px] max-w-[1000px] text-[24px] leading-[1.45] text-[#b9b9b9]"
      >
        {{ description }}
      </p>
    </div>

    <div
      class="box-border flex h-[52px] shrink-0 items-center border-t border-[#555555] pt-[23px] text-[18px] text-[#b9b9b9]"
      style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
    >
      <span>{{ availability }}</span>
      <span class="ml-auto">alekhin.dev</span>
    </div>
  </div>
</template>
