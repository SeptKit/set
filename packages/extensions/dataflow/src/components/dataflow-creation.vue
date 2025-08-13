<template>
	<dialog class="modal" :open="isOpen">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Create Connection</h3>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Dataflow Type</legend>
				<select
					required
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
				<select required disabled class="select" v-model="dataflowToCreate.sourceLNodeId">
					<option :value="sourceLNode.id">{{ sourceLNode.name }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Signal (DO)</legend>
				<select
					required
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
				<select required class="select" v-model="dataflowToCreate.attribute">
					<option v-for="attribute of attributeOptions" :key="attribute" :value="attribute">
						{{ attribute }}
					</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset">
				<legend class="fieldset-legend font-extrabold">Destination</legend>
				<select required disabled class="select" v-model="dataflowToCreate.destinationLNodeId">
					<option :value="destinationLNode.id">{{ destinationLNode.name }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Destination Input Name</legend>
				<input
					required
					type="text"
					placeholder="Input Name"
					class="input"
					v-model="dataflowToCreate.destinationInputName"
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Input Instance</legend>
				<input
					required
					disabled
					type="text"
					placeholder="Input Name"
					class="input"
					v-model="dataflowToCreate.inputInstance"
				/>
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
import type { DatabaseRecord, Relationship } from '@septkit/fileio'
import { openDatabase } from '../assets/openDb'

const props = defineProps<{
	sourceLNode: LNode
	destinationLNode: LNode
	isOpen: boolean
}>()

const emit = defineEmits<{
	(e: 'update:isOpen', isOpenValue: boolean): void
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

watch(
	() => dataflowToCreate.value.destinationInputName,
	() => {
		dataflowToCreate.value.inputInstance = '1'
	},
)

watch(
	() => dataflowToCreate.value.type,
	() => {
		switch (dataflowToCreate.value.type) {
			case DataflowType.GOOSE:
			case DataflowType.SMV:
				dataflowToCreate.value.includeQuality = true
				dataflowToCreate.value.includeTimestamp = false
				break
			case DataflowType.REPORTING:
				dataflowToCreate.value.includeQuality = true
				dataflowToCreate.value.includeTimestamp = true
				break
			default:
				dataflowToCreate.value.includeQuality = false
				dataflowToCreate.value.includeTimestamp = false
		}
	},
)

function resetFields(
	fieldNames: Exclude<keyof DataflowCreationType, 'type' | 'includeQuality' | 'includeTimestamp'>[],
) {
	for (const fieldName of fieldNames) {
		dataflowToCreate.value[fieldName] = ''
	}
}

function closeModal() {
	resetForm()
	emit('update:isOpen', false)
}

// TODO: extract to smaller functions
async function createConnection() {
	if (!validateDataflowToCreate()) {
		return
	}

	console.log('Creating connection with data:', dataflowToCreate.value)

	const activeFile = localStorage.getItem('currentActiveFileDatabaseName')
	if (!activeFile) {
		throw new Error('no active file')
	}

	const fileDb = await openDatabase(activeFile)

	const lNodeRecord = await fileDb
		.table<DatabaseRecord>('LNode')
		.get({ id: props.destinationLNode.id })

	if (!lNodeRecord || !lNodeRecord.children || lNodeRecord.children.length == 0) {
		console.error(`LNode with id ${props.destinationLNode.id} not found or empty`)
		return
	}

	const privateRecord = await fileDb
		.table<DatabaseRecord>(lNodeRecord.children[0].tagName)
		.get({ id: lNodeRecord.children[0].id })

	if (!privateRecord || !privateRecord.children || privateRecord.children.length == 0) {
		console.error(`Private element with id ${lNodeRecord.children[0].id} not found or empty`)
		return
	}

	let lNodeInputsElement: Relationship | null = null

	for (const childElement of privateRecord.children) {
		if (childElement.tagName == 'LNodeInputs') {
			lNodeInputsElement = childElement
			break
		}
	}

	if (lNodeInputsElement) {
		const lNodeInputsRecord = await fileDb
			.table<DatabaseRecord>(lNodeInputsElement.tagName)
			.get({ id: lNodeInputsElement.id })

		if (!lNodeInputsRecord) {
			console.error(`LNodeInputs element with id ${lNodeInputsElement.id} not found`)
			return
		}

		const recordToAdd: DatabaseRecord = {
			id: crypto.randomUUID(),
			tagName: 'SourceRef',
			namespace: lNodeInputsRecord.namespace,
			attributes: [
				{
					name: 'input',
					value: dataflowToCreate.value.destinationInputName,
				},
				{
					name: 'inputInst',
					value: dataflowToCreate.value.inputInstance,
				},
				{
					name: 'service',
					value: findDataflowTypeLabelByValue(dataflowToCreate.value.type as DataflowType),
				},
				{
					name: 'sourceLNodeUuid',
					value: props.sourceLNode.uuid,
				},
				{
					name: 'sourceDoName',
					value: dataflowToCreate.value.signal,
				},
				{
					name: 'sourceDaName',
					value: dataflowToCreate.value.attribute, // TODO: in the example SSD this was a combination fo SDS and DA name
				},
				// TODO resourceName, source, pDO, pLN, pDA, uuid, templateUUID attributes
			],
			parent: {
				tagName: lNodeInputsRecord.tagName,
				id: lNodeInputsRecord.id,
			},
			value: null,
			children: null,
		}

		// Add SourceRef records for new connection
		const addedId = await fileDb.table<DatabaseRecord>('SourceRef').add(recordToAdd)
		// TODO: add additional SourceRef for t and q if needed#

		console.log('Added SourceRef with ID:', addedId.toString())

		if (lNodeInputsRecord.children == null) {
			lNodeInputsRecord.children = []
		}

		// Add SourceRef elements as a child to the LNodeInputs element
		lNodeInputsRecord.children?.push({
			id: addedId.toString(),
			tagName: 'SourceRef',
		})

		await fileDb
			.table<DatabaseRecord>(lNodeInputsRecord.tagName)
			.update(lNodeInputsRecord.id, { children: lNodeInputsRecord.children })
	}

	// TODO: handle if LNodeInputsElement is not found

	fileDb.close()

	closeModal()
}

function validateDataflowToCreate(): boolean {
	if (!dataflowToCreate.value.type) {
		alert('Please select a dataflow type.')
		return false
	}
	if (!dataflowToCreate.value.signal) {
		alert('Please select a signal (DO).')
		return false
	}
	if (!dataflowToCreate.value.attribute) {
		alert('Please select an attribute (DA).')
		return false
	}
	if (!dataflowToCreate.value.destinationInputName) {
		alert('Please enter a destination input name.')
		return false
	}
	return true
}

function findDataflowTypeLabelByValue(dataflowType: DataflowType): string {
	return dataflowTypes.find((type) => type.value === dataflowType)?.label ?? ''
}

function resetForm() {
	dataflowToCreate.value = getDataflowToCreateDefault()
}
</script>

<style scoped></style>
