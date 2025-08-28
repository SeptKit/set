<template>
	<div class="layout">
		<div class="main">
			<slot name="main"></slot>
		</div>
		<div class="sidebar">
			<slot name="sidebar"></slot>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
.layout {
	display: grid;
	height: 100%;
	grid-template-columns: 1fr 20rem;
}

.sidebar {
	padding: 1rem;
	border-left: 1px solid var(--border-color);
	height: 100%;
}

.main {
	padding: 1rem;
	height: 100%;
}
</style>
