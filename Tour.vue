<template>
  <div class="my-3">
    <div v-for="(step, index) in steps" :key="index">
      <b-popover :target="step.target" :placement="step.placement" ref="steps">
        <template v-slot:title>
          <span v-if="step.title" v-html="step.title"></span>
        </template>
        <div v-if="step.content" v-html="step.content" class="text-center"></div>
        <div class="mt-3 mb-1 text-center">
          <b-btn variant="outline-light" @click="onSkip" class="mr-1">
            Skip tour
          </b-btn>
          <b-btn variant="outline-light" @click="onPrevious" class="ml-1 mr-1" v-if="index !== 0">
            Previous
          </b-btn>
          <b-btn variant="outline-light" @click="onNext" class="ml-1">
            <span v-if="index === (steps.length - 1)">
              Finish
            </span>
            <span v-else>
              Next
            </span>
          </b-btn>
        </div>
      </b-popover>
    </div>
  </div>
</template>

<script>
import map from 'lodash/map'

export default {
  name: 'Tour',
  data () {
    return {
      steps: [],
      currentStep: -1,
      initialSteps: [{
        selector: '.project-cards__item:nth-child(1)',
        content: 'Enter a project like Luxleaks !',
        placement: 'bottom'
      }, {
        selector: '.search-layout-selector__button:nth-child(3)',
        content: 'Use different views: List, Grid and Table.',
        placement: 'bottomleft'
      }, {
        selector: '.filters-panel__sticky__toolbar__toggler',
        content: 'Want to better see your documents?<br>Hide the Menu and Filters columns to make room!',
        placement: 'right'
      }, {
        selector: '.filter:nth-child(7)',
        content: 'Contextualize your filters can be useful!<br>Open Languages and select German.',
        placement: 'right'
      }]
    }
  },
  methods: {
    async onPrevious () {
      this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', this.currentStep - 1)
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('open')
    },
    async onNext () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      if (this.currentStep === 0) {
        await new Promise(resolve => resolve(this.$router.push({ name: 'search', query: this.$store.getters['search/toRouteQuery']() })))
        this.updateSteps()
        await this.$nextTick()
      }
      await this.$set(this, 'currentStep', this.currentStep + 1)
      if (this.currentStep < this.$refs.steps.length) this.$refs.steps[this.currentStep].$emit('open')
    },
    async onSkip () {
      if (this.currentStep >= 0) this.$refs.steps[this.currentStep].$emit('close')
      await this.$set(this, 'currentStep', -1)
    },
    updateSteps () {
      map(this.initialSteps, step => {
        const element = document.querySelector(step.selector)
        if (element) {
          step.target = element
          this.steps.push(step)
        }
      })
    }
  },
  async mounted () {
    this.updateSteps()
    this.onNext()
  }
}
</script>
