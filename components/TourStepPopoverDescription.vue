<script setup>
defineProps({
  step: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <ul v-if="Array.isArray(step.popover.description)">
    <li v-for="(item, index) in step.popover.description" :key="index">
      {{ item }}
    </li>
  </ul>
  <p v-else>{{ step.popover.description }}</p>
</template>
