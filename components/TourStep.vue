<script setup>
import TourStepPopover from '@/components/TourStepPopover.vue'

defineProps({
  step: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <tour-step-popover :step="step" />
</template>
