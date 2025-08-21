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
				<button class="btn" @click="createConnection">Save</button>
			</div>
		</div>
	</dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DataflowType, DataflowTypeToFCMap } from './connection'
import { type LNode, getLNodeLabel } from './lnode'
import {
	useDataflow,
	type DataflowCreationForm,
	type ValidatedDataflowCreationForm,
} from '@/lnode/dataflow'

const props = defineProps<{
	sourceLNode: LNode
	destinationLNode: LNode
	isOpen: boolean
}>()

const emit = defineEmits<{
	(e: 'update:isOpen', isOpenValue: boolean): void
}>()

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

function getDataflowCreationFormDefaultValues(): DataflowCreationForm {
	return {
		type: null,
		signal: '',
		attribute: '',
		inputName: '',
		inputInstance: '',
		includeQuality: false,
		includeTimestamp: false,
	}
}

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
async function createConnection() {
	try {
		if (!validateDataflowCreationForm(dataflowCreationFormFields.value)) {
			return
		}

		const dataflow = useDataflow()
		await dataflow.create(
			dataflowCreationFormFields.value,
			props.sourceLNode,
			props.destinationLNode,
		)

		closeModal()
	} catch (e) {
		console.error('Error creating dataflow:', e)
		alert(`Error creating dataflow: ${e instanceof Error ? e.message : 'Unknown error'}`)
	}
}

function validateDataflowCreationForm(
	formFields: DataflowCreationForm,
): formFields is ValidatedDataflowCreationForm {
	if (!formFields.type) {
		alert('Please select a dataflow type.')
		return false
	}
	if (!formFields.signal) {
		alert('Please select a signal (DO).')
		return false
	}
	if (!formFields.attribute) {
		alert('Please select an attribute (DA).')
		return false
	}
	if (!formFields.inputName) {
		alert('Please enter an input name.')
		return false
	}
	return true
}

function resetForm() {
	dataflowCreationFormFields.value = getDataflowCreationFormDefaultValues()
}
</script>

<style scoped>
@import '@/assets/main.css';
</style>
