<template>
  <v-tour name="tour" :steps="steps"></v-tour>
</template>

<script>
import get from 'lodash/get'

export default {
  name: 'Tour',
  data () {
    return {
      allSteps: {
        landing: [{
          target: '.project-cards__item:nth-child(1)',
          header: {
            title: 'First step',
          },
          content: 'Enter a project like the LuxLeaks!'
        }],
        search: [{
          target: '.search-layout-selector__button:nth-child(3)',
          header: {
            title: 'Second step',
          },
          content: 'Use different views: List, Grid and Table'
        }, {
          target: '.filters-panel .filter:nth-child(6)',
          header: {
            title: 'Use filters',
          },
          content: 'To select language for example.'
        }]
      }
    }
  },
  computed: {
    steps () {
      return get(this.allSteps, this.$route.name, [])
    }
  },
  mounted () {
    this.$tours['tour'].start()
  }
}
</script>
