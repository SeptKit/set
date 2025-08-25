<template>
	<div
		class="grid grid-cols-[1fr_20px_1fr_20px_1fr] w-full"
		:style="{ gridTemplateRows: `100px repeat(${filteredConnections.length + 1}, 50px)` }"
	>
		<div
			class="col-start-1 col-span-2 row-span-full bg-(--color-ocean-gray-50) relative rounded-3xl -z-1 border-(--color-ocean-gray-100) border-3"
		></div>

		<div
			class="col-start-1 col-span-2 self-center justify-self-center row-start-1 rounded-md border-2 border-(--color-ocean-gray-100) px-3 py-2 bg-white"
		>
			<select
				:value="sourceLNodeId ?? ''"
				@change="(e) => onSourceLNodeSelect((e.target as HTMLSelectElement).value)"
				data-testid="select-source-lnode"
			>
				<option key="null" value="">Select LNode</option>
				<option v-for="ln in lnodes" :key="ln.id" :value="ln.id">
					{{ getLNodeLabel(ln) }}
				</option>
			</select>
		</div>

		<div
			class="col-start-4 col-span-2 row-span-full bg-(--color-ocean-gray-50) relative rounded-3xl -z-1 border-(--color-ocean-gray-100) border-3"
		></div>

		<div
			class="col-start-4 col-span-2 self-center justify-self-center row-start-1 rounded-md border-2 border-(--color-ocean-gray-100) px-3 py-2 bg-white"
		>
			<select
				:value="destinationLNodeId ?? ''"
				@change="(e) => onDestinationLNodeSelect((e.target as HTMLSelectElement).value)"
				data-testid="select-destination-lnode"
			>
				<option key="null" value="">Select LNode</option>
				<option v-for="ln in lnodes" :key="ln.id" :value="ln.id">
					{{ getLNodeLabel(ln) }}
				</option>
			</select>
		</div>

		<template v-for="(connection, idx) of filteredConnections">
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

			<div
				class="rounded-full w-[20px] h-[20px] col-start-2 col-span-1 bg-(--color-ocean-gray-100) self-center justify-self-end -mr-[9px]"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<div
				class="col-start-3 col-span-1 h-[2px] bg-(--color-ocean-gray-100) self-center"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<div
				class="rounded-full w-[20px] h-[20px] col-start-4 col-span-1 bg-(--color-ocean-gray-100) self-center justify-self-start -ml-[9px]"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<div
				class="bg-(--color-chart-3) text-white col-start-3 self-center justify-self-center z-1 relative p-1 rounded-sm text-sm"
				:style="{ gridRowStart: idx + 2 }"
			>
				{{ connection.dataflowType }}
			</div>

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
import { getLNodeLabel, type LNode } from '@/lnode/lnode'
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

<style>
@import '@/assets/main.css';
</style>
