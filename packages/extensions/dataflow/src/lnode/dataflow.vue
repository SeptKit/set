<template>
	<div
		class="grid grid-cols-[1fr_20px_1fr_20px_1fr]"
		:style="{ gridTemplateRows: `100px repeat(${connections.length + 1}, 75px)` }"
	>
		<div
			class="col-start-1 col-span-2 row-span-full bg-gray-100 relative rounded-3xl -z-1 border-gray-200 border-3"
		></div>

		<select
			class="col-start-1 col-span-2 self-center justify-self-center row-start-1 rounded-md border-2 border-gray-200 px-3 py-2 bg-white"
			:value="activeInputLNodeId ?? ''"
			@change="(e) => onSelect((e.target as HTMLSelectElement).value)"
		>
			<option key="null" value="">Select LNode</option>
			<option v-for="ln in lNodes" :key="ln.id" :value="ln.id">
				{{ getLNodeLabel(ln) }}
			</option>
		</select>

		<div
			class="col-start-4 col-span-2 row-span-full bg-gray-100 relative rounded-3xl -z-1 border-gray-200 border-2"
		></div>

		<select
			class="col-start-4 col-span-2 self-center justify-self-center row-start-1 rounded-md border-2 border-gray-200 px-3 py-2 bg-white"
			:value="activeOutputLNodeId ?? ''"
			@change="(e) => onSelect((e.target as HTMLSelectElement).value)"
		>
			<option key="null" value="">Select LNode</option>
			<option v-for="ln in lNodes" :key="ln.id" :value="ln.id">
				{{ getLNodeLabel(ln) }}
			</option>
		</select>

		<template v-for="(connection, idx) of connections">
			<div
				class="col-start-1 col-span-1 self-center justify-self-end"
				:style="{ gridRowStart: idx + 2 }"
			>
				<span class="border-2 border-gray-200 px-2 py-1 mr-2 rounded-sm">{{
					connection.sourceDataObject
				}}</span>
				<span class="border-2 border-gray-200 px-2 py-1 rounded-sm">{{
					connection.sourceDataAttribute
				}}</span>
			</div>

			<div
				class="rounded-full w-[20px] h-[20px] col-start-2 col-span-1 bg-gray-200 self-center justify-self-end -mr-[9px]"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<div
				class="col-start-3 col-span-1 h-[2px] bg-gray-200 self-center"
				:style="{ gridRowStart: idx + 2 }"
			></div>

			<div
				class="rounded-full w-[20px] h-[20px] col-start-4 col-span-1 bg-gray-200 self-center justify-self-start -ml-[9px]"
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
				<span class="border-2 border-gray-200 px-2 py-1 mr-2 rounded-sm">{{
					connection.input
				}}</span>
				<span class="border-2 border-gray-200 px-2 py-1 rounded-sm">{{
					connection.inputInstance
				}}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getLNodeLabel, type LNode } from '@/lnode/lnode'
import type { SDKs } from '@/app.vue'
import type { Connection } from './connection'

const props = defineProps<{
	sdks: SDKs | undefined
}>()

const activeInputLNodeId = ref<string | undefined>()
const activeOutputLNodeId = ref<string | undefined>()
const lNodes = ref<LNode[]>([])
const connections = ref<Connection[]>([])

watch(
	() => props.sdks,
	() => {
		initLnodes()
		initConnections()
	},
	{ immediate: true },
)

async function initLnodes() {
	if (!props.sdks) {
		return
	}
	lNodes.value = await props.sdks.lnodeSDK.findAllEnrichedFromDB()
}

async function initConnections() {
	if (!props.sdks) {
		return
	}
	connections.value = await props.sdks.connectionSDK.findAllExistingFromDB()
}

function onSelect(lnodeId: string) {
	console.log('change', lnodeId) // TODO
}
</script>

<style>
@import '@/assets/main.css';
</style>
