<script setup lang="ts">
import { profile } from '~/data/profile'

interface TerminalEntry {
  kind: 'input' | 'output' | 'error'
  text: string
}

interface TerminalCommand {
  name: string
  alias: string
  description: Record<'ru' | 'en', string>
}

const localePath = useLocalePath()
const { localeCode } = usePortfolio()
const open = ref(false)
const command = ref('')
const input = ref<HTMLInputElement | null>(null)
const historyElement = ref<HTMLElement | null>(null)
const history = ref<TerminalEntry[]>([
  { kind: 'output', text: localeCode.value === 'ru' ? 'VA_OS v2.1 — интерактивная консоль готова' : 'VA_OS v2.1 — interactive shell ready' },
  { kind: 'output', text: localeCode.value === 'ru' ? 'введите `помощь` или нажмите Tab' : 'type `help` or press Tab' },
])
const { toggleTheme } = useTheme()
const contactOpen = useState<boolean>('contact-dialog-open', () => false)
const executedCommands = ref<string[]>([])
const historyIndex = ref(-1)
const completionOptions = ref<string[]>([])
const completionIndex = ref(-1)

const commandDefinitions: TerminalCommand[] = [
  { name: 'help', alias: 'помощь', description: { ru: 'показать список команд', en: 'list available commands' } },
  { name: 'whoami', alias: 'кто-я', description: { ru: 'кратко обо мне', en: 'show developer profile' } },
  { name: 'projects', alias: 'проекты', description: { ru: 'перейти к проектам', en: 'open selected projects' } },
  { name: 'pipeline', alias: 'возможности', description: { ru: 'открыть продуктовый конвейер', en: 'open product pipeline' } },
  { name: 'about', alias: 'обо-мне', description: { ru: 'открыть README', en: 'open README' } },
  { name: 'contact', alias: 'контакты', description: { ru: 'открыть контакты', en: 'open contact channel' } },
  { name: 'telegram', alias: 'телеграм', description: { ru: `написать ${profile.telegramHandle}`, en: `message ${profile.telegramHandle}` } },
  { name: 'theme', alias: 'тема', description: { ru: 'сменить профиль монитора', en: 'toggle display profile' } },
  { name: 'clear', alias: 'очистить', description: { ru: 'очистить консоль', en: 'clear terminal output' } },
]

const availableTokens = computed(() => commandDefinitions.map((item) => {
  return localeCode.value === 'ru' ? item.alias : item.name
}))

const matchingCommands = computed(() => {
  const seed = command.value.trim().toLowerCase()
  if (!seed) return availableTokens.value
  return availableTokens.value.filter(item => item.startsWith(seed))
})

const visibleSuggestions = computed(() => {
  const source = completionOptions.value.length ? completionOptions.value : matchingCommands.value
  return source.slice(0, 5)
})

function findCommand(token: string) {
  return commandDefinitions.find(item => item.name === token || item.alias === token)
}

function commandDescription(token: string) {
  return findCommand(token)?.description[localeCode.value] ?? ''
}

function focusInput() {
  nextTick(() => input.value?.focus())
}

function scrollHistoryToBottom() {
  nextTick(() => {
    if (!historyElement.value) return
    historyElement.value.scrollTop = historyElement.value.scrollHeight
  })
}

function toggleConsole() {
  open.value = !open.value
  if (open.value) focusInput()
}

function resetCompletion() {
  completionOptions.value = []
  completionIndex.value = -1
}

function onCommandInput() {
  resetCompletion()
  historyIndex.value = -1
}

function selectSuggestion(value: string) {
  command.value = value
  resetCompletion()
  focusInput()
}

function recallCommand(direction: 'up' | 'down') {
  if (!executedCommands.value.length) return

  if (direction === 'up') {
    historyIndex.value = Math.min(historyIndex.value + 1, executedCommands.value.length - 1)
  }
  else {
    historyIndex.value = Math.max(historyIndex.value - 1, -1)
  }

  command.value = historyIndex.value < 0
    ? ''
    : executedCommands.value[executedCommands.value.length - 1 - historyIndex.value] ?? ''
  resetCompletion()
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    event.preventDefault()
    if (!completionOptions.value.length) {
      completionOptions.value = [...matchingCommands.value]
    }
    if (!completionOptions.value.length) return

    completionIndex.value = (completionIndex.value + 1) % completionOptions.value.length
    command.value = completionOptions.value[completionIndex.value] ?? command.value
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    recallCommand('up')
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    recallCommand('down')
  }
}

function goTo(id: string) {
  open.value = false
  const path = `${localePath('/')}#${id}`
  navigateTo(path)
}

function execute() {
  const inputValue = command.value.trim().toLowerCase()
  if (!inputValue) return
  const definition = findCommand(inputValue)
  const value = definition?.name ?? inputValue
  history.value.push({ kind: 'input', text: `valentin@alekhin:~$ ${inputValue}` })
  executedCommands.value.push(inputValue)
  historyIndex.value = -1

  if (value === 'help') {
    commandDefinitions.forEach((item) => {
      const label = localeCode.value === 'ru' ? item.alias : item.name
      history.value.push({ kind: 'output', text: `${label.padEnd(24)} ${item.description[localeCode.value]}` })
    })
  }
  else if (value === 'whoami') {
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? 'независимый senior full-stack разработчик / продуктовый инженер' : 'independent senior full-stack developer / product engineer' })
  }
  else if (value === 'projects') {
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? 'открываю ./проекты ...' : 'opening ./projects ...' })
    goTo('projects')
  }
  else if (value === 'pipeline') {
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? 'открываю ./продуктовый-конвейер ...' : 'opening ./product-pipeline ...' })
    goTo('services')
  }
  else if (value === 'about') {
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? 'открываю README.md ...' : 'opening README.md ...' })
    goTo('about')
  }
  else if (value === 'contact') {
    contactOpen.value = true
    open.value = false
  }
  else if (value === 'telegram') {
    window.open(profile.telegram, '_blank', 'noopener,noreferrer')
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? `открываю ${profile.telegramHandle} ...` : `opening ${profile.telegramHandle} ...` })
  }
  else if (value === 'theme') {
    toggleTheme()
    history.value.push({ kind: 'output', text: localeCode.value === 'ru' ? 'профиль монитора изменён' : 'display profile toggled' })
  }
  else if (value === 'clear') {
    history.value = []
  }
  else {
    history.value.push({ kind: 'error', text: localeCode.value === 'ru' ? `команда не найдена: ${value}` : `command not found: ${value}` })
  }

  command.value = ''
  resetCompletion()
  focusInput()
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const inField = target?.matches('input, textarea, [contenteditable="true"]')
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
    if (open.value) focusInput()
  }
  else if (event.key === '`' && !inField) {
    event.preventDefault()
    open.value = !open.value
    if (open.value) focusInput()
  }
  else if (event.key === 'Escape' && open.value) {
    open.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
watch(() => history.value.length, scrollHistoryToBottom)
</script>

<template>
  <div
    class="terminal-console"
    :class="{ open }"
  >
    <button
      type="button"
      class="terminal-console__trigger system-label"
      :aria-expanded="open"
      :aria-label="open ? 'Close command console' : 'Open command console'"
      @click="toggleConsole"
    >
      <span>&gt;_</span>
      <span>CMD</span>
      <kbd>⌘K</kbd>
    </button>

    <section
      v-if="open"
      class="terminal-console__panel"
      aria-label="Command console"
    >
      <header class="terminal-console__head system-label">
        <span>TERMINAL / zsh</span>
        <button
          type="button"
          aria-label="Close command console"
          @click="open = false"
        >
          [×]
        </button>
      </header>
      <div
        ref="historyElement"
        class="terminal-console__history"
        aria-live="polite"
      >
        <p
          v-for="(entry, index) in history"
          :key="`${entry.text}-${index}`"
          :class="`is-${entry.kind}`"
        >
          {{ entry.text }}
        </p>
      </div>
      <div class="terminal-console__suggestions">
        <button
          v-for="suggestion in visibleSuggestions"
          :key="suggestion"
          type="button"
          @click="selectSuggestion(suggestion)"
        >
          <span>{{ suggestion }}</span>
          <small>{{ commandDescription(suggestion) }}</small>
        </button>
      </div>
      <form
        class="terminal-console__form"
        @submit.prevent="execute"
      >
        <label for="terminal-command">valentin@alekhin:~$</label>
        <input
          id="terminal-command"
          ref="input"
          v-model="command"
          name="command"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="localeCode === 'ru' ? 'помощь' : 'help'"
          @input="onCommandInput"
          @keydown="onInputKeydown"
        >
        <span class="terminal-console__key-hints">
          {{ localeCode === 'ru' ? 'TAB — дополнить · ↑↓ — история' : 'TAB — complete · ↑↓ — history' }}
        </span>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.terminal-console { position: fixed; z-index: 1000; right: 1.1rem; bottom: 1.1rem; font-family: var(--font-mono); }
.terminal-console__trigger { display: grid; min-width: 8.5rem; min-height: 2.5rem; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.55rem; padding: 0.5rem 0.65rem; border: 1px solid var(--color-control-border); border-radius: 2px; background: color-mix(in srgb, var(--color-bg) 92%, transparent); color: var(--color-text-muted); cursor: pointer; box-shadow: 0 8px 30px rgb(0 0 0 / 16%); }
.terminal-console__trigger > span:first-child { color: var(--color-accent); font-size: 1rem; }
.terminal-console__trigger kbd { padding: 0.15rem 0.25rem; border: 1px solid var(--color-line); color: var(--color-text-muted); font: inherit; font-size: 0.55rem; }
.terminal-console__panel { position: absolute; right: 0; bottom: 3rem; display: grid; width: min(92vw, 38rem); height: min(68vh, 32rem); grid-template-rows: auto 1fr auto auto; border: 1px solid var(--color-control-border); border-radius: 2px; background: color-mix(in srgb, var(--color-bg) 97%, #000); box-shadow: 0 30px 90px rgb(0 0 0 / 40%), 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent); }
.terminal-console__panel::after { position: absolute; opacity: 0.3; background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 5%) 4px); content: ''; inset: 0; pointer-events: none; }
.terminal-console__head { z-index: 1; display: flex; min-height: 2.4rem; align-items: center; justify-content: space-between; padding-inline: 0.75rem; border-bottom: 1px solid var(--color-line); color: var(--color-text-muted); }
.terminal-console__head button { border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-family: inherit; }
.terminal-console__history { z-index: 1; padding: 1rem; overflow-y: auto; font-size: 0.7rem; }
.terminal-console__history p { margin: 0 0 0.55rem; color: var(--color-text-muted); white-space: pre-wrap; }
.terminal-console__history .is-input { color: var(--color-text); }
.terminal-console__history .is-output::before { margin-right: 0.5rem; color: var(--color-accent); content: '›'; }
.terminal-console__history .is-error { color: var(--color-danger); }
.terminal-console__suggestions { z-index: 1; display: flex; min-height: 3rem; gap: 1px; padding: 0.35rem; overflow-x: auto; border-top: 1px solid var(--color-line); background: color-mix(in srgb, var(--color-accent) 4%, transparent); }
.terminal-console__suggestions button { display: grid; min-width: 6.8rem; padding: 0.35rem 0.5rem; border: 0; background: transparent; color: var(--color-text); cursor: pointer; font-family: inherit; font-size: 0.64rem; text-align: left; }
.terminal-console__suggestions button:hover,
.terminal-console__suggestions button:focus-visible { background: color-mix(in srgb, var(--color-accent) 12%, transparent); }
.terminal-console__suggestions span { color: var(--color-accent); }
.terminal-console__suggestions small { margin-top: 0.2rem; color: var(--color-text-muted); font-size: 0.52rem; white-space: nowrap; }
.terminal-console__form { z-index: 1; display: grid; min-height: 3rem; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.55rem; padding-inline: 0.75rem; border-top: 1px solid var(--color-line); color: var(--color-accent); font-size: 0.7rem; }
.terminal-console__form input { min-width: 0; border: 0; outline: 0; background: transparent; color: var(--color-text); caret-color: var(--color-accent); font-family: inherit; }
.terminal-console__key-hints { color: var(--color-text-muted); font-size: 0.5rem; white-space: nowrap; }

@media (max-width: 600px) {
  .terminal-console { right: 0.65rem; bottom: 0.65rem; }
  .terminal-console__panel { position: fixed; right: 0.5rem; bottom: 3.8rem; left: 0.5rem; width: auto; height: min(72svh, 32rem); }
  .terminal-console__trigger { min-width: 4.4rem; }
  .terminal-console__trigger > span:nth-child(2),
  .terminal-console__trigger kbd { display: none; }
  .terminal-console__key-hints { display: none; }
}
</style>
