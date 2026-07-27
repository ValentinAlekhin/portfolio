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

const density = computed(() => {
  if (props.title.length > 72)
    return 'condensed'

  if (props.title.length > 52)
    return 'compact'

  return 'default'
})

const eyebrowStyle = computed(() => ({
  marginBottom: density.value === 'default' ? '26px' : '20px',
}))

const titleStyle = computed(() => {
  if (density.value === 'condensed') {
    return {
      fontSize: '48px',
      letterSpacing: '-0.045em',
      lineHeight: '1',
      textWrap: 'balance',
    }
  }

  if (density.value === 'compact') {
    return {
      fontSize: '56px',
      letterSpacing: '-0.05em',
      lineHeight: '1.02',
      textWrap: 'balance',
    }
  }

  return {
    fontSize: '68px',
    letterSpacing: '-0.055em',
    lineHeight: '1.04',
    textWrap: 'balance',
  }
})

const descriptionStyle = computed(() => ({
  fontSize: density.value === 'condensed' ? '22px' : density.value === 'compact' ? '23px' : '25px',
  lineHeight: density.value === 'condensed' ? '1.35' : density.value === 'compact' ? '1.4' : '1.5',
  marginTop: density.value === 'default' ? '30px' : '22px',
  textWrap: 'balance',
}))
</script>

<template>
  <div
    class="box-border flex h-full w-full flex-col bg-[#090b09] p-[64px] text-[#f0f1ec]"
    style="font-family: 'JetBrains Mono Cyrillic', 'JetBrains Mono Latin', monospace;"
  >
    <div class="box-border flex h-[79px] shrink-0 items-center border-b border-[#2f3a31] pb-[26px]">
      <div class="flex items-center gap-[18px]">
        <div class="h-[52px] w-[52px] bg-[#a8ff60]">
          <svg
            aria-hidden="true"
            height="52"
            viewBox="0 0 52 52"
            width="52"
          >
            <path
              d="M14 15L25 22L14 29M29 35H39"
              fill="none"
              stroke="#090b09"
              stroke-linecap="square"
              stroke-linejoin="miter"
              stroke-width="4"
            />
          </svg>
        </div>
        <span class="text-[24px] font-semibold tracking-[0.16em]">ALEKHIN.DEV</span>
      </div>
      <span class="ml-auto text-[18px] tracking-[0.12em] text-[#8f9b90]">STATIC OG / BUILD 03</span>
    </div>

    <div class="box-border flex h-[372px] shrink-0 flex-col pt-[38px]">
      <span
        class="text-[20px] tracking-[0.12em] text-[#a8ff60]"
        :style="eyebrowStyle"
      >
        [ {{ eyebrow }} ]
      </span>
      <h1
        class="m-0 max-w-[1060px] font-semibold"
        :style="titleStyle"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mb-0 max-w-[980px] text-[#a6ada7]"
        :style="descriptionStyle"
      >
        {{ description }}
      </p>
    </div>

    <div class="box-border flex h-[51px] shrink-0 items-center border-t border-[#2f3a31] pt-[24px] text-[18px] text-[#8f9b90]">
      <div class="flex items-center gap-[12px]">
        <span class="h-[10px] w-[10px] rounded-full bg-[#a8ff60]" />
        <span class="uppercase">{{ availability }}</span>
      </div>
      <span class="ml-auto text-[#a8ff60]">{{ locale }}</span>
    </div>
  </div>
</template>
