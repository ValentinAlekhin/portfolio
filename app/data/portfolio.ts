import type { PortfolioCopy } from '~/types/content'

export const portfolioCopy: Record<'ru' | 'en', PortfolioCopy> = {
  ru: {
    seo: {
      title: 'Валентин Алёхин — Senior Full-stack разработчик',
      description: 'Проектирую и разрабатываю SaaS, веб-приложения и внутренние системы — от идеи до запуска.',
      ogImage: '/og/portfolio-ru.png',
    },
    nav: {
      label: 'Основная навигация',
      items: [
        { id: 'projects', label: 'Проекты' },
        { id: 'services', label: 'Возможности' },
        { id: 'process', label: 'Процесс' },
        { id: 'about', label: 'Обо мне' },
      ],
      contact: 'Обсудить проект',
      open: 'Открыть меню',
      close: 'Закрыть меню',
      language: 'Переключить язык',
      theme: 'Переключить тему',
    },
    hero: {
      eyebrow: 'Независимый senior full-stack разработчик',
      name: ['ВАЛЕНТИН', 'АЛЁХИН'],
      statement: 'Создаю веб-продукты от идеи до запуска.',
      description: 'Проектирую и разрабатываю SaaS, веб-приложения и внутренние системы — без разрыва между дизайном, frontend и backend.',
      terminal: '> идея → интерфейс → frontend → backend → запуск_',
      primary: 'Обсудить проект',
      secondary: 'Смотреть проекты',
      available: 'Доступен для проектов',
      experience: '6+ лет',
    },
    projects: {
      eyebrow: 'Выбранные системы',
      title: 'Продукты для реальных рабочих процессов',
      description: 'Не витрина экранов, а системы, в которых интерфейс, архитектура и запуск работают как одно целое.',
      roleLabel: 'SaaS / Продукт / Full-stack',
      openCase: 'Открыть кейс',
    },
    capabilities: {
      eyebrow: 'Продуктовый конвейер',
      title: 'От неопределённой идеи до работающей системы',
      description: 'Подключаюсь ко всему продукту или к отдельному слою, сохраняя связь между пользовательским сценарием и техническим решением.',
      items: [
        { id: 'discovery', title: 'Discovery / Product', description: 'Уточняю задачу, ограничения и состав первой версии, чтобы сделать правильную вещь до того, как делать её быстро.', details: ['MVP и требования', 'Сценарии пользователей', 'Границы первой версии'] },
        { id: 'interface', title: 'Interface', description: 'Проектирую интерфейсы, в которых сложная предметная логика остаётся управляемой и понятной.', details: ['UI/UX', 'Редакторы и кабинеты', 'Интерактивные прототипы'] },
        { id: 'frontend', title: 'Frontend', description: 'Собираю быстрые приложения на Vue и Nuxt с типизированной логикой и вниманием к доступности.', details: ['Vue / Nuxt', 'TypeScript', 'Сложные состояния'] },
        { id: 'backend', title: 'Backend / Integrations', description: 'Проектирую API, интеграции и надёжные фоновые процессы без лишнего усложнения.', details: ['Node.js / Go', 'Платежи и CRM', 'Telegram и внешние API'] },
        { id: 'launch', title: 'Launch', description: 'Готовлю production, наблюдаемость и дальнейший цикл продукта — работа не заканчивается на локальной сборке.', details: ['Архитектура', 'Deployment', 'Развитие продукта'] },
      ],
    },
    process: {
      eyebrow: 'Рабочий протокол',
      title: 'Прозрачный процесс без лишних слоёв',
      description: 'Вы общаетесь напрямую с человеком, который принимает продуктовые и технические решения и отвечает за результат.',
      items: [
        { number: '01', title: 'Обсуждение', description: 'Разбираем задачу, пользователей, ограничения и критерий полезного результата.' },
        { number: '02', title: 'Предложение', description: 'Фиксирую решение, состав работ, этапы, сроки и подходящий формат оплаты.' },
        { number: '03', title: 'Разработка', description: 'Двигаемся короткими этапами с регулярными демонстрациями и обратной связью.' },
        { number: '04', title: 'Запуск', description: 'Проверяю production-сценарии, разворачиваю продукт и остаюсь на связи после релиза.' },
      ],
    },
    about: {
      eyebrow: 'Обо мне / Сейчас',
      title: 'Интерфейс и архитектура — части одного решения',
      paragraphs: [
        'Я работаю full-stack, потому что продуктовые решения редко заканчиваются на границе макета. Состояние интерфейса зависит от модели данных, а удобство запуска — от архитектуры и эксплуатации.',
        'Предпочитаю задачи, где можно понять реальный рабочий процесс, быстро проверить решение прототипом и довести его до использования, а не только до передачи файлов.',
      ],
      principlesLabel: 'Рабочие принципы',
      principles: [
        'Не разделяю интерфейс и архитектуру.',
        'Предпочитаю работающий прототип длинному документу.',
        'Автоматизирую то, что приходится делать второй раз.',
        'Считаю продукт готовым только после запуска.',
      ],
      now: [
        { label: 'Сейчас разрабатываю', value: 'PowerSketch' },
        { label: 'Сейчас исследую', value: 'Продуктовые SVG-интерфейсы' },
        { label: 'Открыт для', value: 'SaaS / инструменты / внутренние системы' },
      ],
    },
    contact: {
      eyebrow: 'Открытый канал',
      title: 'Есть задача или идея продукта?',
      description: 'Расскажите, что вы создаёте, что уже работает и где нужна техническая помощь. Короткого описания достаточно, чтобы начать.',
      write: 'Написать',
      copy: 'Скопировать email',
      copied: 'Email скопирован',
      dialogTitle: 'NEW_PROJECT_REQUEST',
      dialogDescription: 'Выберите удобный способ начать разговор.',
      compose: 'Составить письмо',
      close: 'Закрыть',
    },
    footer: { role: 'Независимый full-stack разработчик', backToTop: 'Наверх' },
    case: {
      back: 'К проектам', live: 'Открыть PowerSketch',
      labels: { context: 'Контекст', problem: 'Задача', role: 'Моя роль', approach: 'Продуктовый подход', interactions: 'Ключевые взаимодействия', architecture: 'Система / Архитектура', result: 'Результат', stack: 'Стек', next: 'Открытый канал' },
      interactionItems: [
        { title: 'SVG editor', description: 'Масштабируемое полотно, drag-and-drop устройств, привязка и работа со слоями.' },
        { title: 'Smart connections', description: 'Соединения между контактами становятся данными проекта и остаются редактируемыми.' },
        { title: 'Library & reports', description: 'Поиск по библиотеке устройств и формирование таблиц для передачи в работу.' },
      ],
      nextTitle: 'Обсудим ваш продукт?', nextText: 'Могу помочь собрать первую версию или подключиться к развитию существующей системы.',
    },
    notFound: { title: '404 / ROUTE NOT FOUND', text: 'Запрошенного маршрута нет в этой системе.', action: '> cd /home' },
  },
  en: {
    seo: {
      title: 'Valentin Alekhin — Senior Full-stack Developer',
      description: 'I design and build SaaS, web applications, and internal systems—from idea to launch.',
      ogImage: '/og/portfolio-en.png',
    },
    nav: {
      label: 'Main navigation',
      items: [
        { id: 'projects', label: 'Projects' },
        { id: 'services', label: 'Capabilities' },
        { id: 'process', label: 'Process' },
        { id: 'about', label: 'About' },
      ],
      contact: 'Discuss a project', open: 'Open menu', close: 'Close menu', language: 'Switch language', theme: 'Switch theme',
    },
    hero: {
      eyebrow: 'Independent senior full-stack developer',
      name: ['VALENTIN', 'ALEKHIN'],
      statement: 'I build web products from idea to launch.',
      description: 'I design and build SaaS, web applications, and internal systems—without gaps between design, frontend, and backend.',
      terminal: '> idea → interface → frontend → backend → launch_',
      primary: 'Discuss a project', secondary: 'View projects', available: 'Available for projects', experience: '6+ years',
    },
    projects: {
      eyebrow: 'Selected systems', title: 'Products built around real workflows', description: 'Not a gallery of screens, but systems where interface, architecture, and launch work as one.', roleLabel: 'SaaS / Product / Full-stack', openCase: 'Open case',
    },
    capabilities: {
      eyebrow: 'Product pipeline', title: 'From an uncertain idea to a working system', description: 'I can own the complete product or a specific layer while keeping user workflows and technical decisions connected.',
      items: [
        { id: 'discovery', title: 'Discovery / Product', description: 'I clarify the problem, constraints, and first-release scope before optimizing delivery.', details: ['MVP and requirements', 'User workflows', 'First-release boundaries'] },
        { id: 'interface', title: 'Interface', description: 'I design interfaces that keep complex domain logic understandable and controllable.', details: ['UI/UX', 'Editors and dashboards', 'Interactive prototypes'] },
        { id: 'frontend', title: 'Frontend', description: 'I build fast Vue and Nuxt applications with typed logic and accessible interaction.', details: ['Vue / Nuxt', 'TypeScript', 'Complex state'] },
        { id: 'backend', title: 'Backend / Integrations', description: 'I design APIs, integrations, and durable background workflows without unnecessary complexity.', details: ['Node.js / Go', 'Payments and CRM', 'Telegram and external APIs'] },
        { id: 'launch', title: 'Launch', description: 'I prepare production, observability, and the next product cycle—the work does not end at a local build.', details: ['Architecture', 'Deployment', 'Product development'] },
      ],
    },
    process: {
      eyebrow: 'Work protocol', title: 'A transparent process without extra layers', description: 'You communicate directly with the person making product and technical decisions and accountable for the result.',
      items: [
        { number: '01', title: 'Discussion', description: 'We unpack the problem, users, constraints, and what a useful outcome means.' },
        { number: '02', title: 'Proposal', description: 'I define the solution, scope, stages, timeline, and a suitable engagement model.' },
        { number: '03', title: 'Development', description: 'Work moves in short stages with regular demonstrations and feedback.' },
        { number: '04', title: 'Launch', description: 'I verify production scenarios, deploy the product, and stay available after release.' },
      ],
    },
    about: {
      eyebrow: 'About / Now', title: 'Interface and architecture are parts of the same decision',
      paragraphs: [
        'I work full-stack because product decisions rarely stop at the edge of a layout. Interface state depends on the data model, while a dependable launch depends on architecture and operations.',
        'I prefer work where I can understand the real workflow, test the direction with a prototype, and carry it through to actual use—not merely hand off files.',
      ],
      principlesLabel: 'Working principles',
      principles: ['I do not separate interface from architecture.', 'I prefer a working prototype to a long document.', 'I automate anything I have to do twice.', 'A product is only finished after launch.'],
      now: [
        { label: 'Currently building', value: 'PowerSketch' },
        { label: 'Currently exploring', value: 'SVG product interfaces' },
        { label: 'Available for', value: 'SaaS / tools / internal systems' },
      ],
    },
    contact: {
      eyebrow: 'Open channel', title: 'Have a task or a product idea?', description: 'Tell me what you are building, what already works, and where you need technical help. A short note is enough to begin.', write: 'Write to me', copy: 'Copy email', copied: 'Email copied', dialogTitle: 'NEW_PROJECT_REQUEST', dialogDescription: 'Choose the easiest way to start the conversation.', compose: 'Compose email', close: 'Close',
    },
    footer: { role: 'Independent full-stack developer', backToTop: 'Back to top' },
    case: {
      back: 'Back to projects', live: 'Open PowerSketch',
      labels: { context: 'Context', problem: 'Problem', role: 'My role', approach: 'Product approach', interactions: 'Core interactions', architecture: 'System / Architecture', result: 'Result', stack: 'Stack', next: 'Open channel' },
      interactionItems: [
        { title: 'SVG editor', description: 'A scalable canvas with device drag-and-drop, snapping, and layer controls.' },
        { title: 'Smart connections', description: 'Pin-to-pin connections become editable, durable project data.' },
        { title: 'Library & reports', description: 'Device-library search and connection reports ready for hand-off.' },
      ],
      nextTitle: 'Let’s discuss your product', nextText: 'I can help shape the first release or join the next stage of an existing system.',
    },
    notFound: { title: '404 / ROUTE NOT FOUND', text: 'The requested route does not exist in this system.', action: '> cd /home' },
  },
}
