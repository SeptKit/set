<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Dropdown } from 'ui'

const dropdown = useTemplateRef('dropdown-ref')

function showAlert() {
  alert('Button clicked!')
  dropdown.value?.close()
}
</script>

<template>
  <nav class="navbar bg-base-100 shadow-sm min-h-10 px-0.5 py-0">
    <Dropdown ref="dropdown-ref" color="secondary" variant="ghost" size="sm" modifier="wide">
      <template v-slot:label> File </template>
      <template v-slot:items>
        <li>
          <button @click="showAlert">Show alert</button>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </template>
    </Dropdown>
  </nav>
</template>
