<template>
  <v-tour name="tour" :steps="steps" :callbacks="callbacks"></v-tour>
</template>

<script>
import get from 'lodash/get'

export default {
  name: 'Tour',
  data () {
    return {
      steps: [{
        target: '.project-cards__item:nth-child(1)',
        header: {
          title: 'First step',
        },
        content: 'Enter a project like the LuxLeaks!'
      }, {
        target: '.search-layout-selector__button:nth-child(3)',
        header: {
          title: 'Second step',
        },
        content: 'Use different views: List, Grid and Table'
      }],
      callbacks: {
        onNextStep: this.onNextStep
      }
    }
  },
  computed: {
    steps () {
      return get(this.allSteps, this.$route.name, [])
    }
  },
  methods: {
    onNextStep (currentStep) {
      if (currentStep === 0) this.$router.push({ name: 'search' })
    }
  },
  mounted () {
    this.$tours['tour'].start()
  }
}
</script>
