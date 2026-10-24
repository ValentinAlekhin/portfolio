export type ProjectDiagramName = 'cnp-system' | 'cnp-workflow'
export type ProjectDiagramViewport = 'desktop' | 'mobile'
export type ProjectDiagramPort = 'top' | 'right' | 'bottom' | 'left'

export interface ProjectDiagramNodeLayout {
  // Horizontal coordinates use a 1000-unit canvas; vertical values are pixels.
  x: number
  y: number
  width: number
  height: number
}

export interface ProjectDiagramNode {
  id: string
  copyKey: string
  layout: Record<ProjectDiagramViewport, ProjectDiagramNodeLayout>
}

export interface ProjectDiagramConnection {
  sourcePort: ProjectDiagramPort
  targetPort: ProjectDiagramPort
}

export interface ProjectDiagramEdge {
  from: string
  to: string
  connection: Record<ProjectDiagramViewport, ProjectDiagramConnection>
  feedback?: boolean
  bidirectional?: boolean
}

export interface ProjectDiagram {
  layout: 'system' | 'workflow'
  labelKey: string
  descriptionKey: string
  height: Record<ProjectDiagramViewport, number>
  nodes: readonly ProjectDiagramNode[]
  edges: readonly ProjectDiagramEdge[]
}

const copy = 'projects.entries.cnp'
const horizontal: ProjectDiagramConnection = { sourcePort: 'right', targetPort: 'left' }
const vertical: ProjectDiagramConnection = { sourcePort: 'bottom', targetPort: 'top' }
const forwardConnection = { desktop: horizontal, mobile: vertical }

export const projectDiagrams: Record<ProjectDiagramName, ProjectDiagram> = {
  'cnp-system': {
    layout: 'system',
    labelKey: `${copy}.diagram.systemLabel`,
    descriptionKey: `${copy}.system.description`,
    height: { desktop: 390, mobile: 704 },
    nodes: [
      { id: 'operator', desktop: { x: 0, y: 20, width: 210, height: 150 }, mobile: { x: 0, y: 0, width: 480, height: 176 } },
      { id: 'sources', desktop: { x: 0, y: 220, width: 210, height: 150 }, mobile: { x: 520, y: 0, width: 480, height: 176 } },
      { id: 'server', desktop: { x: 263, y: 120, width: 210, height: 150 }, mobile: { x: 160, y: 224, width: 680, height: 128 } },
      { id: 'player', desktop: { x: 526, y: 120, width: 210, height: 150 }, mobile: { x: 160, y: 400, width: 680, height: 128 } },
      { id: 'wall', desktop: { x: 790, y: 120, width: 210, height: 150 }, mobile: { x: 160, y: 576, width: 680, height: 128 } },
    ].map(({ id, desktop, mobile }) => ({ id, copyKey: `${copy}.diagram.nodes.${id}`, layout: { desktop, mobile } })),
    edges: [
      { from: 'operator', to: 'server', connection: forwardConnection, bidirectional: true },
      { from: 'sources', to: 'server', connection: forwardConnection },
      { from: 'server', to: 'player', connection: forwardConnection },
      { from: 'player', to: 'wall', connection: forwardConnection },
      { from: 'player', to: 'server', connection: { desktop: { sourcePort: 'bottom', targetPort: 'bottom' }, mobile: { sourcePort: 'right', targetPort: 'right' } }, feedback: true },
    ],
  },
  'cnp-workflow': {
    layout: 'workflow',
    labelKey: `${copy}.diagram.workflowLabel`,
    descriptionKey: `${copy}.workflow.description`,
    height: { desktop: 200, mobile: 720 },
    nodes: ['prepare', 'select', 'deliver', 'confirm'].map((id, index) => ({
      id,
      copyKey: `${copy}.diagram.steps.${id}`,
      layout: {
        desktop: { x: index === 3 ? 790 : index * 263, y: 0, width: 210, height: 200 },
        mobile: { x: 0, y: index * 192, width: 1000, height: 144 },
      },
    })),
    edges: [
      { from: 'prepare', to: 'select', connection: forwardConnection },
      { from: 'select', to: 'deliver', connection: forwardConnection },
      { from: 'deliver', to: 'confirm', connection: forwardConnection },
    ],
  },
}
