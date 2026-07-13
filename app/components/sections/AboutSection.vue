<script setup lang="ts">
const { copy } = usePortfolio()
</script>

<template>
  <section
    id="about"
    class="page-section section-rule about-section"
    aria-labelledby="about-title"
  >
    <div class="site-container">
      <MotionReveal>
        <BaseSectionHeading
          index="05"
          :eyebrow="copy.about.eyebrow"
          :title="copy.about.title"
          title-id="about-title"
        />
      </MotionReveal>

      <div class="about-grid">
        <MotionReveal class="about-copy">
          <p
            v-for="paragraph in copy.about.paragraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </MotionReveal>

        <MotionReveal
          :delay="0.08"
          class="about-principles"
        >
          <p class="system-label">
            {{ copy.about.principlesLabel }}
          </p>
          <ol>
            <li
              v-for="(principle, index) in copy.about.principles"
              :key="principle"
            >
              <span class="system-label">0{{ index + 1 }}</span>{{ principle }}
            </li>
          </ol>
        </MotionReveal>
      </div>

      <MotionReveal class="now-board">
        <div
          v-for="item in copy.about.now"
          :key="item.label"
          class="now-board__item"
        >
          <span class="system-label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </MotionReveal>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-grid { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(3rem, 9vw, 9rem); }
.about-copy { font-size: clamp(1.2rem, 2vw, 1.65rem); line-height: 1.48; }
.about-copy p { margin: 0; }
.about-copy p + p { margin-top: 1.5rem; color: var(--color-text-muted); }
.about-principles > p { margin: 0 0 1rem; color: var(--color-text-muted); }
.about-principles ol { margin: 0; list-style: none; border-top: 1px solid var(--color-line); }
.about-principles li { display: grid; min-height: 4.7rem; grid-template-columns: 3rem 1fr; align-items: center; border-bottom: 1px solid var(--color-line); }
.about-principles li span { color: var(--color-accent); }
.now-board { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: clamp(4rem, 8vw, 8rem); border: 1px solid var(--color-line); }
.now-board__item { min-height: 10rem; padding: 1.3rem; border-right: 1px solid var(--color-line); background: var(--color-surface); }
.now-board__item:last-child { border-right: 0; }
.now-board__item span { display: block; color: var(--color-text-muted); }
.now-board__item strong { display: block; margin-top: 3rem; font-size: clamp(1.15rem, 2vw, 1.7rem); font-weight: 560; line-height: 1.15; }

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; }
  .now-board { grid-template-columns: 1fr; }
  .now-board__item { min-height: 8rem; border-right: 0; border-bottom: 1px solid var(--color-line); }
  .now-board__item:last-child { border-bottom: 0; }
  .now-board__item strong { margin-top: 2rem; }
}
</style>
