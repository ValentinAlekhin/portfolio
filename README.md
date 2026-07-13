# Портфолио Валентина Алёхина

Одностраничное мультиязычное коммерческое портфолио независимого senior full-stack разработчика. Сайт рассказывает об услугах, проектах и формате работы и ведёт потенциального клиента к Telegram или email. Это не резюме и не приложение с backend: обе языковые версии предварительно генерируются в полноценный HTML и после сборки могут работать на обычном статическом хостинге.

- Основной домен: `https://alekhin.dev`
- Английская версия: `/`
- Русская версия: `/ru`
- Статический каталог после генерации: `.output/public`

## Технологический стек

- Nuxt 4, Vue 3 и TypeScript
- Nuxt UI и Tailwind CSS 4
- Nuxt Content с YAML-коллекцией и строгой Zod-схемой
- `@nuxtjs/i18n` со стратегией `prefix_except_default`
- VueUse для browser-specific поведения интерфейса
- Nuxt Color Mode для режимов `system`, `light` и `dark`
- `@nuxt/eslint` и ESLint flat config
- статическая генерация Nuxt/Nitro

У проекта нет серверной базы данных, API-маршрутов и обязательных внешних runtime-запросов. После публикации Node.js на сервере не требуется.

## Требования

- Node.js `22.12.0` или новее в ветке 22; также подходят поддерживаемые Nuxt версии `24.11.0+` и `26+`
- pnpm 10.x

Используйте только pnpm. Не создавайте `package-lock.json`, `yarn.lock` или lock-файлы других пакетных менеджеров. Точная версия pnpm зафиксирована полем `packageManager` в `package.json`; при необходимости включите Corepack — при запуске из каталога проекта он выберет указанную версию:

```bash
corepack enable
```

## Установка и локальный запуск

```bash
pnpm install
pnpm dev
```

Development-сервер по умолчанию доступен на `http://localhost:3000`.

Основные команды:

| Команда | Назначение |
| --- | --- |
| `pnpm dev` | Запустить development-сервер с HMR |
| `pnpm lint` | Проверить TypeScript/Vue/CSS-код правилами ESLint |
| `pnpm lint:fix` | Автоматически исправить допустимые ESLint-ошибки |
| `pnpm typecheck` | Запустить проверку типов Nuxt и Vue |
| `pnpm build` | Собрать production-версию Nuxt |
| `pnpm generate` | Сгенерировать статические версии `/` и `/ru` |
| `pnpm preview` | Локально открыть production-результат |

Перед отправкой изменений рекомендуется выполнить полный цикл проверок:

```bash
pnpm lint
pnpm typecheck
pnpm generate
pnpm preview
```

После `pnpm generate` проверьте наличие как минимум:

```text
.output/public/index.html
.output/public/ru/index.html
```

Основной текст обеих страниц должен находиться в этих HTML-файлах уже при открытии исходного кода страницы, а не появляться только после выполнения JavaScript.

## Структура проекта

```text
app/
  app.vue                         # корневой UApp и общая оболочка
  app.config.ts                   # семантические цвета и конфигурация Nuxt UI
  assets/css/main.css             # Tailwind, Nuxt UI, переменные и общие стили
  components/
    layout/                       # header, мобильная навигация, footer
    sections/                     # Hero, Services, Projects, Process и другие секции
    project/                      # карточки, preview, метрики и placeholder проекта
    ui/                           # повторяющиеся локальные UI-паттерны
  composables/
    usePortfolioContent.ts        # однократная SSR-safe загрузка YAML текущей локали
    useActiveSection.ts           # активный пункт якорной навигации
    useSectionReveal.ts           # появления с учётом reduced motion
    useContactLink.ts             # выбор Telegram или fallback на #contacts
  pages/index.vue                 # загрузка контента и сборка одностраничного сайта
  types/portfolio.ts              # только вспомогательные/производные UI-типы
content/
  portfolio/
    en.yml                        # весь английский пользовательский контент
    ru.yml                        # весь русский пользовательский контент
public/
  images/projects/                # локальные скриншоты проектов
  og/                             # Open Graph изображения локалей
  favicon.ico
  robots.txt
  sitemap.xml
  site.webmanifest
content.config.ts                 # data-коллекция и строгая Zod-схема
nuxt.config.ts                    # модули, i18n, prerender и SEO-настройки
eslint.config.mjs                 # flat config ESLint
```

Фактическое разбиение компонентов может немного меняться по мере развития сайта, но источником маркетингового контента остаются только `content/portfolio/en.yml` и `content/portfolio/ru.yml`. Страница загружает нужный документ один раз через `queryCollection`; секции получают уже типизированные данные через props.

## Контент в YAML

Оба файла локалей имеют одинаковую структуру и валидируются схемой из `content.config.ts`:

```yaml
locale: en
seo:                    # title, description, OG и canonical
site:                   # имя, роль, домен и URL
navigation:             # якоря и доступные подписи элементов управления
hero:                   # заголовок, CTA, технологии и необязательный portrait
services:               # карточки услуг
projects:               # любое количество проектов
process:                # этапы сотрудничества
about:                  # текст и краткие факты
availability:           # видимость и статус доступности
contacts:               # Telegram, email и fallback-текст
footer:                 # роль, copyright и возврат наверх
```

После изменения структуры YAML синхронно обновите строгую схему в `content.config.ts`. Не создавайте отдельную ручную копию полного типа данных: типы коллекции генерирует Nuxt Content.

### Английский и русский контент

- Английские тексты редактируются в `content/portfolio/en.yml` и публикуются на `/`.
- Русские тексты редактируются в `content/portfolio/ru.yml` и публикуются на `/ru`.

Сохраняйте одинаковые `id` секций и проектов в двух локалях. Это поддерживает якорные ссылки, активную навигацию и одинаковый порядок содержимого. Не переносите основные тексты в Vue-компоненты или i18n messages: там допустимы только короткие технические строки интерфейса.

### Добавление проекта

Добавьте элемент в `projects.items` обоих YAML-файлов. Пример для английской локали:

```yaml
- id: powersketch
  published: true
  featured: true
  title: PowerSketch
  shortDescription: A browser-based service for designing electrical distribution boards.
  fullDescription: A SaaS product with an interactive graphical editor, device library, project storage, exports and subscriptions.
  url: https://powersketch.ru
  repositoryUrl:
  images: []
  role:
    - item: Product design
    - item: UI/UX
    - item: Frontend
    - item: Backend
    - item: Architecture
    - item: Infrastructure
  responsibilities:
    - item: Product architecture
    - item: Interactive editor
    - item: Device library
    - item: Project storage
  features:
    - item: Interactive graphical editor
    - item: Layers, wires and annotations
    - item: SVG, PNG and PDF export
    - item: Subscriptions and paid features
  technologies:
    - label: Vue
    - label: Nuxt
    - label: TypeScript
    - label: Node.js
    - label: SVG
  result: A complete browser-based product for creating electrical diagrams without installing specialized desktop software.
  metrics: []
```

Для русского файла добавьте запись с тем же `id`, флагами, ссылками и изображениями, но с русскими текстами.

- Чтобы скрыть проект, установите `published: false` в обеих локалях. Он останется в контенте, но не попадёт на страницу.
- Чтобы выделить проект, используйте `featured: true`.
- Чтобы изменить порядок, переставьте элементы массива `projects.items`. Vue-код менять не требуется.
- Пустые `url` и `repositoryUrl` разрешены: соответствующие кнопки не отображаются.
- Не добавляйте вымышленные клиенты, отзывы или показатели.

### Реальные метрики

Метрики необязательны. Пока подтверждённых значений нет, оставляйте `metrics: []` или не задавайте поле. Для реальных показателей используйте:

```yaml
metrics:
  - value: "12"
    label: Production integrations
  - value: "3"
    label: Export formats
```

Замените пример только на проверяемые значения. При пустом массиве блок метрик не рендерится.

### Портрет

Положите локальный файл, например, в `public/images/portrait.webp`, а затем заполните `hero.portrait` в обеих локалях:

```yaml
portrait:
  src: /images/portrait.webp
  alt: Portrait of Valentin Alekhin
```

Для русского файла задайте локализованный `alt`. Если `src` пуст или поле отсутствует, Hero автоматически показывает абстрактную композицию с монограммой `VA`; менять компонент не нужно. Подготовьте изображение подходящего размера в WebP/AVIF, не удаляйте его пропорции и не используйте URL внешнего CDN.

### Скриншоты проектов

Храните изображения в отдельном каталоге проекта, например:

```text
public/images/projects/powersketch/editor.webp
public/images/projects/powersketch/mobile.webp
```

Подключите их в `images` у проекта:

```yaml
images:
  - src: /images/projects/powersketch/editor.webp
    alt: PowerSketch electrical board editor
  - src: /images/projects/powersketch/mobile.webp
    alt: PowerSketch project view on a narrow screen
```

Локализуйте `alt` в `ru.yml`. Используйте локальные WebP/AVIF/PNG, указывайте содержательный alt и оптимизируйте размер файлов. Если `images` пуст, для PowerSketch отображается встроенный аккуратный SVG/CSS-placeholder. Чтобы заменить его настоящими скриншотами, достаточно положить файлы в `public/images/projects/powersketch/` и заполнить массив; Vue-код менять не требуется.

### Контакты

Заполните одни и те же реальные контактные данные в обоих YAML-файлах:

```yaml
contacts:
  telegram:
    label: Telegram
    url: https://t.me/your_username
  email:
    label: Email
    value: hello@example.com
```

Не добавляйте `@` вместо URL Telegram и не пишите `mailto:` в `value`: ссылка email формируется приложением. Пустой Telegram не создаёт ссылку, пустой email не создаёт `mailto:`. Если оба значения пустые, секция выводит локализованное сообщение-заглушку, а основная CTA в Hero ведёт к `#contacts`.

### Доступность для проектов, location и timezone

Секция полностью управляется блоком `availability`:

```yaml
availability:
  visible: true
  available: true
  label: Available for projects
  title: Let’s discuss your product
  description: ...
  location:
  timezone:
```

- `visible: false` полностью скрывает секцию.
- `available: true` показывает положительный статус; `false` — нейтральный статус без зелёной индикации.
- В `label`, `title` и `description` должен быть текст, соответствующий значению `available`.
- В `location` укажите только фактическое местоположение, если хотите публиковать его.
- В `timezone` укажите понятный клиенту часовой пояс, например `UTC+3`, только после проверки.
- Пустые `location` и `timezone` не отображаются.

Обновляйте блок в обоих YAML-файлах, локализуя подписи, но сохраняя одинаковые `visible` и `available`.

## Цвета и темы

Сайт поддерживает `system`, `light` и `dark`; по умолчанию используется системная тема с fallback на светлую. Выбор сохраняет Nuxt Color Mode. Не добавляйте параллельное хранение темы через VueUse или собственный `localStorage`.

- Семантические цвета Nuxt UI меняются в `app/app.config.ts`.
- Фон, поверхности, текст, границы, акцент, тени и радиусы меняются через CSS-переменные в `app/assets/css/main.css`.
- Светлые и тёмные значения задаются централизованно; не размещайте произвольные HEX-цвета в компонентах.
- Поведение и набор режимов color mode настраиваются в `nuxt.config.ts`.

После изменения палитры проверьте контраст текста, focus ring, кнопки, карточки, мобильное меню, project preview и Open Graph изображения в обеих темах. Также проверьте `prefers-reduced-motion`: контент должен быть видим сразу, а декоративные движения и smooth scroll — отключаться.

## Добавление локали

Сейчас поддерживаются только `en` и `ru`. Чтобы добавить язык:

1. Скопируйте `content/portfolio/en.yml` в новый файл, например `content/portfolio/de.yml`, переведите все пользовательские тексты и измените `locale`.
2. Добавьте значение локали в Zod enum/схему `content.config.ts`.
3. Зарегистрируйте локаль в настройках `@nuxtjs/i18n` в `nuxt.config.ts` и выберите корректный ISO-код и Open Graph locale.
4. Добавьте новый маршрут в prerender-настройки и, если sitemap статический, в `public/sitemap.xml`.
5. Создайте локальное Open Graph изображение и заполните локализованные SEO-поля, canonical, `hreflang`, alternate locale и `x-default`.
6. При наличии коротких технических i18n messages добавьте их перевод в единственном используемом источнике.
7. Выполните `pnpm typecheck` и `pnpm generate`, затем проверьте HTML нового маршрута и переключатель языка.

Стратегия `prefix_except_default` оставляет английский языком без префикса. Ссылки переключателя строятся API `@nuxtjs/i18n`, а не вручную.

## SEO и статические ресурсы

Локализованные `title`, `description`, canonical и Open Graph данные находятся в `seo` каждого YAML-файла. Для `alekhin.dev` ожидаются canonical:

```text
https://alekhin.dev/
https://alekhin.dev/ru
```

Open Graph изображения хранятся локально:

```text
public/og/portfolio-en.png
public/og/portfolio-ru.png
```

Также перед публикацией проверяются `public/favicon.ico`, `public/site.webmanifest`, `public/robots.txt` и `public/sitemap.xml`. Если основной домен изменится, обновите его во всех YAML SEO-полях, JSON-LD, robots, sitemap и конфигурации сайта — частичная замена приведёт к конфликтующим canonical URL.

## Статическое развёртывание

Соберите сайт:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm generate
```

На хостинг нужно загрузить **содержимое** каталога `.output/public`, а не сам исходный проект и не родительский каталог `.output`. Корень домена должен указывать на файл `.output/public/index.html`, а `/ru` — открывать `.output/public/ru/index.html`.

Для Netlify, Cloudflare Pages, GitHub Pages, S3/объектного хранилища или другого статического сервиса используйте:

```text
Build command: pnpm generate
Publish directory: .output/public
```

В CI должна быть установлена версия Node.js, подходящая под раздел «Требования», и включён pnpm/Corepack. Для обычного Nginx/Apache загрузите содержимое `.output/public` в document root. Серверный процесс `nuxt start` не нужен.

После публикации откройте `/` и `/ru` напрямую, обновите страницу на каждом маршруте, проверьте якоря, контакты, переключение языка и темы, canonical/`hreflang`, `robots.txt`, `sitemap.xml` и Open Graph preview.

## Before publishing

- [ ] Добавить реальный Telegram URL в `content/portfolio/en.yml` и `ru.yml`.
- [ ] Добавить реальный email в оба YAML-файла.
- [ ] Проверить и при необходимости заполнить `availability.location`; не угадывать местоположение.
- [ ] Проверить и при необходимости заполнить `availability.timezone`.
- [ ] Добавить портрет в `public/images/` и заполнить `hero.portrait`, если он нужен.
- [ ] Заменить placeholder PowerSketch реальными локальными скриншотами и заполнить `images`.
- [ ] Проверить рабочую ссылку PowerSketch и убрать её, если она недоступна.
- [ ] Проверить canonical URL для `/` и `/ru`.
- [ ] Проверить локальные Open Graph изображения для обеих локалей.
- [ ] Проверить favicon и `site.webmanifest`.
- [ ] Проверить содержимое и доступность `robots.txt`.
- [ ] Проверить, что sitemap содержит `/` и `/ru` с production-доменом.
- [ ] Выполнить `pnpm lint`, `pnpm typecheck` и `pnpm generate` без ошибок.
- [ ] Проверить сгенерированный HTML в `.output/public` и отсутствие runtime-запросов за контентом.
- [ ] Проверить production-страницы `/` и `/ru`, включая прямое открытие и обновление.
- [ ] Проверить мобильную версию от 320 px, клавиатурную навигацию, обе темы и reduced motion.
- [ ] Проверить отсутствие ошибок, hydration warnings и горизонтального scroll в браузерной консоли.
- [ ] Выполнить Lighthouse для обеих локалей и проверить Performance, Accessibility, Best Practices и SEO.

Пустые Telegram, email, location, timezone, portrait, project images и metrics являются допустимыми до публикации: интерфейс не должен создавать для них пустые ссылки или блоки. В production следует заполнить только реальные, проверенные данные.
