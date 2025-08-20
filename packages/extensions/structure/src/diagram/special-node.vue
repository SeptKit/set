<template>
	<div class="vue-flow__node-default" name="special-node">
		<div>{{ data.label }}</div>

		<div>{{ x }} {{ y }}</div>

		<Handle type="source" :position="Position.Bottom" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Position, Handle } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'

const props = defineProps<NodeProps>()

const x = computed(() => `${Math.round(props.position.x)}px`)
const y = computed(() => `${Math.round(props.position.y)}px`)
</script>
