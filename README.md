# alekhin.dev

Персональное портфолио Валентина Алёхина — независимого senior full-stack разработчика. Сайт знакомит с подходом к работе, услугами и проектами, а каждый проект раскрывается на отдельной странице кейса.

Визуальная система минималистична и монохромна: Manrope для обычного текста, JetBrains Mono для технических деталей, прямые углы и тонкие разделители. На страницах кейсов используются небольшие акценты цвета проекта. Интерфейс доступен с клавиатуры, учитывает `prefers-reduced-motion` и адаптирован для мобильных устройств.

- Production: [alekhin.dev](https://alekhin.dev)
- Русская версия по умолчанию: `/`
- Английская версия: `/en/`
- Русские кейсы: `/projects/<slug>/`
- Английские кейсы: `/en/projects/<slug>/`
- Результат статической генерации: `.output/public`

Сайт не требует базы данных, API или постоянно запущенного Node.js-процесса: все публичные маршруты предварительно генерируются в HTML.

## Возможности

- две локали с `prefix_except_default`: русский без префикса и английский под `/en`;
- главная страница с секциями проектов, услуг, типов задач, информации об авторе и контактов;
- шесть локализованных проектных кейсов с локальными цветовыми акцентами и адаптивными галереями;
- светлая, тёмная и автоматическая тема с ранней инициализацией без заметной вспышки палитры;
- раскрываемые карточки проектов и компактные переключатели темы и языка;
- локализованные SEO-метаданные, Open Graph, canonical/alternate links и Schema.org graph;
- автоматически генерируемые sitemap и robots.txt с проверкой ссылок при сборке;
- статическая генерация всех локализованных маршрутов.

## Технологии

- Nuxt 4 и Vue 3;
- строгий TypeScript;
- `@nuxtjs/i18n`;
- `@nuxtjs/seo` для Site Config, статических OG-карточек, sitemap, robots, Schema.org и проверки ссылок;
- SCSS и централизованные CSS custom properties;
- Reka UI для доступных элементов управления, VueUse для браузерных взаимодействий;
- Carbon Icons для строгой иконографии;
- `@nuxt/image` для изображений;
- Vitest и Vue Test Utils;
- Playwright и axe-core для браузерных и accessibility-тестов;
- ESLint и Stylelint.

В проекте нет Tailwind CSS, Nuxt UI и Nuxt Content. Тексты хранятся в JSON-файлах локалей, а типизированные записи проектов — в `app/data/`.

## Требования

- Node.js `^22.12.0`, `^24.11.0` или `>=26.0.0`;
- pnpm 10.x.

Точная версия pnpm зафиксирована в поле `packageManager` файла `package.json`. Используйте только pnpm и не создавайте lock-файлы других пакетных менеджеров.

При необходимости включите Corepack:

```bash
corepack enable
```

## Установка и запуск

```bash
pnpm install
pnpm dev
```

Development-сервер по умолчанию доступен на `http://localhost:3000`.

| Команда | Назначение |
| --- | --- |
| `pnpm dev` | Запустить Nuxt development-сервер с HMR |
| `pnpm lint` | Проверить проект правилами ESLint |
| `pnpm lint:fix` | Применить безопасные автоматические исправления ESLint |
| `pnpm test` | Запустить unit-тесты Vitest |
| `pnpm test:e2e` | Запустить Playwright-тесты, когда в проекте есть browser specs |
| `pnpm typecheck` | Проверить типы Nuxt, Vue и TypeScript |
| `pnpm build` | Создать production server build |
| `pnpm generate` | Предварительно сгенерировать статический сайт |
| `pnpm images:placeholders` | Обновить лёгкие плейсхолдеры скриншотов после замены медиа |
| `pnpm preview` | Локально запустить сгенерированный production-результат |

Перед отправкой изменений выполните:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm generate
```

Для изменений критичного browser-only поведения также добавьте и запустите подходящие Playwright-тесты.

## Структура проекта

```text
app/
  app.vue                         # общая оболочка, header/footer и диалог контактов
  error.vue                       # локализованная страница ошибки
  assets/
    asciiart.txt                  # ASCII-графика для desktop hero
    styles/
      main.scss                   # точка входа глобальных SCSS-слоёв
      settings/                   # токены, breakpoints, типографика, темы кейсов
      generic/                    # reset и шрифты
      elements/                   # базовые стили элементов
      objects/                    # layout и grid
      tools/                      # SCSS mixins
      utilities/                  # accessibility и reduced motion
  components/
    base/                         # кнопки и заголовки секций
    layout/                       # header, footer и mobile nav
    project/                      # страницы и общие блоки проектных кейсов
    sections/                     # секции главной страницы
    ui/                           # theme/locale controls и dialog
  composables/                    # переиспользуемое состояние и browser-only поведение
  data/
    navigation.ts                # locale-independent навигация
    profile.ts                   # публичные контакты и профиль
    projects.ts                  # проекты, метрики, стек и медиа
  pages/
    index.vue                    # главная страница
    projects/[slug].vue          # динамический маршрут проектного кейса
  types/                         # общие типы контента и локалей
  utils/                         # framework-independent helpers
i18n/locales/
  ru.json                        # русские тексты, default locale
  en.json                        # английские тексты
public/
  fonts/                         # локальные шрифты для статических OG-карточек
  og/                            # Open Graph изображения главной
  projects/<slug>/               # скриншоты и OG-изображения кейсов
  favicon.*                      # варианты favicon
  site.webmanifest
tests/
  projects.spec.ts               # целостность данных, медиа и переводов проектов
  theme.spec.ts                  # разрешение и валидация темы
nuxt.config.ts                   # модули, i18n, prerender, head и Nuxt-настройки
```

Каталоги `.nuxt/` и `.output/` генерируются автоматически и не являются исходным кодом.

## Контент и локализация

Весь переводимый пользовательский текст находится в:

```text
i18n/locales/ru.json
i18n/locales/en.json
```

Структура файлов должна оставаться полностью одинаковой. Это проверяет тест `tests/projects.spec.ts`. При добавлении или переименовании ключа синхронно обновляйте обе локали.

Не размещайте переводимый текст напрямую в Vue-компонентах или TypeScript-данных. Исключения — названия брендов и технологий, кодовые фрагменты и намеренные терминальные токены.

Locale-independent данные разделены по назначению:

- `app/data/profile.ts` — имя, роль, опыт, часовой пояс и публичные контакты;
- `app/data/navigation.ts` — идентификаторы секций и ключи переводов;
- `app/data/projects.ts` — slug, статус, период, метрики, стек, медиа и ссылки проектов;
- `app/types/i18n.ts` — `LocaleCode` и locale maps.

Не используйте разрозненные строковые литералы `'ru'` и `'en'`: для кода локали предназначен `LocaleCode`.

### Маршрутизация локалей

`@nuxtjs/i18n` настроен со стратегией `prefix_except_default`:

| Локаль | Главная | Пример кейса |
| --- | --- | --- |
| Русская | `/` | `/projects/powersketch/` |
| Английская | `/en/` | `/en/projects/powersketch/` |

Ссылки между локалями и локализованные пути формируйте через `useLocalePath()` и `useSwitchLocalePath()`, а не вручную.

## Проектные кейсы

Сейчас опубликованы шесть кейсов:

1. PowerSketch
2. PLANES architects
3. NORDHUS
4. AEROVISTA Inspect
5. KINEO
6. FORMA

Запись в `app/data/projects.ts` содержит:

- стабильный `slug`, индекс, название, период и статус;
- ключи локализованного текста и scope;
- тему кейса;
- Schema.org-тип (`SoftwareApplication` или `WebSite`);
- cover, Open Graph image, метрики, стек и массив медиа;
- внешний URL, только если опубликованный проект действительно доступен.

Медиа хранятся в `public/projects/<slug>/`. Для каждого элемента указываются реальные размеры, ключи локализованных `alt` и caption, а при необходимости — вариант отображения (`viewport`, `full-page`, `phone` или `modal`). Для изображений, зависящих от локали и темы, используйте `ProjectMediaSources`.

Лёгкие плейсхолдеры скриншотов собираются Sharp в `app/data/projectPlaceholders.generated.ts`. Команды `pnpm dev`, `pnpm build` и `pnpm generate` запускают генератор автоматически; отдельная команда `pnpm images:placeholders` полезна после добавления новых файлов.

### Добавление проекта

1. Подготовьте оптимизированные изображения в `public/projects/<slug>/`, включая отдельное OG-изображение.
2. Добавьте одинаковую структуру текстов, `alt` и caption в `ru.json` и `en.json`.
3. Добавьте типизированную запись в `app/data/projects.ts`; cover должен входить в массив `media`, а все пути должны существовать.
4. Создайте компонент кейса в `app/components/project/`. Если это новый тип кейса, обновите `ProjectCaseName` в `app/types/content.ts` и карту `caseComponents` в `app/pages/projects/[slug].vue`.
5. Добавьте slug в `projectSlugs` внутри `nuxt.config.ts`, чтобы обе локали явно попали в prerender.
6. Обновите тестовые ожидания в `tests/projects.spec.ts`.
7. Выполните полный цикл проверок и убедитесь, что проект появился в автоматически сгенерированных sitemap обеих локалей.

Не добавляйте вымышленные показатели, клиентов, ссылки или статусы. Метрики должны быть проверяемыми; локализуемое значение задаётся через `valueKey`, неизменяемое — через `value`.

## Стили и темы

Глобальные стили подключаются через `app/assets/styles/main.scss` и разбиты на SCSS-слои. Основные токены определены в `app/assets/styles/settings/_tokens.scss`.

Поддерживаются три предпочтения: `light`, `dark` и `auto`. В автоматическом режиме страница следует системной цветовой схеме и меняется вместе с ней. Выбор хранится в `localStorage` под ключом `va-theme-preference`; прежние значения `va-theme` переносятся один раз. Синхронный скрипт в `nuxt.config.ts` применяет тему до гидратации.

Локальный акцент кейса задаётся через `.project-case[data-project-theme]` и токены в `app/assets/styles/settings/_project-themes.scss`. Фон сайта и шапка остаются монохромными.

При изменении интерфейса:

- используйте существующие CSS custom properties;
- сохраняйте видимый focus и достаточный контраст;
- проверяйте `light`, `dark` и `auto`;
- проверяйте desktop, ширину около 1100 px и mobile;
- не ломайте layout длинными русскими или английскими строками;
- учитывайте `prefers-reduced-motion`.

## Browser-only поведение

DOM API, observers, timers и event listeners инициализируются только внутри клиентского lifecycle. На unmount необходимо отключать observers и удалять listeners.

Особое внимание требуется для:

- раскрытия карточек проектов при наведении, фокусе и прокрутке на телефоне;
- управления компактными переключателями темы и языка мышью, касанием и клавиатурой;
- диалога контактов и мобильной навигации;
- переключения локали и темы без hydration warnings.

## SEO и публичные файлы

`@nuxtjs/seo` централизует домен, canonical URL, trailing slash и технические SEO-модули. Главная страница и кейсы задают локализованные meta tags через `useSeoMeta()` и `useHead()`, а Schema.org graph — через `useSchemaOrg()`:

- общая оболочка — `Person`;
- главная — `WebSite` и `WebPage`;
- PowerSketch — `SoftwareApplication`;
- остальные кейсы — `WebSite`;
- страницы кейсов дополнительно содержат `BreadcrumbList`.

Исходные и резервные SEO-ресурсы:

```text
public/og/portfolio-ru.png
public/og/portfolio-en.png
public/projects/<slug>/<og-image>
public/site.webmanifest
public/favicon.svg
public/favicon.png
public/favicon.ico
```

Во время `pnpm generate` Nuxt SEO создаёт:

```text
.output/public/_og/s/*.png
.output/public/robots.txt
.output/public/sitemap_index.xml
.output/public/ru-sitemap.xml
.output/public/en-sitemap.xml
```

OG-карточки главной и кейсов рендерятся Takumi по локализованным данным через `Portfolio.takumi.vue`. Русская карта содержит маршруты без `/ru/`, английская — под `/en/`; альтернативные версии связаны через `hreflang`. `robots.txt` автоматически ссылается на sitemap index. При изменении домена, локалей или маршрутов обновите Site Config, i18n, prerender routes, manifest и OG-шаблон — XML, PNG и robots вручную не редактируются.

## Статическая генерация и публикация

Production-сборка для статического хостинга:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm typecheck
pnpm generate
```

После генерации проверьте как минимум:

```text
.output/public/index.html
.output/public/en/index.html
.output/public/projects/powersketch/index.html
.output/public/en/projects/powersketch/index.html
.output/public/_og/s/*.png
.output/public/robots.txt
.output/public/sitemap_index.xml
.output/public/ru-sitemap.xml
.output/public/en-sitemap.xml
```

На хостинг загружается содержимое `.output/public`. Для статического сервиса:

```text
Build command: pnpm generate
Publish directory: .output/public
```

После публикации откройте `/` и `/en/`, затем все страницы проектов в обеих локалях. Проверьте прямое открытие и обновление вложенных маршрутов, переключатели языка и темы, контакты, раскрытие проектов, canonical/alternate links, `robots.txt`, `sitemap_index.xml` и Open Graph preview.

## Финальная проверка UI

- обе локали на главной и всех project routes;
- светлую, тёмную и автоматическую тему, включая акценты кейсов;
- desktop, примерно 1100 px и mobile;
- keyboard navigation, skip link и видимый focus;
- mobile navigation, contact dialog, тему, язык и раскрытие проектов;
- `prefers-reduced-motion`;
- отсутствие SSR/hydration ошибок и горизонтального scroll;
- корректные локализованные title, description, canonical, alternate и Schema.org graph;
- полное содержимое страницы в сгенерированном HTML.
