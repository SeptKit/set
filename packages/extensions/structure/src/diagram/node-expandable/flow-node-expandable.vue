<template>
	<div class="node-root" name="expandable-node" :title="title" :style="style">
		<div v-if="!props.data.isExpanded" class="collapsed">
			<div class="header">
				<div class="node-label">{{ props.data.label }}</div>
				<span class="toggle-icon">
					<IconCollapsed v-if="props.data.hasChildren" @click="emitExpand" />
				</span>
			</div>
		</div>

		<div v-if="props.data.isExpanded" class="expanded">
			<div class="header">
				<div class="node-label">{{ props.data.label }}</div>
				<span class="toggle-icon">
					<IconExpanded v-if="props.data.hasChildren" @click="emitCollapse" />
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { computed } from 'vue'
import IconCollapsed from './icon-collapsed.vue'
import IconExpanded from './icon-expanded.vue'

const props = defineProps<NodeProps>()
const emits = defineEmits<{
	(e: 'expand', node: NodeProps): void
	(e: 'collapse', id: string): void
}>()

function emitExpand() {
	emits('expand', props)
}
function emitCollapse() {
	emits('collapse', props.id)
}

const style = computed(() => ({ width: `${props.data.width}px`, height: `${props.data.height}px` }))
const title = computed(() => `${props.data.tagName}: ${props.data.label}`)
</script>

<style scoped>
.node-root {
	cursor: default;
	border-radius: 4px;
	border: 1px solid var(--color-ocean-gray-200);
	background: var(--color-ocean-gray-50);

	/* shadow/base */
	box-shadow:
		0 1px 3px 0 rgba(14, 14, 14, 0.1),
		0 1px 2px 0 rgba(0, 0, 0, 0.06);

	transition:
		border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-root:hover {
	border: 1px solid var(--color-chart-9);
}

.node-root:hover .header {
	background: #e6f0f2;
}

.header {
	padding: 0rem 0.5rem;
	font-size: 1rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	background: var(--color-base-200);

	display: grid;
	grid-template-columns: 1fr 24px;
	place-items: center;
	transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapsed {
	height: 100%;
}

.collapsed .header {
	height: 100%;
	border-radius: 4px;
}

.expanded .header {
	border-bottom: 1px solid var(--color-base-300);
	border-radius: 4px 4px 0 0;
	padding: 0.5rem;
}

.toggle-icon {
	cursor: pointer;
}

.node-label {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 100%;
}
</style>
