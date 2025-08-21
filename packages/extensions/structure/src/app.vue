<template>
	<div class="root" name="ext-structure-root">
		<h3>Data Structure</h3>
		<Diagram :nodes="flowNodes" :edges="[]" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Diagram from './diagram/diagram.vue'
import { useSDK, type SDK } from './sdk'
import Dexie from 'dexie'
import { useLayout } from './layout'
import { Node } from '@vue-flow/core'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let fileName = ref('')
let unsubscribeFromFileName = () => {}
let sdk: SDK | undefined
let flowNodes = ref<Node[]>([])

onMounted(() => {
	unsubscribeFromFileName = props.api.activeFileName.subscribe((newFileName: string) => {
		onFileChange(newFileName)
	})

	onFileChange(props.api.activeFileName.value)
})

onUnmounted(() => {
	unsubscribeFromFileName()
})

const { calcLayout } = useLayout()

async function onFileChange(newFileName: string) {
	fileName.value = newFileName

	if (sdk) {
		sdk.close()
	}

	const db = new Dexie(newFileName)
	await db.open()
	sdk = useSDK(db)

	// Find all substations
	const substations = await sdk.findRecordsByTagName('Substation')
	if (substations.length === 0) {
		console.warn('no substations found in the database:', newFileName)
		return
	}

	const includeList = [
		'Substation',
		'PowerTransformers',
		'VoltageLevel',
		'Bay',
		'Conducting (Sub)equipment',
		'Application',
		'Function',
		'BehaviorDescription',
		'SubFunction',
		'LNode',
		'SubFunction',
		'LNode',
		'AllocationRole',
		'Private',
	]

	// Gather their children
	const substationsChildren = (
		await Promise.all(
			substations.map(async (substation) => {
				const children = await sdk!.findChildRecordsWithinDepthAndGivenTagName(
					substation,
					10,
					includeList,
				)
				return children
			}),
		)
	).flat()

	const allElements = [...substations, ...substationsChildren]

	const newFlowNodes = await calcLayout(allElements, [])
	flowNodes.value = newFlowNodes
}
</script>

<style>
@import './app.css';
</style>

<style scoped>
/*
	We import it here and not on the top so it is scoped and does not affect
	the rest of the ui
*/

.root {
	height: 100%;
}
</style>
