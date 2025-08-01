<template>
	<Layout>
		<template #menubar>
			<Menu />
		</template>

		<template #activity-bar>
			<span></span>
		</template>

		<template #primary-sidebar>
			<span></span>
		</template>

		<template #main-area>
			<button class="btn" @click="() => testSDK()">SCD SDK - Add Function</button>
			<p v-if="noApplicationInThisFile" class="text-red-500">
				No Application found in this file. Please create one first.
			</p>
			<p>Current Active File Database Name: {{ fileStore.currentActiveFileDatabaseName }}</p>
			<p>Watch database changes in real time:</p>
			{{
				observableRecords?.length ? observableRecords.length + ' records found' : 'No records found'
			}}
			<p>Records:</p>
			{{ observableRecords.map((r) => r.attributes[0].value + ' (' + r.id + ')').join(', ') }}
			<MainArea />
		</template>

		<template #secondary-sidebar>
			<span></span>
		</template>

		<h1 class="text-5xl font-bold text-center my-8 text-indigo-600 uppercase tracking-wider">
			SET
		</h1>
	</Layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Layout from './layout.vue'
import MainArea from './main-area/main-area.vue'
import Menu from './menu/menu.vue'
import { scl } from '@septkit/sclsdk/v2019C1'
import type { DatabaseRecord } from '@septkit/sclsdk/v2019C1'
import { useFileStore } from './data-management/data-management.store'
// VUEUSE
import { useObservable } from '@vueuse/rxjs'

const fileStore = useFileStore()
const noApplicationInThisFile = ref(false)

const builder = scl({
	databaseName: fileStore.currentActiveFileDatabaseName,
})
const functionRoleObservable = builder.entrypoint('FunctionRole').subscribe()
const observableRecords = useObservable<DatabaseRecord<'FunctionRole'>[]>(
	functionRoleObservable,
	[],
)

async function testSDK() {
	console.log('Testing SDK...', fileStore.currentActiveFileDatabaseName)

	const application = await builder.entrypoint('Application').commit()

	if (!application.length) {
		noApplicationInThisFile.value = true
		console.warn('No Application found in this file. Please create one first.')
		return
	}

	const result = await builder
		.entrypoint('Application', application[0].id)
		.addChild({
			tagName: 'FunctionRole',
			attributes: [{ name: 'name', value: `DummyFunctionRole-${application[0].children.length}` }],
		})
		.commit()

	console.log('AccessPoint added:', result)
}
</script>

<style>
@reference "@/assets/main.css";
</style>
