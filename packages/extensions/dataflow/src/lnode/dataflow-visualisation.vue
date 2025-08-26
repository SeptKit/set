<template>
	<div
		class="grid grid-cols-[1fr_20px_1fr_20px_1fr] w-full min-h-[500px] mb-8"
		:style="{ gridTemplateRows: `100px repeat(${filteredConnections.length + 1}, 50px)` }"
	>
		<!-- Left LNode Background -->
		<div
			class="col-start-1 col-span-2 row-span-full bg-(--color-ocean-gray-50) relative rounded-3xl -z-1 border-(--color-ocean-gray-100) border-3 min-h-[500px]"
		></div>

		<!-- Left LNode Select -->
		<select
			:value="sourceLNodeId ?? ''"
			@change="(e) => onSourceLNodeSelect((e.target as HTMLSelectElement).value)"
			data-testid="select-source-lnode"
			class="col-start-1 col-span-2 self-center justify-self-center row-start-1 text-2xl text-center"
		>
			>
			<option key="null" value="">Select LNode</option>
			<option v-for="ln in lnodes" :key="ln.id" :value="ln.id">
				{{ getLNodeLabel(ln) }}
			</option>
		</select>

		<!-- Right LNode Background -->
		<div
			class="col-start-4 col-span-2 row-span-full bg-(--color-ocean-gray-50) relative rounded-3xl -z-1 border-(--color-ocean-gray-100) border-3 min-h-[500px]"
		></div>

		<!-- Right LNode Select -->
		<select
			:value="destinationLNodeId ?? ''"
			@change="(e) => onDestinationLNodeSelect((e.target as HTMLSelectElement).value)"
			data-testid="select-destination-lnode"
			class="col-start-4 col-span-2 self-center justify-self-center row-start-1 text-2xl text-center"
		>
			<option key="null" value="">Select LNode</option>
			<option v-for="ln in lnodes" :key="ln.id" :value="ln.id">
				{{ getLNodeLabel(ln) }}
			</option>
		</select>

		<template v-for="(connection, idx) of filteredConnections">
			<!-- Left Port Label -->
			<div
				class="col-start-1 col-span-1 self-center justify-self-end"
				:style="{ gridRowStart: idx + 2 }"
			>
				<span class="border-2 border-(--color-ocean-gray-100) px-2 py-1 mr-2 rounded-sm">{{
					connection.sourceDataObject
				}}</span>
				<span class="border-2 border-(--color-ocean-gray-100) px-2 py-1 rounded-sm">{{
					connection.sourceDataAttribute
				}}</span>
			</div>

			<!-- Left LNode Port -->
			<div
				class="rounded-full w-[20px] h-[20px] col-start-2 col-span-1 bg-(--color-ocean-gray-100) self-center justify-self-end -mr-[9px]"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<!-- Dataflow Line -->
			<div
				class="col-start-3 col-span-1 h-[2px] bg-(--color-ocean-gray-100) self-center"
				:style="{ gridRowStart: idx + 2 }"
				:data-testid="`dataflow-line-${idx}`"
			></div>
			<svg
				height="12"
				width="8"
				class="col-start-3 col-span-1 self-center justify-self-end mr-[9px]"
				:style="{ gridRowStart: idx + 2 }"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polygon points="0,0 8,6 0,12" :style="{ fill: 'var(--color-ocean-gray-100)' }" />
			</svg>

			<!-- Dataflow Line Label -->
			<div
				class="bg-(--color-chart-3) text-white col-start-3 self-center justify-self-center z-1 relative p-1 rounded-sm text-sm"
				:style="{ gridRowStart: idx + 2 }"
			>
				{{ connection.dataflowType }}
			</div>

			<!-- Right LNode Port -->
			<div
				class="rounded-full w-[20px] h-[20px] col-start-4 col-span-1 bg-(--color-ocean-gray-100) self-center justify-self-start -ml-[9px]"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<!-- Right Port Label -->
			<div
				class="col-start-5 col-span-1 self-center justify-self-start"
				:style="{ gridRowStart: idx + 2 }"
			>
				<span class="border-2 border-(--color-ocean-gray-100) px-2 py-1 mr-2 rounded-sm">{{
					connection.input
				}}</span>
				<span class="border-2 border-(--color-ocean-gray-100) px-2 py-1 rounded-sm">{{
					connection.inputInstance
				}}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getLNodeLabel, type LNode } from './lnode'
import type { Connection } from './connection'

const emit = defineEmits<{
	(e: 'sourceLNodeChange', value: string | undefined): void
	(e: 'destinationLNodeChange', value: string | undefined): void
}>()

const props = defineProps<{
	lnodes: LNode[]
	connections: Connection[]
}>()

watch(
	() => props.lnodes,
	() => {
		sourceLNodeId.value = undefined
		destinationLNodeId.value = undefined
	},
)

const sourceLNodeId = ref<string | undefined>()
const destinationLNodeId = ref<string | undefined>()

const filteredConnections = computed(() => {
	if (sourceLNodeId.value && destinationLNodeId.value) {
		return props.connections.filter(
			(c) =>
				c.sourceLNodeId === sourceLNodeId.value &&
				c.destinationLNodeId === destinationLNodeId.value,
		)
	}
	return []
})

function onSourceLNodeSelect(lnodeId: string) {
	sourceLNodeId.value = lnodeId
	emit('sourceLNodeChange', lnodeId)
}

function onDestinationLNodeSelect(lnodeId: string) {
	destinationLNodeId.value = lnodeId
	emit('destinationLNodeChange', lnodeId)
}
</script>
