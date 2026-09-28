<script setup lang="ts">
import { RovingFocusGroup, RovingFocusItem } from 'reka-ui'
import { LocaleCode } from '~/types/i18n'

defineProps<{ label: string }>()

const { locale, t } = useI18n()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const targetLocale = computed(() => locale.value === LocaleCode.Ru ? LocaleCode.En : LocaleCode.Ru)
const targetPath = computed(() => {
  const path = switchLocalePath(targetLocale.value) || '/'
  return path.includes('#') ? path : `${path}${route.hash}`
})
const currentLabel = computed(() => locale.value === LocaleCode.Ru ? t('locale.russian') : t('locale.english'))
const targetLabel = computed(() => targetLocale.value === LocaleCode.Ru ? t('locale.russian') : t('locale.english'))
const {
  id, root, trigger, isOpen, onPointerEnter, onPointerLeave, onFocusOut,
  onTriggerClick, onKeyboardIntent, focusOption, onEscape, onSelection,
} = useExpandableControl()
</script>

<template>
  <div
    ref="root"
    class="compact-control locale-control"
    :class="{ 'compact-control--open': isOpen }"
    :aria-label="label"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @focusout="onFocusOut"
    @keydown.capture="onKeyboardIntent"
    @keydown.esc="onEscape"
  >
    <button
      ref="trigger"
      type="button"
      class="compact-control__trigger locale-control__text"
      :aria-label="`${label}: ${currentLabel}`"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-options`"
      @click="onTriggerClick"
      @keydown.down.prevent="focusOption()"
      @keydown.left.prevent="focusOption()"
    >
      {{ locale.toUpperCase() }}
    </button>
    <Transition name="compact-control">
      <RovingFocusGroup
        v-if="isOpen"
        :id="`${id}-options`"
        class="compact-control__options"
        role="group"
        :aria-label="label"
        orientation="horizontal"
      >
        <RovingFocusItem as-child>
          <NuxtLink
            :to="targetPath"
            :hreflang="targetLocale"
            :aria-label="targetLabel"
            class="compact-control__option locale-control__text"
            data-control-option
            @click="onSelection"
          >{{ targetLocale.toUpperCase() }}</NuxtLink>
        </RovingFocusItem>
      </RovingFocusGroup>
    </Transition>
  </div>
</template>

<style scoped>
.locale-control__text {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
}
</style>
