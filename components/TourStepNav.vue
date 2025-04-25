<script setup>
import { computed } from 'vue'

import { useCoreComponent } from '@/composables/useCoreComponent'
import { useTourStore } from '@/stores/tour'

const ButtonIcon = await useCoreComponent('Button/ButtonIcon')
const DisplayProgress = await useCoreComponent('Display/DisplayProgress')
const tourStore = useTourStore()
const nextLabel = computed(() => tourStore.currentStep.nextLabel)
</script>

<template>
  <div class="d-flex justify-content-between align-items-center w-100 mt-3">
    <button-icon :disabled="!tourStore.hasPrevStep" variant="outline-secondary bg-body" @click="tourStore.prevStep">
      Back
    </button-icon>
    <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-1">
      <display-progress
        :value="(tourStore.progress + 1) / tourStore.currentScenario.length"
        no-label
        class="justify-content-center"
      />
      <p class="text-body-secondary m-0">{{ tourStore.progress + 1 }} / {{ tourStore.currentScenario.length }}</p>
    </div>
    <button-icon v-if="tourStore.hasNextStep" variant="action" @click="tourStore.nextStep">
      {{ nextLabel }}
    </button-icon>
    <button-icon v-else variant="action" @click="tourStore.endTour">
      {{ nextLabel }}
    </button-icon>
  </div>
</template>
