<script setup lang="ts">
const { copy } = usePortfolio()
const activeId = ref(copy.value.capabilities.items[0]?.id ?? '')
const active = computed(() => copy.value.capabilities.items.find(item => item.id === activeId.value) ?? copy.value.capabilities.items[0])
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
          :eyebrow="copy.capabilities.eyebrow"
          :title="copy.capabilities.title"
          :description="copy.capabilities.description"
          title-id="capabilities-title"
        />
      </MotionReveal>

      <MotionReveal>
        <div class="capabilities__desktop">
          <div
            class="capabilities__pipeline"
            role="list"
          >
            <button
              v-for="(item, index) in copy.capabilities.items"
              :key="item.id"
              type="button"
              :class="{ active: activeId === item.id }"
              :aria-pressed="activeId === item.id"
              @mouseenter="activeId = item.id"
              @focus="activeId = item.id"
              @click="activeId = item.id"
            >
              <span class="system-label">0{{ index + 1 }}</span>
              <strong>{{ item.title }}</strong>
              <i aria-hidden="true" />
            </button>
          </div>

          <div
            v-if="active"
            class="capabilities__detail"
            aria-live="polite"
          >
            <p class="system-label">
              ACTIVE LAYER / {{ active.id }}
            </p>
            <h3>{{ active.title }}</h3>
            <p>{{ active.description }}</p>
            <ul>
              <li
                v-for="detail in active.details"
                :key="detail"
              >
                <span>→</span>{{ detail }}
              </li>
            </ul>
          </div>
        </div>

        <div class="capabilities__mobile">
          <details
            v-for="(item, index) in copy.capabilities.items"
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
  gap: clamp(3rem, 8vw, 8rem);
}

.capabilities__pipeline { position: relative; }
.capabilities__pipeline::before { position: absolute; top: 2rem; bottom: 2rem; left: 2.1rem; width: 1px; background: var(--color-line); content: ''; }

.capabilities__pipeline button {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 5.6rem;
  grid-template-columns: 3.2rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border: 0;
  border-bottom: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  text-align: left;
}

.capabilities__pipeline button > span { z-index: 1; display: grid; width: 2.2rem; height: 2.2rem; border: 1px solid var(--color-line); border-radius: 50%; background: var(--color-bg); place-items: center; }
.capabilities__pipeline strong { font-size: clamp(1.1rem, 2vw, 1.5rem); font-weight: 560; }
.capabilities__pipeline i { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--color-line); }
.capabilities__pipeline button.active { color: var(--color-text); }
.capabilities__pipeline button.active > span { border-color: var(--color-accent); color: var(--color-accent); }
.capabilities__pipeline button.active i { background: var(--color-accent); box-shadow: 0 0 14px var(--color-accent); }

.capabilities__detail { position: sticky; top: calc(var(--header-height) + 2rem); align-self: start; min-height: 29rem; padding: clamp(2rem, 5vw, 4rem); border: 1px solid var(--color-line); background: var(--color-surface); }
.capabilities__detail > p:first-child { margin: 0; color: var(--color-accent); }
.capabilities__detail h3 { max-width: 10ch; margin: 4rem 0 0; font-size: clamp(2.8rem, 5vw, 5.2rem); font-weight: 540; letter-spacing: -0.065em; line-height: 0.92; }
.capabilities__detail h3 + p { max-width: 52ch; margin: 1.5rem 0 0; color: var(--color-text-muted); }
.capabilities__detail ul { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 2rem 0 0; list-style: none; }
.capabilities__detail li { padding: 0.5rem 0.7rem; border: 1px solid var(--color-line); border-radius: 6px; font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; }
.capabilities__detail li span { margin-right: 0.4rem; color: var(--color-accent); }
.capabilities__mobile { display: none; }

@media (max-width: 820px) {
  .capabilities__desktop { display: none; }
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
