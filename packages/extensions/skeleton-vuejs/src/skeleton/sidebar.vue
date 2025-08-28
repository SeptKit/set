<template>
	<div name="sidebar" class="root">
		<div class="tabs tabs-box">
			<input
				type="radio"
				value="details"
				name="tabs"
				v-model="activeTab"
				class="tab"
				aria-label="Details"
				checked="checked"
			/>
			<input
				type="radio"
				value="advanced"
				name="tabs"
				v-model="activeTab"
				class="tab"
				aria-label="Advanced"
			/>
		</div>

		<div>
			<div v-if="activeTab === 'details'">Showing important details</div>
			<div v-if="activeTab === 'advanced'">Showing advanced configurations</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('details')
</script>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
h2 {
	font-size: 1.5rem;
	padding: 0.5rem;
}

.tab {
	transition: all 0.2s;
}
.tabs {
	width: auto;
	display: inline-block;
	margin: 0 auto;
}
</style>
