<script setup>
import { computed } from 'vue'

import TourStepNav from '@/components/TourStepNav.vue'
import TourStepPopoverDescription from '@/components/TourStepPopoverDescription.vue'
import { useCoreComponent } from '@/composables/useCoreComponent'
import { useTourStore } from '@/stores/tour'

const { step } = defineProps({
  step: {
    type: Object,
    required: true
  }
})

const tourStore = useTourStore()
const AppPopover = await useCoreComponent('AppPopover/AppPopover')
const target = computed(() => document.querySelector(step.element))
</script>

<template>
  <app-popover
    class="tour-step-popover"
    :target="target"
    :title="step.popover.title"
    :placement="step.popover.placement"
    :boundary-padding="step.popover.boundaryPadding"
    :offset="step.popover.offset"
    manual
    show
    @show="tourStore.highlightStep(step)"
    @hidden="tourStore.endTour()"
  >
    <tour-step-popover-description :step="step" />
    <tour-step-nav />
  </app-popover>
</template>

<style>
.tour-step-popover {
  width: 375px;
  max-width: 90vw;
}
</style>
