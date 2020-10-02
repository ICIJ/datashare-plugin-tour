import Tour from './Tour'

document.addEventListener('datashare:ready', ({ detail }) => {
  detail.core.registerHook({
    target: 'app:after',
    definition: Tour
  })
}, false)
