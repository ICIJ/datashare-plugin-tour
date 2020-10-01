import Step from './Step'

document.addEventListener('datashare:ready', ({ detail }) => {
  detail.core.registerHook({
    target: 'app:after',
    definition: Step
  })
}, false)
