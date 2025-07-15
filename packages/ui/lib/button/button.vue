<script setup lang="ts">
import { computed } from 'vue'

//====== INITIALIZATION ======//

const props = defineProps<{
	color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
	variant?: 'outline' | 'dash' | 'soft' | 'ghost' | 'link'
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	active?: boolean
	disabled?: boolean
	modifier?: 'wide' | 'block' | 'square' | 'circle'
}>()

//====== COMPUTED ======//

const colorStyle = computed(
	() =>
		({
			neutral: 'btn-neutral',
			primary: 'btn-primary',
			secondary: 'btn-secondary',
			accent: 'btn-accent',
			info: 'btn-info',
			success: 'btn-success',
			warning: 'btn-warning',
			error: 'btn-error',
			undefined: '',
		})[props.color ?? 'undefined'],
)

const variantStyle = computed(
	() =>
		({
			outline: 'btn-outline',
			dash: 'btn-dash',
			soft: 'btn-soft',
			ghost: 'btn-ghost',
			link: 'btn-link',
			undefined: '',
		})[props.variant ?? 'undefined'],
)

const sizeStyle = computed(
	() =>
		({
			xs: 'btn-xs',
			sm: 'btn-sm',
			md: 'btn-md',
			lg: 'btn-lg',
			xl: 'btn-xl',
			undefined: '',
		})[props.size ?? 'undefined'],
)

const modifierStyle = computed(
	() =>
		({
			wide: 'btn-wide',
			block: 'btn-block',
			square: 'btn-square',
			circle: 'btn-circle',
			undefined: '',
		})[props.modifier ?? 'undefined'],
)
</script>

<template>
	<button
		class="btn"
		:class="[
			colorStyle,
			variantStyle,
			sizeStyle,
			modifierStyle,
			{ 'btn-active': active, 'btn-disabled': disabled },
		]"
	>
		<slot></slot>
	</button>
</template>
