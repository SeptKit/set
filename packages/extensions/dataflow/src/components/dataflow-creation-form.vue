<template>
	<dialog class="modal" :open="isOpen">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Create Connection</h3>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Dataflow Type</legend>
				<select
					required
					class="select"
					v-model="dataflowCreationFormFields.type"
					@change="resetFields(['signal', 'attribute'])"
				>
					<option v-for="type in Object.values(DataflowType)" :key="type" :value="type">
						{{ type }}
					</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset">
				<legend class="fieldset-legend font-extrabold">Source</legend>
				<select required disabled class="select" v-model="props.sourceLNode.id">
					<option :value="props.sourceLNode.id">{{ getLNodeLabel(sourceLNode) }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Signal (DO)</legend>
				<select
					required
					class="select"
					v-model="dataflowCreationFormFields.signal"
					@change="resetFields(['attribute'])"
				>
					<option v-for="signal of signalOptions" :key="signal" :value="signal">
						{{ signal }}
					</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Attribute (DA)</legend>
				<select required class="select" v-model="dataflowCreationFormFields.attribute">
					<option v-for="attribute of attributeOptions" :key="attribute" :value="attribute">
						{{ attribute }}
					</option>
				</select>
			</fieldset>

			<hr class="solid" />

			<fieldset class="fieldset">
				<legend class="fieldset-legend font-extrabold">Destination</legend>
				<select required disabled class="select" v-model="props.destinationLNode.id">
					<option :value="props.destinationLNode.id">{{ getLNodeLabel(destinationLNode) }}</option>
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Destination Input Name</legend>
				<input
					required
					type="text"
					placeholder="Input Name"
					class="input"
					v-model="dataflowCreationFormFields.inputName"
				/>
			</fieldset>

			<!-- TODO: This needs to be adapted according to rule defined in issue https://github.com/SeptKit/set/issues/163 -->
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Input Instance</legend>
				<input
					required
					disabled
					type="text"
					placeholder="Input Name"
					class="input"
					v-model="dataflowCreationFormFields.inputInstance"
				/>
			</fieldset>

			<hr class="solid mb-3" />

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4 mb-3">
				<legend></legend>
				<label class="label">
					<input
						type="checkbox"
						v-model="dataflowCreationFormFields.includeQuality"
						class="checkbox"
					/>
					Include Quality
				</label>
			</fieldset>

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4 mb-3">
				<legend></legend>
				<label class="label">
					<input
						type="checkbox"
						v-model="dataflowCreationFormFields.includeTimestamp"
						class="checkbox"
					/>
					Include Timestamp
				</label>
			</fieldset>

			<hr class="solid" />

			<div class="modal-action">
				<button class="btn" @click="closeModal">Close</button>
				<button class="btn" @click="createDataflow">Save</button>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DataflowType, DataflowTypeToFCMap } from '@/types/connection'
import type { LNode } from '@/types/lnode'
import type { DatabaseRecord, Relationship } from '@septkit/fileio'
import { openDatabase } from '../assets/open-db.ts'
import { getLNodeLabel } from '@/types/lnode'

const props = defineProps<{
	sourceLNode: LNode
	destinationLNode: LNode
	isOpen: boolean
}>()

const emit = defineEmits<{
	(e: 'update:isOpen', isOpenValue: boolean): void
}>()

type DataflowCreationForm = {
	type: DataflowType | null
	signal: string
	attribute: string
	inputName: string
	inputInstance: string
	includeQuality: boolean
	includeTimestamp: boolean
}

const getDataflowCreationFormDefaultValues: () => DataflowCreationForm = () => ({
	type: null,
	signal: '',
	attribute: '',
	inputName: '',
	inputInstance: '',
	includeQuality: false,
	includeTimestamp: false,
})

const dataflowCreationFormFields = ref<DataflowCreationForm>(getDataflowCreationFormDefaultValues())

const signalOptions = computed<string[]>(() => {
	if (!dataflowCreationFormFields.value.type) return []
	return props.sourceLNode.dataObjects
		.filter((doObj) =>
			doObj.dataAttributes.some((attr) =>
				DataflowTypeToFCMap[dataflowCreationFormFields.value.type as DataflowType].includes(
					attr.fc,
				),
			),
		)
		.map((doObj) => doObj.name)
})

const attributeOptions = computed(() => {
	if (!dataflowCreationFormFields.value.type) return []

	return (
		props.sourceLNode.dataObjects
			.find((doObj) => doObj.name === dataflowCreationFormFields.value.signal)
			?.dataAttributes.filter((attr) =>
				DataflowTypeToFCMap[dataflowCreationFormFields.value.type as DataflowType].includes(
					attr.fc,
				),
			)
			.filter((attr) => attr.name !== 't' && attr.name !== 'q')
			.map((attr) => attr.name) || []
	)
})

// TODO: This needs to be adapted according to rule defined in issue https://github.com/SeptKit/set/issues/163
watch(
	() => dataflowCreationFormFields.value.signal,
	(newSignal, _) => {
		dataflowCreationFormFields.value.inputName = newSignal
	},
)

// TODO: This needs to be adapted according to rule defined in issue https://github.com/SeptKit/set/issues/163
watch(
	() => dataflowCreationFormFields.value.inputName,
	() => {
		dataflowCreationFormFields.value.inputInstance = '1' // currently hardcoded, needs to be adapted
	},
)

watch(
	() => dataflowCreationFormFields.value.type,
	() => {
		switch (dataflowCreationFormFields.value.type) {
			case DataflowType.GOOSE:
			case DataflowType.SMV:
				dataflowCreationFormFields.value.includeQuality = true
				dataflowCreationFormFields.value.includeTimestamp = false
				break
			case DataflowType.REPORT:
				dataflowCreationFormFields.value.includeQuality = true
				dataflowCreationFormFields.value.includeTimestamp = true
				break
			default:
				dataflowCreationFormFields.value.includeQuality = false
				dataflowCreationFormFields.value.includeTimestamp = false
		}
	},
)

function resetFields(
	fieldNames: Exclude<keyof DataflowCreationForm, 'type' | 'includeQuality' | 'includeTimestamp'>[],
) {
	for (const fieldName of fieldNames) {
		dataflowCreationFormFields.value[fieldName] = ''
	}
}

function closeModal() {
	resetForm()
	emit('update:isOpen', false)
}

// TODO: extract to smaller functions
async function createDataflow() {
	if (!validateDataflowCreationForm()) {
		return
	}

	console.log('Creating dataflow with data:', dataflowCreationFormFields.value)

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
					name: 'pDO',
					value: dataflowCreationFormFields.value.signal,
				},
				{
					name: 'pLN',
					value: props.sourceLNode.lnClass,
				},
				{
					name: 'pDA',
					value: dataflowCreationFormFields.value.attribute,
				},
				{
					name: 'uuid',
					value: crypto.randomUUID(), // TODO: random or generate UUID based on some logic
				},
				{
					name: 'input',
					value: dataflowCreationFormFields.value.inputName,
				},
				{
					name: 'inputInst',
					value: dataflowCreationFormFields.value.inputInstance,
				},
				{
					name: 'service',
					value: dataflowCreationFormFields.value.type!,
				},
				{
					name: 'sourceLNodeUuid',
					value: props.sourceLNode.uuid,
				},
				{
					name: 'sourceDoName',
					value: dataflowCreationFormFields.value.signal,
				},
				{
					name: 'sourceDaName',
					value: dataflowCreationFormFields.value.attribute, // TODO: in the example SSD this was a combination fo SDS and DA name
				},
				// TODO resourceName, source, templateUUID attributes
			],
			parent: {
				tagName: lNodeInputsRecord.tagName,
				id: lNodeInputsRecord.id,
			},
			value: null,
			children: null,
		}

		// Add SourceRef records for new dataflow
		const addedSourceRefIds: string[] = []

		const addedId = await fileDb.table<DatabaseRecord>('SourceRef').add(recordToAdd)
		if (!addedId) {
			console.error('Failed to add SourceRef record')
			return
		}

		addedSourceRefIds.push(addedId.toString())

		if (dataflowCreationFormFields.value.includeQuality) {
			const sourceDaNameIndex = recordToAdd.attributes?.findIndex(
				(attr) => attr.name === 'sourceDaName',
			)
			if (sourceDaNameIndex === undefined || sourceDaNameIndex < 0) {
				console.error('sourceDaName attribute not found in SourceRef record')
				return
			}

			recordToAdd.id = crypto.randomUUID()
			setAttributeValue(recordToAdd, 'uuid', crypto.randomUUID())
			setAttributeValue(recordToAdd, 'sourceDaName', 'q') // Set to 'q' for Quality
			setAttributeValue(recordToAdd, 'pDA', 'q') // Set to 'q' for Quality

			const addedQualityId = await fileDb.table<DatabaseRecord>('SourceRef').add(recordToAdd)
			if (!addedQualityId) {
				console.error('Failed to add SourceRef record for quality')
				return
			}

			addedSourceRefIds.push(addedQualityId.toString())
		}

		if (dataflowCreationFormFields.value.includeTimestamp) {
			const sourceDaNameIndex = recordToAdd.attributes?.findIndex(
				(attr) => attr.name === 'sourceDaName',
			)
			if (sourceDaNameIndex === undefined || sourceDaNameIndex < 0) {
				console.error('sourceDaName attribute not found in SourceRef record')
				return
			}

			recordToAdd.id = crypto.randomUUID()
			setAttributeValue(recordToAdd, 'uuid', crypto.randomUUID())
			setAttributeValue(recordToAdd, 'sourceDaName', 't') // Set to 't' for timestamp
			setAttributeValue(recordToAdd, 'pDA', 't')

			const addedTimestampId = await fileDb.table<DatabaseRecord>('SourceRef').add(recordToAdd)
			if (!addedTimestampId) {
				console.error('Failed to add SourceRef record for timestamp')
				return
			}

			addedSourceRefIds.push(addedTimestampId.toString())
		}

		// TODO: add additional SourceRef for t and q if needed#

		console.log('Added SourceRef with ID:', addedSourceRefIds)

		if (lNodeInputsRecord.children == null) {
			lNodeInputsRecord.children = []
		}

		// Add SourceRef elements as a child to the LNodeInputs element
		for (const sourceRefId of addedSourceRefIds) {
			lNodeInputsRecord.children.push({
				id: sourceRefId.toString(),
				tagName: 'SourceRef',
			})
		}

		await fileDb
			.table<DatabaseRecord>(lNodeInputsRecord.tagName)
			.update(lNodeInputsRecord.id, { children: lNodeInputsRecord.children })
	}

	// TODO: handle if LNodeInputsElement is not found

	fileDb.close()

	closeModal()
}

function validateDataflowCreationForm(): boolean {
	if (!dataflowCreationFormFields.value.type) {
		alert('Please select a dataflow type.')
		return false
	}
	if (!dataflowCreationFormFields.value.signal) {
		alert('Please select a signal (DO).')
		return false
	}
	if (!dataflowCreationFormFields.value.attribute) {
		alert('Please select an attribute (DA).')
		return false
	}
	if (!dataflowCreationFormFields.value.inputName) {
		alert('Please enter an input name.')
		return false
	}
	return true
}

function resetForm() {
	dataflowCreationFormFields.value = getDataflowCreationFormDefaultValues()
}

function setAttributeValue(record: DatabaseRecord, attributeName: string, value: string) {
	const attribute = record.attributes?.find((attr) => attr.name === attributeName)
	if (!record.attributes) {
		record.attributes = []
	}
	if (attribute) {
		attribute.value = value
	} else {
		record.attributes.push({ name: attributeName, value })
	}
}
</script>

<style scoped>
@import '@/assets/main.css';
</style>
