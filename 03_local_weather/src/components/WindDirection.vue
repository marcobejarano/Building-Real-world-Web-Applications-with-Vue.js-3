<template>
  <span>
    <span
      data-testid="direction"
      aria-hidden="true"
      class="inline-block"
      :style="windStyle"
    >
      ⬇
    </span>
    <span 
      data-testid="direction-sr"
      class="sr-only"
    >
      Wind direction: {{ degrees }} degrees
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  degrees: number;
}

const props = defineProps<Props>();

const windStyle = computed(() => ({
  transform: "rotate(" + props.degrees + "deg)",
}));
</script>
