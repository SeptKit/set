<template>
	<VueFlow
		:nodes="nodes"
		:edges="edges"
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

			<ControlButton title="Log `toObject`" @click="logToObject">
				<Icon name="log" />
			</ControlButton>
		</Controls>
	</VueFlow>
</template>

<script setup lang="ts">
import { nextTick, watchEffect } from 'vue'
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { ControlButton, Controls } from '@vue-flow/controls'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import Icon from './icon.vue'
import { useLayout } from './layout'

const props = defineProps<{
	nodes: Node[]
	edges: Edge[]
}>()

const { calcLayout } = useLayout()
const {
	onInit,
	onNodeDragStop,
	onConnect,
	addEdges,
	setViewport,
	toObject,
	setEdges,
	setNodes,
	fitView,
} = useVueFlow()

watchEffect(async () => {
	const newNodes = await calcLayout(props.nodes, props.edges)
	setNodes(newNodes)
	await nextTick()
	fitView()
})

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

function logToObject() {
	console.log(toObject())
}

function resetTransform() {
	setViewport({ x: 0, y: 0, zoom: 1 })
}
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';
</style>
