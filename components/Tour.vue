<script setup>
import TourModal from '@/components/TourModal.vue'
import TourStep from '@/components/TourStep.vue'
import { useCore } from '@/composables/useCore'
import { useRouter } from '@/composables/useRouter'
import { useElementObserver } from '@/composables/useElementObserver'
import { useTourStore } from '@/stores/tour'

const { core } = useCore()
const { navigate, navigateToSearch, navigateToFirstSearchHit } = useRouter()
const { waitForElementCreated } = useElementObserver()
const tourStore = useTourStore()
const appStore = core.stores.useAppStore()
const searchStore = core.stores.useSearchStore()

tourStore.reset()

tourStore.defineStep({
  element: '.button-toggler-sidebar',
  scenario: 'project',
  before() {
    appStore.sidebar = { compact: true, closed: false }
  },
  popover: {
    title: 'Menu',
    placement: 'right',
    boundaryPadding: 16,
    offset: 16,
    description: 'Click here to open/hide the menu and navigate in Datashare.'
  }
})

tourStore.defineStep({
  element: '.app-sidebar__section--projects',
  scenario: 'project',
  before() {
    appStore.sidebar = { compact: false, closed: false }
  },
  popover: {
    title: 'Projects',
    placement: 'right',
    boundaryPadding: 16,
    offset: 16,
    description: ['Projects are groups of documents.', 'Pin a project to quickly find it here.']
  }
})

tourStore.defineStep({
  element: '.page-header-nav .button-toggle-settings',
  scenario: 'project',
  before: () => navigate({ name: 'project.list' }),
  popover: {
    title: 'Page settings',
    placement: 'left',
    boundaryPadding: 16,
    offset: 16,
    description: [
      'Change layout',
      'Switch sorting',
      'Configure items per page',
      'Select displayed properties',
      'And more!'
    ]
  }
})

tourStore.defineStep({
  element: '.app-sidebar-footer-links-entry a[href="#/settings/appearance"]',
  scenario: 'project',
  before: () => navigate({ name: 'project.list' }),
  highlight: {
    stagePadding: 8
  },
  popover: {
    title: 'Datashare settings',
    placement: 'top',
    boundaryPadding: 8,
    offset: 24,
    description: ['Switch to dark mode', 'Change language', 'Modify settings']
  }
})

tourStore.defineStep({
  element: '.app-sidebar__section--search .app-sidebar-section-entry',
  scenario: 'project',
  before() {
    appStore.sidebar = { compact: false, closed: false }
  },
  after: () => navigateToSearch(),
  highlight: {
    stagePadding: 8
  },
  nextLabel: 'Search',
  popover: {
    title: 'Search documents',
    placement: 'right',
    boundaryPadding: 16,
    offset: 24,
    description: 'From here, you can search for documents in your projects.'
  }
})

tourStore.defineStep({
  element: '.search__main__search-bar',
  scenario: 'search',
  async before({ element }) {
    await navigateToSearch()
    await waitForElementCreated(element)
  },
  popover: {
    title: 'Search bar',
    placement: 'bottom',
    boundaryPadding: 16,
    offset: 16,
    description: 'Use this bar to search for documents in your projects.'
  }
})

tourStore.defineStep({
  element: '.search .button-toggle-filters',
  scenario: 'search',
  async before({ element }) {
    appStore.filters.closed = true
    await navigateToSearch()
    await waitForElementCreated(element)
  },
  popover: {
    title: 'Filters',
    placement: 'bottom',
    boundaryPadding: 16,
    offset: 16,
    description: ['Paths', 'Creation date', 'Languages', 'File type', 'And much more']
  }
})

tourStore.defineStep({
  element: '.search .button-toggle-search-breadcrumb',
  scenario: 'search',
  async before() {
    appStore.filters.closed = true
    await navigateToSearch()
  },
  popover: {
    title: 'Your search',
    placement: 'bottom',
    boundaryPadding: 16,
    offset: 16,
    description: ['See your active queries and filters', 'Remove some queries and filters', 'Save your search']
  }
})

tourStore.defineStep({
  element: '.search .document-actions-group:first-of-type .document-actions-group-entry-expand',
  scenario: 'search',
  async before({ element }) {
    await navigateToSearch()
    await waitForElementCreated(element)
  },
  filter() {
    return searchStore.total > 0
  },
  popover: {
    title: 'Expand a document',
    boundaryPadding: 16,
    offset: 16,
    description: 'See a document in full screen view'
  }
})

tourStore.defineStep({
  element: '.document-view__header ~ .tab-group-navigation',
  scenario: 'search',
  async before({ element }) {
    await navigateToFirstSearchHit()
    await waitForElementCreated(element)
  },
  filter() {
    return searchStore.total > 0
  },
  highlight: {
    stagePadding: 2
  },
  popover: {
    title: 'Tabs',
    boundaryPadding: 16,
    offset: 16,
    description: 'Explore all the pieces of information of a document.'
  }
})

tourStore.defineStep({
  element: '.document-view__header .document-user-actions',
  scenario: 'search',
  async before({ element }) {
    await navigateToFirstSearchHit()
    await waitForElementCreated(element)
  },
  filter() {
    return searchStore.total > 0
  },
  popover: {
    title: 'Add your data',
    boundaryPadding: 16,
    offset: 16,
    description: 'Tag or recommend a document.'
  }
})

tourStore.defineStep({
  element: '.document-view__header .document-actions-group-entry-close',
  scenario: 'search',
  async before({ element }) {
    await navigateToFirstSearchHit()
    await waitForElementCreated(element)
  },
  filter() {
    return searchStore.total > 0
  },
  popover: {
    title: 'Close the document',
    boundaryPadding: 16,
    offset: 16,
    description: 'Click here or press Esc.'
  }
})

tourStore.defineStep({
  element: '.search-toolbar .button-toggle-settings',
  scenario: 'search',
  async before({ element }) {
    await navigateToSearch()
    await waitForElementCreated(element)
  },
  popover: {
    title: 'Page settings',
    boundaryPadding: 16,
    offset: 16,
    description: 'Change sorting, layout and much more.'
  }
})

tourStore.defineStep({
  element: '.search-settings__section--layout',
  scenario: 'search',
  async before({ element }) {
    await navigateToSearch()
    appStore.settings.closed = false
    await waitForElementCreated(element)
  },
  after() {
    appStore.settings.closed = true
  },
  nextLabel: 'Close',
  popover: {
    title: 'Layout and properties',
    boundaryPadding: 16,
    offset: 16,
    description: 'Switch between list, table and grid view or select displayed document properties.'
  }
})
</script>

<template>
  <tour-modal v-model="tourStore.showTourModal" @ok="tourStore.startTour('project')" @cancel="tourStore.endTour()" />
  <tour-step v-if="tourStore.currentStep" :key="tourStore.progress" :step="tourStore.currentStep" />
</template>

<style>
.driver-overlay {
  /* Bellow Bootstrap's popover z-index. This must be marked 
   * as !important because the value is an inline style. */
  z-index: 1060 !important;
}
</style>
