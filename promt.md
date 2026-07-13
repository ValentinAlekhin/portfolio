# Техническое задание на редизайн alekhin.dev

**Версия:** 1.0
**Дата:** 13 июля 2026 года
**Проект:** персональное портфолио Валентина Алёхина
**Рабочее название концепции:** `VA // PRODUCT SYSTEM`

В текущей версии сайта уже есть правильная коммерческая основа: позиционирование, проект PowerSketch, услуги, процесс работы, блок о сотрудничестве и контакты. Редизайн должен сохранить эту структуру, но добавить персональный визуальный язык, интерактивность и отдельную страницу кейса. Контактные данные, которые сейчас заменены заглушкой, должны быть добавлены до публикации новой версии. ([alekhin.dev][1])

---

## 1. Зафиксированные технические решения

### 1.1. Основной стек

| Область                       | Решение                                      |
| ----------------------------- | -------------------------------------------- |
| Framework                     | Nuxt 4                                       |
| UI framework                  | Vue 3, Composition API, `<script setup>`     |
| Язык                          | TypeScript, строгий режим                    |
| Стили                         | SCSS + CSS Custom Properties                 |
| Сложные анимации              | GSAP                                         |
| Scroll-анимации               | GSAP ScrollTrigger                           |
| Перестроение элементов        | GSAP Flip                                    |
| Простые анимации              | CSS transitions, CSS animations              |
| Доступные headless-компоненты | Reka UI, только точечно                      |
| Локализация                   | `@nuxtjs/i18n`                               |
| Изображения                   | `@nuxt/image`                                |
| Шрифты                        | Manrope Variable + JetBrains Mono Variable   |
| Unit-тесты                    | Vitest + `@nuxt/test-utils`                  |
| E2E-тесты                     | Playwright                                   |
| Пакетный менеджер             | pnpm                                         |
| Рендеринг                     | SSG/prerender для публичных страниц          |
| Состояние                     | Vue/Nuxt composables и `useState`, без Pinia |

Целевой framework — Nuxt 4.x. На момент подготовки ТЗ официальная документация отображает версию 4.4.8. Nuxt поддерживает обычные Vue-переходы между страницами и экспериментальную интеграцию View Transitions API; последняя не должна быть обязательной зависимостью реализации. Vue-компоненты пишутся через Composition API и `<script setup lang="ts">`. ([Nuxt][2])

### 1.2. Финальный выбор между Tailwind CSS и SCSS

Для проекта выбирается **SCSS**.

Tailwind CSS не используется и не устанавливается. Причины:

* дизайн строится на нестандартных псевдоэлементах, декоративных слоях и сложных состояниях;
* потребуется много локальных CSS-переменных для управления анимациями;
* CRT-рамка, scanlines, маски, матричный переключатель и системные линии проще поддерживаются в компонентных SCSS-файлах;
* HTML-шаблоны должны оставаться читаемыми;
* не следует одновременно использовать Tailwind и SCSS как две параллельные системы.

Nuxt поддерживает CSS-препроцессоры и локальные стили в `app/assets`, а Vue — scoped-стили внутри SFC-компонентов. Для SCSS следует использовать современную модульную систему `@use` и `@forward`, а не устаревающий `@import`. ([Nuxt][3])

### 1.3. Запрещённые зависимости

В production-зависимостях не должно быть:

* Vuetify;
* PrimeVue;
* Element Plus;
* Quasar;
* Naive UI;
* Bootstrap;
* Tailwind CSS;
* shadcn-vue;
* готового UI kit;
* `motion-v`;
* `@vueuse/motion`;
* Lenis;
* Locomotive Scroll;
* Three.js;
* PixiJS;
* Rive;
* Lottie;
* библиотеки кастомного курсора;
* отдельного state manager без реальной необходимости.

### 1.4. Допустимое использование Reka UI

Reka UI разрешается использовать только там, где самостоятельная реализация доступности неоправданно сложна:

* `Dialog` для контактной панели;
* `Dialog` для мобильного меню;
* потенциально `Popover` для дополнительного переключателя;
* потенциально `Tooltip`, если подсказка действительно нужна.

Карточки, кнопки, ссылки, сетка, секции, списки проектов, переключатель темы и все визуальные компоненты создаются самостоятельно.

Reka UI представляет собой набор неоформленных доступных Vue-примитивов. В частности, его `Dialog` реализует focus trap, возврат фокуса, управление с клавиатуры и закрытие по Escape, при этом не навязывает визуальное оформление. ([Reka][4])

---

# 2. Цель редизайна

## 2.1. Основная цель

Превратить существующее портфолио из аккуратной информационной страницы в **живую персональную рабочую систему продуктового разработчика**.

Сайт должен одновременно демонстрировать:

* системное мышление;
* способность создавать продукт целиком;
* внимание к интерфейсам;
* техническую компетентность;
* спокойный профессионализм;
* склонность к экспериментам;
* личный характер без чрезмерной игровой стилизации.

## 2.2. Ключевая визуальная метафора

Сайт воспринимается как **инженерная рабочая станция**, в которой информация проходит по цепочке:

```text
IDEA → INTERFACE → FRONTEND → BACKEND → INFRASTRUCTURE → LAUNCH
```

Эта цепочка должна повторяться в разных частях сайта:

* в системной схеме первого экрана;
* в блоке компетенций;
* в анимации сигнала;
* в странице кейса;
* в финальном CTA.

## 2.3. Соотношение визуальных подходов

* 80% — современное, чистое и коммерчески понятное портфолио;
* 20% — терминальность, CRT, координаты, каретка, системные статусы и интерактивные эксперименты.

## 2.4. Что не должно получиться

Сайт не должен выглядеть как:

* полноценный терминал;
* копия «Матрицы»;
* ретроигра;
* демосцена ради эффектов;
* сайт с обязательной заставкой;
* интерфейс, где невозможно быстро найти услуги и контакты;
* набор несвязанных Awwwards-эффектов.

---

# 3. Объём работ

## 3.1. Основные страницы

```text
/ru/
/en/

/ru/projects/powersketch/
/en/projects/powersketch/

/ru/projects/[slug]/
/en/projects/[slug]/

404
```

Корневой `/` должен перенаправлять на локализованный URL.

Рекомендуемая стратегия локализации — всегда использовать префикс языка:

```text
/ru/
/en/
```

Это сохранит существующий формат URL и сделает структуру предсказуемой.

## 3.2. Секции главной страницы

```text
01  SYSTEM HEADER
02  HERO / BOOT
03  SELECTED SYSTEMS
04  PRODUCT PIPELINE
05  WORK PROTOCOL
06  LAB / EXPERIMENTS
07  ABOUT / NOW
08  OPEN CHANNEL
09  SYSTEM FOOTER
```

## 3.3. Существующие якоря

Для совместимости следует сохранить или перенаправить существующие якоря:

```text
#top
#projects
#services
#process
#about
#contacts
```

---

# 4. Визуальная система

## 4.1. Шрифты

### Основной шрифт — Manrope Variable

Использование:

* крупные заголовки;
* основной текст;
* кнопки;
* названия проектов;
* навигация;
* подписи и описания.

Почему выбран:

* современная форма;
* достаточно мягкие знаки;
* не выглядит слишком «квадратным»;
* хорошо сочетается с технической стилистикой;
* подходит для крупной кириллицы;
* переменная версия содержит диапазон начертаний 200–800.

### Моноширинный шрифт — JetBrains Mono Variable

Использование:

* системные статусы;
* номера секций;
* координаты;
* время;
* технологические теги;
* терминальные строки;
* подписи элементов управления;
* блок Lab;
* каретка.

JetBrains Mono поддерживает кириллицу и имеет диапазон начертаний 100–800. Основной текст сайта не должен полностью переводиться в моноширинный шрифт. Ориентировочно его доля — не более 20–25% всей типографики. ([fontsource.org][5])

### Подключение

Шрифты должны быть self-hosted:

```bash
pnpm add \
  @fontsource-variable/manrope \
  @fontsource-variable/jetbrains-mono
```

В production должны попадать только необходимые Latin/Cyrillic WOFF2-наборы. Не загружать курсивы, если они не используются.

```scss
:root {
  --font-sans: "Manrope Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", monospace;
}
```

Для системных подписей:

```scss
.system-label {
  font-family: var(--font-mono);
  font-variant-ligatures: none;
  font-variant-numeric: tabular-nums;
}
```

## 4.2. Типографическая шкала

| Стиль           | Размер                          |
| --------------- | ------------------------------- |
| Hero display    | `clamp(4rem, 10vw, 10.5rem)`    |
| H1 внутри кейса | `clamp(3.5rem, 8vw, 8rem)`      |
| H2              | `clamp(2.75rem, 5vw, 5.5rem)`   |
| H3              | `clamp(1.5rem, 2.2vw, 2.5rem)`  |
| Lead            | `clamp(1.15rem, 1.5vw, 1.5rem)` |
| Body            | `clamp(1rem, 1.1vw, 1.125rem)`  |
| Small           | `0.875rem`                      |
| Mono label      | `0.6875–0.8125rem`              |

Правила:

* крупные заголовки: `line-height: 0.84–0.95`;
* основной текст: `line-height: 1.55–1.7`;
* максимальная ширина обычного текста: `66ch`;
* максимальная ширина крупного вводного текста: `32ch`;
* отрицательный letter-spacing разрешён только для крупных заголовков;
* не использовать uppercase для длинных русскоязычных фраз.

---

# 5. Цветовая палитра

На первом релизе реализуются две темы:

```text
SYSTEM      светлая нейтральная
PHOSPHOR    тёмная терминальная
```

Третья янтарная тема не входит в основной объём.

## 5.1. Светлая тема `SYSTEM`

| Токен                    |      Цвет | Назначение               |
| ------------------------ | --------: | ------------------------ |
| `--color-bg`             | `#EDEBE4` | Основной фон             |
| `--color-surface`        | `#F7F5EF` | Выделенные поверхности   |
| `--color-text`           | `#11130F` | Основной текст           |
| `--color-text-muted`     | `#5D6259` | Вторичный текст          |
| `--color-line`           | `#C9CCC2` | Декоративные линии       |
| `--color-control-border` | `#7A8174` | Границы контролов        |
| `--color-accent`         | `#2B7330` | Доступный зелёный текст  |
| `--color-phosphor`       | `#A8FF60` | Свечение и hover-заливка |
| `--color-accent-ink`     | `#0A0C09` | Текст поверх phosphor    |
| `--color-focus`          | `#245F29` | Focus ring               |

Примерные коэффициенты контраста:

* `#11130F` на `#EDEBE4` — 15.66:1;
* `#5D6259` на `#EDEBE4` — 5.24:1;
* `#2B7330` на `#EDEBE4` — 4.89:1.

Яркий `#A8FF60` нельзя использовать как мелкий текст на светлом фоне. Он используется как декоративное свечение либо как фон с тёмным текстом.

## 5.2. Тёмная тема `PHOSPHOR`

| Токен                    |      Цвет | Назначение             |
| ------------------------ | --------: | ---------------------- |
| `--color-bg`             | `#090B09` | Основной фон           |
| `--color-surface`        | `#10140F` | Выделенные поверхности |
| `--color-text`           | `#F0F2EA` | Основной текст         |
| `--color-text-muted`     | `#A6AD9E` | Вторичный текст        |
| `--color-line`           | `#283025` | Декоративные линии     |
| `--color-control-border` | `#5C6B55` | Границы контролов      |
| `--color-accent`         | `#A8FF60` | Основной акцент        |
| `--color-accent-ink`     | `#0A0C09` | Текст на акценте       |
| `--color-focus`          | `#C9FF9B` | Focus ring             |

Примерные коэффициенты контраста:

* `#F0F2EA` на `#090B09` — 17.48:1;
* `#A6AD9E` на `#090B09` — 8.55:1;
* `#A8FF60` на `#090B09` — 16.12:1.

Минимальный контраст обычного текста должен быть не ниже 4.5:1. Для интерактивных границ и focus-индикаторов следует ориентироваться минимум на 3:1. ([W3C][6])

## 5.3. Базовые CSS-токены

```scss
:root {
  color-scheme: light;

  --color-bg: #edeae4;
  --color-surface: #f7f5ef;
  --color-text: #11130f;
  --color-text-muted: #5d6259;
  --color-line: #c9ccc2;
  --color-control-border: #7a8174;
  --color-accent: #2b7330;
  --color-phosphor: #a8ff60;
  --color-accent-ink: #0a0c09;
  --color-focus: #245f29;

  --duration-instant: 100ms;
  --duration-fast: 160ms;
  --duration-ui: 280ms;
  --duration-section: 650ms;
  --duration-page: 720ms;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  --layout-width: 90rem;
  --layout-gutter: clamp(1.25rem, 4vw, 4rem);
}

html[data-theme="phosphor"] {
  color-scheme: dark;

  --color-bg: #090b09;
  --color-surface: #10140f;
  --color-text: #f0f2ea;
  --color-text-muted: #a6ad9e;
  --color-line: #283025;
  --color-control-border: #5c6b55;
  --color-accent: #a8ff60;
  --color-phosphor: #a8ff60;
  --color-accent-ink: #0a0c09;
  --color-focus: #c9ff9b;
}
```

---

# 6. Сетка и адаптивность

## 6.1. Основная сетка

### Desktop, от 1200 px

* 12 колонок;
* максимальная ширина контента: 1440 px;
* внешний отступ: `clamp(32px, 4vw, 64px)`;
* межколоночный интервал: 24 px.

### Tablet, 768–1199 px

* 6 колонок;
* внешний отступ: 24–32 px;
* межколоночный интервал: 20 px.

### Mobile, до 767 px

* 4 колонки;
* внешний отступ: 20 px;
* межколоночный интервал: 16 px.

## 6.2. Общие правила

* использовать `min-height: 100svh`, а не жёсткий `100vh`;
* учитывать `safe-area-inset-*`;
* не создавать горизонтальный скролл;
* не фиксировать высоту текстовых карточек;
* декоративные элементы не должны влиять на layout;
* карточки должны строиться преимущественно линиями и расстояниями, а не одинаковыми округлыми контейнерами;
* базовые радиусы: 6 и 14 px;
* радиус CRT-превью задаётся отдельно и может быть процентным.

---

# 7. Архитектура проекта

```text
app/
├── app.vue
├── assets/
│   └── styles/
│       ├── settings/
│       │   ├── _tokens.scss
│       │   ├── _breakpoints.scss
│       │   └── _typography.scss
│       ├── tools/
│       │   ├── _mixins.scss
│       │   └── _functions.scss
│       ├── generic/
│       │   ├── _reset.scss
│       │   └── _fonts.scss
│       ├── elements/
│       │   └── _base.scss
│       ├── objects/
│       │   ├── _layout.scss
│       │   └── _grid.scss
│       ├── utilities/
│       │   ├── _a11y.scss
│       │   └── _motion.scss
│       └── main.scss
├── components/
│   ├── base/
│   │   ├── BaseButton.vue
│   │   ├── BaseLink.vue
│   │   ├── BaseSectionHeading.vue
│   │   └── BaseIcon.vue
│   ├── layout/
│   │   ├── SiteHeader.vue
│   │   ├── SiteFooter.vue
│   │   ├── MobileNavigation.vue
│   │   └── PageTransitionLayer.vue
│   ├── motion/
│   │   ├── MotionReveal.vue
│   │   ├── MagneticTarget.vue
│   │   ├── ScrambleText.vue
│   │   ├── TypewriterLine.vue
│   │   └── PointerHud.vue
│   ├── visual/
│   │   ├── SystemMap.vue
│   │   ├── CrtFrame.vue
│   │   ├── SignalPath.vue
│   │   └── MatrixGrid.vue
│   ├── projects/
│   │   ├── ProjectRow.vue
│   │   ├── ProjectPreview.vue
│   │   ├── ProjectPreviewCursor.vue
│   │   └── ProjectCaseHero.vue
│   └── sections/
│       ├── HeroSection.vue
│       ├── ProjectsSection.vue
│       ├── CapabilitiesSection.vue
│       ├── ProcessSection.vue
│       ├── LabSection.vue
│       ├── AboutSection.vue
│       └── ContactSection.vue
├── composables/
│   ├── useTheme.ts
│   ├── useMotionPreference.ts
│   ├── usePointerField.ts
│   ├── useMagnetic.ts
│   ├── useScrambleText.ts
│   ├── usePageTransition.ts
│   └── useLocalTime.ts
├── data/
│   ├── profile.ts
│   ├── projects.ts
│   ├── services.ts
│   ├── process.ts
│   └── lab.ts
├── pages/
│   ├── index.vue
│   └── projects/
│       └── [slug].vue
├── plugins/
│   └── gsap.client.ts
├── types/
│   ├── project.ts
│   └── content.ts
└── error.vue

i18n/
└── locales/
    ├── ru.json
    └── en.json

public/
├── images/
├── video/
├── icons/
└── og/
```

## 7.1. Правила архитектуры

* DOM API вызываются только на клиенте.
* GSAP подключается через client-only plugin.
* Важный текст не оборачивается целиком в `<ClientOnly>`.
* SSR должен возвращать полный читаемый контент.
* Анимация является улучшением, а не условием отображения.
* Не использовать глобальные `querySelectorAll`, когда можно применить template refs.
* Каждый GSAP scope должен очищаться при размонтировании через `gsap.context().revert()`.
* Pointer events и observers должны отписываться.
* Не запускать реактивное обновление Vue на каждое движение мыши.
* Все размеры, длительности и силы эффектов задаются через токены или параметры composable.

GSAP официально рекомендует использовать `gsap.context()` для сбора анимаций и их корректного удаления при размонтировании компонентов во Vue и других frameworks. ([gsap.com][7])

---

# 8. Анимационный стек

GSAP выбирается как единственный JavaScript animation engine. Не нужно одновременно подключать Motion, VueUse Motion или другую библиотеку.

GSAP и все его плагины в настоящее время доступны бесплатно. ScrollTrigger предназначен для привязки анимаций к прокрутке, а Flip — для переходов между разными геометрическими состояниями DOM-элементов. ([gsap.com][8])

## 8.1. Распределение ответственности

| Эффект                              | Реализация                                  |
| ----------------------------------- | ------------------------------------------- |
| Простая смена цвета                 | CSS transition                              |
| Hover-заливка кнопки                | CSS pseudo-element                          |
| Каретка                             | CSS keyframes                               |
| Scanlines                           | CSS repeating gradient                      |
| CRT-виньетка                        | CSS gradients                               |
| Параллакс по скроллу                | GSAP ScrollTrigger                          |
| Появление секций                    | GSAP ScrollTrigger                          |
| Hero timeline                       | GSAP timeline                               |
| Перестройка theme toggle            | GSAP Flip                                   |
| Переход project preview → case hero | GSAP Flip/GSAP timeline                     |
| Координаты мыши                     | Собственный composable                      |
| Магнитные кнопки                    | Собственный composable + GSAP interpolation |
| Scramble текста                     | Собственный Vue-composable                  |
| Следование превью за курсором       | Собственный `requestAnimationFrame` loop    |
| Contact Dialog                      | Reka UI + CSS/GSAP                          |
| Нативные View Transitions           | Только progressive enhancement              |

## 8.2. Motion-токены

```text
Микровзаимодействие:       120–180 ms
Обычный UI transition:    240–320 ms
Reveal элемента:          500–700 ms
Hero intro:               700–900 ms
Page transition:          650–800 ms
Theme reconstruction:     380–480 ms
```

Ограничения:

* переход страницы не должен блокировать взаимодействие дольше 900 ms;
* обычный entrance offset — не больше 24–32 px;
* магнитное смещение кнопки — не больше 8 px;
* смещение текста внутри кнопки — не больше 4 px;
* tilt project preview — не больше 3 градусов;
* масштаб preview — не больше `1.025`;
* pointer parallax в hero — не больше 12 px;
* эффект не должен создавать ощущение, что интерфейс «убегает» от курсора.

---

# 9. Собственные composables

## 9.1. `useMotionPreference`

Назначение:

* отслеживать `prefers-reduced-motion`;
* давать единый reactive-флаг;
* отключать GSAP timelines, параллакс и pointer effects;
* реагировать на изменение настройки без перезагрузки страницы.

API:

```ts
interface MotionPreference {
  reducedMotion: Readonly<Ref<boolean>>
  motionAllowed: Readonly<Ref<boolean>>
}
```

## 9.2. `usePointerField`

Назначение:

* хранить позицию указателя;
* рассчитывать нормализованные координаты `-1…1`;
* передавать значения в CSS custom properties;
* обслуживать HUD, hero-схему и project preview.

Требования:

* подписка только при `(hover: hover) and (pointer: fine)`;
* обработка через один `requestAnimationFrame`;
* не обновлять весь Vue component tree на каждый `pointermove`;
* координаты HUD обновлять максимум 20 раз в секунду;
* CSS-переменные для визуального эффекта разрешено обновлять с частотой экрана;
* отключать listener, когда страница скрыта.

Предлагаемые переменные:

```text
--pointer-x
--pointer-y
--pointer-nx
--pointer-ny
--pointer-speed
```

## 9.3. `useMagnetic`

Назначение:

* магнитное притяжение кнопок и ссылок;
* плавный возврат;
* ограничение максимального смещения.

Пример настроек:

```ts
interface MagneticOptions {
  strength?: number      // default 0.18
  maxOffset?: number     // default 8
  innerOffset?: number   // default 4
}
```

Эффект применяется только к:

* основному CTA;
* кнопке контакта;
* theme toggle;
* крупным ссылкам проектов.

Не применять ко всем ссылкам страницы.

## 9.4. `useScrambleText`

Назначение:

* эффект декодирования текста;
* переключатель темы;
* подписи режимов;
* редкие системные статусы.

Требования:

* финальная строка должна быть детерминированной;
* текст не должен оставаться нечитаемым дольше 400–500 ms;
* для русского и английского используются разные наборы символов;
* реальный текст остаётся доступным для screen reader;
* декоративная scrambled-копия получает `aria-hidden="true"`.

Не использовать GSAP ScrambleText для этой задачи: собственная реализация проще, меньше и позволяет точно контролировать доступность.

## 9.5. `usePageTransition`

Назначение:

* хранить состояние перехода;
* передавать bounds выбранного project preview;
* запускать overlay;
* блокировать только повторный клик во время перехода;
* сбрасывать состояние после завершения.

```ts
interface ProjectTransitionPayload {
  slug: string
  imageSrc: string
  sourceRect: DOMRect
  direction: 'forward' | 'back'
}
```

---

# 10. Системные эффекты

## 10.1. Общий принцип

На каждую крупную секцию назначается один основной эффект. Нельзя одновременно использовать в одном блоке:

* сильный параллакс;
* крупный blur;
* scramble;
* tilt;
* marquee;
* scanlines;
* cursor follower.

Остальные анимации в секции должны быть поддерживающими.

## 10.2. Hero-параллакс

Реализация:

* `SystemMap.vue` как inline SVG;
* слои SVG двигаются относительно курсора;
* ScrollTrigger создаёт дополнительное медленное вертикальное смещение;
* активный узел подсвечивается;
* по SVG-пути проходит импульс.

SVG-узлы:

```text
IDEA
UI
API
DATA
DEPLOY
```

Поведение:

* ближайший к указателю узел смещается максимум на 6 px;
* задний слой — максимум на 12 px;
* линии остаются статичными относительно layout;
* сигнал запускается один раз после появления hero;
* далее короткий импульс может повторяться не чаще одного раза в 8–12 секунд;
* на мобильных карта остаётся статичной.

## 10.3. Магнитные кнопки

Структура:

```html
<button class="magnetic-button">
  <span class="magnetic-button__fill"></span>
  <span class="magnetic-button__label">Обсудить проект</span>
  <span class="magnetic-button__icon">↗</span>
</button>
```

Hover:

1. wrapper смещается к курсору;
2. fill входит слева или снизу;
3. label сдвигается на 2–4 px;
4. стрелка превращается из `→` в `↗`;
5. при уходе курсора всё возвращается по `ease-out`.

На touch-устройствах остаётся только pressed-состояние.

## 10.4. Typewriter и каретка

Typewriter используется только:

* в одной строке hero;
* либо в заголовке Lab.

Предлагаемая строка:

```text
> идея → интерфейс → frontend → backend → запуск_
```

Требования:

* строка должна присутствовать в SSR HTML полностью;
* печатается только декоративная копия;
* скорость: 28–40 ms на символ;
* эффект проигрывается один раз;
* максимальная продолжительность: 1.2 секунды;
* при reduced motion строка показывается сразу;
* каретка перестаёт активно мигать через 10–12 секунд либо переходит в очень медленный режим.

## 10.5. CRT-эффект

Реализация в MVP — **CSS и SVG**, без WebGL.

Компонент:

```text
CrtFrame.vue
```

Слои:

1. рамка;
2. screenshot/video;
3. лёгкое перспективное преобразование;
4. radial highlight;
5. vignette;
6. scanlines;
7. слабый noise;
8. стеклянный блик.

Пример свойств:

```scss
.crt-frame {
  border-radius: 7% / 10%;
  transform:
    perspective(900px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y));
}

.crt-frame::after {
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 3px,
      rgb(0 0 0 / 4%) 4px
    );
}
```

Ограничения:

* scanline opacity не выше 4–5%;
* CRT не накладывается на основной текст;
* фильтр не должен снижать читаемость screenshot;
* шум не должен анимироваться с высокой частотой;
* SVG displacement допускается только локально и только после тестирования производительности;
* full-page distortion запрещён.

## 10.6. Theme matrix effect

Компонент:

```text
ThemeSwitch.vue
```

Состояния:

```text
SYSTEM
PHOSPHOR
```

Визуальная структура:

* кнопка разбита на условную сетку 8 × 4;
* сетка создаётся DOM-элементами или одним CSS layer;
* при нажатии ячейки включаются волной от места клика;
* в середине transition изменяется `data-theme`;
* подпись проходит через scramble;
* геометрия подписи и маркера перестраивается через GSAP Flip.

Последовательность:

```text
0 ms      фиксация Flip state
0–160 ms  включение ячеек
180 ms    смена data-theme
180–360   scramble подписи
240–440   Flip в новое состояние
440 ms    очистка временных inline styles
```

Требования:

* `aria-pressed`;
* понятное `aria-label`;
* тема сохраняется в `localStorage`;
* первоначальная тема применяется до hydration, чтобы не было светлой вспышки;
* настройка ОС учитывается при первом посещении;
* при reduced motion тема меняется мгновенно или через fade до 120 ms.

## 10.7. Page transitions

### Базовый переход

Создать глобальный:

```text
PageTransitionLayer.vue
```

Он находится в layout и не размонтируется при смене страницы.

Home → Project:

1. пользователь нажимает project row;
2. фиксируются bounds превью;
3. изображение копируется в fixed overlay;
4. overlay расширяется до viewport;
5. запускается навигация;
6. case hero появляется под overlay;
7. overlay растворяется или совмещается с hero;
8. scroll устанавливается в начало страницы.

Project → Home:

* при наличии transition state проигрывается обратная версия;
* при прямом входе на страницу или browser back используется короткий scanline/fade.

### Нативный View Transitions API

Можно использовать как progressive enhancement, но:

* сайт не должен зависеть от него;
* fallback остаётся полноценным;
* экспериментальную Nuxt-интеграцию нельзя считать единственным механизмом;
* reduced motion должен отключать shared-element перемещения.

Nuxt поддерживает обычные page transitions через Vue `<Transition>`, а его интеграция View Transitions отмечена как experimental и сама учитывает `prefers-reduced-motion`, если включена в рекомендуемом режиме. ([Nuxt][2])

---

# 11. Требования к секциям

## 11.1. Header и системная панель

### Состав

Слева:

```text
VA
ВАЛЕНТИН АЛЁХИН
```

В центре на desktop:

```text
ПРОЕКТЫ
ВОЗМОЖНОСТИ
ПРОЦЕСС
ОБО МНЕ
```

Справа:

```text
RU / EN
THEME
● AVAILABLE
ОБСУДИТЬ ПРОЕКТ ↗
```

Дополнительный системный слой:

```text
LOCAL 14:32
X 0842 Y 0316
BUILD 02
```

### Поведение

* header sticky;
* до прокрутки может быть визуально интегрирован в hero;
* после 40–80 px прокрутки получает фон и нижнюю границу;
* не использовать тяжёлый постоянный backdrop blur;
* контактная кнопка остаётся видимой;
* координаты видны только при fine pointer;
* время обновляется раз в минуту;
* временная зона задаётся в `profile.ts`;
* для чисел используется `font-variant-numeric: tabular-nums`.

На мобильных:

* оставить монограмму;
* оставить contact CTA;
* theme и language разместить в меню;
* координаты скрыть;
* меню реализовать через Reka Dialog.

## 11.2. Hero

### Содержание

Предлагаемая композиция:

```text
Независимый senior full-stack разработчик

ВАЛЕНТИН
АЛЁХИН

Создаю веб-продукты
от идеи до запуска.

> идея → интерфейс → frontend → backend → запуск_
```

Текстовое пояснение:

> Проектирую и разрабатываю SaaS, веб-приложения и внутренние системы — без разрыва между дизайном, frontend и backend.

CTA:

```text
[ Обсудить проект ↗ ]
[ Смотреть проекты ↓ ]
```

Статусы:

```text
● AVAILABLE FOR PROJECTS
6+ YEARS
VUE / NUXT / TYPESCRIPT / NODE / GO
```

### Композиция

Desktop:

* текст занимает 7–8 колонок;
* system map занимает 4–5 колонок;
* заголовок может пересекать колонки;
* hero — минимум один экран.

Mobile:

* system map располагается под основным текстом;
* заголовок уменьшается без переноса каждой буквы;
* pointer animation отсутствует;
* CTA размещаются вертикально или в две строки.

### Hero intro

1. появляется системная строка;
2. раскрывается имя;
3. включается system map;
4. проходит signal pulse;
5. появляется CTA.

Не использовать полноэкранный loader.

## 11.3. Selected Systems / Projects

### Структура project row

```text
01
POWERSKETCH
2024—NOW

SaaS / PRODUCT / FULL-STACK

Веб-сервис для проектирования
электрических щитов в браузере.

Vue · Nuxt · TypeScript · Node.js · SVG
```

### Desktop hover

* появляется fixed preview;
* preview находится рядом с указателем, но не перекрывает название;
* preview плавно догоняет курсор;
* угол зависит от скорости курсора;
* используется CRT frame;
* pointer не заменяется декоративным курсором;
* при уходе preview уменьшается и исчезает.

### Keyboard focus

При фокусе с клавиатуры:

* preview показывается в фиксированной позиции справа от строки;
* вся информация остаётся доступна без pointer movement;
* Enter открывает case page;
* focus ring явно виден.

### Mobile

* preview встроен непосредственно в карточку;
* нет cursor follower;
* нет tilt;
* используется только небольшое масштабирование при нажатии;
* описание не скрывается.

### Медиа

Для PowerSketch подготовить:

* cover 16:10;
* минимум три product screenshots;
* один крупный hero screenshot;
* опциональный WebM-loop длительностью 5–8 секунд;
* poster для видео;
* изображения без текста-заглушки.

## 11.4. Страница кейса PowerSketch

Структура:

```text
01  CASE HERO
02  CONTEXT
03  PROBLEM
04  ROLE
05  PRODUCT APPROACH
06  CORE INTERACTIONS
07  SYSTEM / ARCHITECTURE
08  RESULT
09  STACK
10  NEXT PROJECT / CONTACT
```

Обязательные данные:

* что представляет собой продукт;
* какую задачу решает;
* какая была роль;
* какие решения были спроектированы;
* редактор и работа с SVG;
* frontend;
* backend;
* хранение данных;
* экспорт;
* подписки;
* ограничения и компромиссы;
* фактический результат.

Не придумывать:

* количество пользователей;
* проценты роста;
* деньги;
* скорость работы;
* иные метрики, если они не подтверждены.

## 11.5. Product Pipeline / Возможности

Вместо пяти одинаковых карточек услуги собираются в систему:

```text
DISCOVERY
   ↓
PRODUCT
   ↓
INTERFACE
   ↓
FRONTEND
   ↓
BACKEND / INTEGRATIONS
   ↓
LAUNCH
```

Desktop:

* слева — вертикальная цепочка;
* справа — описание активного слоя;
* hover и focus меняют выбранный слой;
* по соединительной линии проходит signal pulse.

Mobile:

* обычный последовательный список;
* каждый слой раскрывается кнопкой;
* можно использовать собственный accordion или `<details>`;
* вся информация доступна без hover.

Существующие услуги распределяются так:

| Новый слой             | Существующее содержание                    |
| ---------------------- | ------------------------------------------ |
| Discovery / Product    | MVP, требования, сценарии                  |
| Interface              | UI/UX, редакторы, кабинеты                 |
| Frontend               | Vue, Nuxt, сложные интерфейсы              |
| Backend / Integrations | Node.js, Go, API, платежи, CRM, Telegram   |
| Launch                 | архитектура, deployment, развитие продукта |

## 11.6. Work Protocol

Сохраняются четыре этапа:

```text
01 ОБСУЖДЕНИЕ
02 ПРЕДЛОЖЕНИЕ
03 РАЗРАБОТКА
04 ЗАПУСК
```

Анимация:

* вертикальная или горизонтальная линия постепенно заполняется;
* при достижении этапа включается его marker;
* текст появляется с небольшим offset;
* ScrollTrigger используется только для progress и reveal;
* section pinning на мобильных запрещён;
* desktop pin допустим только при отсутствии проблем со скроллом и клавиатурной навигацией.

## 11.7. Lab / Experiments

Назначение — добавить личность и показать небольшие разработки, которые не являются коммерческими кейсами.

Заголовок:

```text
valentin@alekhin — git log --lab
```

Структура элемента:

```text
LAB_01
SVG wiring experiments
ACTIVE

Небольшая библиотека экспериментов
с соединениями и схемами.

Vue · SVG · TypeScript
```

Допустимые статусы:

```text
ACTIVE
IN PROGRESS
MAINTENANCE
ARCHIVED
ACCIDENTALLY USEFUL
```

Требования:

* перед публикацией добавить минимум три реальных элемента;
* если элементов меньше двух, секция скрывается;
* не создавать вымышленные проекты;
* проект может вести на GitHub, demo или открывать компактное описание;
* терминальный стиль применяется к структуре, но не к длинным абзацам.

## 11.8. About / Now

Секция должна включать:

### Короткое личное представление

Не повторять hero и услуги. Объяснить:

* как вы принимаете решения;
* почему работаете как full-stack;
* что считаете хорошим продуктом;
* с какими задачами предпочитаете работать.

### Четыре принципа

Черновая структура:

```text
01 Не разделяю интерфейс и архитектуру.
02 Предпочитаю работающий прототип длинному документу.
03 Автоматизирую то, что приходится делать второй раз.
04 Считаю продукт готовым только после запуска.
```

Перед публикацией формулировки должны быть подтверждены владельцем сайта.

### Now

```text
CURRENTLY BUILDING
CURRENTLY EXPLORING
AVAILABLE FOR
```

Данные хранятся в `profile.ts` и обновляются без изменения компонентов.

## 11.9. Контакты

Контакт должен быть доступен двумя способами:

1. постоянный CTA в header;
2. большая финальная секция.

### Финальный блок

```text
OPEN CHANNEL

Есть задача или идея продукта?
Расскажите, что вы создаёте.

EMAIL
TELEGRAM
GITHUB
LINKEDIN

[ НАПИСАТЬ ↗ ]
[ СКОПИРОВАТЬ EMAIL ]
```

### Contact Dialog

Открывается из header.

Внутри:

```text
NEW_PROJECT_REQUEST

Email
Telegram
Составить письмо
Скопировать адрес
```

Требования:

* реальные контакты, без placeholder;
* корректный focus trap;
* закрытие по Escape;
* возврат фокуса на кнопку;
* scroll lock без layout shift;
* сообщение «Email скопирован» через `aria-live="polite"`;
* контактная информация остаётся доступна без JavaScript в footer.

### Форма

Форма не обязательна для первого релиза.

При добавлении формы:

* имя;
* способ связи;
* описание задачи;
* hidden honeypot;
* серверная валидация;
* rate limiting;
* доступные сообщения ошибок;
* отсутствие обязательной регистрации;
* не добавлять CAPTCHA, пока нет фактической проблемы со спамом.

## 11.10. Footer

Состав:

```text
VA / ALEKHIN.DEV
INDEPENDENT FULL-STACK DEVELOPER

RU / EN
EMAIL
TELEGRAM
GITHUB

LOCAL 14:32
BUILD 02
© 2026

НАВЕРХ ↑
```

Опционально отображать abbreviated commit hash, но не показывать внутреннюю информацию CI.

## 11.11. 404

Оформление:

```text
404 / ROUTE NOT FOUND

> cd /home
```

Кнопка ведёт на локализованную главную страницу.

Никакой сложной игры на 404 в первом релизе.

---

# 12. Темы

## 12.1. Хранение

```text
localStorage key: va-theme
values: system | phosphor
```

Алгоритм первого посещения:

1. проверить сохранённое значение;
2. при отсутствии использовать системную цветовую схему;
3. применить значение до hydration;
4. установить соответствующий `color-scheme`.

## 12.2. Защита от flash

В `<head>` должен быть небольшой inline script, который до отображения body:

* читает `va-theme`;
* проверяет `matchMedia`;
* устанавливает `data-theme`.

Он не должен зависеть от Vue hydration.

## 12.3. Контраст

Обе темы должны проходить WCAG AA независимо. Нельзя считать phosphor-тему «экспериментальной» и допускать в ней нечитаемый текст.

---

# 13. Локализация

Использовать официальный Nuxt i18n module.

Требования:

* русский и английский;
* локализованные маршруты;
* localized titles и descriptions;
* `html lang`;
* canonical;
* `hreflang`;
* локализованные Open Graph данные;
* переключатель языка сохраняет текущую страницу;
* для project slug используется одинаковый slug либо задаётся явное соответствие;
* не хранить длинные коммерческие тексты непосредственно внутри Vue template.

Официальный Nuxt i18n module предоставляет locale routing и SEO metadata для локализованных страниц. ([Nuxt I18n][9])

---

# 14. Модель данных

## 14.1. Profile

```ts
interface Profile {
  name: string
  role: string
  experienceYears: number
  available: boolean
  timeZone: string
  email: string
  telegram?: string
  github?: string
  linkedin?: string
}
```

## 14.2. Project

```ts
type ProjectStatus =
  | 'live'
  | 'in-progress'
  | 'archived'

interface Project {
  slug: string
  index: string
  title: string
  period: string
  status: ProjectStatus

  cover: string
  previewVideo?: string
  externalUrl?: string

  roles: string[]
  stack: string[]

  content: {
    ru: ProjectContent
    en: ProjectContent
  }
}

interface ProjectContent {
  summary: string
  description: string
  challenge: string
  role: string
  approach: string
  result: string
}
```

## 14.3. Lab item

```ts
type LabStatus =
  | 'active'
  | 'in-progress'
  | 'maintenance'
  | 'archived'

interface LabItem {
  id: string
  title: string
  status: LabStatus
  year: number
  stack: string[]
  demoUrl?: string
  repositoryUrl?: string
  content: {
    ru: string
    en: string
  }
}
```

## 14.4. Контентное хранение

На первом этапе CMS не требуется.

Использовать:

* TypeScript-файлы для структурированных данных;
* JSON для UI-переводов;
* Vue-компоненты для сложной композиции кейса.

Nuxt Content добавляется только при появлении регулярного блога или большого количества кейсов.

---

# 15. Изображения и видео

Использовать `@nuxt/image`.

Требования:

* responsive `srcset`;
* фиксированные `width` и `height`;
* AVIF и WebP;
* JPEG/PNG fallback при необходимости;
* first project image можно preload;
* остальные изображения lazy;
* размеры должны соответствовать layout;
* не загружать desktop screenshot размером 2500 px на мобильный экран;
* SVG-иконки подключать inline;
* не использовать icon font.

Nuxt Image умеет создавать responsive-варианты и работать с современными форматами AVIF и WebP. ([Nuxt Image][10])

## 15.1. Бюджеты медиа

| Ресурс                 | Рекомендуемый максимум |
| ---------------------- | ---------------------: |
| Hero screenshot        |                 250 KB |
| Project preview        |                 180 KB |
| Case screenshot        |                 300 KB |
| Mobile screenshot      |                 150 KB |
| Короткое preview-video |                 1.5 MB |
| Noise texture          |                  10 KB |
| Inline SVG system map  |                  30 KB |

Видео:

* muted;
* без звука;
* не запускать при reduced motion;
* не autoplay на мобильном;
* не загружать до приближения секции;
* иметь poster;
* при `Save-Data` использовать только poster.

---

# 16. Performance

## 16.1. Рендеринг

При отсутствии серверной формы использовать prerender:

```bash
nuxi generate
```

Nuxt поддерживает генерацию статических HTML-страниц, что подходит для публичного портфолио и улучшает начальную загрузку и индексируемость. ([Nuxt][11])

Если будет добавлен внутренний contact endpoint:

* публичные страницы остаются prerendered;
* endpoint разворачивается через Nitro;
* не переводить весь сайт на client-side rendering.

## 16.2. Целевые показатели

На 75-м перцентиле реальных посещений:

```text
LCP ≤ 2.5 s
INP ≤ 200 ms
CLS ≤ 0.1
```

Это соответствует рекомендуемым порогам Core Web Vitals. ([web.dev][12])

Дополнительные бюджеты:

```text
Initial JS homepage: ≤ 180 KB gzip
Initial CSS:         ≤ 80 KB gzip
Fonts total:         ≤ 180 KB transferred
CLS:                 0 при загрузке шрифтов и медиа
```

Lighthouse production build:

```text
Performance:   ≥ 90
Accessibility: ≥ 95
SEO:           ≥ 95
Best Practices ≥ 95
```

Lighthouse используется как лабораторный контроль, но не заменяет Core Web Vitals.

## 16.3. Правила производительности

* native scroll;
* не использовать smooth-scroll library;
* не использовать глобальный WebGL canvas;
* pointer handlers через `requestAnimationFrame`;
* в pointer loop изменять только transforms/CSS variables;
* не читать layout после записи в каждом кадре;
* `will-change` включать только на активных элементах;
* не применять blur к большим full-screen слоям;
* не анимировать `width`, `height`, `top`, `left`;
* использовать `transform` и `opacity`;
* останавливать loop при `visibilitychange`;
* уничтожать ScrollTrigger при unmount;
* запускать `ScrollTrigger.refresh()` после загрузки шрифтов и важных изображений;
* не скрывать SSR-контент до загрузки JS;
* initial hidden states добавлять только после установки `data-motion-ready`.

---

# 17. Reduced motion и доступность

Целевой уровень — **WCAG 2.2 AA**.

Несмотря на то что критерий Animation from Interactions относится к уровню AAA, проект должен его учитывать: пользователь должен иметь возможность отключить несущественное движение. W3C рекомендует проверять `prefers-reduced-motion` как в CSS, так и в JavaScript. ([W3C][13])

## 17.1. При `prefers-reduced-motion: reduce`

Отключаются:

* hero parallax;
* scroll parallax;
* magnetic movement;
* cursor-follow preview;
* tilt;
* typewriter;
* scramble;
* expanding project transition;
* движение signal pulse;
* автоматическое видео;
* анимированный noise.

Остаются:

* мгновенная смена темы;
* статичное project preview;
* focus states;
* короткий opacity transition до 120 ms;
* полноценный контент и навигация.

## 17.2. Общие требования доступности

* skip-link в начале документа;
* все функции доступны с клавиатуры;
* visible focus ring;
* target area не меньше 44 × 44 px для основных controls;
* Esc закрывает Dialog;
* после закрытия Dialog фокус возвращается на trigger;
* scroll header не перекрывает сфокусированные элементы;
* hover не является единственным способом получить информацию;
* project cards имеют понятные accessible names;
* theme button имеет `aria-pressed`;
* координаты и декоративная карта имеют `aria-hidden="true"`;
* реальный текст не дробится для screen reader на отдельные буквы;
* декоративные split-символы скрываются от accessibility tree;
* copy feedback использует `aria-live`;
* не включать звук автоматически;
* не создавать вспышки чаще трёх раз в секунду;
* scanlines не должны мерцать.

W3C отдельно указывает, что интерфейс не должен содержать более трёх вспышек в секунду. Поэтому theme matrix реализуется как плавное изменение opacity/scale, а не быстрое белое мерцание. ([W3C][14])

---

# 18. SEO

## 18.1. Общие требования

Каждая страница должна иметь:

* уникальный `<title>`;
* description;
* canonical;
* Open Graph;
* Twitter/X card;
* локализованное изображение при необходимости;
* один основной H1;
* корректную иерархию H2–H4;
* alt для содержательных изображений;
* пустой alt для декоративных;
* JSON-LD;
* sitemap;
* robots.txt.

## 18.2. Structured data

Главная:

```text
Person
WebSite
ProfessionalService — опционально
```

Project page:

```text
CreativeWork
SoftwareApplication — только если описание корректно
BreadcrumbList
```

## 18.3. Контент и анимация

* H1 и основной текст присутствуют в HTML;
* не рендерить важный текст в canvas;
* typewriter не должен задерживать появление реального контента;
* project links — настоящие ссылки;
* внешние ссылки получают понятную подпись;
* существующие индексируемые URL сохраняются;
* при смене маршрута добавляются 301 redirects.

---

# 19. Тестирование

Nuxt предоставляет официальный `@nuxt/test-utils`, совместимый с Vitest и browser/E2E-инструментами. ([Nuxt][15])

## 19.1. Unit-тесты

Проверить:

* выбор темы по сохранённому значению;
* выбор темы по системным настройкам;
* сохранение theme value;
* `useMotionPreference`;
* отключение pointer tracking на coarse pointer;
* финальное значение scramble;
* корректную локализацию project data;
* работу availability status;
* функцию форматирования local time.

## 19.2. Component-тесты

Проверить:

* BaseButton;
* ThemeSwitch;
* ProjectRow;
* ContactDialog;
* MobileNavigation;
* TypewriterLine;
* fallback CrtFrame;
* focus и keyboard behavior.

## 19.3. E2E Playwright

Обязательные сценарии:

1. загрузка `/ru/`;
2. переход RU → EN с сохранением текущей страницы;
3. theme SYSTEM → PHOSPHOR;
4. сохранение темы после reload;
5. открытие и закрытие mobile menu;
6. открытие Contact Dialog;
7. закрытие Dialog по Escape;
8. копирование email;
9. переход на PowerSketch;
10. browser back;
11. navigation только с клавиатуры;
12. reduced motion emulation;
13. coarse pointer/touch viewport;
14. прямой вход на project page;
15. 404 и возврат на главную.

## 19.4. Visual regression

Минимальные viewport:

```text
375 × 812
430 × 932
768 × 1024
1024 × 768
1440 × 900
1920 × 1080
```

Проверять обе темы и обе локали.

## 19.5. Браузеры

Поддержка:

* последние две основные версии Chrome;
* последние две версии Edge;
* последние две версии Firefox;
* последние две версии Safari;
* актуальный iOS Safari;
* актуальный Android Chrome.

В старых браузерах допустимо отсутствие shared-element transition, но не поломка навигации или контента.

---

# 20. Зависимости

Предлагаемый набор:

```bash
pnpm add \
  gsap \
  reka-ui \
  @nuxtjs/i18n \
  @nuxt/image \
  @fontsource-variable/manrope \
  @fontsource-variable/jetbrains-mono
```

Development:

```bash
pnpm add -D \
  sass \
  @nuxt/test-utils \
  vitest \
  @vue/test-utils \
  @playwright/test \
  @axe-core/playwright \
  stylelint \
  stylelint-config-standard-scss
```

Nuxt и Vue уже могут присутствовать в существующем проекте. Версии должны быть закреплены lockfile. Автоматическое обновление major-версий в рамках редизайна запрещено.

---

# 21. Контрольный список приёмки

## 21.1. Технологии

* [ ] Проект работает на Nuxt/Vue/TypeScript.
* [ ] TypeScript strict включён.
* [ ] Используется SCSS.
* [ ] Tailwind CSS отсутствует.
* [ ] UI kit отсутствует.
* [ ] Reka UI используется только для headless primitives.
* [ ] Нет Lenis или другого smooth-scroll.
* [ ] Нет Three.js/WebGL в основном релизе.
* [ ] Нет второго animation framework.
* [ ] Нет Pinia без отдельного обоснования.

## 21.2. Визуальная система

* [ ] Подключены Manrope Variable и JetBrains Mono Variable.
* [ ] Реализованы SYSTEM и PHOSPHOR.
* [ ] Тема не мигает при загрузке.
* [ ] Контраст соответствует WCAG AA.
* [ ] Моноширинный шрифт не используется для длинного основного текста.
* [ ] CRT применяется только локально.
* [ ] Основной текст не покрыт scanlines.

## 21.3. Интерактивность

* [ ] Hero system map реагирует на курсор на desktop.
* [ ] Hero имеет статический mobile fallback.
* [ ] Основные CTA имеют magnetic hover.
* [ ] Project preview следует за курсором.
* [ ] Project preview доступен с клавиатуры.
* [ ] Theme toggle перестраивается и использует scramble.
* [ ] Реализован page transition в case.
* [ ] При прямом открытии case page нет ошибок.
* [ ] Нет обязательного loader.
* [ ] Нет замены системного курсора.

## 21.4. Контент

* [ ] Добавлены реальные контакты.
* [ ] Удалена контактная заглушка.
* [ ] Создана отдельная страница PowerSketch.
* [ ] В кейсе нет вымышленных метрик.
* [ ] В Lab минимум три реальных элемента либо секция скрыта.
* [ ] Добавлены личные принципы.
* [ ] Заполнен блок Now.
* [ ] Русская и английская версии синхронизированы.

## 21.5. Доступность

* [ ] Сайт полностью управляется клавиатурой.
* [ ] Focus всегда видим.
* [ ] Dialog корректно управляет фокусом.
* [ ] `prefers-reduced-motion` отключает движение.
* [ ] Нет hover-only функций.
* [ ] Нет автоматического звука.
* [ ] Нет частого мерцания.
* [ ] Split/typewriter текст корректно читается screen reader.

## 21.6. Производительность

* [ ] Core Web Vitals находятся в заданных пределах.
* [ ] Initial JS не превышает согласованный бюджет.
* [ ] Изображения responsive.
* [ ] Видео lazy-loaded.
* [ ] Pointer loop не вызывает Vue rerender на каждый кадр.
* [ ] ScrollTrigger корректно уничтожается.
* [ ] Нет заметного layout shift.
* [ ] Нет ошибок hydration.
* [ ] Production console не содержит ошибок и warnings.

---

# 22. Очерёдность реализации

## Этап 1. Основа

* Nuxt-структура;
* SCSS architecture;
* design tokens;
* шрифты;
* theme storage;
* i18n;
* базовые компоненты;
* данные профиля и проектов.

## Этап 2. Статическая композиция

* header;
* hero;
* projects;
* capabilities;
* process;
* lab;
* about;
* contacts;
* footer;
* responsive layouts.

На этом этапе сайт уже должен быть полностью рабочим без сложных эффектов.

## Этап 3. Система движения

* motion preference;
* section reveals;
* hero timeline;
* pointer field;
* system map;
* magnetic buttons;
* typewriter;
* theme reconstruction.

## Этап 4. Проекты

* cursor-follow preview;
* CRT frame;
* страница PowerSketch;
* page transition;
* обратная навигация.

## Этап 5. Качество

* accessibility;
* unit tests;
* E2E;
* visual regression;
* image optimization;
* bundle optimization;
* Core Web Vitals;
* SEO;
* проверка RU/EN.

---

# 23. Необязательные возможности после основного релиза

Следующие функции не входят в основное ТЗ и добавляются только после проверки производительности:

* командная палитра по `Ctrl/Cmd + K`;
* команды `projects`, `about`, `contact`, `theme`;
* небольшая ретроигра;
* янтарная тема;
* WebGL barrel distortion;
* shader-переходы;
* интерактивный terminal prompt;
* звук интерфейса;
* скрытые Konami-code эффекты.

Основной релиз должен уже иметь выраженную личность без этих возможностей.

[1]: https://alekhin.dev/ru/ "Валентин Алёхин — Senior Full-stack разработчик"
[2]: https://nuxt.com/docs/4.x/getting-started/transitions "Transitions · Get Started with Nuxt v4"
[3]: https://nuxt.com/docs/4.x/getting-started/styling?utm_source=chatgpt.com "Styling · Get Started with Nuxt v4"
[4]: https://reka-ui.com/ "Reka UI - Unstyled, fully accessible UI library | Reka UI"
[5]: https://fontsource.org/fonts/manrope/install "Manrope | Install | Fontsource"
[6]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html?utm_source=chatgpt.com "Understanding Success Criterion 1.4.3: Contrast (Minimum)"
[7]: https://gsap.com/resources/frameworks/?utm_source=chatgpt.com "JS Frameworks | GSAP | Docs & Learning"
[8]: https://gsap.com/pricing/?utm_source=chatgpt.com "Pricing"
[9]: https://i18n.nuxtjs.org/docs/guide/seo?utm_source=chatgpt.com "SEO"
[10]: https://image.nuxt.com/usage/nuxt-img?utm_source=chatgpt.com "<NuxtImg> - Nuxt Image"
[11]: https://nuxt.com/docs/4.x/guide/concepts/rendering?utm_source=chatgpt.com "Rendering Modes · Nuxt Concepts v4"
[12]: https://web.dev/articles/vitals?utm_source=chatgpt.com "Web Vitals | Articles"
[13]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html?utm_source=chatgpt.com "Understanding SC 2.3.3: Animation from Interactions ..."
[14]: https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html?utm_source=chatgpt.com "Understanding Success Criterion 2.3.2: Three Flashes | WAI"
[15]: https://nuxt.com/docs/4.x/getting-started/testing?utm_source=chatgpt.com "Testing · Get Started with Nuxt v4"
