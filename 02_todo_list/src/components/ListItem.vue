<template>
  <label :class="{ 'checked': isChecked }">
    <input type="checkbox" :checked="isChecked" />
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  isChecked?: boolean | false
}>()
</script>

<style scoped>
label {
  cursor: pointer;
}

.checked {
  text-decoration: line-through;
}
</style>
