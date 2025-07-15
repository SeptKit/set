<template>
	<div class="wrapper " >
		<div class="menubar">
			<slot name="menubar"></slot>
		</div>
		<slot name="activity-bar"></slot>
		<slot name="primary-sidebar" ></slot>
		<slot name="main-area" ></slot>
		<slot name="secondary-sidebar"></slot>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
@reference "@/assets/main.css";

	.wrapper {
		display: grid;
		height: 100vh;
		grid-template-rows: auto 1fr;
		grid-template-columns: 3rem 13rem 1fr 13rem;
		@apply [&>*]:border-blue-500 [&>*]:border-2;
	}

	.menubar {
		grid-column-start: 1;
		grid-column-end: 5;
	}

</style>
