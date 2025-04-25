import { driver } from 'driver.js'
import { defineStore } from 'pinia'
import { watchPausable } from '@vueuse/core'
import { computed, ref, reactive, watch } from 'vue'

import { useCore } from '@/composables/useCore'
import { useElementObserver } from '@/composables/useElementObserver'

const DEFAULT_DRIVER_CONFIG = {
  allowClose: false,
  stagePadding: 0,
  stageRadius: 6,
  overlayColor: 'var(--bs-secondary)',
  overlayOpacity: 0.5
}

export const useTourStore = defineStore('tour', () => {
  const { core } = useCore()
  const { waitForElementCreated } = useElementObserver()
  const appStore = core.stores.useAppStore()
  const driverController = driver(DEFAULT_DRIVER_CONFIG)

  /** The current progress step index in the tour. */
  const progress = ref(-1)

  /** The latest route saved during tour */
  const currentStepHref = ref(null)

  /** The active scenario identifier for the tour. */
  const scenario = ref(null)

  /** A reactive array of registered steps for all scenarios. */
  const steps = reactive([])

  /**
   * Computed array of steps for the current scenario.
   */
  const currentScenario = computed(() => scenarioSteps(scenario.value))

  /**
   * Computed object representing the current step details.
   */
  const currentStep = computed(() => currentScenario.value[progress.value])

  /**
   * Computed boolean indicating if a previous step exists.
   */
  const hasPrevStep = computed(() => progress.value > 0)

  /**
   * Computed boolean indicating if a next step exists.
   */
  const hasNextStep = computed(() => progress.value < currentScenario.value.length - 1)

  /**
   * Computed property to show or hide the tour modal.
   */
  const showTourModal = computed({
    get: () => !appStore.getSettings('app', 'tourModalHidden'),
    set: (value) => appStore.setSettings('app', { tourModalHidden: !value })
  })

  /**
   * Registers a new step to the tour.
   * @param {Object} step - Step configuration object.
   * @param {string} [step.element] - The element to highlight.
   * @param {string} [step.scenario] - The scenario to which the step belongs.
   * @param {Object} [step.highlight] - Driver.js configuration for the step.
   * @param {string} [step.nextLabel='Next'] - Label for the next button.
   * @param {Function} [step.before] - Function to execute before the step.
   * @param {Function} [step.after] - Function to execute after the step.
   * @param {Function} [step.filter] - Function to filter the step.
   * @param {string|null} [step.scenario=null] - The scenario to which the step belongs.
   */
  function defineStep({ scenario = null, highlight = {}, nextLabel = 'Next', ...step }) {
    const defaultBefore = ({ element }) => waitForElementCreated(element)
    const defaultAfter = () => null
    // The filter function is used to determine if the step should be executed. It must
    // return a boolean value and not use async/await.
    const filter = () => true
    // Both before and after filter must be executed without route guard
    const before = withoutRouteGuard(step.before || defaultBefore)
    const after = withoutRouteGuard(step.after || defaultAfter)
    steps.push({ scenario, highlight, filter, nextLabel, ...step, before, after })
  }

  /**
   * Highlights the currently active step's element with Driver.js
   */
  function highlightStep(step) {
    if (!step) return
    const { element, highlight } = step
    // Each step can override Driver.js config
    driverController.setConfig({ ...DEFAULT_DRIVER_CONFIG, ...highlight })
    driverController.highlight({ element })
  }

  /**
   * Retrieves all steps associated with a specific scenario.
   * @param {string|null} tourScenario - Scenario identifier.
   * @returns {Array} Array of steps for the specified scenario.
   */
  function scenarioSteps(tourScenario) {
    return steps.filter(({ scenario, filter }) => scenario === tourScenario && filter())
  }

  /**
   * Executes the `before` callback of the next step if it exists.
   */
  function beforeNextStep() {
    const step = currentScenario.value[progress.value + 1]
    return step?.before?.(step)
  }

  /**
   * Executes the `before` callback of the previous step if it exists.
   */
  function beforePrevStep() {
    const step = currentScenario.value[progress.value - 1]
    return step?.before?.(step)
  }

  /**
   * Starts the tour for a specific scenario.
   * @param {string|null} [tourScenario=null] - Scenario identifier.
   */
  async function startTour(tourScenario = null) {
    scenario.value = tourScenario
    if (hasNextStep.value) {
      await beforeNextStep()
      progress.value = 0
    }
  }

  /**
   * Ends the current tour and resets progress.
   */
  async function endTour() {
    driverController.destroy()
    showTourModal.value = false
    progress.value = -1
  }

  /**
   * Advances the tour to the next step.
   */
  async function nextStep() {
    if (hasNextStep.value) {
      await beforeNextStep()
      progress.value = progress.value + 1
    }
  }

  /**
   * Returns the tour to the previous step.
   */
  async function prevStep() {
    if (hasPrevStep.value) {
      await beforePrevStep()
      progress.value = progress.value - 1
    }
  }

  /**
   * Resets the tour store state.
   */
  function reset() {
    progress.value = -1
    scenario.value = null
    steps.splice(0, steps.length)
  }

  /**
   * Executes the `after` callback of the previous step if it exists.
   *
   * @param {number} stepNumber - The step number to execute the callback for.
   * @param {number} oldStepNumber - The previous step number.
   * @return {Promise<void>} A promise that resolves when the callback is executed.
   */
  async function afterStep(stepNumber, oldStepNumber) {
    if (oldStepNumber === -1) return
    const step = currentScenario.value[oldStepNumber]
    await step?.after?.(step)
  }

  // Watches for changes in the progress to exectute the `after` callback of the previous step.
  watch(progress, afterStep)

  function withoutRouteGuard(fn) {
    return async function (...args) {
      stopRouteGuard()
      const result = await fn(...args)
      resumeRouteGuard()
      return result
    }
  }

  const { stop: stopRouteGuard, resume: resumeRouteGuard } = watchPausable(core.router.currentRoute, endTour)

  return {
    scenario,
    progress,
    currentScenario,
    currentStep,
    currentStepHref,
    hasPrevStep,
    hasNextStep,
    highlightStep,
    showTourModal,
    startTour,
    endTour,
    scenarioSteps,
    nextStep,
    prevStep,
    defineStep,
    reset
  }
})
