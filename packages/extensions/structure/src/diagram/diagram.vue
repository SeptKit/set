<template>
	<VueFlow
		:id="diagramId"
		:nodes="nodes"
		:edges="edges"
		:class="{ dark }"
		class="basic-flow"
		:default-viewport="{ zoom: 1.0 }"
		:min-zoom="0.2"
		:max-zoom="4"
	>
		<Background pattern-color="#aaa" :gap="16" />

		<MiniMap />

		<Controls position="top-left">
			<ControlButton title="Reset Transform" @click="resetTransform">
				<Icon name="reset" />
			</ControlButton>

			<ControlButton title="Custom Control" @click="cycleDirection">
				<Icon name="update" />
			</ControlButton>

			<ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
				<Icon v-if="dark" name="sun" />
				<Icon v-else name="moon" />
			</ControlButton>

			<ControlButton title="Log `toObject`" @click="logToObject">
				<Icon name="log" />
			</ControlButton>
		</Controls>
	</VueFlow>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import Icon from './icon.vue'
import { useLayout, type Direction } from './layout'

const props = defineProps<{
	nodes: Node[]
	edges: Edge[]
}>()

const nodes = ref<Node[]>(props.nodes)
const edges = ref<Edge[]>(props.edges)

const diagramId = ref('scl-structure-diagram')

const directions: Direction[] = ['TB', 'BT', 'LR', 'RL']
let currentDirection = directions[0]
const { layout } = useLayout(diagramId.value)

const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject, fitView } = useVueFlow(
	diagramId.value,
)

// our dark mode toggle flag
const dark = ref(false)

onInit((vueFlowInstance) => {
	// instance is the same as the return of `useVueFlow`
	vueFlowInstance.fitView()
})

onNodeDragStop(({ event, nodes, node }) => {
	console.log('Node Drag Stop', { event, nodes, node })
})

onConnect((connection) => {
	addEdges(connection)
})

async function cycleDirection() {
	let newDirIndex = -1
	const currentDirIndex = directions.indexOf(currentDirection)
	if (currentDirIndex < 0) {
		newDirIndex = 0
	}

	newDirIndex = (currentDirIndex + 1) % directions.length
	currentDirection = directions[newDirIndex]
	const newNodes = layout(props.nodes, props.edges, currentDirection)
	nodes.value = newNodes
	console.debug({ level: 'debug', msg: 'changed direction', currentDirection })

	await nextTick()
	fitView()
}

function logToObject() {
	console.log(toObject())
}

function resetTransform() {
	setViewport({ x: 0, y: 0, zoom: 1 })
}

function toggleDarkMode() {
	dark.value = !dark.value
}
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';
</style>
