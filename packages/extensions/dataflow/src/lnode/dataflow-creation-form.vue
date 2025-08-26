<template>
	<dialog class="modal" :open="isOpen">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Create Connection</h3>

			<button
				class="absolute top-[1.5rem] right-[1.5rem] cursor-pointer"
				@click="closeModal"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64">
					<path
						d="M 16 14 C 15.488 14 14.976938 14.194937 14.585938 14.585938 C 13.804937 15.366937 13.804937 16.633063 14.585938 17.414062 L 29.171875 32 L 14.585938 46.585938 C 13.804938 47.366938 13.804937 48.633063 14.585938 49.414062 C 14.976937 49.805062 15.488 50 16 50 C 16.512 50 17.023062 49.805062 17.414062 49.414062 L 32 34.828125 L 46.585938 49.414062 C 47.366938 50.195063 48.633063 50.195062 49.414062 49.414062 C 50.195063 48.633062 50.195062 47.366937 49.414062 46.585938 L 34.828125 32 L 49.414062 17.414062 C 50.195063 16.633063 50.195062 15.366938 49.414062 14.585938 C 48.633062 13.804938 47.366937 13.804938 46.585938 14.585938 L 32 29.171875 L 17.414062 14.585938 C 17.023062 14.194938 16.512 14 16 14 z"
					></path>
				</svg>
			</button>

			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="dataflow-type-select" class="col-start-1 self-center">Dataflow Type</label>
				<select
					id="dataflow-type-select"
					required
					class="select col-start-2"
					v-model="dataflowCreationFormFields.type"
					@change="resetFields(['signal', 'attribute'])"
				>
					<option v-for="type in Object.values(DataflowType)" :key="type" :value="type">
						{{ type }}
					</option>
					<option key="empty" :value="null">-</option>
				</select>
			</div>

			<hr class="solid mt-4" />

			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="source-select" class="col-start-1 self-center">Source</label>
				<select
					id="source-select"
					required
					disabled
					class="select col-start-2"
					v-model="props.sourceLNode.id"
				>
					<option :value="props.sourceLNode.id">{{ getLNodeLabel(sourceLNode) }}</option>
				</select>
			</div>

			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="data-object-select" class="col-start-1 self-center">Signal (DO)</label>
				<select
					id="data-object-select"
					required
					class="select col-start-2"
					v-model="dataflowCreationFormFields.signal"
					@change="resetFields(['attribute'])"
				>
					<option v-for="signal of signalOptions" :key="signal" :value="signal">
						{{ signal }}
					</option>
					<option key="empty" value="">-</option>
				</select>
			</div>

			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="data-attribute-select" class="col-start-1 self-center">Attribute (DA)</label>
				<select
					id="data-attribute-select"
					required
					class="select col-start-2"
					v-model="dataflowCreationFormFields.attribute"
				>
					<option v-for="attribute of attributeOptions" :key="attribute" :value="attribute">
						{{ attribute }}
					</option>
					<option key="empty" value="">-</option>
				</select>
			</div>

			<hr class="solid mt-4" />

			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="destination-select" class="col-start-1 self-center">Destination</label>
				<select
					id="destination-select"
					required
					disabled
					class="select col-start-2"
					v-model="props.destinationLNode.id"
				>
					<option :value="props.destinationLNode.id">{{ getLNodeLabel(destinationLNode) }}</option>
				</select>
			</div>

			<!-- TODO: This needs to be adapted according to rule defined in issue https://github.com/SeptKit/set/issues/163 -->
			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="input-name-input" class="col-start-1 self-center">Input Name</label>
				<input
					id="input-name-input"
					required
					type="text"
					placeholder="Input Name"
					class="input col-start-2"
					v-model="dataflowCreationFormFields.inputName"
				/>
			</div>

			<!-- TODO: This needs to be adapted according to rule defined in issue https://github.com/SeptKit/set/issues/163 -->
			<div class="grid grid-cols-2 gap-4 mt-4">
				<label for="input-instance-input" class="col-start-1 self-center">Input Instance</label>
				<input
					id="input-instance-input"
					required
					disabled
					type="text"
					class="input col-start-2"
					v-model="dataflowCreationFormFields.inputInstance"
				/>
			</div>

			<hr class="solid mt-4" />

			<div class="mt-4">
				<input
					type="checkbox"
					v-model="dataflowCreationFormFields.includeQuality"
					class="checkbox mr-2"
					id="checkbox-include-quality"
				/>
				<label for="checkbox-include-quality">Include Quality</label>
			</div>

			<div class="mt-4">
				<input
					type="checkbox"
					v-model="dataflowCreationFormFields.includeTimestamp"
					class="checkbox mr-2"
					id="checkbox-include-timestamp"
				/>
				<label for="checkbox-include-timestamp">Include Timestamp</label>
			</div>

			<div class="modal-action">
				<button class="btn bg-(--color-chart-3) border-none text-white" @click="createConnection">
					Save
				</button>
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
} from './use-dataflow'
import { openDatabase } from '@/x/database'

const props = defineProps<{
	sourceLNode: LNode
	destinationLNode: LNode
	isOpen: boolean
}>()

const emit = defineEmits<{
	(e: 'update:isOpen', isOpenValue: boolean): void
	(e: 'connectionCreated'): void
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

async function createConnection() {
	try {
		if (!validateDataflowCreationForm(dataflowCreationFormFields.value)) {
			return
		}

		const activeFile = localStorage.getItem('currentActiveFileDatabaseName')
		if (!activeFile) {
			throw new Error('no active file')
		}
		const db = await openDatabase(activeFile)

		const dataflow = useDataflow(db)
		await dataflow.create(
			dataflowCreationFormFields.value,
			props.sourceLNode,
			props.destinationLNode,
		)

		db.close()
		emit('connectionCreated')
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
