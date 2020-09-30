<template>
  <v-tour name="tour" :steps="steps"></v-tour>
</template>

<script>
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
        content: 'Use different views: List, Grid and Table',
        before: _ => new Promise(resolve => resolve(this.$router.push({ name: 'search' })))
      }]
    }
  },
  mounted () {
    this.$tours['tour'].start()
  }
}
</script>
