<template>
	<div class="node-element-root">
		<div class="node-element-select-row">
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
		<div class="node-element-card">
			<div class="node-element-card-title">
				{{ activeLNode ? getLNodeLabel(activeLNode) : 'Logical Node' }}
			</div>
			<!-- Ports right (only for input LN, only with subscriberLNode) -->
			<template v-if="type === 'input' && activeLNode && activeLNode.dataObjectSpecifications">
				<div v-for="(dos, dosIdx) in activeLNode.dataObjectSpecifications" :key="dos.id">
					<!-- Filter specs: only DAS with subscriberLNode -->
					<template
						v-for="(das, idx) in dos.dataAttributeSpecification.filter((d) => d.subscriberLNode)"
						:key="das.id"
					>
						<div
							:style="
								getPortPositionStyle(portIdx(dosIdx, idx), getPortCount(activeLNode), 'right')
							"
							class="node-element-port-row"
						>
							<div class="node-element-port-label">{{ dos.name }}.{{ das.name }}</div>
							<div class="node-element-port-dot"></div>
						</div>
					</template>
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
	activeLNodeId?: string
}>()

const emit = defineEmits<{
	(e: 'change', value: string | undefined): void
}>()

const activeLNode = computed(() => props.lnodes.find((ln) => ln.id === props.activeLNodeId))

function onSelect(lnodeId: string) {
	emit('change', lnodeId)
}

function getPortCount(lnode: LNode): number {
	// only DOS.DAS with subscriberLNode
	return (
		lnode.dataObjectSpecifications?.reduce(
			(count, dos) =>
				count +
				(dos.dataAttributeSpecification?.filter((das) => !!das.subscriberLNode).length ?? 0),
			0,
		) ?? 0
	)
}

// Port-Index-Function
function portIdx(dosIdx: number, dasIdx: number) {
	let idx = 0
	if (!activeLNode.value?.dataObjectSpecifications) return 0
	for (let i = 0; i < dosIdx; i++) {
		idx += activeLNode.value.dataObjectSpecifications[i].dataAttributeSpecification.filter(
			(das: any) => !!das.subscriberLNode,
		).length
	}
	return idx + dasIdx
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

.node-element-root {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	position: relative;
}
.node-element-select-row {
	margin-bottom: 20px;
	margin-top: 20px;
}
.node-element-card {
	width: 240px;
	height: 400px;
	background-color: lightgray;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	border-radius: 8px;
}
.node-element-card-title {
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
}
.node-element-port-row {
	position: absolute;
	display: flex;
	align-items: center;
}
.node-element-port-label {
	font-size: 15px;
	white-space: nowrap;
	text-align: right;
	margin-right: 8px;
}
.node-element-port-dot {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: #111;
}
</style>
