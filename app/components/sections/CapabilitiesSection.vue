<script setup lang="ts">
import type { CapabilityItem } from '~/types/content'

const { t } = useI18n()
const itemDefinitions = [
  { id: 'discovery', details: ['mvp', 'workflows', 'scope'] },
  { id: 'interface', details: ['design', 'editors', 'prototypes'] },
  { id: 'frontend', details: ['frameworks', 'typescript', 'state'] },
  { id: 'backend', details: ['runtime', 'integrations', 'externalApi'] },
  { id: 'launch', details: ['architecture', 'deployment', 'development'] },
] as const
const items = computed<CapabilityItem[]>(() => itemDefinitions.map(item => ({
  id: item.id,
  title: t(`capabilities.items.${item.id}.title`),
  description: t(`capabilities.items.${item.id}.description`),
  details: item.details.map(detail => t(`capabilities.items.${item.id}.details.${detail}`)),
})))
const activeId = ref(items.value[0]?.id ?? '')
const active = computed(() => items.value.find(item => item.id === activeId.value) ?? items.value[0])
</script>

<template>
  <section
    id="services"
    class="page-section section-rule capabilities"
    aria-labelledby="capabilities-title"
  >
    <div class="site-container">
      <MotionReveal>
        <BaseSectionHeading
          index="03"
          :eyebrow="t('capabilities.eyebrow')"
          :title="t('capabilities.title')"
          :description="t('capabilities.description')"
          title-id="capabilities-title"
        />
      </MotionReveal>

      <MotionReveal>
        <div class="capabilities__window-head system-label">
          <span>src/product_pipeline/</span>
          <span>{{ t('capabilities.inspectMode') }}</span>
        </div>
        <div class="capabilities__desktop">
          <div
            class="capabilities__pipeline"
            role="list"
          >
            <button
              v-for="(item, index) in items"
              :key="item.id"
              type="button"
              :class="{ active: activeId === item.id }"
              :aria-pressed="activeId === item.id"
              @mouseenter="activeId = item.id"
              @focus="activeId = item.id"
              @click="activeId = item.id"
            >
              <span class="system-label">{{ index + 12 }}</span>
              <strong><i aria-hidden="true">├─</i> {{ item.id }}.ts</strong>
              <em aria-hidden="true">{{ activeId === item.id ? '●' : '○' }}</em>
            </button>
          </div>

          <div
            v-if="active"
            class="capabilities__detail"
            aria-live="polite"
          >
            <p class="system-label">
              <b>import</b> &#123; {{ active.id }} &#125; <b>from</b> './pipeline'
            </p>
            <h3><span>async function</span> {{ active.title }}()</h3>
            <p>/* {{ active.description }} */</p>
            <ul>
              <li
                v-for="detail in active.details"
                :key="detail"
              >
                <span>await</span> {{ detail }}<i>();</i>
              </li>
            </ul>
          </div>
        </div>

        <div class="capabilities__mobile">
          <details
            v-for="(item, index) in items"
            :key="item.id"
            :open="index === 0"
          >
            <summary><span class="system-label">0{{ index + 1 }}</span>{{ item.title }}</summary>
            <div>
              <p>{{ item.description }}</p>
              <ul>
                <li
                  v-for="detail in item.details"
                  :key="detail"
                >
                  {{ detail }}
                </li>
              </ul>
            </div>
          </details>
        </div>
      </MotionReveal>
    </div>
  </section>
</template>

<style scoped lang="scss">
.capabilities__desktop {
  display: grid;
  grid-template-columns: minmax(18rem, 5fr) minmax(22rem, 7fr);
  gap: 0;
  border: 1px solid var(--color-control-border);
  background: var(--color-surface);
  box-shadow: 0 30px 80px rgb(0 0 0 / 12%);
}

.capabilities__window-head { display: flex; min-height: 2.6rem; align-items: center; justify-content: space-between; padding-inline: 0.9rem; border: 1px solid var(--color-control-border); border-bottom: 0; color: var(--color-text-muted); }
.capabilities__window-head span:last-child { color: var(--color-accent); }

.capabilities__pipeline { position: relative; padding: 1rem 0; border-right: 1px solid var(--color-line); background: color-mix(in srgb, var(--color-bg) 65%, var(--color-surface)); }

.capabilities__pipeline button {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 4.2rem;
  grid-template-columns: 2.4rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  border: 0;
  border-bottom: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  text-align: left;
}

.capabilities__pipeline button > span { z-index: 1; color: var(--color-text-muted); text-align: right; }
.capabilities__pipeline strong { overflow: hidden; font-family: var(--font-mono); font-size: 0.78rem; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.capabilities__pipeline strong i { color: var(--color-text-muted); font-style: normal; }
.capabilities__pipeline em { color: var(--color-line); font-size: 0.65rem; font-style: normal; }
.capabilities__pipeline button.active { color: var(--color-text); }
.capabilities__pipeline button.active { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
.capabilities__pipeline button.active > span,
.capabilities__pipeline button.active em { color: var(--color-accent); }

.capabilities__detail { position: sticky; top: calc(var(--header-height) + 2rem); align-self: start; min-height: 31rem; padding: clamp(2rem, 5vw, 4rem); background: var(--color-surface); }
.capabilities__detail > p:first-child { margin: 0; color: var(--color-text); font-family: var(--font-mono); text-transform: none; }
.capabilities__detail > p:first-child b { color: #c67be5; font-weight: 500; }
.capabilities__detail h3 { max-width: 12ch; margin: 4rem 0 0; font-family: var(--font-mono); font-size: clamp(2rem, 4vw, 4.4rem); font-weight: 480; letter-spacing: -0.055em; line-height: 1; }
.capabilities__detail h3 span { display: block; margin-bottom: 0.6rem; color: #62b7e8; font-size: 0.23em; letter-spacing: 0; }
.capabilities__detail h3 + p { max-width: 52ch; margin: 1.5rem 0 0; color: var(--color-text-muted); font-family: var(--font-mono); font-size: 0.78rem; }
.capabilities__detail ul { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 2rem 0 0; list-style: none; }
.capabilities__detail li { padding: 0.5rem 0; font-family: var(--font-mono); font-size: 0.68rem; }
.capabilities__detail li span { margin-right: 0.4rem; color: #c67be5; }
.capabilities__detail li i { color: var(--color-accent); font-style: normal; }
.capabilities__mobile { display: none; }

@media (max-width: 820px) {
  .capabilities__desktop { display: none; }
  .capabilities__window-head { display: none; }
  .capabilities__mobile { display: block; border-top: 1px solid var(--color-line); }
  .capabilities__mobile details { border-bottom: 1px solid var(--color-line); }
  .capabilities__mobile summary { display: grid; min-height: 4.8rem; grid-template-columns: 3rem 1fr auto; align-items: center; cursor: pointer; font-size: 1.2rem; font-weight: 600; list-style: none; }
  .capabilities__mobile summary::after { color: var(--color-accent); content: '+'; font-family: var(--font-mono); }
  .capabilities__mobile details[open] summary::after { content: '−'; }
  .capabilities__mobile summary span { color: var(--color-accent); }
  .capabilities__mobile details > div { padding: 0 0 2rem 3rem; color: var(--color-text-muted); }
  .capabilities__mobile ul { margin: 1rem 0 0; list-style: none; }
  .capabilities__mobile li::before { margin-right: 0.5rem; color: var(--color-accent); content: '→'; }
}
</style>
