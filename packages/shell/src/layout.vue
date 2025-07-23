<template>
	<div class="wrapper">
		<div class="menubar">
			<slot name="menubar"></slot>
		</div>
		<div class="activity-bar">
			<slot name="activity-bar"></slot>
		</div>
		<div class="primary-sidebar">
			<slot name="primary-sidebar"></slot>
		</div>
		<div class="main-area">
			<slot name="main-area"></slot>
		</div>
		<div class="secondary-sidebar">
			<slot name="secondary-sidebar"></slot>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
@reference "@/assets/main.css";

.wrapper {
	display: grid;
	height: 100vh;
	grid-template-rows: auto 1fr;
	grid-template-columns: 3rem 13rem 1fr 13rem;
}

.menubar {
	grid-column-start: 1;
	grid-column-end: 5;
}

.activity-bar {
	padding: 0.5rem;
	border-right: 1px solid var(--color-neutral);
}

.primary-sidebar {
	padding: 1rem;
	border-right: 1px solid var(--color-neutral);
}

.secondary-sidebar {
	padding: 1rem;
	border-left: 1px solid var(--color-neutral);
}

.main-area {
	padding: 1rem;
}
</style>
