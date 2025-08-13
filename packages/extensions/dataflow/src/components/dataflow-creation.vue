<template>
	<button class="btn" @click="showModal">+</button>
	<dialog class="modal" :open="isOpen">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Create Connection</h3>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Dataflow Type</legend>
				<select
					class="select"
					v-model="dataflowToCreate.type"
					@change="resetFields(['signal', 'attribute'])"
				>
					<option v-for="type in dataflowTypes" :key="type.value" :value="type.value">
						{{ type.label }}
					</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset">
				<legend class="fieldset-legend font-extrabold">Source</legend>
				<select disabled class="select" v-model="dataflowToCreate.sourceLNodeId">
					<option :value="sourceLNode.id">{{ sourceLNode.name }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Signal (DO)</legend>
				<select
					class="select"
					v-model="dataflowToCreate.signal"
					@change="resetFields(['attribute'])"
				>
					<option v-for="signal of signalOptions" :key="signal" :value="signal">
						{{ signal }}
					</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Attribute (DA)</legend>
				<select class="select" v-model="dataflowToCreate.attribute">
					<option v-for="attribute of attributeOptions" :key="attribute" :value="attribute">
						{{ attribute }}
					</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset">
				<legend class="fieldset-legend font-extrabold">Destination</legend>
				<select disabled class="select" v-model="dataflowToCreate.destinationLNodeId">
					<option :value="destinationLNode.id">{{ destinationLNode.name }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Destination Input Name</legend>
				<input
					type="text"
					placeholder="Input Name"
					class="input"
					v-model="dataflowToCreate.destinationInputName"
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Input Instance</legend>
				<select class="select" v-model="dataflowToCreate.inputInstance">
					<option key="instance1" value="instance1">Instance1</option>
					<option key="instance2" value="instance2">Instance2</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
				<legend></legend>
				<label class="label">
					<input type="checkbox" v-model="dataflowToCreate.includeQuality" class="checkbox" />
					Include Quality
				</label>
			</fieldset>

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
				<legend></legend>
				<label class="label">
					<input type="checkbox" v-model="dataflowToCreate.includeTimestamp" class="checkbox" />
					Include Timestamp
				</label>
			</fieldset>

			<hr class="solid" />

			<div class="modal-action">
				<button class="btn" @click="closeModal">Close</button>
				<button class="btn" @click="createConnection">Create Connection</button>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DataflowType, DataflowTypeToFCMap } from '@/types/connection'
import type { LNode } from '@/types/lnode'

const props = defineProps<{
	sourceLNode: LNode
	destinationLNode: LNode
}>()

const dataflowTypes = [
	{
		label: 'Goose',
		value: DataflowType.GOOSE,
	},
	{
		label: 'SMV',
		value: DataflowType.SMV,
	},
	{
		label: 'Reporting',
		value: DataflowType.REPORTING,
	},
	{
		label: 'Internal',
		value: DataflowType.INTERNAL,
	},
	{
		label: 'Wired',
		value: DataflowType.WIRED,
	},
	{
		label: 'Control',
		value: DataflowType.CONTROL,
	},
] as const

type DataflowCreationType = {
	type: DataflowType | null
	sourceLNodeId: string
	sourceLNodeName: string
	signal: string
	attribute: string
	destinationLNodeId: string
	destinationLNodeName: string
	destinationInputName: string
	inputInstance: string
	includeQuality: boolean
	includeTimestamp: boolean
}

const isOpen = ref(false)

const getDataflowToCreateDefault: () => DataflowCreationType = () => ({
	type: null,
	sourceLNodeId: props.sourceLNode.id,
	sourceLNodeName: props.sourceLNode.name,
	signal: '',
	attribute: '',
	destinationLNodeId: props.destinationLNode.id,
	destinationLNodeName: props.destinationLNode.name,
	destinationInputName: '',
	inputInstance: '',
	includeQuality: false,
	includeTimestamp: false,
})

const dataflowToCreate = ref<DataflowCreationType>(getDataflowToCreateDefault())

const signalOptions = computed<string[]>(() => {
	if (!dataflowToCreate.value.type) return []
	return props.sourceLNode.dataObjects
		.filter((doObj) =>
			doObj.dataAttributes.some((attr) =>
				DataflowTypeToFCMap[dataflowToCreate.value.type as DataflowType].includes(attr.fc),
			),
		)
		.map((doObj) => doObj.name)
})

const attributeOptions = computed(() => {
	if (!dataflowToCreate.value.type) return []
	console.log(
		props.sourceLNode.dataObjects
			.find((doObj) => doObj.name === dataflowToCreate.value.signal)
			?.dataAttributes.filter((attr) =>
				DataflowTypeToFCMap[dataflowToCreate.value.type as DataflowType].includes(attr.fc),
			)
			.map((attr) => attr.name),
	)
	return (
		props.sourceLNode.dataObjects
			.find((doObj) => doObj.name === dataflowToCreate.value.signal)
			?.dataAttributes.filter((attr) =>
				DataflowTypeToFCMap[dataflowToCreate.value.type as DataflowType].includes(attr.fc),
			)
			.map((attr) => attr.name) || []
	)
})

watch(
	() => dataflowToCreate.value.signal,
	(newSignal, _) => {
		dataflowToCreate.value.destinationInputName = newSignal
	},
)

function resetFields(
	fieldNames: Exclude<keyof DataflowCreationType, 'type' | 'includeQuality' | 'includeTimestamp'>[],
) {
	for (const fieldName of fieldNames) {
		dataflowToCreate.value[fieldName] = ''
	}
}

function showModal() {
	isOpen.value = true
}

function closeModal() {
	resetForm()
	isOpen.value = false
}

function createConnection() {
	// TODO: Logic to create the connection
	console.log('Creating connection with data:', dataflowToCreate.value)
	closeModal()
}

function resetForm() {
	dataflowToCreate.value = getDataflowToCreateDefault()
}
</script>

<style scoped></style>
