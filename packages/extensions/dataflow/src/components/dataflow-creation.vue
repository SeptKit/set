<template>
	<button class="btn" @click="showModal">+</button>
	<dialog class="modal" :open="isOpen">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Create Connection</h3>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Dataflow Type</legend>
				<select class="select" v-model="dataflowToCreate.type">
					<option v-for="type in dataFlowTypes" :key="type.value" :value="type.value">
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
				<select class="select" v-model="dataflowToCreate.signal">
					<option key="signal1" value="signal1">Signal1</option>
					<option key="signal2" value="signal2">Signal2</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Attribute (DA)</legend>
				<select class="select" v-model="dataflowToCreate.attribute">
					<option key="attribute1" value="attribute1">Attribute1</option>
					<option key="attribute2" value="attribute2">Attribute2</option>
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
				<select class="select" v-model="dataflowToCreate.destinationInputName">
					<option key="name1" value="name1">Name1</option>
					<option key="name2" value="name2">Name2</option>
				</select>
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
