<template>
	<details
		data-testid="dropdown-wrapper"
		ref="details-ref"
		class="dropdown"
		:open="isOpen"
		@toggle="dropdownHandler"
	>
		<summary
			data-testid="dropdown-trigger"
			@click.stop="toggleDropdown"
			class="btn"
			:class="[
				colorStyle,
				variantStyle,
				sizeStyle,
				modifierStyle,
				{ 'btn-active': active, 'btn-disabled': disabled },
			]"
		>
			<slot name="label"></slot>
		</summary>
		<ul
			data-testid="dropdown-menu"
			v-on-click-outside.bubble="closeDropdown"
			class="menu dropdown-content bg-base-100 z-1 w-52 p-2 shadow-sm"
		>
			<slot name="items"></slot>
		</ul>
	</details>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
	/** Trigger color */
	color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
	/** Trigger variant */
	variant?: 'outline' | 'dash' | 'soft' | 'ghost' | 'link'
	/** Trigger size */
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	/** Is the trigger active */
	active?: boolean
	/** Is the trigger disabled */
	disabled?: boolean
	/** Trigger modifier */
	modifier?: 'wide' | 'block' | 'square' | 'circle'
	// We need the `id` to be able to identify the dropdown in a list
	id?: string
}>()

const emit = defineEmits(['open', 'close'])

// Refs for accessing DOM elements
const details = useTemplateRef<HTMLDetailsElement>('details-ref')
const isOpen = ref(false)

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

//====== FUNCTIONS ======//

function dropdownHandler() {
	if (details.value) {
		details.value.open = isOpen.value
	}
}

function closeDropdown() {
	isOpen.value = false
	emit('close')
}

function openDropdown() {
	isOpen.value = true
	emit('open')
}

// We use a more explicit way of toggling the
// `isOpen` value to minimize the places where change happens to it
// this is needed to make sure we emit the right open and close events
function toggleDropdown() {
	if (!isOpen.value) {
		openDropdown()
	} else {
		closeDropdown()
	}
}

//====== PUBLIC API ======//

defineExpose({
	/** Method to close the dropdown */
	close: closeDropdown,
	/** Reactive boolean of the dropdown state */
	isOpen,
	id: props.id,
})
</script>
