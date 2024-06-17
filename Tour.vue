<template>
  <teleport v-if="show" to="body">
    <spotlight :key="stepTarget" :target="stepTarget" />
    <b-popover :model-value="true" :placement="step.placement" :target="stepTarget" customClass="tour-step">
      <div v-if="step.content" v-html="step.content"></div>
      <div class="mt-4 mb-1 d-flex">
        <button v-if="step.title" class="btn btn-link me-auto me-1" @click="onFinish">
          Skip tour
        </button>
        <button v-if="!isFirst" class="btn btn-light fw-bold me-1" @click="onPrevious">
          Back
        </button>
        <button v-if="isLast" class="btn btn-primary fw-bold me-1" @click="onFinish">
          Finish
        </button>
        <button v-else class="btn btn-primary fw-bold" @click="onNext">
          Continue
        </button>
      </div>
    </b-popover>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import isNull from 'lodash/isNull'
import Spotlight from './Spotlight.vue'

const STORAGE_NAME = '_ds_plugin_tour'

const { config, store, router } = window.datashare
const project = computed(() => config.get('projects', []).slice().shift())

const steps = ref([
  {
    before: () => {
      store.commit('search/resetFilterValues')
      store.commit('search/decontextualizeFilter', 'language')
    },
    selector: '.project-cards__item:nth-child(1)',
    title: 'Projects',
    content: `Enter a project, such as "${project.value.label}"!`,
    placement: 'bottom',
    route: { name: 'landing' }
  },
  {
    selector: '.search-layout-selector__button:nth-child(3)',
    title: 'Views',
    content: 'Try different layouts: list, grid and table.',
    placement: 'bottom-end',
    route: { name: 'search' },
    action: () => {
      querySelector('.search-layout-selector__button:nth-child(3)').click()
    }
  },
  {
    selector: '.filters-panel__sticky__toolbar__toggler',
    title: 'Menus',
    content: 'Make room by hiding the menu and filters columns!',
    placement: 'right',
    route: { name: 'search' }
  },
  {
    selector: '.filter[data-filter-name=language]',
    title: 'Filters',
    content: 'Filter your documents. For example, select German.',
    placement: 'right',
    route: { name: 'search' },
    clean: () => {
      store.commit('search/resetFilterValues')
      // Close the filter when leaving
      querySelector('.filter[data-filter-name=language].filter--show .filter__header')?.click()
    },
    action: async () => {
      // Ensure the filter is open
      querySelector('.filter[data-filter-name=language]:not(filter--show) .filter__header')?.click()
      const label = await waitForElement('.filter[data-filter-name=language] .filter__items__item:nth-child(3) .form-check-label')
      label.click()
    }
  },
  {
    selector: '.filter[data-filter-name=language] .filter__footer',
    title: 'Filters',
    content: 'If you click Contextualize, the search result count for this filter will be updated.',
    placement: 'right',
    route: { name: 'search' },
    clean: () => {
      store.commit('search/resetFilterValues')
      store.commit('search/decontextualizeFilter', 'language')
      // Close the filter when leaving
      querySelector('.filter[data-filter-name=language].filter--show .filter__header')?.click()
    },
    action: async () => {
      // Ensure the filter is open
      querySelector('.filter[data-filter-name=language]:not(filter--show) .filter__header')?.click()
      // Contextualized filter
      const label = await waitForElement('.filter[data-filter-name=language]:not(filter--contextualized) .filter__footer__action--contextualize .form-check-label')
      label.click()
    }
  },
  {
    selector: '.app-sidebar__container__menu__item:nth-child(3)',
    title: 'History',
    content: 'Lost in your searches? Browse your history here!',
    placement: 'right',
    route: { name: 'user-history' }
  }
])

const isFirst = computed(() => stepIndex.value === 0)
const isLast = computed(() => stepIndex.value === steps.value.length - 1)
const step = computed(() => steps.value[stepIndex.value])
const stepTarget = ref(null)
const stepIndex = ref(0)
const show = ref(false)


/**
 * Opens the popover and waits for the next tick.
 * @returns {Promise<void>}
 */
const openPopover = async () => { 
  show.value = true 
  await nextTick()
}

/**
 * Closes the popover and cleans up the current step if available.
 * @returns {Promise<void>}
 */
const closePopover = async () => { 
  show.value = false 
  await step.value?.clean?.()
}

/**
 * Renders the current step by executing the necessary actions.
 * @returns {Promise<void>}
 */
const renderStep = async () => {
  await step.value?.before?.()
  await router.push(step.value.route)
  stepTarget.value = await waitForStepTarget()
  await openPopover()
  await step.value?.action?.()
}

/**
 * Moves to the previous step.
 * @returns {Promise<void>}
 */
const onPrevious = async () => {
  await closePopover()
  stepIndex.value = Math.max(stepIndex.value - 1, 0)
  await step.value?.clean?.()
  await renderStep()
}

/**
 * Moves to the next step.
 * @returns {Promise<void>}
 */
const onNext = async () => {
  stepIndex.value = Math.min(stepIndex.value + 1, steps.value.length - 1)
  await closePopover()
  await renderStep()
}

/**
 * Finishes the tour by closing the popover and storing the state in local storage.
 * @returns {Promise<void>}
 */
const onFinish = async () => {
  await closePopover()
  show.value = false
  localStorage.setItem(STORAGE_NAME, "true")
}

/**
 * Returns the element with the specified selector within the "app" element.
 *
 * @param {string} selector - The CSS selector of the element to find.
 * @returns {Element|null} - The element with the specified selector, or null if not found.
 */
const querySelector = (selector) => {
  return document.getElementById("app").querySelector(selector)
}

/**
 * Waits for the element with the specified selector to be available within the "app" element.
 * Resolves the promise with the element once it is found.
 *
 * @param {string} selector - The CSS selector of the element to wait for.
 * @returns {Promise<Element>} - A promise that resolves with the element once it is found.
 */
const waitForElement = function(selector) {
  return new Promise(resolve => {
    const target = querySelector(selector)
    if (target) {
      return resolve(target)
    }

    const observer = new MutationObserver(() => {
      const target = querySelector(selector)
      if (target) {
        observer.disconnect()
        resolve(target)
      }
    })

    observer.observe(document.getElementById("app"), { childList: true, subtree: true })
  })
}

/**
 * Waits for the element specified in the "step.value.selector" property to be available within the "app" element.
 * Resolves the promise with the element once it is found.
 *
 * @returns {Promise<Element>} - A promise that resolves with the element once it is found.
 */
const waitForStepTarget = function() {
  return waitForElement(step.value.selector)
}

onMounted(async () => {
  if (isNull(localStorage.getItem(STORAGE_NAME))) {
    await renderStep()
  }
})
</script>


<style>
.tour-step {
  color: #fff;
  font-size: 1.1rem;
  width: 400px;
}
</style>
