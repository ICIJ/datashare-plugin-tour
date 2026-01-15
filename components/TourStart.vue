<script setup>
import { computed } from 'vue'
import { property } from 'lodash'

import IPhStudent from '~icons/ph/student'
import { useCore } from '@/composables/useCore'
import { useCoreComponent } from '@/composables/useCoreComponent'
import { useTourStore } from '@/stores/tour'

defineOptions({ name: 'TourStart' })

const { name, compact } = defineProps({
  compact: {
    type: Object
  },
  name: {
    type: String
  }
})

const ButtonIcon = await useCoreComponent('Button/ButtonIcon')
const AppSidebarFooterLinksEntry = await useCoreComponent('AppSidebar/AppSidebarFooterLinksEntry')
const tourStore = useTourStore()
const core = useCore()

const routeMatched = computed(() => core.router.currentRoute.value.matched)
const routeSteps = computed(() => routeMatched.value.map(property('name')).map(tourStore.scenarioSteps).flat())
const routeScenario = computed(() => routeSteps.value.map(property('scenario')).shift())
const hasSteps = computed(() => !!routeSteps.value.length)
const hookName = computed(() => (compact ? 'settings' : 'logo'))
const isVisible = computed(() => hasSteps.value && name === hookName.value)
</script>

<template>
  <app-sidebar-footer-links-entry v-if="isVisible" :compact="compact" name="tour">
    <button-icon
      variant="link"
      class="text-info ms-auto p-0"
      label="Discover this page"
      hide-label
      :icon-left="IPhStudent"
      @click="tourStore.startTour(routeScenario)"
    />
  </app-sidebar-footer-links-entry>
</template>
