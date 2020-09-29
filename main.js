import VueTour from 'vue-tour'

import Tour from './Tour'

import './node_modules/vue-tour/dist/vue-tour.css'

document.addEventListener('datashare:ready', ({ detail }) => {
  detail.core.use(VueTour)
  detail.core.registerHook({ target: 'app:after', definition: Tour })
}, false)
