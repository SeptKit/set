<template>
	<div class="root" name="bay-node" :title="props.data.tagName" :style="style">
		<div class="header">
			<div>{{ props.data.label }}</div>
			<span class="close-icon">
				<IconClosed v-if="props.data.hasChildren && props.data.isOpen" @click="onIconClick" />
				<IconOpened v-if="props.data.hasChildren && !props.data.isOpen" @click="onIconClick" />
			</span>
		</div>
		<div class="body"></div>
	</div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { computed } from 'vue'
import IconClosed from './icon-closed.vue'
import IconOpened from './icon-opened.vue'

const props = defineProps<NodeProps>()
const emits = defineEmits<{
	(e: 'expand', node: NodeProps): void
	(e: 'collapse', id: string): void
}>()

function onIconClick() {
	emits('expand', props)
}

const style = computed(() => ({ width: `${props.data.width}px`, height: `${props.data.height}px` }))
</script>

<style scoped>
.root {
	border-radius: 4px;
	border: 1px solid var(--color-ocean-gray-200);
	background: var(--color-ocean-gray-50);

	/* shadow/base */
	box-shadow:
		0 var(--shadow-y-axis-base-1, 1px) var(--shadow-blur-base-1, 3px) var(--shadow-spread-base, 0)
			var(--shadow-color-opacity-2, rgba(14, 14, 14, 0.1)),
		0 var(--shadow-y-axis-base-1, 1px) var(--shadow-blur-base-2, 2px) var(--shadow-spread-base, 0)
			var(--shadow-color-opacity-0, rgba(0, 0, 0, 0.06));
}

.header {
	border-bottom: 1px solid var(--color-base-300);
	background: var(--color-base-200);
	padding: 0.5rem 0.25rem;
	font-size: 1rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	display: grid;
	grid-template-columns: 1fr 24px;
}

.close-icon {
	cursor: pointer;
}
</style>
