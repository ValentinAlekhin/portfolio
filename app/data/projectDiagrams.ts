export type ProjectDiagramName = 'cnp-system' | 'cnp-workflow' | 'fgisu-system' | 'fgisu-workflow'
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
  color?: 'blue' | 'teal' | 'amber' | 'violet'
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
  hintKey?: string
  closeKey?: string
  legendKey?: string
  height: Record<ProjectDiagramViewport, number>
  nodes: readonly ProjectDiagramNode[]
  edges: readonly ProjectDiagramEdge[]
}

const copy = 'projects.entries.cnp'
const fgisuCopy = 'projects.entries.fgisu'
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
      {
        id: 'operator',
        desktop: { x: 0, y: 20, width: 210, height: 150 },
        mobile: { x: 0, y: 0, width: 480, height: 176 },
      },
      {
        id: 'sources',
        desktop: { x: 0, y: 220, width: 210, height: 150 },
        mobile: { x: 520, y: 0, width: 480, height: 176 },
      },
      {
        id: 'server',
        desktop: { x: 263, y: 120, width: 210, height: 150 },
        mobile: { x: 160, y: 224, width: 680, height: 128 },
      },
      {
        id: 'player',
        desktop: { x: 526, y: 120, width: 210, height: 150 },
        mobile: { x: 160, y: 400, width: 680, height: 128 },
      },
      {
        id: 'wall',
        desktop: { x: 790, y: 120, width: 210, height: 150 },
        mobile: { x: 160, y: 576, width: 680, height: 128 },
      },
    ].map(({ id, desktop, mobile }) => ({
      id,
      copyKey: `${copy}.diagram.nodes.${id}`,
      layout: { desktop, mobile },
    })),
    edges: [
      { from: 'operator', to: 'server', connection: forwardConnection, bidirectional: true },
      { from: 'sources', to: 'server', connection: forwardConnection },
      { from: 'server', to: 'player', connection: forwardConnection },
      { from: 'player', to: 'wall', connection: forwardConnection },
      {
        from: 'player',
        to: 'server',
        connection: {
          desktop: { sourcePort: 'bottom', targetPort: 'bottom' },
          mobile: { sourcePort: 'right', targetPort: 'right' },
        },
        feedback: true,
      },
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
  'fgisu-system': {
    layout: 'system',
    labelKey: `${fgisuCopy}.diagram.systemLabel`,
    descriptionKey: `${fgisuCopy}.system.description`,
    hintKey: `${fgisuCopy}.diagram.hint`,
    closeKey: `${fgisuCopy}.diagram.close`,
    legendKey: `${fgisuCopy}.diagram.connections`,
    height: { desktop: 730, mobile: 864 },
    nodes: [
      {
        id: 'interface',
        color: 'blue' as const,
        desktop: { x: 365, y: 0, width: 270, height: 130 },
        mobile: { x: 0, y: 0, width: 1000, height: 112 },
      },
      {
        id: 'gateway',
        color: 'blue' as const,
        desktop: { x: 365, y: 175, width: 270, height: 130 },
        mobile: { x: 0, y: 152, width: 1000, height: 112 },
      },
      {
        id: 'requests',
        color: 'blue' as const,
        desktop: { x: 0, y: 380, width: 270, height: 130 },
        mobile: { x: 0, y: 304, width: 480, height: 160 },
      },
      {
        id: 'resources',
        color: 'teal' as const,
        desktop: { x: 365, y: 380, width: 270, height: 130 },
        mobile: { x: 0, y: 504, width: 480, height: 160 },
      },
      {
        id: 'contracts',
        color: 'amber' as const,
        desktop: { x: 730, y: 380, width: 270, height: 130 },
        mobile: { x: 0, y: 704, width: 480, height: 160 },
      },
      {
        id: 'zeebe',
        color: 'violet' as const,
        desktop: { x: 0, y: 590, width: 270, height: 130 },
        mobile: { x: 520, y: 304, width: 480, height: 160 },
      },
      {
        id: 'analytics',
        color: 'teal' as const,
        desktop: { x: 365, y: 590, width: 270, height: 130 },
        mobile: { x: 520, y: 504, width: 480, height: 160 },
      },
      {
        id: 'documents',
        color: 'amber' as const,
        desktop: { x: 730, y: 590, width: 270, height: 130 },
        mobile: { x: 520, y: 704, width: 480, height: 160 },
      },
    ].map(({ id, color, desktop, mobile }) => ({
      id,
      color,
      copyKey: `${fgisuCopy}.diagram.nodes.${id}`,
      layout: { desktop, mobile },
    })),
    edges: [
      { from: 'interface', to: 'gateway', connection: { desktop: vertical, mobile: vertical } },
      { from: 'gateway', to: 'requests', connection: { desktop: vertical, mobile: vertical } },
      {
        from: 'gateway',
        to: 'resources',
        connection: { desktop: vertical, mobile: { sourcePort: 'left', targetPort: 'left' } },
      },
      {
        from: 'gateway',
        to: 'contracts',
        connection: { desktop: vertical, mobile: { sourcePort: 'left', targetPort: 'left' } },
      },
      {
        from: 'requests',
        to: 'zeebe',
        connection: { desktop: vertical, mobile: horizontal },
        bidirectional: true,
      },
      { from: 'resources', to: 'analytics', connection: { desktop: vertical, mobile: horizontal } },
      {
        from: 'documents',
        to: 'contracts',
        connection: {
          desktop: { sourcePort: 'top', targetPort: 'bottom' },
          mobile: { sourcePort: 'left', targetPort: 'right' },
        },
      },
    ],
  },
  'fgisu-workflow': {
    layout: 'workflow',
    labelKey: `${fgisuCopy}.diagram.workflowLabel`,
    descriptionKey: `${fgisuCopy}.workflow.description`,
    hintKey: `${fgisuCopy}.diagram.hint`,
    closeKey: `${fgisuCopy}.diagram.close`,
    height: { desktop: 216, mobile: 720 },
    nodes: ['request', 'approval', 'allocation', 'monitoring'].map((id, index) => ({
      id,
      copyKey: `${fgisuCopy}.diagram.steps.${id}`,
      layout: {
        desktop: { x: index === 3 ? 790 : index * 263, y: 0, width: 210, height: 216 },
        mobile: { x: 0, y: index * 192, width: 1000, height: 144 },
      },
    })),
    edges: [
      { from: 'request', to: 'approval', connection: forwardConnection },
      { from: 'approval', to: 'allocation', connection: forwardConnection },
      { from: 'allocation', to: 'monitoring', connection: forwardConnection },
    ],
  },
}
