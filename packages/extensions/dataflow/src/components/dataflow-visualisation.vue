<!-- dataflow-visualisation.vue-->

<template>
	<!-- Button for testing the DB extraction -->
	<button @click="logDB">Log DB</button>

	<div
		class="node-container"
		style="display: flex; flex-direction: row; align-items: center; justify-content: center"
	>
		<dataflow-node
			:lnodes="testLNodes"
			type="input"
			@update:activeLNode="onActiveInputNodeChange"
		/>

		<!-- Connection Component here? -->
		<div
			style="
				width: 200px;
				height: 200px;
				display: flex;
				align-items: center;
				justify-content: center;
			"
		>
			- Connections -
		</div>

		<dataflow-node
			:lnodes="testLNodes"
			type="output"
			@update:activeLNode="onActiveOutputNodeChange"
		/>
	</div>
	<!-- "Plus-button" component with modal for new connection here? -->
</template>

<script setup lang="ts">
import dataflowNode from './dataflow-node.vue'
import testLNodes from '../assets/lnodeTestData' // Test data for logical nodes
import type { LNodeObject } from '../assets/lnode.types'
import { getAllLNodes, getLNodeWithChildren } from '../assets/useLNodeRecords'

import { initializeDatabaseInstance } from '../assets/dbInit' //TEST

import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

// test function for database extraction setup
async function logDB() {
	//get the current active file database name from localStorage
	const currentActiveFileDatabaseName = useStorage<string>(
		'currentActiveFileDatabaseName',
		'',
		localStorage,
	)
	console.log('currentActiveFileDatabaseName:', currentActiveFileDatabaseName.value)
	if (!currentActiveFileDatabaseName.value) {
		console.error('No active file database name set.')
		return
	}

	// Initialize the database instance with the current active file database name
	const db = initializeDatabaseInstance(currentActiveFileDatabaseName.value)
	console.log('database:', db)
	if (!db) {
		console.error('database is not initialized.')
		return
	}

	// Get all LNodes from the database
	const lnodes = await getAllLNodes(db)
	console.log('LNodes:', lnodes)
	if (lnodes.length === 0) {
		console.warn('No LNodes found in the database.')
		return
	}

	// WIP -Table query needs to be adapted-
	// Get the first LNode with its children
	const lnodeWithChildren = await getLNodeWithChildren(db, lnodes[0])
	console.log('Children:', lnodeWithChildren.children)
}

const props = defineProps<{
	api: { [key: string]: any }
}>()

// active nodes for input and output
const activeInputNode = ref<LNodeObject | null>(null)
const activeOutputNode = ref<LNodeObject | null>(null)

function onActiveInputNodeChange(node: LNodeObject | null) {
	activeInputNode.value = node
	console.log('activeInputNode:', activeInputNode.value)
}

function onActiveOutputNodeChange(node: LNodeObject | null) {
	activeOutputNode.value = node
	console.log('activeOutputNode:', activeOutputNode.value)
}
</script>

<style scoped>
@reference "@/assets/main.css";
.node-container {
}
</style>
