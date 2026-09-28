<script setup lang="ts">
import { RovingFocusGroup, RovingFocusItem } from 'reka-ui'
import type { ThemePreference } from '~/types/content'

defineProps<{ label: string }>()

const { t } = useI18n()
const { preference, setPreference } = useTheme()
const {
  id, root, trigger, isOpen, onPointerEnter, onPointerLeave, onFocusOut,
  onTriggerClick, onKeyboardIntent, focusOption, onEscape, onSelection,
} = useExpandableControl()

const preferences: ThemePreference[] = ['light', 'dark', 'auto']
const iconByPreference = {
  light: 'sun',
  dark: 'moon',
  auto: 'screen',
} as const satisfies Record<ThemePreference, 'sun' | 'moon' | 'screen'>
const alternatives = computed(() => preferences.filter(item => item !== preference.value))

function select(value: ThemePreference, event: MouseEvent) {
  setPreference(value)
  onSelection(event)
}
</script>

<template>
  <div
    ref="root"
    class="compact-control"
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
      class="compact-control__trigger"
      :aria-label="`${label}: ${t(`theme.${preference}`)}`"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-options`"
      @click="onTriggerClick"
      @keydown.down.prevent="focusOption()"
      @keydown.right.prevent="focusOption()"
    >
      <BaseIcon :name="iconByPreference[preference]" />
    </button>
    <Transition name="compact-control">
      <RovingFocusGroup
        v-if="isOpen"
        :id="`${id}-options`"
        class="compact-control__options"
        role="group"
        :aria-label="label"
        orientation="horizontal"
        loop
      >
        <RovingFocusItem
          v-for="option in alternatives"
          :key="option"
          as-child
          :tab-stop-id="option"
        >
          <button
            data-control-option
            type="button"
            class="compact-control__option"
            :aria-label="t(`theme.${option}`)"
            @click="select(option, $event)"
          >
            <BaseIcon :name="iconByPreference[option]" />
          </button>
        </RovingFocusItem>
      </RovingFocusGroup>
    </Transition>
  </div>
</template>

<style lang="scss">
.compact-control {
  position: relative;
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
}

.compact-control__trigger,
.compact-control__option {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 0;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
  place-items: center;
}

.compact-control__trigger:hover,
.compact-control__option:hover {
  border-color: var(--color-line);
  background: var(--color-surface);
}

.compact-control--open .compact-control__trigger,
.compact-control--open .compact-control__trigger:hover {
  border-color: var(--color-line);
  background: var(--color-text);
  color: var(--color-bg);
}

.compact-control__options {
  position: absolute;
  z-index: 20;
  top: 0;
  right: 100%;
  display: flex;
  height: 2.75rem;
  border: 1px solid var(--color-line);
  border-right: 0;
  background: var(--color-bg);
}

.compact-control__option { height: 100%; border: 0; }
.compact-control__option + .compact-control__option {
  border-left: 1px solid var(--color-line);
}

.compact-control-enter-active,
.compact-control-leave-active {
  transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.compact-control-enter-from,
.compact-control-leave-to {
  opacity: 0;
  transform: translateX(0.35rem);
}
</style>
