import Tour from '@/components/Tour.vue'
import TourStart from '@/components/TourStart.vue'

document.addEventListener(
  'datashare:ready',
  async ({ detail }) => {
    detail.core.registerHook({
      target: 'app:after',
      definition: Tour
    })

    detail.core.registerHook({
      target: 'app-sidebar-footer-links-entry:after',
      definition: TourStart
    })
  },
  false
)
