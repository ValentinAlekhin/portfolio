import type { Project } from '~/types/content'

export const projects: Project[] = [
  {
    slug: 'powersketch',
    index: '01',
    title: 'PowerSketch',
    period: '2024—NOW',
    status: 'live',
    externalUrl: 'https://powersketch.ru',
    roles: ['Product', 'UI/UX', 'Frontend', 'Backend', 'Architecture'],
    stack: ['Vue', 'Nuxt', 'TypeScript', 'Node.js', 'SVG'],
    content: {
      ru: {
        summary: 'Веб-сервис для проектирования электрических щитов прямо в браузере.',
        description: 'PowerSketch помогает электрикам и интеграторам умного дома собирать проекты щитов без привязки к сложному настольному ПО: от размещения устройств до таблицы соединений и общего доступа по ссылке.',
        challenge: 'Нужно было соединить привычную точность инженерного инструмента с понятным веб-интерфейсом: большой каталог устройств, масштабируемое полотно, связи между контактами и данные проекта должны оставаться согласованными.',
        role: 'Я отвечаю за продукт целиком: формулирую сценарии, проектирую интерфейс и модель данных, разрабатываю frontend и backend, а также веду продукт после запуска.',
        approach: 'Редактор построен вокруг независимой SVG-сцены. Устройства, провода, слои и подписи представлены как данные, поэтому один проект можно редактировать, сохранять, копировать и экспортировать без расхождений между видами.',
        architecture: 'Клиентский редактор отделён от серверных задач. Backend управляет авторизацией, проектами, библиотекой устройств, публичным доступом и подписками; интерфейс оптимизирует частые операции на полотне и синхронизирует устойчивое состояние проекта.',
        result: 'Работающий браузерный продукт с drag-and-drop редактором, умными соединениями, слоями, каталогом устройств, отчётами, общим доступом и тарифами. Неподтверждённые пользовательские или финансовые метрики в кейсе намеренно не используются.',
        constraints: 'Основные компромиссы — производительность большой SVG-сцены, точность экспорта, обратная совместимость проектов и предсказуемое поведение редактора на разных размерах экрана.',
      },
      en: {
        summary: 'A browser-based service for designing electrical distribution boards.',
        description: 'PowerSketch helps electricians and smart-home integrators assemble distribution-board projects without complex desktop software—from device placement to connection reports and link sharing.',
        challenge: 'The product had to combine the precision of an engineering tool with an approachable web interface. A large device catalog, scalable canvas, pin connections, and project data all needed to stay consistent.',
        role: 'I own the product end to end: workflows, interface and data-model design, frontend, backend, and continued product development after launch.',
        approach: 'The editor is centered on an independent SVG scene. Devices, wires, layers, and annotations are data, so the same project can be edited, stored, copied, and exported without divergent representations.',
        architecture: 'The interactive client is separated from server responsibilities. The backend handles authentication, projects, the device library, public access, and subscriptions, while the UI optimizes frequent canvas operations and synchronizes durable project state.',
        result: 'A working browser product with a drag-and-drop editor, smart connections, layers, a device catalog, reports, shared access, and paid plans. Unverified user or financial metrics are deliberately excluded.',
        constraints: 'The key trade-offs are large-scene SVG performance, export fidelity, backward compatibility of stored projects, and predictable editor behavior across screen sizes.',
      },
    },
  },
]
