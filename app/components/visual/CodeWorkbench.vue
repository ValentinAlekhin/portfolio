<script setup lang="ts">
type WorkbenchTab = 'portfolio.ts' | 'runtime.log' | 'ascii.va'

const { t, tm } = useI18n()
const activeTab = ref<WorkbenchTab>('portfolio.ts')
const buildState = ref<'ready' | 'building' | 'passed'>('ready')
const buildProgress = ref(100)
let buildTimer: ReturnType<typeof setInterval> | undefined

const tabs: WorkbenchTab[] = ['portfolio.ts', 'runtime.log', 'ascii.va']
const logs = computed(() => tm('workbench.logs') as unknown as string[])

const buildLabel = computed(() => {
  if (buildState.value === 'building') return `${t('workbench.building')} ${buildProgress.value}%`
  if (buildState.value === 'passed') return t('workbench.passed')
  return t('workbench.run')
})

function runBuild() {
  if (buildState.value === 'building') return
  buildState.value = 'building'
  buildProgress.value = 0
  if (buildTimer) clearInterval(buildTimer)
  buildTimer = setInterval(() => {
    buildProgress.value += 8
    if (buildProgress.value >= 100) {
      buildProgress.value = 100
      buildState.value = 'passed'
      if (buildTimer) clearInterval(buildTimer)
    }
  }, 45)
}

onBeforeUnmount(() => {
  if (buildTimer) clearInterval(buildTimer)
})
</script>

<template>
  <div class="workbench">
    <div class="workbench__titlebar">
      <div
        class="workbench__lights"
        aria-hidden="true"
      >
        <i /><i /><i />
      </div>
      <span class="system-label">~/valentin/portfolio</span>
      <span class="workbench__branch system-label">main*</span>
    </div>

    <div class="workbench__body">
      <aside
        class="workbench__explorer"
        :aria-label="t('workbench.sourceFiles')"
      >
        <span class="system-label">{{ t('workbench.explorer') }}</span>
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          <i aria-hidden="true">{{ tab.endsWith('.ts') ? 'TS' : tab.endsWith('.log') ? '::' : '##' }}</i>
          {{ tab }}
        </button>
      </aside>

      <div class="workbench__editor">
        <div class="workbench__tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}<span v-if="activeTab === tab"> ×</span>
          </button>
        </div>

        <div class="workbench__code">
          <ol
            v-if="activeTab === 'portfolio.ts'"
            class="code-lines"
          >
            <li><code><b class="token-keyword">interface</b> <b class="token-type">ProductDeveloper</b> <span class="token-punct">&#123;</span></code></li>
            <li><code>&nbsp;&nbsp;<span class="token-prop">{{ t('workbench.nameKey') }}</span><span class="token-punct">:</span> <span class="token-string">'{{ t('workbench.name') }}'</span></code></li>
            <li><code>&nbsp;&nbsp;<span class="token-prop">{{ t('workbench.scopeKey') }}</span><span class="token-punct">:</span> <span class="token-array">{{ t('workbench.scope') }}</span></code></li>
            <li><code>&nbsp;&nbsp;<span class="token-prop">{{ t('workbench.stackKey') }}</span><span class="token-punct">:</span> <span class="token-string">'Vue + Nuxt + Node + Go'</span></code></li>
            <li><code>&nbsp;&nbsp;<span class="token-prop">{{ t('workbench.availableKey') }}</span><span class="token-punct">:</span> <b class="token-bool">true</b></code></li>
            <li><code><span class="token-punct">&#125;</span></code></li>
            <li><code>&nbsp;</code></li>
            <li><code><span class="token-comment">{{ t('workbench.comment') }}</span></code></li>
            <li><code><b class="token-keyword">export default</b> <span class="token-fn">ship</span><span class="token-punct">(idea)</span></code></li>
          </ol>

          <div
            v-else-if="activeTab === 'runtime.log'"
            class="runtime-log system-label"
          >
            <p
              v-for="(message, index) in logs"
              :key="message"
            >
              <span>11:42:0{{ index + 1 }}</span><b>[OK]</b> {{ message }}
            </p>
            <p class="runtime-log__prompt">
              valentin@alekhin:~$ <i />
            </p>
          </div>

          <pre
            v-else
            class="ascii-logo"
            :aria-label="t('workbench.asciiLabel')"
          >
██╗   ██╗ █████╗
██║   ██║██╔══██╗
██║   ██║███████║
╚██╗ ██╔╝██╔══██║
 ╚████╔╝ ██║  ██║
  ╚═══╝  ╚═╝  ╚═╝</pre>
        </div>

        <div class="workbench__status system-label">
          <span>{{ t('workbench.line') }}</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
          <button
            type="button"
            :data-state="buildState"
            @click="runBuild"
          >
            {{ buildLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.workbench {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-control-border);
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-surface) 94%, #000);
  box-shadow: 0 30px 80px rgb(0 0 0 / 22%), 0 0 40px color-mix(in srgb, var(--color-accent) 8%, transparent);
  font-family: var(--font-mono);
}

.workbench::after {
  position: absolute;
  z-index: 5;
  opacity: 0.3;
  background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 5%) 4px);
  content: '';
  inset: 0;
  pointer-events: none;
}

.workbench__titlebar {
  display: grid;
  min-height: 2.2rem;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-inline: 0.8rem;
  border-bottom: 1px solid var(--color-line);
  color: var(--color-text-muted);
  font-size: 0.6rem;
}

.workbench__lights { display: flex; gap: 0.35rem; }
.workbench__lights i { width: 0.42rem; height: 0.42rem; border: 1px solid var(--color-control-border); border-radius: 50%; }
.workbench__lights i:first-child { background: var(--color-accent); }
.workbench__branch { justify-self: end; color: var(--color-accent); }
.workbench__body { display: grid; min-height: 30rem; grid-template-columns: 9.5rem 1fr; }

.workbench__explorer {
  padding: 1rem 0.55rem;
  border-right: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-bg) 55%, var(--color-surface));
}

.workbench__explorer > span { display: block; padding: 0 0.45rem 0.8rem; color: var(--color-text-muted); font-size: 0.58rem; }
.workbench__explorer button { display: grid; width: 100%; min-height: 2rem; grid-template-columns: 1.6rem 1fr; align-items: center; padding: 0.2rem 0.4rem; border: 0; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 0.66rem; text-align: left; }
.workbench__explorer button.active { background: color-mix(in srgb, var(--color-accent) 11%, transparent); color: var(--color-text); }
.workbench__explorer i { color: var(--color-accent); font-size: 0.55rem; font-style: normal; }
.workbench__editor { display: grid; min-width: 0; grid-template-rows: auto 1fr auto; }
.workbench__tabs { display: flex; min-height: 2.25rem; overflow: hidden; border-bottom: 1px solid var(--color-line); }
.workbench__tabs button { min-width: 8.5rem; padding: 0.5rem 0.75rem; border: 0; border-right: 1px solid var(--color-line); background: transparent; color: var(--color-text-muted); cursor: pointer; font-family: var(--font-mono); font-size: 0.62rem; text-align: left; }
.workbench__tabs button.active { box-shadow: inset 0 2px var(--color-accent); background: var(--color-surface); color: var(--color-text); }
.workbench__code { min-height: 0; overflow: hidden; padding: clamp(1.2rem, 3vw, 2.2rem) 1rem; }
.code-lines { margin: 0; padding-left: 3rem; color: var(--color-text-muted); font-size: clamp(0.7rem, 1vw, 0.9rem); line-height: 2; }
.code-lines li { padding-left: 0.85rem; border-left: 1px solid color-mix(in srgb, var(--color-line) 60%, transparent); }
.code-lines li::marker { color: color-mix(in srgb, var(--color-text-muted) 55%, transparent); font-size: 0.65rem; }
.token-keyword { color: #d275ff; font-weight: 500; }
.token-type,
.token-fn { color: #58d6d6; }
.token-prop { color: #7fc9ff; }
.token-string,
.token-array { color: #d5c07b; }
.token-bool,
.token-punct { color: var(--color-accent); }
.token-comment { color: var(--color-text-muted); font-style: italic; }
.runtime-log { padding: 1rem; font-size: 0.7rem; text-transform: none; }
.runtime-log p { display: grid; grid-template-columns: 6.4rem 3rem 1fr; gap: 0.4rem; margin: 0 0 0.85rem; }
.runtime-log span { color: var(--color-text-muted); }
.runtime-log b { color: var(--color-accent); }
.runtime-log__prompt { display: block !important; margin-top: 2rem !important; color: var(--color-accent); }
.runtime-log__prompt i { display: inline-block; width: 0.55em; height: 1em; background: currentcolor; vertical-align: -0.15em; animation: caret 1s steps(1) infinite; }
.ascii-logo { margin: 0; color: var(--color-accent); font-family: var(--font-mono); font-size: clamp(0.72rem, 1.5vw, 1.2rem); line-height: 1.35; text-shadow: 0 0 18px color-mix(in srgb, var(--color-accent) 50%, transparent); }
.workbench__status { display: flex; min-height: 2rem; align-items: center; justify-content: flex-end; gap: 1rem; padding-left: 0.7rem; border-top: 1px solid var(--color-line); background: color-mix(in srgb, var(--color-accent) 7%, var(--color-surface)); color: var(--color-text-muted); font-size: 0.52rem; }
.workbench__status button { align-self: stretch; padding-inline: 0.75rem; border: 0; border-left: 1px solid var(--color-line); background: transparent; color: var(--color-accent); cursor: pointer; font-family: inherit; font-size: inherit; }
.workbench__status button[data-state='building'] { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
.workbench__status button[data-state='passed'] { background: var(--color-accent); color: var(--color-accent-ink); }

@keyframes caret { 50% { opacity: 0; } }

@media (max-width: 680px) {
  .workbench__body { min-height: 25rem; grid-template-columns: 1fr; }
  .workbench__explorer { display: none; }
  .workbench__tabs button { min-width: auto; flex: 1; padding-inline: 0.4rem; font-size: 0.55rem; }
  .workbench__code { padding-inline: 0.3rem; }
  .code-lines { padding-left: 2.5rem; font-size: 0.61rem; }
  .workbench__status > span { display: none; }
  .workbench__status button { margin-left: auto; }
}
</style>
