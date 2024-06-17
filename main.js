import Tour from './Tour.vue'

document.addEventListener('datashare:ready', async ({ detail }) => {

  detail.core.registerHook({
    target: 'app:after',
    definition: Tour
  })

}, false)
