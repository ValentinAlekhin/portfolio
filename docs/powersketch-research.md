# PowerSketch case-study research

Collected on 2026-07-13 from the public website and the authenticated product interface using Playwright MCP.

## Verified product facts

- PowerSketch is a browser-based editor for electrical distribution-board projects.
- The stated audience includes electricians, smart-home integrators, panel builders, commissioning engineers, and technical-support teams.
- The public catalog states that it contains 2,000 devices. The landing page currently lists 39 manufacturers.
- The main workflow is: sign in, create a project, add devices from the library, arrange the board, connect device pins, generate reports, and share the result.
- The editor provides a searchable hierarchical device library, a scalable grid canvas, device-pin connections, layers, undo/redo, and fit-to-view controls.
- Users can create custom devices and propose missing devices for the shared catalog.
- The authenticated dashboard brings together recent projects, custom devices, and release notes in one workspace.
- The project list supports search, creation, editing, copying, deletion, and public-access status management.
- The custom-device list exposes physical dimensions and pin count alongside creation and update dates.
- The custom-device editor supports a name, width and height in millimetres, a replaceable PNG/JPG/SVG/WEBP image up to 5 MB, named pins with coordinates, canvas zoom, and undo/redo.
- Layers can be created, reordered, collapsed, hidden, locked, renamed, and deleted. The inspected project contained devices and wires in the same layer tree.
- Device reports include manufacturer, device, parameters, notes, and quantity. Wire reports include marking, notes, cross-section, length, source, and destination.
- Reports can be downloaded and their visible columns can be configured.
- Scheme export currently exposes SVG output with background color, paper size, orientation, preview, download, and print controls.
- A project can be published through a view-only link and that public link can be regenerated.
- The product has free, Plus, and Professional plans. The public site says every plan includes the editor and device library, with different project, custom-device, and duration limits.
- As displayed on 2026-07-13, Free includes 1 project, 5 custom devices, and 3 layers. Plus costs 500 ₽ per 30 days and includes 5 projects, 50 custom devices, 10 layers, paid devices, project copying, and export without a watermark. Professional costs 1,000 ₽ per 30 days and includes 15 projects, 100 custom devices, and 50 layers together with the paid-plan capabilities.
- The public changelog shows active product development, including project copying and paid catalog devices in July 2026.

## Suggested case-study angle

PowerSketch should be presented as an engineering product rather than a collection of interface screens. The strongest narrative is the consistent data flow from a catalog device to an SVG scene, pin connections, downloadable reports, public review, and vector export.

The most defensible challenge statement is the need to combine engineering precision with an approachable browser interface while keeping device data, canvas state, connections, layers, reports, and export synchronized.

The strongest visible result is a working SaaS editor with a large real-world catalog and a complete workflow from board assembly to handoff. User, revenue, or conversion metrics were not visible and should not be claimed without separate confirmation.

## Screenshot inventory

All selected images are stored in `public/projects/powersketch/`.

| File | Best use |
| --- | --- |
| `landing-hero.png` | Product positioning and the public interactive demo |
| `landing-library.png` | Catalog scale and manufacturer coverage |
| `landing-features.png` | Public overview of the complete workflow |
| `app-dashboard.png` | Authenticated workspace overview with projects, custom devices, and releases |
| `project-list.png` | Searchable project management table and public-access state |
| `editor-overview.png` | Primary case-study hero: real board, devices, pins, wires, and catalog |
| `editor-library.png` | Hierarchical catalog navigation inside the editor |
| `editor-layers.png` | Layer management shown in the context of a real scheme |
| `layers-panel.png` | Focused layer-management detail |
| `custom-device-list.png` | Custom-device management with dimensions and pin counts |
| `device-report.png` | Generated device bill/report |
| `wire-report.png` | Connection report with lengths and endpoints |
| `sharing.png` | View-only public access workflow; no public URL is exposed |
| `export.png` | SVG export settings and live scheme preview |
| `subscription.png` | Current plan details and side-by-side tariff limits |

The authenticated screenshots do not show the account email or the public project URL. The project title visible in editor frames is `Однушка`.

## Sources inspected

- `https://powersketch.ru/`
- `https://powersketch.ru/app`
- Authenticated editor, reports, layer manager, sharing, and export surfaces
