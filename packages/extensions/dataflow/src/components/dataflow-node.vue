<template>
	<div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
		<!-- here will live a dropdown to select the LN that should be displayed -->
		<div class="dataflow-dropdown">
			<Dropdown>
				<template #label>Dropdown</template>
				<template #items>
					<li>Item 1</li>
					<li>Item 2</li>
				</template>
			</Dropdown>
		</div>

		<!-- here will live a LN that can take props to display the correct amount of connections-->
		<div class="dataflow-node" style="width: 200px; height: 200px; background-color: orange">
			Logical Node
		</div>
	</div>
</template>

<script setup lang="ts">
import { Dropdown } from '@septkit/ui'

const props = defineProps(['type', 'data'])
</script>

<style scoped>
.dataflow-dropdown {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.dataflow-node {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 200px;
	height: 100px;
	border: 1px solid #ccc;
	border-radius: 8px;
	background-color: #f9f9f9;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin: 10px;
	font-size: 16px;
	color: #333;
	text-align: center;
	cursor: pointer;
}
</style>
