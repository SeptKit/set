<template>
	<div class="root" name="diagram">
		<VueFlow
			:nodes="props.nodes"
			:edges="props.edges"
			class="basic-flow"
			:default-viewport="{ zoom: 1.0 }"
			:min-zoom="0.2"
			:max-zoom="4"
		>
			<Background pattern-color="#aaa" :gap="16" />

			<template #node-expandable="props">
				<FlowNodeExpandable
					v-bind="props"
					@expand="(event) => $emit('expand', event)"
					@collapse="(event) => $emit('collapse', event)"
				/>
			</template>

			<MiniMap />

			<Controls position="top-left">
				<ControlButton title="Reset Transform" @click="resetTransform">
					<Icon name="reset" />
				</ControlButton>

				<ControlButton title="Log `toObject`" @click="logToObject">
					<Icon name="log" />
				</ControlButton>
			</Controls>
		</VueFlow>
	</div>
</template>

<script setup lang="ts">
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls, ControlButton } from '@vue-flow/controls'
import Icon from './icon.vue'
import FlowNodeExpandable from './node-expandable/flow-node-expandable.vue'
import { watch } from 'vue'

const props = defineProps<{
	nodes: Node[]
	edges: Edge[]
}>()

const {
	onInit,
	onNodeDragStop,
	onConnect,
	addEdges,
	onNodesChange,
	setViewport,
	toObject,
	edges,
	setNodes,
	fitView,
} = useVueFlow()

onInit((vueFlowInstance) => {
	vueFlowInstance.fitView()
})

onNodeDragStop(({ event, nodes, node }) => {
	console.log('Node Drag Stop', { event, nodes, node })
})

onConnect((connection) => {
	addEdges(connection)
})

function logToObject() {
	console.log(toObject())
}

function resetTransform() {
	setViewport({ x: 0, y: 0, zoom: 1 })
}
</script>

<style scoped>
.root {
	padding-bottom: 1rem;
}
</style>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

.vue-flow__node {
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
