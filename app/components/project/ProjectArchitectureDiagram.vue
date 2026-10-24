<script setup lang="ts">
import { Handle, MarkerType, Position, VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { useElementSize, useMediaQuery } from '@vueuse/core'
import { PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import type { ProjectDiagramEdge, ProjectDiagramName, ProjectDiagramViewport } from '~/data/projectDiagrams'
import { projectDiagrams } from '~/data/projectDiagrams'
import '@vue-flow/core/dist/style.css'

const props = defineProps<{ diagram: ProjectDiagramName }>()
const { t } = useI18n()
const graph = computed(() => projectDiagrams[props.diagram])
const canvas = useTemplateRef<HTMLElement>('canvas')
const { width: canvasWidth } = useElementSize(canvas)
const isMobile = useMediaQuery('(max-width: 899px)')
const viewport = computed<ProjectDiagramViewport>(() => isMobile.value ? 'mobile' : 'desktop')
const hoveredNode = ref<string | null>(null)
const focusedNode = ref<string | null>(null)
const openNode = ref<string | null>(null)
const activeNode = computed(() => openNode.value ?? focusedNode.value ?? hoveredNode.value)
const diagramId = useId()
const descriptionId = `${diagramId}-description`
const ports = { top: Position.Top, right: Position.Right, bottom: Position.Bottom, left: Position.Left }

const nodes = computed<Node[]>(() => graph.value.nodes.map((node, index) => {
  const layout = node.layout[viewport.value]
  return {
    id: node.id,
    type: 'project',
    position: { x: canvasWidth.value * layout.x / 1000, y: layout.y },
    width: canvasWidth.value * layout.width / 1000,
    height: layout.height,
    data: { copyKey: node.copyKey, index },
    draggable: false,
    connectable: false,
    selectable: false,
    focusable: false,
    deletable: false,
  }
}))

function isActiveEdge(edge: ProjectDiagramEdge) {
  return edge.from === activeNode.value || edge.to === activeNode.value
}

const edges = computed<Edge[]>(() => graph.value.edges.map((edge) => {
  const active = isActiveEdge(edge)
  const marker = {
    type: MarkerType.Arrow,
    color: active ? 'var(--color-text)' : 'var(--color-control-border)',
    width: 8,
    height: 8,
    strokeWidth: 1.5,
    orient: 'auto-start-reverse',
  }
  const connection = edge.connection[viewport.value]
  return {
    id: `${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    sourceHandle: `source-${connection.sourcePort}`,
    targetHandle: `target-${connection.targetPort}`,
    type: 'smoothstep',
    pathOptions: { borderRadius: 6, offset: edge.feedback ? (isMobile.value ? canvasWidth.value * 0.1 : 80) : 20 },
    markerEnd: marker,
    markerStart: edge.bidirectional ? marker : undefined,
    class: { 'architecture-diagram__edge': true, 'architecture-diagram__edge--active': active, 'architecture-diagram__edge--feedback': Boolean(edge.feedback) },
    selectable: false,
    focusable: false,
    deletable: false,
    domAttributes: { 'aria-hidden': true },
  }
}))
</script>

<template>
  <div
    class="architecture-diagram"
    :class="`architecture-diagram--${graph.layout}`"
    role="group"
    :aria-label="t(graph.labelKey)"
    :aria-describedby="descriptionId"
  >
    <p class="architecture-diagram__hint">
      {{ t('projects.entries.cnp.diagram.hint') }}
    </p>
    <p
      :id="descriptionId"
      class="architecture-diagram__sr-only"
    >
      {{ t(graph.descriptionKey) }}
    </p>
    <div
      ref="canvas"
      class="architecture-diagram__canvas"
      :style="{ '--diagram-desktop-height': `${graph.height.desktop}px`, '--diagram-mobile-height': `${graph.height.mobile}px` }"
    >
      <ClientOnly>
        <VueFlow
          v-if="canvasWidth > 0"
          :id="diagramId"
          :nodes="nodes"
          :edges="edges"
          :default-viewport="{ x: 0, y: 0, zoom: 1 }"
          :min-zoom="1"
          :max-zoom="1"
          :nodes-draggable="false"
          :nodes-connectable="false"
          :nodes-focusable="false"
          :edges-focusable="false"
          :edges-updatable="false"
          :elements-selectable="false"
          :pan-on-drag="false"
          :pan-on-scroll="false"
          :zoom-on-scroll="false"
          :zoom-on-pinch="false"
          :zoom-on-double-click="false"
          :prevent-scrolling="false"
          :selection-key-code="false"
          :delete-key-code="null"
          :pan-activation-key-code="null"
          :zoom-activation-key-code="null"
          :disable-keyboard-a11y="true"
        >
          <template #node-project="{ id, data }">
            <template
              v-for="(position, port) in ports"
              :key="port"
            >
              <Handle
                :id="`source-${port}`"
                type="source"
                :position="position"
                :connectable="false"
                aria-hidden="true"
              />
              <Handle
                :id="`target-${port}`"
                type="target"
                :position="position"
                :connectable="false"
                aria-hidden="true"
              />
            </template>
            <PopoverRoot
              :open="openNode === id"
              @update:open="openNode = $event ? id : null"
            >
              <PopoverTrigger as-child>
                <button
                  type="button"
                  class="architecture-diagram__node nodrag nopan"
                  :class="[`architecture-diagram__node--${id}`, { 'architecture-diagram__node--active': activeNode === id }]"
                  :aria-label="t(`${data.copyKey}.title`)"
                  :aria-describedby="`${diagramId}-${id}-summary`"
                  @pointerenter="hoveredNode = id"
                  @pointerleave="hoveredNode = null"
                  @focus="focusedNode = id"
                  @blur="focusedNode = null"
                  @keydown.enter.prevent.stop="openNode = id"
                  @keydown.space.prevent.stop="openNode = id"
                >
                  <span
                    v-if="graph.layout === 'workflow'"
                    class="architecture-diagram__step"
                  >{{ String(data.index + 1).padStart(2, '0') }}</span>
                  <BaseIcon
                    v-else
                    name="plus"
                    class="architecture-diagram__more"
                  />
                  <span class="architecture-diagram__title">{{ t(`${data.copyKey}.title`) }}</span>
                  <span
                    :id="`${diagramId}-${id}-summary`"
                    class="architecture-diagram__summary"
                  >{{ t(`${data.copyKey}.summary`) }}</span>
                </button>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent
                  class="architecture-diagram__popover"
                  :side-offset="12"
                  :collision-padding="20"
                  :aria-label="t(`${data.copyKey}.title`)"
                >
                  <div class="architecture-diagram__popover-head">
                    <h3>{{ t(`${data.copyKey}.title`) }}</h3>
                    <PopoverClose :aria-label="t('projects.entries.cnp.diagram.close')">
                      <BaseIcon name="close" />
                    </PopoverClose>
                  </div>
                  <p>{{ t(`${data.copyKey}.detail`) }}</p>
                </PopoverContent>
              </PopoverPortal>
            </PopoverRoot>
          </template>
        </VueFlow>
        <template #fallback>
          <ul class="architecture-diagram__fallback">
            <li
              v-for="node in graph.nodes"
              :key="node.id"
            >
              <strong>{{ t(`${node.copyKey}.title`) }}</strong>
              <p>{{ t(`${node.copyKey}.summary`) }}</p>
            </li>
          </ul>
        </template>
      </ClientOnly>
    </div>
    <p
      v-if="graph.layout === 'system'"
      class="architecture-diagram__legend"
    >
      <span aria-hidden="true" />{{ t('projects.entries.cnp.diagram.feedback') }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.architecture-diagram { margin-top: 2rem; padding: clamp(1rem, 2.5vw, 2rem); border: 1px solid var(--color-line); }
.architecture-diagram__hint { margin: 0 0 2rem; color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-ui); line-height: 1.7; }
.architecture-diagram__sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.architecture-diagram__canvas { position: relative; height: var(--diagram-desktop-height); }
.architecture-diagram__canvas:has(.architecture-diagram__fallback) { height: auto; min-height: var(--diagram-desktop-height); }
.architecture-diagram__canvas :deep(.vue-flow) { overflow: visible; }
.architecture-diagram__canvas :deep(.vue-flow__viewport) { overflow: visible; }
.architecture-diagram__canvas :deep(.vue-flow__pane) { pointer-events: none; }
.architecture-diagram__canvas :deep(.vue-flow__handle) { width: 1px; height: 1px; min-width: 0; min-height: 0; opacity: 0; pointer-events: none; }
.architecture-diagram__canvas :deep(.architecture-diagram__edge) { pointer-events: none; cursor: default; }
.architecture-diagram__canvas :deep(.architecture-diagram__edge .vue-flow__edge-path) { stroke: var(--color-control-border); stroke-width: 1; }
.architecture-diagram__canvas :deep(.architecture-diagram__edge--active .vue-flow__edge-path) { stroke: var(--color-text); stroke-width: 2; }
.architecture-diagram__canvas :deep(.architecture-diagram__edge--feedback .vue-flow__edge-path) { stroke-dasharray: 5 5; }
.architecture-diagram__node { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 0.65rem; width: 100%; height: 100%; padding: 1rem; border: 1px solid var(--color-control-border); border-radius: 0; background: var(--color-bg); color: var(--color-text); text-align: left; cursor: pointer; pointer-events: auto; font: inherit; }
.architecture-diagram__node--active { border-color: var(--color-text); background: var(--color-surface); }
.architecture-diagram__node:focus-visible, .architecture-diagram__popover button:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 4px; }
.architecture-diagram__title { font-size: 0.9375rem; font-weight: 600; line-height: 1.35; }
.architecture-diagram__summary { color: var(--color-text-muted); font-size: var(--font-size-ui); line-height: 1.65; }
.architecture-diagram__more { position: absolute; right: 0.4rem; top: 0.4rem; width: 0.875rem; height: 0.875rem; color: var(--color-text-muted); }
.architecture-diagram__legend { display: flex; gap: 0.75rem; align-items: center; margin: 1rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-ui); line-height: 1.6; }
.architecture-diagram__legend span { flex: 0 0 2rem; border-top: 1px dashed var(--color-control-border); }
.architecture-diagram__step { color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-ui); }
.architecture-diagram__fallback { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
.architecture-diagram__fallback li { padding: 1rem; border: 1px solid var(--color-control-border); font-size: var(--font-size-ui); line-height: 1.6; }
.architecture-diagram__fallback p { margin: 0.5rem 0 0; color: var(--color-text-muted); }
// Reka's teleported content does not inherit the custom-node slot's scope attribute.
:global(.architecture-diagram__popover) { z-index: 70; width: min(24rem, var(--reka-popover-content-available-width)); max-height: var(--reka-popover-content-available-height); overflow-y: auto; padding: 1.25rem; border: 1px solid var(--color-control-border); background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
.architecture-diagram__popover-head { display: flex; gap: 1rem; justify-content: space-between; align-items: start; }
.architecture-diagram__popover h3 { margin: 0; padding-top: 0.5rem; font-size: 1rem; line-height: 1.4; }
.architecture-diagram__popover button { display: grid; flex: none; width: 2.75rem; height: 2.75rem; padding: 0; place-items: center; border: 0; background: transparent; color: var(--color-text); cursor: pointer; }
.architecture-diagram__popover p { margin: 0.75rem 0 0; color: var(--color-text-muted); font-size: var(--font-size-small); line-height: 1.7; }
@media (max-width: 899px) {
  .architecture-diagram__canvas { height: var(--diagram-mobile-height); }
  .architecture-diagram__canvas:has(.architecture-diagram__fallback) { min-height: var(--diagram-mobile-height); }
  .architecture-diagram__node { padding: 0.875rem; }
  .architecture-diagram__fallback { grid-template-columns: 1fr; }
}
</style>
