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
		<div style="margin-bottom: 20px; margin-top: 20px">
			<select
				class="select"
				:value="props.activeLNodeId ?? ''"
				@change="(e) => onSelect((e.target as HTMLSelectElement).value)"
			>
				<option key="null" value="">Select LNode</option>
				<option v-for="ln in lnodes" :key="ln.id" :value="ln.id">
					{{ getLNodeLabel(ln) }}
				</option>
			</select>
		</div>

		<!-- LNode card -->
		<div
			style="
				width: 240px;
				height: 400px;
				background-color: lightgray;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				border-radius: 8px;
			"
		>
			<div
				style="
					width: 100%;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					padding: 10px 0 10px 0;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
					background: transparent;
				"
			>
				{{ activeLNode ? getLNodeLabel(activeLNode) : 'Logical Node' }}
			</div>
			<!-- Ports right (only for input LN) -->
			<template v-if="type === 'input' && activeLNode">
				<div
					v-for="(dataObject, idx) in activeLNode.dataObjects"
					:key="dataObject.id"
					:style="getPortPositionStyle(idx, activeLNode.dataObjects.length, 'right')"
					style="position: absolute; display: flex; align-items: center"
				>
					<div style="font-size: 15px; white-space: nowrap; text-align: right; margin-right: 8px">
						{{ getPortLabel(dataObject) }}
					</div>
					<div style="width: 18px; height: 18px; border-radius: 50%; background: #111"></div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineEmits, computed } from 'vue'
import type { LNode } from '@/lnode/lnode'
import { getLNodeLabel } from '@/lnode/lnode'

const props = defineProps<{
	lnodes: LNode[]
	type: 'input' | 'output'
	activeLNodeId?: string | null
}>()

const emit = defineEmits<{
	(e: 'update:activeLNodeId', value: string | null): void
}>()

const activeLNode = computed(() => props.lnodes.find((ln) => ln.id === props.activeLNodeId) ?? null)

function onSelect(lnodeId: string) {
	emit('update:activeLNodeId', lnodeId)
}

// Get the label for the port (e.g., "DataObject.Name.DataAttribute.Name")
function getPortLabel(dataObject: any): string {
	const daNames = (dataObject.dataAttributes ?? []).map((da: any) => da.name)
	return [dataObject.name, ...daNames].join('.')
}

function getPortPositionStyle(idx: number, total: number, side: 'left' | 'right') {
	const nodeHeight = 400
	const portHeight = 24
	const paddingTop = 60
	const availableSpace = nodeHeight - 2 * paddingTop
	const spacing = total > 1 ? availableSpace / (total - 1) : 0
	const top = paddingTop + spacing * idx - portHeight / 2

	return {
		[side]: '-8px',
		top: `${top}px`,
		height: `${portHeight}px`,
		zIndex: 1,
	}
}
</script>

<style scoped>
@import '@/assets/main.css';
</style>
