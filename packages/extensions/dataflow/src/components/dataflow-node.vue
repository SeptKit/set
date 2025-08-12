<!-- dataflow-node.vue -->

<template>
	<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			position: relative;
		"
	>
		<!-- Dropdown -->
		<div class="dataflow-dropdown" style="margin-bottom: 20px">
			<Dropdown>
				<template #label>
					{{ activeLNode ? activeLNode.name : 'Select LNode' }}
				</template>
				<template #items>
					<li
						v-for="ln in lnodes"
						:key="ln.name"
						@click="selectLNode(ln)"
						style="cursor: pointer; padding: 4px 12px"
					>
						{{ ln.name }}
					</li>
				</template>
			</Dropdown>
		</div>

		<!-- LNode card -->
		<div
			class="dataflow-node"
			style="
				width: 240px;
				height: 400px;
				background-color: orange;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				border-radius: 16px;
			"
		>
			<!-- Title -->
			<div
				style="
					width: 100%;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					padding: 20px 0 10px 0;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
					background: transparent;
				"
			>
				{{ activeLNode ? activeLNode.name : 'Logical Node' }}
			</div>

			<!-- Ports LEFT (output) -->
			<template v-if="type === 'output' && activeLNode">
				<div
					v-for="(port, idx) in activeLNode.destinationPorts"
					:key="idx"
					:style="getPortPositionStyle(idx, activeLNode.destinationPorts.length, 'left')"
					style="position: absolute; display: flex; align-items: center"
				>
					<div
						style="
							width: 18px;
							height: 18px;
							border-radius: 50%;
							background: #111;
							margin-right: 8px;
						"
					></div>
					<div style="font-size: 15px; white-space: nowrap; text-align: left">
						{{ getDestPortLabel(port) }}
					</div>
				</div>
			</template>

			<!-- Ports RIGHT (input) -->
			<template v-if="type === 'input' && activeLNode">
				<div
					v-for="(port, idx) in activeLNode.sourcePorts"
					:key="idx"
					:style="getPortPositionStyle(idx, activeLNode.sourcePorts.length, 'right')"
					style="position: absolute; display: flex; align-items: center"
				>
					<div style="font-size: 15px; white-space: nowrap; text-align: right; margin-right: 8px">
						{{ getSourcePortLabel(port) }}
					</div>
					<div style="width: 18px; height: 18px; border-radius: 50%; background: #111"></div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { Dropdown } from '@septkit/ui'
import type { LNodeObject } from '../assets/lnode.types'

const props = defineProps<{
	lnodes: LNodeObject[]
	type: 'input' | 'output'
}>()

const emit = defineEmits<{
	(e: 'update:activeLNode', value: LNodeObject | null): void
}>()

const activeLNode = ref<LNodeObject | null>(null)
function selectLNode(ln: LNodeObject) {
	activeLNode.value = ln
	emit('update:activeLNode', ln)
}

function getSourcePortLabel(port: any) {
	return `${port.do || 'DO'}.${port.da || 'DA'}`
}
function getDestPortLabel(port: any) {
	return `${port.destinationInputName || 'IN'}.${port.inputInstance ?? ''}`
}

// Returns an inline style that absolutely positions each port with even vertical spacing.
// `side` is 'left' or 'right'
function getPortPositionStyle(idx: number, total: number, side: 'left' | 'right') {
	const nodeHeight = 400
	const portHeight = 24 // render "zone"
	const paddingTop = 60
	const availableSpace = nodeHeight - 2 * paddingTop
	const spacing = total > 1 ? availableSpace / (total - 1) : 0
	const top = paddingTop + spacing * idx - portHeight / 2

	return {
		[side]: '-8px', //not final
		top: `${top}px`,
		height: `${portHeight}px`,
		zIndex: 1,
	}
}
</script>

<style scoped>
.dataflow-dropdown {
}
.dataflow-node {
}
</style>
