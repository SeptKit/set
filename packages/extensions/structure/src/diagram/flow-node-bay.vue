<template>
	<div class="vue-flow__node-default" name="bay-node" :style="style">
		<div>{{ data.label }}</div>
	</div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps<NodeProps>()
console.debug('bay node', { props, style: props.style })

const style = computed(() => ({ width: `${props.data.width}px`, height: `${props.data.height}px` }))
</script>
