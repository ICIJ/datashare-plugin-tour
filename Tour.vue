<template>
  <v-tour name="myTour" :steps="steps"></v-tour>
</template>

<script>
export default {
  name: 'Tour',
  data () {
    return {
      steps: [
        {
          target: '.app-sidebar__container__menu__item:nth-child(1)',  // We're using document.querySelector() under the hood
          header: {
            title: 'First step',
          },
          content: 'Click here to search for documents'
        }
      ]
    }
  },
  mounted: function () {
    this.$tours['myTour'].start()
  }
}
</script>
