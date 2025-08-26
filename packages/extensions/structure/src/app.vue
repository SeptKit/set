<template>
	<div class="root" name="ext-structure-root">
		<h3>Data Structure</h3>
		<Diagram
			:nodes="layout.flowNodes.value"
			:edges="[]"
			@expand="onExpand"
			@collapse="onCollapse"
		/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Diagram from './diagram/diagram.vue'
import { useSDK, type SDK } from './sdk'
import Dexie from 'dexie'
import { type Layout, useLayout } from './layout'

const props = defineProps<{
	api: { [key: string]: any }
}>()

let layout: Layout = useLayout()

let fileName = ref('')
let unsubscribeFromFileName = () => {}
let sdk: SDK | undefined

onMounted(() => {
	unsubscribeFromFileName = props.api.activeFileName.subscribe((newFileName: string) => {
		onFileChange(newFileName)
	})

	onFileChange(props.api.activeFileName.value)
})

onUnmounted(() => {
	unsubscribeFromFileName()
})

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
		'AllocationRole',
		'Application',
		'Bay',
		'BehaviorDescription',
		'ConductingEquipment',
		'Function',
		'LNode',
		'PowerTransformers',
		'Private',
		'SubEquipment',
		'SubFunction',
		'Substation',
		'VoltageLevel',
	]

	// Gather their children
	const substationsChildren = (
		await Promise.all(
			substations.map(async (substation) => {
				const children = await sdk!.findChildRecordsWithinDepthAndGivenTagName(
					substation,
					3,
					includeList,
				)
				return children
			}),
		)
	).flat()

	const allElements = [...substations, ...substationsChildren]
	layout.setRecords(allElements)
	await layout.calcLayout()
}

async function onExpand(event: { id: string }) {
	const nodeId = event.id

	if (!layout.hasNodeLoadedChildren(nodeId)) {
		const record = layout.borrowRecordById(nodeId)
		if (!record) {
			console.warn({ msg: 'record not found by id, cannot load children', id: nodeId })
			return
		}
		if (!sdk) {
			console.error({ msg: 'no sdk instance available to find child records' })
			return
		}

		const children = await sdk.findChildRecords(record)
		layout.addChildren(nodeId, children)
	}

	layout.expandNode(nodeId)
}

function onCollapse(nodeId: string) {
	layout.collapseNode(nodeId)
}
</script>

<style>
@import './app.css';
@import '@septkit/ui/configcss';
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
