<template>
	<div>
		<Dropdown>
			<template>
				<dropdown>
					<template #label>Click me</template>
					<template #items>
						<li>Item 1</li>
						<li>Item 2</li>
					</template>
				</dropdown>
			</template>
		</Dropdown>
		<Dropdown>
			<template>
				<dropdown>
					<template #label>Click me</template>
					<template #items>
						<li>Item 1</li>
						<li>Item 2</li>
					</template>
				</dropdown>
			</template>
		</Dropdown>
	</div>
	<!-- LNs -->
	<div style="width: 100%; height: 500px; position: relative">
		<VueFlow
			v-model="elements"
			:fit-view-on-init="false"
			:nodes-draggable="false"
			:node-types="nodeTypes"
			:extent="'parent'"
			style="width: 100%; height: 100%"
		>
			<Background pattern-color="light-grey" :gap="16" />
		</VueFlow>
	</div>
	<button>end</button>
</template>

<script setup lang="ts">
/*
	-dropdowns for selecting LNs (props: xml?, callback: activeLN?)
	-2x LN (props: visible?, label, portsSide, ports: [], )
	-Button (+), visible?
*/

import { Dropdown } from '@septkit/ui'
import customNode from './custom-node.vue'
import { ref } from 'vue'
import { VueFlow, type NodeTypesObject } from '@vue-flow/core'
import { Background } from '@vue-flow/background'

const props = defineProps<{
	api: { [key: string]: any }
}>()

const nodeTypes: NodeTypesObject = { custom: customNode as NodeTypesObject }

const nodeStyles = {
	width: '200px',
	height: '300px',
	border: '2px solid black',
	//zIndex: 10,
	padding: '3px',
}

const elements = ref([
	{
		id: 'a',
		type: 'custom',
		data: { label: 'LNode A' },
		position: { x: 200, y: 0 },
		style: nodeStyles,
	},
	{
		id: 'b',
		type: 'custom',
		data: { label: 'LNode B' },
		position: { x: 600, y: -300 },
		style: nodeStyles,
	},
])
</script>

<style scoped>
@reference "@/assets/main.css";
</style>
